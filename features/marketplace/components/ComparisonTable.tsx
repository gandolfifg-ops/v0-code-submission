import type { ComparisonKind, ComparisonRow } from "@/features/marketplace/data/comparison"
import { COMPARISON_DISCLAIMER } from "@/features/marketplace/data/comparison"

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
              {showAtm ? (
                <div>
                  <dt className="text-xs text-muted-foreground">ATM access</dt>
                  <dd className="text-foreground">{row.atmAccess}</dd>
                </div>
              ) : null}
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
              className="mt-3 inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-gold px-4 text-sm font-bold text-gold-foreground transition-colors hover:bg-gold-hover"
            >
              {row.cta}
            </a>
          </article>
        ))}
      </div>

      <div className="mt-3 hidden overflow-x-auto rounded-2xl border border-border md:block">
        <table className="w-full table-fixed text-left text-sm">
          <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="w-[22%] px-3 py-3 font-semibold">Product</th>
              {showAtm ? <th className="w-[20%] px-3 py-3 font-semibold">ATM access</th> : null}
              <th className={`${showAtm ? "w-[26%]" : "w-[38%]"} px-3 py-3 font-semibold`}>Advertised perk</th>
              <th className="w-[20%] px-3 py-3 font-semibold">Best for</th>
              <th className="w-[12%] px-3 py-3 font-semibold">Open site</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.productId} className="border-t border-border align-top">
                <td className="px-3 py-3 font-medium text-foreground">{row.account}</td>
                {showAtm ? <td className="px-3 py-3 text-muted-foreground">{row.atmAccess}</td> : null}
                <td className="px-3 py-3 text-muted-foreground">{row.advertisedPerk}</td>
                <td className="px-3 py-3 text-muted-foreground">{row.bestFor}</td>
                <td className="px-3 py-3">
                  <a
                    href={row.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center justify-center rounded-xl bg-gold px-3 text-xs font-bold text-gold-foreground transition-colors hover:bg-gold-hover"
                  >
                    {row.cta}
                  </a>
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
    </section>
  )
}
