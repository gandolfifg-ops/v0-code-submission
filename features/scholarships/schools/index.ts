import { carleton } from "@/features/scholarships/schools/carleton"
import { georgeBrown } from "@/features/scholarships/schools/george-brown"
import { guelph } from "@/features/scholarships/schools/guelph"
import { mcgill } from "@/features/scholarships/schools/mcgill"
import { mcmaster } from "@/features/scholarships/schools/mcmaster"
import { ontarioTech } from "@/features/scholarships/schools/ontario-tech"
import { queens } from "@/features/scholarships/schools/queens"
import type { SchoolAwardsData } from "@/features/scholarships/schools/types"
import { uOfT } from "@/features/scholarships/schools/u-of-t"
import { ubc } from "@/features/scholarships/schools/ubc"
import { waterloo } from "@/features/scholarships/schools/waterloo"
import { western } from "@/features/scholarships/schools/western"
import { york } from "@/features/scholarships/schools/york"

export type { SchoolAwardsData, SchoolAwardLink } from "@/features/scholarships/schools/types"

export const SCHOOL_PAGES: SchoolAwardsData[] = [
  queens,
  uOfT,
  mcgill,
  carleton,
  waterloo,
  mcmaster,
  york,
  ontarioTech,
  guelph,
  western,
  georgeBrown,
  ubc,
]

const lookup = new Map<string, SchoolAwardsData>()

/** Curly/straight apostrophes and extra spaces so Queen’s matches Queen's. */
export function normalizeSchoolKey(input: string): string {
  return input
    .normalize("NFKC")
    .replace(/[\u2018\u2019\u201B\u2032`]/g, "'")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
}

function addKey(key: string, school: SchoolAwardsData) {
  const trimmed = key.trim()
  if (!trimmed) return
  lookup.set(trimmed, school)
  lookup.set(trimmed.toLowerCase(), school)
  lookup.set(normalizeSchoolKey(trimmed), school)
}

for (const school of SCHOOL_PAGES) {
  addKey(school.slug, school)
  addKey(school.name, school)
  addKey(school.searchName, school)
  for (const alias of school.aliases ?? []) addKey(alias, school)
}

export function resolveSchool(input: string): SchoolAwardsData | null {
  const raw = input.trim()
  if (!raw) return null
  let decoded = raw
  try {
    decoded = decodeURIComponent(raw.replace(/\+/g, " ")).trim()
  } catch {
    decoded = raw
  }
  return (
    lookup.get(decoded) ??
    lookup.get(decoded.toLowerCase()) ??
    lookup.get(normalizeSchoolKey(decoded)) ??
    null
  )
}

export function schoolPagePath(school: SchoolAwardsData): string {
  return `/scholarships/${school.slug}`
}

export function getSchoolAwards(slug: string): SchoolAwardsData | null {
  return resolveSchool(slug)
}

export function schoolStaticParams(): { school: string }[] {
  return SCHOOL_PAGES.map((school) => ({ school: school.slug }))
}
