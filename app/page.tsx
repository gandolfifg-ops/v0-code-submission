"use client";

/**
 * WealthNutz — Single File, v0-Ready (build:v137 final-stability-fix)
 * ─────────────────────────────────────────────────────────────────────────────
 * Paste this entire file into app/page.tsx in any Next.js project.
 *
 * Required packages (install once):
 *   npm install framer-motion lucide-react
 *
 * Optional (for AI chat & auth):
 *   npm install @supabase/supabase-js ai @ai-sdk/react
 *   Add to .env.local:
 *     NEXT_PUBLIC_SUPABASE_URL=
 *     NEXT_PUBLIC_SUPABASE_ANON_KEY=
 *     ANTHROPIC_API_KEY=
 *   Create app/api/chat/route.ts (see bottom comment)
 * ─────────────────────────────────────────────────────────────────────────────
 * CLEAN BUILD v49 — v46 revert applied, all stale exports cleared
 * Build Date: 2026-03-26 — next.config.mjs updated to restart dev server
 */

import { useState, useEffect, useRef, useCallback, useMemo, memo as React_memo, type ReactNode, type CSSProperties, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp, Clock, DollarSign, GraduationCap, ShoppingBag,
  Send, Share2, Check, ChevronLeft, ChevronRight, User, Search,
  BarChart2, PiggyBank, BookOpen, ExternalLink, Bookmark, X, LogIn, LogOut,
  Sun, Moon, SlidersHorizontal, ChevronDown, RotateCcw,
} from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import InlineChatComponent from "@/app/inline-chat";

// Performance optimization: memoization function
const React_memo_compat = React_memo;



// ─────────────────────────────────────────────────────────────────────────────
// SECTION 1 — CONFIG (all data, copy, and affiliate links live here)
// ─────────────────────────────────────────────────────────────────────────────

const AFFILIATE_PRODUCTS = [
  // ── Canada ────────────────────────────────────────────────────────────
  { id: "eqbank",      name: "EQ Bank",      tagline: "High-Interest Savings",          logo: "🏦", country: "CA" as const, href: "https://www.eqbank.ca",         highlight: "4%+ HISA · Zero fees · CDIC insured",          badge: "Top Pick", cta: "Open Free Account"   },
  { id: "wealthsimple",name: "Wealthsimple", tagline: "Invest & Save — Commission Free",logo: "📈", country: "CA" as const, href: "https://www.wealthsimple.com",  highlight: "Free trades · TFSA / RRSP / FHSA · Cash 4%+",  badge: "",         cta: "Start Investing Free" },
  { id: "tangerine",   name: "Tangerine",    tagline: "No-Fee Student Banking",         logo: "🍊", country: "CA" as const, href: "https://www.tangerine.ca",      highlight: "No monthly fees · 2.5% savings · e-transfers",  badge: "",         cta: "Get Free Account"    },
  // ── USA ───────────────────────────────────────────────────────────────
  { id: "sofi",        name: "SoFi",         tagline: "Banking for Ambitious People",   logo: "🚀", country: "US" as const, href: "https://www.sofi.com",          highlight: "4.6% APY · Student loan refi · $300 bonus",    badge: "Top Pick", cta: "Claim $300 Bonus"    },
  { id: "betterment",  name: "Betterment",   tagline: "Automated Investing & Roth IRA", logo: "🤖", country: "US" as const, href: "https://www.betterment.com",    highlight: "Auto-rebalancing · Tax-loss harvesting · No min",badge: "",         cta: "Start Investing"     },
  { id: "fidelity",    name: "Fidelity",     tagline: "Free Roth IRA & Index Funds",   logo: "📊", country: "US" as const, href: "https://www.fidelity.com",      highlight: "Zero-fee index funds · Roth IRA · Free cash mgmt",badge: "",        cta: "Open Free IRA"       },
];

// ── LOAN MARKETPLACE — High Conversion Affiliate Offers ─────────────────────
const LOAN_MARKETPLACE = [
  { id: "sofi-refi",   name: "SoFi Student Loan Refinance", rate: "From 4.49% APR", bonus: "$300 Welcome Bonus", badge: "Best Rate", country: "US" as const, loanType: "Student" as const, href: "https://www.sofi.com/refinance-student-loans/", highlight: "No fees · Unemployment protection · Member benefits", cta: "Check My Rate" },
  { id: "earnest",     name: "Earnest Student Loans",       rate: "From 4.25% APR", bonus: "$200 Bonus",         badge: "Flexible",  country: "US" as const, loanType: "Student" as const, href: "https://www.earnest.com/",                     highlight: "Skip a payment option · Precision pricing",          cta: "Check My Rate" },
  { id: "credible",    name: "Credible Marketplace",        rate: "Compare 8+ Lenders", bonus: "Free Comparison",badge: "Compare",   country: "US" as const, loanType: "Student" as const, href: "https://www.credible.com/",                   highlight: "One form · Multiple offers · No impact on credit",   cta: "Compare Rates" },
  { id: "sallie-mae",  name: "Sallie Mae Loans",            rate: "From 5.24% APR", bonus: "Multi-Year Approval", badge: "",         country: "US" as const, loanType: "Student" as const, href: "https://www.salliemae.com/",                  highlight: "Cover up to 100% of school costs",                   cta: "Apply Now"     },
  { id: "lightstream", name: "LightStream Personal Loans",  rate: "From 7.49% APR", bonus: "Rate Beat Program",  badge: "Low APR",   country: "US" as const, loanType: "Personal" as const, href: "https://www.lightstream.com/",               highlight: "No fees · Same-day funding · Flexible terms",        cta: "Check My Rate" },
  { id: "upstart",     name: "Upstart Personal Loans",      rate: "From 6.70% APR", bonus: "AI-Powered Rates",   badge: "Fast",      country: "US" as const, loanType: "Personal" as const, href: "https://www.upstart.com/",                   highlight: "Beyond credit score · Quick approval",               cta: "Check My Rate" },
  { id: "capitalOne",  name: "Capital One Auto Finance",    rate: "From 5.99% APR", bonus: "Pre-Qualify Now",    badge: "Top Pick",  country: "US" as const, loanType: "Auto" as const,     href: "https://www.capitalone.com/cars/",            highlight: "No impact on credit · 30 days to shop",              cta: "Get Pre-Qualified" },
  { id: "carvana",     name: "Carvana Auto Financing",      rate: "From 6.89% APR", bonus: "7-Day Return",       badge: "",          country: "US" as const, loanType: "Auto" as const,     href: "https://www.carvana.com/",                    highlight: "Shop & finance in one · Delivered to you",           cta: "Get Started"   },
  { id: "nslsc",       name: "Federal Student Loans (NSLSC)", rate: "Prime +1%",    bonus: "Grants Available",  badge: "Gov't",     country: "CA" as const, loanType: "Student" as const, href: "https://www.csnpe-nslsc.canada.ca/",          highlight: "Repayment assistance · No credit check",             cta: "Apply Now"     },
  { id: "rbc-student", name: "RBC Student Line of Credit",  rate: "Prime +0%",      bonus: "$0 Annual Fee",     badge: "Low Rate",  country: "CA" as const, loanType: "Student" as const, href: "https://www.rbc.com/student/",                highlight: "Only pay interest while in school",                  cta: "Check My Rate" },
  { id: "td-personal", name: "TD Personal Line of Credit",  rate: "Prime +2%",      bonus: "Flexible Access",   badge: "",          country: "CA" as const, loanType: "Personal" as const, href: "https://www.td.com/ca/en/personal-banking/",  highlight: "Only pay interest on what you use",                  cta: "Apply Now"     },
  { id: "rbc-auto",    name: "RBC Auto Loan",               rate: "From 6.49%",     bonus: "No Dealer Markup",  badge: "Trusted",   country: "CA" as const, loanType: "Auto" as const,     href: "https://www.rbc.com/personal-lending/",       highlight: "Pre-approval in minutes · Shop with confidence",     cta: "Get Pre-Approved" },
];

const TAGLINE = "The all-in-one financial ecosystem for the modern student. Build credit, learn to invest, and grow your wealth.";

const SCHOLARSHIP_MAJORS    = ["Any Major","STEM","Engineering","Business","Finance","Healthcare","Nursing","Computer Science","Data Science","Mathematics","Physics","Chemistry","Biology","Psychology","Education","Arts","Design","Music","Writing","History","Political Science","Environmental Science"] as const;
const SCHOLARSHIP_COUNTRIES = ["Canada","USA"] as const;
const SCHOLARSHIP_LEVELS    = ["Any Level","Undergraduate","Graduate","Masters","PhD"] as const;
const LOAN_TYPES           = ["Student","Personal","Auto"] as const;
type  LoanType             = typeof LOAN_TYPES[number];

// ── FILTER & SORT OPTIONS ───────────────────────────────────────────────────
type SortOption = "best-match" | "highest-award" | "lowest-rate" | "newest" | "deadline-soonest";
const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "best-match", label: "Best Match" },
  { value: "highest-award", label: "Highest Award / Lowest Rate" },
  { value: "newest", label: "Newly Added" },
  { value: "deadline-soonest", label: "Deadline Soonest" },
];

// Scholarship filters
type ScholarshipFilters = {
  awardAmount: "any" | "under-1k" | "1k-5k" | "5k-10k" | "10k-plus";
  educationLevel: "any" | "undergrad" | "graduate" | "any-level";
  noEssay: boolean;
  noGpaReq: boolean;
};

// Loan filters  
type LoanFilters = {
  interestType: "any" | "fixed" | "variable";
  noCoSigner: boolean;
  defermentAvailable: boolean;
};

const DEFAULT_SCHOLARSHIP_FILTERS: ScholarshipFilters = {
  awardAmount: "any",
  educationLevel: "any",
  noEssay: false,
  noGpaReq: false,
};

const DEFAULT_LOAN_FILTERS: LoanFilters = {
  interestType: "any",
  noCoSigner: false,
  defermentAvailable: false,
};

// Mock data — shown instantly while DB / search API is connecting
// Scholarship type for AI-generated results
type Scholarship = {
  id: string;
  type: "scholarship";
  title: string;
  provider: string;
  amount: string;
  deadline: string;
  eligibility: string;
  country: "USA" | "Canada";
  description: string;
  url: string;
};

// Loan type for mock/API results
type Loan = {
  id: string;
  type: "loan";
  title: string;
  provider: string;
  amount: string;
  deadline: string;
  eligibility: string;
  url: string;
};

const MOCK_LOANS: Loan[] = [
  { id:"ml1", type:"loan", title:"Federal Student Loan (Direct)",    provider:"U.S. Dept. of Education / NSLSC",amount:"From 5.50% APR", deadline:"Apply via FAFSA / NSLSC", eligibility:"Enrolled student, US or Canada",           url:"#" },
  { id:"ml2", type:"loan", title:"SoFi Student Loan Refinance",      provider:"SoFi",                          amount:"From 4.49% APR", deadline:"Open — instant pre-qual", eligibility:"Good credit, employed or graduating",       url:"https://www.sofi.com" },
  { id:"ml3", type:"loan", title:"Wealthsimple Personal Loan",       provider:"Wealthsimple",                  amount:"From 9.99% APR", deadline:"Open — apply in minutes", eligibility:"Canadian resident, 18+, income verified",  url:"https://www.wealthsimple.com" },
];

type ScoutResult = (Scholarship | Loan) & {
  // Additional fields for marketplace loan cards
  name?: string;
  rate?: string;
  highlight?: string;
  href?: string;
  cta?: string;
  description?: string;
};

const VIRAL_SHARE   = "Stop guessing with your money. I just found this AI tool called WealthNutz that scours the internet for the best deals, credit offers, and high-yield savings in seconds: https://wealthnutz.com";
const WELCOME_MSG   = "WealthNutz Intelligence Co-Pilot is indexing live financial databases... How can I help you accelerate your wealth today?";
const AFFIL_NOTE    = "WealthNutz may earn a referral commission if you open an account through our links. This never affects our recommendations.";
const FOOTER_TEXT   = "WealthNutz provides general financial education only and is not a licensed financial advisor, broker, or lender. Information is for educational purposes and does not constitute personalized financial, legal, or tax advice. Affiliate links may be present — see our disclosure.";
const SYSTEM_PROMPT = `You are the WealthNutz Intelligence Co-Pilot — a quantitative financial advisor for students in Canada and the USA. You are analytical, concise, and direct.

COMMUNICATION STYLE:
- No markdown formatting (no **, *, bullet points). Use plain text with numbers and line breaks for clarity.
- Open naturally, skip rigid greetings like "Hello! How can I help?"
- Keep responses to 2-3 sentences when possible. Be specific with numbers.
- Examples: "At 3% loan rate vs 5% HISA, you're losing $200/year by paying down debt instead of saving" or "Your TFSA gives you $7K of tax-free growth—prioritize it first."

CORE PHILOSOPHY:
1. Net Worth Optimization > Debt-Free Mentality. If a 3% loan beats 5% HISA returns, explain the math.
2. Arbitrage Thinking: Compare cost of debt vs. return on savings. Always show the calculation.
3. Tax-Advantaged Accounts First: TFSA/RRSP (Canada), Roth IRA/401k (USA).

KNOWLEDGE BASE:
Canada: TFSA ($7K/yr, tax-free priority #1), RRSP (tax-deductible, employer match), FHSA ($8K/yr), HISA (EQ, Wealthsimple 4%+), OSAP, GST/HST credit.
USA: Roth IRA ($7K/yr, priority #1), 529 plans, I-Bonds, FAFSA, federal loans (5-7%), PSLF, AOTC ($2.5K/yr).
Platforms: Wealthsimple, EQ Bank (CA); SoFi, Fidelity (USA); VTI/XEQT for indexing.

ALWAYS: Personalize first with 2-3 targeted questions before advising. Give numbered action plans with specific dollar amounts.`;

const PARTNERS = [
  { name: "University Partners", desc: "Financial aid offices nationwide" },
  { name: "Credit Unions", desc: "Student-focused banking partners" },
  { name: "EdTech Alliance", desc: "Financial literacy integration" },
];

// ─────────────────────────────────────────────────��───���������──��───���─�����─────────────
// SECTION 2 — DESIGN TOKENS (Light/Dark Mode Support)
// ─────────────────────────────────────────────────────────────────────────────

const DARK_THEME = {
  bg:      "#050505",
  glass:   "rgba(255,255,255,0.044)",
  glassHi: "rgba(255,255,255,0.085)",
  border:  "rgba(255,255,255,0.1)",
  gold:    "#C9A84C",
  goldHi:  "#E8C97A",
  goldDim: "#8B6914",
  goldText: "#07090d", // Dark text on gold buttons
  glow:    "rgba(201,168,76,0.22)",
  text:    "#F0EBE3",
  mid:     "#9A9080",
  dim:     "#4A4438",
  dimmer:  "#2A2218",
  green:   "#4ade80",
  blue:    "#93c5fd",
  red:     "#f87171",
  r:       "13px",
  rsm:     "9px",
  rmd:     "13px",
  blur:    "blur(20px)",
  cardBg:  "rgba(255,255,255,0.1)",
  cardBorder: "rgba(255,255,255,0.2)",
  cardShadow: "none",
  badgeBg: "", // Use default in dark mode
  badgeText: "", // Use default in dark mode
};

const LIGHT_THEME = {
  bg:      "#F9FAFB",
  glass:   "rgba(255,255,255,0.9)",
  glassHi: "rgba(255,255,255,1)",
  border:  "rgba(0,0,0,0.08)",
  gold:    "#C9A84C",
  goldHi:  "#E8C97A",
  goldDim: "#8B6914",
  goldText: "#3D2E0A", // Dark brown for text on gold buttons
  glow:    "rgba(201,168,76,0.15)",
  text:    "#0F172A", // slate-900
  mid:     "#475569", // slate-600
  dim:     "#94A3B8", // slate-400
  dimmer:  "#E2E8F0", // slate-200
  green:   "#16a34a",
  blue:    "#2563eb",
  red:     "#dc2626",
  r:       "13px",
  rsm:     "9px",
  rmd:     "13px",
  blur:    "blur(20px)",
  cardBg:  "#FFFFFF",
  cardBorder: "#E2E8F0", // slate-200
  cardShadow: "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)",
  badgeBg: "rgba(201,168,76,0.15)", // Light gold for badges
  badgeText: "#78350F", // amber-900 for badge text
};

// Default to dark theme - will be overridden by state
let T = DARK_THEME;

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 3 — MOTION VARIANTS
// ─────────────────────────────────────────────────────────────────────────������───

const fadeUp  = { hidden:{opacity:0,y:16}, visible:{opacity:1,y:0,transition:{duration:0.36,ease:[0.22,1,0.36,1] as number[]}} };
const stagger = { visible:{transition:{staggerChildren:0.065}} };
const tapAnim = { tap:{scale:0.95} };

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 4 — HOOKS
// ─────────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// CUSTOM HOOK — useMarketplace
// Consolidates the scanning / phase / results / loadMore pattern shared between
// LoanFinder and ScholarshipScout, eliminating duplicated state logic.
// ─────────────────────────────────────────────────────────────────────────────
type MarketplacePhase = "idle" | "scanning" | "results";

function useMarketplace<T>(scanMessages: string[]) {
  const [phase,       setPhase]       = useState<MarketplacePhase>("idle");
  const [results,     setResults]     = useState<T[]>([]);
  const [error,       setError]       = useState<string>("");
  const [scanIdx,     setScanIdx]     = useState(0);
  const [hasMore,     setHasMore]     = useState(false);
  const [totalCount,  setTotalCount]  = useState(0);
  const [nextOffset,  setNextOffset]  = useState<number | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);

  // Cycle scan messages while scanning
  useEffect(() => {
    if (phase !== "scanning") return;
    setScanIdx(0);
    const iv = setInterval(() => setScanIdx(p => Math.min(p + 1, scanMessages.length - 1)), 520);
    return () => clearInterval(iv);
  }, [phase, scanMessages.length]);

  const startSearch = () => {
    setResults([]);
    setPhase("scanning");
    setError("");
    setHasMore(false);
    setNextOffset(null);
    setTotalCount(0);
  };

  const finishSearch = (data: T[], total: number, more: boolean, offset: number | null) => {
    setResults(data);
    setTotalCount(total);
    setHasMore(more);
    setNextOffset(offset);
    setPhase("results");
  };

  const failSearch = (msg: string, fallback: T[] = []) => {
    setError(msg);
    setResults(fallback);
    setPhase("results");
  };

  const appendResults = (data: T[], more: boolean, offset: number | null) => {
    setResults(prev => [...prev, ...data]);
    setHasMore(more);
    setNextOffset(offset);
    setLoadingMore(false);
  };

  const reset = () => { setResults([]); setPhase("idle"); setError(""); };

  return {
    phase, results, error, scanIdx, hasMore, totalCount, nextOffset, loadingMore,
    setLoadingMore,
    currentScanMsg: scanMessages[scanIdx] ?? scanMessages[0],
    startSearch, finishSearch, failSearch, appendResults, reset,
  };
}

