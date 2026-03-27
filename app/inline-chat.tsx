"use client";

import { useState, useEffect, useRef, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send } from "lucide-react";

// ── Shared constants duplicated here to avoid circular imports ────────────────
const T = {
  bg:       "#07090d",
  text:     "#e8dcc8",
  mid:      "#9a8f7e",
  dim:      "#5a5248",
  gold:     "#c9a84c",
  goldHi:   "#f0d070",
  goldDim:  "#8a6e30",
  green:    "#4ade80",
  red:      "#f87171",
  border:   "rgba(255,255,255,0.08)",
  glass:    "rgba(255,255,255,0.03)",
  glassHi:  "rgba(255,255,255,0.06)",
  cardBg:   "rgba(255,255,255,0.025)",
  cardBorder:"rgba(255,255,255,0.10)",
  blur:     "blur(12px)",
  r:        12,
  rsm:      8,
};

const COUNTRY_CONFIG = {
  Canada: { flag:"🍁", currency:"CAD", tip:"Showing Canadian scholarships, OSAP, NSLSC loans, and high-interest savings accounts." },
  USA:    { flag:"🇺🇸", currency:"USD", tip:"Showing U.S. federal aid, Sallie Mae, SoFi, Betterment, and Roth IRA options."     },
} as const;
type CountryKey = keyof typeof COUNTRY_CONFIG;

const SYSTEM_PROMPT = `You are the WealthNutz Intelligence Co-Pilot — a world-class Quantitative Financial Advisor and AI Wealth Intelligence Engine for students in Canada and the USA. You are highly analytical, data-driven, and objective. Your mission is to help students optimize for the highest Net Worth through smart financial arbitrage.

CORE PHILOSOPHY:
You treat personal finance as a game of quantitative optimization. You always recommend the highest-yield, lowest-risk path. You are direct, specific, and never vague.

HOW YOU RESPOND:
- Give specific numbers, rates, and product names
- Compare options with data
- Always end with a clear action step
- Keep responses concise and scannable
- Use bullet points and clear structure

Focus on: scholarships, student loans, budgeting, investing (TFSA/RRSP/Roth IRA), credit building, and savings optimization.`;

const AFFILIATE_PRODUCTS = [
  { id:"eqbank",      name:"EQ Bank",       tagline:"High-Interest Savings",           logo:"🏦", country:"CA" as const, href:"https://www.eqbank.ca",          highlight:"4%+ HISA · Zero fees · CDIC insured",           badge:"Top Pick", cta:"Open Free Account"    },
  { id:"wealthsimple",name:"Wealthsimple",  tagline:"Invest & Save — Commission Free", logo:"📈", country:"CA" as const, href:"https://www.wealthsimple.com",   highlight:"Free trades · TFSA / RRSP / FHSA · Cash 4%+",  badge:"",         cta:"Start Investing Free"  },
  { id:"tangerine",   name:"Tangerine",     tagline:"No-Fee Student Banking",          logo:"🍊", country:"CA" as const, href:"https://www.tangerine.ca",       highlight:"No monthly fees · 2.5% savings · e-transfers",  badge:"",         cta:"Get Free Account"     },
  { id:"sofi",        name:"SoFi",          tagline:"Banking for Ambitious People",    logo:"🚀", country:"US" as const, href:"https://www.sofi.com",           highlight:"4.6% APY · Student loan refi · $300 bonus",     badge:"Top Pick", cta:"Claim $300 Bonus"     },
  { id:"betterment",  name:"Betterment",    tagline:"Automated Investing & Roth IRA",  logo:"🤖", country:"US" as const, href:"https://www.betterment.com",     highlight:"Auto-rebalancing · Tax-loss harvesting · No min", badge:"",        cta:"Start Investing"      },
  { id:"fidelity",    name:"Fidelity",      tagline:"Free Roth IRA & Index Funds",    logo:"📊", country:"US" as const, href:"https://www.fidelity.com",       highlight:"Zero-fee index funds · Roth IRA · Free cash mgmt",badge:"",        cta:"Open Free IRA"        },
];

