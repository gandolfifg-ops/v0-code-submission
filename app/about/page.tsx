import type { Metadata } from "next"
import Link from "next/link"
import { InfoPage } from "@/components/layout/InfoPage"
import { pageMeta } from "@/lib/seo"

export const metadata: Metadata = pageMeta(
  "About — WealthNutz",
  "WealthNutz helps students in Canada and the US find scholarships, loans, student banking, and credit cards. Education only — not a licensed advisor.",
  "/about",
)

export default function AboutPage() {
  return (
    <InfoPage title="About Us" lede="WealthNutz helps students in Canada and the US find scholarships, loans, student banking products, and student credit cards.">
      <section>
        <h2 className="text-lg font-semibold text-foreground">About WealthNutz</h2>
        <p className="mt-2">
          WealthNutz is a student finance discovery site. We point you to official scholarship
          pages, lender sites, student banking products, and issuer credit-card hubs, plus a simple
          AI chat for general questions. We are not a bank, lender, or licensed advisor.
        </p>
      </section>
      <section>
        <h2 className="text-lg font-semibold text-foreground">Our Mission</h2>
        <p className="mt-2">
          Make scholarships, student loans, everyday banking, and student cards easier to compare —
          with honest labels for live search vs curated picks, and advertised details that you always
          confirm on the official site.
        </p>
      </section>
      <section>
        <h2 className="text-lg font-semibold text-foreground">Affiliate &amp; paid placement</h2>
        <p className="mt-2">
          Some Marketplace and Cards links are affiliate links. We may earn a commission if you open
          an account. <strong className="font-semibold text-foreground">featured</strong> means
          editorial. <strong className="font-semibold text-foreground">sponsored</strong> means paid
          placement and is labeled “Paid placement.” Government pages such as FAFSA and NSLSC are
          never affiliates or sponsored.
        </p>
      </section>
      <section>
        <h2 className="text-lg font-semibold text-foreground">Digest, leads, partners, Kit</h2>
        <p className="mt-2">
          Optional{" "}
          <Link href="/digest" className="font-medium text-link underline">
            weekly digest
          </Link>
          , private-loan interest forms on{" "}
          <Link href="/loans" className="font-medium text-link underline">
            Loans
          </Link>
          ,{" "}
          <Link href="/partners" className="font-medium text-link underline">
            financial-aid office partners
          </Link>
          , and a free{" "}
          <Link href="/kit" className="font-medium text-link underline">
            Kit waitlist
          </Link>{" "}
          ($9 or less if we launch — search stays free). We do not collect SIN, SSN, date of birth,
          full address, or credit score.
        </p>
      </section>
    </InfoPage>
  )
}