function useDebounce<T>(value: T, ms = 900): T {
  const [d, setD] = useState<T>(value);
  useEffect(() => {
    const t = setTimeout(() => setD(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return d;
}

function useTypewriter(text: string, speed = 26) {
  const [out,  setOut]  = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!text) { setOut(""); setDone(true); return; }
    setOut(""); setDone(false);
    let i = 0;
    const tick = () => { i++; setOut(text.slice(0, i)); if (i < text.length) setTimeout(tick, speed); else setDone(true); };
    const h = setTimeout(tick, 800);
    return () => clearTimeout(h);
  }, [text, speed]);
  return { out, done };
}



function readSaved(): ScoutResult[] { try { return JSON.parse(typeof window !== "undefined" ? localStorage.getItem(SAVED_KEY) ?? "[]" : "[]"); } catch { return []; } }
function writeSaved(items: ScoutResult[]) { try { localStorage.setItem(SAVED_KEY, JSON.stringify(items)); } catch {} }
function toggleSaved(item: ScoutResult): ScoutResult[] {
  const current = readSaved();
  const exists = current.some(x => x.id === item.id);
  const updated = exists ? current.filter(x => x.id !== item.id) : [...current, item];
  writeSaved(updated);
  return updated;
}

// Supabase bookmark functions
async function fetchBookmarksFromSupabase(userId: string): Promise<ScoutResult[]> {
  try {
    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();
    const { data, error } = await supabase
      .from("bookmarks")
      .select("loan_id, loan_data")
      .eq("user_id", userId);
    if (error) throw error;
    return (data ?? []).map(row => row.loan_data as ScoutResult);
  } catch { 
    return []; 
  }
}

async function upsertBookmarkToSupabase(userId: string, item: ScoutResult): Promise<void> {
  try {
    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();
    await supabase.from("bookmarks").upsert({
      user_id: userId,
      loan_id: item.id,
      loan_data: item,
    }, { onConflict: "user_id,loan_id" });
  } catch {}
}

async function deleteBookmarkFromSupabase(userId: string, loanId: string): Promise<void> {
  try {
    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();
    await supabase.from("bookmarks").delete().eq("user_id", userId).eq("loan_id", loanId);
  } catch {}
}

// Real-time AI-powered scholarship search — generates fresh results based on user criteria
// Loan search — uses mock data for now
async function fetchLoans(): Promise<ScoutResult[]> {
  return MOCK_LOANS;
}

// ────────────────────────────────────────────────────��───────────────────────��
// SECTION 5 — PRIMITIVE UI COMPONENTS
// ─────────────────────────────────────────────────────────────────────────��───

function Glass({ children, style, glow, onClick }: { children: ReactNode; style?: CSSProperties; glow?: boolean; onClick?: () => void }) {
  const [hov, setHov] = useState(false);
  return (
  <div onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
  style={{
  background: T.cardBg,
  backdropFilter: T.blur,
  WebkitBackdropFilter: T.blur,
  border: `1px solid ${hov && glow ? "rgba(201,168,76,0.38)" : T.cardBorder}`,
  borderRadius: T.r,
  boxShadow: hov && glow ? "0 0 0 1px rgba(201,168,76,0.18),0 8px 36px rgba(0,0,0,0.5)" : "0 4px 28px rgba(0,0,0,0.15)",
  transition: "border-color .22s,box-shadow .22s",
  cursor: onClick ? "pointer" : undefined, ...style,
  }}>
  {children}
  </div>
  );
}

function Skel({ w = "100%", h = 14 }: { w?: string|number; h?: number }) {
  return <div className="wf-skel-bar" style={{ width:w, height:h, borderRadius:7 }} />;
}

// Full card-shaped skeleton loader — mimics the real Scholarship/Loan card layout
function CardSkeletonLoader({ count = 3 }: { count?: number }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{
          padding: 16,
          borderRadius: 13,
          background: T.cardBg,
          border: `1px solid ${T.cardBorder}`,
          display: "flex",
          flexDirection: "column",
          gap: 10,
          opacity: 1 - i * 0.18,
        }}>
          {/* Header row: title + badge */}
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:10 }}>
            <div style={{ flex:1, display:"flex", flexDirection:"column", gap:7 }}>
              <Skel w="65%" h={14} />
              <Skel w="42%" h={10} />
            </div>
            <Skel w={52} h={22} />
          </div>
          {/* Body lines */}
          <Skel w="100%" h={10} />
          <Skel w="88%" h={10} />
          <Skel w="72%" h={10} />
          {/* Footer: deadline + CTA */}
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:4 }}>
            <Skel w={90} h={10} />
            <Skel w={88} h={32} />
          </div>
        </div>
      ))}
    </div>
  );
}

// Smart empty-state component — shown when AI search returns no results
function EmptyState({ query, onRetry }: { query?: string; onRetry?: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ textAlign: "center", padding: "36px 20px" }}
    >
      {/* SVG illustration */}
      <svg width="88" height="88" viewBox="0 0 88 88" fill="none" style={{ marginBottom: 16, opacity: 0.85 }}>
        <circle cx="44" cy="44" r="40" fill={T.glass} stroke={T.border} strokeWidth="1.5" />
        <circle cx="38" cy="38" r="16" stroke={T.gold} strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <line x1="50" y1="50" x2="62" y2="62" stroke={T.gold} strokeWidth="2.5" strokeLinecap="round" />
        <line x1="30" y1="38" x2="46" y2="38" stroke={T.mid} strokeWidth="2" strokeLinecap="round" />
        <line x1="38" y1="30" x2="38" y2="46" stroke={T.mid} strokeWidth="2" strokeLinecap="round" />
      </svg>
      <h3 style={{ fontSize:15, fontWeight:700, color:T.text, margin:"0 0 8px", letterSpacing:"-0.02em" }}>
        No results found
      </h3>
      <p style={{ fontSize:12, color:T.mid, margin:"0 0 20px", maxWidth:280, marginLeft:"auto", marginRight:"auto", lineHeight:1.6 }}>
        {query
          ? `We couldn't find scholarships matching "${query}". Try broadening your search.`
          : "No matches for your current filters. Try adjusting your criteria."}
      </p>
      {/* Refine tips */}
      <div style={{ display:"flex", flexDirection:"column", gap:8, maxWidth:300, margin:"0 auto 20px", textAlign:"left" }}>
        {["Try a broader major (e.g. 'Any Major')", "Remove year-level restrictions", "Check your spelling or use simpler keywords", "Switch country from Canada ↔ USA"].map(tip => (
          <div key={tip} style={{ display:"flex", alignItems:"center", gap:8, fontSize:11, color:T.mid }}>
            <span style={{ width:5, height:5, borderRadius:"50%", background:T.gold, flexShrink:0, display:"inline-block" }} />
            {tip}
          </div>
        ))}
      </div>
      {onRetry && (
        <motion.button whileTap={{ scale: 0.97 }} onClick={onRetry}
          style={{ padding:"10px 24px", borderRadius:T.rsm, border:`1px solid ${T.gold}`, background:"transparent", color:T.gold, fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>
          Refine Search
        </motion.button>
      )}
    </motion.div>
  );
}

function Chip({ label, color }: { label: string; color?: string }) {
  
  const c = color ?? T.dim;
  return <span style={{ fontSize:9, fontWeight:700, letterSpacing:".07em", padding:"2px 7px", borderRadius:20, background:`${c}22`, border:`1px solid ${c}44`, color:c, whiteSpace:"nowrap" }}>{label}</span>;
}

function AffNote() {
  
  return <p style={{ fontSize:9, color:"#c4b594", textAlign:"center", marginTop:10, lineHeight:1.5 }}>{AFFIL_NOTE}</p>;
}

function SyncDot() {
  
  return (
    <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:10, color:T.dim }}>
      <span style={{ width:5, height:5, borderRadius:"50%", background:T.gold, opacity:.7, display:"inline-block", animation:"wf-pulse 2s ease infinite" }} />
      Syncing
    </div>
  );
}

function LogoMark({ size = 32 }: { size?: number }) {
  // Squirrel + acorn brand image, SVG fallback if image missing
  const [imgErr, setImgErr] = React.useState(false);
  if (imgErr) {
    return (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={{ flexShrink: 0 }}>
        <polygon points="16,2 30,9 30,23 16,30 2,23 2,9" stroke="#C9A84C" strokeWidth="1.8" fill="none" />
        <text x="16" y="21" textAnchor="middle" style={{ fontFamily: "inherit", fontWeight: 900, fontSize: 11, fill: "#C9A84C" }}>W</text>
      </svg>
    );
  }
  return (
    <img
      src="/images/wealthnutz-logo.png"
      alt="WealthNutz"
      width={size}
      height={size}
      onError={() => setImgErr(true)}
      style={{ objectFit: "contain", filter: "drop-shadow(0 0 8px rgba(201,168,76,0.3))", flexShrink: 0 }}
    />
  );
}

// Gold CTA button — used for all affiliate links
function GoldCTA({ href, label }: { href: string; label: string }) {
  
  const safe = (href?.trim?.() ?? "").length > 0 ? href : "#";
  return (
  <motion.a href={safe} target="_blank" rel="noopener noreferrer" whileTap={tapAnim.tap}
  style={{ display:"block", textAlign:"center", padding:"10px 0", borderRadius:T.rsm, textDecoration:"none", fontFamily:"inherit", background:`linear-gradient(135deg,${T.gold},${T.goldDim})`, color:T.goldText, fontSize:12, fontWeight:800, letterSpacing:".03em", boxShadow:`0 0 18px ${T.glow}`, transition:"box-shadow .2s" }}
      onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 0 32px rgba(201,168,76,0.5)")}
      onMouseLeave={e => (e.currentTarget.style.boxShadow = `0 0 18px ${T.glow}`)}>
      {label} →
    </motion.a>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 3A — CONSOLIDATED FORMATTING FUNCTIONS (Memoized for performance)
// ────────────────────────────────�����────────────────────────────────────────────

// Memoized currency formatter (supports billions properly)
const formatCurrency = (v: number): string => {
  if (v >= 1_000_000_000) return "$" + (v / 1_000_000_000).toFixed(2) + "B";
  if (v >= 1_000_000) return "$" + (v / 1_000_000).toFixed(2) + "M";
  return "$" + v.toLocaleString(undefined, { maximumFractionDigits: 2 });
};

// Memoized short currency formatter (for mobile space constraints)
const formatShortCurrency = (v: number): string => {
  if (v >= 1_000_000) return "$" + (v / 1_000_000).toFixed(1) + "M";
  if (v >= 100_000) return "$" + Math.round(v / 1000) + "K";
  return "$" + Math.round(v).toLocaleString();
};

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 3B — SLIDER COMPONENT (Memoized)
// ────────────────────────────────────────────────────────────────��────────────

const MAX_CURRENCY = 1_000_000_000;
const MAX_PERCENT = 100;

const SliderComponent = ({ label, value, min, step = 1, onChange, fmt, maxVal }: { label:string; value:number; min:number; step?:number; onChange:(v:number)=>void; fmt:(v:number)=>string; maxVal?:number }) => {
  const [inputVal, setInputVal] = useState(fmt(value));
  const [editing, setEditing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  // Determine if this is a percentage slider (ends with %)
  const isPercent = fmt(1).includes("%");
  const hardMax = maxVal ?? (isPercent ? MAX_PERCENT : MAX_CURRENCY);
  
  // Dynamic visual max for slider bar (but capped)
  const visualMax = Math.min(hardMax, Math.max(value * 2, min * 10, isPercent ? 100 : 10000));
  // Always calculate position relative to the hard max so handle stays proportional to value
  const pct = Math.max(0, Math.min(100, ((value - min) / (hardMax - min)) * 100));
  
  useEffect(() => {
    if (!editing) setInputVal(fmt(value));
  }, [value, fmt, editing]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputVal(e.target.value);
  };
  
  const handleInputBlur = () => {
    setEditing(false);
    const parsed = parseFloat(inputVal.replace(/[^0-9.-]/g, ""));
    if (!isNaN(parsed) && parsed >= min) {
      onChange(Math.min(parsed, hardMax));
    } else {
      setInputVal(fmt(value));
    }
  };
  
  const handleInputFocus = () => {
    setEditing(true);
    setInputVal(value.toString());
  };
  
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = Math.min(Number(e.target.value), hardMax);
    onChange(newVal);
  };
  
  // Clean currency format (handles billions properly)
  const formatCurrency = (v: number) => {
    if (v >= 1_000_000_000) return "$" + (v / 1_000_000_000).toFixed(2) + "B";
    if (v >= 1_000_000) return "$" + (v / 1_000_000).toFixed(2) + "M";
    return "$" + v.toLocaleString(undefined, { maximumFractionDigits: 2 });
  };
  
  const displayVal = isPercent ? inputVal : (editing ? inputVal : formatCurrency(value));
  
  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:7, alignItems:"center" }}>
        <span style={{ fontSize:11, color:T.mid }}>{label}</span>
        <input
          type="text"
          value={displayVal}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onKeyDown={e => e.key === "Enter" && e.currentTarget.blur()}
          style={{ fontSize:12, color:T.gold, fontWeight:600, background:"transparent", border:"none", textAlign:"right", width:110, outline:"none", fontFamily:"inherit" }}
        />
      </div>
      <div style={{ position:"relative", height:8, background:"rgba(255,255,255,0.08)", borderRadius:8, cursor:"pointer" }}>
        {/* Active fill bar */}
        <div style={{ position:"absolute", left:0, top:0, height:"100%", width:`${pct}%`, background:`linear-gradient(90deg,${T.goldDim},${T.gold})`, borderRadius:8, transition: isDragging ? "none" : "width .15s" }} />
        {/* Grip handle */}
        <div style={{
          position:"absolute",
          top:"50%",
          left:`${pct}%`,
          transform:"translate(-50%, -50%)",
          width:18,
          height:18,
          borderRadius:"50%",
          background:"linear-gradient(135deg, #fff 0%, #c4b594 100%)",
          border:"2px solid #c4b594",
          boxShadow:"0 2px 6px rgba(0,0,0,0.35), 0 0 10px rgba(196,181,148,0.3)",
          transition: isDragging ? "none" : "left .15s",
          pointerEvents:"none",
          zIndex:2,
        }} />
        <input
          type="range"
          min={min}
          max={visualMax}
          step={step}
          value={Math.min(value, visualMax)}
          onChange={handleSliderChange}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onTouchStart={() => setIsDragging(true)}
          onTouchEnd={() => setIsDragging(false)}
          style={{ position:"absolute", inset:0, width:"100%", opacity:0, cursor:"pointer", height:"100%", margin:0, zIndex:3 }}
        />
      </div>
    </div>
  );
};

// Memoize Slider to prevent unnecessary re-renders
const Slider = React_memo_compat(SliderComponent);

// Chat message renderer
function MsgText({ text }: { text: string }) {
  
  const safe = text ?? "";
  return (
    <div>
      {safe.split("\n").map((line, i) => {
        const parts = line.split(/(\*\*[^*]+\*\*)/g).map((p, j) =>
          p.startsWith("**") && p.endsWith("**") ? <strong key={j} style={{ color:T.goldHi }}>{p.slice(2,-2)}</strong> : p
        );
        if (/^[-•]\s/.test(line)) return <div key={i} style={{ display:"flex", gap:9, marginBottom:4 }}><span style={{ color:T.gold, flexShrink:0 }}>▸</span><span>{parts.map((p) => typeof p==="string" ? p.replace(/^[-•]\s/,"") : p)}</span></div>;
        if (/^\d+\.\s/.test(line)) return <div key={i} style={{ display:"flex", gap:9, marginBottom:5 }}><span style={{ color:T.gold, flexShrink:0, minWidth:18, fontWeight:700 }}>{(line.match(/^\d+/)?.[0] ?? "")}.</span><span>{parts.map((p) => typeof p==="string" ? p.replace(/^\d+\.\s/,"") : p)}</span></div>;
        return <p key={i} style={{ margin:line===""?"6px 0":"1px 0" }}>{parts}</p>;
      })}
    </div>
  );
}

// Typewriter greeting
function TypewriterGreeting() {
  
  const { out, done } = useTypewriter(WELCOME_MSG, 26);
  return (
    <motion.div variants={fadeUp} initial="hidden" animate="visible" style={{ padding:"26px 4px 14px", maxWidth:640, margin:"0 auto", textAlign:"center" }}>
      <p style={{ fontFamily:"Inter,system-ui,sans-serif", fontSize:"clamp(14px,2vw,19px)", fontWeight:400, lineHeight:1.7, margin:0, background:`linear-gradient(120deg,${T.text} 0%,${T.goldHi} 40%,${T.gold} 65%,${T.mid} 100%)`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", letterSpacing:"-.005em" }}>
        {out}
        {!done && <span style={{ display:"inline-block", width:2, height:"1em", backgroundColor:T.gold, marginLeft:2, verticalAlign:"middle", animation:"wf-cur .65s steps(1) infinite" }} />}
      </p>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 5B — AUTH MODAL
// ─────────────────────────────────────────────────────────────────────────────

function AuthModal({ onClose }: { onClose: () => void }) {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      // Dynamic import to avoid SSR issues
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      
      if (mode === "signin") {
        // Sign In with password
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
      } else {
        // Sign Up
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
          },
        });
        if (signUpError) throw signUpError;
      }
      
      // Success - close modal and redirect
      onClose();
      window.location.href = "/";
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9998,
        background: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={e => e.stopPropagation()}
        style={{
          background: T.bg,
          border: `1px solid ${T.border}`,
          borderRadius: 16,
          padding: 32,
          width: "min(90vw, 400px)",
          position: "relative",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            background: "none",
            border: "none",
            color: T.mid,
            cursor: "pointer",
            padding: 4,
          }}
        >
          <X size={20} />
        </button>
        
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <LogoMark size={48} />
          <h2 style={{ fontSize: 20, fontWeight: 700, color: T.text, margin: "12px 0 4px" }}>
            {mode === "signin" ? "Welcome Back" : "Create Account"}
          </h2>
          <p style={{ fontSize: 13, color: T.mid, margin: 0 }}>
            {mode === "signin" ? "Sign in to access your saved items" : "Join WealthNutz for free"}
          </p>
        </div>
        
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            disabled={isLoading}
            style={{
              padding: "12px 14px",
              background: T.glass,
              border: `1px solid ${T.border}`,
              borderRadius: T.rsm,
              color: T.text,
              fontSize: 14,
              outline: "none",
              fontFamily: "inherit",
              opacity: isLoading ? 0.6 : 1,
            }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            minLength={6}
            disabled={isLoading}
            style={{
              padding: "12px 14px",
              background: T.glass,
              border: `1px solid ${T.border}`,
              borderRadius: T.rsm,
              color: T.text,
              fontSize: 14,
              outline: "none",
              fontFamily: "inherit",
              opacity: isLoading ? 0.6 : 1,
            }}
          />
          
          {/* Error Message */}
          {error && (
            <p style={{ fontSize: 12, color: T.red, margin: 0, padding: "8px 12px", background: "rgba(248,113,113,0.1)", borderRadius: T.rsm }}>
              {error}
            </p>
          )}
          
          <motion.button
            type="submit"
            whileTap={!isLoading ? { scale: 0.98 } : {}}
            disabled={isLoading}
            style={{
              padding: "12px 0",
              background: `linear-gradient(135deg, ${T.gold}, ${T.goldDim})`,
              border: "none",
              borderRadius: T.rsm,
              color: "#07090d",
              fontSize: 14,
              fontWeight: 700,
              cursor: isLoading ? "not-allowed" : "pointer",
              fontFamily: "inherit",
              marginTop: 4,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              opacity: isLoading ? 0.8 : 1,
            }}
          >
            {isLoading ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ animation: "spin 1s linear infinite" }}>
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray="32" strokeDashoffset="12" />
                </svg>
                {mode === "signin" ? "Signing In..." : "Creating Account..."}
              </>
            ) : (
              mode === "signin" ? "Sign In" : "Create Account"
            )}
          </motion.button>
        </form>
        
        <p style={{ fontSize: 12, color: T.mid, textAlign: "center", marginTop: 16 }}>
          {mode === "signin" ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setError(null); }}
            disabled={isLoading}
            style={{ background: "none", border: "none", color: T.gold, cursor: "pointer", fontWeight: 600, fontFamily: "inherit", fontSize: 12 }}
          >
            {mode === "signin" ? "Sign Up" : "Sign In"}
          </button>
        </p>
      </motion.div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 5B — COUNTRY SWITCHER
// ─────────────────────────────────────────────────────────────────────────────

const COUNTRY_CONFIG = {
  Canada: {
    code: "CA",
    flag: "���🇦",
    currency: "CAD",
    symbol: "$",
    tip: "Showing Canadian rates, TFSA/RRSP accounts, and OSAP loan information.",
  },
  USA: {
    code: "US",
    flag: "🇺🇸",
    currency: "USD",
    symbol: "$",
    tip: "Showing US rates, Roth IRA/401k accounts, and federal student loan information.",
  },
} as const;

type CountryKey = keyof typeof COUNTRY_CONFIG;

