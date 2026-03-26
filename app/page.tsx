"use client";

/**
 * Forge — Single File, v0-Ready
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
 */

import { useState, useEffect, useRef, useCallback, useMemo, type ReactNode, type CSSProperties, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp, Clock, DollarSign, GraduationCap, ShoppingBag,
  Send, Share2, Check, ChevronLeft, Trash2, User, Search,
  BarChart2, PiggyBank, BookOpen, ExternalLink, Bookmark, X, LogIn, LogOut,
} from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";

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
  { id: "sofi-refi",   name: "SoFi Student Loan Refinance", rate: "From 4.49% APR", bonus: "$300 Welcome Bonus", badge: "Best Rate", country: "US" as const, href: "https://www.sofi.com/refinance-student-loans/", highlight: "No fees · Unemployment protection · Member benefits", cta: "Check My Rate" },
  { id: "earnest",     name: "Earnest Student Loans",       rate: "From 4.25% APR", bonus: "$200 Bonus",         badge: "Flexible",  country: "US" as const, href: "https://www.earnest.com/",                     highlight: "Skip a payment option · Precision pricing",          cta: "Check My Rate" },
  { id: "credible",    name: "Credible Marketplace",        rate: "Compare 8+ Lenders", bonus: "Free Comparison",badge: "Compare",   country: "US" as const, href: "https://www.credible.com/",                   highlight: "One form · Multiple offers · No impact on credit",   cta: "Compare Rates" },
  { id: "sallie-mae",  name: "Sallie Mae Loans",            rate: "From 5.24% APR", bonus: "Multi-Year Approval", badge: "",         country: "US" as const, href: "https://www.salliemae.com/",                  highlight: "Cover up to 100% of school costs",                   cta: "Apply Now"     },
  { id: "nslsc",       name: "Federal Student Loans (NSLSC)", rate: "Prime +1%",    bonus: "Grants Available",  badge: "Gov't",     country: "CA" as const, href: "https://www.csnpe-nslsc.canada.ca/",          highlight: "Repayment assistance · No credit check",             cta: "Apply Now"     },
  { id: "rbc-student", name: "RBC Student Line of Credit",  rate: "Prime +0%",      bonus: "$0 Annual Fee",     badge: "Low Rate",  country: "CA" as const, href: "https://www.rbc.com/student/",                highlight: "Only pay interest while in school",                  cta: "Check My Rate" },
];

const TAGLINE = "The all-in-one financial ecosystem for the modern student. Build credit, learn to invest, and forge your future.";

const SCHOLARSHIP_MAJORS   = ["Any Major","Computer Science / Engineering","Business / Finance","Medicine / Health Sciences","Arts & Humanities","Law / Political Science","Education","Environmental Science","Mathematics / Statistics","Nursing","Social Work","Trades / Vocational"] as const;
const SCHOLARSHIP_COUNTRIES= ["Canada","USA","Both"] as const;
const SCHOLARSHIP_YEARS    = ["Any Year","1st Year","2nd Year","3rd Year","4th Year","Graduate"] as const;
const LOAN_TYPES           = ["Student","Personal","Auto"] as const;
type  LoanType             = typeof LOAN_TYPES[number];

// Mock data — shown instantly while DB / search API is connecting
const MOCK_SCHOLARSHIPS = [
  { id:"ms1", type:"scholarship" as const, title:"National Merit Excellence Award",    provider:"National Foundation",       amount:"$5,000–$10,000", deadline:"March 31",   eligibility:"GPA 3.0+, any major, CA or USA",            url:"#" },
  { id:"ms2", type:"scholarship" as const, title:"Future Leaders Bursary",             provider:"Community Foundation",      amount:"$2,500",         deadline:"January 31", eligibility:"First-generation student, any year",         url:"#" },
  { id:"ms3", type:"scholarship" as const, title:"STEM Advancement Grant",             provider:"Tech Industry Fund",        amount:"$4,500–$8,000",  deadline:"February 15",eligibility:"STEM major, 2nd year or above",               url:"#" },
  { id:"ms4", type:"scholarship" as const, title:"Community Impact Scholarship",       provider:"Provincial / State Gov't",  amount:"$3,000",         deadline:"Rolling",    eligibility:"Demonstrated community service, any major",  url:"#" },
  { id:"ms5", type:"scholarship" as const, title:"Women in Business Award",            provider:"Business Leadership Council",amount:"$2,000–$6,000", deadline:"April 1",    eligibility:"Business / Finance major, undergrad",        url:"#" },
];
const MOCK_LOANS = [
  { id:"ml1", type:"loan" as const, title:"Federal Student Loan (Direct)",    provider:"U.S. Dept. of Education / NSLSC",amount:"From 5.50% APR", deadline:"Apply via FAFSA / NSLSC", eligibility:"Enrolled student, US or Canada",           url:"#" },
  { id:"ml2", type:"loan" as const, title:"SoFi Student Loan Refinance",      provider:"SoFi",                          amount:"From 4.49% APR", deadline:"Open — instant pre-qual", eligibility:"Good credit, employed or graduating",       url:"https://www.sofi.com" },
  { id:"ml3", type:"loan" as const, title:"Wealthsimple Personal Loan",       provider:"Wealthsimple",                  amount:"From 9.99% APR", deadline:"Open — apply in minutes", eligibility:"Canadian resident, 18+, income verified",  url:"https://www.wealthsimple.com" },
];

type ScoutResult = typeof MOCK_SCHOLARSHIPS[number] | typeof MOCK_LOANS[number];

const VIRAL_SHARE   = "This free AI tool finds you $100k+ in scholarships and the lowest loan rates in seconds. It's called Forge and it's completely free: https://forgewealth.app";
const WELCOME_MSG   = "Forge Intelligence Co-Pilot is indexing live financial databases... How can I help you accelerate your wealth today?";
const AFFIL_NOTE    = "Forge may earn a referral commission if you open an account through our links. This never affects our recommendations.";
const FOOTER_TEXT   = "Forge provides general financial education only and is not a licensed financial advisor, broker, or lender. Information is for educational purposes and does not constitute personalized financial, legal, or tax advice. Affiliate links may be present — see our disclosure.";
const SYSTEM_PROMPT = `You are the Forge Intelligence Co-Pilot — a world-class Quantitative Financial Advisor and AI Wealth Intelligence Engine for students in Canada and the USA. You are highly analytical, data-driven, and objective. Your mission is to help students optimize for the highest Net Worth through smart financial arbitrage.

CORE PHILOSOPHY:
1. Net Worth Optimization > Debt-Free Mentality. If a student has a 3% loan but can earn 5% in a HISA, explain why saving/investing might be better than aggressive debt payoff.
2. Arbitrage Thinking: Always compare the COST of debt vs. the RETURN on savings/investments. Guide students to make the mathematically optimal choice.
3. Tax-Advantaged Accounts First: TFSA/RRSP (Canada), Roth IRA/401k (USA) are wealth accelerators — prioritize them.

CORE RULES:
1. Personalize first. Ask 2–3 targeted questions about country, income, existing debt rates, and goals before advising.
2. Be direct and data-driven. Say "At 3% loan rate vs 5% HISA rate, you're losing $200/year by paying down debt instead of saving" — use numbers.
3. Give numbered action plans with specific dollar amounts and timelines.
4. Format: **bold** key terms, use tables for rate comparisons, numbered action plans.

KNOWLEDGE BASE:
Canada: TFSA ($7,000/yr, tax-free growth — priority #1 for students), RRSP (tax-deductible, employer match), FHSA (first-home, $8,000/yr), HISA rates (EQ Bank 4%+, Wealthsimple 4%+), OSAP (prime +1%), provincial grants, GST/HST credit.
USA: Roth IRA ($7,000/yr, tax-free growth — priority #1), 529 plans, I-Bonds (inflation-protected), FAFSA, federal loans (5-7%), PSLF, AOTC ($2,500/yr), state grants.
Arbitrage Examples: 
- Student loan at 4% vs HISA at 5% = SAVE, don't pay extra on loan
- Credit card at 20% vs any investment = PAY OFF immediately
- TFSA/Roth compound growth beats low-rate debt payoff long-term
Best Platforms: Wealthsimple, EQ Bank, Tangerine (CA); SoFi, Fidelity, Schwab, Betterment (USA); VTI/XEQT for index investing.`;

