import type { LoanType } from "@/features/loans/types"

export const SCHOLARSHIP_CHECKLIST = [
  "Student ID or proof of enrollment",
  "Transcript or recent grades",
  "Personal statement or short essay",
  "Confirm deadline and eligibility on the official page",
] as const

export const LOAN_CHECKLISTS: Record<LoanType, readonly string[]> = {
  Student: [
    "Government-issued ID",
    "Proof of enrollment or acceptance letter",
    "Social Insurance Number / Social Security Number",
    "Cosigner details if the lender asks for one",
  ],
  Personal: [
    "Government-issued ID",
    "Proof of income or bank statements",
    "Address and contact details",
    "Confirm APR, fees, and repayment on the official page",
  ],
  Auto: [
    "Government-issued ID",
    "Proof of income",
    "Vehicle details (make, model, price) if you have them",
    "Confirm rate, term, and fees on the official page",
  ],
}
