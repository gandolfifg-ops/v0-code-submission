import { resolveSchool } from "@/features/scholarships/schools"
import type { ScholarshipCountry } from "@/features/scholarships/types"

const SOCIAL_DOMAINS = [
  "facebook.com",
  "instagram.com",
  "twitter.com",
  "x.com",
  "linkedin.com",
  "pinterest.com",
  "reddit.com",
  "tiktok.com",
  "quora.com",
] as const

const AGGREGATOR_DOMAINS = [
  "medium.com",
  "wordpress.com",
  "blogspot.com",
  "substack.com",
  "studygreen.com",
  "fundmycourse.com",
  "scholarship-positions.com",
  "worldscholarshipforum.com",
  "fastweb.com",
  "bold.org",
  "niche.com",
  "scholarships.com",
  "scholarship-portal.com",
  "grantme.ca",
  "scholarships360.org",
  "unigo.com",
  "goingmerry.com",
  "scholarshipowl.com",
  "cappex.com",
  "immigrationnewscanada.ca",
  "yconic.com",
  "scholarshipscanada.com",
  "wikipedia.org",
  "slideplayer.com",
  "scribd.com",
  "chegg.com",
] as const

/** Social + aggregator hosts for Tavily `exclude_domains` and URL post-filtering. */
export const TAVILY_SCHOLARSHIP_EXCLUDE_DOMAINS = [...SOCIAL_DOMAINS, ...AGGREGATOR_DOMAINS]

const OFFICIAL_FOUNDATION_HOSTS = [
  "loranscholar.ca",
  "schulichleaders.com",
  "horatioalger.ca",
  "horatioalger.org",
  "terryfox.org",
  "terryfoxawards.ca",
  "indspire.ca",
  "univcan.ca",
  "coca-colascholarsfoundation.org",
  "thegatesscholarship.org",
  "jkcf.org",
  "nationalmerit.org",
] as const

const LISTICLE_TITLE = /\b(top\s*\d+|best scholarships|list of|guide to|how to apply)\b/i
const LISTICLE_URL =
  /\/blog\/|\/article\/|\/news\/|top[-_]?\d+|best[-_]?scholarships|list[-_]?of|guide[-_]?to/i

export function isScholarshipListicle(title: string, url: string): boolean {
  if (LISTICLE_TITLE.test(title)) return true
  if (LISTICLE_URL.test(url.toLowerCase())) return true
  return false
}

type SchoolHint = { name: string; domain: string }

