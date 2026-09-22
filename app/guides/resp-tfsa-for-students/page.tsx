import type { Metadata } from "next"
import Link from "next/link"
import { Breadcrumbs } from "@/components/layout/Breadcrumbs"
import { JsonLd } from "@/components/JsonLd"
import { GuideToolsRail } from "@/features/guides/components/GuideToolsRail"
import { articleJsonLd, pageMeta } from "@/lib/seo"

export const metadata: Metadata = pageMeta(
  "RESP and TFSA basics for Canadian students — WealthNutz",
  "Plain-language overview of RESP and TFSA for students in Canada. Education only — confirm rules with CRA or your bank.",
  "/guides/resp-tfsa-for-students",
)

export default function RespTfsaForStudentsPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
      <JsonLd
        data={articleJsonLd({
          title: "RESP and TFSA basics for Canadian students",
          description:
            "Plain-language overview of RESP and TFSA for students in Canada. Education only — confirm rules with CRA or your bank.",
          path: "/guides/resp-tfsa-for-students",
          datePublished: "2026-09-16",
        })}
      />
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "RESP and TFSA basics", path: "/guides/resp-tfsa-for-students" },
        ]}
      />
      <p className="mt-3 text-xs font-semibold uppercase tracking-widest text-link">Guides</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        RESP and TFSA basics for Canadian students
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">Updated September 2026</p>

      <div className="mt-6 space-y-5 text-sm leading-relaxed text-muted-foreground">
        <p className="text-base text-foreground">
          Two registered accounts show up a lot in Canadian student money conversations:
          the RESP (education savings) and the TFSA (tax-free savings). They are different
          tools. This page is education only — confirm contribution room, withdrawals, and
          eligibility with the CRA or your bank.
        </p>

        <section>
          <h2 className="text-lg font-semibold text-foreground">RESP in one paragraph</h2>
          <p className="mt-2">
            A Registered Education Savings Plan helps save for post-secondary school.
            Parents or subscribers often open it for a student beneficiary. Government
            grants may apply if rules are met. Students usually do not “open an RESP for
            themselves” the same way they open a chequing account — ask the bank or read
            the CRA RESP guide before acting.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">TFSA in one paragraph</h2>
          <p className="mt-2">
            A Tax-Free Savings Account lets eligible Canadian residents save or invest
            with tax-free growth and withdrawals, subject to contribution room. Many
            students use a TFSA for emergency cash or long-term investing once they have
            SIN eligibility and room. Confirm your limit in CRA My Account — WealthNutz
            does not calculate your room.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">How this ties to Marketplace</h2>
          <p className="mt-2">
            Investing apps on WealthNutz Marketplace may offer TFSA products. Those are
            advertised products with affiliate disclosure — not a recommendation. Compare
            fees on the official site.
          </p>
          <p className="mt-3">
            <Link href="/" className="font-medium text-link underline">
              Browse Marketplace
            </Link>
            {" · "}
            <Link href="/guides/best-student-bank-canada" className="font-medium text-link underline">
              Best student bank accounts (Canada)
            </Link>
          </p>
        </section>
      </div>
      <GuideToolsRail country="CA" />
    </article>
  )
}
