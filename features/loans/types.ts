export type LoanCountry = "Canada" | "USA"
export type LoanType = "Student" | "Personal" | "Auto"
export type LoanSource = "live" | "curated"

export function parseLoanCountry(input: unknown): LoanCountry {
  const text = String(input ?? "")
    .trim()
    .toLowerCase()
    .replace(/\./g, "")
  if (!text) return "Canada"
  if (
    text === "usa" ||
    text === "us" ||
    text === "united states" ||
    text === "united states of america" ||
    text === "america"
  ) {
    return "USA"
  }
  if (text === "canada" || text === "ca" || text === "can") return "Canada"
  return "Canada"
}

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
