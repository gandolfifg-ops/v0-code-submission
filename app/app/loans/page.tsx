"use client";

import { useState, useMemo, CSSProperties } from "react";
import Link from "next/link";

// ─── Design Tokens ────────────────────────────────────────────────────────────
const T = {
  bg:          "#050505",
  card:        "#0d0d0d",
  cardAlt:     "#0e0e0e",
  cardBorder:  "rgba(255,255,255,0.07)",
  border:      "rgba(255,255,255,0.08)",
  gold:        "#C9A84C",
  goldHi:      "#E8C97A",
  goldDim:     "#8B6914",
  text:        "#F0EDE6",
  mid:         "#9A9278",
  dim:         "#5A5445",
  green:       "#34D399",
  greenBg:     "rgba(52,211,153,0.10)",
  badge:       "rgba(201,168,76,0.12)",
  sidebarBg:   "#0e0e0e",
};

// ─── Types ────────────────────────────────────────────────────────────────────
type AprType    = "fixed" | "variable" | "both";
type LenderType = "bank" | "credit-union" | "digital";
type Country    = "US" | "CA";
type Purpose    =
  | "debt-consolidation"
  | "home-improvement"
  | "education"
  | "auto"
  | "business"
  | "personal"
  | "medical";

interface Loan {
  id:               string;
  lender:           string;
  lenderType:       LenderType;
  icon:             string;
  tagline:          string;
  aprMin:           number;   // %
  aprMax:           number;   // %
  aprType:          AprType;
  minAmount:        number;   // $
  maxAmount:        number;   // $
  termMin:          number;   // months
  termMax:          number;   // months
  minCreditScore:   number;
  requiresCoSigner: boolean;
  originationFee:   number;   // %, 0 = none
  countries:        Country[];
  purposes:         Purpose[];
  perks:            string[];
}