const SCHOOL_HINTS: { match: RegExp; hint: SchoolHint }[] = [
  { match: /\b(u\s*of\s*t|uoft|university of toronto|utoronto)\b/i, hint: { name: "University of Toronto", domain: "utoronto.ca" } },
  { match: /\b(mcgill)\b/i, hint: { name: "McGill University", domain: "mcgill.ca" } },
  { match: /\b(ubc|university of british columbia)\b/i, hint: { name: "University of British Columbia", domain: "ubc.ca" } },
  { match: /\b(u\s*of\s*w|uwaterloo|university of waterloo)\b/i, hint: { name: "University of Waterloo", domain: "uwaterloo.ca" } },
  { match: /\b(yorku?|york university)\b/i, hint: { name: "York University", domain: "yorku.ca" } },
  { match: /\b(western|uwo)\b/i, hint: { name: "Western University", domain: "uwo.ca" } },
  { match: /\b(queen'?s|queensu)\b/i, hint: { name: "Queen's University", domain: "queensu.ca" } },
  { match: /\b(uottawa|university of ottawa)\b/i, hint: { name: "University of Ottawa", domain: "uottawa.ca" } },
  { match: /\b(ualberta|university of alberta)\b/i, hint: { name: "University of Alberta", domain: "ualberta.ca" } },
  { match: /\b(ucalgary|university of calgary)\b/i, hint: { name: "University of Calgary", domain: "ucalgary.ca" } },
  { match: /\b(sfu|simon fraser)\b/i, hint: { name: "Simon Fraser University", domain: "sfu.ca" } },
  { match: /\b(mcmaster)\b/i, hint: { name: "McMaster University", domain: "mcmaster.ca" } },
  { match: /\b(carleton)\b/i, hint: { name: "Carleton University", domain: "carleton.ca" } },
  { match: /\b(concordia)\b/i, hint: { name: "Concordia University", domain: "concordia.ca" } },
  { match: /\b(dalhousie|dal\.ca)\b/i, hint: { name: "Dalhousie University", domain: "dal.ca" } },
  { match: /\b(northeastern)\b/i, hint: { name: "Northeastern University", domain: "northeastern.edu" } },
  { match: /\b(harvard)\b/i, hint: { name: "Harvard University", domain: "harvard.edu" } },
  { match: /\b(ucla)\b/i, hint: { name: "UCLA", domain: "ucla.edu" } },
  { match: /\b(stanford)\b/i, hint: { name: "Stanford University", domain: "stanford.edu" } },
  { match: /\b(uc berkeley|berkeley)\b/i, hint: { name: "UC Berkeley", domain: "berkeley.edu" } },
  { match: /\b(umich|university of michigan)\b/i, hint: { name: "University of Michigan", domain: "umich.edu" } },
  { match: /\b(nyu|new york university)\b/i, hint: { name: "New York University", domain: "nyu.edu" } },
  { match: /\b(usc|university of southern california)\b/i, hint: { name: "University of Southern California", domain: "usc.edu" } },
  { match: /\b(ut austin|utexas|university of texas at austin)\b/i, hint: { name: "University of Texas at Austin", domain: "utexas.edu" } },
  { match: /\b(uiuc|university of illinois)\b/i, hint: { name: "University of Illinois Urbana-Champaign", domain: "illinois.edu" } },
  { match: /\b(university of washington|uw seattle)\b/i, hint: { name: "University of Washington", domain: "washington.edu" } },
  { match: /\b(upenn|university of pennsylvania)\b/i, hint: { name: "University of Pennsylvania", domain: "upenn.edu" } },
  { match: /\b(columbia university|columbia college)\b/i, hint: { name: "Columbia University", domain: "columbia.edu" } },
  { match: /\b(guelph|uoguelph|university of guelph)\b/i, hint: { name: "University of Guelph", domain: "uoguelph.ca" } },
  { match: /\b(ontario tech|ontariotechu|uoit)\b/i, hint: { name: "Ontario Tech University", domain: "ontariotechu.ca" } },
  { match: /\b(george brown)\b/i, hint: { name: "George Brown College", domain: "georgebrown.ca" } },
]

function hostnameOf(url: string): string | null {
  try {
    return new URL(url).hostname.replace(/^www\./i, "").toLowerCase()
  } catch {
    return null
  }
}

function hostMatches(hostname: string, domain: string): boolean {
  const d = domain.replace(/^www\./i, "").toLowerCase()
  return hostname === d || hostname.endsWith(`.${d}`)
}

const CANADA_GOVERNMENT_DOMAINS = [
  "canada.ca",
  "gc.ca",
  "ontario.ca",
  "quebec.ca",
  "studentaidbc.ca",
  "gov.bc.ca",
  "alberta.ca",
  "gov.ab.ca",
  "gov.mb.ca",
  "gov.sk.ca",
  "novascotia.ca",
  "gnb.ca",
  "gov.nl.ca",
  "princeedwardisland.ca",
  "yukon.ca",
  "gov.nt.ca",
  "gov.nu.ca",
] as const

const USA_GOVERNMENT_DOMAINS = ["studentaid.gov", "ed.gov", "fafsa.gov", "benefits.gov"] as const

const CONFUSABLE_SCHOOLS: { test: RegExp; allow: string[]; reject: string[] }[] = [
  { test: /queen/i, allow: ["queensu.ca"], reject: ["queens.edu"] },
  { test: /\byork\b/i, allow: ["yorku.ca"], reject: ["york.edu", "york.ac.uk"] },
  { test: /\bwestern\b/i, allow: ["uwo.ca", "westernu.ca"], reject: ["western.edu"] },
  { test: /\b(upenn|university of pennsylvania|\bpenn\b)/i, allow: ["upenn.edu"], reject: ["penn.edu"] },
  { test: /mcdonald|trinity|st\.?\s*mary/i, allow: [], reject: [] },
]

export function parseScholarshipCountry(input: unknown): ScholarshipCountry {
  const text = String(input ?? "")
    .trim()
    .toLowerCase()
    .replace(/\./g, "")
  if (!text) return "Canada"
  if (
    text === "usa" ||
    text === "us" ||
    text === "united states" ||
    text === "united states of america" ||
    text === "america"
  ) {
    return "USA"
  }
  if (text === "canada" || text === "ca" || text === "can") return "Canada"
  return "Canada"
}

export function governmentDomainsForCountry(country: ScholarshipCountry): string[] {
  return country === "USA" ? [...USA_GOVERNMENT_DOMAINS] : [...CANADA_GOVERNMENT_DOMAINS]
}

export function officialFoundationDomains(): string[] {
  return [...OFFICIAL_FOUNDATION_HOSTS]
}

export function tavilyIncludeDomains(opts: {
  country: ScholarshipCountry
  schoolDomains: string[]
  namedSchool: boolean
}): string[] {
  const gov = governmentDomainsForCountry(opts.country)
  if (opts.namedSchool && opts.schoolDomains.length > 0) {
    return [...new Set([...opts.schoolDomains, ...gov])]
  }
  return [...new Set([...gov, ...OFFICIAL_FOUNDATION_HOSTS])]
}

export function resolveSchoolHint(university: string): SchoolHint | null {
  const registered = resolveSchool(university)
  if (registered) {
    return { name: registered.searchName, domain: registered.domains[0] ?? "" }
  }
  const text = university.trim()
  if (!text) return null
  for (const row of SCHOOL_HINTS) {
    if (row.match.test(text)) return row.hint
  }
  return null
}

/** Extra Tavily terms when the user named a school — no site: TLD operators. */
export function universitySearchTerms(university: string): string | null {
  const text = university.trim()
  if (!text) return null
  const hint = resolveSchoolHint(text)
  if (hint) {
    return `${hint.name} ${hint.domain} official scholarship awards`
  }
  return `${text} official scholarship awards`
}

export function guessSchoolDomains(school: string): string[] {
  const registered = resolveSchool(school)
  if (registered) return [...registered.domains]
  const hint = resolveSchoolHint(school)
  if (hint?.domain) return [hint.domain]
  return []
}

export function rejectedDomainsForSchool(school: string): string[] {
  const registered = resolveSchool(school)
  const rejected = new Set<string>(registered?.rejectDomains ?? [])
  for (const row of CONFUSABLE_SCHOOLS) {
    if (row.test.test(school)) {
      for (const domain of row.reject) rejected.add(domain)
    }
  }
  return [...rejected]
}

export function displaySchoolName(school: string): string {
  return resolveSchoolHint(school)?.name ?? school.trim()
}

export function schoolSearchName(filters: {
  query: string
  university: string
}): string {
  if (filters.university.trim()) return filters.university.trim()
  const q = filters.query.trim()
  if (!q) return ""
  if (resolveSchoolHint(q) || /\b(university|college|institute)\b/i.test(q)) return q
  return ""
}

export function schoolFocusedScholarshipQuery(filters: {
  country: string
  major: string
  level: string
  query: string
  university: string
}): string {
  const school = schoolSearchName(filters)
  const keywords = [
    filters.university.trim() ? filters.query.trim() : "",
    filters.major !== "Any major" ? filters.major : "",
  ]
    .filter(Boolean)
    .join(" ")

  if (school) {
    const name = displaySchoolName(school)
    return [`"${name}" scholarships financial aid awards`, keywords, "2026 2027"]
      .filter(Boolean)
      .join(" ")
      .replace(/\s+/g, " ")
      .trim()
  }
  if (filters.query.trim()) {
    return [filters.query.trim(), "scholarships awards", filters.country, "2026 2027"]
      .filter(Boolean)
      .join(" ")
  }
  return [
    "scholarships financial aid awards 2026 2027",
    filters.country,
    filters.major !== "Any major" ? filters.major : "",
    filters.level !== "Any level" ? filters.level : "",
  ]
    .filter(Boolean)
    .join(" ")
}

export function isSchoolAidHubUrl(url: string, schoolDomains: string[]): boolean {
  try {
    const parsed = new URL(url)
    const host = parsed.hostname.replace(/^www\./i, "").toLowerCase()
    const path = `${host}${parsed.pathname}`.toLowerCase()
    const onSchool = schoolDomains.some((domain) => hostMatches(host, domain))
    if (!onSchool) return false
    if (isDepartmentOnlySchoolUrl(url, schoolDomains)) return false
    return /financial[-_]?aid|registrar|safa|scholarship|bursar|student[-_]?aid|student[-_]?award|merit/.test(
      path,
    )
  } catch {
    return false
  }
}

export function isRejectedSchoolHost(url: string, searchedSchool: string): boolean {
  const host = hostnameOf(url)
  if (!host) return true
  return rejectedDomainsForSchool(searchedSchool).some((domain) => hostMatches(host, domain))
}

const CENTRAL_SUBDOMAINS =
  /^(www|students|student|registrar|safa|admissions|financialaid|awards|studentawards|my|future)$/i

const DEPARTMENT_OR_CAMPUS_SUBDOMAINS =
  /^(biology|bio|engineering|eng|arts|science|med|medicine|nursing|law|business|commerce|math|physics|chem|chemistry|psychology|history|english|cs|ece|mech|smith|utsc|utm|utsg|ubco|ok)$/i

export function isDepartmentOnlySchoolUrl(url: string, schoolDomains: string[] = []): boolean {
  try {
    const parsed = new URL(url)
    const host = parsed.hostname.replace(/^www\./i, "").toLowerCase()
    const onSchool = schoolDomains.length === 0 || schoolDomains.some((domain) => hostMatches(host, domain))
    if (!onSchool) return false
    const labels = host.split(".")
    const sub = labels[0] ?? ""
    if (CENTRAL_SUBDOMAINS.test(sub)) return false
    if (schoolDomains.some((domain) => host === domain.replace(/^www\./i, "").toLowerCase())) return false
    if (DEPARTMENT_OR_CAMPUS_SUBDOMAINS.test(sub)) return true
    if (/\/(department|departments|faculty|faculties)(\/|$)/i.test(parsed.pathname)) return true
    return false
  } catch {
    return false
  }
}

function hostnameHasSchoolToken(host: string, school: string): boolean {
  const tokens = school
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length >= 5 && !/^(university|college|institute|school|state)$/.test(word))
  if (tokens.length === 0) return false
  return tokens.some((token) => host.includes(token))
}

export function isOfficialSchoolPortalUrl(url: string, schoolDomains: string[] = [], searchedSchool = ""): boolean {
  const host = hostnameOf(url)
  if (!host) return false
  if (searchedSchool && isRejectedSchoolHost(url, searchedSchool)) return false
  if (schoolDomains.length > 0) {
    return schoolDomains.some((domain) => hostMatches(host, domain))
  }
  if (searchedSchool) {
    for (const row of CONFUSABLE_SCHOOLS) {
      if (!row.test.test(searchedSchool)) continue
      if (row.allow.length === 0) return false
      return row.allow.some((domain) => hostMatches(host, domain))
    }
    if (!hostnameHasSchoolToken(host, searchedSchool)) return false
  }
  return false
}

export function mentionsSearchedSchool(url: string, title: string, searchedSchool: string): boolean {
  if (!searchedSchool.trim()) return false
  const blob = `${title} ${url}`.toLowerCase()
  const registered = resolveSchool(searchedSchool)
  const names = [
    searchedSchool,
    registered?.name,
    registered?.searchName,
    ...(registered?.aliases ?? []),
  ]
    .filter(Boolean)
    .map((value) => String(value).toLowerCase())
  if (names.some((name) => name.length >= 4 && blob.includes(name))) return true
  const host = hostnameOf(url)
  if (host && guessSchoolDomains(searchedSchool).some((domain) => hostMatches(host, domain))) return true
  return false
}

const NATIONAL_AWARD_HINT =
  /\bloran\b|schulich leader|canada student grant|canada student grants|td scholarships for community|terry fox humanitarian|horatio alger|vanier canada/i

const GENERIC_SCHOOL_TITLE_HIT = /^(western|york)$/i

function isSameSearchedSchool(other: SchoolHint, searchedSchool: string): boolean {
  const searchedHint = resolveSchoolHint(searchedSchool)
  const searchedDomains = guessSchoolDomains(searchedSchool)
  const searchedLabel = (searchedHint?.name ?? searchedSchool).toLowerCase()
  return (
    searchedHint?.domain === other.domain ||
    searchedDomains.includes(other.domain) ||
    searchedLabel === other.name.toLowerCase()
  )
}

/** Title clearly names a different university than the one the user searched. */
export function titleNamesOtherSchool(title: string, searchedSchool: string): boolean {
  const text = title.trim()
  if (!text || !searchedSchool.trim()) return false
  for (const row of SCHOOL_HINTS) {
    if (isSameSearchedSchool(row.hint, searchedSchool)) continue
    if (text.toLowerCase().includes(row.hint.name.toLowerCase())) return true
    const matched = text.match(row.match)
    if (!matched) continue
    const hit = matched[0].replace(/\s+/g, " ").trim()
    if (GENERIC_SCHOOL_TITLE_HIT.test(hit) && !/\b(university|college|institute|université)\b/i.test(text)) {
      continue
    }
    return true
  }
  return false
}

export function isNationalAwardHit(url: string, title: string, _content = ""): boolean {
  const host = hostnameOf(url)
  if (host && isFoundationHost(host)) return true
  if (host && (host === "canada.ca" || host.endsWith(".canada.ca")) && /student\s+grant|student\s+aid|student\s+loan/i.test(`${title} ${url}`)) {
    return true
  }
  return NATIONAL_AWARD_HINT.test(title) || NATIONAL_AWARD_HINT.test(url)
}

export function isCirnacOrPolicyExplainer(url: string, title: string, content: string): boolean {
  const host = hostnameOf(url) ?? ""
  const blob = `${title} ${content}`.toLowerCase()
  const cirnacHost = /cirnac|rcaanc/.test(host) || /cirnac|rcaanc/.test(url.toLowerCase())
  const hasAwardList = /apply|application|deadline|bursar|scholarship|award list|how to apply|eligibility/.test(blob)
  if (cirnacHost && !hasAwardList) return true
  if (cirnacHost && /policy|mandate|about us|what we do/.test(blob) && !hasAwardList) return true
  return false
}

export function isRivalSchoolHit(
  url: string,
  title: string,
  content: string,
  searchedSchool: string,
): boolean {
  if (!searchedSchool.trim()) return false
  if (titleNamesOtherSchool(title, searchedSchool)) return true

  const national = isNationalAwardHit(url, title, content)
  if (national) return false

  const host = hostnameOf(url)
  const searchedDomains = guessSchoolDomains(searchedSchool)
  if (host && searchedDomains.some((domain) => hostMatches(host, domain))) return false

  for (const row of SCHOOL_HINTS) {
    if (isSameSearchedSchool(row.hint, searchedSchool)) continue
    if (host && hostMatches(host, row.hint.domain)) return true
  }
  return false
}

export function shouldKeepSchoolKeywordHit(
  url: string,
  title: string,
  content: string,
  searchedSchool: string,
): boolean {
  if (isBlockedScholarshipUrl(url)) return false
  if (searchedSchool && isRejectedSchoolHost(url, searchedSchool)) return false
  const registered = resolveSchool(searchedSchool)
  if (registered?.rejectTitlePatterns?.some((pattern) => new RegExp(pattern, "i").test(title))) {
    return false
  }
  if (isScholarshipListicle(title, url)) return false
  if (isCirnacOrPolicyExplainer(url, title, content)) return false
  if (searchedSchool && isRivalSchoolHit(url, title, content, searchedSchool)) return false
  if (isFoundationHost(hostnameOf(url) ?? "") && !mentionsSearchedSchool(url, title, searchedSchool)) {
    return false
  }
  return isOfficialScholarshipDestination(url, searchedSchool)
}

/** Named foundations only — never “major national scholarships in Canada”. */
export function nationalFoundationQueries(country: string): string[] {
  if (country === "USA") {
    return [
      "Horatio Alger Scholarship official horatioalger.org",
      "Coca-Cola Scholars Foundation official",
      "Gates Scholarship official thegatesscholarship.org",
    ]
  }
  return [
    "Loran Scholars Foundation official loranscholar.ca",
    "Schulich Leader Scholarships official schulichleaders.com",
    "Canada Student Grants official canada.ca",
    "TD Scholarships for Community Leadership official",
    "Terry Fox Humanitarian Award official",
    "Horatio Alger Scholarship official Canada",
  ]
}

/** Drop social and known aggregator hosts (hostname match or hostname substring in the URL). */
export function isBlockedScholarshipUrl(url: string): boolean {
  const lower = url.toLowerCase()
  const host = hostnameOf(url)
  if (!host) return true
  return TAVILY_SCHOLARSHIP_EXCLUDE_DOMAINS.some((blocked) => {
    return hostMatches(host, blocked) || lower.includes(blocked)
  })
}

export function isGovernmentHost(hostname: string): boolean {
  return (
    CANADA_GOVERNMENT_DOMAINS.some((domain) => hostMatches(hostname, domain)) ||
    USA_GOVERNMENT_DOMAINS.some((domain) => hostMatches(hostname, domain))
  )
}

export function isFoundationHost(hostname: string): boolean {
  return OFFICIAL_FOUNDATION_HOSTS.some((domain) => hostMatches(hostname, domain))
}

/** Official university/government/foundation pages only — not generic .com blogs or random .ca sites. */
export function isOfficialScholarshipDestination(url: string, searchedSchool = ""): boolean {
  const host = hostnameOf(url)
  if (!host || isBlockedScholarshipUrl(url)) return false
  if (searchedSchool && isRejectedSchoolHost(url, searchedSchool)) return false
  if (isFoundationHost(host)) return true
  if (isGovernmentHost(host) || host.endsWith(".gov") || host.endsWith(".gc.ca")) return true
  const schoolDomains = searchedSchool ? guessSchoolDomains(searchedSchool) : []
  if (schoolDomains.some((domain) => hostMatches(host, domain))) return true
  if (searchedSchool && isOfficialSchoolPortalUrl(url, schoolDomains, searchedSchool)) return true
  return false
}

export function shouldKeepScholarshipHit(url: string, title = "", searchedSchool = ""): boolean {
  if (isBlockedScholarshipUrl(url)) return false
  if (isScholarshipListicle(title, url)) return false
  return isOfficialScholarshipDestination(url, searchedSchool)
}

/** Lower is better: education/government TLDs before generic .com/.org. */
export function officialSourceRank(url: string): number {
  const host = hostnameOf(url)
  if (!host) return 99
  if (host.endsWith(".gc.ca") || host.endsWith(".gov")) return 1
  if (isGovernmentHost(host)) return 1
  if (isFoundationHost(host)) return 2
  if (host.endsWith(".edu")) return 3
  return 4
}

/** Lower is better: award/aid paths above newsroom and press releases. */
export function awardListingPathRank(url: string): number {
  try {
    const path = new URL(url).pathname.toLowerCase()
    const isAid =
      /(^|\/)awards(\/|$)/.test(path) ||
      /(^|\/)scholarships(\/|$)/.test(path) ||
      /(^|\/)financial[-_]?aid(\/|$)/.test(path) ||
      /(^|\/)bursar/.test(path) ||
      /(^|\/)registrar(\/|$)/.test(path) ||
      /(^|\/)safa(\/|$)/.test(path)
    const isNews = /(^|\/)newsroom(\/|$)|(^|\/)press-releases?(\/|$)/.test(path)
    if (isAid) return 0
    if (isNews) return 2
    return 1
  } catch {
    return 1
  }
}

function sameUrl(a: string, b: string): boolean {
  try {
    const left = new URL(a)
    const right = new URL(b)
    return (
      left.hostname.replace(/^www\./i, "").toLowerCase() ===
        right.hostname.replace(/^www\./i, "").toLowerCase() &&
      left.pathname.replace(/\/+$/, "") === right.pathname.replace(/\/+$/, "")
    )
  } catch {
    return a.replace(/\/+$/, "") === b.replace(/\/+$/, "")
  }
}

export function compareScholarshipResults(
  a: { url?: string; score?: number },
  b: { url?: string; score?: number },
  schoolDomains: string[] = [],
  opts: { officialAwardsUrl?: string; officialAidUrl?: string } = {},
): number {
  const urlA = a.url ?? ""
  const urlB = b.url ?? ""
  const awardsA = opts.officialAwardsUrl && sameUrl(urlA, opts.officialAwardsUrl) ? 0 : 1
  const awardsB = opts.officialAwardsUrl && sameUrl(urlB, opts.officialAwardsUrl) ? 0 : 1
  if (awardsA !== awardsB) return awardsA - awardsB
  const aidA = opts.officialAidUrl && sameUrl(urlA, opts.officialAidUrl) ? 0 : 1
  const aidB = opts.officialAidUrl && sameUrl(urlB, opts.officialAidUrl) ? 0 : 1
  if (aidA !== aidB) return aidA - aidB
  const hubA = isSchoolAidHubUrl(urlA, schoolDomains) ? 0 : 1
  const hubB = isSchoolAidHubUrl(urlB, schoolDomains) ? 0 : 1
  if (hubA !== hubB) return hubA - hubB
  const deptA = isDepartmentOnlySchoolUrl(urlA, schoolDomains) ? 1 : 0
  const deptB = isDepartmentOnlySchoolUrl(urlB, schoolDomains) ? 1 : 0
  if (deptA !== deptB) return deptA - deptB
  const pathA = awardListingPathRank(urlA)
  const pathB = awardListingPathRank(urlB)
  if (pathA !== pathB) return pathA - pathB
  const schoolA = isOfficialSchoolPortalUrl(urlA, schoolDomains) ? 0 : 1
  const schoolB = isOfficialSchoolPortalUrl(urlB, schoolDomains) ? 0 : 1
  if (schoolA !== schoolB) return schoolA - schoolB
  const govA = isGovernmentHost(hostnameOf(urlA) ?? "") ? 0 : 1
  const govB = isGovernmentHost(hostnameOf(urlB) ?? "") ? 0 : 1
  if (govA !== govB) return govA - govB
  const rank = officialSourceRank(urlA) - officialSourceRank(urlB)
  if (rank !== 0) return rank
  return (b.score ?? 0) - (a.score ?? 0)
}