const LOAN_MARKETPLACE = [
  { id:"sofi-refi",  name:"SoFi Student Loan Refinance",    rate:"From 4.49% APR",   bonus:"$300 Welcome Bonus",  badge:"Best Rate", country:"US" as const, href:"https://www.sofi.com/refinance-student-loans/", highlight:"No fees · Unemployment protection", cta:"Check My Rate" },
  { id:"earnest",    name:"Earnest Student Loans",           rate:"From 4.25% APR",   bonus:"$200 Bonus",          badge:"Flexible",  country:"US" as const, href:"https://www.earnest.com/",                     highlight:"Skip a payment option · Precision pricing", cta:"Check My Rate" },
  { id:"credible",   name:"Credible Marketplace",            rate:"Compare 8+ Lenders",bonus:"Free Comparison",   badge:"Compare",   country:"US" as const, href:"https://www.credible.com/",                    highlight:"One form · Multiple offers · No credit impact", cta:"Compare Rates" },
  { id:"nslsc",      name:"Federal Student Loans (NSLSC)",   rate:"Prime +1%",        bonus:"Grants Available",    badge:"Gov't",     country:"CA" as const, href:"https://www.csnpe-nslsc.canada.ca/",           highlight:"Repayment assistance · No credit check", cta:"Apply Now" },
  { id:"rbc-student",name:"RBC Student Line of Credit",      rate:"Prime +0%",        bonus:"$0 Annual Fee",       badge:"Low Rate",  country:"CA" as const, href:"https://www.rbc.com/student/",                 highlight:"Only pay interest while in school", cta:"Check My Rate" },
];

const MOCK_SCHOLARSHIPS = [
  { id:"ms1", type:"scholarship" as const, title:"National Merit Excellence Award",    provider:"National Foundation",       amount:"$5,000–$10,000", deadline:"March 31",    eligibility:"GPA 3.0+, any major, CA or USA", url:"#" },
  { id:"ms2", type:"scholarship" as const, title:"Future Leaders Bursary",             provider:"Community Foundation",      amount:"$2,500",         deadline:"January 31",  eligibility:"First-generation student, any year", url:"#" },
  { id:"ms3", type:"scholarship" as const, title:"STEM Advancement Grant",             provider:"Tech Industry Fund",        amount:"$4,500–$8,000",  deadline:"February 15", eligibility:"STEM major, 2nd year or above", url:"#" },
];
const MOCK_LOANS = [
  { id:"ml1", type:"loan" as const, title:"Federal Student Loan (Direct)",    provider:"U.S. Dept. of Education / NSLSC", amount:"From 5.50% APR", deadline:"Apply via FAFSA / NSLSC", eligibility:"Enrolled student, US or Canada", url:"#" },
  { id:"ml2", type:"loan" as const, title:"SoFi Student Loan Refinance",      provider:"SoFi",                           amount:"From 4.49% APR", deadline:"Open — instant pre-qual",  eligibility:"Good credit, employed or graduating", url:"https://www.sofi.com" },
];
type ScoutResult = typeof MOCK_SCHOLARSHIPS[number] | typeof MOCK_LOANS[number];

// ── Tiny shared primitives ────────────────────────────────────────────────────
const fadeUp  = { hidden:{opacity:0,y:14}, visible:{opacity:1,y:0,transition:{duration:.45}} };
const stagger = { hidden:{}, visible:{transition:{staggerChildren:.07}} };
const tapAnim = { tap:{ scale:0.96 } };

function Glass({ children, style, glow }: { children: React.ReactNode; style?: React.CSSProperties; glow?: boolean }) {
  return (
    <div style={{ background: T.cardBg, border:`1px solid ${glow ? "rgba(201,168,76,0.18)" : T.cardBorder}`, borderRadius: T.r, backdropFilter: T.blur, WebkitBackdropFilter: T.blur, ...style }}>
      {children}
    </div>
  );
}

function LogoMark({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <polygon points="16,3 29,10 29,22 16,29 3,22 3,10" stroke={T.gold} strokeWidth="2" fill="none" />
      <polygon points="16,8 24,12.5 24,19.5 16,24 8,19.5 8,12.5" fill={T.gold} opacity="0.18" />
      <text x="16" y="21" textAnchor="middle" style={{ fontFamily:"inherit", fontWeight:900, fontSize:12, fill:T.gold }}>F</text>
    </svg>
  );
}