function CountrySwitcher({
  country,
  onChange,
}: {
  country: string;
  onChange: (c: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const active = (country === "Canada" || country === "USA") ? country as CountryKey : null;

  return (
    <div style={{ position: "relative" }}>
      <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
        {(Object.entries(COUNTRY_CONFIG) as [CountryKey, typeof COUNTRY_CONFIG[CountryKey]][]).map(([key, cfg]) => {
          const isActive = country === key;
          return (
            <motion.button
              key={key}
              whileTap={{ scale: 0.88 }}
              whileHover={{ scale: 1.08 }}
              onClick={() => onChange(country === key ? "" : key)}
              title={`Switch to ${key} · ${cfg.currency}`}
              style={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                border: `2px solid ${isActive ? T.gold : T.border}`,
                background: isActive ? "rgba(201,168,76,0.14)" : T.glass,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
                lineHeight: 1,
                boxShadow: isActive ? `0 0 10px ${T.glow}` : "none",
                transition: "all 0.2s",
                padding: 0,
                position: "relative",
                overflow: "hidden",
              }}
            >
              {cfg.flag}
              {/* Active gold ring pulse */}
              {isActive && (
                <motion.span
                  initial={{ opacity: 0.6, scale: 0.85 }}
                  animate={{ opacity: 0, scale: 1.4 }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                  style={{
                    position: "absolute",
                    inset: -2,
                    borderRadius: "50%",
                    border: `2px solid ${T.gold}`,
                    pointerEvents: "none",
                  }}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Active country label */}
      {active && (
        <motion.p
          key={active}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: "50%",
            transform: "translateX(-50%)",
            whiteSpace: "nowrap",
            fontSize: 9,
            fontWeight: 700,
            color: T.gold,
            letterSpacing: ".06em",
            pointerEvents: "none",
          }}
        >
          {COUNTRY_CONFIG[active].currency} · {active}
        </motion.p>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 5B — EXPANDABLE TEXT COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

function ExpandableText({ text, maxLines = 2 }: { text: string; maxLines?: number }) {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <motion.div layout style={{ position: "relative" }}>
      {/* Text container — line-clamp only when collapsed */}
      <motion.p
        layout
        style={{
          fontSize: 11,
          color: T.mid,
          margin: 0,
          lineHeight: 1.5,
          ...(expanded ? {} : {
            display: "-webkit-box",
            WebkitLineClamp: maxLines,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }),
        }}
      >
        {text}
      </motion.p>
      
      {/* Read more / Show less button — always visible outside the clamped area */}
      <motion.button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setExpanded(!expanded);
        }}
        style={{
          background: "none",
          border: "none",
          color: T.gold,
          fontSize: 10,
          fontWeight: 600,
          cursor: "pointer",
          padding: 0,
          marginTop: 6,
          marginBottom: 10,
          fontFamily: "inherit",
          display: "block",
        }}
      >
        {expanded ? "Show less" : "Read more..."}
      </motion.button>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────��────�������──���────────────�������──────
// SECTION 5C-1 — FILTER SIDEBAR (Desktop) & SORT DROPDOWN
// ─────────────────────────────────────────────────────────────────────────────

function FilterCheckbox({ label, checked, onChange, count }: { label: string; checked: boolean; onChange: (v: boolean) => void; count?: number }) {
  return (
    <motion.label 
      whileTap={{ scale: 0.98 }}
      style={{ 
        display: "flex", 
        alignItems: "center", 
        gap: 10, 
        padding: "8px 0", 
        cursor: "pointer",
        fontSize: 12,
        color: checked ? T.text : "#c0c0c0",
        transition: "color 0.2s",
      }}
    >
      <span style={{
        width: 18,
        height: 18,
        borderRadius: 4,
        border: `2px solid ${checked ? T.gold : T.border}`,
        background: checked ? T.gold : "rgba(0,0,0,0)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.2s",
        flexShrink: 0,
      }}>
        {checked && <Check size={12} color="#07090d" strokeWidth={3} />}
      </span>
      <span style={{ flex: 1 }}>{label}</span>
      {count !== undefined && (
        <span style={{ fontSize: 10, color: T.dim, background: T.glass, padding: "2px 6px", borderRadius: 10 }}>
          {count}
        </span>
      )}
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} style={{ display: "none" }} />
    </motion.label>
  );
}

function FilterRadio({ label, selected, onSelect, count }: { label: string; selected: boolean; onSelect: () => void; count?: number }) {
  return (
    <motion.label 
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      style={{ 
        display: "flex", 
        alignItems: "center", 
        gap: 10, 
        padding: "8px 0", 
        cursor: "pointer",
        fontSize: 12,
        color: selected ? T.text : "#c0c0c0",
        transition: "color 0.2s",
      }}
    >
      <span style={{
        width: 18,
        height: 18,
        borderRadius: "50%",
        border: `2px solid ${selected ? T.gold : T.border}`,
        background: "rgba(0,0,0,0)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.2s",
        flexShrink: 0,
      }}>
        {selected && <span style={{ width: 8, height: 8, borderRadius: "50%", background: T.gold }} />}
      </span>
      <span style={{ flex: 1 }}>{label}</span>
      {count !== undefined && (
        <span style={{ fontSize: 10, color: T.dim, background: T.glass, padding: "2px 6px", borderRadius: 10 }}>
          {count}
        </span>
      )}
    </motion.label>
  );
}

function FilterGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <h4 style={{ fontSize: 11, fontWeight: 700, color: "#d0d0d0", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>
        {title}
      </h4>
      {children}
    </div>
  );
}

function SortDropdown({ value, onChange, resultCount }: { value: SortOption; onChange: (v: SortOption) => void; resultCount: number }) {
  const [open, setOpen] = useState(false);
  const currentLabel = SORT_OPTIONS.find(o => o.value === value)?.label || "Best Match";
  
  return (
    <div style={{ position: "relative" }}>
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={() => setOpen(!open)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "8px 14px",
          borderRadius: T.rsm,
          border: `1px solid ${T.border}`,
          background: T.glass,
          color: T.text,
          fontSize: 12,
          fontWeight: 500,
          cursor: "pointer",
          minWidth: 160,
        }}
      >
        <span style={{ flex: 1, textAlign: "left" }}>{currentLabel}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={14} color={T.mid} />
        </motion.span>
      </motion.button>
      
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              style={{ position: "fixed", inset: 0, zIndex: 99 }}
            />
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              style={{
                position: "absolute",
                top: "calc(100% + 6px)",
                left: 0,
                right: 0,
                background: T.bg,
                border: `1px solid ${T.border}`,
                borderRadius: T.rsm,
                overflow: "hidden",
                zIndex: 1000,
                boxShadow: "0 12px 32px rgba(0,0,0,0.5), 0 4px 12px rgba(0,0,0,0.3)",
              }}
            >
              {SORT_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => { onChange(opt.value); setOpen(false); }}
                  style={{
                    display: "block",
                    width: "100%",
                    padding: "10px 14px",
                    border: "none",
                    background: value === opt.value ? "rgba(245,158,11,0.15)" : T.bg,
                    color: value === opt.value ? T.gold : T.text,
                    fontSize: 12,
                    textAlign: "left",
                    cursor: "pointer",
                    transition: "background .15s",
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(245,158,11,0.1)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = value === opt.value ? "rgba(245,158,11,0.15)" : T.bg; }}
                >
                  {opt.label}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      <span style={{ fontSize: 11, color: T.mid, marginLeft: 12 }}>{resultCount} results</span>
    </div>
  );
}

function LoanFilterSidebar({ 
  filters, 
  onChange, 
  onClear,
  counts 
}: { 
  filters: LoanFilters; 
  onChange: (f: LoanFilters) => void; 
  onClear: () => void;
  counts: { fixed: number; variable: number; noCoSigner: number; deferment: number };
}) {
  const hasActiveFilters = filters.interestType !== "any" || filters.noCoSigner || filters.defermentAvailable;
  
  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <SlidersHorizontal size={16} color={T.gold} />
          <h3 style={{ fontSize: 14, fontWeight: 700, color: T.text, margin: 0 }}>Filters</h3>
        </div>
        {hasActiveFilters && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onClear}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              padding: "4px 10px",
              borderRadius: 6,
              border: "none",
              background: "rgba(248,113,113,0.15)",
              color: "#f87171",
              fontSize: 10,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <RotateCcw size={10} /> Clear All
          </motion.button>
        )}
      </div>
      
      <FilterGroup title="Interest Type">
        <FilterRadio label="Any" selected={filters.interestType === "any"} onSelect={() => onChange({ ...filters, interestType: "any" })} />
        <FilterRadio label="Fixed Rate" selected={filters.interestType === "fixed"} onSelect={() => onChange({ ...filters, interestType: "fixed" })} count={counts.fixed} />
        <FilterRadio label="Variable Rate" selected={filters.interestType === "variable"} onSelect={() => onChange({ ...filters, interestType: "variable" })} count={counts.variable} />
      </FilterGroup>
      
      <FilterGroup title="Requirements">
        <FilterCheckbox label="No Co-Signer Required" checked={filters.noCoSigner} onChange={v => onChange({ ...filters, noCoSigner: v })} count={counts.noCoSigner} />
        <FilterCheckbox label="Deferment Available" checked={filters.defermentAvailable} onChange={v => onChange({ ...filters, defermentAvailable: v })} count={counts.deferment} />
      </FilterGroup>
    </div>
  );
}

function ScholarshipFilterSidebar({ 
  filters, 
  onChange, 
  onClear,
  counts 
}: { 
  filters: ScholarshipFilters; 
  onChange: (f: ScholarshipFilters) => void; 
  onClear: () => void;
  counts: { under1k: number; k1to5: number; k5to10: number; k10plus: number; undergrad: number; graduate: number; noEssay: number; noGpa: number };
}) {
  const hasActiveFilters = filters.awardAmount !== "any" || filters.educationLevel !== "any" || filters.noEssay || filters.noGpaReq;
  
  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <SlidersHorizontal size={16} color={T.gold} />
          <h3 style={{ fontSize: 14, fontWeight: 700, color: T.text, margin: 0 }}>Filters</h3>
        </div>
        {hasActiveFilters && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onClear}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              padding: "4px 10px",
              borderRadius: 6,
              border: "none",
              background: "rgba(248,113,113,0.15)",
              color: "#f87171",
              fontSize: 10,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <RotateCcw size={10} /> Clear All
          </motion.button>
        )}
      </div>
      
      <FilterGroup title="Award Amount">
        <FilterRadio label="Any Amount" selected={filters.awardAmount === "any"} onSelect={() => onChange({ ...filters, awardAmount: "any" })} />
        <FilterRadio label="Under $1,000" selected={filters.awardAmount === "under-1k"} onSelect={() => onChange({ ...filters, awardAmount: "under-1k" })} count={counts.under1k} />
        <FilterRadio label="$1,000 - $5,000" selected={filters.awardAmount === "1k-5k"} onSelect={() => onChange({ ...filters, awardAmount: "1k-5k" })} count={counts.k1to5} />
        <FilterRadio label="$5,000 - $10,000" selected={filters.awardAmount === "5k-10k"} onSelect={() => onChange({ ...filters, awardAmount: "5k-10k" })} count={counts.k5to10} />
        <FilterRadio label="$10,000+" selected={filters.awardAmount === "10k-plus"} onSelect={() => onChange({ ...filters, awardAmount: "10k-plus" })} count={counts.k10plus} />
      </FilterGroup>
      
      <FilterGroup title="Education Level">
        <FilterRadio label="Any Level" selected={filters.educationLevel === "any"} onSelect={() => onChange({ ...filters, educationLevel: "any" })} />
        <FilterRadio label="Undergraduate" selected={filters.educationLevel === "undergrad"} onSelect={() => onChange({ ...filters, educationLevel: "undergrad" })} count={counts.undergrad} />
        <FilterRadio label="Graduate" selected={filters.educationLevel === "graduate"} onSelect={() => onChange({ ...filters, educationLevel: "graduate" })} count={counts.graduate} />
      </FilterGroup>
      
      <FilterGroup title="Easy Apply">
        <FilterCheckbox label="No Essay Required" checked={filters.noEssay} onChange={v => onChange({ ...filters, noEssay: v })} count={counts.noEssay} />
        <FilterCheckbox label="No GPA Requirement" checked={filters.noGpaReq} onChange={v => onChange({ ...filters, noGpaReq: v })} count={counts.noGpa} />
      </FilterGroup>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 5C-2 — FILTER BOTTOM SHEET (Mobile)
// ─────────────────────────────────────────────────────────────��────���─��────────

function FilterBottomSheet({ 
  isOpen, 
  onClose, 
  children,
  title = "Filter & Sort",
  isDarkMode = true
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  children: ReactNode;
  title?: string;
  isDarkMode?: boolean;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.6)",
              zIndex: 200,
            }}
          />
          {/* Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            style={{
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              maxHeight: "80vh",
              background: "#000000",
              borderRadius: "20px 20px 0 0",
              zIndex: 201,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Handle */}
            <div style={{ padding: "12px 0 8px", display: "flex", justifyContent: "center" }}>
              <div style={{ width: 40, height: 4, borderRadius: 2, background: T.dim }} />
            </div>
            
            {/* Header */}
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "space-between", 
              padding: "0 20px 16px",
              borderBottom: `1px solid ${T.border}`,
            }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: T.text, margin: 0 }}>{title}</h3>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  border: "none",
                  background: T.glass,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: T.mid,
                }}
              >
                <X size={18} />
              </motion.button>
            </div>
            
            {/* Content */}
            <div style={{ flex: 1, overflowY: "auto", padding: "8px 4px" }}>
              {children}
            </div>
            
            {/* Apply Button */}
            <div style={{ padding: 16, borderTop: `1px solid ${T.border}` }}>
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                style={{
                  width: "100%",
                  padding: 14,
                  borderRadius: T.rsm,
                  border: "none",
                  background: `linear-gradient(135deg, ${T.gold}, ${T.goldDim})`,
                  color: "#07090d",
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Apply Filters
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function MobileFilterButton({ onClick, hasFilters }: { onClick: () => void; hasFilters: boolean }) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "12px 18px",
        borderRadius: 30,
        border: "none",
        background: `linear-gradient(135deg, ${T.gold}, ${T.goldDim})`,
        color: "#07090d",
        fontSize: 13,
        fontWeight: 700,
        cursor: "pointer",
        boxShadow: "0 4px 20px rgba(201,168,76,0.4)",
        zIndex: 50,
      }}
      className="mobile-filter-btn"
    >
      <SlidersHorizontal size={16} />
      Filter & Sort
      {hasFilters && (
        <span style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: "#f87171",
          position: "absolute",
          top: 8,
          right: 8,
        }} />
      )}
    </motion.button>
  );
}

// ─────────────────────────────────────────────────���─���─────────────�������───────────
// SECTION 5C-3 — LOAN MARKETPLACE HERO (High Conversion)
// ─────────────────────────────────────────────────────────────────────────────

