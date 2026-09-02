import type { ScholarshipCountry } from "@/features/scholarships/types"

export type StudentCountry = ScholarshipCountry

export type StudentProfile = {
  country: StudentCountry
  school: string
  level: string
  major: string
}

export const EMPTY_PROFILE: StudentProfile = {
  country: "Canada",
  school: "",
  level: "Any level",
  major: "Any major",
}

export function isProfileFilled(profile: StudentProfile | null): boolean {
  if (!profile) return false
  return Boolean(
    profile.school.trim() ||
      (profile.level && profile.level !== "Any level") ||
      (profile.major && profile.major !== "Any major"),
  )
}
