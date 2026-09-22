import { NextResponse } from "next/server"
import { clientKey, rateLimit } from "@/lib/rateLimit"

export const dynamic = "force-dynamic"

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 254
}

export async function POST(req: Request) {
  const limited = rateLimit(clientKey(req, "digest"), { limit: 10, windowMs: 60_000 })
  if (!limited.ok) {
    return NextResponse.json(
      { ok: false, error: "Too many requests" },
      { status: 429, headers: { "Retry-After": String(limited.retryAfterSec) } },
    )
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 })
  }

  const record = body as Record<string, unknown>
  const email = typeof record.email === "string" ? record.email.trim() : ""
  if (!isValidEmail(email)) {
    return NextResponse.json({ ok: false, error: "Valid email required" }, { status: 400 })
  }

  const country =
    record.country === "USA" || record.country === "US" || record.country === "United States"
      ? "USA"
      : "Canada"
  const school = typeof record.school === "string" ? record.school.trim().slice(0, 200) : ""
  const partnerUpdates = Boolean(record.partnerUpdates)
  const cadence = "weekly"

  const payload = { email, country, school: school || undefined, cadence, partnerUpdates }

  const webhook = process.env.DIGEST_WEBHOOK_URL?.trim()
  const resendKey = process.env.RESEND_API_KEY?.trim()

  try {
    if (webhook) {
      await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "digest_signup", ...payload }),
      })
    } else if (resendKey) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.DIGEST_FROM_EMAIL || "WealthNutz <onboarding@resend.dev>",
          to: process.env.DIGEST_TO_EMAIL || "wealthnutz.official@gmail.com",
          subject: `[WealthNutz] Digest signup (${country})`,
          text: `Email: ${email}\nCountry: ${country}\nSchool: ${school || "(none)"}\nPartner updates: ${partnerUpdates}\nCadence: weekly`,
        }),
      })
    }
  } catch {
    // Still succeed locally so the browser lead is not blocked.
  }

  return NextResponse.json({ ok: true })
}
