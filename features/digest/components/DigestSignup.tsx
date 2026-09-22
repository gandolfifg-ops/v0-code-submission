"use client"

import { useEffect, useState, type FormEvent } from "react"
import Link from "next/link"
import {
  getStoredCountry,
  getStudentProfile,
  subscribeStudentProfile,
} from "@/features/student-profile/store"
import { readDigestLead, writeDigestLead } from "@/features/digest/storage"

const fieldClass =
  "mt-1 min-h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground"

type DigestSignupProps = {
  /** Collapsed starts closed (scholarship results). */
  collapsed?: boolean
  className?: string
  heading?: string
}

export function DigestSignup({
  collapsed = false,
  className,
  heading = "Weekly student money digest",
}: DigestSignupProps) {
  const [open, setOpen] = useState(!collapsed)
  const [email, setEmail] = useState("")
  const [country, setCountry] = useState<"Canada" | "USA">("Canada")
  const [school, setSchool] = useState("")
  const [partnerUpdates, setPartnerUpdates] = useState(false)
  const [status, setStatus] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const sync = () => {
      const stored = getStoredCountry()
      if (stored === "USA" || stored === "Canada") setCountry(stored)
      const profile = getStudentProfile()
      if (profile?.school.trim()) setSchool(profile.school.trim())
      const existing = readDigestLead()
      if (existing?.email) setEmail(existing.email)
    }
    sync()
    return subscribeStudentProfile(sync)
  }, [])

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    const trimmed = email.trim()
    if (!trimmed || !trimmed.includes("@")) {
      setStatus("Enter a valid email.")
      return
    }
    setSaving(true)
    setStatus(null)
    const lead = {
      email: trimmed,
      country,
      school: school.trim() || undefined,
      cadence: "weekly" as const,
      partnerUpdates,
      savedAt: Date.now(),
    }
    writeDigestLead(lead)
    try {
      const res = await fetch("/api/digest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lead),
      })
      if (!res.ok) throw new Error("failed")
      setStatus("You’re on the weekly digest list (saved in this browser).")
    } catch {
      setStatus("Saved in this browser. We’ll sync when the server is available.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className={`rounded-2xl border border-border bg-card p-4 sm:p-5 ${className ?? ""}`}>
      {collapsed ? (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex min-h-11 w-full items-center justify-between gap-3 text-left"
          aria-expanded={open}
        >
          <span className="text-sm font-semibold text-foreground">{heading}</span>
          <span aria-hidden="true" className="text-muted-foreground">
            {open ? "−" : "+"}
          </span>
        </button>
      ) : (
        <h2 className="text-base font-semibold text-foreground">{heading}</h2>
      )}

      {open ? (
        <>
          <p className="mt-2 text-sm text-muted-foreground">
            Optional weekly email with official aid reminders and Marketplace highlights. Search stays
            free.{" "}
            <Link href="/digest" className="font-medium text-link underline">
              Digest page
            </Link>
          </p>
          <form onSubmit={onSubmit} className="mt-3 space-y-3">
            <label className="block text-xs font-medium text-muted-foreground">
              Email
              <input
                className={fieldClass}
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@school.edu"
              />
            </label>
            <p className="text-xs text-muted-foreground">
              Country: {country === "USA" ? "United States" : "Canada"}
              {school ? ` · School: ${school}` : ""} (from your profile when set)
            </p>
            <label className="flex items-start gap-2 text-sm text-foreground">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 rounded border-border"
                checked={partnerUpdates}
                onChange={(e) => setPartnerUpdates(e.target.checked)}
              />
              <span>
                Also send occasional student banking / card updates from partners.
              </span>
            </label>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-gold px-4 text-sm font-bold text-gold-foreground transition-colors hover:bg-gold-hover disabled:opacity-60 sm:w-auto"
            >
              {saving ? "Saving…" : "Join weekly digest"}
            </button>
          </form>
          {status ? (
            <p className="mt-3 text-sm text-foreground" role="status">
              {status}
            </p>
          ) : null}
        </>
      ) : null}
    </section>
  )
}
