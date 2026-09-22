export type Country = "CA" | "US"

export type ProductCategory =
  | "banking"
  | "investing"
  | "student-aid"
  | "credit"

export type SponsoredPlacement = "marketplace" | "cards" | "loans"

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
  /** Editorial highlight — not paid placement */
  featured?: boolean
  /**
   * Paid placement. Never set on student-aid / official sources (guard strips it).
   * Keep false until a real paid deal; Francesco flips on when paid.
   */
  sponsored?: boolean
  sponsorLabel?: string
  /** ISO date — hide after this day if set */
  sponsorUntil?: string
  placement?: SponsoredPlacement
}

/** Student credit card listing (Cards page + optional Marketplace credit section). */
export type StudentCardProduct = MarketplaceProduct & {
  category: "credit"
  annualFee: string
  advertisedWelcome: string
  studentEligibility: string
  network: string
}
