"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { CountryFlag } from "@/components/CountryFlag"
import { CountryToggle } from "@/components/CountryToggle"
import { ProductCard } from "@/features/marketplace/components/ProductCard"
import {
  CATEGORY_LABELS,
  CATEGORY_ORDER,
  MARKETPLACE_PRODUCTS,
} from "@/features/marketplace/data/products"
import type { Country } from "@/features/marketplace/types"

const COUNTRY_COPY: Record<Country, { name: string; intro: string }> = {
  CA: {
    name: "Canada",
    intro:
      "No-fee banking, investing apps, and official federal student aid for Canadian students.",
  },
  US: {
    name: "United States",
    intro:
      "Student banking, Roth IRAs, FAFSA, and credit-building cards for U.S. students.",
  },
}

export function MarketplaceHome() {
  const [country, setCountry] = useState<Country>("CA")
  const copy = COUNTRY_COPY[country]

  const products = useMemo(
    () => MARKETPLACE_PRODUCTS.filter((p) => p.country === country),
    [country],
  )

  const grouped = useMemo(
    () =>
      CATEGORY_ORDER.map((category) => ({
        category,
        items: products.filter((p) => p.category === category),
      })).filter((group) => group.items.length > 0),
    [products],
  )

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <p className="text-xs font-semibold uppercase tracking-widest text-[#C9A84C]">
        Marketplace
      </p>
      <h1 className="mt-2 flex max-w-2xl flex-wrap items-center gap-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        <span>Student money products,</span>
        <span className="inline-flex items-center gap-2">
          <CountryFlag code={country} className="h-5 w-8 rounded-sm" />
          {copy.name}
        </span>
      </h1>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
        {copy.intro} These are curated links to official sites — not a live rate
        database. Always confirm fees and eligibility with the provider.
      </p>

      <CountryToggle
        className="mt-6 grid grid-cols-2 gap-2"
        value={country}
        onChange={setCountry}
        options={[
          { value: "CA", flag: "CA", label: "Canada" },
          { value: "US", flag: "US", label: "United States" },
        ]}
      />

      {grouped.map((group) => (
        <section key={group.category} className="mt-10">
          <h2 className="text-lg font-semibold text-foreground">
            {CATEGORY_LABELS[group.category]}
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {group.items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      ))}

      <section className="mt-12 grid gap-4 sm:grid-cols-2">
        <Link
          href="/scholarships"
          className="interactive-card rounded-2xl border border-border bg-card p-5"
        >
          <h2 className="font-semibold text-foreground">Scholarship Finder</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Search awards by country and major →
          </p>
        </Link>
        <Link
          href="/loans"
          className="interactive-card rounded-2xl border border-border bg-card p-5"
        >
          <h2 className="font-semibold text-foreground">Loan Tools</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Compare lenders and estimate payments →
          </p>
        </Link>
      </section>

      <p className="mt-10 max-w-3xl text-xs leading-relaxed text-muted-foreground">
        WealthNutz may earn a referral commission if you open an account through
        a link marked “Affiliate link.” That never changes which products we list.
        Government pages (FAFSA, StudentAid.gov, NSLSC) are official — not
        affiliates. This is education, not personalized financial advice.
      </p>
    </div>
  )
}
