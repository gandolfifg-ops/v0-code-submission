import { CURATED_SCHOLARSHIPS } from "@/features/scholarships/data/curated"
import { resolveSchool } from "@/features/scholarships/schools"
import type { ScholarshipFilters, ScholarshipResult } from "@/features/scholarships/types"
import {
  applicationFormDisplayTitle,
  cleanDisplayText,
  dropApplicationFormsIfProgramPageExists,
  dropAggregatorScholarshipHitsIfOfficialExists,
  dedupeLiveScholarshipHits,
  evaluateScholarshipDeadlines,
  extractScholarshipAmount,
  isApplicationFormListing,
  isClosedOrArchivedListing,
  summarizeScholarshipSnippet,
} from "@/lib/liveResultText"
import { classifyScholarshipListing, prettyIssuerName } from "@/lib/listingDisplay"
import {
  compareScholarshipResults,
  guessSchoolDomains,
  isDepartmentOnlySchoolUrl,
  isSchoolAidHubUrl,
  mentionsSearchedSchool,
  nationalFoundationQueries,
  parseScholarshipCountry,
  schoolFocusedScholarshipQuery,
  schoolSearchName,
  shouldKeepScholarshipHit,
  shouldKeepSchoolKeywordHit,
  tavilyIncludeDomains,
  TAVILY_SCHOLARSHIP_EXCLUDE_DOMAINS,
} from "@/lib/scholarshipOfficialSources"

export const dynamic = "force-dynamic"
export const maxDuration = 30

type TavilyHit = {
  title?: string
  url?: string
  content?: string
  score?: number
  raw_content?: string
  rawContent?: string
}

function isValidHttpUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return parsed.protocol === "https:" || parsed.protocol === "http:"
  } catch {
    return false
  }
}

function formatCheckedToday(): string {
  return new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  })
}

function filterCurated(filters: ScholarshipFilters): ScholarshipResult[] {
  const isCanada = filters.country === "Canada"
  return CURATED_SCHOLARSHIPS.filter((item) => item.id.startsWith(isCanada ? "ca-" : "us-"))
}

function canonicalUrl(url: string): string {
  try {
    const parsed = new URL(url)
    parsed.hash = ""
    return parsed.href.replace(/\/$/, "")
  } catch {
    return url
  }
}

function majorMatchesDepartmentPage(major: string, url: string): boolean {
  if (!major || major === "Any major") return false
  try {
    const host = new URL(url).hostname.replace(/^www\./i, "").toLowerCase()
    const sub = host.split(".")[0] ?? ""
    const m = major.toLowerCase()
    if (m.includes("biology") && /bio/.test(sub)) return true
    if (m.includes("engineering") && /eng|smith/.test(sub)) return true
    if (m.includes("nursing") && /nurs/.test(sub)) return true
    if ((m.includes("computer") || m === "stem") && /^(cs|ece)$/.test(sub)) return true
    if (m.includes("business") && /business|commerce/.test(sub)) return true
    return false
  } catch {
    return false
  }
}

function dropDepartmentPagesWhenHubExists(
  hits: TavilyHit[],
  schoolDomains: string[],
  major: string,
): TavilyHit[] {
  const hasCentral = hits.some(
    (hit) =>
      hit.url &&
      isSchoolAidHubUrl(hit.url, schoolDomains) &&
      !isDepartmentOnlySchoolUrl(hit.url, schoolDomains),
  )
  return hits.filter((hit) => {
    if (!hit.url || !isDepartmentOnlySchoolUrl(hit.url, schoolDomains)) return true
    if (!hasCentral && majorMatchesDepartmentPage(major, hit.url)) return true
    if (hasCentral && majorMatchesDepartmentPage(major, hit.url)) return true
    return false
  })
}

async function tavilySearch(
  apiKey: string,
  query: string,
  maxResults = 6,
  includeDomains: string[] = [],
): Promise<TavilyHit[]> {
  const tavilyResponse = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: apiKey,
      query,
      search_depth: "advanced",
      exclude_domains: [...TAVILY_SCHOLARSHIP_EXCLUDE_DOMAINS],
      ...(includeDomains.length > 0 ? { include_domains: includeDomains } : {}),
      include_raw_content: true,
      max_results: maxResults,
    }),
  })
  if (!tavilyResponse.ok) return []
  const tavilyData = await tavilyResponse.json()
  return tavilyData.results ?? []
}

