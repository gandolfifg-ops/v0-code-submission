"use client"

import { useState } from "react"
import Link from "next/link"
import { JsonLd } from "@/components/JsonLd"
import { InfoPage } from "@/components/layout/InfoPage"
import { faqPageJsonLd } from "@/lib/seo"

const FAQS = [
  {
    category: "Getting Started",
    items: [
      {
        q: "Is WealthNutz free?",
        a: "Yes. Scholarship search, loan tools, marketplace links, and chat are free to use. We may earn a referral commission if you open a product through an affiliate link.",
      },
      {
        q: "How do I apply for a loan?",
        a: "WealthNutz does not issue loans. Use Loan Tools to find official lender pages, then apply on the lender’s site.",
      },
      {
        q: "Which countries are supported?",
        a: "Canada and the United States. Use the country toggle on Marketplace, Scholarships, and Loans.",
      },
    ],
  },
  {
    category: "Scholarships & Loans",
    items: [
      {
        q: "Is scholarship data a live official database?",
        a: "No. We try live web search when configured. If that fails, we show curated official starting points. Always confirm deadlines on the awarding site.",
      },
      {
        q: "Are loan rates guaranteed quotes?",
        a: "No. Rates are advertised on public pages. Confirm APR, fees, and eligibility with the lender.",
      },
      {
        q: "Can I save scholarships and loans?",
        a: "Yes. Tap Save on a result card (tap Saved again to remove it). Items appear on the Saved page. They stay in this browser only. There is no account sync yet.",
      },
    ],
  },
  {
    category: "Privacy & Chat",
    items: [
      {
        q: "Do you sell my personal information?",
        a: "No. See our Privacy Policy for details.",
      },
      {
        q: "Is chat financial advice?",
        a: "No. Chat is general education only. Confirm scholarships, loans, and banking details on official school and government sites. If chat cannot answer, the page will say so.",
      },
      {
        q: "Why did a live result look wrong?",
        a: "Live search can miss or rank a weak page. Use the school pages under Schools and official government links, then tap the official URL on the card to confirm.",
      },
    ],
  },
]

export default function HelpPage() {
  const [openItem, setOpenItem] = useState<string | null>(null)

  const flatFaqs = FAQS.flatMap((cat) => cat.items)

  return (
    <InfoPage title="Help Center" lede="Answers about scholarships, loans, marketplace links, and chat.">
      <JsonLd data={faqPageJsonLd(flatFaqs)} />
      {FAQS.map((cat) => (
        <section key={cat.category}>
          <h2 className="text-lg font-semibold text-foreground">{cat.category}</h2>
          <div className="mt-3 space-y-2">
            {cat.items.map((item, i) => {
              const key = `${cat.category}-${i}`
              const open = openItem === key
              return (
                <div key={key} className="rounded-xl border border-border bg-card">
                  <button
                    type="button"
                    id={`${key}-button`}
                    aria-expanded={open}
                    aria-controls={`${key}-panel`}
                    onClick={() => setOpenItem(open ? null : key)}
                    className="flex min-h-11 w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-semibold text-foreground transition-colors hover:bg-muted/50"
                  >
                    {item.q}
                    <span aria-hidden="true">{open ? "−" : "+"}</span>
                  </button>
                  {open && (
                    <p id={`${key}-panel`} role="region" aria-labelledby={`${key}-button`} className="px-4 pb-4 text-sm text-muted-foreground">
                      {item.a}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </section>
      ))}
      <p>
        Still stuck?{" "}
        <Link href="/contact" className="font-medium text-link underline">
          Contact us
        </Link>
        .
      </p>
    </InfoPage>
  )
}