// ─── Mock Database (10 North American Lenders) ────────────────────────────────
const MOCK_LOANS: Loan[] = [
  {
    id: "sofi",
    lender: "SoFi",
    lenderType: "digital",
    icon: "⚡",
    tagline: "No fees. No nonsense.",
    aprMin: 8.99,  aprMax: 25.81, aprType: "fixed",
    minAmount: 5_000, maxAmount: 100_000,
    termMin: 24, termMax: 84,
    minCreditScore: 680,
    requiresCoSigner: false,
    originationFee: 0,
    countries: ["US"],
    purposes: ["debt-consolidation", "home-improvement", "medical", "personal"],
    perks: ["No origination fee", "Unemployment protection", "Career coaching"],
  },
  {
    id: "marcus",
    lender: "Marcus by Goldman Sachs",
    lenderType: "digital",
    icon: "🏦",
    tagline: "Straightforward personal loans with no fees.",
    aprMin: 6.99, aprMax: 24.99, aprType: "fixed",
    minAmount: 3_500, maxAmount: 40_000,
    termMin: 36, termMax: 72,
    minCreditScore: 660,
    requiresCoSigner: false,
    originationFee: 0,
    countries: ["US"],
    purposes: ["debt-consolidation", "home-improvement", "personal", "medical"],
    perks: ["On-time payment reward", "No origination fee", "No prepayment penalty"],
  },
  {
    id: "upstart",
    lender: "Upstart",
    lenderType: "digital",
    icon: "🤖",
    tagline: "AI-powered approval — beyond the credit score.",
    aprMin: 7.40, aprMax: 35.99, aprType: "fixed",
    minAmount: 1_000, maxAmount: 50_000,
    termMin: 36, termMax: 60,
    minCreditScore: 580,
    requiresCoSigner: false,
    originationFee: 12,
    countries: ["US"],
    purposes: ["debt-consolidation", "education", "auto", "personal", "medical"],
    perks: ["Accepts thin credit files", "Next-day funding", "Education & employment weighted"],
  },
  {
    id: "lightstream",
    lender: "LightStream",
    lenderType: "bank",
    icon: "🌿",
    tagline: "Rate-beat guarantee for excellent credit.",
    aprMin: 6.49, aprMax: 21.99, aprType: "both",
    minAmount: 5_000, maxAmount: 100_000,
    termMin: 24, termMax: 144,
    minCreditScore: 700,
    requiresCoSigner: false,
    originationFee: 0,
    countries: ["US"],
    purposes: ["home-improvement", "auto", "debt-consolidation", "personal", "business"],
    perks: ["Rate-beat program", "Same-day funding", "No fees of any kind"],
  },
  {
    id: "discover",
    lender: "Discover",
    lenderType: "bank",
    icon: "🔵",
    tagline: "Fixed rates. Transparent terms. No surprises.",
    aprMin: 7.99, aprMax: 24.99, aprType: "fixed",
    minAmount: 2_500, maxAmount: 40_000,
    termMin: 36, termMax: 84,
    minCreditScore: 660,
    requiresCoSigner: false,
    originationFee: 0,
    countries: ["US"],
    purposes: ["debt-consolidation", "home-improvement", "auto", "personal", "medical"],
    perks: ["No origination fee", "30-day return guarantee", "Free SSN alerts"],
  },
  {
    id: "prosper",
    lender: "Prosper",
    lenderType: "digital",
    icon: "🌱",
    tagline: "Peer-to-peer lending — funded by real investors.",
    aprMin: 8.99, aprMax: 35.99, aprType: "fixed",
    minAmount: 2_000, maxAmount: 50_000,
    termMin: 24, termMax: 60,
    minCreditScore: 640,
    requiresCoSigner: false,
    originationFee: 9.99,
    countries: ["US"],
    purposes: ["debt-consolidation", "home-improvement", "personal", "medical", "business"],
    perks: ["Soft credit check", "Joint applications accepted", "3-minute application"],
  },
  {
    id: "wellsfargo",
    lender: "Wells Fargo",
    lenderType: "bank",
    icon: "🏛️",
    tagline: "Relationship banking perks for existing members.",
    aprMin: 7.49, aprMax: 23.99, aprType: "fixed",
    minAmount: 3_000, maxAmount: 100_000,
    termMin: 12, termMax: 84,
    minCreditScore: 670,
    requiresCoSigner: true,
    originationFee: 0,
    countries: ["US"],
    purposes: ["debt-consolidation", "home-improvement", "auto", "personal", "business"],
    perks: ["Autopay rate discount", "Co-signer accepted", "In-branch support available"],
  },
  {
    id: "rbc",
    lender: "RBC Royal Bank",
    lenderType: "bank",
    icon: "🍁",
    tagline: "Canada's most trusted personal lending institution.",
    aprMin: 9.70, aprMax: 14.70, aprType: "both",
    minAmount: 1_000, maxAmount: 50_000,
    termMin: 12, termMax: 60,
    minCreditScore: 650,
    requiresCoSigner: true,
    originationFee: 0,
    countries: ["CA"],
    purposes: ["debt-consolidation", "home-improvement", "auto", "personal", "education"],
    perks: ["Fixed & variable options", "RBC Avion reward points", "Online + in-branch"],
  },
  {
    id: "tangerine",
    lender: "Tangerine Bank",
    lenderType: "digital",
    icon: "🍊",
    tagline: "Canada's fully digital bank — 100% online process.",
    aprMin: 11.95, aprMax: 18.95, aprType: "fixed",
    minAmount: 5_000, maxAmount: 35_000,
    termMin: 24, termMax: 60,
    minCreditScore: 630,
    requiresCoSigner: false,
    originationFee: 0,
    countries: ["CA"],
    purposes: ["debt-consolidation", "home-improvement", "personal", "auto"],
    perks: ["100% online process", "No origination fee", "Flexible payment schedules"],
  },
  {
    id: "duca",
    lender: "DUCA Credit Union",
    lenderType: "credit-union",
    icon: "🤝",
    tagline: "Member-owned. Lower rates. Better terms.",
    aprMin: 8.50, aprMax: 17.99, aprType: "both",
    minAmount: 1_000, maxAmount: 40_000,
    termMin: 12, termMax: 72,
    minCreditScore: 600,
    requiresCoSigner: false,
    originationFee: 0,
    countries: ["CA"],
    purposes: ["debt-consolidation", "home-improvement", "education", "personal", "auto", "business"],
    perks: ["Profit-sharing dividends", "Lower rates for members", "Flexible co-signer rules"],
  },
];

