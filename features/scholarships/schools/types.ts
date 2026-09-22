import type { ScholarshipCountry } from "@/features/scholarships/types"

export type SchoolAwardLink = {
  id: string
  title: string
  summary: string
  href: string
}

export type SchoolAwardsData = {
  slug: string
  name: string
  aliases: string[]
  country: ScholarshipCountry
  region: string
  searchName: string
  description: string
  domains: string[]
  officialAwardsUrl: string
  officialAidUrl?: string
  rejectDomains?: string[]
  rejectTitlePatterns?: string[]
  links: SchoolAwardLink[]
  /** Reviewed-with-school badge only — never means “top ranked”. Default false; do not set on Queen’s. */
  partner?: boolean
}
