/** Social platforms and scholarship aggregators — never treat as official listings. */
export const BLOCKED_SCHOLARSHIP_HOSTS = [
  "facebook.com",
  "fb.com",
  "twitter.com",
  "x.com",
  "instagram.com",
  "linkedin.com",
  "reddit.com",
  "pinterest.com",
  "tiktok.com",
  "youtube.com",
  "threads.net",
  "scholarships.com",
  "fastweb.com",
  "bold.org",
  "unigo.com",
  "niche.com",
  "goingmerry.com",
  "scholarshipowl.com",
  "cappex.com",
  "scholarshipscanada.com",
  "yconic.com",
  "petersons.com",
  "collegescholarships.org",
  "scholarships360.org",
  "collegeboard.org",
  "medium.com",
  "quora.com",
  "blogspot.com",
  "wordpress.com",
  "substack.com",
] as const

const KNOWN_UNIVERSITY_HOSTS: Record<string, string[]> = {
  toronto: ["utoronto.ca"],
  utoronto: ["utoronto.ca"],
  mcgill: ["mcgill.ca"],
  ubc: ["ubc.ca"],
  britishcolumbia: ["ubc.ca"],
  waterloo: ["uwaterloo.ca"],
  york: ["yorku.ca"],
  western: ["uwo.ca"],
  queens: ["queensu.ca"],
  ottawa: ["uottawa.ca"],
  alberta: ["ualberta.ca"],
  calgary: ["ucalgary.ca"],
  sfu: ["sfu.ca"],
  simonfraser: ["sfu.ca"],
  dalhousie: ["dal.ca"],
  mcmaster: ["mcmaster.ca"],
  carleton: ["carleton.ca"],
  concordia: ["concordia.ca"],
  laval: ["ulaval.ca"],
  montreal: ["umontreal.ca"],
  harvard: ["harvard.edu"],
  stanford: ["stanford.edu"],
  mit: ["mit.edu"],
  yale: ["yale.edu"],
  princeton: ["princeton.edu"],
}

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

export function isBlockedScholarshipHost(hostname: string): boolean {
  const host = hostname.replace(/^www\./i, "").toLowerCase()
  return BLOCKED_SCHOLARSHIP_HOSTS.some((blocked) => hostMatches(host, blocked))
}

function isOfficialEducationOrGovHost(hostname: string): boolean {
  const host = hostname.replace(/^www\./i, "").toLowerCase()
  if (host.endsWith(".edu") || host.endsWith(".gov") || host.endsWith(".mil")) return true
  if (host === "canada.ca" || host.endsWith(".canada.ca") || host.endsWith(".gc.ca")) return true
  if (host.endsWith(".ca") && !isBlockedScholarshipHost(host)) return true
  return false
}

/** True only for official education/government hosts that are not social or aggregator sites. */
export function isOfficialScholarshipUrl(url: string): boolean {
  const host = hostnameOf(url)
  if (!host) return false
  if (isBlockedScholarshipHost(host)) return false
  return isOfficialEducationOrGovHost(host)
}

export function guessUniversityHosts(university: string): string[] {
  const name = university.toLowerCase().replace(/[^a-z0-9\s]/g, " ")
  const hosts = new Set<string>()
  for (const [key, list] of Object.entries(KNOWN_UNIVERSITY_HOSTS)) {
    if (name.includes(key)) {
      for (const host of list) hosts.add(host)
    }
  }
  const compact = name
    .replace(/\b(university|universite|université|college|of|the|at)\b/g, "")
    .replace(/\s+/g, "")
  if (compact.length >= 3 && compact.length <= 40) {
    hosts.add(`${compact}.ca`)
    hosts.add(`${compact}.edu`)
  }
  return [...hosts]
}

export function officialScholarshipSiteQuery(university: string, country: "Canada" | "USA"): string {
  const sites = ["site:.edu", "site:.gov", "site:.gc.ca"]
  if (country === "Canada") sites.push("site:.ca")
  for (const host of guessUniversityHosts(university)) {
    sites.push(`site:${host}`)
  }
  return `(${sites.join(" OR ")})`
}

export const TAVILY_SCHOLARSHIP_EXCLUDE_DOMAINS = [...BLOCKED_SCHOLARSHIP_HOSTS]
