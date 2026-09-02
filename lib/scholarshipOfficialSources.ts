/** Social hosts to skip in Tavily (`exclude_domains`) and in URL post-filtering. */
export const TAVILY_SCHOLARSHIP_EXCLUDE_DOMAINS = [
  "facebook.com",
  "instagram.com",
  "twitter.com",
  "x.com",
  "linkedin.com",
  "pinterest.com",
  "reddit.com",
  "tiktok.com",
] as const

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

/** True when the URL is a social/spam host that should be discarded. */
export function isSocialScholarshipUrl(url: string): boolean {
  const host = hostnameOf(url)
  if (!host) return true
  return TAVILY_SCHOLARSHIP_EXCLUDE_DOMAINS.some((blocked) => hostMatches(host, blocked))
}
