"use client"

import { useState } from "react"
import Link from "next/link"
import { InfoPage } from "@/components/layout/InfoPage"

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
        a: "Yes. Tap Save on a result card. Items appear on the Saved page. If login is not set up, they stay in this browser only.",
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
        q: "Why is chat unavailable?",
        a: "Chat needs an Anthropic API key on the server. If that key is missing, the Chat page shows a clear message instead of a broken composer.",
      },
    ],
  },
]

export default function HelpPage() {
  const [openItem, setOpenItem] = useState<string | null>(null)

  return (
    <InfoPage title="Help Center" lede="Answers about scholarships, loans, marketplace links, and chat.">
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
                    onClick={() => setOpenItem(open ? null : key)}
                    className="flex min-h-11 w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-semibold text-foreground transition-colors hover:bg-muted/50"
                  >
                    {item.q}
                    <span aria-hidden="true">{open ? "−" : "+"}</span>
                  </button>
                  {open && <p className="px-4 pb-4 text-sm text-muted-foreground">{item.a}</p>}
                </div>
              )
            })}
          </div>
        </section>
      ))}
      <p>
        Still stuck?{" "}
        <Link href="/contact" className="font-medium text-[#8B6914] underline dark:text-[#C9A84C]">
          Contact us
        </Link>
        .
      </p>
    </InfoPage>
  )
}
