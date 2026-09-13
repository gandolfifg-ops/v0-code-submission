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
  return SCHOLARSHIP_LEVEL_LABELS[normalizeScholarshipLevel(level)]
}

/** Map saved or display text onto the shared internal level values. */
export function normalizeScholarshipLevel(level: string): (typeof SCHOLARSHIP_LEVELS)[number] {
  const trimmed = level.trim()
  if (!trimmed) return "Any level"
  for (const value of SCHOLARSHIP_LEVELS) {
    if (value === trimmed || SCHOLARSHIP_LEVEL_LABELS[value] === trimmed) return value
  }
  const lower = trimmed.toLowerCase()
  if (lower.includes("high school") || lower.includes("applying to") || lower.includes("entering college")) {
    return "High school / entering college"
  }
  if (/\bgraduate\b/.test(lower) && !/under/.test(lower)) return "Graduate"
  if (lower.includes("undergrad") || lower.includes("first-year") || lower.includes("first year")) {
    return "Undergraduate"
  }
  return "Any level"
}
