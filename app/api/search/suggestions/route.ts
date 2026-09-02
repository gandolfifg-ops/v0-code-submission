const CANADA_SUGGESTIONS = [
  "University of Toronto",
  "UBC",
  "McGill University",
  "Loran Scholars",
  "Schulich Leader Scholarships",
  "Vanier Canada Graduate Scholarships",
  "OSAP",
  "Canada Student Loan",
  "Student Line of Credit",
] as const

const US_SUGGESTIONS = [
  "Harvard University",
  "UCLA",
  "Stanford University",
  "FAFSA",
  "Pell Grant",
  "Direct Subsidized Loan",
  "Direct Unsubsidized Loan",
  "Private Student Loan",
] as const

function parseCountry(value: string | null): "CA" | "US" {
  const raw = (value ?? "CA").trim().toUpperCase()
  if (raw === "US" || raw === "USA" || raw === "UNITED STATES") return "US"
  return "CA"
}

export async function GET(req: Request) {
  const url = new URL(req.url)
  const q = (url.searchParams.get("q") ?? "").trim().toLowerCase()
  const country = parseCountry(url.searchParams.get("country"))
  const pool = country === "US" ? US_SUGGESTIONS : CANADA_SUGGESTIONS

  if (!q) {
    return Response.json({ suggestions: [] })
  }

  const suggestions = pool.filter((item) => item.toLowerCase().includes(q)).slice(0, 8)
  return Response.json({ suggestions })
}
