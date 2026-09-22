"use client"

import { MarketplaceOutboundLink } from "@/features/marketplace/components/MarketplaceOutboundLink"
import type { CardComparisonRow } from "@/features/marketplace/data/cards"

const DISCLAIMER =
  "Fees and welcome offers change. Figures shown as “See issuer” mean confirm on the official card page before you apply."

const ctaClass =
  "inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-gold px-2 py-2 text-center text-xs font-bold leading-snug text-gold-foreground transition-colors hover:bg-gold-hover"

type CardsComparisonTableProps = {
  rows: CardComparisonRow[]
  title?: string
}

export function CardsComparisonTable({
  rows,
  title = "Compare student cards",
}: CardsComparisonTableProps) {
  return (
    <section className="mt-6">
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{DISCLAIMER}</p>

      <div className="mt-3 space-y-3 md:hidden">
        {rows.map((row) => (
          <article key={row.productId} className="rounded-2xl border border-border bg-card p-4">
            <h3 className="font-semibold text-foreground">{row.name}</h3>
            <dl className="mt-2 space-y-1.5 text-sm">
              <div>
                <dt className="text-xs text-muted-foreground">Annual fee</dt>
                <dd className="text-foreground">{row.annualFee}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Advertised welcome</dt>
                <dd className="text-foreground">{row.advertisedWelcome}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Eligibility</dt>
                <dd className="text-foreground">{row.studentEligibility}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Network</dt>
                <dd className="text-foreground">{row.network}</dd>
              </div>
            </dl>
            <MarketplaceOutboundLink productId={row.productId} href={row.href} className={`${ctaClass} mt-3 text-sm`}>
              {row.cta}
            </MarketplaceOutboundLink>
          </article>
        ))}
      </div>

      <div className="mt-3 hidden overflow-x-auto rounded-2xl border border-border md:block">
        <table className="w-full table-fixed text-left text-sm">
          <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="w-[22%] px-3 py-3 font-semibold">Card</th>
              <th className="w-[12%] px-3 py-3 font-semibold">Annual fee</th>
              <th className="w-[18%] px-3 py-3 font-semibold">Welcome</th>
              <th className="w-[20%] px-3 py-3 font-semibold">Eligibility</th>
              <th className="w-[12%] px-3 py-3 font-semibold">Network</th>
              <th className="w-[16%] px-3 py-3 font-semibold">Open site</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.productId} className="border-t border-border align-top">
                <td className="px-3 py-3 font-medium text-foreground">{row.name}</td>
                <td className="px-3 py-3 text-muted-foreground">{row.annualFee}</td>
                <td className="px-3 py-3 text-muted-foreground">{row.advertisedWelcome}</td>
                <td className="px-3 py-3 text-muted-foreground">{row.studentEligibility}</td>
                <td className="px-3 py-3 text-muted-foreground">{row.network}</td>
                <td className="px-2 py-3">
                  <MarketplaceOutboundLink productId={row.productId} href={row.href} className={ctaClass}>
                    {row.cta}
                  </MarketplaceOutboundLink>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
