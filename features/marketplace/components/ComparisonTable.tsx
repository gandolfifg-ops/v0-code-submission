import type { ComparisonRow } from "@/features/marketplace/data/comparison"
import { COMPARISON_DISCLAIMER } from "@/features/marketplace/data/comparison"

type ComparisonTableProps = {
  rows: ComparisonRow[]
  title?: string
}

export function ComparisonTable({ rows, title = "Compare advertised details" }: ComparisonTableProps) {
  return (
    <section className="mt-6">
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{COMPARISON_DISCLAIMER}</p>

      <div className="mt-3 space-y-3 md:hidden">
        {rows.map((row) => (
          <article key={row.productId} className="rounded-2xl border border-border bg-card p-4">
            <h3 className="font-semibold text-foreground">{row.account}</h3>
            <dl className="mt-2 space-y-1.5 text-sm">
              <div>
                <dt className="text-xs text-muted-foreground">Monthly fee</dt>
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
            <a
              href={row.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-[#C9A84C] px-4 text-sm font-bold text-[#07090d] transition-colors hover:bg-[#b8973f]"
            >
              {row.cta}
            </a>
          </article>
        ))}
      </div>

      <div className="mt-3 hidden overflow-x-auto rounded-2xl border border-border md:block">
        <table className="w-full min-w-[52rem] text-left text-sm">
          <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-3 py-3 font-semibold">Account</th>
              <th className="px-3 py-3 font-semibold">Monthly fee</th>
              <th className="px-3 py-3 font-semibold">ATM access</th>
              <th className="px-3 py-3 font-semibold">Advertised perk</th>
              <th className="px-3 py-3 font-semibold">Best for</th>
              <th className="px-3 py-3 font-semibold">Open site</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.productId} className="border-t border-border align-top">
                <td className="px-3 py-3 font-medium text-foreground">{row.account}</td>
                <td className="px-3 py-3 text-muted-foreground">{row.monthlyFee}</td>
                <td className="px-3 py-3 text-muted-foreground">{row.atmAccess}</td>
                <td className="px-3 py-3 text-muted-foreground">{row.advertisedPerk}</td>
                <td className="px-3 py-3 text-muted-foreground">{row.bestFor}</td>
                <td className="px-3 py-3">
                  <a
                    href={row.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#C9A84C] px-3 text-xs font-bold text-[#07090d] transition-colors hover:bg-[#b8973f]"
                  >
                    {row.cta}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
