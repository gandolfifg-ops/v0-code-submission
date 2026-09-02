"use client"

import { useState, type FormEvent } from "react"
import { ListChecks, Search } from "lucide-react"
import { CountryToggle } from "@/components/CountryToggle"
import { SectionHeading } from "@/components/layout/SectionHeading"
import { LenderCard } from "@/features/loans/components/LenderCard"
import { PaymentCalculator } from "@/features/loans/components/PaymentCalculator"
import { StudentProfileBox } from "@/features/student-profile/components/StudentProfileBox"
import { isProfileFilled, type StudentProfile } from "@/features/student-profile/types"
import type { LoanCountry, LoanResult, LoanType } from "@/features/loans/types"

const LOAN_TYPES: LoanType[] = ["Student", "Personal", "Auto"]

type SearchResponse = {
  source: "live" | "curated"
  notice: string
  results: LoanResult[]
}

export function LoanTools() {
  const [country, setCountry] = useState<LoanCountry>("Canada")
  const [loanType, setLoanType] = useState<LoanType>("Student")
  const [amount, setAmount] = useState("")
  const [loading, setLoading] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)
  const [source, setSource] = useState<"live" | "curated" | null>(null)
  const [results, setResults] = useState<LoanResult[]>([])
  const [error, setError] = useState<string | null>(null)

  function applyProfile(profile: StudentProfile | null) {
    if (!isProfileFilled(profile) || !profile) return
    setCountry(profile.country)
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/loans/find", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country, loanType, amount }),
      })
      if (!res.ok) throw new Error("Search failed")
      const data: SearchResponse = await res.json()
      setResults(data.results ?? [])
      setSource(data.source)
      setNotice(data.notice)
    } catch {
      setError("Could not run the search. Check your connection and try again.")
      setResults([])
      setSource(null)
      setNotice(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:py-8">
      <p className="text-xs font-semibold uppercase tracking-widest text-[#C9A84C]">Loans</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        Loan Tools
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
        Find student, personal, and auto lenders in Canada or the US. Rates shown are
        advertised on public pages — not live guaranteed quotes. Always confirm APR,
        fees, and eligibility on the official site.
      </p>

      <div className="mt-6 grid gap-4 lg:grid-cols-2 lg:items-start">
        <div className="space-y-4">
          <StudentProfileBox onProfileChange={applyProfile} />

          <form
            onSubmit={onSubmit}
            className="space-y-3 rounded-2xl border border-border bg-card p-4 sm:p-5"
          >
            <SectionHeading icon={Search}>Find lenders</SectionHeading>
            <CountryToggle
              value={country}
              onChange={setCountry}
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
                  className={`min-h-11 rounded-xl text-sm font-semibold transition-colors ${
                    loanType === type
                      ? "bg-[#C9A84C] text-[#07090d] hover:bg-[#b8973f]"
                      : "border border-border text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
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
              className="min-h-11 w-full rounded-xl bg-[#C9A84C] text-sm font-bold text-[#07090d] transition-colors hover:bg-[#b8973f] disabled:opacity-60"
            >
              {loading ? "Searching…" : "Find lenders"}
            </button>
          </form>
        </div>

        <PaymentCalculator />
      </div>

      {error && (
        <p className="mt-4 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </p>
      )}

      {notice && (
        <p
          className={`mt-4 break-words rounded-xl border px-4 py-3 text-sm ${
            source === "live"
              ? "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-200"
              : "border-[#C9A84C]/40 bg-[#C9A84C]/10 text-foreground"
          }`}
        >
          {notice}
        </p>
      )}

      {results.length > 0 && (
        <section className="mt-6">
          <SectionHeading icon={ListChecks}>Results</SectionHeading>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {results.map((lender) => (
              <LenderCard key={lender.id} lender={lender} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
