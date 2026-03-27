"use client";

/**
 * Forge — v17 Clean Rebuild
 * Deleted and recreated to force Turbopack full recompilation
 * No CreditHealthWidget, BASE_SCORE, WHAT_IF_SCENARIOS, or setShowCreditPath
 */

import { useState, useEffect, useRef, useCallback, useMemo, memo as React_memo, type ReactNode, type CSSProperties, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp, Clock, DollarSign, GraduationCap, ShoppingBag,
  Send, Share2, Check, ChevronLeft, Trash2, User, Search,
  BarChart2, PiggyBank, BookOpen, ExternalLink, Bookmark, X, LogIn, LogOut,
} from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import InlineChatComponent from "@/app/inline-chat";

const React_memo_compat = React_memo;

// ── CONFIG ────────────────────────────────────────────────────────────────────
const AFFILIATE_PRODUCTS = [
  { id: "eqbank",      name: "EQ Bank",      tagline: "High-Interest Savings",          logo: "🏦", country: "CA" as const, href: "https://www.eqbank.ca",         highlight: "4%+ HISA · Zero fees · CDIC insured",          badge: "Top Pick", cta: "Open Free Account"   },
  { id: "wealthsimple",name: "Wealthsimple", tagline: "Invest & Save — Commission Free",logo: "📈", country: "CA" as const, href: "https://www.wealthsimple.com",  highlight: "Free trades · TFSA / RRSP / FHSA · Cash 4%+",  badge: "",         cta: "Start Investing Free" },
  { id: "tangerine",   name: "Tangerine",    tagline: "No-Fee Student Banking",         logo: "🍊", country: "CA" as const, href: "https://www.tangerine.ca",      highlight: "No monthly fees · 2.5% savings · e-transfers",  badge: "",         cta: "Get Free Account"    },
  { id: "sofi",        name: "SoFi",         tagline: "Banking for Ambitious People",   logo: "🚀", country: "US" as const, href: "https://www.sofi.com",          highlight: "4.6% APY · Student loan refi · $300 bonus",    badge: "Top Pick", cta: "Claim $300 Bonus"    },
  { id: "betterment",  name: "Betterment",   tagline: "Automated Investing & Roth IRA", logo: "🤖", country: "US" as const, href: "https://www.betterment.com",    highlight: "Auto-rebalancing · Tax-loss harvesting · No min",badge: "",         cta: "Start Investing"     },
  { id: "fidelity",    name: "Fidelity",     tagline: "Free Roth IRA & Index Funds",   logo: "📊", country: "US" as const, href: "https://www.fidelity.com",      highlight: "Zero-fee index funds · Roth IRA · Free cash mgmt",badge: "",        cta: "Open Free IRA"       },
];

const LOAN_MARKETPLACE = [
  { id: "sofi-refi",   name: "SoFi Student Loan Refinance", rate: "From 4.49% APR", bonus: "$300 Welcome Bonus", badge: "Best Rate", country: "US" as const, href: "https://www.sofi.com/refinance-student-loans/", highlight: "No fees · Unemployment protection · Member benefits", cta: "Check My Rate" },
  { id: "earnest",     name: "Earnest Student Loans",       rate: "From 4.25% APR", bonus: "$200 Bonus",         badge: "Flexible",  country: "US" as const, href: "https://www.earnest.com/",                     highlight: "Skip a payment option · Precision pricing",          cta: "Check My Rate" },
  { id: "credible",    name: "Credible Marketplace",        rate: "Compare 8+ Lenders", bonus: "Free Comparison",badge: "Compare",   country: "US" as const, href: "https://www.credible.com/",                   highlight: "One form · Multiple offers · No impact on credit",   cta: "Compare Rates" },
  { id: "sallie-mae",  name: "Sallie Mae Loans",            rate: "From 5.24% APR", bonus: "Multi-Year Approval", badge: "",         country: "US" as const, href: "https://www.salliemae.com/",                  highlight: "Cover up to 100% of school costs",                   cta: "Apply Now"     },
  { id: "nslsc",       name: "Federal Student Loans (NSLSC)", rate: "Prime +1%",    bonus: "Grants Available",  badge: "Gov't",     country: "CA" as const, href: "https://www.csnpe-nslsc.canada.ca/",          highlight: "Repayment assistance · No credit check",             cta: "Apply Now"     },
  { id: "rbc-student", name: "RBC Student Line of Credit",  rate: "Prime +0%",      bonus: "$0 Annual Fee",     badge: "Low Rate",  country: "CA" as const, href: "https://www.rbc.com/student/",                highlight: "Only pay interest while in school",                  cta: "Check My Rate" },
];

