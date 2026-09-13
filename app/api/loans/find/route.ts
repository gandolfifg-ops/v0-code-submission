import {
  officialLoanSeeds,
  isGovernmentLoanHost,
  TAVILY_LOAN_EXCLUDE_DOMAINS,
  tavilyLoanIncludeDomains,
} from "@/features/loans/data/official"
import { parseLoanCountry, type LoanResult, type LoanType } from "@/features/loans/types"
import { classifyLoanListing, prettyIssuerName } from "@/lib/listingDisplay"
import {
  cleanDisplayText,
  dropApplicationFormsIfProgramPageExists,
  extractLoanAdvertisedRate,
  isApplicationFormListing,
  isDroppedLoanHit,
  summarizeLiveSnippet,
} from "@/lib/liveResultText"

export const dynamic = "force-dynamic"
export const maxDuration = 30

type TavilyHit = {
  title?: string
  url?: string
  content?: string
  score?: number
}

function isValidHttpUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return parsed.protocol === "https:" || parsed.protocol === "http:"
  } catch {
    return false
  }
}

function parseType(value: unknown): LoanType {
  if (value === "Personal" || value === "Auto") return value
  return "Student"
}

function hostnameOf(url: string): string | null {
  try {
    return new URL(url).hostname.replace(/^www\./i, "").toLowerCase()
  } catch {
    return null
  }
}

function registrableDomain(url: string): string {
  const host = hostnameOf(url)
  if (!host) return url.toLowerCase()
  const parts = host.split(".")
  if (parts.length <= 2) return host
  if (parts[parts.length - 2] === "canada" && parts[parts.length - 1] === "ca") {
    return parts.slice(-3).join(".")
  }
  return parts.slice(-2).join(".")
}

function isBlockedLoanHost(url: string): boolean {
  const host = hostnameOf(url)
  if (!host) return true
  return TAVILY_LOAN_EXCLUDE_DOMAINS.some(
    (blocked) => host === blocked || host.endsWith(`.${blocked}`),
  )
}

function isAdviceArticle(url: string): boolean {
  const path = url.toLowerCase()
  return /\/learn\/|\/advice\/|\/education\/|\/resources\/|\/guide\//.test(path)
}

function isApplyOrAidPath(url: string): boolean {
  const path = url.toLowerCase()
  return /\/apply|fafsa|osap|grants-loans|student-aid|student-loans|personal-loan|auto-loan|car-loans/.test(
    path,
  )
}

function loanHitRank(url: string): number {
  const host = hostnameOf(url) ?? ""
  if (isGovernmentLoanHost(host) && isApplyOrAidPath(url)) return 0
  if (isGovernmentLoanHost(host)) return 1
  if (isApplyOrAidPath(url) && !isAdviceArticle(url)) return 2
  if (isAdviceArticle(url)) return 5
  return 3
}

function urlQuality(url: string): number {
  let n = 0
  if (/\/node(\/|$)/i.test(url)) n += 8
  if (/index\.php/i.test(url)) n += 3
  try {
    n += new URL(url).pathname.length / 40
  } catch {
    n += url.length / 80
  }
  return n
}

function pickBetterHit(a: TavilyHit, b: TavilyHit): TavilyHit {
  const rank = loanHitRank(a.url ?? "") - loanHitRank(b.url ?? "")
  if (rank !== 0) return rank < 0 ? a : b
  return urlQuality(a.url ?? "") <= urlQuality(b.url ?? "") ? a : b
}

function dedupeLoanHitsByDomain(hits: TavilyHit[]): TavilyHit[] {
  const byDomain = new Map<string, TavilyHit>()
  for (const hit of hits) {
    if (!hit.url) continue
    const key = registrableDomain(hit.url)
    const prev = byDomain.get(key)
    byDomain.set(key, prev ? pickBetterHit(prev, hit) : hit)
  }
  return hits.filter((hit) => hit.url && byDomain.get(registrableDomain(hit.url)) === hit)
}

