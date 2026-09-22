import type { Metadata } from "next"
import Link from "next/link"
import { ComparisonTable } from "@/features/marketplace/components/ComparisonTable"
import { GuideToolsRail } from "@/features/guides/components/GuideToolsRail"
import { CANADA_COMPARISON, COMPARISON_DISCLAIMER } from "@/features/marketplace/data/comparison"
import { pageMeta } from "@/lib/seo"

export const metadata: Metadata = pageMeta(
  "Best student bank accounts in Canada (2026) — WealthNutz",
  "Compare advertised no-fee student and everyday bank accounts in Canada. Confirm fees and offers on the official site before you apply.",
  "/guides/best-student-bank-canada",
)

export default function BestStudentBankCanadaPage() {
  return (
    <article className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <p className="text-xs font-semibold uppercase tracking-widest text-link">Guides</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        Best student bank accounts in Canada (2026)
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">Updated September 2026</p>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{COMPARISON_DISCLAIMER}</p>
      <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground">
        This guide is for students in Canada who want a no-fee (or student-fee) everyday
        account, ATM access, or a simple place to keep cash while they study. It is the
        same advertised comparison as Marketplace — not a ranking you can treat as advice,
        and not a live rate feed.
      </p>

      <ComparisonTable rows={CANADA_COMPARISON} title="Canada banking snapshot" />

      <section className="mt-8 max-w-3xl space-y-4 text-sm leading-relaxed text-muted-foreground">
        <h2 className="text-lg font-semibold text-foreground">Short picks</h2>
        <ul className="list-disc space-y-2 pl-5">
          {CANADA_COMPARISON.map((row) => (
            <li key={row.productId}>
              <span className="font-medium text-foreground">{row.bestFor}:</span> {row.account}
              {" — "}
              {row.advertisedPerk}. Confirm on the official site.
            </li>
          ))}
        </ul>
        <p>
          See the same products on{" "}
          <Link href="/" className="font-medium text-link underline">
            Marketplace (Canada)
          </Link>
          .
        </p>
      </section>

      <p className="mt-8 max-w-3xl text-xs leading-relaxed text-muted-foreground">
        Some Marketplace links are affiliate links. We may earn a commission if you open
        an account. That does not change which products we list. {COMPARISON_DISCLAIMER}{" "}
        WealthNutz does not guarantee rates and is not a bank or advisor.
      </p>
      <GuideToolsRail country="CA" />
    </article>
  )
}
