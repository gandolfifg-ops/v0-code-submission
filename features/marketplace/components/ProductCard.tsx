import { Star } from "lucide-react"
import type { MarketplaceProduct } from "@/features/marketplace/types"

type ProductCardProps = {
  product: MarketplaceProduct
}

export function ProductCard({ product }: ProductCardProps) {
  const featured = Boolean(product.featured)

  return (
    <article
      className={`interactive-card flex flex-col rounded-2xl p-4 sm:p-5 ${
        featured
          ? "border-2 border-[#C9A84C] bg-[#C9A84C]/10 shadow-sm lg:col-span-2"
          : "border border-border bg-card"
      }`}
    >
      <div className="mb-3 flex flex-wrap items-center gap-2">
        {featured && (
          <span className="inline-flex items-center gap-1 rounded-full bg-[#C9A84C] px-2.5 py-1 text-[11px] font-bold text-[#07090d]">
            <Star className="h-3 w-3" fill="currentColor" aria-hidden="true" />
            Featured
          </span>
        )}
        <span className="rounded-full border border-border bg-background/70 px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
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
        className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-[#C9A84C] px-4 text-sm font-bold text-[#07090d] transition-colors hover:bg-[#b8973f]"
      >
        {product.cta}
      </a>
      {product.affiliate && (
        <p className="mt-2 text-center text-[11px] text-muted-foreground">Affiliate link</p>
      )}
    </article>
  )
}
