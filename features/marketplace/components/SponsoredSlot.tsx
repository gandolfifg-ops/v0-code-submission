"use client"

import { MarketplaceOutboundLink } from "@/features/marketplace/components/MarketplaceOutboundLink"
import { isSponsoredActive, sponsorLabelFor } from "@/features/marketplace/lib/sponsored"
import type { MarketplaceProduct, SponsoredPlacement } from "@/features/marketplace/types"

type SponsoredSlotProps = {
  products: MarketplaceProduct[]
  placement: SponsoredPlacement
  className?: string
}

export function SponsoredSlot({ products, placement, className }: SponsoredSlotProps) {
  const active = products.filter((product) => isSponsoredActive(product, placement))
  if (active.length === 0) return null

  return (
    <section className={className ?? "mt-6"} aria-label="Paid placement">
      {active.map((product) => (
        <article
          key={product.id}
          className="rounded-2xl border-2 border-dashed border-border bg-muted/40 p-4 sm:p-5"
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-foreground px-2.5 py-1 text-[11px] font-bold text-background">
              Paid placement
            </span>
            <span className="text-[11px] font-medium text-muted-foreground">
              {sponsorLabelFor(product)}
            </span>
          </div>
          <h3 className="mt-2 text-lg font-semibold tracking-tight text-foreground">{product.name}</h3>
          <p className="mt-1 text-sm font-medium text-link">{product.tagline}</p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{product.whyStudents}</p>
          <p className="mt-2 text-xs text-muted-foreground">
            Confirm fees, eligibility, and offers on the official site before you apply.
          </p>
          <MarketplaceOutboundLink
            productId={product.id}
            href={product.href}
            sponsored
            className="mt-3 inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-gold px-4 text-sm font-bold text-gold-foreground transition-colors hover:bg-gold-hover sm:w-auto"
          >
            {product.cta}
          </MarketplaceOutboundLink>
        </article>
      ))}
    </section>
  )
}
