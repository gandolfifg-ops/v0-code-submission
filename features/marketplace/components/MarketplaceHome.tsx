"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Building2, CreditCard, GraduationCap, Landmark, PiggyBank, Search } from "lucide-react"
import { CountryFlag } from "@/components/CountryFlag"
import { CountryToggle } from "@/components/CountryToggle"
import { SectionHeading } from "@/components/layout/SectionHeading"
import { ProductCard } from "@/features/marketplace/components/ProductCard"
import { ComparisonTable } from "@/features/marketplace/components/ComparisonTable"
import {
  CANADA_COMPARISON,
  US_COMPARISON,
} from "@/features/marketplace/data/comparison"
import {
  CATEGORY_LABELS,
  CATEGORY_ORDER,
  MARKETPLACE_PRODUCTS,
} from "@/features/marketplace/data/products"
import type { Country, ProductCategory } from "@/features/marketplace/types"

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

const CATEGORY_ICONS: Record<ProductCategory, typeof Landmark> = {
  banking: Landmark,
  investing: PiggyBank,
  "student-aid": GraduationCap,
  credit: CreditCard,
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
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:py-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#C9A84C]">
            Marketplace
          </p>
          <h1 className="mt-2 flex flex-wrap items-center gap-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            <span>Student money products,</span>
            <span className="inline-flex items-center gap-2">
              <CountryFlag code={country} className="h-5 w-8 rounded-sm" />
              {copy.name}
            </span>
          </h1>
          <p className="mt-3 text-base font-medium leading-relaxed text-foreground">
            WealthNutz helps students in Canada and the US compare official banking, scholarship, and loan options — then go apply on the provider’s site.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
            {copy.intro} These are curated links to official sites — not a live rate
            database. Always confirm fees and eligibility with the provider.
          </p>
          <p className="mt-2 text-sm">
            <Link
              href="/scholarships#student-profile"
              className="font-medium text-[#8B6914] underline dark:text-[#C9A84C]"
            >
              Set your student profile
            </Link>
            <span className="text-muted-foreground"> — optional, saved in this browser.</span>
          </p>
          {country === "CA" && (
            <p className="mt-2 text-sm">
              <Link
                href="/guides/best-student-bank-canada"
                className="font-medium text-[#8B6914] underline dark:text-[#C9A84C]"
              >
                Read the 2026 student bank guide
              </Link>
            </p>
          )}
        </div>
        <CountryToggle
          className="grid w-full grid-cols-2 gap-2 lg:w-[22rem] lg:shrink-0"
          value={country}
          onChange={setCountry}
          options={[
            { value: "CA", flag: "CA", label: "Canada" },
            { value: "US", flag: "US", label: "United States" },
          ]}
        />
      </div>

      <ComparisonTable
        rows={country === "CA" ? CANADA_COMPARISON : US_COMPARISON}
        title={country === "CA" ? "Canada banking snapshot" : "United States snapshot"}
      />

      {grouped.map((group) => (
        <section key={group.category} className="mt-7 lg:mt-8">
          <SectionHeading icon={CATEGORY_ICONS[group.category]}>
            {CATEGORY_LABELS[group.category]}
          </SectionHeading>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
            {group.items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      ))}

      <section className="mt-8 grid gap-3 sm:grid-cols-2 lg:mt-10">
        <Link
          href="/scholarships"
          className="interactive-card flex items-start gap-3 rounded-2xl border border-border bg-card p-4 sm:p-5"
        >
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#C9A84C]/15 text-[#8B6914]">
            <Search className="h-4 w-4" aria-hidden="true" />
          </span>
          <div>
            <h2 className="font-semibold text-foreground">Scholarship Finder</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Search awards by country and major →
            </p>
          </div>
        </Link>
        <Link
          href="/loans"
          className="interactive-card flex items-start gap-3 rounded-2xl border border-border bg-card p-4 sm:p-5"
        >
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#C9A84C]/15 text-[#8B6914]">
            <Building2 className="h-4 w-4" aria-hidden="true" />
          </span>
          <div>
            <h2 className="font-semibold text-foreground">Loan Tools</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Compare lenders and estimate payments →
            </p>
          </div>
        </Link>
      </section>

      <p className="mt-8 max-w-3xl text-xs leading-relaxed text-muted-foreground">
        Some Marketplace product buttons may be affiliate links — we may earn a
        commission if you open an account. That never changes which products we
        list. Government pages (FAFSA, StudentAid.gov, NSLSC) are official — not
        affiliates. This is education, not personalized financial advice.
      </p>
    </div>
  )
}
