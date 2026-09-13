import { isGovernmentLoanHost } from "@/features/loans/data/official"
import type { LoanListingKind, LoanResult } from "@/features/loans/types"
import { SCHOOL_PAGES } from "@/features/scholarships/schools"
import type { ScholarshipListingKind, ScholarshipResult } from "@/features/scholarships/types"
import { isFoundationHost, isGovernmentHost } from "@/lib/scholarshipOfficialSources"

export type { LoanListingKind }

function hostnameOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./i, "").toLowerCase()
  } catch {
    return ""
  }
}

function hostMatches(hostname: string, domain: string): boolean {
  const d = domain.replace(/^www\./i, "").toLowerCase()
  return hostname === d || hostname.endsWith(`.${d}`)
}

/** Longest domain first so csnpe-nslsc.canada.ca wins over canada.ca. */
const ISSUER_NAMES: { domain: string; name: string }[] = [
  { domain: "csnpe-nslsc.canada.ca", name: "National Student Loans Service Centre" },
  { domain: "studentaid.alberta.ca", name: "Alberta Student Aid" },
  { domain: "coca-colascholarsfoundation.org", name: "Coca-Cola Scholars Foundation" },
  { domain: "thegatesscholarship.org", name: "Gates Scholarship" },
  { domain: "studentaid.gov", name: "U.S. Department of Education" },
  { domain: "fafsa.gov", name: "U.S. Department of Education" },
  { domain: "benefits.gov", name: "U.S. government benefits" },
  { domain: "ed.gov", name: "U.S. Department of Education" },
  { domain: "studentaidbc.ca", name: "StudentAid BC" },
  { domain: "loranscholar.ca", name: "Loran Scholars Foundation" },
  { domain: "schulichleaders.com", name: "Schulich Foundation" },
  { domain: "horatioalger.org", name: "Horatio Alger Association" },
  { domain: "horatioalger.ca", name: "Horatio Alger Association of Canada" },
  { domain: "terryfoxawards.ca", name: "Terry Fox Humanitarian Award" },
  { domain: "terryfox.org", name: "Terry Fox Foundation" },
  { domain: "nationalmerit.org", name: "National Merit Scholarship Corporation" },
  { domain: "indspire.ca", name: "Indspire" },
  { domain: "univcan.ca", name: "Universities Canada" },
  { domain: "jkcf.org", name: "Jack Kent Cooke Foundation" },
  { domain: "uncf.org", name: "United Negro College Fund" },
  { domain: "ontario.ca", name: "Government of Ontario" },
  { domain: "quebec.ca", name: "Government of Quebec" },
  { domain: "alberta.ca", name: "Government of Alberta" },
  { domain: "saskatchewan.ca", name: "Government of Saskatchewan" },
  { domain: "novascotia.ca", name: "Government of Nova Scotia" },
  { domain: "canada.ca", name: "Government of Canada" },
  { domain: "gc.ca", name: "Government of Canada" },
  { domain: "rbcroyalbank.com", name: "RBC" },
  { domain: "rbc.com", name: "RBC" },
  { domain: "scotiabank.com", name: "Scotiabank" },
  { domain: "tangerine.ca", name: "Tangerine" },
  { domain: "capitalone.com", name: "Capital One" },
  { domain: "bankofamerica.com", name: "Bank of America" },
  { domain: "salliemae.com", name: "Sallie Mae" },
  { domain: "lightstream.com", name: "LightStream" },
  { domain: "discover.com", name: "Discover" },
  { domain: "cibc.com", name: "CIBC" },
  { domain: "bmo.com", name: "BMO" },
  { domain: "td.com", name: "TD" },
  { domain: "sofi.com", name: "SoFi" },
  { domain: "earnest.com", name: "Earnest" },
  { domain: "upstart.com", name: "Upstart" },
].sort((a, b) => b.domain.length - a.domain.length)

const BANK_HOSTS = [
  "rbcroyalbank.com",
  "rbc.com",
  "td.com",
  "scotiabank.com",
  "bmo.com",
  "cibc.com",
  "tangerine.ca",
  "capitalone.com",
  "discover.com",
  "bankofamerica.com",
  "chase.com",
  "wellsfargo.com",
] as const

