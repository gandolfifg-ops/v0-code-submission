import type { MarketplaceProduct, SponsoredPlacement } from "@/features/marketplace/types"

export const DEFAULT_SPONSOR_LABEL = "Featured — paid placement"

/** Government / official hubs must never show as sponsored. */
export function canBeSponsored(product: Pick<MarketplaceProduct, "category" | "source">): boolean {
  if (product.category === "student-aid" || product.source === "official") return false
  return true
}

export function isSponsoredActive(
  product: MarketplaceProduct,
  placement?: SponsoredPlacement,
): boolean {
  if (!product.sponsored) return false
  if (!canBeSponsored(product)) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        `[WealthNutz] Ignoring sponsored on protected product "${product.id}" (student-aid or official).`,
      )
    }
    return false
  }
  if (placement && product.placement && product.placement !== placement) return false
  if (product.sponsorUntil) {
    const until = Date.parse(product.sponsorUntil)
    if (!Number.isNaN(until) && Date.now() > until) return false
  }
  return true
}

export function sponsorLabelFor(product: MarketplaceProduct): string {
  return product.sponsorLabel?.trim() || DEFAULT_SPONSOR_LABEL
}
