export type ScholarshipCountry = "Canada" | "USA"

export type ScholarshipSource = "live" | "curated"

export type ScholarshipResult = {
  id: string
  title: string
  provider: string
  amount: string
  deadline: string
  lastChecked: string
  eligibility: string
  url: string
  source: ScholarshipSource
  listingKind?: "official-school" | "active"
}

export type ScholarshipFilters = {
  country: ScholarshipCountry
  major: string
  level: string
  query: string
  university: string
}

export const SCHOLARSHIP_MAJORS = [
  "Any major",
  "STEM",
  "Engineering",
  "Computer Science",
  "Business",
  "Finance",
  "Healthcare",
  "Nursing",
  "Arts",
  "Education",
  "Environmental Science",
] as const

export const SCHOLARSHIP_LEVELS = [
  "Any level",
  "High school / entering college",
  "Undergraduate",
  "Graduate",
] as const
