import { describe, expect, it } from "vitest"
import { resolveSchool, SCHOOL_PAGES } from "@/features/scholarships/schools"
import {
  extractScholarshipAmount,
  isClosedOrArchivedListing,
  isDroppedLoanHit,
  summarizeScholarshipSnippet,
} from "@/lib/liveResultText"
import {
  compareScholarshipResults,
  guessSchoolDomains,
  isWeakScholarshipListing,
  schoolSearchName,
  shouldKeepScholarshipHit,
  shouldKeepSchoolKeywordHit,
} from "@/lib/scholarshipOfficialSources"
import { assertSchoolPageSlugs, schoolPageSlugs, SCHOOL_SLUG_PATTERN } from "@/scripts/smoke-slugs"

describe("resolveSchool Queen's University", () => {
  it("maps to slug queens with queensu.ca and not queens.edu", () => {
    const school = resolveSchool("Queen's University")
    expect(school).not.toBeNull()
    expect(school!.slug).toBe("queens")
    expect(school!.domains).toContain("queensu.ca")
    expect(school!.domains).not.toContain("queens.edu")
    expect(school!.rejectDomains).toContain("queens.edu")
  })
})

describe("shouldKeepSchoolKeywordHit", () => {
  it("drops Queens University of Charlotte for a Queen's search", () => {
    const charlotteUrl = "https://www.queens.edu/afford"
    expect(shouldKeepSchoolKeywordHit(charlotteUrl, "Queens University of Charlotte", "", "Queen's University")).toBe(
      false,
    )
  })
})

describe("extractScholarshipAmount", () => {
  it("does not treat tuition / cost of attendance as an award", () => {
    const tuitionParagraph =
      "Undergraduate tuition for 2026–27 is $12,447. The comprehensive fee and room and board bring the cost of attendance to $28,000 per year."
    const amount = extractScholarshipAmount(tuitionParagraph)
    expect(amount === "Varies" || amount === "").toBe(true)
  })

  it("does not treat Canada Gazette regulatory figures as an award", () => {
    const gazette =
      "REGULATORY IMPACT ANALYSIS STATEMENT (This statement is not part of the Regulations.) Executive summary Issues: Affordability remains a key issue for students as they face rising post-secondary education costs. The estimated cost is $101,797."
    const amount = extractScholarshipAmount(
      gazette,
      "https://gazette.gc.ca/rp-pr/p2/2026/2026-07-01/html/sor-dors139-eng.html",
    )
    expect(amount).toBe("")
  })

  it("keeps a real grant amount near award wording", () => {
    const amount = extractScholarshipAmount(
      "Until the end of the 2026 to 2027 school year, you could receive a Canada Student Grant of up to $4,200 per year.",
      "https://www.canada.ca/en/services/benefits/education/student-aid/grants-loans/full-time.html",
    )
    expect(amount).toContain("4,200")
  })
})

describe("summarizeScholarshipSnippet", () => {
  it("strips Canada.ca language-selection chrome", () => {
    const snippet = summarizeScholarshipSnippet(
      "Language selection Search Menu You are here: Canada Student Grants help eligible students with the cost of post-secondary education.",
    )
    expect(snippet.toLowerCase()).not.toContain("language selection")
  })
})

describe("isClosedOrArchivedListing", () => {
  it("drops past-year scholar cohort pages", () => {
    expect(
      isClosedOrArchivedListing(
        "2024 Loran Scholars - Loran Scholars",
        "https://loranscholar.ca/2024-loran-scholars",
      ),
    ).toBe(true)
  })

  it("keeps pages that mention the current cycle", () => {
    expect(
      isClosedOrArchivedListing(
        "Apply for the 2026–2027 Loran Award",
        "https://loranscholar.ca/apply",
      ),
    ).toBe(false)
  })
})

