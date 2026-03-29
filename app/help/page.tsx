/* build:v200 — WealthNutz Help Center — dark mode, gold branding */
"use client";

import { useState } from "react";

const GOLD = "#C9A84C";
const GOLD_DIM = "#8B6914";
const GOLD_HI = "#E8C97A";
const BG = "#050505";
const CARD = "rgba(255,255,255,0.03)";
const BORDER = "rgba(255,255,255,0.08)";
const GOLD_BORDER = "rgba(201,168,76,0.18)";
const TEXT = "#E8DCC8";
const MID = "#9A8F7E";
const DIM = "#5A5248";

const FAQS = [
  {
    category: "Getting Started",
    icon: "🚀",
    items: [
      {
        q: "Is WealthNutz completely free?",
        a: "Yes — 100% free with zero paywalls. The AI Scholarship Scout, Loan Finder, Savings Calculator, and AI Co-Pilot are all accessible at no cost. We earn a referral commission if you open a financial product through our affiliate links, but this never affects our recommendations.",
      },
      {
        q: "How do I apply for a loan through WealthNutz?",
        a: "WealthNutz is a discovery and comparison platform — we don't issue loans directly. Use the Loan Finder tool to browse options matched to your profile, then click the lender's CTA button to apply directly on their site. We surface your best-fit options; the application happens with the lender.",
      },
      {
        q: "Which countries are supported?",
        a: "WealthNutz covers the USA and Canada exclusively. All scholarship databases, loan products, government aid programs (FAFSA, NSLSC, OSAP), and savings accounts are tailored to North American students. Use the 🇨🇦 / 🇺🇸 toggle in the app to switch regions.",
      },
    ],
  },
  {
    category: "Scholarships & Loans",
    icon: "🎓",
    items: [
      {
        q: "How accurate is the scholarship data?",
        a: "Our database is curated and updated regularly with real scholarships from universities, foundations, government programs, and private organizations. Deadlines are verified, but always confirm the current cycle directly with the awarding institution before applying — requirements can change year to year.",
      },
      {
        q: "Why does the Scholarship Scout show 'No results found'?",
        a: "This usually happens when filters are too narrow. Try selecting 'Any' for your major, removing extra keywords, or switching between USA and Canada. Our database grows over time — check back if you don't find a perfect match today.",
      },
      {
        q: "Can I save scholarships and loans I like?",
        a: "Yes. Hit the bookmark icon on any card to save it. Saved items appear in your Saved tab instantly. If you're signed in, bookmarks sync across devices via your account. If you're browsing as a guest, items are saved locally and get merged into your account when you sign in.",
      },
    ],
  },
  {
    category: "Privacy & Security",
    icon: "🔒",
    items: [
      {
        q: "Is my data secure?",
        a: "All authentication and data storage is handled by Supabase, which uses AES-256 encryption at rest and TLS 1.3 in transit. We never store financial account numbers, SINs, or SSNs. Your saved items and profile data are only accessible to you. Review our full Privacy Policy for details.",
      },
      {
        q: "Do you sell my personal information?",
        a: "No. We do not sell, trade, or rent your personal information to third parties. Affiliate links may track clicks for commission purposes, but this is anonymous and contains no personally identifiable data. See our Privacy Policy for the full breakdown.",
      },
      {
        q: "How do I delete my account?",
        a: "Email us at wealthnutz.official@gmail.com with the subject 'Account Deletion Request' from your registered email address. We'll permanently delete your account and all associated data within 7 business days.",
      },
    ],
  },
  {
    category: "Technical",
    icon: "⚙️",
    items: [
      {
        q: "Does WealthNutz work on mobile?",
        a: "Yes — WealthNutz is fully responsive and optimized for mobile, tablet, and desktop. The tool panel, scholarship results, AI chat, and loan cards all adapt to your screen size.",
      },
      {
        q: "Why is the AI Co-Pilot not responding?",
        a: "The AI Co-Pilot uses the Anthropic Claude API. If you're not getting a response, check your internet connection and try again. If the issue persists for more than a few minutes, it may be a temporary service interruption — feel free to contact us.",
      },
    ],
  },
];

