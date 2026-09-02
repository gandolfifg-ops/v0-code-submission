import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "OSAP vs private student loans in Canada — WealthNutz",
  description:
    "How government student aid in Canada compares with private bank lines of credit. Education only — not a loan offer.",
}

export default function OsapVsPrivateLoansPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
      <p className="text-xs font-semibold uppercase tracking-widest text-[#C9A84C]">Guides</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        OSAP vs private student loans in Canada
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">Updated September 2026</p>

      <div className="mt-6 space-y-5 text-sm leading-relaxed text-muted-foreground">
        <p className="text-base text-foreground">
          Start with government aid. In Canada that means your provincial or territorial
          program (OSAP in Ontario) plus Canada Student Grants and Loans. Private bank
          lines of credit are a different product — usually for a gap after government aid,
          not a replacement for it.
        </p>

        <section>
          <h2 className="text-lg font-semibold text-foreground">Government aid first</h2>
          <p className="mt-2">
            Apply through your province or territory. Ontario students use OSAP. Other
            provinces have their own portals. Federal Canada Student Loans and grants are
            delivered through that provincial process and managed afterward on the{" "}
            <a
              href="https://www.csnpe-nslsc.canada.ca/en/home"
              className="font-medium text-[#8B6914] underline dark:text-[#C9A84C]"
              target="_blank"
              rel="noopener noreferrer"
            >
              National Student Loans Service Centre (NSLSC)
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">Interest on Canada Student Loans</h2>
          <p className="mt-2">
            Federal Canada Student Loan interest is 0%. Confirm current repayment, RAP,
            and provincial loan interest rules on NSLSC and your province’s site — they
            are not the same product as a bank line of credit.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">OSAP is grants and loans</h2>
          <p className="mt-2">
            Ontario OSAP is a mix of grants and loans. 2026 changes shifted more aid toward
            loans — confirm current rules on{" "}
            <a
              href="https://www.ontario.ca/page/osap-ontario-student-assistance-program"
              className="font-medium text-[#8B6914] underline dark:text-[#C9A84C]"
              target="_blank"
              rel="noopener noreferrer"
            >
              ontario.ca
            </a>{" "}
            and NSLSC. Do not assume last year’s grant/loan split still applies.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">Private bank lines of credit</h2>
          <p className="mt-2">
            A student line of credit from a bank is a private loan. It usually needs a
            co-signer (often a parent), and many products are interest-only while you are
            in school. Advertised rates are not quotes. Compare only on the lender’s site
            after you know your government aid.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">International students</h2>
          <p className="mt-2">
            International students generally cannot get OSAP. Government Canada Student
            Grants and Loans are for eligible Canadian students through provincial aid.
            International students typically look at school payment plans, private credit
            if a co-signer qualifies, or home-country funding — confirm with the school
            and any lender.
          </p>
        </section>

        <p>
          Find lender starting points on{" "}
          <Link href="/loans" className="font-medium text-[#8B6914] underline dark:text-[#C9A84C]">
            Loan Tools
          </Link>
          . Official overviews:{" "}
          <a
            href="https://www.canada.ca/en/services/benefits/education/student-aid.html"
            className="font-medium text-[#8B6914] underline dark:text-[#C9A84C]"
            target="_blank"
            rel="noopener noreferrer"
          >
            Canada Student Financial Assistance
          </a>
          ,{" "}
          <a
            href="https://www.csnpe-nslsc.canada.ca/en/home"
            className="font-medium text-[#8B6914] underline dark:text-[#C9A84C]"
            target="_blank"
            rel="noopener noreferrer"
          >
            NSLSC
          </a>
          , and{" "}
          <a
            href="https://www.ontario.ca/page/osap-ontario-student-assistance-program"
            className="font-medium text-[#8B6914] underline dark:text-[#C9A84C]"
            target="_blank"
            rel="noopener noreferrer"
          >
            Ontario student aid (OSAP)
          </a>
          .
        </p>
      </div>

      <p className="mt-8 text-xs leading-relaxed text-muted-foreground">
        This is education, not a loan offer. WealthNutz is not a lender, broker, or
        licensed advisor. Always confirm eligibility, interest, and repayment on the
        official government or bank site before you apply.
      </p>
    </article>
  )
}
