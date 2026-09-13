"use client"

import type { ComparisonKind, ComparisonRow } from "@/features/marketplace/data/comparison"
import { COMPARISON_DISCLAIMER, HOW_WE_PICK } from "@/features/marketplace/data/comparison"
import { MarketplaceOutboundLink } from "@/features/marketplace/components/MarketplaceOutboundLink"

type ComparisonTableProps = {
  rows: ComparisonRow[]
  title?: string
}

const KIND_ORDER: ComparisonKind[] = ["banking", "investing", "credit"]
const KIND_LABEL: Record<ComparisonKind, string> = {
  banking: "Banking",
  investing: "Investing",
  credit: "Credit",
}

const ctaClass =
  "inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-gold px-2 py-2 text-center text-xs font-bold leading-snug text-gold-foreground hyphens-none whitespace-normal [overflow-wrap:normal] [word-break:normal] transition-colors hover:bg-gold-hover"

function rowKind(row: ComparisonRow): ComparisonKind {
  return row.kind ?? "banking"
}

function SnapshotBlock({
  heading,
  rows,
  showAtm,
}: {
  heading: string | null
  rows: ComparisonRow[]
  showAtm: boolean
}) {
  return (
    <div className={heading ? "mt-4" : "mt-3"}>
      {heading ? <h3 className="text-base font-semibold text-foreground">{heading}</h3> : null}
      <div className="mt-3 space-y-3 md:hidden">
        {rows.map((row) => (
          <article key={row.productId} className="rounded-2xl border border-border bg-card p-4">
            {heading ? (
              <p className="text-[11px] font-semibold uppercase tracking-wide text-link">
                {KIND_LABEL[rowKind(row)]}
              </p>
            ) : null}
            <h4 className={`${heading ? "mt-1" : ""} font-semibold text-foreground`}>{row.account}</h4>
            <dl className="mt-2 space-y-1.5 text-sm">
              <div>
                <dt className="text-xs text-muted-foreground">Fees</dt>
                <dd className="text-foreground">{row.monthlyFee}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">ATM access</dt>
                <dd className="text-foreground">{row.atmAccess}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Advertised perk</dt>
                <dd className="text-foreground">{row.advertisedPerk}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Best for</dt>
                <dd className="text-foreground">{row.bestFor}</dd>
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
              <th className={`${showAtm ? "w-[16%]" : "w-[20%]"} px-3 py-3 font-semibold`}>Product</th>
              <th className="w-[14%] px-3 py-3 font-semibold">Fees</th>
              {showAtm ? <th className="w-[16%] px-3 py-3 font-semibold">ATM access</th> : null}
              <th className={`${showAtm ? "w-[20%]" : "w-[28%]"} px-3 py-3 font-semibold`}>Advertised perk</th>
              <th className="w-[16%] px-3 py-3 font-semibold">Best for</th>
              <th className="w-[18%] px-3 py-3 font-semibold">Open site</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.productId} className="border-t border-border align-top">
                <td className="px-3 py-3 font-medium text-foreground">{row.account}</td>
                <td className="px-3 py-3 text-muted-foreground">{row.monthlyFee}</td>
                {showAtm ? <td className="px-3 py-3 text-muted-foreground">{row.atmAccess}</td> : null}
                <td className="px-3 py-3 text-muted-foreground">{row.advertisedPerk}</td>
                <td className="px-3 py-3 text-muted-foreground">{row.bestFor}</td>
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
    </div>
  )
}

export function ComparisonTable({ rows, title = "Compare advertised details" }: ComparisonTableProps) {
  const grouped = KIND_ORDER.map((kind) => ({
    kind,
    rows: rows.filter((row) => rowKind(row) === kind),
  })).filter((group) => group.rows.length > 0)
  const split = grouped.length > 1

  return (
    <section className="mt-6">
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{COMPARISON_DISCLAIMER}</p>
      {grouped.map((group) => (
        <SnapshotBlock
          key={group.kind}
          heading={split ? KIND_LABEL[group.kind] : null}
          rows={group.rows}
          showAtm={group.kind === "banking"}
        />
      ))}
      <div className="mt-4 max-w-3xl space-y-1.5 text-sm leading-relaxed text-muted-foreground">
        <h3 className="text-sm font-semibold text-foreground">How we pick these</h3>
        {HOW_WE_PICK.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
    </section>
  )
}
