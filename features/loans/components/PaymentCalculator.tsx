"use client"

import { useMemo, useState } from "react"
import { Calculator } from "lucide-react"
import { SectionHeading } from "@/components/layout/SectionHeading"

const AMOUNT_MIN = 1
const AMOUNT_MAX = 500_000
const APR_MIN = 0
const APR_MAX = 40
const TERM_MIN = 1
const TERM_MAX = 360

function monthlyPayment(principal: number, annualRate: number, months: number): number {
  if (!Number.isFinite(principal) || !Number.isFinite(annualRate) || !Number.isFinite(months)) {
    return NaN
  }
  if (principal <= 0 || months <= 0) return 0
  const r = annualRate / 100 / 12
  if (r === 0) return principal / months
  const factor = Math.pow(1 + r, months)
  if (!Number.isFinite(factor) || factor === 1) return NaN
  const payment = (principal * r * factor) / (factor - 1)
  return Number.isFinite(payment) ? payment : NaN
}

function stripLeadingZeros(raw: string, allowDecimal: boolean): string {
  let s = allowDecimal ? raw.replace(/[^\d.]/g, "") : raw.replace(/\D/g, "")
  if (allowDecimal) {
    const firstDot = s.indexOf(".")
    if (firstDot !== -1) {
      s = `${s.slice(0, firstDot + 1)}${s.slice(firstDot + 1).replace(/\./g, "")}`
    }
    const [intPart = "", fracPart] = s.split(".")
    const strippedInt = intPart.replace(/^0+(?=\d)/, "")
    if (fracPart !== undefined) return `${strippedInt === "" ? "0" : strippedInt}.${fracPart}`
    return strippedInt
  }
  return s.replace(/^0+(?=\d)/, "")
}

function parseBounded(raw: string, min: number, max: number): number | null {
  if (raw.trim() === "" || raw === ".") return null
  const n = Number(raw)
  if (!Number.isFinite(n) || n < min || n > max) return null
  return n
}

const fieldClass =
  "min-h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground"

function formatPayment(payment: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Math.round(payment))
}

export function PaymentCalculator() {
  const [amountRaw, setAmountRaw] = useState("15000")
  const [aprRaw, setAprRaw] = useState("8.5")
  const [monthsRaw, setMonthsRaw] = useState("60")

  const amount = parseBounded(amountRaw, AMOUNT_MIN, AMOUNT_MAX)
  const apr = parseBounded(aprRaw, APR_MIN, APR_MAX)
  const months = parseBounded(monthsRaw, TERM_MIN, TERM_MAX)
  const valid = amount !== null && apr !== null && months !== null

  const payment = useMemo(() => {
    if (!valid || amount === null || apr === null || months === null) return null
    const value = monthlyPayment(amount, apr, months)
    return Number.isFinite(value) ? value : null
  }, [valid, amount, apr, months])

  return (
    <section className="rounded-2xl border border-border bg-card p-3 md:p-6">
      <SectionHeading icon={Calculator}>Payment estimator</SectionHeading>
      <p className="mt-1 text-sm text-muted-foreground">
        Example only. Enter an APR from a lender’s site to estimate a payment. This is not
        an offer or a credit decision.
      </p>

      <label className="mt-4 block text-xs font-medium text-muted-foreground">
        Loan amount (USD/CAD)
        <input
          className={`${fieldClass} mt-1`}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          value={amountRaw}
          onChange={(e) => setAmountRaw(stripLeadingZeros(e.target.value, false))}
        />
        <span className="mt-1 block font-normal">
          ${AMOUNT_MIN.toLocaleString()}–${AMOUNT_MAX.toLocaleString()}
        </span>
      </label>
      <label className="mt-3 block text-xs font-medium text-muted-foreground">
        Example APR (%)
        <input
          className={`${fieldClass} mt-1`}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          value={aprRaw}
          onChange={(e) => setAprRaw(stripLeadingZeros(e.target.value, true))}
        />
        <span className="mt-1 block font-normal">
          {APR_MIN}–{APR_MAX}%
        </span>
      </label>
      <label className="mt-3 block text-xs font-medium text-muted-foreground">
        Term (months)
        <input
          className={`${fieldClass} mt-1`}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          value={monthsRaw}
          onChange={(e) => setMonthsRaw(stripLeadingZeros(e.target.value, false))}
        />
        <span className="mt-1 block font-normal">
          {TERM_MIN}–{TERM_MAX} months (30 years)
        </span>
      </label>

      <p className="mt-5 text-sm text-muted-foreground">Estimated monthly payment</p>
      {payment === null ? (
        <p className="text-lg font-semibold text-foreground">
          $0
          <span className="ml-2 text-sm font-medium text-muted-foreground">Enter valid numbers</span>
        </p>
      ) : (
        <p className="text-3xl font-bold tracking-tight text-[#C9A84C]">
          {formatPayment(payment)}
          <span className="ml-1 text-sm font-medium text-muted-foreground">/month</span>
        </p>
      )}
    </section>
  )
}
