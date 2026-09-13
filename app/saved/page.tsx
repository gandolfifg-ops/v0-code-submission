import type { Metadata } from "next"
import { SavedList } from "@/features/saved/components/SavedList"
import { pageMeta } from "@/lib/seo"

export const metadata: Metadata = pageMeta(
  "Saved — WealthNutz",
  "Scholarships and loan pages you saved in this browser. Nothing is synced to an account.",
  "/saved",
)

export default function SavedPage() {
  return <SavedList />
}
