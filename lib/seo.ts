import type { Metadata } from "next"

export const SITE_ORIGIN = "https://www.wealthnutz.com"
export const OG_IMAGE_PATH = "/opengraph-image"
export const OG_IMAGE_URL = `${SITE_ORIGIN}${OG_IMAGE_PATH}`

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
      images: [{ url: OG_IMAGE_URL, width: 1200, height: 630, alt: "WealthNutz" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [OG_IMAGE_URL],
    },
  }
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "WealthNutz",
    url: SITE_ORIGIN,
    logo: `${SITE_ORIGIN}/images/logo-squirrel.png`,
    description:
      "Student banking, scholarships, and loans for Canada and the United States. Education only.",
  }
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.path === "/" ? `${SITE_ORIGIN}/` : `${SITE_ORIGIN}${item.path}`,
    })),
  }
}

export function faqPageJsonLd(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  }
}

export function articleJsonLd(opts: {
  title: string
  description: string
  path: string
  datePublished: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: opts.title,
    description: opts.description,
    datePublished: opts.datePublished,
    dateModified: opts.datePublished,
    author: { "@type": "Organization", name: "WealthNutz" },
    publisher: { "@type": "Organization", name: "WealthNutz", url: SITE_ORIGIN },
    mainEntityOfPage: opts.path === "/" ? `${SITE_ORIGIN}/` : `${SITE_ORIGIN}${opts.path}`,
  }
}