function LoanMarketplaceHero({ 
  country, 
  filterType, 
  onToggleSave, 
  savedIds,
  filters,
  sortBy = "best-match",
  onFiltersChange,
  onSortChange,
}: { 
  country: "Canada" | "USA"; 
  filterType?: LoanType; 
  onToggleSave?: (item: ScoutResult) => void; 
  savedIds?: Set<string>;
  filters?: LoanFilters;
  sortBy?: SortOption;
  onFiltersChange?: (f: LoanFilters) => void;
  onSortChange?: (s: SortOption) => void;
}) {
  const countryCode = country === "Canada" ? "CA" : "US";
  const [currentTime, setCurrentTime] = useState(() => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const activeFilters = filters || DEFAULT_LOAN_FILTERS;
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 60000);
    return () => clearInterval(interval);
  }, []);
  
  // Calculate filter counts for dynamic badges
  const allCountryOffers = LOAN_MARKETPLACE.filter(o => o.country === countryCode && (!filterType || o.loanType === filterType));
  const filterCounts = useMemo(() => ({
    fixed: allCountryOffers.filter(o => o.rate.toLowerCase().includes("fixed") || !o.rate.toLowerCase().includes("variable")).length,
    variable: allCountryOffers.filter(o => o.rate.toLowerCase().includes("variable") || o.rate.toLowerCase().includes("prime")).length,
    noCoSigner: allCountryOffers.filter(o => o.highlight.toLowerCase().includes("no co-signer") || o.highlight.toLowerCase().includes("no cosigner")).length,
    deferment: allCountryOffers.filter(o => o.highlight.toLowerCase().includes("defer") || o.highlight.toLowerCase().includes("skip") || o.highlight.toLowerCase().includes("while in school")).length,
  }), [allCountryOffers]);
  
  // Apply filters
  const filteredOffers = allCountryOffers.filter(o => {
    if (activeFilters.interestType === "fixed" && (o.rate.toLowerCase().includes("variable") || o.rate.toLowerCase().includes("prime"))) return false;
    if (activeFilters.interestType === "variable" && !o.rate.toLowerCase().includes("variable") && !o.rate.toLowerCase().includes("prime")) return false;
    // Additional filter logic would go here based on actual data properties
    return true;
  });
  
  // Apply sorting
  const offers = useMemo(() => {
    const sorted = [...filteredOffers];
    if (sortBy === "lowest-rate" || sortBy === "highest-award") {
      sorted.sort((a, b) => {
        const rateA = parseFloat(a.rate.replace(/[^0-9.]/g, "")) || 99;
        const rateB = parseFloat(b.rate.replace(/[^0-9.]/g, "")) || 99;
        return rateA - rateB;
      });
    }
    return sorted;
  }, [filteredOffers, sortBy]);
  
  const hasActiveFilters = activeFilters.interestType !== "any" || activeFilters.noCoSigner || activeFilters.defermentAvailable;
  
  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" style={{ marginBottom: 24 }}>
      {/* Section Header */}
      <motion.div variants={fadeUp} style={{ marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
          <div style={{
            width: 34,
            height: 34,
            borderRadius: 10,
            background: `linear-gradient(135deg, ${T.gold}, ${T.goldDim})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            boxShadow: `0 0 16px ${T.glow || "rgba(201,168,76,0.3)"}`,
          }}>
            <DollarSign size={20} color="#07090d" strokeWidth={2.5} />
          </div>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 900, color: T.text, margin: 0, letterSpacing: "-0.03em", lineHeight: 1.15, WebkitFontSmoothing: "antialiased" }}>
              {filterType ? `${filterType} Loan Marketplace` : "Loan Marketplace"}
            </h2>
            <p style={{ fontSize: 12, color: T.mid, margin: 0, marginTop: 2 }}>Pre-qualify without affecting your credit score.</p>
          </div>
          <span style={{ fontSize: 9, background: T.gold, color: "#07090d", padding: "3px 8px", borderRadius: 10, fontWeight: 800, letterSpacing: "0.05em", marginLeft: 4, alignSelf: "flex-start", marginTop: 4 }}>LIVE</span>
        </div>
      </motion.div>
      
      {/* Sort & Filter Controls */}
      {onSortChange && (
        <motion.div variants={fadeUp} style={{ marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <SortDropdown value={sortBy} onChange={onSortChange} resultCount={offers.length} />
          {hasActiveFilters && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => onFiltersChange?.(DEFAULT_LOAN_FILTERS)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                padding: "6px 12px",
                borderRadius: 6,
                border: "none",
                background: "rgba(248,113,113,0.15)",
                color: "#f87171",
                fontSize: 11,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <RotateCcw size={12} /> Clear Filters
            </motion.button>
          )}
        </motion.div>
      )}
      
      {/* Main Content with Sidebar */}
      <div style={{ display: "flex", gap: 16 }}>
        {/* Desktop Filter Sidebar */}
        {onFiltersChange && (
          <div className="desktop-filter-sidebar" style={{ width: 220, flexShrink: 0 }}>
            <Glass style={{ position: "sticky", top: 70 }}>
              <LoanFilterSidebar 
                filters={activeFilters}
                onChange={onFiltersChange}
                onClear={() => onFiltersChange(DEFAULT_LOAN_FILTERS)}
                counts={filterCounts}
              />
            </Glass>
          </div>
        )}
        
        {/* Loan Cards Grid */}
        <div style={{ flex: 1, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}>
        {offers.map((offer, i) => (
<motion.a
          key={offer.id}
          href={offer.href}
          target="_blank"
          rel="noopener noreferrer"
          variants={fadeUp}
          layout
  style={{
  display: "block",
  padding: 16,
  borderRadius: T.rmd,
  background: T.cardBg,
  border: `1px solid ${i === 0 ? T.gold : T.cardBorder}`,
  textDecoration: "none",
  transition: "all 0.25s ease",
  position: "relative",
  overflow: "hidden",
  boxShadow: T.cardShadow || "none",
  }}
  whileHover={{ scale: 1.02, borderColor: T.gold }}
  whileTap={{ scale: 0.98 }}
        >
          {/* Badge */}
          {offer.badge && (
          <span style={{
          position: "absolute",
          top: 12,
          right: onToggleSave ? 44 : 12,
          fontSize: 9,
          fontWeight: 800,
          background: i === 0 ? T.gold : (T.badgeBg || T.glassHi),
          color: i === 0 ? T.goldText : (T.badgeText || T.gold),
          padding: "3px 8px",
          borderRadius: 6,
          letterSpacing: "0.04em",
          border: T.badgeBg ? `1px solid ${T.gold}` : "none",
          }}>
          {offer.badge}
          </span>
          )}
            
            {/* Bookmark Button */}
            {onToggleSave && (
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const scoutItem: ScoutResult = {
                    id: offer.id,
                    name: offer.name,
                    rate: offer.rate,
                    highlight: offer.highlight,
                    cta: offer.cta,
                    href: offer.href,
                    type: "loan",
                  };
                  onToggleSave(scoutItem);
                }}
                style={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                  width: 28,
                  height: 28,
                  borderRadius: 6,
                  border: "none",
                  background: savedIds?.has(offer.id) ? "rgba(201,168,76,0.25)" : T.glass,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 2,
                }}
                aria-label={savedIds?.has(offer.id) ? "Remove from saved" : "Save for later"}
              >
                <Bookmark 
                  size={14} 
                  color={T.gold}
                  fill={savedIds?.has(offer.id) ? T.gold : "transparent"}
                />
              </motion.button>
            )}
            
            {/* Content */}
            <h3 style={{ fontSize: 14, fontWeight: 600, color: T.text, margin: "0 0 4px", paddingRight: offer.badge ? 60 : 0, letterSpacing: "-0.02em" }}>{offer.name}</h3>
            <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "0 0 2px" }}>
              <p style={{ fontSize: 20, fontWeight: 800, color: T.gold, margin: 0 }}>{offer.rate}</p>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 9, color: "#22c55e", background: "rgba(34,197,94,0.12)", padding: "3px 7px", borderRadius: 6, fontWeight: 600 }}>
                <Check size={10} /> Verified 2m ago
              </span>
            </div>
            {offer.bonus && <p style={{ fontSize: 11, color: T.green, margin: "0 0 8px", fontWeight: 600 }}>{offer.bonus}</p>}
            <ExpandableText text={offer.highlight} maxLines={2} />
            
            {/* CTA Button */}
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "10px 20px",
              borderRadius: 8,
              background: `linear-gradient(135deg, ${T.gold}, ${T.goldDim})`,
              color: "#07090d",
              fontSize: 12,
              fontWeight: 800,
              boxShadow: `0 4px 20px ${T.glow}`,
            }}>
              {offer.cta} <ExternalLink size={12} />
            </div>
          </motion.a>
        ))}
        </div>
      </div>
      
      {/* Mobile Filter Button & Bottom Sheet */}
      {onFiltersChange && (
        <>
          <MobileFilterButton onClick={() => setMobileFilterOpen(true)} hasFilters={hasActiveFilters} />
          <FilterBottomSheet isOpen={mobileFilterOpen} onClose={() => setMobileFilterOpen(false)} title="Filter Loans">
            <LoanFilterSidebar 
              filters={activeFilters}
              onChange={onFiltersChange}
              onClear={() => onFiltersChange(DEFAULT_LOAN_FILTERS)}
              counts={filterCounts}
            />
          </FilterBottomSheet>
        </>
      )}
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 5E — TOP PICKS FOR YOU
// ─────────────────────────────────────────────────────────────────────────────

function TopPicksSection({ country }: { country: "Canada" | "USA" }) {
  const countryCode = country === "Canada" ? "CA" : "US";
  const picks = AFFILIATE_PRODUCTS.filter(p => p.country === countryCode).slice(0, 3);
  
  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" style={{ marginBottom: 20 }}>
      <motion.div variants={fadeUp} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <TrendingUp size={16} color={T.gold} />
        <h3 style={{ fontSize: 13, fontWeight: 700, color: T.text, margin: 0 }}>Top Picks</h3>
      </motion.div>
      
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {picks.map(p => (
          <motion.a
            key={p.id}
            variants={fadeUp}
            href={p.href}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "10px 12px",
              borderRadius: T.rsm,
              background: T.glass,
              border: `1px solid ${T.border}`,
              textDecoration: "none",
              transition: "all 0.2s",
            }}
            whileHover={{ borderColor: T.gold }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = T.glassHi; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = T.glass; }}
          >
            <span style={{ fontSize: 20 }}>{p.logo}</span>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: T.text, margin: 0 }}>{p.name}</p>
              <p style={{ fontSize: 10, color: T.mid, margin: 0 }}>{p.highlight}</p>
            </div>
            {p.badge && (
              <span style={{ fontSize: 9, background: T.gold, color: "#07090d", padding: "2px 6px", borderRadius: 4, fontWeight: 700 }}>{p.badge}</span>
            )}
          </motion.a>
        ))}
      </div>
    </motion.div>
  );
}

// ����─��──��──���─────���──────���───���───────────────────────────────────────────────────
// SECTION 5E — CREDIT PATH MODAL
// ─────────────────────────────────────────────────────────────────────────────

const CREDIT_PATH_STEPS = {
  Canada: [
    { step: 1, title: "Report Payments", desc: "Report rent & utilities to Equifax Canada", action: "Learn More", link: "https://www.equifax.ca/" },
    { step: 2, title: "Utilization Check", desc: "Keep credit card spend below 30% of limit", action: "View Cards", link: "#" },
    { step: 3, title: "Starter Card", desc: "Secured Canadian credit card ($500 deposit)", action: "Apply Now", link: "https://www.td.com/ca/en/personal-banking/" },
  ],
  USA: [
    { step: 1, title: "Report Payments", desc: "Report rent, utilities, and phone bills", action: "Learn More", link: "https://www.experian.com/" },
    { step: 2, title: "Utilization Check", desc: "Keep credit card spend below 30% of limit", action: "View Cards", link: "#" },
    { step: 3, title: "Starter Card", desc: "Secured US credit card ($200–500 deposit)", action: "Apply Now", link: "https://www.capitalone.com/credit-cards/" },
  ],
};

function CreditPathModal({ onClose, country }: { onClose: () => void; country: string }) {
  const countryKey = (country === "Canada" || country === "USA") ? country : "USA";
  const steps = CREDIT_PATH_STEPS[countryKey as keyof typeof CREDIT_PATH_STEPS];
  const [completed, setCompleted] = useState<Record<number, boolean>>({});

  const toggleStep = (step: number) =>
    setCompleted(prev => ({ ...prev, [step]: !prev[step] }));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9997,
        background: "rgba(0,0,0,0.75)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        onClick={e => e.stopPropagation()}
        style={{
          background: T.bg,
          border: `1px solid ${T.border}`,
          borderRadius: 16,
          padding: 28,
          maxWidth: 500,
          width: "100%",
          position: "relative",
          maxHeight: "85vh",
          overflowY: "auto",
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            background: "none",
            border: "none",
            color: T.mid,
            cursor: "pointer",
            padding: 4,
          }}
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: T.text, margin: "0 0 6px" }}>
            Your WealthNutz Credit Path
          </h2>
          <p style={{ fontSize: 12, color: T.mid, margin: 0, lineHeight: 1.5 }}>
            Follow these 3 steps to build credit from scratch and unlock premium loan rates.
          </p>
        </div>

        {/* Country badge */}
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          padding: "6px 12px",
          borderRadius: 8,
          background: "rgba(201,168,76,0.1)",
          border: `1px solid rgba(201,168,76,0.25)`,
          marginBottom: 16,
        }}>
          <span style={{ fontSize: 16 }}>
            {countryKey === "Canada" ? "🇨🇦" : "🇺🇸"}
          </span>
          <span style={{ fontSize: 11, fontWeight: 700, color: T.gold }}>
            {countryKey === "Canada" ? "Canada" : "USA"} Path
          </span>
        </div>

        {/* Steps */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
          {steps.map((s, i) => {
            const done = !!completed[s.step];
            return (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => toggleStep(s.step)}
                style={{
                  padding: 14,
                  borderRadius: T.rsm,
                  border: `1px solid ${done ? T.gold : T.border}`,
                  background: done ? "rgba(201,168,76,0.08)" : T.glass,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Step number circle */}
                <div style={{
                  position: "absolute",
                  top: 12,
                  right: 12,
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: done ? T.gold : T.glass,
                  border: `2px solid ${done ? T.gold : T.border}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 800,
                  fontSize: 12,
                  color: done ? "#07090d" : T.mid,
                }}>
                  {done ? <Check size={14} /> : s.step}
                </div>

                {/* Step content */}
                <h4 style={{ fontSize: 13, fontWeight: 700, color: T.text, margin: "0 0 4px", paddingRight: 40 }}>
                  {s.title}
                </h4>
                <p style={{ fontSize: 11, color: T.mid, margin: "0 0 10px" }}>
                  {s.desc}
                </p>

                {/* Action button */}
                <a
                  href={s.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    fontSize: 10,
                    fontWeight: 700,
                    color: T.gold,
                    textDecoration: "none",
                    padding: "6px 10px",
                    borderRadius: 6,
                    border: `1px solid rgba(201,168,76,0.3)`,
                    background: "rgba(201,168,76,0.05)",
                    transition: "all 0.2s",
                    cursor: "pointer",
                  }}
                  onMouseEnter={e => {
                    const el = e.target as HTMLElement;
                    el.style.background = "rgba(201,168,76,0.12)";
                    el.style.borderColor = "rgba(201,168,76,0.5)";
                  }}
                  onMouseLeave={e => {
                    const el = e.target as HTMLElement;
                    el.style.background = "rgba(201,168,76,0.05)";
                    el.style.borderColor = "rgba(201,168,76,0.3)";
                  }}
                >
                  {s.action} <ExternalLink size={9} />
                </a>
              </motion.div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 10, fontWeight: 600, color: T.mid }}>Progress</span>
            <span style={{ fontSize: 10, fontWeight: 700, color: T.gold }}>
              {Object.values(completed).filter(Boolean).length} of 3
            </span>
          </div>
          <div style={{
            width: "100%",
            height: 6,
            borderRadius: 3,
            background: T.glass,
            overflow: "hidden",
          }}>
            <motion.div
              animate={{
                width: `${(Object.values(completed).filter(Boolean).length / 3) * 100}%`,
              }}
              transition={{ duration: 0.4 }}
              style={{
                height: "100%",
                background: `linear-gradient(90deg, ${T.gold}, ${T.goldDim})`,
                borderRadius: 3,
              }}
            />
          </div>
        </div>

        {/* CTA button */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={onClose}
          style={{
            width: "100%",
            padding: "12px 0",
            borderRadius: T.rsm,
            background: `linear-gradient(135deg, ${T.gold}, ${T.goldDim})`,
            border: "none",
            color: "#07090d",
            fontSize: 13,
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          Start Building Credit
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 5F — FOOTER
// ─��──────────────────────────────────────���────────────────────────────────────

function Footer() {
  const footerLinks = {
    Company: [
      { label: "About Us", href: "/about" },
      { label: "Our Mission", href: "/about#mission" },
      { label: "Security", href: "/about#security" },
    ],
    Support: [
      { label: "Help Center", href: "/help" },
      { label: "Contact Us", href: "/contact" },
    ],
    Legal: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Cookie Policy", href: "/cookies" },
    ],
  };

  const universities = [
    { name: "University of Toronto", abbr: "UofT" },
    { name: "McGill University", abbr: "McGill" },
    { name: "Western University", abbr: "Western" },
    { name: "New York University", abbr: "NYU" },
    { name: "Harvard University", abbr: "Harvard" },
    { name: "Stanford University", abbr: "Stanford" },
    { name: "Massachusetts Institute of Technology", abbr: "MIT" },
    { name: "Queen's University", abbr: "Queen's" },
    { name: "California Institute of Technology", abbr: "CalTech" },
    { name: "and many more", abbr: "and many more" },
  ];

return (
  <footer style={{
  background: T.bg,
  borderTop: `1px solid ${T.border}`,
  padding: "40px 20px",
  marginTop: 60,
  }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Four column grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 32,
          marginBottom: 40,
        }}>
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h4 style={{
                fontSize: 12,
                fontWeight: 800,
                color: T.text,
                margin: "0 0 12px",
                letterSpacing: ".08em",
                textTransform: "uppercase",
              }}>
                {section}
              </h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {links.map(link => (
                  <li key={link.label} style={{ marginBottom: 8 }}>
                    <a
                      href={link.href}
                      style={{
                        fontSize: 11,
                        color: T.mid,
                        textDecoration: "none",
                        transition: "color 0.2s",
                        cursor: "pointer",
                        display: "inline-block",
                      }}
                      onMouseEnter={e => (e.currentTarget.style.color = T.gold)}
                      onMouseLeave={e => (e.currentTarget.style.color = T.mid)}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Trust bar - Universities */}
          <div>
            <h4 style={{
              fontSize: 12,
              fontWeight: 800,
              color: T.text,
              margin: "0 0 12px",
              letterSpacing: ".08em",
              textTransform: "uppercase",
            }}>
              Used By Students At
            </h4>
            <div style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
            }}>
              {universities.map(uni => (
                <div key={uni.abbr} style={{
                  padding: "5px 10px",
                  borderRadius: 6,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(196,181,148,0.18)",
                  fontSize: 9,
                  fontWeight: 700,
                  color: "#c4b594",
                  letterSpacing: ".04em",
                  whiteSpace: "nowrap",
                }}>
                  {uni.abbr}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: T.border, marginBottom: 20 }} />

        {/* Copyright */}
        <div style={{ textAlign: "center" }}>
          <p style={{
            fontSize: 10,
            color: T.dim,
            margin: 0,
            letterSpacing: ".02em",
          }}>
            © 2026 WealthNutz. Empowering the next generation of global students.
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 6 — FINANCIAL TOOLS
// ──────────────────────────────────────────────────────────────────────────���──

// ── Budget Tool (Memoized) ────────────────────────────────────────────────────
const BudgetToolComponent = () => {
  const [income, setIncome] = useState(2000);
  const [needs,  setNeeds]  = useState(50);
  const [wants,  setWants]  = useState(30);
  
  // Cap needs so needs+wants never exceeds 100
  const handleNeedsChange = (v: number) => setNeeds(Math.min(v, 100 - wants));
  const handleWantsChange = (v: number) => setWants(Math.min(v, 100 - needs));
  
  const savings = Math.max(0, 100 - needs - wants);
  const cats = [
    { label:"Needs",   pct:needs,   color:"#22c55e", amt:income*needs/100 },
    { label:"Wants",   pct:wants,   color:"#f59e0b", amt:income*wants/100 },
    { label:"Savings", pct:savings, color:T.gold,    amt:income*savings/100 },
  ];
  
  // Responsive currency formatter (shorter on mobile)
  const formatAmt = (v: number) => {
    if (v >= 1_000_000) return "$" + (v / 1_000_000).toFixed(1) + "M";
    if (v >= 100_000) return "$" + Math.round(v / 1000) + "K";
    return "$" + Math.round(v).toLocaleString();
  };
  
  return (
    <motion.div variants={fadeUp} initial="hidden" animate="visible" style={{ display:"flex", flexDirection:"column", gap:16 }}>
      {/* Monthly Income — large numeric input, always high-contrast */}
      <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
        <label style={{ fontSize:13, fontWeight:800, color:"#1A1A1A", letterSpacing:".01em" }}>
          Monthly Income
        </label>
        <div style={{
          display: "flex",
          alignItems: "center",
          border: "2.5px solid #000000",
          borderRadius: 10,
          background: "#ffffff",
          overflow: "hidden",
          boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
        }}>
          <span style={{
            padding: "14px 14px 14px 16px",
            fontSize: 20,
            fontWeight: 800,
            color: "#000000",
            background: "#f3f3f3",
            borderRight: "2px solid #000000",
            lineHeight: 1,
            userSelect: "none",
          }}>$</span>
          <input
            type="number"
            min={0}
            step={50}
            value={income === 0 ? "" : income}
            placeholder="e.g. 3000"
            onChange={e => {
              const v = parseFloat(e.target.value);
              setIncome(isNaN(v) || v < 0 ? 0 : v);
            }}
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              padding: "14px 16px",
              fontSize: 20,
              fontWeight: 700,
              color: "#000000",
              background: "#ffffff",
              fontFamily: "inherit",
              width: "100%",
              boxSizing: "border-box",
              appearance: "none",
              MozAppearance: "textfield",
            } as React.CSSProperties}
          />
        </div>
        <p style={{ fontSize:11, color:"#555555", margin:0 }}>Enter your take-home pay per month.</p>
      </div>
      <Slider label="Needs %"        value={needs}  min={0}  step={1}  onChange={handleNeedsChange}  fmt={v=>v+"%"} maxVal={100} />
      <Slider label="Wants %"        value={wants}  min={0}  step={1}  onChange={handleWantsChange}  fmt={v=>v+"%"} maxVal={100} />
      <div style={{ display:"flex", height:10, borderRadius:5, overflow:"hidden", gap:2 }}>
        {cats.map(c => <div key={c.label} style={{ flex:c.pct, background:c.color, transition:"flex .3s", minWidth:c.pct > 0 ? 4 : 0 }} />)}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:6 }}>
        {cats.map(c => (
          <Glass key={c.label} style={{ padding:"10px 5px", textAlign:"center", overflow:"hidden" }}>
            <p style={{ fontSize:8, color:c.color, margin:"0 0 3px", fontWeight:700, letterSpacing:".05em" }}>{c.label.toUpperCase()}</p>
            <p style={{ fontSize:"clamp(12px, 3.5vw, 16px)", fontWeight:700, color:T.text, margin:"0 0 2px", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{formatAmt(c.amt)}</p>
            <p style={{ fontSize:9, color:T.dim, margin:0 }}>{c.pct}%</p>
          </Glass>
        ))}
      </div>
      {savings >= 20 && <div style={{ fontSize:11, color:"#b8952a", background:"rgba(201,168,76,0.08)", border:"1px solid rgba(201,168,76,0.2)", borderRadius:8, padding:"8px 12px" }}>Saving {savings}% — excellent! 20%+ recommended.</div>}
    </motion.div>
  );
};

// Memoize BudgetTool to prevent unnecessary re-renders
const BudgetTool = React_memo_compat(BudgetToolComponent);

// ── Savings Tool (Memoized) ────────────────────────────────────────────────────
const SavingsToolComponent = () => {
  const [goal,    setGoal]    = useState(5000);
  const [saved,   setSaved]   = useState(800);
  const [monthly, setMonthly] = useState(200);
  const [rate,    setRate]    = useState(4);
  
  // Cap saved at goal amount
  const handleSavedChange = (v: number) => setSaved(Math.min(v, goal));
  const handleGoalChange = (v: number) => { setGoal(v); if (saved > v) setSaved(v); };
  
  const remaining = Math.max(0, goal - saved);
  const pct       = goal > 0 ? Math.min(100, (saved / goal) * 100) : 0;
  const r = rate / 100 / 12;
  let months = 0;
  if (remaining > 0 && monthly > 0) {
    if (r > 0 && monthly > remaining * r) months = Math.ceil(Math.log(1 + remaining*r/monthly) / Math.log(1+r));
    else if (r <= 0) months = Math.ceil(remaining / monthly);
    else months = Math.min(999, Math.ceil(remaining / monthly));
  }
  let interest = 0;
  if (r > 0) { let b = remaining; for (let i = 0; i < Math.min(months, 600) && b > 0.01; i++) { interest += b*r; b = Math.max(0, b+b*r-monthly); } }
  const yrs = Math.floor(months/12), mos = months%12;
  const timeStr = months <= 0 ? "Goal reached!" : months >= 999 ? "Increase contribution" : yrs > 0 ? `${yrs}y ${mos}m` : `${mos} months`;
  const C = 2 * Math.PI * 32;
  return (
    <motion.div variants={fadeUp} initial="hidden" animate="visible" style={{ display:"flex", flexDirection:"column", gap:16 }}>
      {/* Goal Amount — typed number input for precision */}
      <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
        <span style={{ fontSize:11, color:T.mid, letterSpacing:".05em", fontWeight:600 }}>GOAL AMOUNT</span>
        <div style={{ display:"flex", alignItems:"center", border:`2px solid rgba(201,168,76,0.50)`, borderRadius:10, background:"rgba(24,24,24,0.9)", overflow:"hidden", boxShadow:"0 2px 10px rgba(0,0,0,0.35)" }}>
          <span style={{ padding:"11px 12px 11px 14px", fontSize:16, fontWeight:800, color:T.gold, background:"rgba(201,168,76,0.08)", borderRight:`1px solid rgba(201,168,76,0.22)`, lineHeight:1, userSelect:"none", flexShrink:0 }}>$</span>
          <input
            type="number" min={100} step={100}
            value={goal === 0 ? "" : goal}
            placeholder="e.g. 10 000"
            onChange={e => { const v = parseFloat(e.target.value); handleGoalChange(isNaN(v) || v < 0 ? 0 : v); }}
            style={{ flex:1, border:"none", outline:"none", padding:"11px 14px", fontSize:16, fontWeight:700, color:"#ffffff", background:"transparent", fontFamily:"inherit", width:"100%", boxSizing:"border-box" } as React.CSSProperties}
          />
        </div>
        <p style={{ fontSize:11, color:T.dim, margin:0 }}>Your target savings amount.</p>
      </div>
      <Slider label="Already Saved"        value={saved}   min={0}    step={25}  onChange={handleSavedChange} fmt={v=>"$"+v.toLocaleString()} maxVal={Math.max(goal, 100)} />
      <Slider label="Monthly Contribution" value={monthly} min={10}   step={25}  onChange={setMonthly}        fmt={v=>"$"+v.toLocaleString()} maxVal={10_000} />
      <Slider label="Interest Rate (APY)"  value={rate}    min={0}    step={0.1} onChange={setRate}           fmt={v=>v+"%"} maxVal={15} />
      <Glass style={{ padding:16, display:"flex", alignItems:"center", gap:16 }}>
        <svg width="80" height="80" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="32" fill="none" stroke={T.border} strokeWidth="7"/>
          <circle cx="40" cy="40" r="32" fill="none" stroke="url(#sg7)" strokeWidth="7" strokeDasharray={C} strokeDashoffset={C*(1-pct/100)} strokeLinecap="round" transform="rotate(-90 40 40)" style={{ transition:"stroke-dashoffset .4s" }}/>
          <defs><linearGradient id="sg7"><stop offset="0%" stopColor={T.goldDim}/><stop offset="100%" stopColor={T.goldHi}/></linearGradient></defs>
          <text x="40" y="45" textAnchor="middle" fill={T.gold} fontSize="14" fontWeight="700">{Math.round(pct)}%</text>
        </svg>
        <div>
          <p style={{ fontSize:10, color:T.dim, letterSpacing:".08em", margin:"0 0 4px" }}>TIME TO GOAL</p>
          <p style={{ fontSize:20, fontWeight:800, color:T.goldHi, margin:0 }}>{timeStr}</p>
          <p style={{ fontSize:11, color:T.dim, margin:"3px 0 0" }}>${saved.toLocaleString()} of ${goal.toLocaleString()}</p>
        </div>
      </Glass>
      {[["Remaining","$"+remaining.toLocaleString()],["Interest earned","$"+Math.round(interest).toLocaleString(),"acc"],["Final amount","$"+goal.toLocaleString()]].map(([l,v,acc]) => (
        <div key={l as string} style={{ display:"flex", justifyContent:"space-between", padding:"6px 0", borderBottom:`1px solid ${T.border}` }}>
          <span style={{ fontSize:12, color:T.mid }}>{l}</span>
          <span style={{ fontSize:13, color:acc?T.gold:T.mid, fontWeight:acc?700:400 }}>{v as string}</span>
        </div>
      ))}
    </motion.div>
  );
};

// Memoize SavingsTool to prevent unnecessary re-renders
const SavingsTool = React_memo_compat(SavingsToolComponent);

// ── Loan Calculator (Memoized) ─────────────────────────────────────────────────
const LoanCalculatorComponent = () => {
  const [principal, setPrincipal] = useState(25000);
  const [rate,  setRate]  = useState(5.5);
  const [years, setYears] = useState(10);
  const [extra, setExtra] = useState(0);
  
  const r = rate/100/12, n = years*12;
  const base = r > 0 ? principal*r*Math.pow(1+r,n)/(Math.pow(1+r,n)-1) : principal/Math.max(n,1);
  const totalBase = base*n, totalInt = Math.max(0, totalBase-principal);
  let bal=principal, mo=0, intEx=0;
  while(bal>0.01 && mo<1200){const i=bal*r;intEx+=i;bal=Math.max(0,bal+i-base-extra);mo++;}
  const savedInt=Math.max(0, totalInt-intEx), savedMo=Math.max(0, n-mo);
  
  // Responsive formatting for large numbers
  const formatLoan = (v: number) => {
    if (v >= 1_000_000) return "$" + (v / 1_000_000).toFixed(2) + "M";
    return "$" + Math.round(v).toLocaleString();
  };
  
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      {/* Loan Amount — large numeric input, always high-contrast */}
      <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
        <label style={{ fontSize:13, fontWeight:800, color:"#1A1A1A", letterSpacing:".01em" }}>Loan Amount</label>
        <div style={{ display:"flex", alignItems:"center", border:"2.5px solid #1A1A1A", borderRadius:10, background:"#ffffff", overflow:"hidden", boxShadow:"0 2px 8px rgba(0,0,0,0.10)" }}>
          <span style={{ padding:"14px 14px 14px 16px", fontSize:20, fontWeight:800, color:"#1A1A1A", background:"#f3f3f3", borderRight:"2px solid #1A1A1A", lineHeight:1, userSelect:"none" }}>$</span>
          <input
            type="text"
            inputMode="numeric"
            value={principal === 0 ? "" : principal.toLocaleString()}
            placeholder="e.g. 25,000"
            onChange={e => {
              const raw = e.target.value.replace(/,/g, "");
              const v = parseFloat(raw);
              setPrincipal(isNaN(v) || v < 0 ? 0 : v);
            }}
            style={{ flex:1, border:"none", outline:"none", padding:"14px 16px", fontSize:20, fontWeight:700, color:"#1A1A1A", background:"#ffffff", fontFamily:"inherit", width:"100%", boxSizing:"border-box" } as React.CSSProperties}
          />
        </div>
      </div>
      <Slider label="Interest Rate" value={rate}      min={0.5}   step={0.25} onChange={setRate}      fmt={v=>v+"%"} maxVal={50} />
      <Slider label="Term (Years)"  value={years}     min={1}     step={1}    onChange={setYears}     fmt={v=>v+" yrs"} maxVal={50} />
      <Slider label="Extra Monthly" value={extra}     min={0}     step={10}   onChange={setExtra}     fmt={v=>"$"+v} maxVal={Math.round(base * 10)} />
      <Glass style={{ padding:16 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:10, gap:8, flexWrap:"wrap" }}>
          <span style={{ fontSize:10, color:T.dim, letterSpacing:".07em" }}>MONTHLY PAYMENT</span>
          <span style={{ fontSize:"clamp(18px, 5vw, 26px)", fontWeight:800, color:T.goldHi }}>{formatLoan(Math.round(base))}</span>
        </div>
        {[["Total paid", formatLoan(Math.round(totalBase))],["Total interest", formatLoan(Math.round(totalInt))]].map(([l,v]) => (
          <div key={l} style={{ display:"flex", justifyContent:"space-between", padding:"5px 0", borderTop:`1px solid ${T.border}` }}>
            <span style={{ fontSize:12, color:T.mid }}>{l}</span>
            <span style={{ fontSize:13, color:T.mid }}>{v}</span>
          </div>
        ))}
      </Glass>
      {extra > 0 && (
        <Glass style={{ padding:14, border:"1px solid rgba(74,222,128,0.2)" }}>
          <p style={{ fontSize:10, color:T.green, margin:"0 0 8px", letterSpacing:".07em" }}>WITH EXTRA ${extra}/MO</p>
          {[["Interest saved","$"+Math.round(savedInt).toLocaleString(),true],["Months sooner",savedMo>0?savedMo+" months":"���"],["New payoff",`${Math.floor(mo/12)}y ${mo%12}m`]].map(([l,v,acc]) => (
            <div key={l as string} style={{ display:"flex", justifyContent:"space-between", padding:"5px 0", borderTop:"1px solid rgba(74,222,128,0.1)" }}>
              <span style={{ fontSize:12, color:T.mid }}>{l}</span>
              <span style={{ fontSize:13, color:acc?T.green:T.mid, fontWeight:acc?700:400 }}>{v as string}</span>
            </div>
          ))}
        </Glass>
      )}
    </div>
  );
};

// Memoize LoanCalculator to prevent unnecessary re-renders
const LoanCalculator = React_memo_compat(LoanCalculatorComponent);

// ── Loan Finder ────��───────────�����──────���───���──────────�������───────────────────────
type Phase = "idle"|"scanning"|"results";
const SCAN_MSGS = ["Connecting to loan databases...","Scanning live lender rates...","Cross-referencing eligibility...","Compiling best rates for you..."];

function LoanFinder({ onToggleSave, savedIds, userCountry, isDarkMode }: { onToggleSave: (item: ScoutResult) => void; savedIds: Set<string>; userCountry: string; isDarkMode: boolean }) {

  const [loanType, setLoanType] = useState<LoanType>("Student");
  const [amountRaw, setAmountRaw] = useState(""); // raw numeric string e.g. "50000"
  const [phase,    setPhase]    = useState<Phase>("idle");
  const [results,  setResults]  = useState<ScoutResult[]>([]);
  const [scanIdx,  setScanIdx]  = useState(0);
  const [loanFilters, setLoanFilters] = useState<LoanFilters>(DEFAULT_LOAN_FILTERS);
  const [loanSort, setLoanSort] = useState<SortOption>("best-match");

  // Real-time currency formatter — shows $50,000 as user types
  const formatAmountDisplay = (raw: string) => {
    const digits = raw.replace(/[^0-9]/g, "");
    if (!digits) return "";
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(Number(digits));
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/[^0-9]/g, "");
    setAmountRaw(digits);
  };

  useEffect(() => {
    if (phase !== "scanning") return;
    setScanIdx(0);
    const iv = setInterval(() => setScanIdx(p => Math.min(p+1, SCAN_MSGS.length-1)), 520);
    return () => clearInterval(iv);
  }, [phase]);
  const handleSearch = async () => {
    // Always reset results first so every click triggers a visible fresh search
    setResults([]);
    setPhase("scanning");
    try {
      const data = await fetchResults("loan", { loanType, amount: amountRaw?.trim() ?? "" });
      const final = (data?.length ?? 0) > 0 ? data : MOCK_LOANS;
      setResults(final);
    } catch { setResults(MOCK_LOANS); }
    setPhase("results");
  };
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
      <p style={{ fontSize:10, color:T.mid, margin:0, letterSpacing:".08em" }}>AI LOAN MATCHER</p>
      <div style={{ display:"flex", gap:7 }}>
        {LOAN_TYPES.map(t => (
          <motion.button key={t} whileTap={tapAnim.tap} onClick={() => setLoanType(t)}
            style={{ flex:1, padding:"8px 4px", borderRadius:T.rsm, cursor:"pointer", fontFamily:"inherit", fontSize:12, fontWeight:600, border:`1px solid ${loanType===t?T.gold:T.border}`, background:loanType===t?"rgba(201,168,76,0.16)":T.glass, color:loanType===t?T.gold:T.mid }}>
            {t}
          </motion.button>
        ))}
      </div>
      <input
        value={formatAmountDisplay(amountRaw)}
        onChange={handleAmountChange}
        onKeyDown={e => e.key==="Enter" && handleSearch()}
        placeholder="Amount needed (e.g. $20,000)"
        inputMode="numeric"
        style={{ padding:"10px 13px", background:T.glassHi, border:`1px solid ${T.border}`, borderRadius:T.rsm, color:T.text, fontSize:13, outline:"none", fontFamily:"inherit" }}
      />
      <motion.button whileTap={tapAnim.tap} onClick={handleSearch} disabled={phase==="scanning"}
        style={{ padding:"11px 0", borderRadius:T.rsm, border:"none", cursor:"pointer", background:`linear-gradient(135deg,${T.gold},${T.goldDim})`, color:"#07090d", fontSize:13, fontWeight:800, fontFamily:"inherit", opacity:phase==="scanning"?.65:1, boxShadow:`0 0 18px ${T.glow}` }}>
        {phase==="scanning" ? "Scanning lenders..." : "Find Best Rates"}
      </motion.button>
      <AnimatePresence>
        {phase==="scanning" && (
          <motion.div key="ls" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
            <div style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 4px 8px" }}>
              <span style={{ width:7, height:7, borderRadius:"50%", background:T.gold, display:"inline-block", animation:"wf-pulse 1s infinite", flexShrink:0 }} />
              <span style={{ fontSize:12, color:T.gold }}>{SCAN_MSGS[scanIdx] ?? SCAN_MSGS[0]}</span>
            </div>
            <CardSkeletonLoader count={3} />
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {phase==="results" && results.length>0 && (
          <motion.div key="lr" variants={stagger} initial="hidden" animate="visible" style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {(results ?? []).map(r => (
              <motion.div key={r.id} variants={fadeUp}
                whileHover={{ scale: 1.015, transition: { duration: 0.18, ease: [0.22, 1, 0.36, 1] } }}
                style={{ transformOrigin: "center" }}>
                <Glass glow style={{ padding:14, transition:"border-color 0.2s, box-shadow 0.2s" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:7, gap:10 }}>
                    <div><p style={{ fontSize:13, fontWeight:600, color:T.text, margin:"0 0 2px", letterSpacing:"-0.02em" }}>{r.title}</p><p style={{ fontSize:11, color:T.mid, margin:0 }}>{r.provider}</p></div>
                    <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                      <Chip label={r.amount} color={T.green} />
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onToggleSave(r)}
                        style={{ background:"none", border:"none", cursor:"pointer", padding:2, color:savedIds.has(r.id) ? "#f59e0b" : T.mid }}
                      >
                        <Bookmark size={16} fill={savedIds.has(r.id) ? "#f59e0b" : "none"} />
                      </motion.button>
                    </div>
                  </div>
                  <p style={{ fontSize:11, color:T.mid, margin:"0 0 10px", lineHeight:1.4 }}>{r.eligibility}</p>
                  <GoldCTA href={r.url} label="Check My Rate" />
                </Glass>
              </motion.div>
            ))}
            <AffNote />
          </motion.div>
        )}
      </AnimatePresence>
      {/* Live Scour Marketplace — filtered by selected loan type and user country */}
      <div style={{ marginTop: 20 }}>
<LoanMarketplaceHero
  country={userCountry === "Canada" ? "Canada" : "USA"}
  filterType={loanType}
  onToggleSave={onToggleSave}
  savedIds={savedIds}
  filters={loanFilters}
  sortBy={loanSort}
  onFiltersChange={setLoanFilters}
  onSortChange={setLoanSort}
/>
      </div>
    </div>
  );
}

