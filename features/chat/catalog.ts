import { MARKETPLACE_PRODUCTS } from "@/features/marketplace/data/products"
import { OFFICIAL_LOAN_PAGES } from "@/features/loans/data/official"
import {
  SCHOOL_PAGES,
  schoolPagePath,
  type SchoolAwardsData,
} from "@/features/scholarships/schools"
import type { StudentCountry } from "@/features/student-profile/types"
import { CHAT_SYSTEM_RULES } from "@/features/chat/constants"
import { findSchoolsInText, bankingGuideIntent } from "@/features/chat/mentions"

const OFFICIAL_START_IDS = new Set([
  "ca-nslsc",
  "ca-student-grants-loans",
  "ca-osap",
  "ca-studentaid-bc",
  "ca-alberta-aid",
  "ca-studentaid-sk",
  "ca-studentaid-ns",
  "ca-afe-quebec",
  "us-fafsa",
  "us-federal-aid",
])

export function normalizeChatCountry(value: unknown): StudentCountry | null {
  if (value === "USA" || value === "US" || value === "United States") return "USA"
  if (value === "Canada" || value === "CA") return "Canada"
  return null
}

function marketplaceNames(country: "CA" | "US"): string {
  return MARKETPLACE_PRODUCTS.filter((item) => item.country === country)
    .map((item) => item.name)
    .join("; ")
}

function schoolCatalogLine(school: SchoolAwardsData): string {
  return `- ${school.name} (${school.country}) → ${schoolPagePath(school)}`
}

function officialLoanLines(): string {
  return OFFICIAL_LOAN_PAGES.filter((item) => OFFICIAL_START_IDS.has(item.id))
    .map((item) => `- ${item.name} (${item.country}): ${item.href}`)
    .join("\n")
}

export function compactCatalog(country: StudentCountry | null, school?: string): string {
  const countryLine = country
    ? `Student country: ${country === "USA" ? "United States" : "Canada"}. Stay in this country unless they ask about the other.`
    : "Student country is unset. Ask once if needed; default banking/aid to Canada until they specify."
  const profileSchool = school?.trim()
  const profileLine = profileSchool
    ? `Profile school (browser only, may be free text): ${profileSchool}`
    : "Profile school: not set."

  return `CATALOG — only use these internal paths and product names. Do not invent awards, APRs, or other products.

${countryLine}
${profileLine}

School pages:
${SCHOOL_PAGES.map(schoolCatalogLine).join("\n")}
Directory: /schools
Search: /scholarships and /loans
Marketplace: /

Marketplace products (Canada): ${marketplaceNames("CA")}
Marketplace products (United States): ${marketplaceNames("US")}

Official loan start URLs:
${officialLoanLines()}

Guides:
- /guides/best-student-bank-canada — Canada no-fee / student-fee everyday accounts (same advertised comparison as Marketplace)
- /guides/best-student-bank-usa — US no-fee / student-fee everyday accounts
- /guides/osap-vs-private-loans — Ontario OSAP vs private loans (education, not advice)

Canada banking names you may cite: EQ Bank Personal Account; Tangerine Chequing; RBC Advantage Banking for Students. Always add: confirm on the bank site.
US banking names you may cite: SoFi Student Checking & Savings; Ally Bank Online Savings; Capital One checking for students. Always add: confirm on the bank site.`
}

function turnInstructions(lastUser: string, country: StudentCountry | null): string {
  const named = findSchoolsInText(lastUser)
  const parts: string[] = []
  if (named.length > 0) {
    const listed = named
      .map((school) => `${school.name} → ${schoolPagePath(school)}`)
      .join("; ")
    parts.push(
      `The student named: ${listed}. Your FIRST SENTENCE must include the internal school page path.`,
    )
  }
  const guide = bankingGuideIntent(lastUser, country)
  if (guide === "canada") {
    parts.push(
      'They asked about student banking in Canada. Summarize /guides/best-student-bank-canada, name 2–3 Canada Marketplace products (not US products), and say "confirm on the bank site".',
    )
  } else if (guide === "usa") {
    parts.push(
      'They asked about student banking in the United States. Summarize /guides/best-student-bank-usa, name 2–3 US Marketplace products (not Canada products), and say "confirm on the bank site".',
    )
  }
  if (parts.length === 0) return ""
  return `\nThis turn:\n${parts.map((line) => `- ${line}`).join("\n")}`
}

export function buildChatSystemPrompt(opts: {
  country: StudentCountry | null
  school?: string
  lastUser?: string
}): string {
  const catalog = compactCatalog(opts.country, opts.school)
  const extra = opts.lastUser ? turnInstructions(opts.lastUser, opts.country) : ""
  return `${CHAT_SYSTEM_RULES}\n\n${catalog}${extra}`
}