function canonicalUrl(url: string): string {
  try {
    const parsed = new URL(url)
    parsed.hash = ""
    return parsed.href.replace(/\/$/, "")
  } catch {
    return url.replace(/\/$/, "")
  }
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  const country = parseLoanCountry(body?.country)
  const loanType = parseType(body?.loanType)
  const amount = typeof body?.amount === "string" ? body.amount.trim() : ""
  const query = typeof body?.query === "string" ? body.query.trim() : ""
  const seeds = officialLoanSeeds(country, loanType)

  const apiKey = process.env.TAVILY_API_KEY?.trim()
  const searchQuery = [
    country === "Canada" ? "Canada" : "United States",
    query || `${loanType} loan official apply`,
    query ? "official government lender" : "official apply",
    amount ? `${amount} dollars` : "",
  ]
    .filter(Boolean)
    .join(" ")

  let live: LoanResult[] = []

  if (apiKey) {
    try {
      const tavilyResponse = await fetch("https://api.tavily.com/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          api_key: apiKey,
          query: searchQuery,
          search_depth: "advanced",
          include_domains: tavilyLoanIncludeDomains(country, loanType),
          exclude_domains: [...TAVILY_LOAN_EXCLUDE_DOMAINS],
          max_results: 8,
        }),
      })

      if (tavilyResponse.ok) {
        const tavilyData = await tavilyResponse.json()
        const seedHosts = new Set(seeds.map((item) => registrableDomain(item.href)))
        const seedUrls = new Set(seeds.map((item) => canonicalUrl(item.href)))
        const filtered = dropApplicationFormsIfProgramPageExists(
          (tavilyData.results ?? []).filter((r: TavilyHit) => {
            if (!r.url || !isValidHttpUrl(r.url)) return false
            if (r.url.includes("404") || r.url.includes("not-found")) return false
            if (typeof r.score === "number" && r.score < 0.3) return false
            if (isBlockedLoanHost(r.url)) return false
            if (isDroppedLoanHit(r.url, r.title ?? "")) return false
            if (seedUrls.has(canonicalUrl(r.url))) return false
            return true
          }),
        ).sort((a: TavilyHit, b: TavilyHit) => loanHitRank(a.url ?? "") - loanHitRank(b.url ?? ""))

        const unique = dedupeLoanHitsByDomain(filtered).filter((hit) => {
          if (!hit.url) return false
          return !seedHosts.has(registrableDomain(hit.url))
        })

        live = unique.map((r: TavilyHit, i: number) => {
          const hostname = hostnameOf(r.url!) ?? "lender"
          const content = r.content ?? ""
          const isForm = isApplicationFormListing(r.title ?? "", content, r.url!)
          const issuer = prettyIssuerName(r.url!)
          return {
            id: `live-${loanType}-${i}-${hostname}`,
            name: isForm
              ? "Official application form"
              : cleanDisplayText(r.title ?? issuer).slice(0, 90),
            country,
            loanType,
            tagline: issuer,
            advertisedRate: extractLoanAdvertisedRate(`${r.title ?? ""}\n${content}`, r.url),
            highlight: isForm
              ? "Official application form — open the site to apply"
              : summarizeLiveSnippet(content, {
                  url: r.url!,
                  title: r.title ?? "",
                  fallback: "Open the official page for current terms.",
                }),
            href: r.url!,
            cta: "Open official page",
            source: "live" as const,
            listingKind: classifyLoanListing(r.url!),
          }
        })
      }
    } catch (error) {
      console.error("[loans] Live search failed:", error)
    }
  }

  const results = [...seeds, ...live]
  return Response.json({
    source: live.length > 0 ? "live" : "curated",
    notice:
      live.length > 0
        ? "Official government and lender pages first. Any APR shown was taken from that same official page and is not a personalized quote."
        : apiKey
          ? "Live search didn’t find extra pages — here are official starting points."
          : "Showing official starting points.",
    results,
  })
}
