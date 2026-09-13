import type { Metadata } from "next"
import Link from "next/link"
import { ComparisonTable } from "@/features/marketplace/components/ComparisonTable"
import { COMPARISON_DISCLAIMER, US_COMPARISON } from "@/features/marketplace/data/comparison"
import { pageMeta } from "@/lib/seo"

export const metadata: Metadata = pageMeta(
  "Best student bank accounts in the United States (2026) — WealthNutz",
  "Compare advertised no-fee student and everyday bank accounts in the United States. Confirm fees and offers on the official site before you apply.",
  "/guides/best-student-bank-usa",
)

const BANK_ROWS = US_COMPARISON.filter((row) => (row.kind ?? "banking") === "banking")

export default function BestStudentBankUsaPage() {
  return (
    <article className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <p className="text-xs font-semibold uppercase tracking-widest text-link">Guides</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        Best student bank accounts in the United States (2026)
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">Last reviewed September 2026</p>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{COMPARISON_DISCLAIMER}</p>
      <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground">
        This guide is for students in the United States who want a no-fee (or student-fee)
        everyday account, ATM access, or a simple place to keep cash while they study. It is
        the same advertised banking comparison as Marketplace — not a ranking you can treat as
        advice, and not a live rate feed. We only list products already on Marketplace.
      </p>

      <section className="mt-8 max-w-3xl space-y-3 text-sm leading-relaxed text-muted-foreground">
        <h2 className="text-lg font-semibold text-foreground">How to choose</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <span className="font-medium text-foreground">Fees:</span> Look for $0 monthly
            maintenance and no minimum-balance trap after you graduate. Confirm the waiver
            rules on the bank’s site.
          </li>
          <li>
            <span className="font-medium text-foreground">ATM:</span> Check whether the
            network is Allpoint, the bank’s own machines, or reimbursed out-of-network
            withdrawals — campus cash access varies.
          </li>
          <li>
            <span className="font-medium text-foreground">Overdraft:</span> Some student
            accounts advertise no overdraft fees. Read the official overdraft and NSF terms
            before you enroll in debit.
          </li>
          <li>
            <span className="font-medium text-foreground">Campus presence:</span> Online-only
            banks can work if you are fine without a branch. A big-bank student account can
            help if you want in-person service near campus.
          </li>
        </ul>
      </section>

      <ComparisonTable rows={BANK_ROWS} title="United States banking snapshot" />

      <section className="mt-8 max-w-3xl space-y-4 text-sm leading-relaxed text-muted-foreground">
        <h2 className="text-lg font-semibold text-foreground">Short picks</h2>
        <ul className="list-disc space-y-2 pl-5">
          {BANK_ROWS.map((row) => (
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
            Marketplace (United States)
          </Link>
          .
        </p>
      </section>

      <section className="mt-8 max-w-3xl space-y-3 text-sm leading-relaxed text-muted-foreground">
        <h2 className="text-lg font-semibold text-foreground">FAFSA first</h2>
        <p>
          A bank account does not replace federal student aid. File the{" "}
          <a
            href="https://studentaid.gov/h/apply-for-aid/fafsa"
            className="font-medium text-link underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            FAFSA on StudentAid.gov
          </a>{" "}
          before you borrow privately. School pages on WealthNutz point to official .edu aid
          offices — confirm every deadline there.
        </p>
      </section>

      <p className="mt-8 max-w-3xl text-xs leading-relaxed text-muted-foreground">
        Some Marketplace links are affiliate links. We may earn a commission if you open
        an account. That does not change which products we list. {COMPARISON_DISCLAIMER}{" "}
        WealthNutz does not guarantee rates and is not a bank or advisor.
      </p>
    </article>
  )
}
