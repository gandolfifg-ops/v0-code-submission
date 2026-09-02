export type Country = "CA" | "US"

export type ProductCategory =
  | "banking"
  | "investing"
  | "student-aid"
  | "credit"

export type MarketplaceProduct = {
  id: string
  name: string
  country: Country
  category: ProductCategory
  tagline: string
  whyStudents: string
  href: string
  cta: string
  /** Curated editorial pick — not a live rate feed */
  source: "curated" | "official"
  affiliate: boolean
  featured?: boolean
}
