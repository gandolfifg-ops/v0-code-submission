import { NextResponse } from "next/server"
import { clientKey, rateLimit } from "@/lib/rateLimit"

export const dynamic = "force-dynamic"

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 254
}

export async function POST(req: Request) {
  const limited = rateLimit(clientKey(req, "kit"), { limit: 10, windowMs: 60_000 })
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

  const webhook = process.env.DIGEST_WEBHOOK_URL?.trim() || process.env.KIT_WEBHOOK_URL?.trim()
  if (webhook) {
    try {
      await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "kit_waitlist", email, country, school: school || undefined }),
      })
    } catch {
      // succeed locally
    }
  }

  return NextResponse.json({ ok: true })
}
