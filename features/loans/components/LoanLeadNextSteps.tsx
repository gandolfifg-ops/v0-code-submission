"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { PaymentCalculator } from "@/features/loans/components/PaymentCalculator"
import { OFFICIAL_LOAN_PAGES } from "@/features/loans/data/official"
import { resolveSchool, schoolPagePath } from "@/features/scholarships/schools"
import { getStudentProfile } from "@/features/student-profile/store"
import type { LoanCountry } from "@/features/loans/types"

type LeadSnapshot = {
  country?: LoanCountry
  school?: string
}

const PRIVATE_IDS = new Set([
  "us-sofi-student",
  "us-earnest-student",
  "us-sallie-student",
  "us-sofi-personal",
])

export function LoanLeadNextSteps() {
  const [lead, setLead] = useState<LeadSnapshot>({})
  const [country, setCountry] = useState<LoanCountry>("Canada")
  const [schoolName, setSchoolName] = useState("")

  useEffect(() => {
    const profile = getStudentProfile()
    let nextCountry: LoanCountry = profile?.country ?? "Canada"
    let nextSchool = profile?.school.trim() ?? ""
    try {
      const raw = window.sessionStorage.getItem("wealthnutz-loan-lead")
      if (raw) {
        const parsed = JSON.parse(raw) as LeadSnapshot
        setLead(parsed)
        if (parsed.country === "Canada" || parsed.country === "USA") nextCountry = parsed.country
        if (parsed.school?.trim()) nextSchool = parsed.school.trim()
      }
    } catch {
      // ignore
    }
    setCountry(nextCountry)
    setSchoolName(nextSchool)
  }, [])

  const government = useMemo(
    () =>
      OFFICIAL_LOAN_PAGES.filter(
        (item) =>
          item.country === country &&
          item.loanType === "Student" &&
          !PRIVATE_IDS.has(item.id) &&
          (item.id.includes("fafsa") ||
            item.id.includes("nslsc") ||
            item.id.includes("osap") ||
            item.id.includes("federal") ||
            item.id.includes("student-grants") ||
            item.id.includes("studentaid") ||
            item.id.includes("alberta") ||
            item.id.includes("afe")),
      ).slice(0, 4),
    [country],
  )

  const school = schoolName ? resolveSchool(schoolName) : null

  const privateLenders = useMemo(
    () =>
      OFFICIAL_LOAN_PAGES.filter(
        (item) => item.country === country && PRIVATE_IDS.has(item.id),
      ).slice(0, 4),
    [country],
  )

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:py-8">
      <p className="text-xs font-semibold uppercase tracking-widest text-link">Loans</p>
      <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-4xl">
        Next steps after your private-loan interest form
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        This is education, not a loan offer. Work government aid first, then school aid, then
        optional private lenders. Confirm every rate and term on the official site.
        {lead.school ? ` School noted: ${lead.school}.` : ""}
      </p>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-foreground">1. Official government aid</h2>
        <ul className="mt-3 space-y-2">
          {government.map((item) => (
            <li key={item.id}>
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center font-medium text-link underline"
              >
                {item.name}
              </a>
              <span className="ml-2 text-sm text-muted-foreground">{item.tagline}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-foreground">2. School aid</h2>
        {school ? (
          <p className="mt-2 text-sm text-muted-foreground">
            Official awards links for{" "}
            <Link href={schoolPagePath(school)} className="font-medium text-link underline">
              {school.name}
            </Link>
            .
          </p>
        ) : (
          <p className="mt-2 text-sm text-muted-foreground">
            Browse{" "}
            <Link href="/schools" className="font-medium text-link underline">
              school scholarship pages
            </Link>{" "}
            or search on Scholarships.
          </p>
        )}
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-foreground">3. Private lender pages</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Optional. Usually after government aid. Confirm APR and eligibility on each issuer site.
        </p>
        {privateLenders.length > 0 ? (
          <ul className="mt-3 space-y-2">
            {privateLenders.map((item) => (
              <li key={item.id}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center font-medium text-link underline"
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-muted-foreground">
            For Canada, start with your provincial aid page and your bank’s student line of credit.
            Use{" "}
            <Link href="/loans" className="font-medium text-link underline">
              Loan tools
            </Link>{" "}
            to find official pages.
          </p>
        )}
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-foreground">4. Payment calculator</h2>
        <div className="mt-3 max-w-xl">
          <PaymentCalculator />
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
        <h2 className="text-base font-semibold text-foreground">5. Disclosure</h2>
        <p className="mt-2">
          WealthNutz is not a lender, broker, or advisor. Private loan leads are optional interest
          forms — not applications. We do not collect SIN, SSN, date of birth, full address, or
          credit score. Rates are never guaranteed on this site. Confirm everything on the official
          government or issuer page.
        </p>
      </section>
    </div>
  )
}
