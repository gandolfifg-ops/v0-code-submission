import Link from "next/link"
import type { SchoolAwardsData } from "@/features/scholarships/schools/types"

export function SchoolAwardsPage({ school }: { school: SchoolAwardsData }) {
  const searchHref = "/scholarships?school=" + encodeURIComponent(school.searchName)

  return (
    <article className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
      <p className="text-xs font-semibold uppercase tracking-widest text-[#C9A84C]">Schools</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        {school.name} scholarships
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        Curated official links for {school.name} students in {school.region}. This page is not a
        live search and not a complete awards database. Confirm eligibility on each official site.
      </p>

      <ul className="mt-8 space-y-3">
        {school.links.map((item) => (
          <li key={item.id} className="rounded-2xl border border-border bg-card p-4 md:p-5">
            <h2 className="text-base font-semibold text-foreground">{item.title}</h2>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.summary}</p>
            <a
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-[#8B6914] underline underline-offset-4 dark:text-[#C9A84C]"
            >
              Open official site
            </a>
          </li>
        ))}
      </ul>

      <Link
        href={searchHref}
        className="mt-8 inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-[#C9A84C] px-4 text-sm font-bold text-[#07090d] transition-colors hover:bg-[#b8973f] sm:w-auto"
      >
        Search more awards
      </Link>
    </article>
  )
}
