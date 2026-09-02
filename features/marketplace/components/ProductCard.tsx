import type { MarketplaceProduct } from "@/features/marketplace/types"
import { CATEGORY_LABELS } from "@/features/marketplace/data/products"

type ProductCardProps = {
  product: MarketplaceProduct
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="flex flex-col rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          {CATEGORY_LABELS[product.category]}
        </span>
        {product.featured && (
          <span className="rounded-full bg-[#C9A84C]/15 px-2.5 py-1 text-[11px] font-semibold text-[#8B6914] dark:text-[#E8C97A]">
            Featured
          </span>
        )}
        <span className="rounded-full border border-border px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
          {product.source === "official" ? "Official site" : "Curated pick"}
        </span>
      </div>
      <h3 className="text-lg font-semibold tracking-tight text-foreground">{product.name}</h3>
      <p className="mt-1 text-sm font-medium text-[#8B6914] dark:text-[#C9A84C]">{product.tagline}</p>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{product.whyStudents}</p>
      <a
        href={product.href}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-[#C9A84C] px-4 text-sm font-bold text-[#07090d] transition-opacity hover:opacity-90"
      >
        {product.cta}
      </a>
      {product.affiliate && (
        <p className="mt-2 text-center text-[11px] text-muted-foreground">Affiliate link</p>
      )}
    </article>
  )
}
