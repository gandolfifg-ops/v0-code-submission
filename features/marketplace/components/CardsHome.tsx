"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { CreditCard } from "lucide-react"
import { CountryFlag } from "@/components/CountryFlag"
import { CountryToggle } from "@/components/CountryToggle"
import { SectionHeading } from "@/components/layout/SectionHeading"
import { CardProductCard } from "@/features/marketplace/components/CardProductCard"
import { CardsComparisonTable } from "@/features/marketplace/components/CardsComparisonTable"
import { SponsoredSlot } from "@/features/marketplace/components/SponsoredSlot"
import {
  cardComparisonRows,
  cardsForCountry,
  STUDENT_CARDS,
} from "@/features/marketplace/data/cards"
import type { Country } from "@/features/marketplace/types"
import {
  getStoredCountry,
  saveStudentCountry,
  subscribeStudentProfile,
} from "@/features/student-profile/store"

export function CardsHome() {
  const [country, setCountry] = useState<Country>("CA")

  useEffect(() => {
    const sync = () => {
      const storedCountry = getStoredCountry()
      if (storedCountry) setCountry(storedCountry === "USA" ? "US" : "CA")
    }
    sync()
    return subscribeStudentProfile(sync)
  }, [])

  const cards = useMemo(() => cardsForCountry(country), [country])
  const rows = useMemo(() => cardComparisonRows(country), [country])

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:py-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-link">Cards</p>
          <h1 className="mt-2 text-2xl font-bold leading-snug tracking-tight text-foreground sm:text-4xl">
            Student credit cards in{" "}
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap align-middle">
              <CountryFlag code={country} className="h-4 w-6 rounded-sm sm:h-5 sm:w-8" />
              {country === "CA" ? "Canada" : "the United States"}
            </span>
          </h1>
          <p className="mt-3 text-base font-medium leading-relaxed text-foreground">
            Official issuer hubs for student cards — not a live rate database and not approval advice.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Always confirm annual fees, welcome offers, and eligibility on the issuer site. WealthNutz
            does not invent APRs or approval odds.
          </p>
          <p className="mt-2 text-sm">
            <Link
              href={
                country === "CA"
                  ? "/guides/student-credit-cards-canada"
                  : "/guides/student-credit-cards-usa"
              }
              className="font-medium text-link underline"
            >
              Read the short student cards guide
            </Link>
          </p>
        </div>
        <CountryToggle
          className="grid w-full grid-cols-2 gap-2 lg:w-[22rem] lg:shrink-0"
          value={country}
          onChange={(next) => {
            setCountry(next)
            saveStudentCountry(next === "US" ? "USA" : "Canada")
          }}
          options={[
            { value: "CA", flag: "CA", label: "Canada" },
            { value: "US", flag: "US", label: "United States" },
          ]}
        />
      </div>

      <SponsoredSlot
        products={STUDENT_CARDS.filter((card) => card.country === country)}
        placement="cards"
        className="mt-6"
      />

      <CardsComparisonTable
        rows={rows}
        title={country === "CA" ? "Canada student cards snapshot" : "United States student cards snapshot"}
      />

      <section className="mt-10 lg:mt-12">
        <SectionHeading icon={CreditCard}>Student card options</SectionHeading>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Links go to official issuer pages. Save any card you want to revisit in this browser.
        </p>
        <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 lg:gap-4">
          {cards.map((card) => (
            <CardProductCard key={card.id} card={card} />
          ))}
        </div>
      </section>

      <section className="mt-10 rounded-2xl border border-border bg-card p-4 sm:p-5">
        <h2 className="text-base font-semibold text-foreground">Official student aid first</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Credit cards are optional. Start with government aid hubs — these links are not affiliates.
        </p>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          {country === "CA" ? (
            <a
              href="https://www.csnpe-nslsc.canada.ca/en/home"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-border bg-background px-4 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
            >
              NSLSC (Canada Student Loans)
            </a>
          ) : (
            <a
              href="https://studentaid.gov/h/apply-for-aid/fafsa"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-border bg-background px-4 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
            >
              FAFSA on StudentAid.gov
            </a>
          )}
          <Link
            href="/loans"
            className="inline-flex min-h-11 items-center justify-center rounded-xl bg-gold px-4 text-sm font-bold text-gold-foreground transition-colors hover:bg-gold-hover"
          >
            Loan tools
          </Link>
        </div>
      </section>
    </div>
  )
}