// ─── Credit Score Options ─────────────────────────────────────────────────────
const CREDIT_RANGES = [
  { value: "",          label: "Select credit score",  min: 0   },
  { value: "excellent", label: "Excellent (750+)",     min: 750 },
  { value: "good",      label: "Good (700–749)",       min: 700 },
  { value: "fair",      label: "Fair (650–699)",       min: 650 },
  { value: "poor",      label: "Poor (580–649)",       min: 580 },
] as const;

const PURPOSES = [
  { value: "",                   label: "Any purpose"         },
  { value: "debt-consolidation", label: "Debt Consolidation"  },
  { value: "home-improvement",   label: "Home Improvement"    },
  { value: "education",          label: "Education"           },
  { value: "auto",               label: "Auto"                },
  { value: "business",           label: "Business"            },
  { value: "medical",            label: "Medical"             },
  { value: "personal",           label: "Personal"            },
] as const;

// ─── Helpers ──────────────────────────────────────────────────────────────────
function calcMonthlyPayment(principal: number, annualRate: number, termMonths: number): number {
  const r = annualRate / 100 / 12;
  if (r === 0) return principal / termMonths;
  return (principal * r * Math.pow(1 + r, termMonths)) / (Math.pow(1 + r, termMonths) - 1);
}

function fmt(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

// ─── Page Component ───────────────────────────────────────────────────────────
export default function LoansPage() {
  // ── Sidebar filter state ────────────────────────────────────────────────────
  const [fixedOnly,   setFixedOnly]   = useState(false);
  const [noCoSigner,  setNoCoSigner]  = useState(false);
  const [noFee,       setNoFee]       = useState(false);
  const [canadaOnly,  setCanadaOnly]  = useState(false);
  const [digitalOnly, setDigitalOnly] = useState(false);

  // ── AI Matcher state ────────────────────────────────────────────────────────
  const [creditRange, setCreditRange] = useState<string>("");
  const [purpose,     setPurpose]     = useState<string>("");
  const [aiActive,    setAiActive]    = useState(false);

  // ── Inline calculator: which card is open + per-card amounts ────────────────
  const [openCalc, setOpenCalc] = useState<string | null>(null);
  const [calcAmt,  setCalcAmt]  = useState<Record<string, number>>({});

  // ── Filter loans ────────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return MOCK_LOANS.filter(l => {
      if (fixedOnly   && l.aprType !== "fixed")        return false;
      if (noCoSigner  && l.requiresCoSigner)           return false;
      if (noFee       && l.originationFee > 0)         return false;
      if (canadaOnly  && !l.countries.includes("CA"))  return false;
      if (digitalOnly && l.lenderType !== "digital")   return false;
      return true;
    });
  }, [fixedOnly, noCoSigner, noFee, canadaOnly, digitalOnly]);

  // ── AI sort + pick ──────────────────────────────────────────────────────────
  const { sorted, topPickId, topPickReason } = useMemo(() => {
    if (!aiActive || !creditRange) {
      return { sorted: filtered, topPickId: null as string | null, topPickReason: "" };
    }

    const creditMin = CREDIT_RANGES.find(c => c.value === creditRange)?.min ?? 0;

    const scored = filtered.map(loan => {
      let score = 0;

      // Only consider loans the user qualifies for
      const qualifies = creditMin >= loan.minCreditScore;
      if (!qualifies) score -= 1000;

      // APR quality — lower min APR wins
      score += (40 - loan.aprMin) * 2.5;

      // Purpose match bonus
      if (purpose && loan.purposes.includes(purpose as Purpose)) score += 20;

      // Zero origination fee is a strong positive signal
      if (loan.originationFee === 0) score += 10;

      // No co-signer needed is friendlier
      if (!loan.requiresCoSigner) score += 6;

      // For lower credit, prioritize accessibility (lower threshold = easier approval)
      if (creditRange === "poor" || creditRange === "fair") {
        score += Math.max(0, (680 - loan.minCreditScore) * 0.5);
      }

      // For excellent credit, prioritize low APR and max amount headroom
      if (creditRange === "excellent") {
        score += loan.maxAmount / 10_000;
      }

      return { loan, score };
    });

    scored.sort((a, b) => b.score - a.score);
    const top = scored[0]?.loan ?? null;

    let reason = "";
    if (top) {
      if (creditRange === "poor") {
        reason = `Best approval odds for your credit range — minimum score is ${top.minCreditScore}`;
      } else if (creditRange === "fair") {
        reason = `Highest approval odds for your ${creditRange} credit score`;
      } else if (purpose === "debt-consolidation") {
        reason = `Lowest advertised APR for debt consolidation with your profile`;
      } else if (purpose === "home-improvement") {
        reason = `Best term flexibility + APR for home improvement loans`;
      } else if (top.originationFee === 0 && top.aprMin < 10) {
        reason = `Best combination of low APR (${top.aprMin}%) + zero origination fees`;
      } else {
        reason = `Strongest overall match for your credit score and goals`;
      }
    }

    return {
      sorted: scored.map(s => s.loan),
      topPickId: top?.id ?? null,
      topPickReason: reason,
    };
  }, [filtered, aiActive, creditRange, purpose]);

  // ── Toggle inline calculator ────────────────────────────────────────────────
  function toggleCalc(id: string, loan: Loan) {
    if (openCalc === id) { setOpenCalc(null); return; }
    // Seed amount to 30% of max if not already set
    setCalcAmt(prev => ({ ...prev, [id]: prev[id] ?? Math.round(loan.maxAmount * 0.3 / 500) * 500 }));
    setOpenCalc(id);
  }

  // ── Shared styles ───────────────────────────────────────────────────────────
  const selectStyle: CSSProperties = {
    width: "100%",
    padding: "9px 32px 9px 12px",
    background: "#141414",
    border: `1px solid ${T.border}`,
    borderRadius: 10,
    color: T.text,
    fontSize: 13,
    outline: "none",
    cursor: "pointer",
    appearance: "none",
  };

  const lenderTypeBadge = (type: LenderType): CSSProperties => {
    const palette: Record<LenderType, [string, string]> = {
      bank:           ["#60A5FA", "rgba(96,165,250,0.12)"],
      "credit-union": ["#A78BFA", "rgba(167,139,250,0.12)"],
      digital:        [T.goldHi,  T.badge],
    };
    const [color, bg] = palette[type];
    return {
      display: "inline-flex", alignItems: "center",
      padding: "2px 8px", borderRadius: 20,
      fontSize: 10, fontWeight: 700,
      letterSpacing: "0.05em",
      color, background: bg,
      textTransform: "uppercase",
    };
  };

  const hasActiveFilters = fixedOnly || noCoSigner || noFee || canadaOnly || digitalOnly;

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: T.bg, color: T.text, fontFamily: "Inter, system-ui, sans-serif" }}>

      {/* ── Sticky Header ──────────────────────────────────────────────────── */}
      <header style={{
        padding: "0 24px",
        height: 60,
        borderBottom: `1px solid ${T.border}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        background: T.bg,
        zIndex: 50,
      }}>
        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
          <span style={{ fontSize: 18 }}>🔥</span>
          <span style={{ fontSize: 16, fontWeight: 900, color: T.gold, textTransform: "uppercase", letterSpacing: "-0.03em" }}>
            WealthNutz
          </span>
        </Link>
        <nav style={{ display: "flex", gap: 22, alignItems: "center" }}>
          <Link href="/"      style={{ fontSize: 13, color: T.mid,  textDecoration: "none" }}>Home</Link>
          <span               style={{ fontSize: 13, color: T.gold, fontWeight: 600 }}>Loans</span>
          <Link href="/about" style={{ fontSize: 13, color: T.mid,  textDecoration: "none" }}>About</Link>
        </nav>
      </header>

      {/* ── Page Hero ──────────────────────────────────────────────────────── */}
      <div style={{ padding: "52px 28px 36px", maxWidth: 1200, margin: "0 auto" }}>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: T.goldDim, textTransform: "uppercase" }}>
          Loan Marketplace
        </span>
        <h1 style={{
          fontSize: "clamp(26px, 4vw, 40px)",
          fontWeight: 800,
          color: T.text,
          margin: "8px 0 12px",
          letterSpacing: "-0.03em",
          lineHeight: 1.15,
        }}>
          Find your perfect loan —<br />
          <span style={{ color: T.gold }}>in minutes.</span>
        </h1>
        <p style={{ fontSize: 14, color: T.mid, margin: 0, maxWidth: 540, lineHeight: 1.7 }}>
          Compare {MOCK_LOANS.length} vetted North American lenders. Use the AI Matcher to surface your
          best option based on your credit profile and goals — no hard pull required.
        </p>
      </div>

      {/* ── Body: Sidebar + Cards ──────────────────────────────────────────── */}
      <div style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: "0 28px 100px",
        display: "flex",
        gap: 28,
        alignItems: "flex-start",
      }}>

        {/* ── Left Sidebar ─────────────────────────────────────────────────── */}
        <aside style={{ width: 272, flexShrink: 0, position: "sticky", top: 76 }}>

          {/* AI Matcher card */}
          <div style={{
            background: T.sidebarBg,
            border: `1px solid rgba(201,168,76,0.25)`,
            borderRadius: 18,
            padding: 22,
            marginBottom: 14,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
              <span style={{ fontSize: 20 }}>✨</span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: T.gold, letterSpacing: "-0.01em" }}>AI Matcher</div>
                <div style={{ fontSize: 11, color: T.dim }}>Surface your best option instantly</div>
              </div>
            </div>

            <label style={{ fontSize: 11, fontWeight: 600, color: T.mid, textTransform: "uppercase", letterSpacing: "0.07em", display: "block", marginBottom: 7 }}>
              Your Credit Score
            </label>
            <div style={{ position: "relative", marginBottom: 14 }}>
              <select
                value={creditRange}
                onChange={e => { setCreditRange(e.target.value); setAiActive(false); }}
                style={selectStyle}
              >
                {CREDIT_RANGES.map(c => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
              <span style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", color: T.mid, pointerEvents: "none", fontSize: 9 }}>▼</span>
            </div>

            <label style={{ fontSize: 11, fontWeight: 600, color: T.mid, textTransform: "uppercase", letterSpacing: "0.07em", display: "block", marginBottom: 7 }}>
              Loan Purpose
            </label>
            <div style={{ position: "relative", marginBottom: 20 }}>
              <select
                value={purpose}
                onChange={e => { setPurpose(e.target.value); setAiActive(false); }}
                style={selectStyle}
              >
                {PURPOSES.map(p => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
              <span style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", color: T.mid, pointerEvents: "none", fontSize: 9 }}>▼</span>
            </div>

            <button
              onClick={() => { if (creditRange) setAiActive(true); }}
              disabled={!creditRange}
              style={{
                width: "100%",
                padding: "11px 0",
                borderRadius: 11,
                background: creditRange
                  ? `linear-gradient(135deg, ${T.gold} 0%, ${T.goldDim} 100%)`
                  : "#1a1a1a",
                border: "none",
                color: creditRange ? "#050505" : T.dim,
                fontSize: 13,
                fontWeight: 700,
                cursor: creditRange ? "pointer" : "not-allowed",
                letterSpacing: "-0.01em",
                transition: "all 0.2s",
              }}
            >
              {aiActive ? "✓ Match Applied" : "Run AI Match →"}
            </button>

            {aiActive && (
              <button
                onClick={() => { setAiActive(false); setCreditRange(""); setPurpose(""); }}
                style={{ width: "100%", marginTop: 9, padding: "6px 0", background: "none", border: "none", color: T.dim, fontSize: 11, cursor: "pointer" }}
              >
                Clear match
              </button>
            )}
          </div>

          {/* Filters card */}
          <div style={{
            background: T.sidebarBg,
            border: `1px solid ${T.border}`,
            borderRadius: 18,
            padding: 22,
          }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: T.mid, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 18px" }}>
              Filter Results
            </p>

            {([
              { label: "Fixed Interest Rate",   checked: fixedOnly,   set: setFixedOnly   },
              { label: "No Co-Signer Required", checked: noCoSigner,  set: setNoCoSigner  },
              { label: "No Origination Fee",    checked: noFee,       set: setNoFee       },
              { label: "Available in Canada",   checked: canadaOnly,  set: setCanadaOnly  },
              { label: "Digital Lenders Only",  checked: digitalOnly, set: setDigitalOnly },
            ] as const).map(({ label, checked, set }) => (
              <label
                key={label}
                style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, cursor: "pointer" }}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={e => (set as (v: boolean) => void)(e.target.checked)}
                  style={{ width: 15, height: 15, accentColor: T.gold, cursor: "pointer", flexShrink: 0 }}
                />
                <span style={{
                  fontSize: 13,
                  color: checked ? T.text : T.mid,
                  fontWeight: checked ? 500 : 400,
                  transition: "color 0.15s",
                }}>
                  {label}
                </span>
              </label>
            ))}

            {hasActiveFilters && (
              <button
                onClick={() => { setFixedOnly(false); setNoCoSigner(false); setNoFee(false); setCanadaOnly(false); setDigitalOnly(false); }}
                style={{
                  marginTop: 6,
                  width: "100%",
                  background: "none",
                  border: `1px solid ${T.border}`,
                  borderRadius: 9,
                  padding: "6px 12px",
                  color: T.mid,
                  fontSize: 11,
                  cursor: "pointer",
                }}
              >
                Clear all filters
              </button>
            )}
          </div>

          <p style={{ textAlign: "center", fontSize: 12, color: T.dim, marginTop: 14 }}>
            Showing{" "}
            <span style={{ color: T.gold, fontWeight: 700 }}>{sorted.length}</span>
            {" "}of {MOCK_LOANS.length} lenders
          </p>
        </aside>

        {/* ── Loan Cards ───────────────────────────────────────────────────── */}
        <main style={{ flex: 1, minWidth: 0 }}>

          {/* Empty state */}
          {sorted.length === 0 && (
            <div style={{ textAlign: "center", padding: "72px 24px", color: T.mid }}>
              <div style={{ fontSize: 44, marginBottom: 14 }}>🔍</div>
              <p style={{ fontSize: 16, fontWeight: 700, color: T.text, marginBottom: 8 }}>No loans match your filters</p>
              <p style={{ fontSize: 13, lineHeight: 1.6 }}>Try removing one or two filters to see more lenders.</p>
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {sorted.map((loan) => {
              const isTop  = aiActive && loan.id === topPickId;
              const isOpen = openCalc === loan.id;
              const amt    = calcAmt[loan.id] ?? Math.round(loan.maxAmount * 0.3 / 500) * 500;
              const midTerm = Math.round((loan.termMin + loan.termMax) / 2);

              return (
                <div
                  key={loan.id}
                  style={{
                    background: isTop
                      ? "linear-gradient(150deg, #0f0f0f 0%, rgba(201,168,76,0.05) 100%)"
                      : T.card,
                    border: isTop
                      ? `1.5px solid rgba(201,168,76,0.42)`
                      : `1px solid ${T.cardBorder}`,
                    borderRadius: 20,
                    padding: "26px 26px 22px",
                    position: "relative",
                    transition: "border-color 0.2s",
                  }}
                >
                  {/* ── AI Top Pick banner ──────────────────────────────── */}
                  {isTop && (
                    <div style={{
                      position: "absolute",
                      top: -14,
                      left: 24,
                      background: `linear-gradient(135deg, ${T.gold} 0%, ${T.goldDim} 100%)`,
                      borderRadius: 20,
                      padding: "4px 16px",
                      fontSize: 11,
                      fontWeight: 800,
                      color: "#050505",
                      letterSpacing: "0.03em",
                      boxShadow: "0 2px 14px rgba(201,168,76,0.4)",
                    }}>
                      ✨ AI Top Pick
                    </div>
                  )}

                  {isTop && topPickReason && (
                    <p style={{ fontSize: 11, color: T.green, fontWeight: 600, margin: "0 0 18px", paddingTop: 2 }}>
                      ✓ {topPickReason}
                    </p>
                  )}

                  {/* ── Card header: logo + name + APR ─────────────────── */}
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 18 }}>
                    {/* Left: icon + name + meta */}
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <div style={{
                        width: 48,
                        height: 48,
                        borderRadius: 13,
                        background: "#1a1a1a",
                        border: `1px solid ${T.border}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 24,
                        flexShrink: 0,
                      }}>
                        {loan.icon}
                      </div>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5, flexWrap: "wrap" }}>
                          <h2 style={{ fontSize: 16, fontWeight: 700, color: T.text, margin: 0, letterSpacing: "-0.02em" }}>
                            {loan.lender}
                          </h2>
                          <span style={lenderTypeBadge(loan.lenderType)}>
                            {loan.lenderType.replace("-", " ")}
                          </span>
                          {loan.countries.map(c => (
                            <span key={c} style={{
                              fontSize: 10, fontWeight: 600,
                              color: T.mid,
                              background: "#1a1a1a",
                              padding: "2px 7px",
                              borderRadius: 6,
                              border: `1px solid ${T.border}`,
                            }}>
                              {c}
                            </span>
                          ))}
                        </div>
                        <p style={{ fontSize: 12, color: T.mid, margin: 0, lineHeight: 1.4 }}>
                          {loan.tagline}
                        </p>
                      </div>
                    </div>

                    {/* Right: APR display */}
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div style={{ fontSize: 26, fontWeight: 800, color: T.gold, letterSpacing: "-0.04em", lineHeight: 1 }}>
                        {loan.aprMin}%
                        <span style={{ fontSize: 12, fontWeight: 500, color: T.mid }}> APR</span>
                      </div>
                      <div style={{ fontSize: 11, color: T.dim, marginTop: 3 }}>
                        up to {loan.aprMax}% &middot; {loan.aprType}
                      </div>
                    </div>
                  </div>

                  {/* ── Stats grid ─────────────────────────────────────── */}
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: 14,
                    padding: "16px 0",
                    borderTop: `1px solid ${T.cardBorder}`,
                    borderBottom: `1px solid ${T.cardBorder}`,
                    marginBottom: 18,
                  }}>
                    {[
                      { label: "Max Amount",  value: fmt(loan.maxAmount)                                             },
                      { label: "Term Range",  value: `${loan.termMin / 12}–${loan.termMax / 12} yr`                 },
                      { label: "Min. Credit", value: `${loan.minCreditScore}+`                                       },
                      { label: "Orig. Fee",   value: loan.originationFee === 0 ? "None ✓" : `${loan.originationFee}%` },
                    ].map(({ label, value }) => (
                      <div key={label}>
                        <div style={{ fontSize: 10, fontWeight: 600, color: T.dim, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 5 }}>
                          {label}
                        </div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: T.text }}>
                          {value}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* ── Perks chips ─────────────────────────────────────── */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
                    {loan.perks.map(p => (
                      <span key={p} style={{
                        fontSize: 11,
                        padding: "4px 11px",
                        borderRadius: 20,
                        background: T.badge,
                        color: T.goldHi,
                        fontWeight: 500,
                      }}>
                        ✓ {p}
                      </span>
                    ))}
                    {loan.requiresCoSigner && (
                      <span style={{
                        fontSize: 11,
                        padding: "4px 11px",
                        borderRadius: 20,
                        background: "rgba(239,68,68,0.10)",
                        color: "#F87171",
                        fontWeight: 500,
                      }}>
                        ⚠ Co-signer may be required
                      </span>
                    )}
                  </div>

                  {/* ── Action row ─────────────────────────────────────── */}
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                    <button
                      onClick={() => toggleCalc(loan.id, loan)}
                      style={{
                        padding: "9px 20px",
                        borderRadius: 11,
                        background: isOpen ? "#1a1a1a" : "#141414",
                        border: `1px solid ${isOpen ? T.gold : T.border}`,
                        color: isOpen ? T.gold : T.text,
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: "pointer",
                        transition: "all 0.15s",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {isOpen ? "▲ Hide Calculator" : "📊 Calculate Payment"}
                    </button>
                    <button style={{
                      padding: "9px 24px",
                      borderRadius: 11,
                      background: `linear-gradient(135deg, ${T.gold} 0%, ${T.goldDim} 100%)`,
                      border: "none",
                      color: "#050505",
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: "pointer",
                      letterSpacing: "-0.01em",
                    }}>
                      Apply Now →
                    </button>
                  </div>

                  {/* ── Inline Payment Calculator ──────────────────────── */}
                  {isOpen && (
                    <div style={{
                      marginTop: 20,
                      padding: 20,
                      borderRadius: 14,
                      background: "#080808",
                      border: `1px solid ${T.border}`,
                    }}>
                      <p style={{ fontSize: 13, fontWeight: 700, color: T.text, margin: "0 0 16px", letterSpacing: "-0.01em" }}>
                        Payment Estimator —{" "}
                        <span style={{ color: T.gold }}>{loan.lender}</span>
                      </p>

                      {/* Amount label + value */}
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                        <span style={{ fontSize: 12, color: T.mid }}>Loan Amount</span>
                        <span style={{ fontSize: 20, fontWeight: 800, color: T.text, letterSpacing: "-0.03em" }}>
                          {fmt(amt)}
                        </span>
                      </div>

                      {/* Slider */}
                      <input
                        type="range"
                        min={loan.minAmount}
                        max={loan.maxAmount}
                        step={500}
                        value={amt}
                        onChange={e =>
                          setCalcAmt(prev => ({ ...prev, [loan.id]: Number(e.target.value) }))
                        }
                        style={{ width: "100%", accentColor: T.gold, cursor: "pointer", marginBottom: 6 }}
                      />
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
                        <span style={{ fontSize: 10, color: T.dim }}>{fmt(loan.minAmount)}</span>
                        <span style={{ fontSize: 10, color: T.dim }}>{fmt(loan.maxAmount)}</span>
                      </div>

                      {/* 3-column payment grid: shortest / mid / longest term */}
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                        {[
                          { term: loan.termMin,  label: `${loan.termMin} mo`  },
                          { term: midTerm,        label: `${midTerm} mo`       },
                          { term: loan.termMax,  label: `${loan.termMax} mo`  },
                        ].map(({ term, label }) => (
                          <div key={label} style={{
                            background: "#141414",
                            borderRadius: 12,
                            padding: "14px 12px",
                            textAlign: "center",
                            border: `1px solid ${T.cardBorder}`,
                          }}>
                            <div style={{ fontSize: 22, fontWeight: 800, color: T.gold, letterSpacing: "-0.03em" }}>
                              ${calcMonthlyPayment(amt, loan.aprMin, term).toFixed(0)}
                            </div>
                            <div style={{ fontSize: 10, color: T.dim, marginTop: 5 }}>
                              /month &middot; {label}
                            </div>
                          </div>
                        ))}
                      </div>

                      <p style={{ fontSize: 10, color: T.dim, margin: "14px 0 0", lineHeight: 1.6 }}>
                        Estimate uses {loan.aprMin}% APR (lowest advertised). Actual rate depends on
                        creditworthiness and lender discretion. This is not financial advice.
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </main>
      </div>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer style={{
        borderTop: `1px solid ${T.border}`,
        padding: "24px 28px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 12,
      }}>
        <span style={{ fontSize: 12, color: T.dim }}>
          © {new Date().getFullYear()} WealthNutz · Rates shown are illustrative and subject to change.
        </span>
        <div style={{ display: "flex", gap: 20 }}>
          <Link href="/privacy" style={{ fontSize: 12, color: T.dim, textDecoration: "none" }}>Privacy</Link>
          <Link href="/terms"   style={{ fontSize: 12, color: T.dim, textDecoration: "none" }}>Terms</Link>
          <Link href="/"        style={{ fontSize: 12, color: T.dim, textDecoration: "none" }}>← Back to App</Link>
        </div>
      </footer>

    </div>
  );
}
