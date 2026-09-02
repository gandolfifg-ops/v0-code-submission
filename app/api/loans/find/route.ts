import { CURATED_LENDERS } from "@/features/loans/data/curated"
import type { LoanCountry, LoanResult, LoanType } from "@/features/loans/types"

export const dynamic = "force-dynamic"
export const maxDuration = 30

const DOMAINS: Record<LoanCountry, Record<LoanType, string[]>> = {
  USA: {
    Student: [
      "studentaid.gov",
      "salliemae.com",
      "sofi.com",
      "earnest.com",
      "credible.com",
      "collegeavestudentloans.com",
    ],
    Personal: ["sofi.com", "lightstream.com", "discover.com", "upstart.com", "nerdwallet.com", "bankrate.com"],
    Auto: ["capitalone.com", "lightstream.com", "bankrate.com", "nerdwallet.com"],
  },
  Canada: {
    Student: ["canada.ca", "csnpe-nslsc.canada.ca", "rbcroyalbank.com", "ontario.ca"],
    Personal: ["rbcroyalbank.com", "td.com", "tangerine.ca", "nerdwallet.com"],
    Auto: ["rbcroyalbank.com", "td.com", "scotiabank.com"],
  },
}

function isValidHttpUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return parsed.protocol === "https:" || parsed.protocol === "http:"
  } catch {
    return false
  }
}

function parseCountry(value: unknown): LoanCountry {
  return value === "USA" ? "USA" : "Canada"
}

function parseType(value: unknown): LoanType {
  if (value === "Personal" || value === "Auto") return value
  return "Student"
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  const country = parseCountry(body?.country)
  const loanType = parseType(body?.loanType)
  const amount = typeof body?.amount === "string" ? body.amount.trim() : ""

  const apiKey = process.env.TAVILY_API_KEY?.trim()
  const searchQuery = [
    country === "Canada" ? "Canada" : "United States",
    loanType.toLowerCase(),
    "loan 2026 apply rates",
    amount ? `${amount} dollars` : "",
  ]
    .filter(Boolean)
    .join(" ")

  if (apiKey) {
    try {
      const tavilyResponse = await fetch("https://api.tavily.com/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          api_key: apiKey,
          query: searchQuery,
          search_depth: "advanced",
          include_domains: DOMAINS[country][loanType],
          max_results: 8,
        }),
      })

      if (tavilyResponse.ok) {
        const tavilyData = await tavilyResponse.json()
        const live: LoanResult[] = (tavilyData.results ?? [])
          .filter((r: { url?: string; score?: number }) => {
            if (!r.url || !isValidHttpUrl(r.url)) return false
            if (r.url.includes("404") || r.url.includes("not-found")) return false
            if (typeof r.score === "number" && r.score < 0.3) return false
            return true
          })
          .map((r: { title?: string; url: string; content?: string }, i: number) => {
            const hostname = new URL(r.url).hostname.replace(/^www\./, "")
            const name = hostname.split(".")[0] ?? "Lender"
            const content = r.content ?? ""
            const rateMatch = content.match(/\d+\.?\d*\s*%(?:\s*APR)?/i)
            return {
              id: `live-${loanType}-${i}-${hostname}`,
              name: (r.title ?? name).slice(0, 90),
              country,
              loanType,
              tagline: name.charAt(0).toUpperCase() + name.slice(1),
              advertisedRate: rateMatch
                ? `Advertised ${rateMatch[0]} — confirm on official site`
                : "Advertised rate — confirm on official site",
              highlight: content.trim() || "Open the lender page for current terms.",
              href: r.url,
              cta: "Open official site",
              source: "live" as const,
            }
          })

        if (live.length > 0) {
          return Response.json({
            source: "live",
            notice:
              "These are live web search results. Any APR shown was scraped from public pages and is not a personalized quote. Confirm on the official site.",
            results: live,
          })
        }
      }
    } catch (error) {
      console.error("[loans] Live search failed:", error)
    }
  }

  return Response.json({
    source: "curated",
    notice: apiKey
      ? "Live web search returned no usable results. Showing curated official lender pages — rates are advertised, not guaranteed quotes."
      : "Live web search is not configured (missing TAVILY_API_KEY). Showing curated official lender pages — rates are advertised, not guaranteed quotes.",
    results: CURATED_LENDERS.filter((l) => l.country === country && l.loanType === loanType),
  })
}
