import type { Metadata } from "next"
import { StudentChat } from "@/features/chat/components/StudentChat"
import { pageMeta } from "@/lib/seo"

export const metadata: Metadata = pageMeta(
  "Student finance chat — WealthNutz",
  "Ask about scholarships, student loans, and banking in Canada or the US. General education only — not personalized financial advice.",
)

export default function ChatPage() {
  return <StudentChat />
}
