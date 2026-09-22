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
        a: "Yes. Scholarship search, loan tools, marketplace links, cards, and chat are free to use. We may earn a referral commission if you open a product through an affiliate link. An optional Kit (if launched) would be $9 or less — search stays free.",
      },
      {
        q: "How do I apply for a loan?",
        a: "WealthNutz does not issue loans. Use Loan Tools to find official lender pages, then apply on the lender’s site. Private-loan interest forms are optional and are not applications.",
      },
      {
        q: "Which countries are supported?",
        a: "Canada and the United States. Use the country toggle on Marketplace, Scholarships, Loans, and Cards.",
      },
    ],
  },
  {
    category: "Scholarships, Loans & Cards",
    items: [
      {
        q: "Is scholarship data a live official database?",
        a: "No. We try live web search when configured. If that fails, we show curated official starting points. Always confirm deadlines on the awarding site.",
      },
      {
        q: "Are loan rates or card offers guaranteed quotes?",
        a: "No. Rates and welcome offers are advertised on public pages. Confirm APR, fees, and eligibility with the lender or issuer.",
      },
      {
        q: "What does Featured vs Paid placement mean?",
        a: "Featured is editorial. Paid placement (sponsored) is a paid slot with a clear badge. Organic table order stays editorial. Government aid hubs are never sponsored.",
      },
      {
        q: "Can I save scholarships and loans?",
        a: "Yes. Tap Save on a result card (tap Saved again to remove it). Items appear on the Saved page. They stay in this browser only. There is no account sync yet.",
      },
    ],
  },
  {
    category: "Digest, Partners & Privacy",
    items: [
      {
        q: "What is the weekly digest?",
        a: "An optional email with aid reminders and Marketplace highlights. Partner banking/card updates are unchecked by default. See /digest and Privacy.",
      },
      {
        q: "Do you sell my personal information?",
        a: "No. See our Privacy Policy for details. We do not collect SIN, SSN, date of birth, full address, or credit score.",
      },
      {
        q: "Is chat financial advice?",
        a: "No. Chat is general education only. Confirm scholarships, loans, banking, and cards on official school and government sites. Official aid is preferred over sponsored products.",
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
    <InfoPage title="Help Center" lede="Answers about scholarships, loans, cards, marketplace links, digest, and chat.">
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
