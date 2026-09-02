"use client"

import { useMemo, useState } from "react"

function monthlyPayment(principal: number, annualRate: number, months: number): number {
  if (principal <= 0 || months <= 0) return 0
  const r = annualRate / 100 / 12
  if (r === 0) return principal / months
  return (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1)
}

const fieldClass =
  "min-h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground"

export function PaymentCalculator() {
  const [amount, setAmount] = useState(15000)
  const [apr, setApr] = useState(8.5)
  const [months, setMonths] = useState(60)

  const payment = useMemo(() => monthlyPayment(amount, apr, months), [amount, apr, months])

  return (
    <section className="rounded-2xl border border-border bg-card p-4 sm:p-6">
      <h2 className="text-lg font-semibold text-foreground">Payment estimator</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Example only. Enter an APR from a lender’s site to estimate a payment. This is not
        an offer or a credit decision.
      </p>

      <label className="mt-4 block text-xs font-medium text-muted-foreground">
        Loan amount (USD/CAD)
        <input
          className={`${fieldClass} mt-1`}
          type="number"
          min={500}
          max={200000}
          step={500}
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value) || 0)}
        />
      </label>
      <label className="mt-3 block text-xs font-medium text-muted-foreground">
        Example APR (%)
        <input
          className={`${fieldClass} mt-1`}
          type="number"
          min={0}
          max={40}
          step={0.1}
          value={apr}
          onChange={(e) => setApr(Number(e.target.value) || 0)}
        />
      </label>
      <label className="mt-3 block text-xs font-medium text-muted-foreground">
        Term (months)
        <input
          className={`${fieldClass} mt-1`}
          type="number"
          min={12}
          max={144}
          step={12}
          value={months}
          onChange={(e) => setMonths(Number(e.target.value) || 0)}
        />
      </label>

      <p className="mt-5 text-sm text-muted-foreground">Estimated monthly payment</p>
      <p className="text-3xl font-bold tracking-tight text-[#C9A84C]">
        ${payment.toFixed(0)}
        <span className="ml-1 text-sm font-medium text-muted-foreground">/month</span>
      </p>
    </section>
  )
}
