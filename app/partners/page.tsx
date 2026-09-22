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

export default function PartnersPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [school, setSchool] = useState("")
  const [message, setMessage] = useState("")
  const [status, setStatus] = useState<string | null>(null)

  function composedBody() {
    return `Name: ${name}\nEmail: ${email}\nSchool / office: ${school}\n\n${message}`
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
    const subject = encodeURIComponent("[WealthNutz] Financial aid office partnership")
    const body = encodeURIComponent(composedBody())
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`
    setStatus(
      "If your email app opened, send from there. If nothing happened, use Copy message below.",
    )
  }

  return (
    <InfoPage
      title="Partners for financial-aid offices"
      lede="WealthNutz helps students discover official school awards pages and government aid hubs — with clear labels, not paid scholarship rankings."
    >
      <section>
        <h2 className="text-lg font-semibold text-foreground">What partners get</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
          <li>Discovery traffic to your official awards and aid URLs</li>
          <li>A school page that points students to confirm eligibility on your site</li>
          <li>Optional “Official links reviewed with the school” badge when we have reviewed links with you</li>
        </ul>
      </section>
      <section>
        <h2 className="text-lg font-semibold text-foreground">What partners do not get</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
          <li>Paid scholarship ranking or “top ranked” labels</li>
          <li>Affiliate placement on government aid hubs</li>
          <li>Control over live search results from the open web</li>
        </ul>
      </section>
      <p className="text-sm text-muted-foreground">
        See{" "}
        <Link href="/schools" className="font-medium text-link underline">
          school pages
        </Link>{" "}
        and{" "}
        <Link href="/about" className="font-medium text-link underline">
          About
        </Link>{" "}
        for how discovery works today.
      </p>

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
          Work email
          <input
            className={fieldClass}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label className="block text-xs font-medium text-muted-foreground">
          School / office
          <input className={fieldClass} value={school} onChange={(e) => setSchool(e.target.value)} required />
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
        <p className="text-xs text-muted-foreground">Sends to {CONTACT_EMAIL}</p>
      </form>
    </InfoPage>
  )
}
