"use client"

import type { ReactNode } from "react"
import { track } from "@vercel/analytics"
import { MARKETPLACE_PRODUCTS } from "@/features/marketplace/data/products"

type MarketplaceOutboundLinkProps = {
  productId: string
  href: string
  className?: string
  children: ReactNode
  onNavigate?: () => void
}

export function MarketplaceOutboundLink({
  productId,
  href,
  className,
  children,
  onNavigate,
}: MarketplaceOutboundLinkProps) {
  const product = MARKETPLACE_PRODUCTS.find((item) => item.id === productId)
  const affiliate = Boolean(product?.affiliate)
  const country = product?.country ?? ""

  return (
    <a
      href={href}
      target="_blank"
      rel={affiliate ? "noopener sponsored" : "noopener"}
      onClick={() => {
        track("marketplace_outbound", { productId, country, affiliate })
        onNavigate?.()
      }}
      className={className}
    >
      {children}
    </a>
  )
}
