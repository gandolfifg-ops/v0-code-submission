"use client"

import { Building2, CreditCard, Landmark, Star, TrendingUp } from "lucide-react"
import { CreamIcon } from "@/components/CreamIcon"
import { ExpandableText } from "@/components/ExpandableText"
import { MarketplaceOutboundLink } from "@/features/marketplace/components/MarketplaceOutboundLink"
import { CANADA_COMPARISON, US_COMPARISON } from "@/features/marketplace/data/comparison"
import type { MarketplaceProduct, ProductCategory } from "@/features/marketplace/types"

const CATEGORY_ICONS: Record<ProductCategory, typeof Building2> = {
  banking: Building2,
  investing: TrendingUp,
  "student-aid": Landmark,
  credit: CreditCard,
}

function feeLineFor(product: MarketplaceProduct): string {
  const row = [...CANADA_COMPARISON, ...US_COMPARISON].find((item) => item.productId === product.id)
  if (row?.monthlyFee && row.advertisedPerk && row.monthlyFee !== row.advertisedPerk) {
    return `${row.monthlyFee} — ${row.advertisedPerk}`
  }
  if (row?.monthlyFee) return row.monthlyFee
  if (product.category === "student-aid") return "Free to use on the official site"
  return "Confirm fees on the official site"
}

type ProductCardProps = {
  product: MarketplaceProduct
}

export function ProductCard({ product }: ProductCardProps) {
  const featured = Boolean(product.featured)
  const government = product.source === "official"

  return (
    <article
      id={product.id}
      className={`interactive-card flex flex-col scroll-mt-24 ${
        featured
          ? "rounded-2xl border-[3px] border-border bg-card p-5 shadow-sm sm:p-6 lg:col-span-2"
          : "rounded-xl border border-border bg-card p-4"
      }`}
    >
      <div className={`mb-3 flex min-w-0 items-start ${featured ? "gap-3.5" : "gap-2.5"}`}>
        <CreamIcon icon={CATEGORY_ICONS[product.category]} size={featured ? "lg" : "md"} />
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
          {featured && (
            <span className="inline-flex items-center gap-1 rounded-full bg-gold px-2.5 py-1 text-[11px] font-bold text-gold-foreground">
              <Star className="h-3 w-3" fill="currentColor" aria-hidden="true" />
              Featured
            </span>
          )}
          <span className="rounded-full border border-border bg-background/70 px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
            {government ? "Official site" : "Curated pick"}
          </span>
        </div>
      </div>
      <h3
        className={`font-semibold tracking-tight text-foreground ${featured ? "text-xl" : "text-base"}`}
      >
        {product.name}
      </h3>
      <p className="mt-1 text-sm font-medium text-link">{product.tagline}</p>
      <p className="mt-2 text-sm text-foreground">
        <span className="text-muted-foreground">Fee / student deal: </span>
        {feeLineFor(product)}
      </p>
      <div className="mt-3 flex-1">
        <ExpandableText
          text={product.whyStudents}
          className="text-sm leading-relaxed text-muted-foreground"
        />
      </div>
      {product.affiliate ? (
        <p className="mt-3 text-[11px] leading-snug text-muted-foreground">
          We may be paid if you open this.
        </p>
      ) : government ? (
        <p className="mt-3 text-[11px] leading-snug text-muted-foreground">Not an affiliate.</p>
      ) : null}
      <MarketplaceOutboundLink
        productId={product.id}
        href={product.href}
        className="mt-3 inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-gold px-4 text-sm font-bold text-gold-foreground transition-colors hover:bg-gold-hover"
      >
        {product.cta}
      </MarketplaceOutboundLink>
    </article>
  )
}
