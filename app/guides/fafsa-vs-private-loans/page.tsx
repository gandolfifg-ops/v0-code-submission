import type { Metadata } from "next"
import Link from "next/link"
import { Breadcrumbs } from "@/components/layout/Breadcrumbs"
import { JsonLd } from "@/components/JsonLd"
import { GuideToolsRail } from "@/features/guides/components/GuideToolsRail"
import { articleJsonLd, pageMeta } from "@/lib/seo"

export const metadata: Metadata = pageMeta(
  "FAFSA vs private student loans in the US — WealthNutz",
  "Why U.S. students usually start with FAFSA and federal aid before private student loans. Education only — not a loan offer.",
  "/guides/fafsa-vs-private-loans",
)

export default function FafsaVsPrivateLoansPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
      <JsonLd
        data={articleJsonLd({
          title: "FAFSA vs private student loans in the US",
          description:
            "Why U.S. students usually start with FAFSA and federal aid before private student loans. Education only — not a loan offer.",
          path: "/guides/fafsa-vs-private-loans",
          datePublished: "2026-09-16",
        })}
      />
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "FAFSA vs private loans", path: "/guides/fafsa-vs-private-loans" },
        ]}
      />
      <p className="mt-3 text-xs font-semibold uppercase tracking-widest text-link">Guides</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        FAFSA vs private student loans in the US
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">Updated September 2026</p>

      <div className="mt-6 space-y-5 text-sm leading-relaxed text-muted-foreground">
        <p className="text-base text-foreground">
          Start with federal aid. File the{" "}
          <a
            href="https://studentaid.gov/h/apply-for-aid/fafsa"
            className="font-medium text-link underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            FAFSA
          </a>{" "}
          on StudentAid.gov before comparing private student loans. Private loans are a
          different product — often used for a gap after federal and school aid, not a
          first stop.
        </p>

        <section>
          <h2 className="text-lg font-semibold text-foreground">Why FAFSA comes first</h2>
          <p className="mt-2">
            The FAFSA unlocks federal grants, Direct Loans, and work-study for eligible
            students. Schools also use it for many institutional awards. Confirm deadlines
            and school codes on{" "}
            <a
              href="https://studentaid.gov/"
              className="font-medium text-link underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              StudentAid.gov
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">Federal loans vs private loans</h2>
          <p className="mt-2">
            Federal Direct Loans have fixed terms published by the Department of Education.
            Private student loans are offered by banks and lenders with their own rates,
            fees, and cosigner rules. WealthNutz does not quote your APR — open the
            official lender page and confirm there.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">Next steps on WealthNutz</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>
              <Link href="/loans" className="font-medium text-link underline">
                Loan Tools
              </Link>{" "}
              — find official FAFSA and lender pages
            </li>
            <li>
              <Link href="/scholarships" className="font-medium text-link underline">
                Scholarships
              </Link>{" "}
              — school and foundation award pages
            </li>
            <li>
              <Link href="/" className="font-medium text-link underline">
                Marketplace
              </Link>{" "}
              — student banking products (affiliate links disclosed)
            </li>
          </ul>
        </section>
      </div>
      <GuideToolsRail country="US" />
    </article>
  )
}
