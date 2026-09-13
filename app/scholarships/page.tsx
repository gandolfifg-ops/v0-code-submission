import type { Metadata } from "next"
import { ScholarshipFinder } from "@/features/scholarships/components/ScholarshipFinder"
import { pageMeta } from "@/lib/seo"

export const metadata: Metadata = pageMeta(
  "Scholarship search for Canada and the US — WealthNutz",
  "Search university, government, and foundation scholarship pages. Amounts and deadlines may be incomplete — confirm on the official award page.",
  "/scholarships",
)

type ScholarshipsPageProps = {
  searchParams: Promise<{ school?: string; q?: string }>
}

export default async function ScholarshipsPage({ searchParams }: ScholarshipsPageProps) {
  const params = await searchParams
  const school = typeof params.school === "string" ? params.school : ""
  const query = typeof params.q === "string" ? params.q : ""
  return <ScholarshipFinder initialSchool={school} initialQuery={query} />
}
