import { MARKETPLACE_PRODUCTS } from "@/features/marketplace/data/products"
import { SCHOOL_PAGES, schoolPagePath } from "@/features/scholarships/schools"
import { GUIDE_NAV, PRIMARY_NAV, SECONDARY_NAV } from "@/lib/constants/nav"

export type SiteSearchKind = "school" | "tool" | "guide" | "product"

export type SiteSearchHit = {
  id: string
  kind: SiteSearchKind
  label: string
  href: string
  blurb: string
  keywords: string[]
  country?: "Canada" | "USA"
  searchName?: string
}

const KIND_RANK: Record<SiteSearchKind, number> = {
  school: 0,
  tool: 1,
  guide: 2,
  product: 3,
}

const PRODUCT_KEYWORDS: Record<string, string[]> = {
  "eq-bank": ["eq", "eq bank", "eqbank"],
  "tangerine-student": ["tangerine"],
  "rbc-student": ["rbc", "rbc student"],
  nslsc: ["nslsc", "canada student loans"],
  fafsa: ["fafsa", "federal student aid"],
}

export function normalizeSearchText(input: string): string {
  return input
    .normalize("NFKC")
    .replace(/[\u2018\u2019\u201B\u2032`]/g, "'")
    .toLowerCase()
    .replace(/[^a-z0-9'\s]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

function parseCountry(
  value?: string | null,
): "Canada" | "USA" | undefined {
  if (!value) return undefined
  const raw = value.trim().toUpperCase()
  if (raw === "US" || raw === "USA" || raw === "UNITED STATES") return "USA"
  if (raw === "CA" || raw === "CANADA") return "Canada"
  return undefined
}

export function buildSiteSearchCatalog(): SiteSearchHit[] {
  const schools: SiteSearchHit[] = SCHOOL_PAGES.map((school) => ({
    id: `school-${school.slug}`,
    kind: "school",
    label: school.name,
    href: schoolPagePath(school),
    blurb: `${school.region} · school awards page`,
    keywords: [school.slug, school.searchName, school.name, ...(school.aliases ?? [])],
    searchName: school.searchName,
  }))

  const tools: SiteSearchHit[] = [...PRIMARY_NAV, ...SECONDARY_NAV].map((item) => ({
    id: `tool-${item.href}`,
    kind: "tool",
    label: item.label,
    href: item.href,
    blurb: "WealthNutz tool",
    keywords: [item.label],
  }))

  const guides: SiteSearchHit[] = GUIDE_NAV.map((item) => {
    const osap = item.href.includes("osap")
    return {
      id: `guide-${item.href}`,
      kind: "guide" as const,
      label: item.label,
      href: item.href,
      blurb: "Guide",
      keywords: osap
        ? [item.label, "osap", "ontario student assistance", "student loans"]
        : [item.label, "student bank", "canada bank"],
    }
  })

  const namedAid: SiteSearchHit[] = [
    {
      id: "aid-osap",
      kind: "guide",
      label: "OSAP",
      href: "/guides/osap-vs-private-loans",
      blurb: "Ontario student aid vs private loans",
      keywords: ["osap", "ontario student assistance program"],
      country: "Canada",
    },
    {
      id: "aid-osap-loans",
      kind: "tool",
      label: "OSAP and student loans",
      href: "/loans",
      blurb: "Loan tools for Canada and the US",
      keywords: ["osap", "student loan", "nslsc"],
    },
    {
      id: "aid-fafsa",
      kind: "tool",
      label: "FAFSA",
      href: "/loans",
      blurb: "US federal student aid — start on StudentAid.gov",
      keywords: ["fafsa", "federal student aid", "studentaid"],
      country: "USA",
    },
    {
      id: "aid-nslsc",
      kind: "product",
      label: "NSLSC",
      href: "/#nslsc",
      blurb: "National Student Loans Service Centre",
      keywords: ["nslsc", "canada student loans"],
      country: "Canada",
    },
  ]

  const products: SiteSearchHit[] = MARKETPLACE_PRODUCTS.map((product) => ({
    id: `product-${product.id}`,
    kind: "product",
    label: product.name,
    href: `/#${product.id}`,
    blurb: product.tagline,
    keywords: [product.id, product.name, ...(PRODUCT_KEYWORDS[product.id] ?? [])],
    country: product.country === "US" ? "USA" : "Canada",
  }))

  return [...schools, ...tools, ...guides, ...namedAid, ...products]
}

const CATALOG = buildSiteSearchCatalog()

function scoreHit(query: string, hit: SiteSearchHit): number | null {
  const fields = [normalizeSearchText(hit.label), ...hit.keywords.map(normalizeSearchText)].filter(
    Boolean,
  )
  if (fields.some((field) => field === query)) return 120
  if (fields.some((field) => field.split(" ").some((word) => word === query))) return 100
  if (fields.some((field) => field.startsWith(query))) return 90
  if (fields.some((field) => field.split(" ").some((word) => word.startsWith(query)))) return 80
  // Short tokens like "eq" must not match inside "chequing".
  if (query.length >= 4 && fields.some((field) => field.includes(query))) return 50
  return null
}

export function matchSiteSearch(
  query: string,
  options?: { country?: string | null; limit?: number },
): SiteSearchHit[] {
  const q = normalizeSearchText(query)
  if (!q) return []

  const preferred = parseCountry(options?.country)
  const limit = options?.limit ?? 8
  const ranked = CATALOG.map((hit) => {
    const score = scoreHit(q, hit)
    if (score == null) return null
    const countryBoost = preferred && hit.country === preferred ? 8 : 0
    return { hit, score: score + countryBoost }
  })
    .filter((row): row is { hit: SiteSearchHit; score: number } => row !== null)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score
      if (KIND_RANK[a.hit.kind] !== KIND_RANK[b.hit.kind]) {
        return KIND_RANK[a.hit.kind] - KIND_RANK[b.hit.kind]
      }
      return a.hit.label.localeCompare(b.hit.label)
    })

  const seen = new Set<string>()
  const unique: SiteSearchHit[] = []
  for (const row of ranked) {
    const key = `${row.hit.kind}:${row.hit.href}:${row.hit.label}`
    if (seen.has(key)) continue
    seen.add(key)
    unique.push(row.hit)
    if (unique.length >= limit) break
  }
  return unique
}

export function groupSiteSearchHits(
  query: string,
  country?: string | null,
): {
  schools: SiteSearchHit[]
  guides: SiteSearchHit[]
  products: SiteSearchHit[]
  tools: SiteSearchHit[]
} {
  const hits = matchSiteSearch(query, { country, limit: 40 })
  const preferred = parseCountry(country)
  const productsAll = hits.filter((hit) => hit.kind === "product")
  const productsPreferred = preferred
    ? productsAll.filter((hit) => !hit.country || hit.country === preferred)
    : productsAll
  const products = productsPreferred.length > 0 ? productsPreferred : productsAll

  return {
    schools: hits.filter((hit) => hit.kind === "school"),
    guides: hits.filter((hit) => hit.kind === "guide"),
    tools: hits.filter((hit) => hit.kind === "tool"),
    products,
  }
}

export function schoolLiveAwardsHref(hit: SiteSearchHit): string {
  return `/scholarships?school=${encodeURIComponent(hit.searchName ?? hit.label)}`
}
