import { CURATED_SCHOLARSHIPS } from "@/features/scholarships/data/curated"
import type { ScholarshipFilters, ScholarshipResult } from "@/features/scholarships/types"
import {
  cleanDisplayText,
  extractDeadlineFromSnippet,
  resolveScholarshipDeadline,
} from "@/lib/liveResultText"

export const dynamic = "force-dynamic"
export const maxDuration = 30

const SCHOLARSHIP_DOMAINS = [
  "scholarships.com",
  "fastweb.com",
  "bold.org",
  "unigo.com",
  "niche.com",
  "goingmerry.com",
  "studentaid.gov",
  "collegeboard.org",
  "scholarshipamerica.org",
  "univcan.ca",
  "loranscholar.ca",
  "indspire.ca",
  "scholarshipscanada.com",
  "yconic.com",
]

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

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  const filters: ScholarshipFilters = {
    country: body?.country === "Canada" ? "Canada" : "USA",
    major: typeof body?.major === "string" ? body.major : "Any major",
    level: typeof body?.level === "string" ? body.level : "Any level",
    query: typeof body?.query === "string" ? body.query : "",
    university: typeof body?.university === "string" ? body.university : "",
  }

  const apiKey = process.env.TAVILY_API_KEY?.trim()
  const universitySearch = filters.university.trim().length > 0

  const queryParts = [
    "scholarship bursary 2026 apply",
    filters.country,
    filters.major !== "Any major" ? filters.major : "",
    filters.level !== "Any level" ? filters.level : "",
    filters.query.trim(),
    universitySearch ? `${filters.university.trim()} university scholarships` : "",
  ].filter(Boolean)

  if (apiKey) {
    try {
      const tavilyResponse = await fetch("https://api.tavily.com/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          api_key: apiKey,
          query: queryParts.join(" "),
          search_depth: "advanced",
          ...(universitySearch ? {} : { include_domains: SCHOLARSHIP_DOMAINS }),
          max_results: 10,
        }),
      })

      if (tavilyResponse.ok) {
        const tavilyData = await tavilyResponse.json()
        const live: ScholarshipResult[] = (tavilyData.results ?? [])
          .filter((r: { url?: string; score?: number; title?: string }) => {
            if (!r.url || !isValidHttpUrl(r.url)) return false
            if (r.url.includes("404") || r.url.includes("not-found")) return false
            if (typeof r.score === "number" && r.score < 0.3) return false
            return true
          })
          .map((r: { title?: string; url: string; content?: string }, i: number) => {
            const hostname = new URL(r.url).hostname.replace(/^www\./, "")
            const provider = hostname.split(".")[0] ?? "Source"
            const content = r.content ?? ""
            const amountMatch = content.match(/\$[\d,]+(?:\s*-\s*\$[\d,]+)?|\$[\d,]+\+?/)
            const extracted = extractDeadlineFromSnippet(content)
            const { keep, deadline } = resolveScholarshipDeadline(extracted)
            if (!keep) return null
            return {
              id: `live-${i}-${hostname}`,
              title: cleanDisplayText(r.title ?? "Scholarship listing").slice(0, 100),
              provider: provider.charAt(0).toUpperCase() + provider.slice(1),
              amount: amountMatch?.[0] ?? "See listing",
              deadline,
              lastChecked: formatCheckedToday(),
              eligibility:
                cleanDisplayText(content) || "See the official listing for eligibility details.",
              url: r.url,
              source: "live" as const,
            }
          })
          .filter((item): item is ScholarshipResult => item !== null)

        if (live.length > 0) {
          return Response.json({
            source: "live",
            notice:
              "These are live web search results from public scholarship sites. Amounts and deadlines may be incomplete — always confirm on the official page.",
            results: live,
          })
        }
      }
    } catch (error) {
      console.error("[scholarships] Live search failed:", error)
    }
  }

  return Response.json({
    source: "curated",
    notice: apiKey
      ? "Live web search returned no usable results. Showing curated official starting points instead — not a complete scholarship database."
      : "Live web search is not configured (missing TAVILY_API_KEY). Showing curated official starting points — not a complete scholarship database.",
    results: filterCurated(filters),
  })
}
