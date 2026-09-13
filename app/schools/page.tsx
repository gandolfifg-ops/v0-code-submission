import type { Metadata } from "next"
import Link from "next/link"
import { SCHOOL_PAGES, schoolPagePath } from "@/features/scholarships/schools"
import { pageMeta } from "@/lib/seo"

export const metadata: Metadata = pageMeta(
  "School scholarship pages — WealthNutz",
  "Official starting points for scholarships and student aid at Canadian and U.S. schools. Confirm eligibility on each official site.",
  "/schools",
)

const CANADA_SCHOOLS = SCHOOL_PAGES.filter((school) => school.country === "Canada").sort((a, b) =>
  a.name.localeCompare(b.name),
)
const US_SCHOOLS = SCHOOL_PAGES.filter((school) => school.country === "USA").sort((a, b) =>
  a.name.localeCompare(b.name),
)

function SchoolList({ schools }: { schools: typeof SCHOOL_PAGES }) {
  return (
    <ul className="mt-3 divide-y divide-border rounded-2xl border border-border bg-card">
      {schools.map((school) => (
        <li key={school.slug}>
          <Link
            href={schoolPagePath(school)}
            className="flex min-h-11 items-center px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            {school.name}
          </Link>
        </li>
      ))}
    </ul>
  )
}

export default function SchoolsIndexPage() {
  return (
    <article className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <p className="text-xs font-semibold uppercase tracking-widest text-link">Schools</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        School scholarship pages
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        Curated official awards and aid links by school. These pages are not a live search
        and not a complete awards database. Confirm eligibility on each official site.
      </p>

      <div className="mt-8 grid gap-8 md:grid-cols-2">
        <section>
          <h2 className="text-lg font-semibold text-foreground">Canada</h2>
          <SchoolList schools={CANADA_SCHOOLS} />
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">United States</h2>
          <SchoolList schools={US_SCHOOLS} />
        </section>
      </div>
    </article>
  )
}
