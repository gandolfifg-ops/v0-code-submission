import { NextResponse } from "next/server"
import { clientKey, rateLimit } from "@/lib/rateLimit"
import { parseLoanCountry } from "@/features/loans/types"

export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  const limited = rateLimit(clientKey(req, "loans-leads"), { limit: 8, windowMs: 60_000 })
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
  if (record.consent !== true) {
    return NextResponse.json({ ok: false, error: "Consent required" }, { status: 400 })
  }

  const country = parseLoanCountry(record.country)
  const school = typeof record.school === "string" ? record.school.trim().slice(0, 200) : ""
  const level = typeof record.level === "string" ? record.level.trim().slice(0, 80) : ""
  const year = typeof record.year === "string" ? record.year.trim().slice(0, 40) : ""
  const residency =
    typeof record.residency === "string" ? record.residency.trim().slice(0, 80) : ""
  const amount =
    typeof record.amount === "string"
      ? record.amount.replace(/[^0-9]/g, "").slice(0, 12)
      : ""
  const email =
    typeof record.email === "string" && record.email.includes("@")
      ? record.email.trim().slice(0, 254)
      : undefined

  if (!school || !level || !year || !residency) {
    return NextResponse.json(
      { ok: false, error: "School, level, year, and residency are required" },
      { status: 400 },
    )
  }

  // Explicitly reject sensitive fields if a client ever sends them.
  for (const banned of ["sin", "ssn", "dob", "dateOfBirth", "address", "creditScore", "credit_score"]) {
    if (banned in record) {
      return NextResponse.json(
        { ok: false, error: "Sensitive fields are not accepted" },
        { status: 400 },
      )
    }
  }

  const payload = {
    type: "private_loan_lead",
    country,
    school,
    level,
    year,
    residency,
    amount: amount || undefined,
    email,
    consent: true,
  }

  const webhook = process.env.LEADS_WEBHOOK_URL?.trim()
  if (webhook) {
    try {
      await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
    } catch {
      // Succeed locally even if webhook is down.
    }
  }

  return NextResponse.json({ ok: true })
}
