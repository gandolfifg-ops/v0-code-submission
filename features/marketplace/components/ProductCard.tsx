import { Building2, CreditCard, Landmark, Star, TrendingUp } from "lucide-react"
import { CreamIcon } from "@/components/CreamIcon"
import { ExpandableText } from "@/components/ExpandableText"
import type { MarketplaceProduct, ProductCategory } from "@/features/marketplace/types"

const CATEGORY_ICONS: Record<ProductCategory, typeof Building2> = {
  banking: Building2,
  investing: TrendingUp,
  "student-aid": Landmark,
  credit: CreditCard,
}

type ProductCardProps = {
  product: MarketplaceProduct
}

export function ProductCard({ product }: ProductCardProps) {
  const featured = Boolean(product.featured)

  return (
    <article
      className={`interactive-card flex flex-col ${
        featured
          ? "rounded-2xl border-[3px] border-[#C9A84C] bg-[#C9A84C]/10 p-5 shadow-sm sm:p-6 lg:col-span-2"
          : "rounded-xl border border-border bg-card p-4"
      }`}
    >
      <div className={`mb-3 flex min-w-0 items-start ${featured ? "gap-3.5" : "gap-2.5"}`}>
        <CreamIcon icon={CATEGORY_ICONS[product.category]} size={featured ? "lg" : "md"} />
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
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
      </div>
      <h3
        className={`font-semibold tracking-tight text-foreground ${featured ? "text-xl" : "text-base"}`}
      >
        {product.name}
      </h3>
      <p className="mt-1 text-sm font-medium text-[#8B6914] dark:text-[#C9A84C]">{product.tagline}</p>
      <div className="mt-3 flex-1">
        <ExpandableText
          text={product.whyStudents}
          className="text-sm leading-relaxed text-muted-foreground"
        />
      </div>
      <a
        href={product.href}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-[#C9A84C] px-4 text-sm font-bold text-[#07090d] transition-colors hover:bg-[#b8973f]"
      >
        {product.cta}
      </a>
    </article>
  )
}