const PARTNERS = [
  { name: "University Partners", desc: "Financial aid offices nationwide" },
  { name: "Credit Unions", desc: "Student-focused banking partners" },
  { name: "EdTech Alliance", desc: "Financial literacy integration" },
];

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 2 — DESIGN TOKENS (Dark Mode Only)
// ─────────────────────────────────────────────────────────────────────────────

const T = {
  bg:      "#050505",
  glass:   "rgba(255,255,255,0.044)",
  glassHi: "rgba(255,255,255,0.085)",
  border:  "rgba(255,255,255,0.1)",
  gold:    "#C9A84C",
  goldHi:  "#E8C97A",
  goldDim: "#8B6914",
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
  blur:    "blur(20px)",
  cardBg:  "rgba(255,255,255,0.1)",
  cardBorder: "rgba(255,255,255,0.2)",
};

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 3 — MOTION VARIANTS
// ─────────────────────────────────────────────────────────────────────────────

const fadeUp  = { hidden:{opacity:0,y:16}, visible:{opacity:1,y:0,transition:{duration:0.36,ease:[0.22,1,0.36,1] as number[]}} };
const stagger = { visible:{transition:{staggerChildren:0.065}} };
const tapAnim = { tap:{scale:0.95} };

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 4 — HOOKS
// ─────────────────────────────────────────────────────────────────────────────

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

const HIST_KEY = "wf_hist_v3";
const SAVED_KEY = "wf_saved_v1";
type HistRec = { id: string; label: string; type: "scholarship"|"loan"; results: ScoutResult[]; ts: number };
function readHist(): HistRec[] { try { return JSON.parse(typeof window !== "undefined" ? localStorage.getItem(HIST_KEY) ?? "[]" : "[]"); } catch { return []; } }
function pushHist(r: HistRec) { try { const n = [r, ...readHist().filter(x => x.id !== r.id)].slice(0,10); localStorage.setItem(HIST_KEY, JSON.stringify(n)); } catch {} }

function readSaved(): ScoutResult[] { try { return JSON.parse(typeof window !== "undefined" ? localStorage.getItem(SAVED_KEY) ?? "[]" : "[]"); } catch { return []; } }
function writeSaved(items: ScoutResult[]) { try { localStorage.setItem(SAVED_KEY, JSON.stringify(items)); } catch {} }
function toggleSaved(item: ScoutResult): ScoutResult[] {
  const current = readSaved();
  const exists = current.some(x => x.id === item.id);
  const updated = exists ? current.filter(x => x.id !== item.id) : [...current, item];
  writeSaved(updated);
  return updated;
}

// Real-time search via Tavily API — falls back to mock data if API unavailable
async function fetchResults(type: "scholarship"|"loan", filters: Record<string,string>): Promise<ScoutResult[]> {
  try {
    const response = await fetch("/api/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, filters }),
    });
    const data = await response.json();
    if (data.results && data.results.length > 0) {
      return data.results;
    }
    // Fall back to mock data if no results
    return type === "scholarship" ? MOCK_SCHOLARSHIPS : MOCK_LOANS;
  } catch {
    // Fall back to mock data on error
    return type === "scholarship" ? MOCK_SCHOLARSHIPS : MOCK_LOANS;
  }
}

// ────────────────────────────────────────────────────────────────────────────��
// SECTION 5 — PRIMITIVE UI COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

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
  return <div style={{ width:w, height:h, borderRadius:7, backgroundImage: "linear-gradient(90deg,rgba(255,255,255,0.04) 25%,rgba(255,255,255,0.09) 50%,rgba(255,255,255,0.04) 75%)", backgroundSize:"200% 100%", animation:"wf-skel 1.6s ease infinite" }} />;
}

function Chip({ label, color }: { label: string; color?: string }) {
  
  const c = color ?? T.dim;
  return <span style={{ fontSize:9, fontWeight:700, letterSpacing:".07em", padding:"2px 7px", borderRadius:20, background:`${c}22`, border:`1px solid ${c}44`, color:c, whiteSpace:"nowrap" }}>{label}</span>;
}

function AffNote() {
  
  return <p style={{ fontSize:9, color:T.dimmer, textAlign:"center", marginTop:10, lineHeight:1.5 }}>{AFFIL_NOTE}</p>;
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
  // Gold "F" shield logo - rendered without background
  return (
    <img 
      src="/images/forge-logo.png" 
      alt="Forge" 
      width={size} 
      height={size} 
      style={{ 
        objectFit: "contain",
        filter: "drop-shadow(0 0 8px rgba(201,168,76,0.3))",
      }} 
    />
  );
}

// Gold CTA button — used for all affiliate links
function GoldCTA({ href, label }: { href: string; label: string }) {
  
  const safe = (href?.trim?.() ?? "").length > 0 ? href : "#";
  return (
    <motion.a href={safe} target="_blank" rel="noopener noreferrer" whileTap={tapAnim.tap}
      style={{ display:"block", textAlign:"center", padding:"10px 0", borderRadius:T.rsm, textDecoration:"none", fontFamily:"inherit", backgroundImage:`linear-gradient(135deg,${T.gold},${T.goldDim})`, color:"#07090d", fontSize:12, fontWeight:800, letterSpacing:".03em", boxShadow:`0 0 18px ${T.glow}`, transition:"box-shadow .2s" }}
      onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 0 32px rgba(201,168,76,0.5)")}
      onMouseLeave={e => (e.currentTarget.style.boxShadow = `0 0 18px ${T.glow}`)}>
      {label} →
    </motion.a>
  );
}