describe("official school ranking", () => {
  it("puts queensu.ca financial aid first and excludes queens.edu", () => {
    const searchedSchool = "Queen's University"
    const domains = guessSchoolDomains(searchedSchool)
    const hits = [
      { url: "https://biology.queensu.ca/", title: "Biology department", content: "" },
      { url: "https://www.queens.edu/afford", title: "Queens University of Charlotte", content: "" },
      { url: "https://www.queensu.ca/financialaid", title: "Queen's financial aid", content: "" },
    ]
    const official = hits
      .filter((hit) => shouldKeepSchoolKeywordHit(hit.url, hit.title, hit.content, searchedSchool))
      .sort((a, b) => compareScholarshipResults(a, b, domains))

    expect(official.length).toBeGreaterThan(0)
    expect(official[0].url).toContain("queensu.ca")
    expect(official[0].url.toLowerCase()).toMatch(/financial[-_]?aid/)
    expect(official.some((hit) => /queens\.edu/i.test(hit.url))).toBe(false)
  })
})

describe("schoolSearchName", () => {
  it("does not treat an empty school field as a named school", () => {
    expect(schoolSearchName({ university: "", query: "Indigenous" })).toBe("")
    expect(schoolSearchName({ university: "  ", query: "Engineering" })).toBe("")
  })

  it("uses the school field when the user typed one", () => {
    expect(schoolSearchName({ university: "Queen's University", query: "" })).toBe("Queen's University")
  })
})

describe("weak scholarship listings", () => {
  it("drops Canada Gazette and ScholarshipsCanada directory pages", () => {
    expect(
      isWeakScholarshipListing(
        "https://gazette.gc.ca/rp-pr/p2/2026/2026-07-01/html/sor-dors139-eng.html",
        "Regulations Amending the Canada Student Financial Assistance Regulations",
      ),
    ).toBe(true)
    expect(
      shouldKeepScholarshipHit(
        "https://alis.alberta.ca/explore-education-and-training/scholarshipscanada",
        "ScholarshipsCanada - Find Scholarships",
      ),
    ).toBe(false)
  })

  it("keeps official Canada Student Grant pages", () => {
    expect(
      shouldKeepScholarshipHit(
        "https://www.canada.ca/en/services/benefits/education/student-aid/grants-loans/full-time.html",
        "Canada Student Grant for Full-Time Students",
      ),
    ).toBe(true)
  })
})

describe("loan hit filter", () => {
  it("drops wikipedia, /node, and /blog/best-rates", () => {
    expect(isDroppedLoanHit("https://en.wikipedia.org/wiki/Student_loan", "Student loan")).toBe(true)
    expect(isDroppedLoanHit("https://www.example.com/node/123", "Loan program")).toBe(true)
    expect(isDroppedLoanHit("https://www.example.com/blog/best-rates", "Best student loan rates")).toBe(true)
  })
})

describe("rateLimit", () => {
  it("allows then blocks within the window", async () => {
    const { rateLimit } = await import("@/lib/rateLimit")
    const key = `test-${Date.now()}-${Math.random()}`
    expect(rateLimit(key, { limit: 2, windowMs: 60_000 }).ok).toBe(true)
    expect(rateLimit(key, { limit: 2, windowMs: 60_000 }).ok).toBe(true)
    expect(rateLimit(key, { limit: 2, windowMs: 60_000 }).ok).toBe(false)
  })
})

describe("SCHOOL_PAGES slugs", () => {
  it("are lowercase hyphenated tokens", () => {
    assertSchoolPageSlugs()
    for (const slug of schoolPageSlugs()) {
      expect(slug).toMatch(SCHOOL_SLUG_PATTERN)
    }
  })

  it("have https official award URLs and domains", () => {
    expect(SCHOOL_PAGES.length).toBeGreaterThanOrEqual(24)
    for (const school of SCHOOL_PAGES) {
      expect(school.officialAwardsUrl).toMatch(/^https:\/\//)
      expect(() => new URL(school.officialAwardsUrl)).not.toThrow()
      if (school.officialAidUrl) {
        expect(school.officialAidUrl).toMatch(/^https:\/\//)
      }
      expect(school.domains.length).toBeGreaterThan(0)
      for (const link of school.links) {
        expect(link.href).toMatch(/^https:\/\//)
      }
    }
  })
})
