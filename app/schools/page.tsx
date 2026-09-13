import type { Metadata } from "next"
import Link from "next/link"
import { SCHOOL_PAGES, schoolPagePath } from "@/features/scholarships/schools"

export const metadata: Metadata = {
  title: "School scholarship pages — WealthNutz",
  description:
    "Official starting points for scholarships and student aid at Canadian schools. US school pages coming later.",
}

const CANADA_SCHOOLS = [...SCHOOL_PAGES].sort((a, b) => a.name.localeCompare(b.name))

export default function SchoolsIndexPage() {
  return (
    <article className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <p className="text-xs font-semibold uppercase tracking-widest text-[#C9A84C]">Schools</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        School scholarship pages
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        Curated official awards and aid links by school. These pages are not a live search.
        Confirm eligibility on each official site.
      </p>

      <div className="mt-8 grid gap-8 md:grid-cols-2">
        <section>
          <h2 className="text-lg font-semibold text-foreground">Canada</h2>
          <ul className="mt-3 divide-y divide-border rounded-2xl border border-border bg-card">
            {CANADA_SCHOOLS.map((school) => (
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
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">United States</h2>
          <p className="mt-3 rounded-2xl border border-dashed border-border bg-muted/30 px-4 py-6 text-sm text-muted-foreground">
            US school pages coming later.
          </p>
        </section>
      </div>
    </article>
  )
}
