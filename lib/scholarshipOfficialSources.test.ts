import { describe, expect, it } from "vitest"
import { resolveSchool } from "@/features/scholarships/schools"
import { extractScholarshipAmount, isDroppedLoanHit, summarizeScholarshipSnippet } from "@/lib/liveResultText"
import {
  compareScholarshipResults,
  guessSchoolDomains,
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
})

describe("summarizeScholarshipSnippet", () => {
  it("strips Canada.ca language-selection chrome", () => {
    const snippet = summarizeScholarshipSnippet(
      "Language selection Search Menu You are here: Canada Student Grants help eligible students with the cost of post-secondary education.",
    )
    expect(snippet.toLowerCase()).not.toContain("language selection")
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

describe("loan hit filter", () => {
  it("drops wikipedia, /node, and /blog/best-rates", () => {
    expect(isDroppedLoanHit("https://en.wikipedia.org/wiki/Student_loan", "Student loan")).toBe(true)
    expect(isDroppedLoanHit("https://www.example.com/node/123", "Loan program")).toBe(true)
    expect(isDroppedLoanHit("https://www.example.com/blog/best-rates", "Best student loan rates")).toBe(true)
  })
})

describe("SCHOOL_PAGES slugs", () => {
  it("are lowercase hyphenated tokens", () => {
    assertSchoolPageSlugs()
    for (const slug of schoolPageSlugs()) {
      expect(slug).toMatch(SCHOOL_SLUG_PATTERN)
    }
  })
})
