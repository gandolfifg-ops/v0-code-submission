import type { Metadata } from "next"
import { CardsHome } from "@/features/marketplace/components/CardsHome"
import { pageMeta } from "@/lib/seo"

export const metadata: Metadata = pageMeta(
  "Student credit cards in Canada and the US — WealthNutz",
  "Compare official student credit card hubs from major banks. Confirm fees and offers on the issuer site. Education only — not approval advice.",
  "/cards",
)

export default function CardsPage() {
  return <CardsHome />
}
