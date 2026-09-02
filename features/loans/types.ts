export type LoanCountry = "Canada" | "USA"
export type LoanType = "Student" | "Personal" | "Auto"
export type LoanSource = "live" | "curated"

export type LoanResult = {
  id: string
  name: string
  country: LoanCountry
  loanType: LoanType
  tagline: string
  advertisedRate: string
  highlight: string
  href: string
  cta: string
  source: LoanSource
}