// Infinite-range Slider — accepts any value via input field
function Slider({ label, value, min, step = 1, onChange, fmt }: { label:string; value:number; min:number; step?:number; onChange:(v:number)=>void; fmt:(v:number)=>string }) {
  
  const [inputVal, setInputVal] = useState(fmt(value));
  const [editing, setEditing] = useState(false);
  
  // Dynamic max based on value for slider visualization - supports up to $10M+
  const dynamicMax = Math.max(value * 2, min * 100, 100000);
  const pct = Math.max(0, Math.min(100, ((value - min) / (dynamicMax - min)) * 100));
  
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
      onChange(parsed);
    } else {
      setInputVal(fmt(value));
    }
  };
  
  const handleInputFocus = () => {
    setEditing(true);
    setInputVal(value.toString());
  };
  
  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:7, alignItems:"center" }}>
        <span style={{ fontSize:11, color:T.mid }}>{label}</span>
        <input
          type="text"
          value={inputVal}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onKeyDown={e => e.key === "Enter" && e.currentTarget.blur()}
          style={{ fontSize:12, color:T.gold, fontWeight:600, background:"transparent", border:"none", textAlign:"right", width:100, outline:"none", fontFamily:"inherit" }}
        />
      </div>
      <div style={{ position:"relative", height:4, background:"rgba(255,255,255,0.08)", borderRadius:4 }}>
        <div style={{ position:"absolute", left:0, top:0, height:"100%", width:`${pct}%`, backgroundImage:`linear-gradient(90deg,${T.goldDim},${T.gold})`, borderRadius:4, transition:"width .15s" }} />
        <input type="range" min={min} max={dynamicMax} step={step} value={Math.min(value, dynamicMax)} onChange={e => onChange(Number(e.target.value))} style={{ position:"absolute", inset:0, width:"100%", opacity:0, cursor:"pointer", height:"100%", margin:0 }} />
      </div>
    </div>
  );
}

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
      <p style={{ fontFamily:"Inter,system-ui,sans-serif", fontSize:"clamp(14px,2vw,19px)", fontWeight:400, lineHeight:1.7, margin:0, backgroundImage:`linear-gradient(120deg,${T.text} 0%,${T.goldHi} 40%,${T.gold} 65%,${T.mid} 100%)`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", letterSpacing:"-.005em" }}>
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
            {mode === "signin" ? "Sign in to access your saved items" : "Join Forge for free"}
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
              backgroundImage: `linear-gradient(135deg, ${T.gold}, ${T.goldDim})`,
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
          {mode === "signin" ? "Don&apos;t have an account? " : "Already have an account? "}
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
// SECTION 5C — LOAN MARKETPLACE HERO (High Conversion)
// ─────────────────────────────────────────────────────────────────────────────

function LoanMarketplaceHero({ country }: { country: "Canada" | "USA" }) {
  const countryCode = country === "Canada" ? "CA" : "US";
  const offers = LOAN_MARKETPLACE.filter(o => o.country === countryCode);
  
  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" style={{ marginBottom: 24 }}>
      {/* Section Header */}
      <motion.div variants={fadeUp} style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <DollarSign size={18} color={T.gold} />
          <h2 style={{ fontSize: 16, fontWeight: 800, color: T.text, margin: 0, letterSpacing: "-0.02em" }}>Financial Matches</h2>
          <span style={{ fontSize: 10, background: T.gold, color: "#07090d", padding: "2px 8px", borderRadius: 10, fontWeight: 700 }}>PERSONALIZED</span>
        </div>
        <p style={{ fontSize: 12, color: T.mid, margin: 0 }}>Top loan offers matched to your profile. Pre-qualify without affecting your credit.</p>
      </motion.div>
      
      {/* Loan Cards Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12 }}>
        {offers.map((offer, i) => (
          <motion.a
            key={offer.id}
            variants={fadeUp}
            href={offer.href}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "block",
              padding: 16,
              borderRadius: T.r,
              background: i === 0 ? `linear-gradient(135deg, rgba(201,168,76,0.15), rgba(139,105,20,0.08))` : T.cardBg,
              border: `1px solid ${i === 0 ? "rgba(201,168,76,0.4)" : T.cardBorder}`,
              textDecoration: "none",
              transition: "all 0.25s ease",
              position: "relative",
              overflow: "hidden",
            }}
            whileHover={{ scale: 1.02, borderColor: T.gold }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Badge */}
            {offer.badge && (
              <span style={{
                position: "absolute",
                top: 12,
                right: 12,
                fontSize: 9,
                fontWeight: 800,
                background: i === 0 ? T.gold : T.glassHi,
                color: i === 0 ? "#07090d" : T.gold,
                padding: "3px 8px",
                borderRadius: 6,
                letterSpacing: "0.04em",
              }}>
                {offer.badge}
              </span>
            )}
            
            {/* Content */}
            <h3 style={{ fontSize: 14, fontWeight: 700, color: T.text, margin: "0 0 4px", paddingRight: offer.badge ? 60 : 0 }}>{offer.name}</h3>
            <p style={{ fontSize: 20, fontWeight: 800, color: T.gold, margin: "0 0 2px" }}>{offer.rate}</p>
            {offer.bonus && <p style={{ fontSize: 11, color: T.green, margin: "0 0 8px", fontWeight: 600 }}>{offer.bonus}</p>}
            <p style={{ fontSize: 11, color: T.mid, margin: "0 0 14px", lineHeight: 1.4 }}>{offer.highlight}</p>
            
            {/* CTA Button */}
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "10px 20px",
              borderRadius: 8,
              backgroundImage: `linear-gradient(135deg, ${T.gold}, ${T.goldDim})`,
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
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 5D — CREDIT HEALTH WIDGET
// ─────────────────────────────────────────────────────────────────────────────

function CreditHealthWidget() {
  const [score] = useState(680); // Mock credit score
  const scoreColor = score >= 750 ? T.green : score >= 650 ? T.gold : T.red;
  const scoreLabel = score >= 750 ? "Excellent" : score >= 650 ? "Good" : "Fair";
  const potentialSavings = score < 750 ? Math.round((750 - score) * 0.02 * 100) / 100 : 0;
  
  return (
    <motion.div variants={fadeUp} style={{
      padding: 16,
      borderRadius: T.r,
      background: T.cardBg,
      border: `1px solid ${T.cardBorder}`,
      marginBottom: 20,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <div style={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          background: `conic-gradient(${scoreColor} ${(score / 850) * 100}%, ${T.dim} 0%)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}>
          <div style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: T.bg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: scoreColor }}>{score}</span>
          </div>
        </div>
        <div>
          <p style={{ fontSize: 13, fontWeight: 700, color: T.text, margin: 0 }}>Credit Health</p>
          <p style={{ fontSize: 11, color: scoreColor, margin: 0, fontWeight: 600 }}>{scoreLabel}</p>
        </div>
      </div>
      
      {potentialSavings > 0 && (
        <p style={{ fontSize: 11, color: T.mid, margin: 0, lineHeight: 1.5 }}>
          <span style={{ color: T.gold, fontWeight: 600 }}>Tip:</span> Improve your score by {750 - score} points to unlock <span style={{ color: T.green, fontWeight: 600 }}>{potentialSavings}% lower interest rates</span> on loans.
        </p>
      )}
      
      <motion.button
        whileTap={{ scale: 0.97 }}
        style={{
          marginTop: 12,
          width: "100%",
          padding: "8px 12px",
          borderRadius: 8,
          border: `1px solid ${T.border}`,
          background: T.glass,
          color: T.mid,
          fontSize: 11,
          fontWeight: 600,
          cursor: "pointer",
          fontFamily: "inherit",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
        }}
      >
        <TrendingUp size={12} /> Build My Credit
      </motion.button>
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
        <h3 style={{ fontSize: 13, fontWeight: 700, color: T.text, margin: 0 }}>Top Picks for You</h3>
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
            whileHover={{ borderColor: T.gold, background: T.glassHi }}
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

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 6 — FINANCIAL TOOLS
// ─────────────────────────────────────────────────────────────────────────────

// ── Budget Tool ───────────────────────────────────────────────────────────────
function BudgetTool() {
  
  const [income, setIncome] = useState(2000);
  const [needs,  setNeeds]  = useState(50);
  const [wants,  setWants]  = useState(30);
  const savings = 100 - needs - wants;
  const cats = [
    { label:"Needs",   pct:needs,               color:"#22c55e", amt:income*needs/100 },
    { label:"Wants",   pct:wants,               color:"#f59e0b", amt:income*wants/100 },
    { label:"Savings", pct:Math.max(0,savings),  color:T.gold,    amt:income*Math.max(0,savings)/100 },
  ];
  return (
    <motion.div variants={fadeUp} initial="hidden" animate="visible" style={{ display:"flex", flexDirection:"column", gap:16 }}>
      <Slider label="Monthly Income" value={income} min={100} step={50} onChange={setIncome} fmt={v=>"$"+v.toLocaleString()} />
      <Slider label="Needs %"        value={needs}  min={0}  step={1}  onChange={setNeeds}  fmt={v=>v+"%"} />
      <Slider label="Wants %"        value={wants}  min={0}  step={1}  onChange={setWants}  fmt={v=>v+"%"} />
      <div style={{ display:"flex", height:10, borderRadius:5, overflow:"hidden", gap:2 }}>
        {cats.map(c => <div key={c.label} style={{ flex:c.pct, background:c.color, transition:"flex .3s", minWidth:0 }} />)}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:9 }}>
        {cats.map(c => (
          <Glass key={c.label} style={{ padding:"11px 7px", textAlign:"center" }}>
            <p style={{ fontSize:9, color:c.color, margin:"0 0 4px", fontWeight:700, letterSpacing:".07em" }}>{c.label.toUpperCase()}</p>
            <p style={{ fontSize:15, fontWeight:700, color:T.text, margin:"0 0 2px" }}>${Math.round(c.amt).toLocaleString()}</p>
            <p style={{ fontSize:10, color:T.dim, margin:0 }}>{c.pct}%</p>
          </Glass>
        ))}
      </div>
      {savings < 0  && <div style={{ fontSize:12, color:T.red, background:"rgba(248,113,113,0.1)", border:"1px solid rgba(248,113,113,0.25)", borderRadius:8, padding:"8px 12px" }}>Needs + Wants exceed 100%</div>}
      {savings >= 20 && <div style={{ fontSize:12, color:"#b8952a", background:"rgba(201,168,76,0.08)", border:"1px solid rgba(201,168,76,0.2)", borderRadius:8, padding:"8px 12px" }}>Saving {savings}% — excellent! 20%+ recommended.</div>}
    </motion.div>
  );
}

// ── Savings Tool ──────────────────────────────────────────────────────────────
function SavingsTool() {
  
  const [goal,    setGoal]    = useState(5000);
  const [saved,   setSaved]   = useState(800);
  const [monthly, setMonthly] = useState(200);
  const [rate,    setRate]    = useState(4);
  const remaining = Math.max(0, goal - saved);
  const pct       = goal > 0 ? Math.min(100, (saved / goal) * 100) : 0;
  const r = rate / 100 / 12;
  let months = 0;
  if (remaining > 0 && monthly > 0) {
    if (r > 0 && monthly > remaining * r) months = Math.ceil(Math.log(1 + remaining*r/monthly) / Math.log(1+r));
    else if (r <= 0) months = Math.ceil(remaining / monthly);
    else months = 999;
  }
  let interest = 0;
  if (r > 0) { let b = remaining; for (let i = 0; i < months && b > 0.01; i++) { interest += b*r; b = b+b*r-monthly; } }
  const yrs = Math.floor(months/12), mos = months%12;
  const timeStr = months <= 0 ? "Goal reached!" : months >= 999 ? "Increase contribution" : yrs > 0 ? `${yrs}y ${mos}m` : `${mos} months`;
  const C = 2 * Math.PI * 32;
  return (
    <motion.div variants={fadeUp} initial="hidden" animate="visible" style={{ display:"flex", flexDirection:"column", gap:16 }}>
      <Slider label="Goal Amount"          value={goal}    min={100}  step={100} onChange={setGoal}    fmt={v=>"$"+v.toLocaleString()} />
      <Slider label="Already Saved"        value={saved}   min={0}    step={50}  onChange={v=>setSaved(Math.min(v,goal))} fmt={v=>"$"+v.toLocaleString()} />
      <Slider label="Monthly Contribution" value={monthly} min={10}   step={10}  onChange={setMonthly} fmt={v=>"$"+v.toLocaleString()} />
      <Slider label="Interest Rate (APY)"  value={rate}    min={0}    step={0.25} onChange={setRate}   fmt={v=>v+"%"} />
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
}

// ── Loan Calculator ───────────────────────────────────────────────────────────
function LoanCalculator() {
  
  const [principal, setPrincipal] = useState(25000);
  const [rate,  setRate]  = useState(5.5);
  const [years, setYears] = useState(10);
  const [extra, setExtra] = useState(0);
  const r = rate/100/12, n = years*12;
  const base = r > 0 ? principal*r*Math.pow(1+r,n)/(Math.pow(1+r,n)-1) : principal/Math.max(n,1);
  const totalBase = base*n, totalInt = totalBase-principal;
  let bal=principal, mo=0, intEx=0;
  while(bal>0.01 && mo<1200){const i=bal*r;intEx+=i;bal=Math.max(0,bal+i-base-extra);mo++;}
  const savedInt=totalInt-intEx, savedMo=n-mo;
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      <Slider label="Loan Amount"   value={principal} min={500}   step={500}  onChange={setPrincipal} fmt={v=>"$"+v.toLocaleString()} />
      <Slider label="Interest Rate" value={rate}      min={0.5}   step={0.25} onChange={setRate}      fmt={v=>v+"%"} />
      <Slider label="Term (Years)"  value={years}     min={1}     step={1}    onChange={setYears}     fmt={v=>v+" yrs"} />
      <Slider label="Extra Monthly" value={extra}     min={0}     step={10}   onChange={setExtra}     fmt={v=>"$"+v} />
      <Glass style={{ padding:16 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:10 }}>
          <span style={{ fontSize:10, color:T.dim, letterSpacing:".07em" }}>MONTHLY PAYMENT</span>
          <span style={{ fontSize:26, fontWeight:800, color:T.goldHi }}>${Math.round(base).toLocaleString()}</span>
        </div>
        {[["Total paid","$"+Math.round(totalBase).toLocaleString()],["Total interest","$"+Math.round(totalInt).toLocaleString()]].map(([l,v]) => (
          <div key={l} style={{ display:"flex", justifyContent:"space-between", padding:"5px 0", borderTop:`1px solid ${T.border}` }}>
            <span style={{ fontSize:12, color:T.mid }}>{l}</span>
            <span style={{ fontSize:13, color:T.mid }}>{v}</span>
          </div>
        ))}
      </Glass>
      {extra > 0 && (
        <Glass style={{ padding:14, border:"1px solid rgba(74,222,128,0.2)" }}>
          <p style={{ fontSize:10, color:T.green, margin:"0 0 8px", letterSpacing:".07em" }}>WITH EXTRA ${extra}/MO</p>
          {[["Interest saved","$"+Math.round(savedInt).toLocaleString(),true],["Months sooner",savedMo>0?savedMo+" months":"—"],["New payoff",`${Math.floor(mo/12)}y ${mo%12}m`]].map(([l,v,acc]) => (
            <div key={l as string} style={{ display:"flex", justifyContent:"space-between", padding:"5px 0", borderTop:"1px solid rgba(74,222,128,0.1)" }}>
              <span style={{ fontSize:12, color:T.mid }}>{l}</span>
              <span style={{ fontSize:13, color:acc?T.green:T.mid, fontWeight:acc?700:400 }}>{v as string}</span>
            </div>
          ))}
        </Glass>
      )}
    </div>
  );
}

// ── Loan Finder ────────────────�����──────────────────────────────────────────────
type Phase = "idle"|"scanning"|"results";
const SCAN_MSGS = ["Connecting to loan databases...","Scanning live lender rates...","Cross-referencing eligibility...","Compiling best rates for you..."];

function LoanFinder({ onToggleSave, savedIds }: { onToggleSave: (item: ScoutResult) => void; savedIds: Set<string> }) {
  
  const [loanType, setLoanType] = useState<LoanType>("Student");
  const [amount,   setAmount]   = useState("");
  const [phase,    setPhase]    = useState<Phase>("idle");
  const [results,  setResults]  = useState<ScoutResult[]>([]);
  const [scanIdx,  setScanIdx]  = useState(0);
  const [hist,     setHist]     = useState<HistRec[]>([]);
  useEffect(() => { setHist(readHist().filter(h => h.type==="loan")); }, []);
  useEffect(() => {
    if (phase !== "scanning") return;
    setScanIdx(0);
    const iv = setInterval(() => setScanIdx(p => Math.min(p+1, SCAN_MSGS.length-1)), 520);
    return () => clearInterval(iv);
  }, [phase]);
  const handleSearch = async () => {
    setPhase("scanning");
    try {
      const data = await fetchResults("loan", { loanType, amount: amount?.trim() ?? "" });
      const final = (data?.length ?? 0) > 0 ? data : MOCK_LOANS;
      setResults(final);
      const rec: HistRec = { id:String(Date.now()), label:`${loanType}${amount?.trim() ? " — "+amount.trim() : ""}`, type:"loan", results:final, ts:Date.now() };
      pushHist(rec);
      setHist(readHist().filter(h => h.type==="loan"));
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
      <input value={amount} onChange={e => setAmount(e.target.value ?? "")} onKeyDown={e => e.key==="Enter" && handleSearch()}
        placeholder="Amount needed (e.g. $20,000)"
        style={{ padding:"10px 13px", background:T.glassHi, border:`1px solid ${T.border}`, borderRadius:T.rsm, color:T.text, fontSize:13, outline:"none", fontFamily:"inherit" }} />
      <motion.button whileTap={tapAnim.tap} onClick={handleSearch} disabled={phase==="scanning"}
        style={{ padding:"11px 0", borderRadius:T.rsm, border:"none", cursor:"pointer", backgroundImage:`linear-gradient(135deg,${T.gold},${T.goldDim})`, color:"#07090d", fontSize:13, fontWeight:800, fontFamily:"inherit", opacity:phase==="scanning"?.65:1, boxShadow:`0 0 18px ${T.glow}` }}>
        {phase==="scanning" ? "Scanning lenders..." : "Find Best Rates"}
      </motion.button>
      <AnimatePresence>
        {phase==="scanning" && (
          <motion.div key="ls" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
            <Glass style={{ padding:16, display:"flex", flexDirection:"column", gap:9 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <span style={{ width:7, height:7, borderRadius:"50%", background:T.gold, display:"inline-block", animation:"wf-pulse 1s infinite" }} />
                <span style={{ fontSize:12, color:T.gold }}>{SCAN_MSGS[scanIdx] ?? SCAN_MSGS[0]}</span>
              </div>
              <Skel h={12} w="90%" /><Skel h={12} w="75%" /><Skel h={12} w="85%" />
            </Glass>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {phase==="results" && results.length>0 && (
          <motion.div key="lr" variants={stagger} initial="hidden" animate="visible" style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {results.map(r => (
              <motion.div key={r.id} variants={fadeUp}>
                <Glass glow style={{ padding:14 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:7, gap:10 }}>
                    <div><p style={{ fontSize:13, fontWeight:700, color:T.text, margin:"0 0 2px" }}>{r.title}</p><p style={{ fontSize:11, color:T.mid, margin:0 }}>{r.provider}</p></div>
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
      {hist.length > 0 && (
        <div>
          <p style={{ fontSize:10, color:T.dim, letterSpacing:".08em", margin:"4px 2px 8px" }}>RECENT SEARCHES</p>
          {hist.slice(0,3).map(h => (
            <Glass key={h.id} style={{ padding:"9px 12px", marginBottom:6, cursor:"pointer" }} onClick={() => { setResults(h.results ?? []); setPhase("results"); }}>
              <div style={{ display:"flex", justifyContent:"space-between" }}>
                <span style={{ fontSize:12, color:T.text }}>{h.label}</span>
                <span style={{ fontSize:10, color:T.dim }}>{new Date(h.ts).toLocaleDateString()}</span>
              </div>
            </Glass>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Loan Tool (tabs) ──────────────────────────────────────────────────────────
function LoanTool({ onToggleSave, savedIds }: { onToggleSave: (item: ScoutResult) => void; savedIds: Set<string> }) {
  
  const [tab, setTab] = useState<"calc"|"finder">("calc");
  return (
    <motion.div variants={fadeUp} initial="hidden" animate="visible" style={{ display:"flex", flexDirection:"column", gap:0 }}>
      <div style={{ display:"flex", gap:4, background:T.glass, borderRadius:T.rsm, padding:3, marginBottom:16 }}>
        {([["calc","Calculator"],["finder","Loan Finder"]] as const).map(([id,lbl]) => (
          <motion.button key={id} whileTap={tapAnim.tap} onClick={() => setTab(id)}
            style={{ flex:1, padding:"8px 0", borderRadius:7, border:"none", cursor:"pointer", fontFamily:"inherit", fontSize:12, fontWeight:600, background:tab===id?"rgba(201,168,76,0.18)":"transparent", color:tab===id?T.gold:T.mid }}>
            {lbl}
          </motion.button>
        ))}
      </div>
      {tab==="calc" ? <LoanCalculator /> : <LoanFinder onToggleSave={onToggleSave} savedIds={savedIds} />}
    </motion.div>
  );
}

// ── Scholarship Scout ─────────────────────────────────────────────────────────
const SCH_SCAN_MSGS = ["Connecting to scholarship databases...","Scanning national award portals...","Cross-referencing eligibility...","Aggregating live results for you..."];

function ScholarshipScout({ onToggleSave, savedIds }: { onToggleSave: (item: ScoutResult) => void; savedIds: Set<string> }) {
  
  const [query,   setQuery]   = useState("");
  const [major,   setMajor]   = useState<string>(SCHOLARSHIP_MAJORS[0] as string);
  const [country, setCountry] = useState<string>(SCHOLARSHIP_COUNTRIES[0] as string);
  const [year,    setYear]    = useState<string>(SCHOLARSHIP_YEARS[0] as string);
  const [phase,   setPhase]   = useState<Phase>("idle");
  const [results, setResults] = useState<ScoutResult[]>([]);
  const [scanIdx, setScanIdx] = useState(0);
  const [hist,    setHist]    = useState<HistRec[]>([]);
  useEffect(() => { setHist(readHist().filter(h => h.type==="scholarship")); }, []);
  useEffect(() => {
    if (phase !== "scanning") return;
    setScanIdx(0);
    const iv = setInterval(() => setScanIdx(p => Math.min(p+1, SCH_SCAN_MSGS.length-1)), 530);
    return () => clearInterval(iv);
  }, [phase]);
  const handleSearch = async () => {
    setPhase("scanning");
    try {
      const data = await fetchResults("scholarship", { major, country, year, query: query?.trim() ?? "" });
      const final = (data?.length ?? 0) > 0 ? data : MOCK_SCHOLARSHIPS;
      setResults(final);
      const rec: HistRec = { id:String(Date.now()), label:query?.trim() || major, type:"scholarship", results:final, ts:Date.now() };
      pushHist(rec);
      setHist(readHist().filter(h => h.type==="scholarship"));
    } catch { setResults(MOCK_SCHOLARSHIPS); }
    setPhase("results");
  };
  return (
    <motion.div variants={fadeUp} initial="hidden" animate="visible" style={{ display:"flex", flexDirection:"column", gap:14 }}>
      <Glass glow style={{ padding:18, display:"flex", flexDirection:"column", gap:11 }}>
        <p style={{ fontSize:10, color:T.mid, margin:0, letterSpacing:".08em" }}>AI SCHOLARSHIP SCOUT</p>
        <input value={query} onChange={e => setQuery(e.target.value ?? "")} onKeyDown={e => e.key==="Enter" && handleSearch()}
          placeholder='e.g. "first-gen student, Ontario, 3.5 GPA"'
          style={{ width:"100%", padding:"10px 13px", background:T.glassHi, border:`1px solid ${T.border}`, borderRadius:T.rsm, color:T.text, fontSize:13, outline:"none", fontFamily:"inherit", boxSizing:"border-box" }} />
        <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr", gap:8 }}>
          {[{val:major,set:setMajor,opts:SCHOLARSHIP_MAJORS},{val:year,set:setYear,opts:SCHOLARSHIP_YEARS},{val:country,set:setCountry,opts:SCHOLARSHIP_COUNTRIES}].map(({val,set,opts},i) => (
            <select key={i} value={val} onChange={e => set(e.target.value ?? "")} style={{ padding:"8px 9px", background:T.glass, border:`1px solid ${T.border}`, borderRadius:T.rsm, color:T.text, fontSize:11, fontFamily:"inherit", outline:"none" }}>
              {(opts as readonly string[]).map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          ))}
        </div>
        <motion.button whileTap={tapAnim.tap} onClick={handleSearch} disabled={phase==="scanning"}
          style={{ padding:"11px 0", borderRadius:T.rsm, border:"none", cursor:"pointer", backgroundImage:`linear-gradient(135deg,${T.gold},${T.goldDim})`, color:"#07090d", fontSize:13, fontWeight:800, fontFamily:"inherit", opacity:phase==="scanning"?.65:1, boxShadow:`0 0 18px ${T.glow}` }}>
          {phase==="scanning" ? "Scanning databases..." : "Find Scholarships"}
        </motion.button>
      </Glass>
      <AnimatePresence>
        {phase==="scanning" && (
          <motion.div key="ss" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
            <Glass style={{ padding:16, display:"flex", flexDirection:"column", gap:9 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <span style={{ width:7, height:7, borderRadius:"50%", background:T.gold, display:"inline-block", animation:"wf-pulse 1s infinite" }} />
                <span style={{ fontSize:12, color:T.gold }}>{SCH_SCAN_MSGS[scanIdx] ?? SCH_SCAN_MSGS[0]}</span>
              </div>
              <Skel h={12} w="90%" /><Skel h={12} w="75%" /><Skel h={12} w="85%" />
            </Glass>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {phase==="results" && results.length>0 && (
          <motion.div key="sr" variants={stagger} initial="hidden" animate="visible" style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {results.map(r => (
              <motion.div key={r.id} variants={fadeUp}>
                <Glass glow style={{ padding:14 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:7, gap:10 }}>
                    <div><p style={{ fontSize:13, fontWeight:700, color:T.text, margin:"0 0 2px" }}>{r.title}</p><p style={{ fontSize:11, color:T.mid, margin:0 }}>{r.provider}</p></div>
                    <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                      <Chip label={r.amount} color={T.gold} />
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onToggleSave(r)}
                        style={{ background:"none", border:"none", cursor:"pointer", padding:2, color:savedIds.has(r.id) ? "#f59e0b" : T.mid }}
                      >
                        <Bookmark size={16} fill={savedIds.has(r.id) ? "#f59e0b" : "none"} />
                      </motion.button>
                    </div>
                  </div>
                  <p style={{ fontSize:11, color:T.mid, margin:"0 0 4px", lineHeight:1.4 }}>{r.eligibility}</p>
                  <p style={{ fontSize:10, color:T.dim, margin:"0 0 10px" }}>Deadline: {r.deadline}</p>
                  <GoldCTA href={r.url} label="Apply Now" />
                </Glass>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      {hist.length > 0 && (
        <div>
          <p style={{ fontSize:10, color:T.dim, letterSpacing:".08em", margin:"4px 2px 8px" }}>RECENT SEARCHES</p>
          {hist.slice(0,3).map(h => (
            <Glass key={h.id} style={{ padding:"9px 12px", marginBottom:6, cursor:"pointer" }} onClick={() => { setResults(h.results ?? []); setPhase("results"); }}>
              <div style={{ display:"flex", justifyContent:"space-between" }}>
                <span style={{ fontSize:12, color:T.text }}>{h.label}</span>
                <span style={{ fontSize:10, color:T.dim }}>{new Date(h.ts).toLocaleDateString()}</span>
              </div>
            </Glass>
          ))}
        </div>
      )}
    </motion.div>
  );
}

// ── Saved Items (My Vault) ────────────────────────────────────────────────────
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
        <motion.div key={r.id} variants={fadeUp}>
          <Glass glow style={{ padding: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 7, gap: 10 }}>
              <div>
                <Chip label={r.type === "scholarship" ? "Scholarship" : "Loan"} color={r.type === "scholarship" ? T.gold : T.green} />
                <p style={{ fontSize: 13, fontWeight: 700, color: T.text, margin: "6px 0 2px" }}>{r.title}</p>
                <p style={{ fontSize: 11, color: T.mid, margin: 0 }}>{r.provider}</p>
              </div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => onRemove(r)}
                style={{ background: "none", border: "none", cursor: "pointer", padding: 2, color: T.gold }}
              >
                <Bookmark size={16} fill={T.gold} />
              </motion.button>
            </div>
            <p style={{ fontSize: 12, color: T.goldHi, fontWeight: 600, margin: "0 0 10px" }}>{r.amount}</p>
            <GoldCTA href={r.url} label={r.type === "scholarship" ? "Apply Now" : "Check Rate"} />
          </Glass>
        </motion.div>
      ))}
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────��───────────────────
// SECTION 7 — MARKETPLACE
// ─────────────────��───────────────────────────────────────────────────────────

function Marketplace({ country }: { country: string }) {
  
  const flag = country === "Canada" ? "CA" : country === "USA" ? "US" : null;
  const list = flag ? AFFILIATE_PRODUCTS.filter(p => p.country === flag) : AFFILIATE_PRODUCTS;
  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" style={{ display:"flex", flexDirection:"column", gap:8 }}>
      <p style={{ fontSize:9, color:T.dimmer, letterSpacing:".1em", margin:"2px 2px 6px" }}>RECOMMENDED ACCOUNTS</p>
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
      <AffNote />
    </motion.div>
  );
}

// ─────���───────────────────────────────────────────────────────────────────────
// SECTION 8 — INLINE CHAT
// ────────────────────────────────────────────────────────��────────────────────

function Dots() {
  
  return (
    <div style={{ display:"flex", gap:4, alignItems:"center", padding:"6px 0" }}>
      {[0,1,2].map(i => <span key={i} style={{ width:5, height:5, borderRadius:"50%", background:T.gold, animation:`wf-bounce .8s ${i*0.15}s infinite` }} />)}
    </div>
  );
}

function InlineChat({ country }: { country: string }) {
  
  const [msgs, setMsgs] = useState<{role:"user"|"assistant";content:string}[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:"smooth" }); }, [msgs, loading]);

  const submitForm = async (e: FormEvent) => {
    e.preventDefault();
    const txt = input?.trim() ?? "";
    if (!txt || loading) return;
    setMsgs(p => [...p, { role:"user", content:txt }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...msgs, { role:"user", content:txt }],
          system: SYSTEM_PROMPT,
          country: country || null,
        }),
      });
      if (!res.ok || !res.body) throw new Error("Network error");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";

      setMsgs(p => [...p, { role:"assistant", content:"" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n").filter(l => l.startsWith("data: "));
        for (const line of lines) {
          const json = line.slice(6);
          if (json === "[DONE]") continue;
          try {
            const parsed = JSON.parse(json);
            const delta = parsed?.delta?.text ?? parsed?.choices?.[0]?.delta?.content ?? "";
            if (delta) {
              acc += delta;
              setMsgs(p => {
                const copy = [...p];
                copy[copy.length - 1] = { role:"assistant", content:acc };
                return copy;
              });
            }
          } catch {}
        }
      }
      if (!acc) {
        setMsgs(p => {
          const copy = [...p];
          copy[copy.length - 1] = { role:"assistant", content:"I'm here to help! Ask me anything about budgeting, scholarships, or student finances." };
          return copy;
        });
      }
    } catch {
      setMsgs(p => [...p, { role:"assistant", content:"Couldn't reach the AI. Please try again." }]);
    }
    setLoading(false);
    inputRef.current?.focus();
  };

  const countryVal = (country === "Canada" || country === "USA") ? country : "USA";
  
  return (
    <>
      <div style={{ flex:1, overflowY:"auto", display:"flex", flexDirection:"column" }}>
        {/* Hero Section - Loan Marketplace (Always visible at top) */}
        {msgs.length === 0 && (
          <div style={{ padding: "20px 20px 0", maxWidth: 900, margin: "0 auto", width: "100%" }}>
            <LoanMarketplaceHero country={countryVal} />
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <div style={{ flex: "1 1 400px", minWidth: 280 }}>
                <TopPicksSection country={countryVal} />
              </div>
              <div style={{ flex: "0 0 280px" }}>
                <CreditHealthWidget />
              </div>
            </div>
          </div>
        )}
        
        {msgs.length === 0 && <TypewriterGreeting />}
        <div style={{ flex:1, padding:"10px 20px", display:"flex", flexDirection:"column", gap:14, maxWidth:720, margin:"0 auto", width:"100%" }}>
          {msgs.map((m,i) => (
            <motion.div key={i} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} style={{ display:"flex", justifyContent:m.role==="user"?"flex-end":"flex-start", alignItems:"flex-start" }}>
              {m.role==="assistant" && (
                <div style={{ width:24, height:24, borderRadius:6, backgroundImage:`linear-gradient(135deg,${T.gold},${T.goldDim})`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginRight:8, marginTop:2 }}>
                  <LogoMark size={14} />
                </div>
              )}
              <div style={{ maxWidth:"78%", padding:"10px 14px", borderRadius:m.role==="user"?"14px 14px 4px 14px":"4px 14px 14px 14px", background:m.role==="user"?"rgba(201,168,76,0.1)":T.cardBg, border:`1px solid ${m.role==="user"?"rgba(201,168,76,0.18)":T.cardBorder}`, backdropFilter:T.blur, fontSize:14, lineHeight:1.7, color:m.role==="user"?"#d4c080":"#c0b8a8" }}>
                {m.role==="assistant" ? (
                  <>{<MsgText text={m.content ?? ""} />}{loading && i===msgs.length-1 && <span style={{ display:"inline-block", width:2, height:13, background:T.gold, marginLeft:2, verticalAlign:"middle", animation:"wf-cur .65s steps(1) infinite" }} />}</>
                ) : (m.content ?? "")}
              </div>
            </motion.div>
          ))}
          {loading && msgs[msgs.length-1]?.role !== "assistant" && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} style={{ display:"flex", alignItems:"flex-start" }}>
              <div style={{ width:24, height:24, borderRadius:6, backgroundImage:`linear-gradient(135deg,${T.gold},${T.goldDim})`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginRight:8 }}><LogoMark size={14} /></div>
              <div style={{ padding:"10px 14px", background:T.cardBg, border:`1px solid ${T.cardBorder}`, borderRadius:"4px 14px 14px 14px", backdropFilter:T.blur }}><Dots /></div>
            </motion.div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>
      <div style={{ padding:"10px 20px 10px", flexShrink:0 }}>
        <form onSubmit={submitForm} style={{ maxWidth:680, margin:"0 auto" }}>
          <Glass style={{ display:"flex", gap:9, alignItems:"flex-end", padding:"10px 12px" }}>
            <textarea ref={inputRef} value={input ?? ""} onChange={e => setInput(e.target.value ?? "")}
              onKeyDown={e => { if (e.key==="Enter" && !e.shiftKey) { e.preventDefault(); if ((input?.trim() ?? "").length > 0) e.currentTarget.form?.requestSubmit(); } }}
              placeholder="Tell me your situation — I'll tell you exactly what to do..."
              rows={1}
              style={{ flex:1, background:"transparent", border:"none", outline:"none", color:T.text, fontSize:14, lineHeight:1.6, maxHeight:90, overflowY:"auto", padding:0, resize:"none" }} />
            <motion.button type="submit" whileTap={tapAnim.tap} disabled={!(input?.trim()) || loading}
              style={{ width:33, height:33, borderRadius:8, border:"none", cursor:(input?.trim() && !loading)?"pointer":"not-allowed", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", transition:"all .2s", background:(input?.trim() && !loading)?undefined:T.glassHi, backgroundImage:(input?.trim() && !loading)?`linear-gradient(135deg,${T.gold},${T.goldDim})`:undefined, color:(input?.trim() && !loading)? ("#07090d") :T.dim }}>
              <Send size={15} />
            </motion.button>
          </Glass>
        </form>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 9 — MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────

type ToolId = "budget"|"savings"|"loan"|"scholar"|"saved";
const NAV_TOOLS: { id: ToolId; label: string; Icon: React.FC<{size?:number}> }[] = [
  { id:"budget",  label:"Budget",       Icon: ({size=15}) => <BarChart2  size={size} /> },
  { id:"savings", label:"Savings",      Icon: ({size=15}) => <PiggyBank  size={size} /> },
  { id:"loan",    label:"Loan Tools",   Icon: ({size=15}) => <DollarSign size={size} /> },
  { id:"scholar", label:"Scholarships", Icon: ({size=15}) => <BookOpen   size={size} /> },
  { id:"saved",   label:"My Saved",     Icon: ({size=15}) => <Bookmark   size={size} /> },
];

export default function ForgePage() {
  const [activeTool, setActiveTool] = useState<ToolId|"">("");
  const [panelView,  setPanelView]  = useState<"chat"|"tool">("chat");
  const [country,    setCountry]    = useState<string>("");
  const [sideTab,    setSideTab]    = useState<"tools"|"market">("tools");
  const [copied,     setCopied]     = useState<boolean>(false);
  const [chatKey,    setChatKey]    = useState<number>(0);
  const [showAuth,   setShowAuth]   = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [savedItems, setSavedItems] = useState<ScoutResult[]>([]);
  const savedIds = useMemo(() => new Set(savedItems.map(x => x.id)), [savedItems]);

useEffect(() => {
  setSavedItems(readSaved());
  
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
      
      // Listen for auth changes
      const { data: { subscription: sub } } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
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
  
  const handleToggleSave = useCallback((item: ScoutResult) => {
    const updated = toggleSaved(item);
    setSavedItems(updated);
  }, []);

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
  background: active ? "rgba(201,168,76,0.12)" : "transparent",
  color: active ? T.gold : T.mid,
  transition:"all .2s",
  });

  return (
    <>
      <div style={{ height:"100vh", display:"flex", flexDirection:"column", background:T.bg, color:T.text, fontFamily:"Inter,system-ui,-apple-system,sans-serif", overflow:"hidden", transition:"background .3s, color .3s" }}>
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
        `}</style>

{/* Auth Modal */}
        <AnimatePresence>
          {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
        </AnimatePresence>

        {/* ═══ HEADER ══════════════════════════════════════════════════════════ */}
        <header style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 20px", borderBottom:`1px solid ${T.border}`, flexShrink:0, zIndex:10, background:"rgba(5,5,5,0.97)", backdropFilter:"blur(22px)", WebkitBackdropFilter:"blur(22px)" }}>
<div style={{ display:"flex", alignItems:"center", gap:12 }}>
  <LogoMark size={38} />
  <div>
  <div style={{ fontSize:24, fontWeight:900, letterSpacing:"-.03em", backgroundImage:`linear-gradient(90deg,${T.goldHi},${T.gold},${T.goldDim},${T.goldHi})`, backgroundSize:"200%", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", animation:"wf-shimmer 5s linear infinite", textTransform:"uppercase" }}>Forge</div>
              <div style={{ fontSize:10, color:T.mid, letterSpacing:".02em", maxWidth:380, lineHeight:1.4, fontFamily:"Inter,system-ui,sans-serif" }}>{TAGLINE}</div>
            </div>
          </div>
  <div style={{ display:"flex", gap:6, alignItems:"center" }}>
  {[["CA","Canada"],["US","USA"]].map(([f,k]) => (
              <motion.button key={k} whileTap={tapAnim.tap} onClick={() => setCountry(country===k?"":k)} style={hBtn(country===k)}>
                <span style={{ marginRight: 4 }}>{f === "CA" ? "🇨🇦" : "🇺🇸"}</span> {k}
              </motion.button>
            ))}
            {panelView==="chat" && (
              <motion.button whileTap={tapAnim.tap} onClick={clearChat}
                style={{ ...hBtn(), display:"flex", alignItems:"center", gap:4 }}
                onMouseEnter={e => {(e.currentTarget as HTMLElement).style.color=T.red;(e.currentTarget as HTMLElement).style.borderColor="rgba(248,113,113,.35)";}}
                onMouseLeave={e => {(e.currentTarget as HTMLElement).style.color=T.mid;(e.currentTarget as HTMLElement).style.borderColor=T.border;}}>
                <Trash2 size={12} /> Clear
              </motion.button>
            )}
          </div>
        </header>

        {/* ═══ BODY ════════════════════════════════════════════════════════════ */}
        <div style={{ flex:1, display:"flex", overflow:"hidden" }}>

          {/* ── Main panel ─────────────────────────────���────────────────────── */}
          <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>

            {/* Tool view */}
            {panelView==="tool" && activeTool && (
              <motion.div key={activeTool} initial={{opacity:0,x:12}} animate={{opacity:1,x:0}} transition={{duration:.26}}
                style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
                <div style={{ padding:"12px 20px", borderBottom:`1px solid ${T.border}`, display:"flex", alignItems:"center", gap:10, flexShrink:0 }}>
                  <motion.button whileTap={tapAnim.tap} onClick={() => setPanelView("chat")} style={{ background:"none", border:"none", color:T.mid, cursor:"pointer", padding:4, display:"flex", alignItems:"center", borderRadius:6 }}>
                    <ChevronLeft size={18} />
                  </motion.button>
                  <span style={{ fontSize:13, fontWeight:700, color:T.gold }}>{currentTool?.label ?? ""}</span>
                </div>
                <div style={{ flex:1, overflowY:"auto", padding:20 }}>
                  {activeTool==="budget"  && <BudgetTool />}
                  {activeTool==="savings" && <SavingsTool />}
                  {activeTool==="loan"    && <LoanTool onToggleSave={handleToggleSave} savedIds={savedIds} />}
                  {activeTool==="scholar" && <ScholarshipScout onToggleSave={handleToggleSave} savedIds={savedIds} />}
                  {activeTool==="saved"   && <SavedItems saved={savedItems} onRemove={handleToggleSave} />}
                </div>
              </motion.div>
            )}

            {/* Chat view */}
            {panelView==="chat" && (
              <>
                <InlineChat key={chatKey} country={country} />
                <footer style={{ padding:"10px 20px 14px", flexShrink:0, borderTop:`1px solid ${T.border}`, background:"rgba(5,5,5,0.6)" }}>
                  <p style={{ fontSize:9, color:T.dimmer, lineHeight:1.55, margin:0, maxWidth:680, marginInline:"auto", textAlign:"center" }}>{FOOTER_TEXT}</p>
                  {/* Partnerships section */}
                  <div style={{ display:"flex", justifyContent:"center", gap:20, marginTop:12, flexWrap:"wrap" }}>
                    {PARTNERS.map(p => (
                      <div key={p.name} style={{ textAlign:"center" }}>
                        <p style={{ fontSize:10, color:T.mid, margin:0, fontWeight:600 }}>{p.name}</p>
                        <p style={{ fontSize:9, color:T.dim, margin:0 }}>{p.desc}</p>
                      </div>
                    ))}
                  </div>
                </footer>
              </>
            )}
          </div>

          {/* ═══ SIDEBAR ���════════════════════════════════════════════════════ */}
          <aside style={{ width:224, flexShrink:0, borderLeft:`1px solid ${T.border}`, background:"rgba(255,255,255,0.014)", backdropFilter:"blur(12px)", display:"flex", flexDirection:"column", overflow:"hidden" }}>
            {/* Tabs */}
            <div style={{ display:"flex", padding:"10px 10px 0", gap:4, flexShrink:0, borderBottom:`1px solid ${T.border}` }}>
              {([["tools","Tools"],["market","Marketplace"]] as const).map(([id,lbl]) => (
                <motion.button key={id} whileTap={tapAnim.tap} onClick={() => setSideTab(id)}
                  style={{ flex:1, padding:"7px 4px", borderRadius:7, border:"none", cursor:"pointer", fontFamily:"inherit", fontSize:10, fontWeight:700, letterSpacing:".04em", marginBottom:8, background:sideTab===id?"rgba(201,168,76,0.14)":"transparent", color:sideTab===id?T.gold:T.dimmer, transition:"all .2s" }}>
                  {lbl}
                </motion.button>
              ))}
            </div>

            <div style={{ flex:1, overflowY:"auto", padding:"12px 11px 16px" }}>

              {/* Tools nav */}
              {sideTab==="tools" && (
                <motion.div variants={stagger} initial="hidden" animate="visible" style={{ display:"flex", flexDirection:"column", gap:3 }}>
                  <p style={{ fontSize:9, color:T.dimmer, letterSpacing:".1em", margin:"2px 2px 9px" }}>ALL TOOLS — FREE</p>
                  {NAV_TOOLS.map(t => {
                    const on = activeTool===t.id && panelView==="tool";
                    return (
                      <motion.button key={t.id} variants={fadeUp} whileTap={tapAnim.tap} onClick={() => openTool(t.id)}
                        style={{ display:"flex", alignItems:"center", gap:9, padding:"9px 10px", borderRadius:T.rsm, border:`1px solid ${on?"rgba(201,168,76,0.4)":"transparent"}`, background:on?"rgba(201,168,76,0.14)":"transparent", color:on?T.gold:T.mid, cursor:"pointer", fontSize:12, fontWeight:on?600:400, width:"100%", textAlign:"left", fontFamily:"inherit", transition:"all .2s" }}
                        onMouseEnter={e => { if(!on){(e.currentTarget as HTMLElement).style.background=T.glassHi;(e.currentTarget as HTMLElement).style.color=T.text;} }}
                        onMouseLeave={e => { if(!on){(e.currentTarget as HTMLElement).style.background="transparent";(e.currentTarget as HTMLElement).style.color=T.mid;} }}>
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
          <p style={{ fontSize:9, color:T.mid, margin:0 }}>Forge Member</p>
        </div>
      </div>
      
      {/* Sign Out Button */}
      <motion.button variants={fadeUp} whileTap={tapAnim.tap} onClick={handleSignOut}
        style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:7, padding:"10px 0", borderRadius:T.rsm, cursor:"pointer", fontFamily:"inherit", fontSize:11, fontWeight:600, border:`1px solid ${T.border}`, background:T.glass, color:T.mid, transition:"all .3s", width:"100%" }}>
        <LogOut size={14} /> Sign Out
      </motion.button>
    </>
  ) : (
    <motion.button variants={fadeUp} whileTap={tapAnim.tap} onClick={() => setShowAuth(true)}
      style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:7, padding:"10px 0", borderRadius:T.rsm, cursor:"pointer", fontFamily:"inherit", fontSize:11, fontWeight:600, border:`1px solid ${T.gold}`, background:"rgba(201,168,76,0.08)", color:T.gold, transition:"all .3s" }}>
      <LogIn size={14} /> Member Sign In
    </motion.button>
  )}
                  
                  <div style={{ height:1, background:T.border, margin:"12px 2px" }} />
                  
                  {/* Share button */}
                  <motion.button variants={fadeUp} whileTap={tapAnim.tap} onClick={handleShare}
                    style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:7, padding:"10px 0", borderRadius:T.rsm, cursor:"pointer", fontFamily:"inherit", fontSize:11, fontWeight:600, border:`1px solid ${copied?"rgba(74,222,128,0.4)":T.border}`, background:copied?"rgba(74,222,128,0.08)":T.glass, color:copied?T.green:T.mid, transition:"all .3s" }}>
                    {copied ? <><Check size={14} /> Copied!</> : <><Share2 size={14} /> Share Forge</>}
                  </motion.button>
                  <p style={{ fontSize:9, color:T.dimmer, textAlign:"center", margin:"4px 0 0", lineHeight:1.5 }}>
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
    </>
  );
}
