import type { Metadata } from "next"
import { SiteSearchResults } from "@/features/search/SiteSearchResults"
import { pageMeta } from "@/lib/seo"

export const metadata: Metadata = pageMeta(
  "Search WealthNutz — schools, guides, and products",
  "Find school scholarship pages, guides, Marketplace products, and jump into live scholarship or loan search.",
  "/search",
)

type SearchPageProps = {
  searchParams: Promise<{ q?: string }>
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams
  const query = typeof params.q === "string" ? params.q : ""
  return <SiteSearchResults query={query} />
}
