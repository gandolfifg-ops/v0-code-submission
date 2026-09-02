import Link from "next/link"
import { InfoPage } from "@/components/layout/InfoPage"

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
          Scholarship listings may come from live web search or a curated list. Loan rates shown
          are advertised on public pages, not guaranteed quotes. Always verify terms on the
          official site before you apply.
        </p>
      </section>
      <section>
        <h2 className="text-lg font-semibold text-foreground">Affiliate relationships</h2>
        <p className="mt-2">
          Some Marketplace links are affiliate links. We may receive compensation if you open a
          product. That compensation does not change our educational copy.
        </p>
      </section>
      <p>
        See also{" "}
        <Link href="/privacy" className="font-medium text-[#8B6914] underline dark:text-[#C9A84C]">
          Privacy
        </Link>{" "}
        and{" "}
        <Link href="/cookies" className="font-medium text-[#8B6914] underline dark:text-[#C9A84C]">
          Cookies
        </Link>
        .
      </p>
    </InfoPage>
  )
}
