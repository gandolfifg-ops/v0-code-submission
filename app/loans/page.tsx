import type { Metadata } from "next"
import { LoanTools } from "@/features/loans/components/LoanTools"
import { pageMeta } from "@/lib/seo"

export const metadata: Metadata = pageMeta(
  "Student loan tools for Canada and the US — WealthNutz",
  "Find advertised student, personal, and auto lenders and estimate a payment. Listed rates are not guaranteed quotes.",
)

export default function LoansPage() {
  return <LoanTools />
}
