"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { getStoredCountry, subscribeStudentProfile } from "@/features/student-profile/store"
import {
  groupSiteSearchHits,
  schoolLiveAwardsHref,
  type SiteSearchHit,
} from "@/lib/siteSearch"

function HitList({ hits, schoolActions }: { hits: SiteSearchHit[]; schoolActions?: boolean }) {
  return (
    <ul className="mt-3 divide-y divide-border rounded-2xl border border-border bg-card">
      {hits.map((hit) => (
        <li key={hit.id} className="px-4 py-3">
          <Link
            href={hit.href}
            className="flex min-h-11 items-center text-sm font-medium text-foreground hover:text-link"
          >
            {hit.label}
          </Link>
          <p className="text-xs text-muted-foreground">{hit.blurb}</p>
          {schoolActions && hit.kind === "school" && (
            <Link
              href={schoolLiveAwardsHref(hit)}
              className="mt-2 inline-flex min-h-11 items-center text-sm font-semibold text-link underline underline-offset-4"
            >
              Search live awards
            </Link>
          )}
        </li>
      ))}
    </ul>
  )
}

export function SiteSearchResults({ query }: { query: string }) {
  const [country, setCountry] = useState<"Canada" | "USA">("Canada")

  useEffect(() => {
    const sync = () => {
      const stored = getStoredCountry()
      if (stored) setCountry(stored)
    }
    sync()
    return subscribeStudentProfile(sync)
  }, [])

  const q = query.trim()
  const groups = q ? groupSiteSearchHits(q, country) : null
  const hasHits = Boolean(
    groups &&
      (groups.schools.length || groups.guides.length || groups.products.length || groups.tools.length),
  )

  return (
    <article className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
      <p className="text-xs font-semibold uppercase tracking-widest text-link">Search</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        {q ? `Results for “${q}”` : "Search WealthNutz"}
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        School pages, guides, and Marketplace products on this site. Live award lists are on
        Scholarships. Confirm amounts and deadlines on official sites.
      </p>

      {!q && (
        <p className="mt-6 text-sm text-muted-foreground">
          Try a school (Queen’s, UBC), a tool (OSAP, FAFSA), or a bank (EQ Bank).
        </p>
      )}

      {q && !hasHits && (
        <p className="mt-6 text-sm text-muted-foreground">No on-site pages matched that query.</p>
      )}

      {groups && groups.schools.length > 0 && (
        <section className="mt-8">
          <h2 className="text-lg font-semibold text-foreground">School pages</h2>
          <HitList hits={groups.schools} schoolActions />
        </section>
      )}

      {groups && groups.guides.length > 0 && (
        <section className="mt-8">
          <h2 className="text-lg font-semibold text-foreground">Guides</h2>
          <HitList hits={groups.guides} />
        </section>
      )}

      {groups && groups.products.length > 0 && (
        <section className="mt-8">
          <h2 className="text-lg font-semibold text-foreground">Marketplace</h2>
          <HitList hits={groups.products} />
        </section>
      )}

      {groups && groups.tools.length > 0 && (
        <section className="mt-8">
          <h2 className="text-lg font-semibold text-foreground">Tools</h2>
          <HitList hits={groups.tools} />
        </section>
      )}

      {q && (
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link
            href={`/scholarships?q=${encodeURIComponent(q)}`}
            className="inline-flex min-h-11 items-center justify-center rounded-xl bg-gold px-4 text-sm font-bold text-gold-foreground hover:bg-gold-hover"
          >
            Search live scholarships for this query
          </Link>
          <Link
            href={`/loans?q=${encodeURIComponent(q)}`}
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-border bg-card px-4 text-sm font-semibold text-foreground hover:bg-muted"
          >
            Search loan pages
          </Link>
        </div>
      )}
    </article>
  )
}
