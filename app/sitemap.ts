import type { MetadataRoute } from "next"
import { SCHOOL_PAGES, schoolPagePath } from "@/features/scholarships/schools"

function siteOrigin() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (explicit) return explicit.replace(/\/$/, "")
  const production = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim()
  if (production) return `https://${production.replace(/^https?:\/\//, "")}`
  const preview = process.env.VERCEL_URL?.trim()
  if (preview) return `https://${preview.replace(/^https?:\/\//, "")}`
  return "http://localhost:3000"
}

const STATIC_PATHS = [
  "/",
  "/scholarships",
  "/loans",
  "/chat",
  "/schools",
  "/guides/best-student-bank-canada",
  "/guides/osap-vs-private-loans",
] as const

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = siteOrigin()
  const schoolPaths = SCHOOL_PAGES.map((school) => schoolPagePath(school))
  const lastModified = new Date()

  return [...STATIC_PATHS, ...schoolPaths].map((path) => ({
    url: path === "/" ? `${origin}/` : `${origin}${path}`,
    lastModified,
  }))
}
