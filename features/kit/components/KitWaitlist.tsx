"use client"

import { useEffect, useState, type FormEvent } from "react"
import {
  getStoredCountry,
  getStudentProfile,
  subscribeStudentProfile,
} from "@/features/student-profile/store"

const KIT_KEY = "wealthnutz-kit-waitlist"

const fieldClass =
  "mt-1 min-h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground"

export function KitWaitlist() {
  const [email, setEmail] = useState("")
  const [country, setCountry] = useState<"Canada" | "USA">("Canada")
  const [school, setSchool] = useState("")
  const [status, setStatus] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const sync = () => {
      const stored = getStoredCountry()
      if (stored === "USA" || stored === "Canada") setCountry(stored)
      const profile = getStudentProfile()
      if (profile?.school.trim()) setSchool(profile.school.trim())
      try {
        const raw = window.localStorage.getItem(KIT_KEY)
        if (raw) {
          const parsed = JSON.parse(raw) as { email?: string }
          if (parsed.email) setEmail(parsed.email)
        }
      } catch {
        // ignore
      }
    }
    sync()
    return subscribeStudentProfile(sync)
  }, [])

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    const trimmed = email.trim()
    if (!trimmed.includes("@")) {
      setStatus("Enter a valid email.")
      return
    }
    setSaving(true)
    const payload = {
      email: trimmed,
      country,
      school: school.trim() || undefined,
      savedAt: Date.now(),
    }
    try {
      window.localStorage.setItem(KIT_KEY, JSON.stringify(payload))
    } catch {
      // ignore
    }
    try {
      const res = await fetch("/api/kit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error("failed")
      setStatus("You’re on the Kit waitlist (saved in this browser).")
    } catch {
      setStatus("Saved in this browser. We’ll sync when the server is available.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3 rounded-2xl border border-border bg-card p-4 sm:p-6">
      <label className="block text-xs font-medium text-muted-foreground">
        Email
        <input
          className={fieldClass}
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@school.edu"
        />
      </label>
      <label className="block text-xs font-medium text-muted-foreground">
        Country
        <select
          className={fieldClass}
          value={country}
          onChange={(e) => setCountry(e.target.value === "USA" ? "USA" : "Canada")}
        >
          <option value="Canada">Canada</option>
          <option value="USA">United States</option>
        </select>
      </label>
      <label className="block text-xs font-medium text-muted-foreground">
        School (optional)
        <input
          className={fieldClass}
          value={school}
          onChange={(e) => setSchool(e.target.value)}
          placeholder="e.g. Queen’s University"
        />
      </label>
      <button
        type="submit"
        disabled={saving}
        className="inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-gold px-4 text-sm font-bold text-gold-foreground transition-colors hover:bg-gold-hover disabled:opacity-60"
      >
        {saving ? "Saving…" : "Join Kit waitlist"}
      </button>
      {status ? (
        <p className="text-sm text-foreground" role="status">
          {status}
        </p>
      ) : null}
    </form>
  )
}