const MOCK_SCHOLARSHIPS = [
  { id:"ms1", type:"scholarship" as const, title:"National Merit Excellence Award",    provider:"National Foundation",       amount:"$5,000–$10,000", deadline:"March 31",   eligibility:"GPA 3.0+, any major, CA or USA",            url:"#" },
  { id:"ms2", type:"scholarship" as const, title:"Future Leaders Bursary",             provider:"Community Foundation",      amount:"$2,500",         deadline:"January 31", eligibility:"First-generation student, any year",         url:"#" },
  { id:"ms3", type:"scholarship" as const, title:"STEM Advancement Grant",             provider:"Tech Industry Fund",        amount:"$4,500–$8,000",  deadline:"February 15",eligibility:"STEM major, 2nd year or above",               url:"#" },
];

const MOCK_LOANS = [
  { id:"ml1", type:"loan" as const, title:"Federal Student Loan (Direct)",    provider:"U.S. Dept. of Education / NSLSC",amount:"From 5.50% APR", deadline:"Apply via FAFSA / NSLSC", eligibility:"Enrolled student, US or Canada",           url:"#" },
  { id:"ml2", type:"loan" as const, title:"SoFi Student Loan Refinance",      provider:"SoFi",                          amount:"From 4.49% APR", deadline:"Open — instant pre-qual", eligibility:"Good credit, employed or graduating",       url:"https://www.sofi.com" },
];

type ScoutResult = typeof MOCK_SCHOLARSHIPS[number] | typeof MOCK_LOANS[number];

