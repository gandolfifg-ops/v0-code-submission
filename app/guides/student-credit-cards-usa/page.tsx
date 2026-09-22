import type { Metadata } from "next"
import Link from "next/link"
import { CardsComparisonTable } from "@/features/marketplace/components/CardsComparisonTable"
import { GuideToolsRail } from "@/features/guides/components/GuideToolsRail"
import { cardComparisonRows } from "@/features/marketplace/data/cards"
import { pageMeta } from "@/lib/seo"

export const metadata: Metadata = pageMeta(
  "Student credit cards in the United States — WealthNutz",
  "Short guide to official US student credit card pages (Capital One, Discover). Confirm fees and offers on the issuer site.",
  "/guides/student-credit-cards-usa",
)

export default function StudentCreditCardsUsaGuide() {
  return (
    <article className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <p className="text-xs font-semibold uppercase tracking-widest text-link">Guides</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        Student credit cards in the United States
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">Updated September 2026</p>
      <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground">
        This short guide points to official Capital One and Discover student card pages. It is not
        approval advice and does not invent APRs. Always confirm terms on the issuer site. Start
        federal aid with FAFSA before optional credit products.
      </p>
      <CardsComparisonTable
        rows={cardComparisonRows("US")}
        title="United States student cards snapshot"
      />
      <p className="mt-6 text-sm">
        Compare the same list on{" "}
        <Link href="/cards" className="font-medium text-link underline">
          Cards (United States)
        </Link>
        .
      </p>
      <GuideToolsRail country="US" />
    </article>
  )
}
