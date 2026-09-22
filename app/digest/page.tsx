import type { Metadata } from "next"
import { DigestSignup } from "@/features/digest/components/DigestSignup"
import { InfoPage } from "@/components/layout/InfoPage"
import { pageMeta } from "@/lib/seo"

export const metadata: Metadata = pageMeta(
  "Weekly digest — WealthNutz",
  "Optional weekly student money email for Canada and the US. Search stays free. No SIN/SSN or credit score collected.",
  "/digest",
)

export default function DigestPage() {
  return (
    <InfoPage
      title="Weekly digest"
      lede="Optional email with official aid reminders and Marketplace highlights. Not financial advice."
    >
      <DigestSignup />
      <p className="text-sm text-muted-foreground">
        We store your signup in this browser and may forward it to our email webhook when configured.
        Partner banking/card updates are opt-in only. See Privacy for details.
      </p>
    </InfoPage>
  )
}
