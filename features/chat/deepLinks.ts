import { schoolPagePath } from "@/features/scholarships/schools"
import type { StudentCountry } from "@/features/student-profile/types"
import {
  bankingGuideIntent,
  findSchoolsInText,
  schoolChipLabel,
} from "@/features/chat/mentions"

export type ChatDeepLink = {
  href: string
  label: string
}

const PATH_CHIPS: { pattern: RegExp; href: string; label: string }[] = [
  { pattern: /\/guides\/best-student-bank-canada\b/i, href: "/guides/best-student-bank-canada", label: "Canada bank guide" },
  { pattern: /\/guides\/best-student-bank-usa\b/i, href: "/guides/best-student-bank-usa", label: "US bank guide" },
  { pattern: /\/guides\/osap-vs-private-loans\b/i, href: "/guides/osap-vs-private-loans", label: "OSAP vs private" },
  { pattern: /\/scholarships\/[a-z0-9-]+/i, href: "", label: "" },
  { pattern: /\/scholarships(?:#|\b)/i, href: "/scholarships", label: "Scholarships" },
  { pattern: /\/schools\b/i, href: "/schools", label: "Schools" },
  { pattern: /\/loans\b/i, href: "/loans", label: "Loans" },
]

const SCHOLARSHIPS = /\b(scholarships?|bursar|awards?\b|grants?)\b/i
const LOANS = /\b(loans?|lender|osap|nslsc|apr|federal student loan|fafsa)\b/i

/** Source chips under an answer — in-app paths only. */
export function extractChatDeepLinks(
  content: string,
  country: StudentCountry | null = null,
): ChatDeepLink[] {
  const text = content.trim()
  if (!text) return []

  const links: ChatDeepLink[] = []
  const add = (href: string, label: string) => {
    if (!href || links.some((item) => item.href === href)) return
    if (links.length >= 5) return
    links.push({ href, label })
  }

  for (const school of findSchoolsInText(text)) {
    add(schoolPagePath(school), schoolChipLabel(school))
  }

  const schoolPath = text.match(/\/scholarships\/([a-z0-9-]+)/gi) ?? []
  for (const match of schoolPath) {
    const slug = match.replace(/^\/scholarships\//i, "")
    const named = findSchoolsInText(slug)[0]
    add(`/scholarships/${slug}`, named ? schoolChipLabel(named) : `${slug} page`)
  }

  if (PATH_CHIPS[0].pattern.test(text) || bankingGuideIntent(text, country) === "canada") {
    add("/guides/best-student-bank-canada", "Canada bank guide")
  }
  if (PATH_CHIPS[1].pattern.test(text) || bankingGuideIntent(text, country) === "usa") {
    add("/guides/best-student-bank-usa", "US bank guide")
  }
  if (PATH_CHIPS[2].pattern.test(text) || /\bosap\b/i.test(text)) {
    add("/guides/osap-vs-private-loans", "OSAP vs private")
  }

  if (SCHOLARSHIPS.test(text) || /\/scholarships\b/i.test(text)) {
    add("/scholarships", "Scholarships")
  }
  if (LOANS.test(text) || /\/loans\b/i.test(text)) add("/loans", "Loans")
  if (/\/schools\b/i.test(text)) add("/schools", "Schools")
  if (bankingGuideIntent(text, country)) add("/", "Marketplace")

  return links.slice(0, 5)
}