// ── Loan Tool (tabs) ────────────────���─────────────────────────────────────────
function LoanTool({ onToggleSave, savedIds, userCountry, isDarkMode }: { onToggleSave: (item: ScoutResult) => void; savedIds: Set<string>; userCountry: string; isDarkMode: boolean }) {
  
  const [tab, setTab] = useState<"calc"|"finder">("finder");
  return (
    <motion.div variants={fadeUp} initial="hidden" animate="visible" style={{ display:"flex", flexDirection:"column", gap:0 }}>
      <div style={{ display:"flex", gap:4, background:T.glass, borderRadius:T.rsm, padding:3, marginBottom:16 }}>
        {([["finder","Loan Finder"],["calc","Calculator"]] as const).map(([id,lbl]) => (
          <motion.button key={id} whileTap={tapAnim.tap} onClick={() => setTab(id)}
            style={{ flex:1, padding:"8px 0", borderRadius:7, border:"none", cursor:"pointer", fontFamily:"inherit", fontSize:12, fontWeight:600, background:tab===id?"rgba(201,168,76,0.18)":"rgba(0,0,0,0)", color:tab===id?T.gold:T.mid }}>
            {lbl}
          </motion.button>
        ))}
      </div>
      {tab==="finder" ? <LoanFinder onToggleSave={onToggleSave} savedIds={savedIds} userCountry={userCountry} isDarkMode={isDarkMode} /> : <LoanCalculator />}
    </motion.div>
  );
}

// ── Scholarship Scout ─────────────────────������������─����──────────────────�����──────────��─
const SCH_SCAN_MSGS = ["Connecting to scholarship databases...","Scanning national award portals...","Cross-referencing eligibility...","Aggregating live results for you..."];

