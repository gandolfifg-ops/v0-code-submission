import type { MetadataRoute } from "next"
import { SCHOOL_PAGES, schoolPagePath } from "@/features/scholarships/schools"
import { SITE_ORIGIN } from "@/lib/seo"

const STATIC_PATHS = [
  "/",
  "/scholarships",
  "/loans",
  "/chat",
  "/saved",
  "/schools",
  "/about",
  "/help",
  "/contact",
  "/privacy",
  "/terms",
  "/cookies",
  "/search",
  "/guides/best-student-bank-canada",
  "/guides/osap-vs-private-loans",
] as const

export default function sitemap(): MetadataRoute.Sitemap {
  const schoolPaths = SCHOOL_PAGES.map((school) => schoolPagePath(school))
  const lastModified = new Date()

  return [...STATIC_PATHS, ...schoolPaths].map((path) => ({
    url: path === "/" ? `${SITE_ORIGIN}/` : `${SITE_ORIGIN}${path}`,
    lastModified,
  }))
}