function Chip({ label, color }: { label: string; color: string }) {
  return <span style={{ fontSize:9, padding:"2px 7px", borderRadius:20, border:`1px solid ${color}44`, color, fontWeight:700, background:`${color}14`, letterSpacing:".04em" }}>{label}</span>;
}

function GoldCTA({ href, label }: { href: string; label: string }) {
  return (
    <motion.a href={href} target="_blank" rel="noopener noreferrer" whileTap={tapAnim.tap}
      style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:6, padding:"8px 14px", borderRadius:8, background:`linear-gradient(135deg,${T.gold},${T.goldDim})`, color:"#07090d", fontWeight:700, fontSize:11, textDecoration:"none", letterSpacing:".03em" }}>
      {label}
    </motion.a>
  );
}

function AffNote() {
  return <p style={{ fontSize:9, color:"#c4b594", textAlign:"center", marginTop:10, lineHeight:1.5 }}>WealthNutz may earn a referral commission if you open an account through our links. This never affects our recommendations.</p>;
}

// ── Dots typing indicator ─────────────────────────────────────────────────────
function Dots() {
  return (
    <div style={{ display:"flex", gap:4, alignItems:"center", padding:"6px 0" }}>
      {[0,1,2].map(i => <span key={i} style={{ width:5, height:5, borderRadius:"50%", background:T.gold, animation:`wf-bounce .8s ${i*0.15}s infinite` }} />)}
    </div>
  );
}

// ── MsgText with link detection ───────────────────────────────────────────────
function MsgText({ text }: { text: string }) {
  const parts = text.split(/(https?:\/\/[^\s]+)/g);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith("http") ? (
          <a key={i} href={p} target="_blank" rel="noopener noreferrer" style={{ color:T.goldHi, textDecoration:"underline" }}>{p}</a>
        ) : (
          <span key={i}>{p}</span>
        )
      )}
    </>
  );
}

// ── TypewriterGreeting ────────────────────────────────────────────────────────
function TypewriterGreeting() {
  const phrases = ["What financial goal can I help you crush today?", "Find scholarships, compare loans, or build your budget.", "Your AI-powered financial co-pilot is ready."];
  const [pi, setPi] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [charIdx, setCharIdx] = useState(0);
  useEffect(() => {
    const phrase = phrases[pi];
    if (charIdx < phrase.length) {
      const t = setTimeout(() => { setDisplayed(phrase.slice(0, charIdx + 1)); setCharIdx(c => c + 1); }, 32);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => { setPi(p => (p + 1) % phrases.length); setDisplayed(""); setCharIdx(0); }, 2800);
      return () => clearTimeout(t);
    }
  }, [charIdx, pi]);
  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} style={{ padding:"18px 20px 0", maxWidth:720, margin:"0 auto", width:"100%" }}>
      <p style={{ fontSize:15, color:T.mid, fontStyle:"italic", margin:0, minHeight:24, lineHeight:1.5 }}>
        {displayed}<span style={{ display:"inline-block", width:2, height:14, background:T.gold, marginLeft:2, verticalAlign:"middle", animation:"wf-cur .65s steps(1) infinite" }} />
      </p>
    </motion.div>
  );
}