function mapLiveResults(
  hits: TavilyHit[],
  schoolDomains: string[] = [],
  searchedSchool = "",
  officialUrls: { officialAwardsUrl?: string; officialAidUrl?: string } = {},
  major = "Any major",
): ScholarshipResult[] {
  const seen = new Set<string>()
  const filtered = hits.filter((r) => {
    if (!r.url || !isValidHttpUrl(r.url)) return false
    if (r.url.includes("404") || r.url.includes("not-found")) return false
    if (typeof r.score === "number" && r.score < 0.3) return false
    const title = r.title ?? ""
    const content = `${r.content ?? ""} ${r.raw_content ?? r.rawContent ?? ""}`
    if (searchedSchool) {
      if (!shouldKeepSchoolKeywordHit(r.url, title, content, searchedSchool)) return false
    } else if (!shouldKeepScholarshipHit(r.url, title, searchedSchool)) {
      return false
    }
    const key = canonicalUrl(r.url)
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
  const ranked = dropDepartmentPagesWhenHubExists(
    filtered.sort((a, b) => compareScholarshipResults(a, b, schoolDomains, officialUrls)),
    schoolDomains,
    major,
  )
  const preferred = dropAggregatorScholarshipHitsIfOfficialExists(
    dedupeLiveScholarshipHits(dropApplicationFormsIfProgramPageExists(ranked)),
  )

  return preferred
    .map((r, i) => {
      const hostname = new URL(r.url!).hostname.replace(/^www\./, "")
      const content = r.content ?? ""
      const rawPage = r.raw_content ?? r.rawContent ?? ""
      const deadlineSource = [r.title ?? "", r.url, content, rawPage].filter(Boolean).join("\n")
      if (isClosedOrArchivedListing(deadlineSource, r.url!)) return null
      const { keep, deadline } = evaluateScholarshipDeadlines(deadlineSource)
      if (!keep) return null
      const isForm = isApplicationFormListing(r.title ?? "", content, r.url!)
      return {
        id: `live-${i}-${hostname}`,
        title: isForm
          ? applicationFormDisplayTitle(r.title ?? "")
          : cleanDisplayText(r.title ?? "Scholarship listing").slice(0, 100),
        provider: prettyIssuerName(r.url!),
        amount: extractScholarshipAmount(deadlineSource, r.url),
        deadline,
        lastChecked: formatCheckedToday(),
        eligibility: isForm
          ? "Official application form — open the site to apply"
          : summarizeScholarshipSnippet([content, rawPage.slice(0, 4000)].filter(Boolean).join("\n"), {
              url: r.url!,
              title: r.title ?? "",
              fallback: "See the official listing for eligibility details.",
            }),
        url: r.url!,
        source: "live" as const,
        listingKind: classifyScholarshipListing(r.url!),
      }
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)
}

function seededOfficialCards(
  school: NonNullable<ReturnType<typeof resolveSchool>>,
): ScholarshipResult[] {
  const checked = formatCheckedToday()
  const cards: ScholarshipResult[] = []
  const awards = school.links.find((link) => canonicalUrl(link.href) === canonicalUrl(school.officialAwardsUrl))
  cards.push({
    id: `seed-awards-${school.slug}`,
    title: awards?.title ?? `${school.name} student awards`,
    provider: prettyIssuerName(school.officialAwardsUrl, school.name),
    amount: "",
    deadline: "",
    lastChecked: checked,
    eligibility: awards?.summary ?? school.description,
    url: school.officialAwardsUrl,
    source: "curated",
    listingKind: classifyScholarshipListing(school.officialAwardsUrl),
  })
  if (school.officialAidUrl) {
    const aid = school.links.find((link) => canonicalUrl(link.href) === canonicalUrl(school.officialAidUrl ?? ""))
    cards.push({
      id: `seed-aid-${school.slug}`,
      title: aid?.title ?? `${school.region} student aid`,
      provider: prettyIssuerName(school.officialAidUrl, school.region),
      amount: "",
      deadline: "",
      lastChecked: checked,
      eligibility: aid?.summary ?? `Official government student aid for students at ${school.name}.`,
      url: school.officialAidUrl,
      source: "curated",
      listingKind: classifyScholarshipListing(school.officialAidUrl),
    })
  }
  const national = school.links.find((link) => link.id === "schulich" || link.id === "loran")
  if (national) {
    cards.push({
      id: `seed-national-${school.slug}-${national.id}`,
      title: national.title,
      provider: prettyIssuerName(national.href, national.title),
      amount: "",
      deadline: "",
      lastChecked: checked,
      eligibility: national.summary,
      url: national.href,
      source: "curated",
      listingKind: classifyScholarshipListing(national.href),
    })
  }
  return cards.slice(0, 4)
}

function seededCountryCards(country: ScholarshipFilters["country"]): ScholarshipResult[] {
  const checked = formatCheckedToday()
  if (country === "USA") {
    return [
      {
        id: "seed-us-aid",
        title: "Federal Student Aid scholarships",
        provider: "U.S. Department of Education",
        amount: "",
        deadline: "",
        lastChecked: checked,
        eligibility:
          "Official Federal Student Aid hub for scholarships, grants, and other aid. Confirm eligibility on StudentAid.gov.",
        url: "https://studentaid.gov/understand-aid/types/scholarships",
        source: "curated",
        listingKind: classifyScholarshipListing("https://studentaid.gov/understand-aid/types/scholarships"),
      },
      {
        id: "seed-us-fafsa",
        title: "FAFSA",
        provider: "U.S. Department of Education",
        amount: "",
        deadline: "",
        lastChecked: checked,
        eligibility: "Free Application for Federal Student Aid — the official starting point for U.S. federal aid.",
        url: "https://studentaid.gov/h/apply-for-aid/fafsa",
        source: "curated",
        listingKind: classifyScholarshipListing("https://studentaid.gov/h/apply-for-aid/fafsa"),
      },
    ]
  }
  return [
    {
      id: "seed-ca-aid",
      title: "Canada Student Grants and Loans",
      provider: "Government of Canada",
      amount: "",
      deadline: "",
      lastChecked: checked,
      eligibility:
        "Official Government of Canada student grants and loans. Apply through your province or territory.",
      url: "https://www.canada.ca/en/services/benefits/education/student-aid.html",
      source: "curated",
      listingKind: classifyScholarshipListing(
        "https://www.canada.ca/en/services/benefits/education/student-aid.html",
      ),
    },
    {
      id: "seed-ca-loran",
      title: "Loran Scholars Award",
      provider: "Loran Scholars Foundation",
      amount: "",
      deadline: "",
      lastChecked: checked,
      eligibility: "National undergraduate award for Canadian high school students with character, service, and leadership.",
      url: "https://loranscholar.ca/",
      source: "curated",
      listingKind: classifyScholarshipListing("https://loranscholar.ca/"),
    },
  ]
}

function mergeSeededAndLive(seeded: ScholarshipResult[], live: ScholarshipResult[]): ScholarshipResult[] {
  const seen = new Set(seeded.map((item) => canonicalUrl(item.url)))
  const extra = live.filter((item) => !seen.has(canonicalUrl(item.url)))
  return [...seeded, ...extra]
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  const university = typeof body?.university === "string" ? body.university : ""
  const registered = resolveSchool(university) ?? resolveSchool(typeof body?.query === "string" ? body.query : "")
  const country = registered?.country ?? parseScholarshipCountry(body?.country)
  const filters: ScholarshipFilters = {
    country,
    major: typeof body?.major === "string" ? body.major : "Any major",
    level: typeof body?.level === "string" ? body.level : "Any level",
    query: typeof body?.query === "string" ? body.query : "",
    university,
  }

  const apiKey = process.env.TAVILY_API_KEY?.trim()

  if (apiKey) {
    try {
      const schoolQuery = schoolFocusedScholarshipQuery(filters)
      const school = schoolSearchName(filters)
      const resolved = resolveSchool(school)
      const schoolDomains = school ? guessSchoolDomains(school) : []
      const includeDomains = tavilyIncludeDomains({
        country: filters.country,
        schoolDomains,
        namedSchool: Boolean(school && schoolDomains.length > 0),
      })
      const officialUrls = {
        officialAwardsUrl: resolved?.officialAwardsUrl,
        officialAidUrl: resolved?.officialAidUrl,
      }

      const searches: Promise<TavilyHit[]>[] = [tavilySearch(apiKey, schoolQuery, school ? 10 : 8, includeDomains)]
      if (!school) {
        for (const query of nationalFoundationQueries(filters.country)) {
          searches.push(tavilySearch(apiKey, query, 2, includeDomains))
        }
      }
      const hitSets = await Promise.all(searches)
      const liveHits = school
        ? hitSets.flat().filter((hit) => {
            if (!hit.url) return false
            const hostOk = schoolDomains.some((domain) => {
              try {
                const host = new URL(hit.url!).hostname.replace(/^www\./i, "").toLowerCase()
                return host === domain || host.endsWith(`.${domain}`)
              } catch {
                return false
              }
            })
            if (hostOk) return true
            if (shouldKeepScholarshipHit(hit.url, hit.title ?? "", school)) {
              if (/loran|schulich|horatio|terry fox|canada student/i.test(`${hit.title ?? ""} ${hit.url}`)) {
                return mentionsSearchedSchool(hit.url, hit.title ?? "", school)
              }
              return true
            }
            return false
          })
        : hitSets.flat()

      const live = mapLiveResults(liveHits, schoolDomains, school, officialUrls, filters.major)
      const seeded = resolved ? seededOfficialCards(resolved) : seededCountryCards(filters.country)
      const results = dropAggregatorScholarshipHitsIfOfficialExists(mergeSeededAndLive(seeded, live))

      if (results.length > 0) {
        return Response.json({
          source: live.length > 0 ? "live" : "curated",
          notice: school
            ? "These are live results from this school's aid pages and major national awards. Amounts and deadlines may be incomplete — always confirm on the official page."
            : "These are live results from university, government, and official foundation pages. Amounts and deadlines may be incomplete — always confirm on the official page.",
          results,
        })
      }
    } catch (error) {
      console.error("[scholarships] Live search failed:", error)
    }
  }

  const registeredFallback = resolveSchool(filters.university) ?? resolveSchool(filters.query)
  return Response.json({
    source: "curated",
    notice: apiKey
      ? "Live search didn’t find a match — here are official starting points."
      : "Showing official starting points.",
    results: registeredFallback
      ? dropAggregatorScholarshipHitsIfOfficialExists(
          mergeSeededAndLive(seededOfficialCards(registeredFallback), filterCurated(filters)),
        )
      : dropAggregatorScholarshipHitsIfOfficialExists(
          mergeSeededAndLive(seededCountryCards(filters.country), filterCurated(filters)),
        ),
  })
}
