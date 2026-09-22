"use client"

import { useState } from "react"
import { CreditCard, Star } from "lucide-react"
import { CreamIcon } from "@/components/CreamIcon"
import { ExpandableText } from "@/components/ExpandableText"
import { MarketplaceOutboundLink } from "@/features/marketplace/components/MarketplaceOutboundLink"
import { isSponsoredActive, sponsorLabelFor } from "@/features/marketplace/lib/sponsored"
import type { StudentCardProduct } from "@/features/marketplace/types"
import { SaveButton } from "@/features/saved/components/SaveButton"
import { useSavedItems } from "@/features/saved/hooks/useSavedItems"

type CardProductCardProps = {
  card: StudentCardProduct
}

export function CardProductCard({ card }: CardProductCardProps) {
  const featured = Boolean(card.featured)
  const sponsored = isSponsoredActive(card, "cards")
  const [opened, setOpened] = useState(false)
  const { ids } = useSavedItems()
  const savedItem = {
    id: `product-${card.id}`,
    kind: "product" as const,
    title: card.name,
    href: card.href,
    subtitle: card.tagline,
    savedAt: Date.now(),
  }
  const saved = ids.has(savedItem.id)

  return (
    <article
      id={card.id}
      className={`interactive-card flex flex-col scroll-mt-24 ${
        featured || sponsored
          ? "rounded-2xl border-[3px] border-border bg-card p-5 shadow-sm sm:p-6"
          : "rounded-xl border border-border bg-card p-4"
      }`}
    >
      <div className="mb-3 flex min-w-0 items-start gap-2.5">
        <CreamIcon icon={CreditCard} size="md" />
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
          {sponsored ? (
            <span className="rounded-full bg-foreground px-2.5 py-1 text-[11px] font-bold text-background">
              Paid placement
            </span>
          ) : featured ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-gold px-2.5 py-1 text-[11px] font-bold text-gold-foreground">
              <Star className="h-3 w-3" fill="currentColor" aria-hidden="true" />
              Featured
            </span>
          ) : null}
          <span className="rounded-full border border-border bg-background/70 px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
            Curated pick
          </span>
        </div>
      </div>
      <h3 className="text-base font-semibold tracking-tight text-foreground">{card.name}</h3>
      <p className="mt-1 text-sm font-medium text-link">{card.tagline}</p>
      {sponsored ? (
        <p className="mt-2 text-xs text-muted-foreground">{sponsorLabelFor(card)}</p>
      ) : null}
      <dl className="mt-3 space-y-1.5 text-sm">
        <div>
          <dt className="text-xs text-muted-foreground">Annual fee</dt>
          <dd className="text-foreground">{card.annualFee}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Advertised welcome</dt>
          <dd className="text-foreground">{card.advertisedWelcome}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Student eligibility</dt>
          <dd className="text-foreground">{card.studentEligibility}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Network</dt>
          <dd className="text-foreground">{card.network}</dd>
        </div>
      </dl>
      <div className="mt-3 flex-1">
        <ExpandableText
          text={card.whyStudents}
          className="text-sm leading-relaxed text-muted-foreground"
        />
      </div>
      {card.affiliate ? (
        <p className="mt-3 text-[11px] leading-snug text-muted-foreground">
          We may be paid if you open this.
        </p>
      ) : (
        <p className="mt-3 text-[11px] leading-snug text-muted-foreground">
          Confirm terms on the official issuer site.
        </p>
      )}
      <MarketplaceOutboundLink
        productId={card.id}
        href={card.href}
        sponsored={sponsored}
        className="mt-3 inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-gold px-4 text-sm font-bold text-gold-foreground transition-colors hover:bg-gold-hover"
        onNavigate={() => setOpened(true)}
      >
        {card.cta}
      </MarketplaceOutboundLink>
      {opened && !saved ? (
        <p className="mt-2 rounded-xl border border-border bg-muted px-3 py-2 text-xs text-foreground">
          Opened in a new tab — tap Save if you want to track this card here.
        </p>
      ) : null}
      <div className="mt-2">
        <SaveButton item={savedItem} />
      </div>
    </article>
  )
}
