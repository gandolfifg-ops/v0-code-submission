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

export const SCHOLARSHIP_LEVEL_LABELS: Record<(typeof SCHOLARSHIP_LEVELS)[number], string> = {
  "Any level": "Any level",
  "High school / entering college": "High school / applying to university",
  "Undergraduate": "First-year / undergraduate",
  "Graduate": "Graduate / professional",
}

export function scholarshipLevelLabel(level: string): string {
  if (level in SCHOLARSHIP_LEVEL_LABELS) {
    return SCHOLARSHIP_LEVEL_LABELS[level as (typeof SCHOLARSHIP_LEVELS)[number]]
  }
  return level
}
