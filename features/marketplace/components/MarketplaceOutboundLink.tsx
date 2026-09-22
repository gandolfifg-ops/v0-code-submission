"use client"

import type { ReactNode } from "react"
import { track } from "@vercel/analytics"
import { STUDENT_CARDS } from "@/features/marketplace/data/cards"
import { MARKETPLACE_PRODUCTS } from "@/features/marketplace/data/products"
import { isSponsoredActive } from "@/features/marketplace/lib/sponsored"

type MarketplaceOutboundLinkProps = {
  productId: string
  href: string
  className?: string
  children: ReactNode
  onNavigate?: () => void
  /** Force sponsored_click even if product lookup misses (e.g. SponsoredSlot). */
  sponsored?: boolean
}

function lookupProduct(productId: string) {
  return (
    MARKETPLACE_PRODUCTS.find((item) => item.id === productId) ??
    STUDENT_CARDS.find((item) => item.id === productId)
  )
}

export function MarketplaceOutboundLink({
  productId,
  href,
  className,
  children,
  onNavigate,
  sponsored,
}: MarketplaceOutboundLinkProps) {
  const product = lookupProduct(productId)
  const affiliate = Boolean(product?.affiliate)
  const country = product?.country ?? ""
  const isSponsored = Boolean(sponsored) || (product ? isSponsoredActive(product) : false)

  return (
    <a
      href={href}
      target="_blank"
      rel={affiliate || isSponsored ? "noopener sponsored" : "noopener"}
      onClick={() => {
        track("marketplace_outbound", { productId, country, affiliate })
        if (isSponsored) {
          track("sponsored_click", { productId, country })
        }
        onNavigate?.()
      }}
      className={className}
    >
      {children}
    </a>
  )
}
