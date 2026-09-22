import type { Metadata } from "next"
import { LoanLeadNextSteps } from "@/features/loans/components/LoanLeadNextSteps"
import { pageMeta } from "@/lib/seo"

export const metadata: Metadata = pageMeta(
  "Private loan next steps — WealthNutz",
  "Government aid first, then school aid, then optional private lenders. Education only — not a loan offer.",
  "/loans/next",
)

export default function LoanLeadNextPage() {
  return <LoanLeadNextSteps />
}
