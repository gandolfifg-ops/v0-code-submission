"use client";

/**
 * WealthForge — Single File, v0-Ready
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
  BarChart2, PiggyBank, BookOpen, ExternalLink,
} from "lucide-react";

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

const VIRAL_SHARE   = "🎓 This free AI tool finds you $100k+ in scholarships and the lowest loan rates in seconds. It's called WealthForge and it's completely free 👉 https://wealthforge.app";
const WELCOME_MSG   = "WealthForge AI Scout is indexing live financial databases... How can I help you accelerate your wealth today?";
const AFFIL_NOTE    = "WealthForge may earn a referral commission if you open an account through our links. This never affects our recommendations.";
const FOOTER_TEXT   = "WealthForge provides general financial education only and is not a licensed financial advisor, broker, or lender. Information is for educational purposes and does not constitute personalized financial, legal, or tax advice. Affiliate links may be present — see our disclosure.";
const SYSTEM_PROMPT = `You are WealthForge — a direct, opinionated wealth co-pilot for students in Canada and the USA. You give personalized, actionable advice like a brilliant older friend who is a certified financial planner.

CORE RULES:
1. Personalize first. If you don't know the user's country, income, savings, or goals — ask 2–3 short questions before advising.
2. Be direct. Say "You should open a TFSA first" not "You might consider a TFSA."
3. Give numbered action plans the user can follow this week. Be specific.
4. Minimal disclaimers — only once at the very end for genuinely complex situations.
5. Format: **bold** key terms, numbered action plans, bullet points for comparisons.

KNOWLEDGE:
Canada: TFSA (tax-free growth), RRSP (tax-deductible), FHSA (first-home, deductible + tax-free), RESP (20% CESG), OSAP, GST/HST credit, T4/T2202, NETFILE. Best accounts: EQ Bank HISA, Wealthsimple, Tangerine, Simplii.
USA: Roth IRA (tax-free growth — best for students), 529, FAFSA every year, federal loans before private, income-driven repayment, PSLF, AOTC ($2,500/yr). Best accounts: SoFi, Fidelity, Betterment, Schwab.
Both: Priority: emergency fund → employer match → pay >7% debt → max tax-advantaged → index funds (VTI/XEQT). Credit: secured → student → regular; always pay in full; under 10% utilization. 50/30/20 budgeting.`;

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 2 — DESIGN TOKENS
// ─────────────────────────────────────────────────────────────────────────────

const T = {
  bg:      "#07090d",
  glass:   "rgba(255,255,255,0.044)",
  glassHi: "rgba(255,255,255,0.085)",
  border:  "rgba(255,255,255,0.085)",
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
} as const;

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
type HistRec = { id: string; label: string; type: "scholarship"|"loan"; results: ScoutResult[]; ts: number };
function readHist(): HistRec[] { try { return JSON.parse(typeof window !== "undefined" ? localStorage.getItem(HIST_KEY) ?? "[]" : "[]"); } catch { return []; } }
function pushHist(r: HistRec) { try { const n = [r, ...readHist().filter(x => x.id !== r.id)].slice(0,10); localStorage.setItem(HIST_KEY, JSON.stringify(n)); } catch {} }

// Mock search — plug in Tavily / Serper here
async function fetchResults(type: "scholarship"|"loan", _filters: Record<string,string>): Promise<ScoutResult[]> {
  await new Promise(r => setTimeout(r, 2100)); // simulated latency
  // TODO: replace with real fetch:
  // const res = await fetch("https://api.tavily.com/search", { method:"POST", ... });
  // const data = await res.json();
  // return data.results.map(r => ({ ... }));
  return type === "scholarship" ? MOCK_SCHOLARSHIPS : MOCK_LOANS;
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 5 — PRIMITIVE UI COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

function Glass({ children, style, glow, onClick }: { children: ReactNode; style?: CSSProperties; glow?: boolean; onClick?: () => void }) {
  const [hov, setHov] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        background: T.glass, backdropFilter: T.blur, WebkitBackdropFilter: T.blur,
        border: `1px solid ${hov && glow ? "rgba(201,168,76,0.38)" : T.border}`,
        borderRadius: T.r,
        boxShadow: hov && glow ? "0 0 0 1px rgba(201,168,76,0.18),0 8px 36px rgba(0,0,0,0.5)" : "0 4px 28px rgba(0,0,0,0.35)",
        transition: "border-color .22s,box-shadow .22s",
        cursor: onClick ? "pointer" : undefined, ...style,
      }}>
      {children}
    </div>
  );
}

function Skel({ w = "100%", h = 14 }: { w?: string|number; h?: number }) {
  return <div style={{ width:w, height:h, borderRadius:7, background:"linear-gradient(90deg,rgba(255,255,255,0.04) 25%,rgba(255,255,255,0.09) 50%,rgba(255,255,255,0.04) 75%)", backgroundSize:"200% 100%", animation:"wf-skel 1.6s ease infinite" }} />;
}

function Chip({ label, color = T.dim }: { label: string; color?: string }) {
  return <span style={{ fontSize:9, fontWeight:700, letterSpacing:".07em", padding:"2px 7px", borderRadius:20, background:`${color}22`, border:`1px solid ${color}44`, color, whiteSpace:"nowrap" }}>{label}</span>;
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

function Dots() {
  return (
    <div style={{ display:"flex", gap:5 }}>
      {[0,1,2].map(i => <span key={i} style={{ width:7, height:7, borderRadius:"50%", background:T.gold, opacity:.7, display:"inline-block", animation:"wf-bounce 1.2s infinite", animationDelay:`${i*.2}s` }} />)}
    </div>
  );
}

function LogoMark({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="2" y="7" width="20" height="10" rx="2" fill={T.gold} />
      <rect x="4" y="9" width="16" height="6" rx="1" fill={T.goldHi} opacity=".42" />
      {[8,12,16].map(x => <line key={x} x1={x} y1="7" x2={x} y2="17" stroke={T.goldDim} strokeWidth=".8" />)}
    </svg>
  );
}

// Gold CTA button — used for all affiliate links
function GoldCTA({ href, label }: { href: string; label: string }) {
  const safe = (href?.trim?.() ?? "").length > 0 ? href : "#";
  return (
    <motion.a href={safe} target="_blank" rel="noopener noreferrer" whileTap={tapAnim.tap}
      style={{ display:"block", textAlign:"center", padding:"10px 0", borderRadius:T.rsm, textDecoration:"none", fontFamily:"inherit", background:`linear-gradient(135deg,${T.gold},${T.goldDim})`, color:"#07090d", fontSize:12, fontWeight:800, letterSpacing:".03em", boxShadow:`0 0 18px ${T.glow}`, transition:"box-shadow .2s" }}
      onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 0 32px rgba(201,168,76,0.5)")}
      onMouseLeave={e => (e.currentTarget.style.boxShadow = `0 0 18px ${T.glow}`)}>
      {label} →
    </motion.a>
  );
}

// Slider — used in budget, savings, loan tools
function Slider({ label, value, min, max, step = 1, onChange, fmt }: { label:string; value:number; min:number; max:number; step?:number; onChange:(v:number)=>void; fmt:(v:number)=>string }) {
  const pct = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:7 }}>
        <span style={{ fontSize:11, color:T.mid }}>{label}</span>
        <span style={{ fontSize:12, color:T.gold, fontWeight:600 }}>{fmt(value)}</span>
      </div>
      <div style={{ position:"relative", height:4, background:"rgba(255,255,255,0.08)", borderRadius:4 }}>
        <div style={{ position:"absolute", left:0, top:0, height:"100%", width:`${pct}%`, background:`linear-gradient(90deg,${T.goldDim},${T.gold})`, borderRadius:4 }} />
        <input type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(Number(e.target.value))} style={{ position:"absolute", inset:0, width:"100%", opacity:0, cursor:"pointer", height:"100%", margin:0 }} />
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
        if (/^[-•]\s/.test(line)) return <div key={i} style={{ display:"flex", gap:9, marginBottom:4 }}><span style={{ color:T.gold, flexShrink:0 }}>▸</span><span>{parts.map((p,j) => typeof p==="string" ? p.replace(/^[-•]\s/,"") : p)}</span></div>;
        if (/^\d+\.\s/.test(line)) return <div key={i} style={{ display:"flex", gap:9, marginBottom:5 }}><span style={{ color:T.gold, flexShrink:0, minWidth:18, fontWeight:700 }}>{(line.match(/^\d+/)?.[0] ?? "")}.</span><span>{parts.map((p,j) => typeof p==="string" ? p.replace(/^\d+\.\s/,"") : p)}</span></div>;
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
        {!done && <span style={{ display:"inline-block", width:2, height:"1em", background:T.gold, marginLeft:2, verticalAlign:"middle", animation:"wf-cur .65s steps(1) infinite" }} />}
      </p>
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
      <Slider label="Monthly Income" value={income} min={500}  max={8000} step={50}  onChange={setIncome} fmt={v=>"$"+v.toLocaleString()} />
      <Slider label="Needs %"        value={needs}  min={10}   max={80}              onChange={setNeeds}  fmt={v=>v+"%"} />
      <Slider label="Wants %"        value={wants}  min={0}    max={70}              onChange={setWants}  fmt={v=>v+"%"} />
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
      {savings < 0  && <div style={{ fontSize:12, color:T.red,   background:"rgba(248,113,113,0.1)", border:"1px solid rgba(248,113,113,0.25)", borderRadius:8, padding:"8px 12px" }}>⚠ Needs + Wants exceed 100%</div>}
      {savings >= 20 && <div style={{ fontSize:12, color:"#b8952a", background:"rgba(201,168,76,0.08)", border:"1px solid rgba(201,168,76,0.2)", borderRadius:8, padding:"8px 12px" }}>✦ Saving {savings}% — excellent! 20%+ recommended.</div>}
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
  const timeStr = months <= 0 ? "Goal reached! 🎉" : months >= 999 ? "Increase contribution" : yrs > 0 ? `${yrs}y ${mos}m` : `${mos} months`;
  const C = 2 * Math.PI * 32;
  return (
    <motion.div variants={fadeUp} initial="hidden" animate="visible" style={{ display:"flex", flexDirection:"column", gap:16 }}>
      <Slider label="Goal Amount"          value={goal}    min={500}  max={50000} step={250} onChange={setGoal}                          fmt={v=>"$"+v.toLocaleString()} />
      <Slider label="Already Saved"        value={saved}   min={0}    max={goal}  step={50}  onChange={v=>setSaved(Math.min(v,goal))}    fmt={v=>"$"+v.toLocaleString()} />
      <Slider label="Monthly Contribution" value={monthly} min={25}   max={2000}  step={25}  onChange={setMonthly}                       fmt={v=>"$"+v.toLocaleString()} />
      <Slider label="Interest Rate (APY)"  value={rate}    min={0}    max={10}    step={0.25} onChange={setRate}                         fmt={v=>v+"%"} />
      <Glass style={{ padding:16, display:"flex", alignItems:"center", gap:16 }}>
        <svg width="80" height="80" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="7"/>
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
  while(bal>0.01 && mo<600){const i=bal*r;intEx+=i;bal=Math.max(0,bal+i-base-extra);mo++;}
  const savedInt=totalInt-intEx, savedMo=n-mo;
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      <Slider label="Loan Amount"   value={principal} min={1000}  max={100000} step={500}  onChange={setPrincipal} fmt={v=>"$"+v.toLocaleString()} />
      <Slider label="Interest Rate" value={rate}      min={0.5}   max={15}     step={0.25} onChange={setRate}      fmt={v=>v+"%"} />
      <Slider label="Term"          value={years}     min={1}     max={25}                 onChange={setYears}     fmt={v=>v+" yrs"} />
      <Slider label="Extra Monthly" value={extra}     min={0}     max={600}    step={10}   onChange={setExtra}     fmt={v=>"$"+v} />
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
          <p style={{ fontSize:10, color:T.green, margin:"0 0 8px", letterSpacing:".07em" }}>✦ WITH EXTRA ${extra}/MO</p>
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

// ── Loan Finder ───────────────────────────────────────────────────────────────
type Phase = "idle"|"scanning"|"results";
const SCAN_MSGS = ["Connecting to loan databases...","Scanning live lender rates...","Cross-referencing eligibility...","Compiling best rates for you..."];

function LoanFinder() {
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
        style={{ padding:"11px 0", borderRadius:T.rsm, border:"none", cursor:"pointer", background:`linear-gradient(135deg,${T.gold},${T.goldDim})`, color:"#07090d", fontSize:13, fontWeight:800, fontFamily:"inherit", opacity:phase==="scanning"?.65:1, boxShadow:`0 0 18px ${T.glow}` }}>
        {phase==="scanning" ? "Scanning lenders..." : "🔍 Find Best Rates"}
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
                    <Chip label={r.amount} color={T.green} />
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
          <p style={{ fontSize:10, color:T.dim, letterSpacing:".08em", margin:"4px 2px 8px" }}>⏱ RECENT SEARCHES</p>
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
function LoanTool() {
  const [tab, setTab] = useState<"calc"|"finder">("calc");
  return (
    <motion.div variants={fadeUp} initial="hidden" animate="visible" style={{ display:"flex", flexDirection:"column", gap:0 }}>
      <div style={{ display:"flex", gap:4, background:T.glass, borderRadius:T.rsm, padding:3, marginBottom:16 }}>
        {([["calc","📊 Calculator"],["finder","🔍 Loan Finder"]] as const).map(([id,lbl]) => (
          <motion.button key={id} whileTap={tapAnim.tap} onClick={() => setTab(id)}
            style={{ flex:1, padding:"8px 0", borderRadius:7, border:"none", cursor:"pointer", fontFamily:"inherit", fontSize:12, fontWeight:600, background:tab===id?"rgba(201,168,76,0.18)":"transparent", color:tab===id?T.gold:T.mid }}>
            {lbl}
          </motion.button>
        ))}
      </div>
      {tab==="calc" ? <LoanCalculator /> : <LoanFinder />}
    </motion.div>
  );
}

// ── Scholarship Scout ─────────────────────────────────────────────────────────
const SCH_SCAN_MSGS = ["Connecting to scholarship databases...","Scanning national award portals...","Cross-referencing eligibility...","Aggregating live results for you..."];

function ScholarshipScout() {
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
          style={{ padding:"11px 0", borderRadius:T.rsm, border:"none", cursor:"pointer", background:`linear-gradient(135deg,${T.gold},${T.goldDim})`, color:"#07090d", fontSize:13, fontWeight:800, fontFamily:"inherit", opacity:phase==="scanning"?.65:1, boxShadow:`0 0 20px ${T.glow}` }}>
          {phase==="scanning" ? "Scanning..." : "🔍 Find My Scholarships"}
        </motion.button>
      </Glass>
      <AnimatePresence>
        {phase==="scanning" && (
          <motion.div key="ss" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}}>
            <Glass style={{ padding:18, display:"flex", flexDirection:"column", gap:10 }}>
              <div style={{ display:"flex", alignItems:"center", gap:9 }}>
                <span style={{ width:8, height:8, borderRadius:"50%", background:T.gold, display:"inline-block", animation:"wf-pulse 1s ease infinite" }} />
                <span style={{ fontSize:13, color:T.gold, fontWeight:600 }}>{SCH_SCAN_MSGS[scanIdx] ?? SCH_SCAN_MSGS[0]}</span>
              </div>
              <Skel h={13} w="100%" /><Skel h={13} w="80%" /><Skel h={13} w="90%" /><Skel h={13} w="65%" />
            </Glass>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {phase==="results" && results.length>0 && (
          <motion.div key="sr" variants={stagger} initial="hidden" animate="visible" style={{ display:"flex", flexDirection:"column", gap:10 }}>
            <div style={{ display:"flex", justifyContent:"space-between", padding:"0 2px" }}>
              <p style={{ fontSize:10, color:T.dim, margin:0, letterSpacing:".07em" }}>{results.length} SCHOLARSHIPS FOUND</p>
              <p style={{ fontSize:9, color:T.dimmer, margin:0 }}>Sample data — connect Tavily for live results</p>
            </div>
            {results.map(r => (
              <motion.div key={r.id} variants={fadeUp}>
                <Glass glow style={{ padding:15 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8, gap:10 }}>
                    <div style={{ flex:1, minWidth:0 }}>
                      <p style={{ fontSize:13, fontWeight:700, color:T.text, margin:"0 0 2px", lineHeight:1.35 }}>{r.title}</p>
                      <p style={{ fontSize:11, color:T.mid, margin:0 }}>{r.provider}</p>
                    </div>
                    <Chip label={r.amount} color={T.gold} />
                  </div>
                  <div style={{ display:"flex", gap:7, flexWrap:"wrap", marginBottom:11 }}>
                    <Chip label={`📅 ${r.deadline}`} color={T.blue} />
                    <Chip label={r.eligibility} color={T.mid} />
                  </div>
                  <GoldCTA href={r.url} label="Apply Now" />
                </Glass>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      {phase==="idle" && (
        <Glass style={{ padding:18, textAlign:"center" }}>
          <p style={{ fontSize:13, color:T.mid, margin:0, lineHeight:1.65 }}>Enter your details above to find personalised scholarship matches.</p>
        </Glass>
      )}
      {hist.length > 0 && (
        <motion.div variants={fadeUp} initial="hidden" animate="visible">
          <p style={{ fontSize:10, color:T.dim, letterSpacing:".08em", margin:"4px 2px 8px" }}>⏱ RECENT DISCOVERIES</p>
          {hist.slice(0,4).map(h => (
            <Glass key={h.id} glow style={{ padding:"10px 13px", marginBottom:6, cursor:"pointer" }} onClick={() => { setResults(h.results ?? []); setPhase("results"); }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div><p style={{ fontSize:12, color:T.text, margin:"0 0 2px", fontWeight:500 }}>{h.label}</p><p style={{ fontSize:10, color:T.dim, margin:0 }}>{(h.results?.length ?? 0)} results · {new Date(h.ts).toLocaleDateString()}</p></div>
                <span style={{ fontSize:14, color:T.gold }}>↺</span>
              </div>
            </Glass>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 7 — MARKETPLACE SIDEBAR
// ─────────────────────────────────────────────────────────────────────────────

function Marketplace({ country }: { country: string }) {
  const caP = useMemo(() => AFFILIATE_PRODUCTS.filter(p => p.country==="CA"), []);
  const usP = useMemo(() => AFFILIATE_PRODUCTS.filter(p => p.country==="US"), []);
  const showCA = !country || country==="Canada";
  const showUS = !country || country==="USA";
  const Card = ({ p }: { p: typeof AFFILIATE_PRODUCTS[number] }) => (
    <motion.div variants={fadeUp} whileHover={{ y:-1 }} style={{ marginBottom:10 }}>
      <Glass glow style={{ padding:"13px 12px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:7 }}>
          <span style={{ fontSize:18 }}>{p.logo}</span>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
              <span style={{ fontSize:12, fontWeight:700, color:T.text }}>{p.name}</span>
              {p.badge && <Chip label={p.badge} color={T.gold} />}
            </div>
            <p style={{ fontSize:10, color:T.dim, margin:"1px 0 0" }}>{p.tagline}</p>
          </div>
        </div>
        <p style={{ fontSize:10, color:T.mid, lineHeight:1.5, margin:"0 0 10px" }}>{p.highlight}</p>
        <GoldCTA href={p.href} label={p.cta} />
      </Glass>
    </motion.div>
  );
  return (
    <motion.div variants={stagger} initial="hidden" animate="visible">
      {showCA && <><p style={{ fontSize:9, color:T.dim, letterSpacing:".1em", margin:"2px 2px 9px" }}>🇨🇦 CANADA</p>{caP.map(p => <Card key={p.id} p={p} />)}</>}
      {showUS && <><p style={{ fontSize:9, color:T.dim, letterSpacing:".1em", margin:"8px 2px 9px" }}>🇺🇸 USA</p>{usP.map(p => <Card key={p.id} p={p} />)}</>}
      <AffNote />
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 8 — INLINE CHAT (no external API required to render)
// ─────────────────────────────────────────────────────────────────────────────

interface ChatMsg { id: string; role: "user"|"assistant"; content: string; }

function InlineChat({ country }: { country: string }) {
  const [msgs,    setMsgs]    = useState<ChatMsg[]>([]);
  const [input,   setInput]   = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLTextAreaElement>(null);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:"smooth" }); }, [msgs, loading]);

  const send = useCallback(async (text?: string) => {
    const msg = (text ?? input)?.trim() ?? "";
    if (!msg || loading) return;
    setInput("");
    const userMsg: ChatMsg = { id: String(Date.now()), role:"user", content:msg };
    const history = [...msgs, userMsg];
    setMsgs(history);
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type":"application/json" },
        body: JSON.stringify({
          messages: history.map(m => ({ role:m.role, content:m.content })),
          system: SYSTEM_PROMPT,
          country: country || null,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      // Handle streaming SSE response
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";
      const assistantId = String(Date.now() + 1);
      setMsgs(prev => [...prev, { id:assistantId, role:"assistant", content:"" }]);
      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream:true });
          for (const line of chunk.split("\n")) {
            if (line.startsWith("data: ")) {
              const payload = line.slice(6).trim();
              if (payload === "[DONE]") continue;
              try {
                const parsed = JSON.parse(payload);
                const token = parsed?.delta?.text ?? parsed?.choices?.[0]?.delta?.content ?? parsed?.text ?? "";
                if (token) {
                  accumulated += token;
                  setMsgs(prev => prev.map(m => m.id===assistantId ? { ...m, content:accumulated } : m));
                }
              } catch {}
            }
          }
        }
      }
      if (!accumulated) setMsgs(prev => prev.map(m => m.id===assistantId ? { ...m, content:"I'm here to help! Ask me anything about savings, loans, or scholarships." } : m));
    } catch {
      const err: ChatMsg = { id:String(Date.now()+2), role:"assistant", content:"Couldn't reach the AI — make sure you have added the `/api/chat` route. In the meantime, try the tools in the sidebar!" };
      setMsgs(prev => [...prev, err]);
    }
    setLoading(false);
  }, [input, msgs, loading, country]);

  const submitForm = (e: FormEvent) => { e.preventDefault(); send(); };

  return (
    <>
      <div style={{ flex:1, overflowY:"auto", padding:"0 20px" }}>
        {msgs.length === 0 && <TypewriterGreeting />}
        <div style={{ maxWidth:680, margin:"0 auto", display:"flex", flexDirection:"column", gap:14, paddingBottom:20, paddingTop:msgs.length===0?12:20 }}>
          {msgs.length === 0 && (
            <motion.div variants={stagger} initial="hidden" animate="visible">
              <motion.div variants={fadeUp} style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:8 }}>
                {["What should I do with my money right now?","Give me a step-by-step savings plan","Should I pay off debt or invest first?","I have $500/month — where does it go?","How do I build credit from zero?","What accounts should I open as a student?"].map((q,i) => (
                  <motion.button key={i} variants={fadeUp} whileTap={tapAnim.tap} onClick={() => send(q)}
                    style={{ padding:"11px 13px", textAlign:"left", cursor:"pointer", background:T.glass, border:`1px solid ${T.border}`, borderRadius:T.rsm, color:T.mid, fontSize:13, lineHeight:1.4, fontFamily:"inherit", transition:"border-color .2s,color .2s" }}
                    onMouseEnter={e => {(e.currentTarget as HTMLElement).style.borderColor=T.gold;(e.currentTarget as HTMLElement).style.color=T.goldHi;}}
                    onMouseLeave={e => {(e.currentTarget as HTMLElement).style.borderColor=T.border;(e.currentTarget as HTMLElement).style.color=T.mid;}}>
                    {q}
                  </motion.button>
                ))}
              </motion.div>
            </motion.div>
          )}
          {msgs.map((m, i) => (
            <motion.div key={m.id} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:.28}}
              style={{ display:"flex", justifyContent:m.role==="user"?"flex-end":"flex-start" }}>
              {m.role==="assistant" && (
                <div style={{ width:24, height:24, borderRadius:6, background:`linear-gradient(135deg,${T.gold},${T.goldDim})`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginRight:8, marginTop:2 }}>
                  <LogoMark size={14} />
                </div>
              )}
              <div style={{ maxWidth:"78%", padding:"10px 14px", borderRadius:m.role==="user"?"14px 14px 4px 14px":"4px 14px 14px 14px", background:m.role==="user"?"rgba(201,168,76,0.1)":T.glass, border:`1px solid ${m.role==="user"?"rgba(201,168,76,0.18)":T.border}`, backdropFilter:T.blur, fontSize:14, lineHeight:1.7, color:m.role==="user"?"#d4c080":"#c0b8a8" }}>
                {m.role==="assistant" ? (
                  <>{<MsgText text={m.content ?? ""} />}{loading && i===msgs.length-1 && <span style={{ display:"inline-block", width:2, height:13, background:T.gold, marginLeft:2, verticalAlign:"middle", animation:"wf-cur .65s steps(1) infinite" }} />}</>
                ) : (m.content ?? "")}
              </div>
            </motion.div>
          ))}
          {loading && msgs[msgs.length-1]?.role !== "assistant" && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} style={{ display:"flex", alignItems:"flex-start" }}>
              <div style={{ width:24, height:24, borderRadius:6, background:`linear-gradient(135deg,${T.gold},${T.goldDim})`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginRight:8 }}><LogoMark size={14} /></div>
              <div style={{ padding:"10px 14px", background:T.glass, border:`1px solid ${T.border}`, borderRadius:"4px 14px 14px 14px", backdropFilter:T.blur }}><Dots /></div>
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
              style={{ width:33, height:33, borderRadius:8, border:"none", cursor:(input?.trim() && !loading)?"pointer":"not-allowed", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", transition:"all .2s", background:(input?.trim() && !loading)?`linear-gradient(135deg,${T.gold},${T.goldDim})`:T.glassHi, color:(input?.trim() && !loading)?"#07090d":T.dim }}>
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

type ToolId = "budget"|"savings"|"loan"|"scholar";
const NAV_TOOLS: { id: ToolId; label: string; Icon: React.FC<{size?:number}> }[] = [
  { id:"budget",  label:"Budget",       Icon: ({size=15}) => <BarChart2  size={size} /> },
  { id:"savings", label:"Savings",      Icon: ({size=15}) => <PiggyBank  size={size} /> },
  { id:"loan",    label:"Loan Tools",   Icon: ({size=15}) => <DollarSign size={size} /> },
  { id:"scholar", label:"Scholarships", Icon: ({size=15}) => <BookOpen   size={size} /> },
];

export default function WealthForgePage() {
  const [activeTool, setActiveTool] = useState<ToolId|"">("");
  const [panelView,  setPanelView]  = useState<"chat"|"tool">("chat");
  const [country,    setCountry]    = useState<string>("");
  const [sideTab,    setSideTab]    = useState<"tools"|"market">("tools");
  const [copied,     setCopied]     = useState<boolean>(false);
  const [chatKey,    setChatKey]    = useState<number>(0); // bump to reset chat

  const openTool = useCallback((id: ToolId) => { setActiveTool(id); setPanelView("tool"); }, []);
  const clearChat = useCallback(() => setChatKey(k => k + 1), []);

  const handleShare = useCallback(() => {
    navigator.clipboard?.writeText(VIRAL_SHARE ?? "").then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2800);
    }).catch(() => {});
  }, []);

  const currentTool = NAV_TOOLS.find(t => t.id === activeTool);

  const hBtn = (active = false): CSSProperties => ({
    padding:"4px 10px", borderRadius:20, fontFamily:"inherit", fontSize:11, cursor:"pointer",
    border:`1px solid ${active ? T.gold : T.border}`,
    background: active ? "rgba(201,168,76,0.12)" : "transparent",
    color: active ? T.gold : T.mid,
    transition:"all .2s",
  });

  return (
    <div style={{ height:"100vh", display:"flex", flexDirection:"column", background:T.bg, color:T.text, fontFamily:"Inter,system-ui,-apple-system,sans-serif", overflow:"hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        *{box-sizing:border-box}
        ::-webkit-scrollbar{width:3px}
        ::-webkit-scrollbar-thumb{background:#2a2620;border-radius:3px}
        textarea,input,select,button{font-family:inherit}
        input[type=range]{-webkit-appearance:none;appearance:none;background:transparent;cursor:pointer}
        select option{background:#0d0f14;color:#F0EBE3}
        @keyframes wf-bounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-5px)}}
        @keyframes wf-cur   {0%,100%{opacity:1}50%{opacity:0}}
        @keyframes wf-pulse {0%,100%{opacity:1}50%{opacity:.3}}
        @keyframes wf-skel  {0%{background-position:200% 0}100%{background-position:-200% 0}}
        @keyframes wf-shimmer{0%{background-position:200% center}100%{background-position:-200% center}}
      `}</style>

      {/* ═══ HEADER ══════════════════════════════════════════════════════════ */}
      <header style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"11px 20px", borderBottom:`1px solid ${T.border}`, flexShrink:0, zIndex:10, background:"rgba(7,9,13,0.97)", backdropFilter:"blur(22px)", WebkitBackdropFilter:"blur(22px)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:30, height:30, borderRadius:8, background:`linear-gradient(135deg,${T.gold},${T.goldDim})`, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:`0 0 16px ${T.glow}` }}>
            <LogoMark />
          </div>
          <div>
            <div style={{ fontSize:17, fontWeight:800, letterSpacing:"-.03em", background:`linear-gradient(90deg,${T.goldHi},${T.gold},#a07830,${T.goldHi})`, backgroundSize:"200%", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", animation:"wf-shimmer 5s linear infinite" }}>WealthForge</div>
            <div style={{ fontSize:9, color:T.dimmer, letterSpacing:".12em" }}>STUDENT WEALTH CO-PILOT · FREE</div>
          </div>
        </div>
        <div style={{ display:"flex", gap:6, alignItems:"center" }}>
          {[["🇨🇦","Canada"],["🇺🇸","USA"]].map(([f,k]) => (
            <motion.button key={k} whileTap={tapAnim.tap} onClick={() => setCountry(country===k?"":k)} style={hBtn(country===k)}>
              {f} {k}
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

        {/* ── Main panel ──────────────────────────────────────────────────── */}
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
                {activeTool==="loan"    && <LoanTool />}
                {activeTool==="scholar" && <ScholarshipScout />}
              </div>
            </motion.div>
          )}

          {/* Chat view */}
          {panelView==="chat" && (
            <>
              <InlineChat key={chatKey} country={country} />
              <footer style={{ padding:"6px 20px 10px", flexShrink:0, borderTop:`1px solid ${T.border}`, background:"rgba(7,9,13,0.6)" }}>
                <p style={{ fontSize:9, color:T.dimmer, lineHeight:1.55, margin:0, maxWidth:680, marginInline:"auto", textAlign:"center" }}>{FOOTER_TEXT}</p>
              </footer>
            </>
          )}
        </div>

        {/* ═══ SIDEBAR ═════════════════════════════════════════════════════ */}
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
                    </motion.button>
                  );
                })}
                <div style={{ height:1, background:T.border, margin:"12px 2px" }} />
                {/* Share button */}
                <motion.button variants={fadeUp} whileTap={tapAnim.tap} onClick={handleShare}
                  style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:7, padding:"10px 0", borderRadius:T.rsm, cursor:"pointer", fontFamily:"inherit", fontSize:11, fontWeight:600, border:`1px solid ${copied?"rgba(74,222,128,0.4)":T.border}`, background:copied?"rgba(74,222,128,0.08)":T.glass, color:copied?T.green:T.mid, transition:"all .3s" }}>
                  {copied ? <><Check size={14} /> Copied!</> : <><Share2 size={14} /> Share WealthForge</>}
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
  );
}

/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  OPTIONAL: app/api/chat/route.ts
  (The app works without this — it shows a friendly fallback message)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { anthropic } from "@ai-sdk/anthropic";
import { streamText }  from "ai";
import { NextRequest } from "next/server";
export const runtime = "edge";
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const messages     = body?.messages ?? [];
  const system       = body?.system   ?? "";
  const country      = body?.country  ?? null;
  const systemPrompt = country ? `[Student is in: ${country}]\n\n${system}` : system;
  const result = await streamText({ model: anthropic("claude-haiku-4-5-20251001"), system: systemPrompt, messages, maxTokens: 1200 });
  return result.toDataStreamResponse();
}

  npm install @ai-sdk/anthropic
  Add ANTHROPIC_API_KEY= to .env.local
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*/