import type { Metadata } from "next"
import Link from "next/link"
import { ComparisonTable } from "@/features/marketplace/components/ComparisonTable"
import { CANADA_COMPARISON } from "@/features/marketplace/data/comparison"

export const metadata: Metadata = {
  title: "Best student bank accounts in Canada (2026) — WealthNutz",
  description:
    "Compare advertised no-fee student and everyday bank accounts in Canada. Confirm fees and offers on the official site before you apply.",
}

export default function BestStudentBankCanadaPage() {
  return (
    <article className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <p className="text-xs font-semibold uppercase tracking-widest text-[#C9A84C]">Guides</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        Best student bank accounts in Canada (2026)
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">Updated September 2026</p>
      <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground">
        This guide is for students in Canada who want a no-fee (or student-fee) everyday
        account, ATM access, or a simple place to keep cash while they study. It is a
        comparison of advertised public details — not a ranking you can treat as advice,
        and not a live rate feed.
      </p>

      <ComparisonTable rows={CANADA_COMPARISON} title="Canada banking snapshot" />

      <section className="mt-8 max-w-3xl space-y-4 text-sm leading-relaxed text-muted-foreground">
        <h2 className="text-lg font-semibold text-foreground">Short picks</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <span className="font-medium text-foreground">Best for interest on cash:</span>{" "}
            EQ Bank Personal Account — advertised high-interest cash, confirm the current
            rate and direct-deposit rules on EQ Bank.
          </li>
          <li>
            <span className="font-medium text-foreground">Best for ATM network:</span>{" "}
            Tangerine Chequing — free Scotiabank ATMs, $0 monthly fee that is not
            student-only.
          </li>
          <li>
            <span className="font-medium text-foreground">Best for branches:</span>{" "}
            RBC Advantage Banking for Students — $0 while you are a full-time student;
            fees can return after. Confirm on RBC.
          </li>
          <li>
            <span className="font-medium text-foreground">Best after graduation:</span>{" "}
            Tangerine stays $0 forever on the advertised no-fee chequing offer (terms can
            change). RBC student pricing is tied to student status.
          </li>
        </ul>
        <p>
          See the same products on{" "}
          <Link href="/" className="font-medium text-[#8B6914] underline dark:text-[#C9A84C]">
            Marketplace (Canada)
          </Link>
          .
        </p>
      </section>

      <p className="mt-8 max-w-3xl text-xs leading-relaxed text-muted-foreground">
        Some Marketplace links are affiliate links. We may earn a commission if you open
        an account. That does not change which products we list. Advertised interest,
        bonuses, and fees change — always confirm on the official site before you apply.
        WealthNutz does not guarantee rates and is not a bank or advisor.
      </p>
    </article>
  )
}
