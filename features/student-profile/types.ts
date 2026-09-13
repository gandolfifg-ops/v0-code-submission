import type { ScholarshipCountry } from "@/features/scholarships/types"

export type StudentCountry = ScholarshipCountry

export type CanadaProvinceChip = "ON" | "BC" | "AB" | "QC" | "Other"

export type StudentProfile = {
  country: StudentCountry
  school: string
  level: string
  major: string
  provinceOrState: string
  graduationYear: string
}

export const EMPTY_PROFILE: StudentProfile = {
  country: "Canada",
  school: "",
  level: "Any level",
  major: "Any major",
  provinceOrState: "",
  graduationYear: "",
}

export function isProfileFilled(profile: StudentProfile | null): boolean {
  if (!profile) return false
  return Boolean(
    profile.school.trim() ||
      profile.provinceOrState.trim() ||
      profile.graduationYear.trim() ||
      (profile.level && profile.level !== "Any level") ||
      (profile.major && profile.major !== "Any major"),
  )
}
