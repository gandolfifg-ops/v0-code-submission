import type { Metadata } from "next"
import { pageMeta } from "@/lib/seo"

export const metadata: Metadata = pageMeta(
  "Partners for financial-aid offices — WealthNutz",
  "Partner with WealthNutz to help students find official awards and aid links. No paid scholarship rankings.",
  "/partners",
)

export default function PartnersLayout({ children }: { children: React.ReactNode }) {
  return children
}
