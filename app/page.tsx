import type { Metadata } from "next"
import { MarketplaceHome } from "@/features/marketplace/components/MarketplaceHome"
import { pageMeta } from "@/lib/seo"

export const metadata: Metadata = pageMeta(
  "Student banking, scholarships, and loans — WealthNutz",
  "Marketplace for student bank accounts, investing apps, scholarships, and loan tools in Canada and the US. Advertised products only — not ratings or reviews.",
  "/",
)

export default function HomePage() {
  return <MarketplaceHome />
}
