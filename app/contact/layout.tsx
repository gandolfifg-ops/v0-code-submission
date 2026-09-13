import type { ReactNode } from "react"
import { pageMeta } from "@/lib/seo"

export const metadata = pageMeta(
  "Contact — WealthNutz",
  "Contact WealthNutz about the student finance site, partnerships, or a listing error.",
  "/contact",
)

export default function ContactLayout({ children }: { children: ReactNode }) {
  return children
}
