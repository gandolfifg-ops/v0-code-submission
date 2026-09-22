"use client"

import { useEffect, useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { CountryToggle } from "@/components/CountryToggle"
import { SectionHeading } from "@/components/layout/SectionHeading"
import { Banknote } from "lucide-react"
import {
  getStudentProfile,
  saveStudentCountry,
  subscribeStudentProfile,
} from "@/features/student-profile/store"
import type { LoanCountry } from "@/features/loans/types"

const fieldClass =
  "mt-1 min-h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground"

const LEVELS = ["Undergraduate", "Graduate", "College / diploma", "Other"]
const YEARS = ["1", "2", "3", "4", "5+", "Incoming"]

export function PrivateLoanLeadForm() {
  const router = useRouter()
  const [country, setCountry] = useState<LoanCountry>("Canada")
  const [school, setSchool] = useState("")
  const [level, setLevel] = useState(LEVELS[0])
  const [year, setYear] = useState(YEARS[0])
  const [amount, setAmount] = useState("")
  const [residency, setResidency] = useState("")
  const [email, setEmail] = useState("")
  const [consent, setConsent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const sync = () => {
      const profile = getStudentProfile()
      if (!profile) return
      setCountry(profile.country)
      if (profile.school.trim()) setSchool(profile.school.trim())
      if (profile.provinceOrState.trim()) setResidency(profile.provinceOrState.trim())
    }
    sync()
    return subscribeStudentProfile(sync)
  }, [])

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    if (!consent) {
      setError("Consent is required to share this lead.")
      return
    }
    setSaving(true)
    const payload = {
      country,
      school: school.trim(),
      level,
      year,
      amount: amount.trim() || undefined,
      residency: residency.trim(),
      email: email.trim() || undefined,
      consent: true,
    }
    try {
      const res = await fetch("/api/loans/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null
        throw new Error(data?.error || "Could not save lead")
      }
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem("wealthnutz-loan-lead", JSON.stringify(payload))
      }
      router.push("/loans/next")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save lead")
      setSaving(false)
    }
  }

  return (
    <section className="mt-8 rounded-2xl border border-border bg-card p-4 sm:p-5">
      <SectionHeading icon={Banknote}>Compare private student loans</SectionHeading>
      <p className="mt-2 text-sm text-muted-foreground">
        Private loans are optional and usually come after government aid (OSAP, provincial aid,
        FAFSA / federal Direct Loans). WealthNutz is not a lender. We do not collect SIN, SSN, date
        of birth, full address, or credit score.
      </p>
      <form onSubmit={onSubmit} className="mt-4 space-y-3">
        <CountryToggle
          value={country}
          onChange={(next) => {
            setCountry(next)
            saveStudentCountry(next)
          }}
          options={[
            { value: "Canada", flag: "CA", label: "Canada" },
            { value: "USA", flag: "US", label: "United States" },
          ]}
        />
        <label className="block text-xs font-medium text-muted-foreground">
          School
          <input
            className={fieldClass}
            value={school}
            onChange={(e) => setSchool(e.target.value)}
            required
            placeholder="e.g. Queen’s University"
          />
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-xs font-medium text-muted-foreground">
            Level
            <select className={fieldClass} value={level} onChange={(e) => setLevel(e.target.value)}>
              {LEVELS.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label className="block text-xs font-medium text-muted-foreground">
            Year
            <select className={fieldClass} value={year} onChange={(e) => setYear(e.target.value)}>
              {YEARS.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
        </div>
        <label className="block text-xs font-medium text-muted-foreground">
          Amount needed (optional)
          <input
            className={fieldClass}
            inputMode="numeric"
            value={amount}
            onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ""))}
            placeholder="e.g. 10000"
          />
        </label>
        <label className="block text-xs font-medium text-muted-foreground">
          Residency (province / state)
          <input
            className={fieldClass}
            value={residency}
            onChange={(e) => setResidency(e.target.value)}
            required
            placeholder="e.g. ON or California"
          />
        </label>
        <label className="block text-xs font-medium text-muted-foreground">
          Email (optional)
          <input
            className={fieldClass}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@school.edu"
          />
        </label>
        <label className="flex items-start gap-2 text-sm text-foreground">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 rounded border-border"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            required
          />
          <span>
            I consent to WealthNutz storing this lead in this browser and forwarding it to partners
            when a webhook is configured. This is not a loan application.
          </span>
        </label>
        {error ? (
          <p className="text-sm text-red-700 dark:text-red-300" role="alert">
            {error}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={saving}
          className="inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-gold px-4 text-sm font-bold text-gold-foreground transition-colors hover:bg-gold-hover disabled:opacity-60"
        >
          {saving ? "Saving…" : "See next steps"}
        </button>
      </form>
    </section>
  )
}
