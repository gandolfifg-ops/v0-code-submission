import Link from "next/link"
import { RelatedLinks } from "@/components/RelatedLinks"
import { Breadcrumbs } from "@/components/layout/Breadcrumbs"
import { SchoolAwardLinkCard } from "@/features/scholarships/components/SchoolAwardLinkCard"
import type { SchoolAwardsData } from "@/features/scholarships/schools/types"
import { schoolPagePath } from "@/features/scholarships/schools"

export function SchoolAwardsPage({ school }: { school: SchoolAwardsData }) {
  const searchHref = "/scholarships?school=" + encodeURIComponent(school.name)
  const path = schoolPagePath(school)

  return (
    <article className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Schools", path: "/schools" },
          { name: school.name, path },
        ]}
      />
      <p className="mt-3 text-xs font-semibold uppercase tracking-widest text-link">Schools</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        {school.name} scholarships
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        Curated official links for {school.name} students in {school.region}. This page is not a
        live search and not a complete awards database. Confirm eligibility on each official site.
        Tap Save on a link to track it on the Saved page (this browser only).
      </p>

      <ul className="mt-8 space-y-3">
        {school.links.map((item) => (
          <SchoolAwardLinkCard key={item.id} link={item} schoolName={school.slug} />
        ))}
      </ul>

      <Link
        href={searchHref}
        className="mt-8 inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-gold px-4 text-sm font-bold text-gold-foreground transition-colors hover:bg-gold-hover sm:w-auto"
      >
        Search live awards for {school.name}
      </Link>

      <RelatedLinks
        title="Also useful"
        links={[
          { href: "/loans", label: "Loan Tools" },
          {
            href:
              school.country === "USA"
                ? "/guides/fafsa-vs-private-loans"
                : "/guides/osap-vs-private-loans",
            label: school.country === "USA" ? "FAFSA vs private loans" : "OSAP vs private loans",
          },
          { href: "/schools", label: "All school pages" },
        ]}
      />
    </article>
  )
}