const PRIVATE_LENDER_HOSTS = [
  "sofi.com",
  "earnest.com",
  "salliemae.com",
  "upstart.com",
  "lightstream.com",
] as const

const LOAN_ARTICLE_PATH = /\/learn\/|\/advice\/|\/education\/|\/resources\/|\/guide\/|\/blog\/|\/news\/|\/article\//i

function titleCaseLabel(raw: string): string {
  return raw
    .split(/[-_]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ")
}

function registrableLabel(host: string): string {
  const parts = host.split(".")
  if (parts.length >= 3 && parts[parts.length - 2] === "canada" && parts[parts.length - 1] === "ca") {
    return parts[parts.length - 3] ?? host
  }
  if (parts.length >= 2) return parts[parts.length - 2] ?? host
  return host
}

export function hostInSchoolRegistry(url: string): boolean {
  return Boolean(registrySchoolForUrl(url))
}

export function registrySchoolForUrl(url: string) {
  const host = hostnameOf(url)
  if (!host) return null
  return (
    SCHOOL_PAGES.find((school) => school.domains.some((domain) => hostMatches(host, domain))) ?? null
  )
}

export function prettyIssuerName(url: string, fallback = ""): string {
  const host = hostnameOf(url)
  if (!host) return fallback.trim()

  for (const row of ISSUER_NAMES) {
    if (hostMatches(host, row.domain)) return row.name
  }

  const school = registrySchoolForUrl(url)
  if (school) return school.name

  if (isFoundationHost(host)) return titleCaseLabel(registrableLabel(host))
  if (isGovernmentHost(host) || host.endsWith(".gc.ca") || host.endsWith(".gov")) {
    if (host.endsWith(".gov")) return "U.S. government"
    return "Government of Canada"
  }

  const label = titleCaseLabel(registrableLabel(host))
  if (label && !/^(Www|Http|Https)$/i.test(label)) return label
  return fallback.trim() || label
}

export function classifyScholarshipListing(url: string): ScholarshipListingKind {
  const host = hostnameOf(url)
  if (!host) return "listing"
  if (hostInSchoolRegistry(url)) return "official-school"
  if (isGovernmentHost(host) || host.endsWith(".gc.ca") || host.endsWith(".gov")) return "government"
  if (isFoundationHost(host)) return "foundation"
  return "listing"
}

/** Official school badge only when the host is in the school registry. */
export function scholarshipCardBadge(
  url: string,
  listingKind?: ScholarshipListingKind | "active",
): ScholarshipListingKind {
  if (listingKind === "official-school" && !hostInSchoolRegistry(url)) {
    const fromUrl = classifyScholarshipListing(url)
    return fromUrl === "official-school" ? "listing" : fromUrl
  }
  const fromUrl = classifyScholarshipListing(url)
  if (fromUrl !== "listing") return fromUrl
  if (listingKind === "government" || listingKind === "foundation") return listingKind
  return "listing"
}

export function scholarshipResultGroup(
  result: Pick<ScholarshipResult, "url" | "listingKind">,
): "official-school" | "government" | "other" {
  const badge = scholarshipCardBadge(result.url, result.listingKind)
  if (badge === "official-school") return "official-school"
  if (badge === "government") return "government"
  return "other"
}

export function classifyLoanListing(url: string): LoanListingKind {
  const host = hostnameOf(url)
  if (host && isGovernmentLoanHost(host)) return "government"
  if (host && BANK_HOSTS.some((domain) => hostMatches(host, domain))) return "bank"
  if (LOAN_ARTICLE_PATH.test(url)) return "article"
  if (host && PRIVATE_LENDER_HOSTS.some((domain) => hostMatches(host, domain))) return "private-lender"
  if (/\/apply|student-loan|personal-loan|auto-loan|car-loans/i.test(url)) return "private-lender"
  return "article"
}

export function loanCardKind(lender: Pick<LoanResult, "href" | "listingKind">): LoanListingKind {
  return lender.listingKind ?? classifyLoanListing(lender.href)
}