// Custom themed dropdown — replaces native <select> so colors work in both themes
function ScholarshipSelect({ value, options, onChange, isDarkMode = false }: { value: string; options: readonly string[]; onChange: (v: string) => void; isDarkMode?: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={ref} style={{ position: "relative", minWidth: 0, width: "100%" }}>
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        style={{
          width: "100%",
          padding: "9px 30px 9px 10px",
          background: T.glass,
          border: `1px solid ${open ? T.gold : T.border}`,
          borderRadius: T.rsm,
          color: T.text,
          fontSize: 12,
          fontFamily: "inherit",
          outline: "none",
          cursor: "pointer",
          textAlign: "left",
          boxSizing: "border-box",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          transition: "border-color .15s",
          position: "relative",
        }}
      >
        {value}
        {/* Chevron */}
        <span style={{
          position: "absolute",
          right: 8,
          top: "50%",
          transform: `translateY(-50%) rotate(${open ? 180 : 0}deg)`,
          transition: "transform .2s",
          pointerEvents: "none",
          color: T.mid,
          display: "flex",
          alignItems: "center",
        }}>
          <ChevronDown size={12} />
        </span>
      </button>

      {/* Dropdown panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scaleY: 0.92 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -6, scaleY: 0.92 }}
            transition={{ duration: 0.15 }}
            style={{
              position: "absolute",
              top: "calc(100% + 4px)",
              left: 0,
              minWidth: "100%",
              maxHeight: 220,
              overflowY: "auto",
              background: isDarkMode ? "#000000" : "#FFFFFF",
              border: `1px solid ${T.border}`,
              borderRadius: T.rsm,
              boxShadow: "0 12px 32px rgba(0,0,0,0.5)",
              zIndex: 1000,
              transformOrigin: "top",
            }}
          >
            {options.map(opt => (
              <button
                key={opt}
                type="button"
                onClick={() => { onChange(opt); setOpen(false); }}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "9px 12px",
                  border: "none",
                  background: opt === value ? (T.gold + "22") : "rgba(0,0,0,0)",
                  color: opt === value ? T.gold : T.text,
                  fontSize: 12,
                  fontFamily: "inherit",
                  textAlign: "left",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "background .1s",
                }}
                onMouseEnter={e => { if (opt !== value) (e.currentTarget as HTMLElement).style.background = T.glassHi; }}
                onMouseLeave={e => { if (opt !== value) (e.currentTarget as HTMLElement).style.background = "rgba(0,0,0,0)"; }}
              >
                {opt}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Returns true when the deadline string looks like a real, confirmed date
function hasConfirmedDeadline(deadline: string): boolean {
  if (!deadline || deadline.toLowerCase().includes("check") || deadline.toLowerCase().includes("open") || deadline.toLowerCase().includes("rolling")) return false;
  return /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|\d{4})/i.test(deadline);
}

// Pulled out of ScholarshipScout's IIFE to avoid Turbopack regex parse errors
function parseScholarshipAmount(amt: string): number {
  const m = amt.match(/[\d,]+/);
  return m ? parseInt(m[0].replace(/,/g, ""), 10) : 0;
}

// Extract negative/exclusion terms from user query for client-side double-check filtering
function extractExcludeTerms(query: string): string[] {
  if (!query) return [];
  const queryLower = query.toLowerCase();
  const excludeTerms: string[] = [];
  
  // Patterns to detect negation
  const patterns = [
    /\b(?:i am |i'm |i )not\s+(?:a |an )?(\w+)/gi,
    /\bnot\s+(?:a |an )?(\w+)/gi,
    /\bnon[- ]?(\w+)/gi,
    /\bwithout\s+(?:being |having )?(?:a |an )?(\w+)/gi,
    /\bexclude\s+(\w+)/gi,
    /\bexcluding\s+(\w+)/gi,
  ];
  
  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(queryLower)) !== null) {
      const term = match[1]?.trim().toLowerCase();
      if (term && term.length > 2) {
        excludeTerms.push(term);
      }
    }
  }
  return excludeTerms;
}

// Check if a scholarship should be excluded based on negative keywords
function shouldExcludeScholarship(scholarship: ScoutResult, excludeTerms: string[]): boolean {
  if (excludeTerms.length === 0) return false;
  
  const searchableText = (
    scholarship.title + " " +
    ((scholarship as { description?: string }).description || "") + " " +
    (scholarship.eligibility || "")
  ).toLowerCase();
  
  const demographicTerms = [
    "indigenous", "aboriginal", "native", "first nations", "metis", "inuit",
    "international", "foreign", "immigrant", "refugee",
    "female", "women", "woman", "male", "men",
    "black", "african", "hispanic", "latino", "latina", "asian", "minority",
    "lgbtq", "lgbt", "veteran", "military", "disabled", "disability",
    "citizen", "resident"
  ];
  
  for (const term of excludeTerms) {
    const isDemographic = demographicTerms.some(d => term.includes(d) || d.includes(term));
    if (isDemographic && searchableText.includes(term)) {
      return true; // Exclude
    }
    if (scholarship.eligibility?.toLowerCase().includes(term) ||
        scholarship.title.toLowerCase().includes(term)) {
      return true; // Exclude
    }
  }
  return false;
}

type ScholarshipResultsProps = {
  phase: Phase;
  results: ScoutResult[];
  country: string;
  userQuery: string;
  schSort: SortOption;
  setSchSort: (v: SortOption) => void;
  schFilters: ScholarshipFilters;
  setSchFilters: (f: ScholarshipFilters) => void;
  hasMore: boolean;
  loadingMore: boolean;
  totalCount: number;
  handleLoadMore: () => void;
  onToggleSave: (item: ScoutResult) => void;
  savedIds: Set<string>;
  mobileFilterOpen: boolean;
  setMobileFilterOpen: (v: boolean) => void;
};

function ScholarshipResults({ phase, results, country, userQuery, schSort, setSchSort, schFilters, setSchFilters, hasMore, loadingMore, totalCount, handleLoadMore, onToggleSave, savedIds, mobileFilterOpen, setMobileFilterOpen }: ScholarshipResultsProps) {
  // Extract exclusion terms from user query for client-side double-check
  const excludeTerms = extractExcludeTerms(userQuery);
  
  // Apply exclusion filter first — this is the double-check before display
  const excludeFiltered = results.filter(r => !shouldExcludeScholarship(r, excludeTerms));
  
  const filterCounts = {
    under1k:  excludeFiltered.filter(r => parseScholarshipAmount(r.amount ?? "0") < 1000).length,
    k1to5:    excludeFiltered.filter(r => { const a = parseScholarshipAmount(r.amount ?? "0"); return a >= 1000 && a <= 5000; }).length,
    k5to10:   excludeFiltered.filter(r => { const a = parseScholarshipAmount(r.amount ?? "0"); return a > 5000 && a <= 10000; }).length,
    k10plus:  excludeFiltered.filter(r => parseScholarshipAmount(r.amount ?? "0") > 10000).length,
    undergrad: excludeFiltered.filter(r => (r.eligibility ?? "").toLowerCase().includes("undergrad") || !(r.eligibility ?? "").toLowerCase().includes("graduate")).length,
    graduate:  excludeFiltered.filter(r => (r.eligibility ?? "").toLowerCase().includes("graduate")).length,
    noEssay:   excludeFiltered.filter(r => (r.eligibility ?? "").toLowerCase().includes("no essay")).length,
    noGpa:     excludeFiltered.filter(r => !(r.eligibility ?? "").toLowerCase().includes("gpa")).length,
  };

  const filteredResults = excludeFiltered.filter(r => {
    const itemCountry = (r as { country?: string }).country;
    if (country !== "Any" && itemCountry) {
      if (country === "Canada" && itemCountry !== "Canada") return false;
      if (country === "USA" && itemCountry !== "USA") return false;
    }
    const amt = parseScholarshipAmount(r.amount ?? "0");
    if (schFilters.awardAmount === "under-1k" && amt >= 1000) return false;
    if (schFilters.awardAmount === "1k-5k" && (amt < 1000 || amt > 5000)) return false;
    if (schFilters.awardAmount === "5k-10k" && (amt <= 5000 || amt > 10000)) return false;
    if (schFilters.awardAmount === "10k-plus" && amt <= 10000) return false;
    if (schFilters.noEssay && !(r.eligibility ?? "").toLowerCase().includes("no essay")) return false;
    if (schFilters.noGpaReq && (r.eligibility ?? "").toLowerCase().includes("gpa")) return false;
    return true;
  });

  const sortedResults = [...filteredResults].sort((a, b) => {
    if (schSort === "highest-award") return parseScholarshipAmount(b.amount ?? "0") - parseScholarshipAmount(a.amount ?? "0");
    if (schSort === "deadline-soonest") return (a.deadline ?? "").localeCompare(b.deadline ?? "");
    return 0;
  });

  const hasActiveFilters = schFilters.awardAmount !== "any" || schFilters.educationLevel !== "any" || schFilters.noEssay || schFilters.noGpaReq;

  if (phase !== "results") return null;

  // Graceful empty state when AI returns no results
  if (results.length === 0 || sortedResults.length === 0) {
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: 16 }}>
        <Glass style={{ padding: 8 }}>
          <EmptyState query={userQuery || undefined} />
        </Glass>
      </motion.div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div key="sch-results" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: 24 }}>
        {/* Sort & Filter Controls */}
        <motion.div variants={fadeUp} style={{ marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <SortDropdown value={schSort} onChange={setSchSort} resultCount={sortedResults.length} />
          {hasActiveFilters && (
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => setSchFilters(DEFAULT_SCHOLARSHIP_FILTERS)}
              style={{ display:"flex", alignItems:"center", gap:4, padding:"6px 12px", borderRadius:6, border:"none", background:"rgba(248,113,113,0.15)", color:"#f87171", fontSize:11, fontWeight:600, cursor:"pointer" }}>
              <RotateCcw size={12} /> Clear Filters
            </motion.button>
          )}
        </motion.div>

        {/* Main Content with Sidebar */}
        <div style={{ display:"flex", gap:16 }}>
          {/* Desktop Filter Sidebar */}
          <div className="desktop-filter-sidebar" style={{ width:220, flexShrink:0 }}>
            <Glass style={{ position:"sticky", top:70 }}>
              <ScholarshipFilterSidebar filters={schFilters} onChange={setSchFilters} onClear={() => setSchFilters(DEFAULT_SCHOLARSHIP_FILTERS)} counts={filterCounts} />
            </Glass>
          </div>

          {/* Results */}
          <motion.div key="sr" variants={stagger} initial="hidden" animate="visible" style={{ flex:1, display:"flex", flexDirection:"column", gap:10 }}>
            {(sortedResults ?? []).map(r => (
              <motion.div key={r.id} variants={fadeUp}
                whileHover={{ scale: 1.015, transition: { duration: 0.18, ease: [0.22, 1, 0.36, 1] } }}
                style={{ transformOrigin: "center" }}>
                <Glass glow style={{ padding:14, transition:"border-color 0.2s, box-shadow 0.2s" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:7, gap:10 }}>
                    <div style={{ flex:1 }}>
                      <p style={{ fontSize:13, fontWeight:600, color:T.text, margin:"0 0 2px", letterSpacing:"-0.02em" }}>{r.title}</p>
                      <p style={{ fontSize:11, color:T.mid, margin:0 }}>{r.provider}</p>
                    </div>
                    <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:5, flexShrink:0 }}>
                      <Chip label={r.amount} color={T.gold} />
                      {hasConfirmedDeadline(r.deadline ?? "") && (
                        <span style={{
                          display:"inline-flex", alignItems:"center", gap:3,
                          fontSize:9, fontWeight:700, letterSpacing:".05em",
                          color:"#22c55e",
                          background:"rgba(34,197,94,0.10)",
                          border:"1px solid rgba(34,197,94,0.28)",
                          padding:"2px 7px", borderRadius:20,
                          whiteSpace:"nowrap",
                        }}>
                          <Check size={9} strokeWidth={3} /> Verified
                        </span>
                      )}
                      <motion.button whileTap={{ scale:0.9 }} onClick={() => onToggleSave(r)}
                        style={{ background:"none", border:"none", cursor:"pointer", padding:2, color:savedIds.has(r.id) ? "#f59e0b" : T.mid }}>
                        <Bookmark size={16} fill={savedIds.has(r.id) ? "#f59e0b" : "none"} />
                      </motion.button>
                    </div>
                  </div>
                  <ExpandableText text={(r as { description?: string }).description || r.eligibility} maxLines={3} />
                  <p style={{ fontSize:10, color:T.dim, margin:"8px 0 10px" }}>Deadline: {r.deadline}</p>
                  <GoldCTA href={r.url} label="Apply Now" />
                </Glass>
              </motion.div>
            ))}

            {/* Show More Button */}
            {hasMore && (
              <motion.div variants={fadeUp} style={{ marginTop:8 }}>
                <motion.button whileTap={{ scale:0.98 }} onClick={handleLoadMore} disabled={loadingMore}
                  style={{ width:"100%", padding:"16px 0", borderRadius:T.rmd, border:`2px solid ${T.gold}`, background:"transparent", color:T.gold, fontSize:14, fontWeight:700, fontFamily:"inherit", cursor:loadingMore ? "wait" : "pointer", opacity:loadingMore ? 0.7 : 1, transition:"all 0.2s" }}>
                  {loadingMore ? "Loading more scholarships..." : `Show More Scholarships (${totalCount - results.length} remaining)`}
                </motion.button>
              </motion.div>
            )}

            {/* Results count footer */}
            <p style={{ fontSize:10, color:T.dim, textAlign:"center", margin:"12px 0 0" }}>
              Showing {results.length} of {totalCount} scholarships for {country}
            </p>
          </motion.div>
        </div>

        {/* Mobile Filter */}
        <MobileFilterButton onClick={() => setMobileFilterOpen(true)} hasFilters={hasActiveFilters} />
        <FilterBottomSheet isOpen={mobileFilterOpen} onClose={() => setMobileFilterOpen(false)} title="Filter Scholarships">
          <ScholarshipFilterSidebar filters={schFilters} onChange={setSchFilters} onClear={() => setSchFilters(DEFAULT_SCHOLARSHIP_FILTERS)} counts={filterCounts} />
        </FilterBottomSheet>
      </motion.div>
    </AnimatePresence>
  );
}

