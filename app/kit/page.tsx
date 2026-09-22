import type { Metadata } from "next"
import Link from "next/link"
import { KitWaitlist } from "@/features/kit/components/KitWaitlist"
import { InfoPage } from "@/components/layout/InfoPage"
import { pageMeta } from "@/lib/seo"

export const metadata: Metadata = pageMeta(
  "WealthNutz Kit waitlist",
  "Optional paid Kit waitlist — $9 or less if we launch. Search stays free. No Stripe checkout yet.",
  "/kit",
)

export default function KitPage() {
  return (
    <InfoPage
      title="WealthNutz Kit (waitlist)"
      lede="If we launch a Kit, it will be $9 or less. Scholarship, loan, and marketplace search stay free."
    >
      <p className="text-sm text-muted-foreground">
        No payment is collected on this page (no Stripe). Join the waitlist with email, country, and
        optional school. See{" "}
        <Link href="/privacy" className="font-medium text-link underline">
          Privacy
        </Link>{" "}
        for how we handle waitlist data.
      </p>
      <KitWaitlist />
    </InfoPage>
  )
}
