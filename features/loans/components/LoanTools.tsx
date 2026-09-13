"use client"

import { useEffect, useState, type FormEvent } from "react"
import Link from "next/link"
import { Banknote, Car, GraduationCap, ListChecks, Loader2, Search } from "lucide-react"
import { CountryToggle } from "@/components/CountryToggle"
import { CreamIcon } from "@/components/CreamIcon"
import { useSmartSearch } from "@/components/SmartSearchProvider"
import { SectionHeading } from "@/components/layout/SectionHeading"
import { LenderCard } from "@/features/loans/components/LenderCard"
import { PaymentCalculator } from "@/features/loans/components/PaymentCalculator"
import { StudentProfileBox } from "@/features/student-profile/components/StudentProfileBox"
import { type StudentProfile } from "@/features/student-profile/types"
import { saveStudentCountry } from "@/features/student-profile/store"
import type { LoanCountry, LoanListingKind, LoanResult, LoanType } from "@/features/loans/types"
import { loanCardKind } from "@/lib/listingDisplay"

const LOAN_TYPES: LoanType[] = ["Student", "Personal", "Auto"]
const LOAN_TYPE_ICONS = {
  Student: GraduationCap,
  Personal: Banknote,
  Auto: Car,
} as const

type SearchResponse = {
  source: "live" | "curated"
  notice: string
  results: LoanResult[]
}

const LOAN_GROUPS: { id: LoanListingKind; title: string }[] = [
  { id: "government", title: "Government" },
  { id: "bank", title: "Banks" },
  { id: "private-lender", title: "Private lenders" },
  { id: "article", title: "Articles" },
]

function groupedLoanResults(results: LoanResult[]) {
  const withKind = results.map((item) => ({ item, kind: loanCardKind(item) }))
  const hasPrimary = withKind.some((row) => row.kind !== "article")
  const visible = hasPrimary ? withKind.filter((row) => row.kind !== "article") : withKind
  return LOAN_GROUPS.map((group) => ({
    ...group,
    items: visible.filter((row) => row.kind === group.id).map((row) => row.item),
  })).filter((group) => group.items.length > 0)
}

function loanResultsSummary(count: number, country: LoanCountry, loanType: LoanType): string {
  return `${count} ${count === 1 ? "lender" : "lenders"} · ${country === "USA" ? "United States" : "Canada"} · ${loanType}`
}

