"use client"

import Link from "next/link"
import {
  CANADA_PROVINCE_CHIPS,
  US_REGIONAL_LINKS,
  normalizeCanadaProvince,
  regionalAidForProvince,
} from "@/features/student-profile/regionalAid"
import type { StudentCountry } from "@/features/student-profile/types"

type RegionalAidStripProps = {
  country: StudentCountry
  provinceOrState: string
  onProvinceChange?: (code: string) => void
}

export function RegionalAidStrip({
  country,
  provinceOrState,
  onProvinceChange,
}: RegionalAidStripProps) {
  if (country === "USA") {
    return (
      <section className="rounded-2xl border border-border bg-card p-3 md:p-4">
        <h2 className="text-sm font-semibold text-foreground">Start here for your region</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Official U.S. federal aid — confirm deadlines on StudentAid.gov.
        </p>
        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {US_REGIONAL_LINKS.map((link) => (
            <a
              key={link.id}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center justify-center rounded-xl bg-gold px-4 text-sm font-bold text-gold-foreground transition-colors hover:bg-gold-hover"
            >
              {link.label}
            </a>
          ))}
        </div>
      </section>
    )
  }

  const selected = normalizeCanadaProvince(provinceOrState) || "Other"
  const aid = regionalAidForProvince(selected)

  return (
    <section className="rounded-2xl border border-border bg-card p-3 md:p-4">
      <h2 className="text-sm font-semibold text-foreground">Start here for your region</h2>
      <p className="mt-1 text-xs text-muted-foreground">
        Provincial student aid first. Federal grants and NSLSC stay in results.
      </p>
      <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Province">
        {CANADA_PROVINCE_CHIPS.map((chip) => {
          const active = chip.code === selected
          return (
            <button
              key={chip.code}
              type="button"
              onClick={() => onProvinceChange?.(chip.code)}
              className={`inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl px-3 text-sm font-semibold transition-colors ${
                active
                  ? "bg-gold text-gold-foreground hover:bg-gold-hover"
                  : "border border-border text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
              aria-pressed={active}
            >
              {chip.label}
            </button>
          )
        })}
      </div>
      <a
        href={aid.href}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-border px-4 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
      >
        {aid.cta}
      </a>
      {aid.code === "ON" ? (
        <p className="mt-2 text-xs text-muted-foreground">
          Ontario students apply through{" "}
          <Link href="/guides/osap-vs-private-loans" className="font-medium text-link underline">
            OSAP
          </Link>
          . Confirm eligibility on ontario.ca.
        </p>
      ) : null}
    </section>
  )
}