export default function HelpPage() {
  const [openItem, setOpenItem] = useState<string | null>(null);

  const toggle = (key: string) => setOpenItem(prev => (prev === key ? null : key));

  return (
    <main style={{ minHeight: "100vh", background: BG, color: TEXT, fontFamily: "Inter, system-ui, sans-serif" }}>
      {/* ── Top Bar ─────────────────────────────────────── */}
      <div style={{ borderBottom: `1px solid ${BORDER}`, padding: "14px 24px", display: "flex", alignItems: "center", gap: 12, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 50 }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
          <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
            <polygon points="16,2 30,9 30,23 16,30 2,23 2,9" stroke={GOLD} strokeWidth="1.8" fill="none" />
            <polygon points="16,7 25,11.5 25,20.5 16,25 7,20.5 7,11.5" fill={GOLD} opacity="0.15" />
            <text x="16" y="21" textAnchor="middle" style={{ fontFamily: "inherit", fontWeight: 900, fontSize: 11, fill: GOLD }}>W</text>
          </svg>
          <span style={{ fontSize: 14, fontWeight: 800, color: GOLD, letterSpacing: "-0.02em" }}>WealthNutz</span>
        </a>
        <span style={{ color: BORDER, fontSize: 16 }}>›</span>
        <span style={{ fontSize: 14, color: MID, fontWeight: 500 }}>Help Center</span>
      </div>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "60px 24px 80px" }}>
        {/* ── Hero ──────────────────────────────────────── */}
        <div style={{ marginBottom: 56, textAlign: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 56, height: 56, borderRadius: 16, background: `linear-gradient(135deg, ${GOLD}, ${GOLD_DIM})`, marginBottom: 20, boxShadow: `0 0 32px rgba(201,168,76,0.25)` }}>
            <span style={{ fontSize: 24 }}>💡</span>
          </div>
          <h1 style={{ fontSize: "clamp(28px,6vw,42px)", fontWeight: 900, color: TEXT, margin: "0 0 12px", letterSpacing: "-0.03em" }}>
            How can we help?
          </h1>
          <p style={{ fontSize: 16, color: MID, margin: 0, lineHeight: 1.6 }}>
            Everything you need to know about WealthNutz.
          </p>
        </div>

        {/* ── FAQ Categories ────────────────────────────── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
          {FAQS.map(cat => (
            <div key={cat.category}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <span style={{ fontSize: 18 }}>{cat.icon}</span>
                <h2 style={{ fontSize: 13, fontWeight: 700, color: GOLD, letterSpacing: ".1em", textTransform: "uppercase", margin: 0 }}>{cat.category}</h2>
                <div style={{ flex: 1, height: 1, background: GOLD_BORDER, marginLeft: 8 }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {cat.items.map((item, i) => {
                  const key = `${cat.category}-${i}`;
                  const isOpen = openItem === key;
                  return (
                    <div key={key}
                      style={{ background: isOpen ? "rgba(201,168,76,0.04)" : CARD, border: `1px solid ${isOpen ? GOLD_BORDER : BORDER}`, borderRadius: 12, overflow: "hidden", transition: "border-color .2s, background .2s" }}>
                      <button onClick={() => toggle(key)}
                        style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "18px 20px", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>
                        <span style={{ fontSize: 14, fontWeight: 600, color: isOpen ? GOLD_HI : TEXT, lineHeight: 1.4, flex: 1 }}>{item.q}</span>
                        <span style={{ fontSize: 18, color: GOLD, flexShrink: 0, transition: "transform .25s", transform: isOpen ? "rotate(45deg)" : "rotate(0)" }}>+</span>
                      </button>
                      {isOpen && (
                        <div style={{ padding: "0 20px 18px" }}>
                          <p style={{ fontSize: 14, color: MID, lineHeight: 1.7, margin: 0 }}>{item.a}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* ── Still need help CTA ───────────────────────── */}
        <div style={{ marginTop: 56, padding: "28px 28px", background: `linear-gradient(135deg, rgba(201,168,76,0.06), rgba(201,168,76,0.02))`, border: `1px solid ${GOLD_BORDER}`, borderRadius: 16, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 14 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: GOLD, letterSpacing: ".1em", textTransform: "uppercase", margin: 0 }}>Still have questions?</p>
          <p style={{ fontSize: 15, color: TEXT, margin: 0, lineHeight: 1.5 }}>
            Can't find what you're looking for? Our team typically responds within 24 hours.
          </p>
          <a href="/contact"
            style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "11px 24px", borderRadius: 10, background: `linear-gradient(135deg, ${GOLD}, ${GOLD_DIM})`, color: "#07090d", fontSize: 13, fontWeight: 800, textDecoration: "none", letterSpacing: ".02em", boxShadow: "0 0 20px rgba(201,168,76,0.25)" }}>
            Contact Us →
          </a>
        </div>
      </div>

      {/* ── Footer ────────────────────────────────────── */}
      <div style={{ borderTop: `1px solid ${BORDER}`, padding: "20px 24px", display: "flex", justifyContent: "center", gap: 24, flexWrap: "wrap" }}>
        {[["Home", "/"], ["Privacy Policy", "/privacy"], ["Terms", "/terms"], ["Contact", "/contact"]].map(([label, href]) => (
          <a key={href} href={href} style={{ fontSize: 12, color: DIM, textDecoration: "none", fontWeight: 500 }}
            onMouseEnter={e => (e.currentTarget.style.color = GOLD)}
            onMouseLeave={e => (e.currentTarget.style.color = DIM)}>
            {label}
          </a>
        ))}
      </div>
    </main>
  );
}