function ScholarshipScout({ onToggleSave, savedIds, isDarkMode, initialCountry }: { onToggleSave: (item: ScoutResult) => void; savedIds: Set<string>; isDarkMode: boolean; initialCountry?: string }) {

  const [query,   setQuery]   = useState("");
  const [university, setUniversity] = useState("");
  const [universityResults, setUniversityResults] = useState<Array<{ id: string; title: string; amount: string; eligibility: string; url: string; provider: string }>>([]);
  const [major,   setMajor]   = useState<string>(SCHOLARSHIP_MAJORS[0] as string);
  const [country, setCountry] = useState<string>(
    initialCountry && initialCountry !== "" ? initialCountry : SCHOLARSHIP_COUNTRIES[0] as string
  );
  const [level,   setLevel]   = useState<string>(SCHOLARSHIP_LEVELS[0] as string);
  const [phase,   setPhase]   = useState<Phase>("idle");
  const [results, setResults] = useState<ScoutResult[]>([]);
  const [error,   setError]   = useState<string>("");
  const [validationError, setValidationError] = useState<string>("");
  const [scanIdx, setScanIdx] = useState(0);
  const [schFilters, setSchFilters] = useState<ScholarshipFilters>(DEFAULT_SCHOLARSHIP_FILTERS);
  const [schSort, setSchSort] = useState<SortOption>("best-match");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  // Pagination state
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [nextOffset, setNextOffset] = useState<number | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);

  // Sync country when the parent CA/US toggle changes
  useEffect(() => {
    if (initialCountry && initialCountry !== "") {
      setCountry(initialCountry);
      setResults([]); setPhase("idle"); setValidationError("");
    }
  }, [initialCountry]);

  // Clear results whenever the user changes their selections
  const handleMajorChange = (v: string) => { setMajor(v); setResults([]); setPhase("idle"); setValidationError(""); };
  const handleLevelChange  = (v: string) => { setLevel(v);  setResults([]); setPhase("idle"); setValidationError(""); };
  const handleCountryChange = (v: string) => { setCountry(v); setResults([]); setPhase("idle"); setValidationError(""); };
  
  useEffect(() => {
    if (phase !== "scanning") return;
    setScanIdx(0);
    const iv = setInterval(() => setScanIdx(p => Math.min(p+1, SCH_SCAN_MSGS.length-1)), 530);
    return () => clearInterval(iv);
  }, [phase]);
  
  const handleSearch = async () => {
    // Input validation — require country and major
    const missingCountry = country === "Any Country" || !country;
    const missingMajor   = major   === "Any Major";
    if (missingCountry || missingMajor) {
      setValidationError("Action Required: Please fill out your country and major first.");
      return;
    }
    setValidationError("");
    setResults([]);
    setUniversityResults([]);
    setPhase("scanning");
    setError("");
    setHasMore(false);
    setNextOffset(null);
    setTotalCount(0);

    // University-specific Tavily search (runs in parallel with DB search)
    if (university.trim()) {
      fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "scholarship",
          universitySearch: true, // bypasses domain filter so university sites are included
          filters: {
            query: `${university.trim()} scholarships bursaries financial aid apply ${country !== "Any Country" ? country : ""}`.trim(),
          },
        }),
      })
        .then(r => r.json())
        .then(data => {
          if (data?.results?.length) {
            const seenDomains = new Set<string>();
            const deduped = (data.results as Array<{ title?: string; amount?: string; eligibility?: string; url?: string }>)
              .filter(r => {
                if (!r.url) return false;
                try {
                  const domain = new URL(r.url).hostname.replace("www.", "");
                  if (seenDomains.has(domain)) return false;
                  seenDomains.add(domain);
                  return true;
                } catch { return false; }
              })
              .map((r, i) => ({
                id: `uni-${i}`,
                title: r.title ?? "Scholarship",
                amount: r.amount ?? "Varies",
                eligibility: r.eligibility ?? "",
                url: r.url ?? "",
                provider: university.trim(),
              }));
            if (deduped.length) setUniversityResults(deduped);
          }
        })
        .catch(() => { /* silent fail — university search is bonus */ });
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10-second timeout
      let response: Response;
      try {
        response = await fetch("/api/scholarships", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ country, major, level, query: query?.trim() ?? "", offset: 0, limit: 10 }),
          signal: controller.signal,
        });
      } finally {
        clearTimeout(timeoutId);
      }
      let data: { scholarships?: ScoutResult[]; total?: number; hasMore?: boolean; nextOffset?: number | null; error?: string } = {};
      try { data = await response.json(); } catch { data = {}; }
      if (!response.ok || !data.scholarships) {
        setError(data.error || "Failed to fetch scholarships. Please try again.");
        setResults([]);
      } else if (data.scholarships.length === 0) {
        setError(`No scholarships found for ${major} in ${country}. Try broadening your search.`);
        setResults([]);
      } else {
        setResults(data.scholarships);
        setTotalCount(data.total || data.scholarships.length);
        setHasMore(data.hasMore || false);
        setNextOffset(data.nextOffset ?? null);
        setError("");
      }
    } catch (err: unknown) {
      console.error("[v0] Scholarship search error:", err);
      const isAbort = err instanceof Error && err.name === "AbortError";
      setError(isAbort ? "Search timed out — please try again." : "Could not reach the scholarship database. Please check your connection and try again.");
      setResults([]);
    }
    setPhase("results");
  };
  
  const handleLoadMore = async () => {
    if (!hasMore || nextOffset === null || loadingMore) return;
    setLoadingMore(true);
    try {
      const response = await fetch("/api/scholarships", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country, major, level, query: query?.trim() ?? "", offset: nextOffset, limit: 20 }),
      });
      const data = await response.json();
      if (response.ok && data.scholarships) {
        setResults(prev => [...prev, ...data.scholarships]);
        setHasMore(data.hasMore || false);
        setNextOffset(data.nextOffset || null);
      }
    } catch (err) {
      console.error("[v0] Load more error:", err);
    }
    setLoadingMore(false);
  };
  return (
    <motion.div variants={fadeUp} initial="hidden" animate="visible" style={{ display:"flex", flexDirection:"column", gap:14, width:"100%", maxWidth:"90vw", boxSizing:"border-box", marginTop:40 }}>
      <Glass glow style={{ padding:18, display:"flex", flexDirection:"column", gap:11, width:"100%", boxSizing:"border-box" }}>
        <p style={{ fontSize:10, color:T.mid, margin:0, letterSpacing:".08em" }}>AI SCHOLARSHIP FINDER</p>
        <input value={query} onChange={e => setQuery(e.target.value ?? "")} onKeyDown={e => e.key==="Enter" && handleSearch()}
          placeholder="Tell us about yourself — e.g. 3.8 GPA, female, first-generation, studying nursing, Canadian citizen..."
          style={{ width:"100%", padding:"10px 13px", background:T.glassHi, border:`1px solid ${T.border}`, borderRadius:T.rsm, color:T.text, fontSize:13, outline:"none", fontFamily:"inherit", boxSizing:"border-box" }} />
        <input value={university} onChange={e => setUniversity(e.target.value ?? "")} onKeyDown={e => e.key==="Enter" && handleSearch()}
          placeholder="🎓 University name (optional) — e.g. University of Toronto, McGill, UBC..."
          style={{ width:"100%", padding:"10px 13px", background:T.glassHi, border:`1px solid ${T.border}`, borderRadius:T.rsm, color:T.text, fontSize:13, outline:"none", fontFamily:"inherit", boxSizing:"border-box" }} />
        <div style={{ display:"flex", flexWrap:"wrap", gap:8, width:"100%", boxSizing:"border-box" }}>
          {/* Major — takes full row width until there is enough space to share */}
          <div style={{ flex:"1 1 180px", minWidth:140 }}>
            <ScholarshipSelect value={major} options={SCHOLARSHIP_MAJORS as readonly string[]} onChange={handleMajorChange} isDarkMode={isDarkMode} />
          </div>
          {/* Level — always visible, fixed minimum */}
          <div style={{ flex:"1 1 110px", minWidth:100 }}>
            <ScholarshipSelect value={level} options={SCHOLARSHIP_LEVELS as readonly string[]} onChange={handleLevelChange} isDarkMode={isDarkMode} />
          </div>
          {/* Country — always visible, fixed minimum */}
          <div style={{ flex:"1 1 90px", minWidth:84 }}>
            <ScholarshipSelect value={country} options={SCHOLARSHIP_COUNTRIES as readonly string[]} onChange={handleCountryChange} isDarkMode={isDarkMode} />
          </div>
        </div>
        <motion.button whileTap={tapAnim.tap} onClick={handleSearch} disabled={phase==="scanning"}
          style={{ width:"100%", padding:"11px 0", borderRadius:T.rsm, border:"none", cursor:"pointer", background:"linear-gradient(135deg," + T.gold + "," + T.goldDim + ")", color:"#07090d", fontSize:13, fontWeight:800, fontFamily:"inherit", opacity:phase==="scanning"?.65:1, boxShadow:"0 0 18px " + T.glow, boxSizing:"border-box" }}>
          {phase==="scanning" ? "Scanning databases..." : "Find Scholarships"}
        </motion.button>

        {/* Validation warning — shown when user tries to search without selecting options */}
        <AnimatePresence>
          {validationError && (
            <motion.div
              key="val-warn"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              style={{
                marginTop: 4,
                padding: "12px 14px",
                borderRadius: T.rsm,
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.4)",
                display: "flex",
                alignItems: "flex-start",
                gap: 10,
              }}
            >
              <span style={{ fontSize: 14, lineHeight: 1, flexShrink: 0, marginTop: 1 }}>!</span>
              <p style={{ fontSize: 12, color: "#ef4444", fontWeight: 600, margin: 0, lineHeight: 1.5, textAlign: "left" }}>
                {validationError}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scanning & Error states */}
        <AnimatePresence>
          {phase==="scanning" && (
            <motion.div key="ss" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
              <div style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 4px 8px" }}>
                <span style={{ width:7, height:7, borderRadius:"50%", background:T.gold, display:"inline-block", animation:"wf-pulse 1s infinite", flexShrink:0 }} />
                <span style={{ fontSize:12, color:T.gold }}>{SCH_SCAN_MSGS[scanIdx] ?? SCH_SCAN_MSGS[0]}</span>
              </div>
              <CardSkeletonLoader count={3} />
            </motion.div>
          )}
          {phase==="results" && error && (
            <motion.div key="error" initial={{opacity:0, y:-8}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-8}}>
              <div style={{ padding:16, display:"flex", flexDirection:"column", gap:8, background:`rgba(239,68,68,0.08)`, borderRadius:T.rmd, borderWidth:"0 0 0 3px", borderStyle:"solid", borderColor:"#ef4444" }}>
                <span style={{ fontSize:12, color:"#ef4444", fontWeight:600 }}>⚠ {error}</span>
                <motion.button whileTap={tapAnim.tap} onClick={handleSearch} disabled={phase==="scanning"}
                  style={{ width:"100%", padding:"9px 0", borderRadius:T.rsm, border:`1px solid #ef4444`, background:"transparent", color:"#ef4444", fontSize:12, fontWeight:700, fontFamily:"inherit", cursor:"pointer", boxSizing:"border-box" }}>
                  Try Again
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Glass>
      {/* University-specific results */}
      <AnimatePresence>
        {universityResults.length > 0 && (
          <motion.div key="uni-results" initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:10 }}>
            <Glass glow style={{ padding:16, display:"flex", flexDirection:"column", gap:10 }}>
              <p style={{ fontSize:10, color:T.gold, margin:0, letterSpacing:".08em", fontWeight:700 }}>🎓 {university.trim().toUpperCase()} — SPECIFIC FUNDING</p>
              {universityResults.map(r => (
                <div key={r.id} style={{ padding:"12px 14px", borderRadius:T.rsm, background:T.glassHi, border:`1px solid ${T.border}`, display:"flex", flexDirection:"column", gap:6 }}>
                  <p style={{ fontSize:13, fontWeight:700, color:T.text, margin:0, letterSpacing:"-0.01em" }}>{r.title}</p>
                  {r.amount && r.amount !== "N/A" && <p style={{ fontSize:11, color:T.gold, margin:0, fontWeight:600 }}>{r.amount}</p>}
                  {r.eligibility && r.eligibility !== "N/A" && <p style={{ fontSize:11, color:T.mid, margin:0, lineHeight:1.5 }}>{r.eligibility}</p>}
                  {r.url && (
                    <a href={r.url} target="_blank" rel="noopener noreferrer"
                      style={{ fontSize:11, color:T.gold, fontWeight:700, textDecoration:"none", marginTop:2, display:"inline-flex", alignItems:"center", gap:4 }}>
                      Apply directly → <span style={{ fontSize:10, color:T.mid, fontWeight:400, wordBreak:"break-all" }}>{r.url.replace(/^https?:\/\//, "").split("/")[0]}</span>
                    </a>
                  )}
                </div>
              ))}
            </Glass>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results section — computed vars hoisted out of IIFE to avoid regex parse errors */}
      <ScholarshipResults
        phase={phase}
        results={results}
        country={country}
        userQuery={query}
        schSort={schSort}
        setSchSort={setSchSort}
        schFilters={schFilters}
        setSchFilters={setSchFilters}
        hasMore={hasMore}
        loadingMore={loadingMore}
        totalCount={totalCount}
        handleLoadMore={handleLoadMore}
        onToggleSave={onToggleSave}
        savedIds={savedIds}
        mobileFilterOpen={mobileFilterOpen}
        setMobileFilterOpen={setMobileFilterOpen}
      />
    </motion.div>
  );
}

// ── Saved Items (My Vault) ─────────────────────────���──��───────────────────────
function SavedItems({ saved, onRemove }: { saved: ScoutResult[]; onRemove: (item: ScoutResult) => void }) {
  
  
  if (saved.length === 0) {
    return (
      <motion.div variants={fadeUp} initial="hidden" animate="visible" style={{ textAlign: "center", padding: 40 }}>
        <Bookmark size={40} style={{ color: T.dim, marginBottom: 12 }} />
        <p style={{ fontSize: 14, color: T.mid, margin: "0 0 8px" }}>No saved items yet</p>
        <p style={{ fontSize: 12, color: T.dim, margin: 0 }}>Bookmark scholarships and loans to save them here</p>
      </motion.div>
    );
  }
  
  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {saved.map(r => (
        <motion.div key={r.id} variants={fadeUp} layout
          whileHover={{ scale: 1.015, transition: { duration: 0.18, ease: [0.22, 1, 0.36, 1] } }}
          style={{ transformOrigin: "center" }}>
          <Glass glow style={{ padding: 14, transition: "border-color 0.2s, box-shadow 0.2s" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 7, gap: 10 }}>
              <div style={{ flex: 1 }}>
                <Chip label={r.type === "scholarship" ? "Scholarship" : "Loan"} color={r.type === "scholarship" ? T.gold : T.green} />
                <p style={{ fontSize: 13, fontWeight: 600, color: T.text, margin: "6px 0 2px", letterSpacing: "-0.02em" }}>{r.title || r.name}</p>
                {(r.provider || r.highlight) && <ExpandableText text={r.provider || r.highlight || ""} maxLines={2} />}
              </div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => onRemove(r)}
                style={{ background: "none", border: "none", cursor: "pointer", padding: 2, color: T.gold, flexShrink: 0 }}
              >
                <Bookmark size={16} fill={T.gold} />
              </motion.button>
            </div>
            <p style={{ fontSize: 12, color: T.goldHi, fontWeight: 600, margin: "0 0 10px" }}>{r.amount || r.rate}</p>
            <GoldCTA href={r.url || r.href} label={r.cta || (r.type === "scholarship" ? "Apply Now" : "Check Rate")} />
          </Glass>
        </motion.div>
      ))}
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────��───────────────────
// SECTION 7 — MARKETPLACE
// ──���──────────────��───────────────────────────────���───────────────────────────

const CREDIT_CARDS = [
  { id: "cap1", icon: "💳", provider: "Capital One", reward: "1.5% Cash Back", color: "#e63946" },
  { id: "amex", icon: "🏆", provider: "Amex Gold", reward: "4x Dining Points", color: "#ffd700" },
  { id: "chase", icon: "🔷", provider: "Chase Sapphire", reward: "3x Travel Points", color: "#0066b2" },
  { id: "discover", icon: "🌟", provider: "Discover It", reward: "5% Rotating Cash Back", color: "#ff6600" },
  { id: "citi", icon: "🏛️", provider: "Citi Double", reward: "2% Cash Back", color: "#003b70" },
  { id: "bofa", icon: "🏦", provider: "Bank of America", reward: "3% Select Categories", color: "#dc143c" },
  { id: "wells", icon: "🐎", provider: "Wells Fargo", reward: "2% Flat Cash Back", color: "#d71e28" },
  { id: "usbank", icon: "🏅", provider: "US Bank", reward: "4% Gas & EV Charging", color: "#002f6c" },
  { id: "td", icon: "🍁", provider: "TD Cash Back", reward: "3% Groceries (CA)", color: "#34a853" },
  { id: "more", icon: "➕", provider: "More Options", reward: "Compare All Cards", color: "#c4b594" },
];

function Marketplace({ country }: { country: string }) {
  const flag = country === "Canada" ? "CA" : country === "USA" ? "US" : null;
  const list = flag ? AFFILIATE_PRODUCTS.filter(p => p.country === flag) : AFFILIATE_PRODUCTS;
  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" style={{ display:"flex", flexDirection:"column", gap:10 }}>
      {/* Recommended Accounts */}
      <div style={{ display:"flex", alignItems:"center", gap:6, margin:"2px 2px 6px" }}>
        <p style={{ fontSize:9, color:"#c4b594", letterSpacing:".1em", margin:0 }}>RECOMMENDED ACCOUNTS</p>
        {flag && (
          <span style={{ fontSize:10, color:T.gold, fontWeight:700 }}>
            {COUNTRY_CONFIG[flag === "CA" ? "Canada" : "USA"].flag} {COUNTRY_CONFIG[flag === "CA" ? "Canada" : "USA"].currency}
          </span>
        )}
      </div>
      {list.map(p => (
        <motion.div key={p.id} variants={fadeUp}>
          <Glass glow style={{ padding:12 }}>
            <div style={{ display:"flex", alignItems:"center", gap:9, marginBottom:7 }}>
              <span style={{ fontSize:20 }}>{p.logo}</span>
              <div>
                <p style={{ fontSize:12, fontWeight:700, color:T.text, margin:0 }}>{p.name}</p>
                <p style={{ fontSize:10, color:T.mid, margin:0 }}>{p.tagline}</p>
              </div>
              {p.badge && <Chip label={p.badge} color={T.gold} />}
            </div>
            <p style={{ fontSize:10, color:T.dim, margin:"0 0 9px", lineHeight:1.4 }}>{p.highlight}</p>
            <GoldCTA href={p.href} label={p.cta} />
          </Glass>
        </motion.div>
      ))}

      {/* Credit Cards Section */}
      <div style={{ marginTop:12 }}>
        <p style={{ fontSize:9, color:"#c4b594", letterSpacing:".1em", margin:"0 0 10px" }}>CREDIT CARDS</p>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, maxHeight:320, overflowY:"auto", paddingRight:4 }}>
          {CREDIT_CARDS.map(card => (
            <motion.div key={card.id} variants={fadeUp} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <div style={{
                padding:"10px 10px 8px",
                borderRadius:10,
                background:"rgba(255,255,255,0.03)",
                border:"1px solid rgba(196,181,148,0.15)",
                cursor:"pointer",
                transition:"all 0.2s",
              }}>
                <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:5 }}>
                  <span style={{ fontSize:16 }}>{card.icon}</span>
                  <span style={{ fontSize:10, fontWeight:700, color:"#c4b594", lineHeight:1.2 }}>{card.provider}</span>
                </div>
                <p style={{ fontSize:9, color:T.mid, margin:"0 0 6px", lineHeight:1.3 }}>{card.reward}</p>
                <button style={{
                  width:"100%",
                  padding:"5px 0",
                  borderRadius:6,
                  border:"1px solid rgba(196,181,148,0.3)",
                  background:"rgba(196,181,148,0.08)",
                  color:"#c4b594",
                  fontSize:8,
                  fontWeight:700,
                  cursor:"pointer",
                  fontFamily:"inherit",
                  letterSpacing:".03em",
                  transition:"all 0.2s",
                }}>
                  Check Eligibility
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <AffNote />
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 8 — INLINE CHAT (moved to app/inline-chat.tsx, imported as InlineChatComponent)
// ─────────────────────────────────────────────────────────────────────────────

// ────────���───────────��────────────────��────��──────────────────────────────────
// SECTION 9 — MAIN PAGE
// ───────────────────────────��──────���───────────��──────────────────────────────

type ToolId = "budget"|"savings"|"loan"|"scholar"|"saved";
const NAV_TOOLS: { id: ToolId; label: string; Icon: React.FC<{size?:number}> }[] = [
  { id:"budget",  label:"Budget",       Icon: ({size=15}) => <BarChart2  size={size} /> },
  { id:"savings", label:"Savings",      Icon: ({size=15}) => <PiggyBank  size={size} /> },
  { id:"loan",    label:"Loan Tools",   Icon: ({size=15}) => <DollarSign size={size} /> },
  { id:"scholar", label:"Scholarship Finder", Icon: ({size=15}) => <BookOpen   size={size} /> },
  { id:"saved",   label:"My Saved",     Icon: ({size=15}) => <Bookmark   size={size} /> },
];

// v55 — inputVal verified at line 319, browser running stale cache
export default function WealthNutzPage() {
  const [activeTool, setActiveTool] = useState<ToolId|"">("");
  const [panelView,  setPanelView]  = useState<"chat"|"tool">("chat");
  const [country,    setCountry]    = useState<string>("");
  const [sideTab,    setSideTab]    = useState<"tools"|"market">("tools");
  const [copied,     setCopied]     = useState<boolean>(false);
  const [chatKey,    setChatKey]    = useState<number>(0);
  const [showAuth,   setShowAuth]   = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarClosing, setSidebarClosing] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Update theme tokens when mode changes
  T = isDarkMode ? DARK_THEME : LIGHT_THEME;
  
  const closeSidebar = useCallback(() => {
    setSidebarClosing(true);
    setTimeout(() => { setSidebarOpen(false); setSidebarClosing(false); }, 240);
  }, []);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [savedItems, setSavedItems] = useState<ScoutResult[]>([]);
  const savedIds = useMemo(() => new Set(savedItems.map(x => x.id)), [savedItems]);
  const [locationBarDismissed, setLocationBarDismissed] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [discardedItems, setDiscardedItems] = useState<Map<string, ScoutResult>>(new Map());
  const [lastDiscardedId, setLastDiscardedId] = useState<string | null>(null);
  
  // Auto-dismiss toast
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 5000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  // Handle discarding a scholarship/loan and showing undo toast
  const handleDiscardItem = (item: ScoutResult) => {
    setDiscardedItems(prev => new Map(prev).set(item.id, item));
    setLastDiscardedId(item.id);
    setToast(`Discarded: ${item.title}`);
  };

  // Handle undoing a discard
  const handleUndoDiscard = () => {
    if (lastDiscardedId) {
      setDiscardedItems(prev => {
        const next = new Map(prev);
        next.delete(lastDiscardedId);
        return next;
      });
      setLastDiscardedId(null);
      setToast(null);
    }
  };

useEffect(() => {
  // Load from localStorage first (for guests)
  const localSaved = readSaved();
  setSavedItems(localSaved);
  
  // Supabase auth state listener for persistent sessions
  let subscription: { unsubscribe: () => void } | null = null;
  
  const initAuth = async () => {
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      
      // Get initial session
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setAuthLoading(false);
      
      // If user is logged in, fetch their bookmarks from Supabase immediately
      if (session?.user) {
        const bookmarks = await fetchBookmarksFromSupabase(session.user.id);
        setSavedItems(bookmarks); // Always update state with DB data
        writeSaved(bookmarks); // Sync to localStorage as backup
      }
      
      // Listen for auth changes
      const { data: { subscription: sub } } = supabase.auth.onAuthStateChange(async (event, session) => {
        setUser(session?.user ?? null);
        
        // Fetch bookmarks immediately when user signs in
        if (event === "SIGNED_IN" && session?.user) {
          // Merge DB bookmarks with any locally saved (guest) bookmarks
          const [dbBookmarks, localBookmarks] = await Promise.all([
            fetchBookmarksFromSupabase(session.user.id),
            Promise.resolve(readSaved()),
          ]);
          const dbIds = new Set(dbBookmarks.map((b: ScoutResult) => b.id));
          const localOnly = localBookmarks.filter((b: ScoutResult) => !dbIds.has(b.id));
          const merged = [...dbBookmarks, ...localOnly];
          setSavedItems(merged);
          writeSaved(merged);
          // Upload any local-only items to Supabase
          if (localOnly.length > 0) {
            await Promise.all(localOnly.map((b: ScoutResult) => upsertBookmarkToSupabase(session.user!.id, b)));
          }
        }

        // Also handle token refresh which keeps the session alive
        if (event === "TOKEN_REFRESHED" && session?.user) {
          const bookmarks = await fetchBookmarksFromSupabase(session.user.id);
          setSavedItems(bookmarks);
          writeSaved(bookmarks);
        }

        // On sign out: keep items in localStorage for guest mode — don't wipe them
        if (event === "SIGNED_OUT") {
          setSavedItems(readSaved());
        }
      });
      subscription = sub;
    } catch {
      setAuthLoading(false);
    }
  };
  
  initAuth();
  
  return () => {
    subscription?.unsubscribe();
  };
  }, []);
  
  const handleToggleSave = useCallback(async (item: ScoutResult) => {
    const current = savedItems;
    const exists = current.some(x => x.id === item.id);
    const updated = exists ? current.filter(x => x.id !== item.id) : [...current, item];
    // Always persist locally first — works for both guests and signed-in users
    setSavedItems(updated);
    writeSaved(updated);
    if (!user) {
      if (!exists) setToast("Saved locally — sign in to sync across devices");
      return;
    }
    // Sync with Supabase for signed-in users
    if (exists) {
      await deleteBookmarkFromSupabase(user.id, item.id);
    } else {
      await upsertBookmarkToSupabase(user.id, item);
    }
  }, [user, savedItems]);

  // Scroll to section by element ID and close sidebar
  const scrollToSection = useCallback((sectionId: string) => {
    closeSidebar();
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 260);
  }, [closeSidebar]);

  const openTool = useCallback((id: ToolId) => { setActiveTool(id); setPanelView("tool"); }, []);
  const clearChat = useCallback(() => setChatKey(k => k + 1), []);

const handleSignOut = useCallback(async () => {
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      await supabase.auth.signOut();
      setUser(null);
      window.location.href = "/";
    } catch (err) {
      console.error("Sign out error:", err);
    }
  }, []);
  
  const handleShare = useCallback(() => {
  navigator.clipboard?.writeText(VIRAL_SHARE ?? "").then(() => {
  setCopied(true);
  setTimeout(() => setCopied(false), 2800);
    }).catch(() => {});
  }, []);

  const currentTool = NAV_TOOLS.find(t => t.id === activeTool);

