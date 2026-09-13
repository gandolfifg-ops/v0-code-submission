import type { Metadata } from "next"

export const SITE_ORIGIN = "https://www.wealthnutz.com"

export function pageMeta(title: string, description: string, path = "/"): Metadata {
  const pathname = path.startsWith("/") ? path : `/${path}`
  const url = pathname === "/" ? `${SITE_ORIGIN}/` : `${SITE_ORIGIN}${pathname}`
  return {
    metadataBase: new URL(SITE_ORIGIN),
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      type: "website",
      url,
      siteName: "WealthNutz",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  }
}
