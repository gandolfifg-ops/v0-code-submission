import {
  SCHOOL_PAGES,
  normalizeSchoolKey,
  type SchoolAwardsData,
} from "@/features/scholarships/schools"
import type { StudentCountry } from "@/features/student-profile/types"

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

function hasPhrase(haystack: string, phrase: string): boolean {
  const needle = normalizeSchoolKey(phrase).replace(/'/g, "")
  if (needle.length < 3) return false
  const re = new RegExp(`(?:^|[^a-z0-9])${escapeRegExp(needle)}(?:[^a-z0-9]|$)`)
  return re.test(haystack)
}

function schoolPhrases(school: SchoolAwardsData): string[] {
  const phrases = [school.name, school.searchName, school.slug.replace(/-/g, " ")]
  for (const alias of school.aliases ?? []) phrases.push(alias)
  if (school.slug === "york") {
    return phrases.filter((item) => normalizeSchoolKey(item).length >= 6 || /yorku/i.test(item))
  }
  if (school.slug === "uw") {
    return phrases.filter((item) => normalizeSchoolKey(item).length >= 5)
  }
  if (school.slug === "western") {
    return phrases.filter((item) => /western university|uwo/i.test(item))
  }
  return phrases.filter((item) => {
    const key = normalizeSchoolKey(item)
    if (key === "queen") return false
    return key.length >= 3
  })
}

export function findSchoolsInText(text: string): SchoolAwardsData[] {
  const haystack = normalizeSchoolKey(text).replace(/'/g, "")
  if (!haystack) return []
  const found: SchoolAwardsData[] = []
  const ranked = [...SCHOOL_PAGES].sort((a, b) => b.name.length - a.name.length)
  for (const school of ranked) {
    if (schoolPhrases(school).some((phrase) => hasPhrase(haystack, phrase))) {
      found.push(school)
    }
  }
  if (found.some((item) => item.slug === "nyu")) {
    return found.filter((item) => item.slug !== "york")
  }
  return found
}

export function schoolChipLabel(school: SchoolAwardsData): string {
  if (school.slug === "queens") return "Queen’s page"
  if (school.slug === "u-of-t") return "U of T page"
  if (school.slug === "ubc") return "UBC page"
  return `${school.name} page`
}

const CANADA_BANKING =
  /\b(canada|canadian|chequing|osap|eq bank|tangerine|rbc advantage)\b/i
const US_BANKING =
  /\b(united states|\bu\.?s\.?a?\b|\busa\b|fafsa|checking|sofi|ally bank|capital one)\b/i
const BANKING_TOPIC =
  /\b(best student bank|student bank|bank account|banking|chequing|checking|no-fee|no fee student)\b/i

export function bankingGuideIntent(
  text: string,
  country: StudentCountry | null,
): "canada" | "usa" | null {
  if (!BANKING_TOPIC.test(text) && !CANADA_BANKING.test(text) && !US_BANKING.test(text)) {
    if (!/\bbank(s|ing)?\b/i.test(text)) return null
  }
  const wantsBank = BANKING_TOPIC.test(text) || /\bbest\b.*\bbank/i.test(text) || /\bno-fee\b/i.test(text)
  if (!wantsBank) return null
  const canada = CANADA_BANKING.test(text)
  const usa = US_BANKING.test(text)
  if (canada && !usa) return "canada"
  if (usa && !canada) return "usa"
  if (country === "USA") return "usa"
  return "canada"
}
