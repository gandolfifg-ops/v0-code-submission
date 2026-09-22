"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { InfoPage } from "@/components/layout/InfoPage"

const CONTACT_EMAIL = "wealthnutz.official@gmail.com"

const fieldClass =
  "mt-1 min-h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground"

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

export default function ContactPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [reason, setReason] = useState("General Inquiry")
  const [message, setMessage] = useState("")
  const [status, setStatus] = useState<string | null>(null)

  function composedBody() {
    return `Name: ${name}\nEmail: ${email}\nReason: ${reason}\n\n${message}`
  }

  async function copyAddress() {
    const ok = await copyText(CONTACT_EMAIL)
    setStatus(ok ? "Email address copied." : `Copy failed — write us at ${CONTACT_EMAIL}`)
  }

  async function copyMessage() {
    const ok = await copyText(composedBody())
    setStatus(
      ok
        ? "Message copied. Paste it into your email app and send to wealthnutz.official@gmail.com."
        : `Copy failed — email us at ${CONTACT_EMAIL}`,
    )
  }

  function openMailApp(e: FormEvent) {
    e.preventDefault()
    const subject = encodeURIComponent(`[WealthNutz] ${reason}`)
    const body = encodeURIComponent(composedBody())
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`
    setStatus(
      "If your email app opened, send from there. If nothing happened, use Copy message or Copy email address below.",
    )
  }

  return (
    <InfoPage title="Contact" lede="Email is the fastest way to reach us. Typical reply time is within 24 hours.">
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-link">Email</p>
          <p className="mt-1 break-all text-sm font-medium text-foreground">{CONTACT_EMAIL}</p>
          <button
            type="button"
            onClick={() => void copyAddress()}
            className="mt-2 inline-flex min-h-11 items-center justify-center rounded-xl border border-border bg-background px-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
          >
            Copy email address
          </button>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-link">Region</p>
          <p className="mt-1 text-sm text-foreground">Canada &amp; United States</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-link">Help</p>
          <Link href="/help" className="mt-1 block text-sm font-medium text-foreground underline">
            Help Center
          </Link>
        </div>
      </div>

      {status ? (
        <p className="rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm text-foreground" role="status">
          {status}
        </p>
      ) : null}

      <form onSubmit={openMailApp} className="space-y-3 rounded-2xl border border-border bg-card p-4 sm:p-6">
        <label className="block text-xs font-medium text-muted-foreground">
          Name
          <input className={fieldClass} value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <label className="block text-xs font-medium text-muted-foreground">
          Email
          <input
            className={fieldClass}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label className="block text-xs font-medium text-muted-foreground">
          Reason
          <select className={fieldClass} value={reason} onChange={(e) => setReason(e.target.value)}>
            <option>General Inquiry</option>
            <option>Technical Support</option>
            <option>Partnership</option>
            <option>Feedback</option>
          </select>
        </label>
        <label className="block text-xs font-medium text-muted-foreground">
          Message
          <textarea
            className={`${fieldClass} min-h-28 py-2`}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={() => void copyMessage()}
            className="inline-flex min-h-11 flex-1 items-center justify-center rounded-xl bg-gold px-4 text-sm font-bold text-gold-foreground transition-colors hover:bg-gold-hover"
          >
            Copy message
          </button>
          <button
            type="submit"
            className="inline-flex min-h-11 flex-1 items-center justify-center rounded-xl border border-border bg-background px-4 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
          >
            Try email app
          </button>
        </div>
        <p className="text-xs text-muted-foreground">
          Prefer copy-paste if your phone has no mail app. No new account or form vendor required.
        </p>
      </form>
    </InfoPage>
  )
}
