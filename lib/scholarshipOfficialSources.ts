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
] as const

/** Social + aggregator hosts for Tavily `exclude_domains` and URL post-filtering. */
export const TAVILY_SCHOLARSHIP_EXCLUDE_DOMAINS = [...SOCIAL_DOMAINS, ...AGGREGATOR_DOMAINS]

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

export function schoolFocusedScholarshipQuery(filters: {
  country: string
  major: string
  level: string
  query: string
  university: string
}): string {
  return [
    "scholarship bursary 2026 apply",
    filters.country,
    filters.major !== "Any major" ? filters.major : "",
    filters.level !== "Any level" ? filters.level : "",
    filters.query.trim(),
    universitySearchTerms(filters.university) ?? "",
  ]
    .filter(Boolean)
    .join(" ")
}

export function nationalAwardsScholarshipQuery(filters: {
  country: string
  major: string
  level: string
}): string {
  const levelLabel = filters.level !== "Any level" ? filters.level : "post-secondary"
  const named =
    filters.country === "Canada"
      ? "Loran Scholars Schulich Leader Scholarships TD Scholarships for Community Leadership Terry Fox Humanitarian Award Government of Canada awards"
      : "Coca-Cola Scholars Gates Scholarship Jack Kent Cooke National Merit federal scholarships"
  const major = filters.major !== "Any major" ? filters.major : ""
  return [
    `Major national scholarships for ${levelLabel} students in ${filters.country}`,
    major,
    named,
    "2026 apply",
  ]
    .filter(Boolean)
    .join(" ")
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

/** Lower is better: education/government TLDs before generic .com/.org. */
export function officialSourceRank(url: string): number {
  const host = hostnameOf(url)
  if (!host) return 99
  if (host.endsWith(".gc.ca") || host.endsWith(".edu") || host.endsWith(".gov")) return 0
  if (host.endsWith(".ca")) return 1
  return 2
}

export function compareScholarshipResults(
  a: { url?: string; score?: number },
  b: { url?: string; score?: number },
): number {
  const rank = officialSourceRank(a.url ?? "") - officialSourceRank(b.url ?? "")
  if (rank !== 0) return rank
  return (b.score ?? 0) - (a.score ?? 0)
}
