import type { Metadata } from "next"
import Link from "next/link"
import { CardsComparisonTable } from "@/features/marketplace/components/CardsComparisonTable"
import { GuideToolsRail } from "@/features/guides/components/GuideToolsRail"
import { cardComparisonRows } from "@/features/marketplace/data/cards"
import { pageMeta } from "@/lib/seo"

export const metadata: Metadata = pageMeta(
  "Student credit cards in Canada — WealthNutz",
  "Short guide to official Canadian bank student credit card hubs. Confirm fees and offers on the issuer site.",
  "/guides/student-credit-cards-canada",
)

export default function StudentCreditCardsCanadaGuide() {
  return (
    <article className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <p className="text-xs font-semibold uppercase tracking-widest text-link">Guides</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        Student credit cards in Canada
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">Updated September 2026</p>
      <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground">
        This short guide points to official issuer hubs (RBC, TD, Scotiabank, BMO, CIBC). It is not
        approval advice and does not invent APRs. Always confirm annual fees and welcome offers on
        the bank site.
      </p>
      <CardsComparisonTable rows={cardComparisonRows("CA")} title="Canada student cards snapshot" />
      <p className="mt-6 text-sm">
        Compare the same list on{" "}
        <Link href="/cards" className="font-medium text-link underline">
          Cards (Canada)
        </Link>
        .
      </p>
      <GuideToolsRail country="CA" />
    </article>
  )
}
