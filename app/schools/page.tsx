import type { Metadata } from "next"
import Link from "next/link"
import { SCHOOL_PAGES, schoolPagePath } from "@/features/scholarships/schools"
import { pageMeta } from "@/lib/seo"

export const metadata: Metadata = pageMeta(
  "School scholarship pages — WealthNutz",
  "Official starting points for scholarships and student aid at Canadian schools. US school pages coming later.",
  "/schools",
)

const CANADA_SCHOOLS = [...SCHOOL_PAGES].sort((a, b) => a.name.localeCompare(b.name))

export default function SchoolsIndexPage() {
  return (
    <article className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <p className="text-xs font-semibold uppercase tracking-widest text-link">Schools</p>
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
          <div className="mt-3 rounded-2xl border border-border bg-card p-4 md:p-5">
            <p className="text-sm leading-relaxed text-muted-foreground">
              US school pages ship next. Use Scholarships search and{" "}
              <a
                href="https://studentaid.gov"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-link underline underline-offset-4"
              >
                studentaid.gov
              </a>{" "}
              meanwhile.
            </p>
            <Link
              href="/scholarships"
              className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-gold px-4 text-sm font-bold text-gold-foreground transition-colors hover:bg-gold-hover sm:w-auto"
            >
              Search scholarships
            </Link>
          </div>
        </section>
      </div>
    </article>
  )
}