export function LoanTools({ initialQuery = "" }: { initialQuery?: string }) {
  const { setCountry: setSearchCountry, ticket } = useSmartSearch()
  const [country, setCountry] = useState<LoanCountry>("Canada")
  const [loanType, setLoanType] = useState<LoanType>("Student")
  const [amount, setAmount] = useState("")
  const [loading, setLoading] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)
  const [source, setSource] = useState<"live" | "curated" | null>(null)
  const [results, setResults] = useState<LoanResult[]>([])
  const [error, setError] = useState<string | null>(null)

  function applyProfile(profile: StudentProfile | null) {
    if (!profile) return
    setCountry(profile.country)
    setSearchCountry(profile.country)
  }

  async function runSearch(nextQuery = "") {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/loans/find", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country, loanType, amount, query: nextQuery }),
      })
      if (!res.ok) throw new Error("Search failed")
      const data: SearchResponse = await res.json()
      setResults(data.results ?? [])
      setSource(data.source)
      setNotice(data.notice)
    } catch {
      setError("Search didn’t work — try again")
      setResults([])
      setSource(null)
      setNotice(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setSearchCountry(country)
  }, [country, setSearchCountry])

  useEffect(() => {
    if (!ticket) return
    void runSearch(ticket.query)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run only when header submits a new ticket
  }, [ticket?.id])

  useEffect(() => {
    if (!initialQuery.trim()) return
    void runSearch(initialQuery.trim())
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once from /loans?q=
  }, [])

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    await runSearch()
  }

  return (
    <div className="mx-auto max-w-6xl overflow-x-hidden px-3 py-3 md:px-6 md:py-8">
      <p className="text-xs font-semibold uppercase tracking-widest text-link">Loans</p>
      <h1 className="mt-1 text-xl font-bold tracking-tight text-foreground md:mt-2 md:text-4xl">
        Loan Tools
      </h1>
      <p className={`mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground md:mt-3 md:text-base ${results.length > 0 ? "hidden md:block" : ""}`}>
        Find student, personal, and auto lenders in Canada or the US. Rates shown are
        advertised on public pages — not live guaranteed quotes. Always confirm APR,
        fees, and eligibility on the official site.
      </p>
      {results.length > 0 && !loading && (
        <p className="mt-2 text-sm font-medium text-muted-foreground md:hidden">
          {loanResultsSummary(results.length, country, loanType)}
        </p>
      )}
      {country === "Canada" && (
        <p className="mt-2 text-sm">
          <Link
            href="/guides/osap-vs-private-loans"
            className="font-medium text-link underline"
          >
            OSAP vs private loans
          </Link>
        </p>
      )}

      <div className="mt-3 flex min-w-0 flex-col md:mt-6">
        <div className="order-1 min-w-0 lg:order-2">
      {loading && (
        <p className="mt-3 text-sm text-muted-foreground md:mt-4" aria-live="polite">
          Searching official pages…
        </p>
      )}

      {error && (
        <p className="mt-3 break-words rounded-xl border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700 md:mt-4 md:px-4 md:py-3 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </p>
      )}

      {notice && !loading && (
        <p
          className={`mt-3 break-words rounded-xl border px-3 py-2 text-sm md:mt-4 md:px-4 md:py-3 ${
            source === "live"
              ? "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-200"
              : "border-border bg-muted text-foreground"
          }`}
        >
          {notice}
        </p>
      )}

      {loading && results.length === 0 && (
        <section className="mt-3 md:mt-6" aria-hidden="true">
          <SectionHeading icon={ListChecks}>Results</SectionHeading>
          <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
            {[0, 1, 2].map((key) => (
              <div key={key} className="h-40 animate-pulse rounded-2xl border border-border bg-muted/50" />
            ))}
          </div>
        </section>
      )}

      {results.length > 0 && (
        <div className={`relative mt-3 md:mt-6 ${loading ? "opacity-60" : ""}`}>
          {loading && <div className="absolute inset-0 z-10 rounded-2xl bg-background/60" aria-hidden="true" />}
          {groupedLoanResults(results).map((group, index) => (
            <section key={group.id} className={index === 0 ? "" : "mt-6"}>
              <SectionHeading icon={ListChecks}>{group.title}</SectionHeading>
              <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
                {group.items.map((lender) => (
                  <LenderCard key={lender.id} lender={lender} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
        </div>

      <div className="order-2 mt-3 grid min-w-0 gap-3 md:mt-6 md:gap-4 lg:order-1 lg:grid-cols-2 lg:items-start">
        <div className="min-w-0 space-y-3 lg:space-y-4">
          <StudentProfileBox onProfileChange={applyProfile} />

          <form
            onSubmit={onSubmit}
            className="space-y-2 rounded-2xl border border-border bg-card p-4 md:space-y-3 md:p-5"
          >
            <SectionHeading icon={Search}>Find lenders</SectionHeading>
            <CountryToggle
              value={country}
              onChange={(next) => {
                setCountry(next)
                setSearchCountry(next)
                saveStudentCountry(next)
              }}
              options={[
                { value: "Canada", flag: "CA", label: "Canada" },
                { value: "USA", flag: "US", label: "United States" },
              ]}
            />

            <div className="grid grid-cols-3 gap-2">
              {LOAN_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setLoanType(type)}
                  className={`inline-flex min-h-11 min-w-0 flex-col items-center justify-center gap-0.5 rounded-xl px-1 text-xs font-semibold sm:flex-row sm:gap-1.5 sm:px-2 md:text-sm transition-colors ${
                    loanType === type
                      ? "bg-gold text-gold-foreground hover:bg-gold-hover [&_svg]:!text-cream [&_svg]:!stroke-cream"
                      : "border border-border text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <CreamIcon
                    icon={LOAN_TYPE_ICONS[type]}
                    size="sm"
                    variant={loanType === type ? "onGold" : "boxed"}
                  />
                  {type}
                </button>
              ))}
            </div>

            <label className="block text-xs font-medium text-muted-foreground">
              Amount needed (optional)
              <input
                className="mt-1 min-h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground"
                inputMode="numeric"
                value={amount}
                onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ""))}
                placeholder="e.g. 15000"
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-gold px-4 text-sm font-bold text-gold-foreground transition-colors hover:bg-gold-hover disabled:opacity-60"
            >
              {loading && <Loader2 className="h-4 w-4 shrink-0 animate-spin" aria-hidden="true" />}
              {loading ? "Searching official pages…" : "Find lenders"}
            </button>
          </form>
        </div>

        <div className="min-w-0">
          <PaymentCalculator />
        </div>
      </div>
      </div>
    </div>
  )
}