const FOOTER_TEXT = "Forge provides general financial education only and is not a licensed financial advisor, broker, or lender. Information is for educational purposes and does not constitute personalized financial, legal, or tax advice. Affiliate links may be present — see our disclosure.";
const SYSTEM_PROMPT = `You are the Forge Intelligence Co-Pilot — a quantitative financial advisor for students in Canada and the USA. You are analytical, concise, and direct.

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

// ── DESIGN TOKENS ─────────────────────────────────────────────────────────────
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

// ── MOTION VARIANTS ───────────────────────────────────────────────────────────
const fadeUp  = { hidden:{opacity:0,y:16}, visible:{opacity:1,y:0,transition:{duration:0.36,ease:[0.22,1,0.36,1] as number[]}} };
const stagger = { visible:{transition:{staggerChildren:0.065}} };
const tapAnim = { tap:{scale:0.95} };

// ── FORMATTING ────────────────────────────────────────────────────────────────
const formatCurrency = (v: number): string => {
  if (v >= 1_000_000_000) return "$" + (v / 1_000_000_000).toFixed(2) + "B";
  if (v >= 1_000_000) return "$" + (v / 1_000_000).toFixed(2) + "M";
  return "$" + v.toLocaleString(undefined, { maximumFractionDigits: 2 });
};

const formatShortCurrency = (v: number): string => {
  if (v >= 1_000_000) return "$" + (v / 1_000_000).toFixed(1) + "M";
  if (v >= 100_000) return "$" + Math.round(v / 1000) + "K";
  return "$" + Math.round(v).toLocaleString();
};

// ── SLIDER COMPONENT ──────────────────────────────────────────────────────────
const MAX_CURRENCY = 1_000_000_000;
const MAX_PERCENT = 100;

const SliderComponent = ({ label, value, min, step = 1, onChange, fmt, maxVal }: { label:string; value:number; min:number; step?:number; onChange:(v:number)=>void; fmt:(v:number)=>string; maxVal?:number }) => {
  const [inputVal, setInputVal] = useState(fmt(value));
  const [editing, setEditing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  const isPercent = fmt(1).includes("%");
  const hardMax = maxVal ?? (isPercent ? MAX_PERCENT : MAX_CURRENCY);
  const visualMax = Math.min(hardMax, Math.max(value * 2, min * 10, isPercent ? 100 : 10000));
  const pct = Math.max(0, Math.min(100, ((value - min) / (visualMax - min)) * 100));
  
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
        <div style={{ position:"absolute", left:0, top:0, height:"100%", width:`${pct}%`, backgroundImage:`linear-gradient(90deg,${T.goldDim},${T.gold})`, borderRadius:8, transition: isDragging ? "none" : "width .15s" }} />
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

const Slider = React_memo_compat(SliderComponent);

// ── MAIN PAGE ─────────────────────────────────────────────────────────────────
export default function ForgePage() {
  const [country, setCountry] = useState<"Canada" | "USA" | "">("");
  const [panelView, setPanelView] = useState<"chat" | "tool">("chat");
  const [chatKey, setChatKey] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [savedItems, setSavedItems] = useState<ScoutResult[]>([]);

  const closeSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  const clearChat = useCallback(() => {
    setChatKey(k => k + 1);
  }, []);

  const scrollToSection = useCallback((sectionId: string) => {
    closeSidebar();
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 260);
  }, [closeSidebar]);

  return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", background:T.bg, color:T.text, fontFamily:"Inter,system-ui,-apple-system,sans-serif", transition:"background .3s, color .3s", paddingBottom:"24px" }}>
      {/* Header */}
      <div style={{ padding:"12px 16px", borderBottom:`1px solid ${T.border}`, display:"flex", justifyContent:"space-between", alignItems:"center", gap:10 }}>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            closeSidebar();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          style={{ display:"flex", alignItems:"center", gap:8, flexShrink:0, background:"none", border:"none", cursor:"pointer", padding:0 }}
          aria-label="Go to top"
        >
          <span style={{ fontSize:20, fontWeight:900 }}>🔥</span>
          <span style={{ fontSize:17, fontWeight:900, color:T.gold }}>FORGE</span>
        </motion.button>
        <div style={{ display:"flex", gap:6, alignItems:"center", flexWrap:"nowrap" }}>
          {(["Canada","USA"] as const).map(c => (
            <motion.button key={c} whileTap={tapAnim.tap} onClick={() => setCountry(country === c ? "" : c)}
              title={c}
              style={{ padding:"5px 8px", fontSize:14, borderRadius:10, whiteSpace:"nowrap", display:"flex", alignItems:"center", justifyContent:"center", minWidth:32, height:32, background: country === c ? T.glow : "transparent", border: `1px solid ${country === c ? T.gold : T.border}`, color: country === c ? T.gold : T.mid, cursor:"pointer" }}>
              {c === "Canada" ? "🇨🇦" : "🇺🇸"}
            </motion.button>
          ))}
        </div>
        <motion.button whileTap={{ scale: 0.93 }} onClick={() => sidebarOpen ? closeSidebar() : setSidebarOpen(true)}
          style={{ background:"none", border:`1px solid ${T.border}`, color:"#c4b594", cursor:"pointer", padding:"5px 10px", borderRadius:T.rsm, display:"flex", alignItems:"center", gap:5, fontSize:"clamp(10px, 2vw, 12px)", fontWeight:700, letterSpacing:".05em", lineHeight:1, whiteSpace:"nowrap", flexShrink:0 }}>
          <span style={{ fontSize:14, lineHeight:1 }}>☰</span> MENU
        </motion.button>
      </div>

      {/* Main Content */}
      <div style={{ flex:1, display:"flex", overflow:"auto" }}>
        {panelView==="chat" && (
          <>
            <div style={{ flex:1, display:"flex", flexDirection:"column" }}>
              <div style={{ flex:1 }}>
                <InlineChatComponent key={chatKey} country={country} />
              </div>
            </div>
            <footer style={{ borderTop:`1px solid ${T.border}`, background:"rgba(5,5,5,0.6)", padding:"8px 10px" }}>
              <div style={{ display:"flex", justifyContent:"center", gap:12, marginBottom:6, flexWrap:"wrap", fontSize:9 }}>
                {PARTNERS.map(p => (
                  <span key={p.name} style={{ color:T.dim }}>
                    <strong style={{color:T.mid}}>{p.name}</strong> · {p.desc}
                  </span>
                ))}
              </div>
              <p style={{ fontSize:9, color:"#c4b594", lineHeight:1.4, margin:0, textAlign:"center", padding:"0 8px" }}>{FOOTER_TEXT}</p>
            </footer>
          </>
        )}
      </div>
    </div>
  );
}

// Cache bust marker
export const __CACHE_BUST_V17__ = "file-deleted-recreated-" + Date.now();
