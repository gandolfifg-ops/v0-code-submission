const SOCIAL_DOMAINS = [
  "facebook.com",
  "instagram.com",
  "twitter.com",
  "x.com",
  "linkedin.com",
  "pinterest.com",
  "reddit.com",
  "tiktok.com",
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

export function resolveSchoolHint(university: string): SchoolHint | null {
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
  const hint = resolveSchoolHint(school)
  const hosts = new Set<string>()
  if (hint) hosts.add(hint.domain)
  const compact = school
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\b(university|universite|université|college|institute|state|of|the|at)\b/g, "")
    .replace(/\s+/g, "")
  if (compact.length >= 3 && compact.length <= 40) {
    hosts.add(`${compact}.edu`)
    hosts.add(`${compact}.ca`)
  }
  const first = school
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .find((word) => word.length >= 4 && !/^(university|college|state|institute)$/.test(word))
  if (first) {
    hosts.add(`${first}.edu`)
    hosts.add(`${first}.ca`)
  }
  return [...hosts]
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
    return /financial[-_]?aid|admissions|scholarship|merit|student[-_]?aid/.test(path)
  } catch {
    return false
  }
}

export function isOfficialSchoolPortalUrl(url: string, schoolDomains: string[] = []): boolean {
  const host = hostnameOf(url)
  if (!host || schoolDomains.length === 0) return false
  return schoolDomains.some((domain) => hostMatches(host, domain))
}

const NATIONAL_AWARD_HINT =
  /\bloran\b|schulich leader|canada student grant|canada student grants|td scholarships for community|terry fox humanitarian|horatio alger|vanier canada/i

export function isNationalAwardHit(url: string, title: string, content: string): boolean {
  const host = hostnameOf(url)
  if (host && isFoundationHost(host)) return true
  return NATIONAL_AWARD_HINT.test(`${title} ${content}`)
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

function schoolNameTokens(name: string): string[] {
  return name
    .toLowerCase()
    .replace(/['’]/g, "")
    .split(/\s+/)
    .map((part) => part.trim())
    .filter((part) => part.length >= 4 && !/^(university|college|institute|state)$/.test(part))
}

export function isRivalSchoolHit(
  url: string,
  title: string,
  content: string,
  searchedSchool: string,
): boolean {
  if (!searchedSchool.trim()) return false
  if (isNationalAwardHit(url, title, content)) return false
  const host = hostnameOf(url)
  const searchedDomains = guessSchoolDomains(searchedSchool)
  if (host && searchedDomains.some((domain) => hostMatches(host, domain))) return false

  const haystack = `${title} ${url} ${content.slice(0, 800)}`.toLowerCase()
  const searchedHint = resolveSchoolHint(searchedSchool)
  const searchedLabel = (searchedHint?.name ?? searchedSchool).toLowerCase()
  const mentionsSearched =
    haystack.includes(searchedLabel) ||
    schoolNameTokens(searchedHint?.name ?? searchedSchool).some((token) => haystack.includes(token))

  for (const row of SCHOOL_HINTS) {
    const other = row.hint
    const isSameSchool =
      searchedHint?.domain === other.domain ||
      searchedDomains.includes(other.domain) ||
      searchedLabel === other.name.toLowerCase()
    if (isSameSchool) continue
    if (host && hostMatches(host, other.domain)) return true
    const otherTokens = schoolNameTokens(other.name)
    const mentionsOther =
      haystack.includes(other.name.toLowerCase()) ||
      otherTokens.some((token) => new RegExp(`\\b${token}\\b`, "i").test(title))
    if (mentionsOther && !mentionsSearched) return true
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
  if (isScholarshipListicle(title, url)) return false
  if (isCirnacOrPolicyExplainer(url, title, content)) return false
  if (searchedSchool && isRivalSchoolHit(url, title, content, searchedSchool)) return false
  return isOfficialScholarshipDestination(url)
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

function isFoundationHost(hostname: string): boolean {
  return OFFICIAL_FOUNDATION_HOSTS.some((domain) => hostMatches(hostname, domain))
}

/** Official university/government/foundation pages only — not generic .com blogs. */
export function isOfficialScholarshipDestination(url: string): boolean {
  const host = hostnameOf(url)
  if (!host || isBlockedScholarshipUrl(url)) return false
  if (isFoundationHost(host)) return true
  if (host.endsWith(".edu") || host.endsWith(".gov") || host.endsWith(".gc.ca")) return true
  if (host.endsWith(".ca")) return true
  return false
}

export function shouldKeepScholarshipHit(url: string, title = ""): boolean {
  if (isBlockedScholarshipUrl(url)) return false
  if (isScholarshipListicle(title, url)) return false
  return isOfficialScholarshipDestination(url)
}

/** Lower is better: education/government TLDs before generic .com/.org. */
export function officialSourceRank(url: string): number {
  const host = hostnameOf(url)
  if (!host) return 99
  if (host.endsWith(".gc.ca") || host.endsWith(".edu") || host.endsWith(".gov")) return 0
  if (isFoundationHost(host)) return 0
  if (host.endsWith(".ca")) return 1
  return 2
}

export function compareScholarshipResults(
  a: { url?: string; score?: number },
  b: { url?: string; score?: number },
  schoolDomains: string[] = [],
): number {
  const aidA = isSchoolAidHubUrl(a.url ?? "", schoolDomains) ? 0 : 1
  const aidB = isSchoolAidHubUrl(b.url ?? "", schoolDomains) ? 0 : 1
  if (aidA !== aidB) return aidA - aidB
  const schoolA = isOfficialSchoolPortalUrl(a.url ?? "", schoolDomains) ? 0 : 1
  const schoolB = isOfficialSchoolPortalUrl(b.url ?? "", schoolDomains) ? 0 : 1
  if (schoolA !== schoolB) return schoolA - schoolB
  const rank = officialSourceRank(a.url ?? "") - officialSourceRank(b.url ?? "")
  if (rank !== 0) return rank
  return (b.score ?? 0) - (a.score ?? 0)
}
