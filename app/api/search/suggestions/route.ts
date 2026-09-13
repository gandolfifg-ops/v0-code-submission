import { matchSiteSearch } from "@/lib/siteSearch"

export async function GET(req: Request) {
  const url = new URL(req.url)
  const q = (url.searchParams.get("q") ?? "").trim()
  const country = url.searchParams.get("country")

  if (!q) {
    return Response.json({ suggestions: [] })
  }

  const suggestions = matchSiteSearch(q, { country, limit: 8 }).map((hit) => ({
    id: hit.id,
    label: hit.label,
    href: hit.href,
    kind: hit.kind,
    blurb: hit.blurb,
  }))

  return Response.json({ suggestions })
}
