import { alberta } from "@/features/scholarships/schools/alberta"
import { berkeley } from "@/features/scholarships/schools/berkeley"
import { calgary } from "@/features/scholarships/schools/calgary"
import { carleton } from "@/features/scholarships/schools/carleton"
import { columbia } from "@/features/scholarships/schools/columbia"
import { concordia } from "@/features/scholarships/schools/concordia"
import { dalhousie } from "@/features/scholarships/schools/dalhousie"
import { georgeBrown } from "@/features/scholarships/schools/george-brown"
import { guelph } from "@/features/scholarships/schools/guelph"
import { harvard } from "@/features/scholarships/schools/harvard"
import { mcgill } from "@/features/scholarships/schools/mcgill"
import { mcmaster } from "@/features/scholarships/schools/mcmaster"
import { nyu } from "@/features/scholarships/schools/nyu"
import { ontarioTech } from "@/features/scholarships/schools/ontario-tech"
import { ottawa } from "@/features/scholarships/schools/ottawa"
import { penn } from "@/features/scholarships/schools/penn"
import { queens } from "@/features/scholarships/schools/queens"
import type { SchoolAwardsData } from "@/features/scholarships/schools/types"
import { sfu } from "@/features/scholarships/schools/sfu"
import { stanford } from "@/features/scholarships/schools/stanford"
import { ucla } from "@/features/scholarships/schools/ucla"
import { uiuc } from "@/features/scholarships/schools/uiuc"
import { umich } from "@/features/scholarships/schools/umich"
import { usc } from "@/features/scholarships/schools/usc"
import { utexas } from "@/features/scholarships/schools/utexas"
import { uOfT } from "@/features/scholarships/schools/u-of-t"
import { ubc } from "@/features/scholarships/schools/ubc"
import { uw } from "@/features/scholarships/schools/uw"
import { waterloo } from "@/features/scholarships/schools/waterloo"
import { western } from "@/features/scholarships/schools/western"
import { york } from "@/features/scholarships/schools/york"

export type { SchoolAwardsData, SchoolAwardLink } from "@/features/scholarships/schools/types"

export const SCHOOL_PAGES: SchoolAwardsData[] = [
  queens,
  uOfT,
  ottawa,
  mcgill,
  concordia,
  carleton,
  waterloo,
  mcmaster,
  york,
  ontarioTech,
  guelph,
  western,
  georgeBrown,
  ubc,
  sfu,
  alberta,
  calgary,
  dalhousie,
  ucla,
  berkeley,
  umich,
  nyu,
  usc,
  utexas,
  uiuc,
  uw,
  penn,
  columbia,
  stanford,
  harvard,
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
