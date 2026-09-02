"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { InfoPage } from "@/components/layout/InfoPage"

const fieldClass =
  "mt-1 min-h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground"

export default function ContactPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [reason, setReason] = useState("General Inquiry")
  const [message, setMessage] = useState("")
  const [submitted, setSubmitted] = useState(false)

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    const subject = encodeURIComponent(`[WealthNutz] ${reason}`)
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)
    window.location.href = `mailto:wealthnutz.official@gmail.com?subject=${subject}&body=${body}`
    setSubmitted(true)
  }

  return (
    <InfoPage title="Contact" lede="Email is the fastest way to reach us. Typical reply time is within 24 hours.">
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#C9A84C]">Email</p>
          <a
            href="mailto:wealthnutz.official@gmail.com"
            className="mt-1 block text-sm font-medium text-foreground underline"
          >
            wealthnutz.official@gmail.com
          </a>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#C9A84C]">Region</p>
          <p className="mt-1 text-sm text-foreground">Canada &amp; United States</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#C9A84C]">Help</p>
          <Link href="/help" className="mt-1 block text-sm font-medium text-foreground underline">
            Help Center
          </Link>
        </div>
      </div>

      {submitted ? (
        <p className="rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm text-foreground">
          Your email app should open with the message. If it didn’t, write us at
          wealthnutz.official@gmail.com.
        </p>
      ) : (
        <form onSubmit={onSubmit} className="space-y-3 rounded-2xl border border-border bg-card p-4 sm:p-6">
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
          <button
            type="submit"
            className="min-h-11 w-full rounded-xl bg-[#C9A84C] text-sm font-bold text-[#07090d]"
          >
            Open email
          </button>
        </form>
      )}
    </InfoPage>
  )
}
