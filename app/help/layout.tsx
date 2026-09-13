import type { ReactNode } from "react"
import { pageMeta } from "@/lib/seo"

export const metadata = pageMeta(
  "Help — WealthNutz",
  "Answers about WealthNutz scholarships, loans, chat, and how we list advertised products.",
  "/help",
)

export default function HelpLayout({ children }: { children: ReactNode }) {
  return children
}
