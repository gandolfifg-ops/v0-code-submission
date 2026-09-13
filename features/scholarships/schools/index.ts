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

function addKey(key: string, school: SchoolAwardsData) {
  lookup.set(key, school)
  lookup.set(key.toLowerCase(), school)
}

for (const school of SCHOOL_PAGES) {
  addKey(school.slug, school)
  for (const alias of school.aliases ?? []) addKey(alias, school)
}

export function schoolPagePath(school: SchoolAwardsData): string {
  return `/scholarships/${encodeURIComponent(school.slug)}`
}

export function getSchoolAwards(slug: string): SchoolAwardsData | null {
  const decoded = decodeURIComponent(slug).trim()
  return lookup.get(decoded) ?? lookup.get(decoded.toLowerCase()) ?? null
}

export function schoolStaticParams(): { school: string }[] {
  const params: { school: string }[] = []
  const seen = new Set<string>()
  for (const school of SCHOOL_PAGES) {
    const slugs = [school.slug, ...(school.aliases ?? [])]
    for (const value of slugs) {
      if (seen.has(value)) continue
      seen.add(value)
      params.push({ school: value })
    }
  }
  return params
}
