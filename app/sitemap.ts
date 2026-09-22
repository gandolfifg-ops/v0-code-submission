import type { MetadataRoute } from "next"
import { SCHOOL_PAGES, schoolPagePath } from "@/features/scholarships/schools"
import { SITE_ORIGIN } from "@/lib/seo"

/** Content-aware lastmod — bump when the page’s editorial content changes. */
const STATIC_ENTRIES: { path: string; lastModified: string }[] = [
  { path: "/", lastModified: "2026-09-21" },
  { path: "/scholarships", lastModified: "2026-09-16" },
  { path: "/loans", lastModified: "2026-09-21" },
  { path: "/loans/next", lastModified: "2026-09-21" },
  { path: "/cards", lastModified: "2026-09-21" },
  { path: "/chat", lastModified: "2026-09-13" },
  { path: "/saved", lastModified: "2026-09-16" },
  { path: "/schools", lastModified: "2026-09-16" },
  { path: "/digest", lastModified: "2026-09-21" },
  { path: "/partners", lastModified: "2026-09-21" },
  { path: "/kit", lastModified: "2026-09-21" },
  { path: "/about", lastModified: "2026-09-21" },
  { path: "/help", lastModified: "2026-09-21" },
  { path: "/contact", lastModified: "2026-09-16" },
  { path: "/privacy", lastModified: "2026-09-21" },
  { path: "/terms", lastModified: "2026-09-21" },
  { path: "/cookies", lastModified: "2026-09-21" },
  { path: "/search", lastModified: "2026-09-01" },
  { path: "/guides/best-student-bank-canada", lastModified: "2026-09-21" },
  { path: "/guides/best-student-bank-usa", lastModified: "2026-09-21" },
  { path: "/guides/student-credit-cards-canada", lastModified: "2026-09-21" },
  { path: "/guides/student-credit-cards-usa", lastModified: "2026-09-21" },
  { path: "/guides/osap-vs-private-loans", lastModified: "2026-09-21" },
  { path: "/guides/fafsa-vs-private-loans", lastModified: "2026-09-21" },
  { path: "/guides/resp-tfsa-for-students", lastModified: "2026-09-21" },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const schoolEntries = SCHOOL_PAGES.map((school) => ({
    path: schoolPagePath(school),
    lastModified: "2026-09-16",
  }))

  return [...STATIC_ENTRIES, ...schoolEntries].map((entry) => ({
    url: entry.path === "/" ? `${SITE_ORIGIN}/` : `${SITE_ORIGIN}${entry.path}`,
    lastModified: new Date(entry.lastModified),
  }))
}
