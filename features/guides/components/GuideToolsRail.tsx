"use client"

import Link from "next/link"
import { MARKETPLACE_PRODUCTS } from "@/features/marketplace/data/products"
import { STUDENT_CARDS } from "@/features/marketplace/data/cards"
import type { Country } from "@/features/marketplace/types"
import {
  getStoredCountry,
  subscribeStudentProfile,
} from "@/features/student-profile/store"
import { useEffect, useMemo, useState } from "react"

type GuideToolsRailProps = {
  /** Force country for a Canada/US-specific guide. */
  country?: Country
}

export function GuideToolsRail({ country: forced }: GuideToolsRailProps) {
  const [country, setCountry] = useState<Country>(forced ?? "CA")

  useEffect(() => {
    if (forced) {
      setCountry(forced)
      return
    }
    const sync = () => {
      const stored = getStoredCountry()
      if (stored) setCountry(stored === "USA" ? "US" : "CA")
    }
    sync()
    return subscribeStudentProfile(sync)
  }, [forced])

  const bank = useMemo(
    () => MARKETPLACE_PRODUCTS.find((p) => p.country === country && p.category === "banking"),
    [country],
  )
  const investing = useMemo(
    () => MARKETPLACE_PRODUCTS.find((p) => p.country === country && p.category === "investing"),
    [country],
  )
  const card = useMemo(
    () => STUDENT_CARDS.find((p) => p.country === country) ??
      MARKETPLACE_PRODUCTS.find((p) => p.country === country && p.category === "credit"),
    [country],
  )
  const aid = useMemo(
    () => MARKETPLACE_PRODUCTS.find((p) => p.country === country && p.category === "student-aid"),
    [country],
  )

  return (
    <aside className="mt-10 rounded-2xl border border-border bg-card p-4 sm:p-5">
      <h2 className="text-base font-semibold text-foreground">Related tools</h2>
      <ul className="mt-3 space-y-3 text-sm">
        {bank ? (
          <li>
            <a
              href={bank.href}
              target="_blank"
              rel={bank.affiliate ? "noopener sponsored" : "noopener"}
              className="font-medium text-link underline"
            >
              {bank.name}
            </a>
            <span className="ml-2 text-xs text-muted-foreground">
              {bank.affiliate ? "Affiliate" : "Curated"}
            </span>
          </li>
        ) : null}
        {investing ? (
          <li>
            <a
              href={investing.href}
              target="_blank"
              rel={investing.affiliate ? "noopener sponsored" : "noopener"}
              className="font-medium text-link underline"
            >
              {investing.name}
            </a>
            <span className="ml-2 text-xs text-muted-foreground">
              {investing.affiliate ? "Affiliate" : "Curated"}
            </span>
          </li>
        ) : null}
        {card ? (
          <li>
            <a
              href={card.href}
              target="_blank"
              rel={card.affiliate ? "noopener sponsored" : "noopener"}
              className="font-medium text-link underline"
            >
              {card.name}
            </a>
            <span className="ml-2 text-xs text-muted-foreground">
              {card.affiliate ? "Affiliate" : "Curated"} ·{" "}
              <Link href="/cards" className="underline">
                Cards
              </Link>
            </span>
          </li>
        ) : null}
        {aid ? (
          <li className="opacity-80">
            <a href={aid.href} target="_blank" rel="noopener" className="font-medium text-link underline">
              {aid.name}
            </a>
            <span className="ml-2 text-xs text-muted-foreground">Official · not affiliate</span>
          </li>
        ) : null}
      </ul>
    </aside>
  )
}
