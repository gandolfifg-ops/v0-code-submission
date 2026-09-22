import type { Metadata } from "next"
import Link from "next/link"
import { InfoPage } from "@/components/layout/InfoPage"
import { pageMeta } from "@/lib/seo"

export const metadata: Metadata = pageMeta(
  "Terms — WealthNutz",
  "Terms of use for WealthNutz. Content is educational, not financial advice. Last updated September 2026.",
  "/terms",
)

export default function TermsPage() {
  return (
    <InfoPage title="Terms of Service" lede="Last updated: September 2026">
      <p>
        By using WealthNutz, you agree that content on this site is for educational purposes
        only and is not professional financial, tax, or legal advice. We are not a lender, bank,
        or broker.
      </p>
      <section>
        <h2 className="text-lg font-semibold text-foreground">Rates and listings</h2>
        <p className="mt-2">
          Scholarship listings may come from live web search or a curated list. Loan rates and card
          offers shown are advertised on public pages, not guaranteed quotes. Always verify terms on
          the official site before you apply.
        </p>
      </section>
      <section>
        <h2 className="text-lg font-semibold text-foreground">Affiliate and sponsored placements</h2>
        <p className="mt-2">
          Some Marketplace, Cards, and banking links are affiliate links. We may receive compensation
          if you open a product. Separate <strong className="font-semibold text-foreground">sponsored</strong>{" "}
          slots are paid placements labeled “Paid placement.” Organic comparison-table order stays
          editorial. Government hubs are never affiliate or sponsored.
        </p>
      </section>
      <section>
        <h2 className="text-lg font-semibold text-foreground">Digest, loan leads, Kit</h2>
        <p className="mt-2">
          Digest and Kit waitlist signups are optional. Private-loan interest forms are not loan
          applications. We do not collect SIN, SSN, date of birth, full address, or credit score. No
          Stripe checkout is offered on this site today.
        </p>
      </section>
      <p>
        See also{" "}
        <Link href="/privacy" className="font-medium text-link underline">
          Privacy
        </Link>{" "}
        and{" "}
        <Link href="/cookies" className="font-medium text-link underline">
          Cookies
        </Link>
        .
      </p>
    </InfoPage>
  )
}
