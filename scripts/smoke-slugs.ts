import { SCHOOL_PAGES } from "@/features/scholarships/schools"

export const SCHOOL_SLUG_PATTERN = /^[a-z0-9-]+$/

export function schoolPageSlugs(): string[] {
  return SCHOOL_PAGES.map((school) => school.slug)
}

export function invalidSchoolPageSlugs(): string[] {
  return schoolPageSlugs().filter((slug) => !SCHOOL_SLUG_PATTERN.test(slug))
}

export function assertSchoolPageSlugs(): void {
  const invalid = invalidSchoolPageSlugs()
  if (invalid.length > 0) {
    throw new Error(`Invalid SCHOOL_PAGES slugs: ${invalid.join(", ")}`)
  }
}