// ── LoanMarketplaceHero ───────────────────────────────────────────────────────
function LoanMarketplaceHero({ country }: { country: "Canada"|"USA" }) {
  const countryCode = country === "Canada" ? "CA" : "US";
  const loans = LOAN_MARKETPLACE.filter(l => l.country === countryCode);
  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" style={{ marginBottom:20 }}>
      <motion.div variants={fadeUp} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
        <span style={{ fontSize:16 }}>💰</span>
        <h3 style={{ fontSize:13, fontWeight:700, color:T.text, margin:0 }}>Loan Marketplace</h3>
        <Chip label={country === "Canada" ? "🍁 CAD" : "🇺🇸 USD"} color={T.gold} />
      </motion.div>
      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
        {loans.map(l => (
          <motion.div key={l.id} variants={fadeUp}>
            <Glass glow style={{ padding:"12px 14px" }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:6, flexWrap:"wrap", gap:6 }}>
                <div>
                  <p style={{ fontSize:12, fontWeight:700, color:T.text, margin:0 }}>{l.name}</p>
                  <p style={{ fontSize:11, color:T.goldHi, fontWeight:600, margin:"2px 0 0" }}>{l.rate}</p>
                </div>
                {l.badge && <Chip label={l.badge} color={T.gold} />}
              </div>
              <p style={{ fontSize:10, color:T.mid, margin:"0 0 8px", lineHeight:1.4 }}>{l.highlight}</p>
              {l.bonus && <p style={{ fontSize:10, color:T.green, fontWeight:600, margin:"0 0 8px" }}>+ {l.bonus}</p>}
              <GoldCTA href={l.href} label={l.cta} />
            </Glass>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// ── TopPicksSection ───────────────────────────────────────────────────────────
function TopPicksSection({ country }: { country: "Canada"|"USA" }) {
  const countryCode = country === "Canada" ? "CA" : "US";
  const picks = AFFILIATE_PRODUCTS.filter(p => p.country === countryCode).slice(0, 3);
  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" style={{ marginBottom:20 }}>
      <motion.div variants={fadeUp} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
        <span style={{ fontSize:16 }}>⭐</span>
        <h3 style={{ fontSize:13, fontWeight:700, color:T.text, margin:0 }}>Top Picks for You</h3>
      </motion.div>
      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
        {picks.map(p => (
          <motion.a key={p.id} variants={fadeUp} href={p.href} target="_blank" rel="noopener noreferrer"
            style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 12px", borderRadius:T.rsm, background:T.glass, border:`1px solid ${T.border}`, textDecoration:"none", transition:"all 0.2s" }}
            whileHover={{ borderColor:T.gold, background:T.glassHi }}>
            <span style={{ fontSize:20 }}>{p.logo}</span>
            <div style={{ flex:1 }}>
              <p style={{ fontSize:12, fontWeight:600, color:T.text, margin:0 }}>{p.name}</p>
              <p style={{ fontSize:10, color:T.mid, margin:0 }}>{p.highlight}</p>
            </div>
            {p.badge && <span style={{ fontSize:9, background:T.gold, color:"#07090d", padding:"2px 6px", borderRadius:4, fontWeight:700 }}>{p.badge}</span>}
          </motion.a>
        ))}
      </div>
    </motion.div>
  );
}

// ── Main InlineChat export ────────────────────────────────────────────────────
export default function InlineChat({ country }: { country: string }) {
  const [msgs, setMsgs] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { if (msgs.length > 0) bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, loading]);

  const submitForm = async (e: FormEvent) => {
    e.preventDefault();
    const txt = input?.trim() ?? "";
    if (!txt || loading) return;
    setMsgs(p => [...p, { role: "user", content: txt }]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...msgs, { role: "user", content: txt }], system: SYSTEM_PROMPT, country: country || null }),
      });
      if (!res.ok || !res.body) throw new Error("Network error");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      setMsgs(p => [...p, { role: "assistant", content: "" }]);
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
              setMsgs(p => { const copy = [...p]; copy[copy.length - 1] = { role: "assistant", content: acc }; return copy; });
            }
          } catch {}
        }
      }
      if (!acc) {
        setMsgs(p => { const copy = [...p]; copy[copy.length - 1] = { role: "assistant", content: "I'm here to help! Ask me anything about budgeting, scholarships, or student finances." }; return copy; });
      }
    } catch {
      setMsgs(p => [...p, { role: "assistant", content: "Couldn't reach the AI. Please try again." }]);
    }
    setLoading(false);
    inputRef.current?.focus();
  };

  const countryVal = (country === "Canada" || country === "USA") ? country : "USA";

  return (
    <>
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
        {msgs.length === 0 && (
          <div style={{ padding: "20px 20px 0", maxWidth: 900, margin: "0 auto", width: "100%" }}>
            <AnimatePresence mode="wait">
              {(country === "Canada" || country === "USA") && (
                <motion.div key={country}
                  initial={{ opacity: 0, y: -8, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -8, height: 0 }}
                  style={{ marginBottom: 14, padding: "9px 14px", borderRadius: T.rsm, background: "rgba(201,168,76,0.07)", border: "1px solid rgba(201,168,76,0.22)", display: "flex", alignItems: "center", gap: 10, overflow: "hidden" }}>
                  <span style={{ fontSize: 20 }}>{COUNTRY_CONFIG[country as CountryKey].flag}</span>
                  <p style={{ fontSize: 11, color: T.mid, margin: 0, lineHeight: 1.5 }}>
                    <span style={{ color: T.gold, fontWeight: 700 }}>{COUNTRY_CONFIG[country as CountryKey].currency} Mode —</span>{" "}
                    {COUNTRY_CONFIG[country as CountryKey].tip}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
            <LoanMarketplaceHero country={countryVal} />
            <TopPicksSection country={countryVal} />
          </div>
        )}
        {msgs.length === 0 && <TypewriterGreeting />}
        <div style={{ flex: 1, padding: "10px 20px", display: "flex", flexDirection: "column", gap: 14, maxWidth: 720, margin: "0 auto", width: "100%" }}>
          {msgs.map((m, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", alignItems: "flex-start" }}>
              {m.role === "assistant" && (
                <div style={{ width: 24, height: 24, borderRadius: 6, backgroundImage: `linear-gradient(135deg,${T.gold},${T.goldDim})`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginRight: 8, marginTop: 2 }}>
                  <LogoMark size={14} />
                </div>
              )}
              <div style={{ maxWidth: "78%", padding: "10px 14px", borderRadius: m.role === "user" ? "14px 14px 4px 14px" : "4px 14px 14px 14px", background: m.role === "user" ? "rgba(201,168,76,0.1)" : T.cardBg, border: `1px solid ${m.role === "user" ? "rgba(201,168,76,0.18)" : T.cardBorder}`, backdropFilter: T.blur, fontSize: 14, lineHeight: 1.7, color: m.role === "user" ? "#d4c080" : "#c0b8a8" }}>
                {m.role === "assistant" ? (
                  <><MsgText text={m.content ?? ""} />{loading && i === msgs.length - 1 && <span style={{ display: "inline-block", width: 2, height: 13, background: T.gold, marginLeft: 2, verticalAlign: "middle", animation: "wf-cur .65s steps(1) infinite" }} />}</>
                ) : (m.content ?? "")}
              </div>
            </motion.div>
          ))}
          {loading && msgs[msgs.length - 1]?.role !== "assistant" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: "flex", alignItems: "flex-start" }}>
              <div style={{ width: 24, height: 24, borderRadius: 6, backgroundImage: `linear-gradient(135deg,${T.gold},${T.goldDim})`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginRight: 8 }}><LogoMark size={14} /></div>
              <div style={{ padding: "10px 14px", background: T.cardBg, border: `1px solid ${T.cardBorder}`, borderRadius: "4px 14px 14px 14px", backdropFilter: T.blur }}><Dots /></div>
            </motion.div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>
      <div style={{ padding: "10px 20px", flexShrink: 0 }}>
        <form onSubmit={submitForm} style={{ maxWidth: 680, margin: "0 auto" }}>
          <Glass style={{ display: "flex", gap: 9, alignItems: "flex-end", padding: "10px 12px" }}>
            <textarea ref={inputRef} value={input ?? ""} onChange={e => setInput(e.target.value ?? "")}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); if ((input?.trim() ?? "").length > 0) e.currentTarget.form?.requestSubmit(); } }}
              placeholder="Tell me your situation — I'll tell you exactly what to do..."
              rows={1}
              style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: T.text, fontSize: 14, lineHeight: 1.6, maxHeight: 90, overflowY: "auto", padding: 0, resize: "none" }} />
            <motion.button type="submit" whileTap={tapAnim.tap} disabled={!(input?.trim()) || loading}
              style={{ width: 33, height: 33, borderRadius: 8, border: "none", cursor: (input?.trim() && !loading) ? "pointer" : "not-allowed", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", transition: "all .2s", background: (input?.trim() && !loading) ? undefined : T.glassHi, backgroundImage: (input?.trim() && !loading) ? `linear-gradient(135deg,${T.gold},${T.goldDim})` : undefined, color: (input?.trim() && !loading) ? "#07090d" : T.dim }}>
              <Send size={15} />
            </motion.button>
          </Glass>
        </form>
      </div>
    </>
  );
}