const hBtn = (active = false): CSSProperties => ({
  padding:"4px 10px", borderRadius:20, fontFamily:"inherit", fontSize:11, cursor:"pointer", fontWeight: 500,
  border:`1px solid ${active ? T.gold : T.border}`,
  background: active ? "rgba(201,168,76,0.12)" : "rgba(0,0,0,0)",
  color: active ? T.gold : T.mid,
  transition:"all .2s",
  });

  return (
    <>
      <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", background:T.bg, color:T.text, fontFamily:"Inter,system-ui,-apple-system,sans-serif", transition:"background .3s, color .3s", paddingBottom:"24px" }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
          *{box-sizing:border-box}
          ::-webkit-scrollbar{width:3px}
          ::-webkit-scrollbar-thumb{background:#2a2620;border-radius:3px}
          textarea,input,select,button{font-family:inherit}
          input[type=range]{-webkit-appearance:none;appearance:none;background:transparent;cursor:pointer}
          select option{background:#0d0f14;color:${T.text}}
          @keyframes wf-bounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-5px)}}
          @keyframes wf-cur   {0%,100%{opacity:1}50%{opacity:0}}
          @keyframes wf-pulse {0%,100%{opacity:1}50%{opacity:.3}}
          @keyframes wf-skel  {0%{background-position:200% 0}100%{background-position:-200% 0}}
          @keyframes wf-shimmer{0%{background-position:200% center}100%{background-position:-200% center}}
          @keyframes wf-starwars-scroll{0%{bottom:-100%}100%{bottom:200%}}
  @keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}

  /* ── Mobile responsiveness ─────────────────────────────────────────── */
  @media (max-width: 768px) {
  .forge-header { padding: 6px 10px !important; gap: 6px !important; }
  .wealthnutz-logo-text { font-size: 15px !important; }
  .forge-body { flex-direction: column !important; }
  }
    .forge-main { min-width: 0 !important; }
    .forge-picks-credit-row { flex-direction: column !important; gap: 12px !important; }
    .forge-picks-credit-row > * { flex: 1 1 100% !important; min-width: 0 !important; }
    .forge-hero-section { padding: 16px 14px 0 !important; }
  }

  /* Desktop: Full-width sidebar below main content */
  @media (min-width: 769px) {
    .forge-hamburger { display: none !important; }
    .forge-body { flex-direction: column !important; }
    .forge-main { width: 100% !important; flex: none !important; }
    .forge-sidebar {
      width: 100% !important;
      max-width: none !important;
      flex: none !important;
      border-left: none !important;
      border-top: 1px solid rgba(255,255,255,0.1) !important;
      position: static !important;
      height: auto !important;
      overflow: visible !important;
    }
    .forge-sidebar-header { display: none !important; }
  }

  .forge-sidebar-header { display: none !important; }

  /* Tap-outside overlay — hidden on desktop, shown on mobile */
  .forge-sidebar-overlay {
    display: none;
  }

  @media (max-width: 640px) {
    .forge-sidebar-overlay {
      display: block !important;
      position: fixed !important;
      inset: 0 !important;
      background: rgba(0,0,0,0.6) !important;
      z-index: 9998 !important;
      cursor: pointer !important;
    }
  }

  @media (max-width: 640px) {
    .forge-header { padding: 5px 10px !important; gap: 5px !important; }
    .wealthnutz-logo-text { font-size: 14px !important; }
    .forge-body { flex-direction: column !important; }
    .forge-main { overflow-x: hidden !important; }
    .forge-sidebar {
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      width: 100vw !important;
      max-width: 100vw !important;
      height: 100dvh !important;
      z-index: 9999 !important;
      transform: translateX(-100%) !important;
      opacity: 0 !important;
      transition: transform 0.28s cubic-bezier(0.4,0,0.2,1), opacity 0.22s ease !important;
      border-left: none !important;
      border-right: none !important;
      box-shadow: none !important;
      overflow-y: auto !important;
    }
    .forge-sidebar.open {
      transform: translateX(0) !important;
      opacity: 1 !important;
    }
    .forge-sidebar.closing {
      transform: translateX(-100%) !important;
      opacity: 0 !important;
    }
    .forge-sidebar-header { display: flex !important; }
    .forge-hero-section { padding: 12px 12px 0 !important; }
    .forge-picks-credit-row { flex-direction: column !important; }
    .forge-footer-grid { grid-template-columns: 1fr 1fr !important; gap: 16px !important; }
    .forge-chat-input-bar { padding: 10px 12px !important; }
  }

  @media (max-width: 400px) {
    .forge-footer-grid { grid-template-columns: 1fr !important; }
  }
        `}</style>

{/* Auth Modal */}
        <AnimatePresence>
          {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
        </AnimatePresence>



        {/* ═══ HEADER ══════════════════════════════════════════════════════════ */}
        <header style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 14px", borderBottom:`1px solid ${T.border}`, flexShrink:0, zIndex:10, background: isDarkMode ? "#0a0a0a" : "#ffffff", gap:8, minHeight:52 }} className="forge-header">
          
          {/* Left: Country flags */}
          <div style={{ display:"flex", gap:6, alignItems:"center", flexWrap:"nowrap", minWidth: 80 }}>
            {(["Canada","USA"] as const).map(c => {
              const isCanada = c === "Canada";
              const isActive = country === c;
              return (
                <motion.button key={c} whileTap={tapAnim.tap} onClick={() => setCountry(country === c ? "" : c)}
                  title={c}
                  style={{ ...hBtn(isActive), padding:"5px 8px", fontSize:14, borderRadius:10, whiteSpace:"nowrap", display:"flex", alignItems:"center", justifyContent:"center", minWidth:32, height:32 }}>
                  {isCanada ? "🇨🇦" : "🇺🇸"}
                </motion.button>
              );
            })}
          </div>
          
          {/* Center: Logo — clickable, scrolls to top, closes sidebar, returns home */}
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={() => { closeSidebar(); setPanelView("chat"); setActiveTool(""); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            aria-label="Go to home"
            style={{ display:"flex", alignItems:"center", justifyContent:"center", flex:1, background:"none", border:"none", cursor:"pointer", padding:0, outline:"none" }}
          >
            <img
              src="/images/wealthnutz-logo-full.png"
              alt="WealthNutz"
              style={{ height:"clamp(32px, 8vw, 44px)", width:"auto", objectFit:"contain" }}
              className="wealthnutz-logo"
              onError={e => {
                // Fallback to text logo if image missing
                const el = e.currentTarget as HTMLImageElement;
                el.style.display = "none";
                const next = el.nextElementSibling as HTMLElement | null;
                if (next) next.style.display = "flex";
              }}
            />
            <span style={{ display:"none", alignItems:"center", gap:6 }}>
              <span style={{ fontSize:16, fontWeight:900, color:"#C9A84C", letterSpacing:"-0.03em", textTransform:"uppercase" }} className="wealthnutz-logo-text">WealthNutz</span>
            </span>
          </motion.button>
          
          {/* Right: Theme toggle + MENU button */}
          <div style={{ display:"flex", gap:8, alignItems:"center", minWidth: 80, justifyContent:"flex-end" }}>
            {/* Theme Toggle */}
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsDarkMode(!isDarkMode)}
              style={{ 
                background: isDarkMode ? T.glass : "rgba(0,0,0,0.05)", 
                border: `1px solid ${isDarkMode ? T.border : "rgba(0,0,0,0.12)"}`, 
                borderRadius: 8, 
                padding: "6px 8px", 
                cursor: "pointer", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                color: isDarkMode ? T.gold : "#0F172A",
              }}
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
            </motion.button>
            

          </div>
        </header>

        {/* ═══ LOCATION BAR ═════════════════════���══════════════════════════════ */}
        <AnimatePresence>
          {!locationBarDismissed && !country && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{ background: isDarkMode ? "#1a1a1a" : "#F1F5F9", borderBottom: `1px solid ${T.border}`, overflow: "hidden" }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, padding: "10px 14px", flexWrap: "wrap" }}>
                <span style={{ fontSize: 12, color: T.mid, textAlign: "center" }}>
                  To find the most accurate rates in your area, please select your location:
                </span>
                <div style={{ display: "flex", gap: 8 }}>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => { setCountry("Canada"); setLocationBarDismissed(true); }}
                    style={{ 
                      padding: "6px 14px", 
                      borderRadius: 8, 
                      border: "none", 
                      background: T.gold, 
                      color: "#07090d", 
                      fontSize: 12, 
                      fontWeight: 700, 
                      cursor: "pointer", 
                      fontFamily: "inherit",
                      display: "flex",
                      alignItems: "center",
                      gap: 6
                    }}
                  >
                    <span>🇨🇦</span> CA
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => { setCountry("USA"); setLocationBarDismissed(true); }}
                    style={{ 
                      padding: "6px 14px", 
                      borderRadius: 8, 
                      border: "none", 
                      background: T.gold, 
                      color: "#07090d", 
                      fontSize: 12, 
                      fontWeight: 700, 
                      cursor: "pointer", 
                      fontFamily: "inherit",
                      display: "flex",
                      alignItems: "center",
                      gap: 6
                    }}
                  >
                    <span>🇺🇸</span> US
                  </motion.button>
                </div>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setLocationBarDismissed(true)}
                  style={{ 
                    position: "absolute", 
                    right: 14, 
                    background: "none", 
                    border: "none", 
                    color: T.dim, 
                    cursor: "pointer", 
                    padding: 4,
                    display: "flex",
                    alignItems: "center"
                  }}
                  aria-label="Dismiss"
                >
                  <X size={16} />
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ═══ BODY ════════════════════════════════════════════════════════════ */}
        <div style={{ flex:1, display:"flex", overflow:"auto" }} className="forge-body">

          {/* ── Main panel ──────────────────────────────────────────────��──────── */}
          <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", minHeight:0 }} className="forge-main">

            {/* Tool view */}
            {panelView==="tool" && activeTool && (
              <motion.div key={activeTool} initial={{opacity:0,x:12}} animate={{opacity:1,x:0}} transition={{duration:.26}}
                style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
                <div style={{ padding:"12px 20px", borderBottom:`1px solid ${T.border}`, display:"flex", alignItems:"center", gap:10, flexShrink:0 }}>
                  <motion.button whileTap={tapAnim.tap} onClick={() => { setPanelView("chat"); setActiveTool(""); window.scrollTo({ top: 0, behavior: "instant" }); }} style={{ background:"none", border:"none", color:T.mid, cursor:"pointer", padding:4, display:"flex", alignItems:"center", borderRadius:6 }}>
                    <ChevronLeft size={18} />
                  </motion.button>
                  <span style={{ fontSize:13, fontWeight:700, color:T.gold }}>{currentTool?.label ?? ""}</span>
                </div>
                <div style={{ flex:1, overflowY:"auto", padding:20 }}>
                  {activeTool==="budget"  && <BudgetTool />}
                  {activeTool==="savings" && <SavingsTool />}
                  {activeTool==="loan"    && <LoanTool onToggleSave={handleToggleSave} savedIds={savedIds} userCountry={country} isDarkMode={isDarkMode} />}
                  {activeTool==="scholar" && <ScholarshipScout onToggleSave={handleToggleSave} savedIds={savedIds} isDarkMode={isDarkMode} initialCountry={country} />}
                  {activeTool==="saved"   && <SavedItems saved={savedItems} onRemove={handleToggleSave} />}
                </div>
              </motion.div>
            )}

{/* Chat view */}
  {panelView==="chat" && (
  <>
  <div style={{ flex:1, display:"flex", flexDirection:"column" }}>
  {/* Hero Section */}
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    style={{ 
      padding: "40px 20px 30px", 
      textAlign: "center",
      background: `linear-gradient(180deg, ${isDarkMode ? "rgba(201,168,76,0.08)" : "rgba(184,146,47,0.06)"} 0%, rgba(0,0,0,0) 100%)`,
    }}
  >
    <h1 style={{ 
      fontSize: "clamp(24px, 5vw, 36px)", 
      fontWeight: 800, 
      color: T.text, 
      margin: "0 0 12px",
      lineHeight: 1.2,
      letterSpacing: "-0.02em",
    }}>
      Stop searching and start finding.
    </h1>
    <p style={{
      fontSize: "clamp(13px, 2.5vw, 15px)",
      color: T.mid,
      margin: 0,
      maxWidth: 420,
      marginLeft: "auto",
      marginRight: "auto",
      lineHeight: 1.5,
    }}>
      {TAGLINE}
    </p>


    {/* ── Centrepiece MENU button (mobile only) ── */}
    <div style={{ marginTop: 28, justifyContent: "center" }} className="flex md:hidden">
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.96 }}
        onClick={() => sidebarOpen ? closeSidebar() : setSidebarOpen(true)}
        aria-label="Open menu"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "14px 36px",
          borderRadius: 999,
          border: `2.5px solid ${T.gold}`,
          background: isDarkMode ? "rgba(201,168,76,0.10)" : "rgba(201,168,76,0.08)",
          color: T.gold,
          fontSize: "clamp(14px, 3vw, 16px)",
          fontWeight: 800,
          letterSpacing: ".12em",
          cursor: "pointer",
          fontFamily: "inherit",
          boxShadow: isDarkMode
            ? "0 0 24px rgba(201,168,76,0.18), inset 0 1px 0 rgba(255,255,255,0.06)"
            : "0 2px 16px rgba(201,168,76,0.22)",
          transition: "box-shadow .2s",
          minWidth: "clamp(180px, 40vw, 260px)",
          justifyContent: "center",
          whiteSpace: "nowrap",
        }}
      >
        <span style={{ fontWeight: 800, letterSpacing: ".14em" }}>MENU</span>
        <ChevronRight size={18} strokeWidth={2.5} />
      </motion.button>
    </div>
  </motion.div>
  <div style={{ flex:1 }}>
  <InlineChatComponent key={chatKey} country={country} isDarkMode={isDarkMode} />
  </div>
  
  {/* Top Picks — at bottom, visible after country selection */}
  {country && (
    <div style={{ padding: "16px 16px 20px", borderTop: `1px solid ${T.border}` }}>
      <TopPicksSection country={country === "Canada" ? "Canada" : "USA"} />
    </div>
  )}
  </div>
  <footer style={{ borderTop:`1px solid ${T.border}`, background: isDarkMode ? "rgba(5,5,5,0.6)" : "rgba(250,250,250,0.9)", padding:"8px 10px" }}>
                  {/* Partners — compact horizontal */}
                  <div style={{ display:"flex", justifyContent:"center", gap:12, marginBottom:6, flexWrap:"wrap", fontSize:9 }}>
                    {PARTNERS.map(p => (
                      <span key={p.name} style={{ color:T.dim }}>
                        <strong style={{color:T.mid}}>{p.name}</strong> · {p.desc}
                      </span>
                    ))}
                  </div>
                  {/* Disclaimer — ultra-compact */}
                  <p style={{ fontSize:9, color:"#c4b594", lineHeight:1.4, margin:0, textAlign:"center", padding:"0 8px" }}>{FOOTER_TEXT}</p>
                </footer>
              </>
            )}
          </div>

          {/* ═══ SIDEBAR ���═════════════����═══��══════════════��══���══����════════════ */}
          {/* Tap-outside overlay — mobile only, shown via CSS */}
          {(sidebarOpen || sidebarClosing) && (
            <div
              aria-hidden="true"
              onClick={() => closeSidebar()}
              className="forge-sidebar-overlay"
            />
          )}

          <aside style={{ width:"100%", maxWidth:224, flexShrink:0, borderWidth:"0 0 0 1px", borderStyle:"solid", borderColor:T.border, background: isDarkMode ? "#0a0a0a" : "#ffffff", display:"flex", flexDirection:"column", overflow:"hidden" }} className={`forge-sidebar${sidebarOpen ? ' open' : ''}${sidebarClosing ? ' closing' : ''}`}>
            {/* Mobile close button */}
            <div style={{ display:"flex", padding:"14px 16px", justifyContent:"space-between", alignItems:"center", borderBottom:`1px solid ${T.border}`, flexShrink:0 }} className="forge-sidebar-header">
              <span style={{ fontSize:14, fontWeight:800, color:T.gold, letterSpacing:".08em" }}>MENU</span>
              <button
                onClick={() => closeSidebar()}
                aria-label="Close menu"
                style={{ background:"none", border:`1.5px solid ${T.border}`, color:T.text, cursor:"pointer", borderRadius:8, width:38, height:38, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}
              >
                <X size={20} />
              </button>
            </div>
            {/* Tabs */}
            <div style={{ display:"flex", padding:"10px 10px 0", gap:4, flexShrink:0, borderBottom:`1px solid ${T.border}` }}>
              {([["tools","Tools"],["market","Marketplace"]] as const).map(([id,lbl]) => (
                <motion.button key={id} whileTap={tapAnim.tap} onClick={() => setSideTab(id)}
                  style={{ flex:1, padding:"8px 4px", borderRadius:8, border:"none", cursor:"pointer", fontFamily:"inherit", fontSize:11, fontWeight:sideTab===id?800:700, letterSpacing:".04em", marginBottom:8, background:sideTab===id?"rgba(201,168,76,0.22)":"rgba(0,0,0,0)", color:sideTab===id?T.gold:"#a89968", transition:"all .2s", boxShadow:sideTab===id?`inset 0 0 12px rgba(201,168,76,0.1)`:"none" }}>
                  {lbl}
                </motion.button>
              ))}
            </div>

            <div style={{ flex:1, overflowY:"auto", padding:"12px 11px 16px" }}>

              {/* Tools nav */}
              {sideTab==="tools" && (
                <motion.div variants={stagger} initial="hidden" animate="visible" style={{ display:"flex", flexDirection:"column", gap:3 }}>
                  <p style={{ fontSize:9, color:"#c4b594", letterSpacing:".1em", margin:"2px 2px 9px" }}>ALL TOOLS — FREE</p>
                  {NAV_TOOLS.map(t => {
                    const on = activeTool===t.id && panelView==="tool";
                    return (
                      <motion.button key={t.id} variants={fadeUp} whileTap={tapAnim.tap} onClick={() => { openTool(t.id); closeSidebar(); }}
style={{ display:"flex", alignItems:"center", gap:9, padding:"9px 10px", borderRadius:T.rsm, border:`1px solid ${on?"rgba(201,168,76,0.4)":"rgba(0,0,0,0)"}`, background:on?"rgba(201,168,76,0.14)":"rgba(0,0,0,0)", color:on?T.gold:T.mid, cursor:"pointer", fontSize:12, fontWeight:on?600:400, width:"100%", textAlign:"left", fontFamily:"inherit", transition:"all .2s" }}
          onMouseEnter={e => { if(!on){(e.currentTarget as HTMLElement).style.background=T.glassHi;(e.currentTarget as HTMLElement).style.color=T.text;} }}
          onMouseLeave={e => { if(!on){(e.currentTarget as HTMLElement).style.background="rgba(0,0,0,0)";(e.currentTarget as HTMLElement).style.color=T.mid;} }}>
                        <t.Icon />{t.label}
                        {t.id === "saved" && savedItems.length > 0 && (
                          <span style={{ marginLeft:"auto", fontSize:10, background:T.gold, color:"#07090d", borderRadius:10, padding:"1px 6px", fontWeight:700 }}>{savedItems.length}</span>
                        )}
                      </motion.button>
                    );
                  })}
                  <div style={{ height:1, background:T.border, margin:"12px 2px" }} />
                  
{/* Auth Button - Sign In or User Profile */}
  {authLoading ? (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", padding:"10px 0", color:T.mid, fontSize:11 }}>
      Loading...
    </div>
  ) : user ? (
    <>
      {/* User Profile */}
      <div style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 10px", borderRadius:T.rsm, background:T.glass, border:`1px solid ${T.border}`, marginBottom:8 }}>
        <div style={{ width:28, height:28, borderRadius:"50%", background:`linear-gradient(135deg, ${T.gold}, ${T.goldDim})`, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <User size={14} color="#07090d" />
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <p style={{ fontSize:11, fontWeight:600, color:T.text, margin:0, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
            {user.email?.split("@")[0] || "Member"}
          </p>
          <p style={{ fontSize:9, color:T.mid, margin:0 }}>WealthNutz Member</p>
        </div>
      </div>
      
      {/* Sign Out Button */}
      <motion.button variants={fadeUp} whileTap={tapAnim.tap} onClick={handleSignOut}
        style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:7, padding:"10px 0", borderRadius:T.rsm, cursor:"pointer", fontFamily:"inherit", fontSize:11, fontWeight:600, border:`1px solid ${T.border}`, background:T.glass, color:T.mid, transition:"all .3s", width:"100%" }}>
        <LogOut size={14} /> Sign Out
      </motion.button>
    </>
  ) : (
    <motion.button 
      variants={fadeUp} 
      whileTap={{ scale: 0.97 }} 
      whileHover={{ scale: 1.02, boxShadow: isDarkMode ? "0 0 14px rgba(201,168,76,0.35)" : "0 2px 12px rgba(0,0,0,0.12)" }}
      onClick={() => { setShowAuth(true); closeSidebar(); }}
      style={{ 
        display:"flex", 
        alignItems:"center", 
        justifyContent:"center", 
        gap:8, 
        padding:"12px 0", 
        borderRadius:T.rsm, 
        cursor:"pointer", 
        fontFamily:"inherit", 
        fontSize:11, 
        fontWeight:700, 
        border: isDarkMode ? `1.5px solid ${T.gold}` : `1px solid ${T.cardBorder}`, 
        background: isDarkMode ? "rgba(201,168,76,0.1)" : "#FFFFFF", 
        color: isDarkMode ? T.gold : "#0F172A", 
        transition:"all .25s ease",
        letterSpacing: "0.03em",
        boxShadow: isDarkMode ? "none" : "0 1px 3px rgba(0,0,0,0.06)",
      }}>
      <img src="/images/wealthnutz-logo.png" alt="" width={16} height={16} style={{ objectFit:"contain", flexShrink:0 }} onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
      Member Sign In
    </motion.button>
  )}
                  
                  <div style={{ height:1, background:T.border, margin:"12px 2px" }} />
                  
                  {/* Share button */}
                  <motion.button variants={fadeUp} whileTap={tapAnim.tap} onClick={handleShare}
                    style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:7, padding:"10px 0", borderRadius:T.rsm, cursor:"pointer", fontFamily:"inherit", fontSize:11, fontWeight:600, border:`1px solid ${copied?"rgba(74,222,128,0.4)":T.border}`, background:copied?"rgba(74,222,128,0.08)":T.glass, color:copied?T.green:T.mid, transition:"all .3s" }}>
                    {copied ? <><Check size={14} /> Copied!</> : <><Share2 size={14} /> Share WealthNutz</>}
                  </motion.button>
<p style={{ fontSize:9, color:"#c4b594", textAlign:"center", margin:"4px 0 0", lineHeight:1.5 }}>
  Share with friends — help them find free money
  </p>
                </motion.div>
              )}

              {/* Marketplace */}
              {sideTab==="market" && <Marketplace country={country} />}
            </div>
          </aside>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 50, x: "-50%" }}
            style={{
              position: "fixed",
              bottom: 24,
              left: "50%",
              background: T.cardBg,
              border: `1px solid ${T.gold}`,
              borderRadius: 12,
              padding: "12px 20px",
              display: "flex",
              alignItems: "center",
              gap: 10,
              boxShadow: `0 8px 32px rgba(0,0,0,0.4)`,
              zIndex: 9999,
            }}
          >
            {lastDiscardedId ? (
              <>
                <span style={{ fontSize: 13, color: T.text, fontWeight: 500 }}>{toast}</span>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={handleUndoDiscard}
                  style={{
                    padding: "6px 14px",
                    borderRadius: 6,
                    background: T.gold,
                    border: "none",
                    color: "#07090d",
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: "pointer",
                    marginLeft: "auto",
                  }}
                >
                  Undo
                </motion.button>
              </>
            ) : (
              <>
                <LogIn size={16} color={T.gold} />
                <span style={{ fontSize: 13, color: T.text, fontWeight: 500 }}>{toast}</span>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => { setToast(null); setShowAuth(true); }}
                  style={{
                    background: T.gold,
                    border: "none",
                    borderRadius: 6,
                    padding: "6px 12px",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#07090d",
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  Sign In
                </motion.button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Cache invalidation marker — v137 final fix
export const __CACHE_BUST_V137__ = "final-stability-" + Date.now();
