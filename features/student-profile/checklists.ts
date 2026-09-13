import type { LoanCountry, LoanType } from "@/features/loans/types"

export const SCHOLARSHIP_CHECKLIST = [
  "Student ID or proof of enrollment",
  "Transcript or recent grades",
  "Personal statement or short essay",
  "Confirm deadline and eligibility on the official page",
] as const

export function loanRequirements(country: LoanCountry, loanType: LoanType): readonly string[] {
  if (loanType === "Student") {
    if (country === "Canada") {
      return ["Apply through your province or territory; NSLSC manages the federal portion."]
    }
    return ["Start with FAFSA on studentaid.gov. Private loans need a credit check and often a cosigner."]
  }
  if (loanType === "Personal") {
    if (country === "Canada") {
      return ["Confirm rate, fees, and eligibility on the bank’s official personal loans page."]
    }
    return ["A credit check is typical. Confirm APR, fees, and eligibility on the official lender site."]
  }
  if (country === "Canada") {
    return ["Confirm rate, term, and fees on the bank’s official auto loans page."]
  }
  return ["Confirm APR, term, and fees on the official auto lender site."]
}
