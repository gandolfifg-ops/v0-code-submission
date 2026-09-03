const CANADA_SCHOLARSHIPS = [
  "University of Toronto",
  "UBC",
  "McGill University",
  "Loran Scholars",
  "Schulich Leader Scholarships",
  "Vanier Canada Graduate Scholarships",
] as const

const US_SCHOLARSHIPS = [
  "Harvard University",
  "UCLA",
  "Stanford University",
  "Pell Grant",
  "FAFSA",
] as const

const CANADA_LOANS = [
  "OSAP",
  "Canada Student Loan",
  "Student Line of Credit",
  "NSLSC",
  "Student loan",
  "Personal loan",
  "Auto loan",
] as const

const US_LOANS = [
  "Direct Subsidized Loan",
  "Direct Unsubsidized Loan",
  "Private Student Loan",
  "Student loan",
  "Personal loan",
  "Auto loan",
  "FAFSA",
] as const

function parseCountry(value: string | null): "CA" | "US" {
  const raw = (value ?? "CA").trim().toUpperCase()
  if (raw === "US" || raw === "USA" || raw === "UNITED STATES") return "US"
  return "CA"
}

function parseType(value: string | null): "loans" | "scholarships" {
  const raw = (value ?? "scholarships").trim().toLowerCase()
  if (raw === "loans" || raw === "loan") return "loans"
  return "scholarships"
}

function poolFor(type: "loans" | "scholarships", country: "CA" | "US"): readonly string[] {
  if (type === "loans") return country === "US" ? US_LOANS : CANADA_LOANS
  return country === "US" ? US_SCHOLARSHIPS : CANADA_SCHOLARSHIPS
}

export async function GET(req: Request) {
  const url = new URL(req.url)
  const q = (url.searchParams.get("q") ?? "").trim().toLowerCase()
  const country = parseCountry(url.searchParams.get("country"))
  const type = parseType(url.searchParams.get("type"))
  const pool = poolFor(type, country)

  if (!q) {
    return Response.json({ suggestions: [] })
  }

  const suggestions = pool.filter((item) => item.toLowerCase().includes(q)).slice(0, 8)
  return Response.json({ suggestions })
}
