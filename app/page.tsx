"use client";

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  type ReactNode,
} from "react";
import type { User } from "@supabase/supabase-js";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, UIMessage } from "ai";

// Helper to extract text from UIMessage parts
function getMessageText(msg: UIMessage): string {
  if (!msg.parts || !Array.isArray(msg.parts)) return "";
  return msg.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join("");
}
import { createClient } from "@/lib/supabase/client";

// ─── Supabase ─────────────────────────────────────────────────────────────────

const supabase = createClient();

// ─── Types ────────────────────────────────────────────────────────────────────

interface UserStats {
  id: string;
  income: number;
  needs_pct: number;
  wants_pct: number;
  savings_goal: number;
  current_saved: number;
  loan_principal: number;
  loan_rate: number;
}

// ─── Debounce hook ────────────────────────────────────────────────────────────

function useDebounce<T>(value: T, delay = 800): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

// ─── Supabase sync hook ───────────────────────────────────────────────────────

function useStatsSync(user: User | null, stats: Partial<UserStats>) {
  const debouncedStats = useDebounce(stats, 900);
  useEffect(() => {
    if (!user) return;
    supabase
      .from("user_stats")
      .upsert({ id: user.id, ...debouncedStats }, { onConflict: "id" })
      .then(({ error }) => {
        if (error) console.error("Supabase sync error:", error.message);
      });
  }, [user, debouncedStats]);
}

// ─── System Prompt ────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are WealthForge — a direct, opinionated wealth co-pilot for students in Canada and the USA. You give personalized, actionable advice like a brilliant older friend who's a certified financial planner.

CORE RULES:

1. Always personalize. If you don't know their country, income, savings, or goals — ask 2-3 short questions first before advising.
1. Be direct. Say "You should open a TFSA first" not "You might consider a TFSA."
1. Give numbered action plans. When someone shares their situation, give them a step-by-step plan they can follow this week.
1. Minimal disclaimers. Only mention "consult a professional" once at the end if genuinely complex. Never let it replace real advice.
1. Format well: use **bold** for key terms, numbered lists for action plans, bullet points for options.

KNOWLEDGE:
Canada: TFSA ($7,000/yr 2025, tax-free), RRSP (tax-deductible, best when income is high), FHSA ($8,000/yr, tax-deductible + tax-free for first home), RESP (20% CESG grant), OSAP, GST/HST credit, T4/T2202, NETFILE. Best accounts: EQ Bank (4%+ HISA), Tangerine, Simplii.
USA: Roth IRA ($7,000/yr, tax-free growth — best for most students), 529 (education), FAFSA (apply every year), federal loans before private, SAVE repayment plan, PSLF, W-2/1099, FICA, $14,600 standard deduction (2024), American Opportunity Tax Credit ($2,500/yr). Best accounts: Fidelity, Schwab, Marcus/Ally HYSA.
Both: Wealth order: (1) 1-month emergency fund, (2) employer match, (3) pay off debt >7%, (4) max tax-advantaged accounts, (5) index funds (VTI/XEQT). Credit: secured card → student card → regular, always pay full, keep utilization under 10%. 50/30/20 budgeting.`;

// ─── Shared UI ────────────────────────────────────────────────────────────────

function Slider({
  label, value, min, max, step = 1, onChange, display,
}: {
  label: string; value: number; min: number; max: number;
  step?: number; onChange: (v: number) => void; display: (v: number) => string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 11, color: "#6b6458" }}>{label}</span>
        <span style={{ fontSize: 12, color: "#C9A84C", fontWeight: 600 }}>{display(value)}</span>
      </div>
      <div style={{ position: "relative", height: 4, background: "rgba(255,255,255,0.08)", borderRadius: 4 }}>
        <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${pct}%`, background: "linear-gradient(90deg,#8B6914,#C9A84C)", borderRadius: 4 }} />
        <input
          type="range" min={min} max={max} step={step} value={value}
          onChange={e => onChange(Number(e.target.value))}
          style={{ position: "absolute", inset: 0, width: "100%", opacity: 0, cursor: "pointer", margin: 0, height: "100%" }}
        />
      </div>
    </div>
  );
}

function Badge({ children, variant = "soon" }: { children: ReactNode; variant?: "soon" | "pro" }) {
  const colors = variant === "pro"
    ? { bg: "rgba(201,168,76,0.15)", border: "rgba(201,168,76,0.35)", text: "#C9A84C" }
    : { bg: "rgba(99,102,241,0.15)", border: "rgba(99,102,241,0.3)", text: "#a5b4fc" };
  return (
    <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: ".08em", padding: "2px 6px", borderRadius: 10,
      background: colors.bg, border: `1px solid ${colors.border}`, color: colors.text }}>
      {children}
    </span>
  );
}

// ─── Auth Modal ───────────────────────────────────────────────────────────────

function AuthModal({ onClose }: { onClose: () => void }) {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setError(""); setSuccess(""); setLoading(true);
    try {
      const { error } = mode === "signin"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });
      if (error) { setError(error.message); }
      else if (mode === "signup") { setSuccess("Check your email to confirm your account!"); }
      else { onClose(); }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center",
      background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }} onClick={onClose}>
      <div style={{ width: 360, background: "#0f1115", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16,
        padding: 28, boxShadow: "0 24px 60px rgba(0,0,0,0.6)" }} onClick={e => e.stopPropagation()}>

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg,#C9A84C,#7a5c10)",
            display: "flex", alignItems: "center", justifyContent: "center" }}>
            <LogoIcon />
          </div>
          <span style={{ fontFamily: "Georgia, serif", fontSize: 18, fontWeight: 700,
            background: "linear-gradient(90deg,#E8C97A,#C9A84C)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            WealthForge
          </span>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 0, marginBottom: 20, background: "rgba(255,255,255,0.04)", borderRadius: 8, padding: 3 }}>
          {(["signin", "signup"] as const).map(m => (
            <button key={m} onClick={() => setMode(m)}
              style={{ flex: 1, padding: "7px 0", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500,
                background: mode === m ? "rgba(201,168,76,0.15)" : "transparent",
                color: mode === m ? "#C9A84C" : "#5a5040", transition: "all .2s", fontFamily: "inherit" }}>
              {m === "signin" ? "Sign In" : "Sign Up"}
            </button>
          ))}
        </div>

        {/* Fields */}
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 11, color: "#6b6458", display: "block", marginBottom: 5 }}>Email</label>
          <input
            type="email" value={email} placeholder="your@email.com"
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === "Enter" && submit()}
            style={{ width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#e8e2d8",
              fontSize: 14, outline: "none", fontFamily: "inherit", boxSizing: "border-box" }}
          />
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 11, color: "#6b6458", display: "block", marginBottom: 5 }}>Password</label>
          <input
            type="password" value={password} placeholder="••••••••"
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === "Enter" && submit()}
            style={{ width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#e8e2d8",
              fontSize: 14, outline: "none", fontFamily: "inherit", boxSizing: "border-box" }}
          />
        </div>

        {error && <p style={{ fontSize: 12, color: "#f87171", margin: "0 0 12px", background: "rgba(239,68,68,.1)", padding: "8px 10px", borderRadius: 6 }}>{error}</p>}
        {success && <p style={{ fontSize: 12, color: "#4ade80", margin: "0 0 12px", background: "rgba(34,197,94,.1)", padding: "8px 10px", borderRadius: 6 }}>{success}</p>}

        <button onClick={submit} disabled={loading || !email || !password}
          style={{ width: "100%", padding: "11px 0", borderRadius: 9, border: "none", cursor: "pointer",
            background: "linear-gradient(135deg,#C9A84C,#7a5c10)", color: "#0a0b0e",
            fontSize: 14, fontWeight: 700, fontFamily: "inherit", opacity: loading ? 0.6 : 1, transition: "opacity .2s" }}>
          {loading ? "..." : mode === "signin" ? "Sign In" : "Create Account"}
        </button>

        <button onClick={onClose}
          style={{ width: "100%", marginTop: 10, padding: "8px 0", background: "none", border: "none",
            color: "#3a3020", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>
          Cancel
        </button>
      </div>
    </div>
  );
}

// ─── Tool: Budget ─────────────────────────────────────────────────────────────

function BudgetTool({ user, initial }: { user: User | null; initial: Partial<UserStats> }) {
  const [income, setIncome] = useState(initial.income ?? 2000);
  const [needs, setNeeds] = useState(initial.needs_pct ?? 50);
  const [wants, setWants] = useState(initial.wants_pct ?? 30);
  const savings = 100 - needs - wants;
  const invalid = savings < 0;

  useStatsSync(user, { income, needs_pct: needs, wants_pct: wants });

  const cats = [
    { label: "Needs", pct: needs, color: "#22c55e", amt: income * needs / 100 },
    { label: "Wants", pct: wants, color: "#f59e0b", amt: income * wants / 100 },
    { label: "Savings", pct: Math.max(0, savings), color: "#C9A84C", amt: income * Math.max(0, savings) / 100 },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {user && <SyncIndicator />}
      <Slider label="Monthly Income" value={income} min={500} max={8000} step={50} onChange={setIncome} display={v => "$" + v.toLocaleString()} />
      <Slider label="Needs %" value={needs} min={10} max={80} onChange={setNeeds} display={v => v + "%"} />
      <Slider label="Wants %" value={wants} min={0} max={70} onChange={setWants} display={v => v + "%"} />
      <div style={{ display: "flex", height: 10, borderRadius: 5, overflow: "hidden", gap: 2 }}>
        {cats.map(c => <div key={c.label} style={{ flex: c.pct, background: c.color, transition: "flex .3s", minWidth: 0 }} />)}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
        {cats.map(c => (
          <div key={c.label} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: "10px 6px", textAlign: "center" }}>
            <div style={{ fontSize: 9, color: c.color, marginBottom: 3, fontWeight: 600, letterSpacing: ".06em" }}>{c.label.toUpperCase()}</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#f1ede6" }}>${Math.round(c.amt).toLocaleString()}</div>
            <div style={{ fontSize: 10, color: "#5a5040", marginTop: 1 }}>{c.pct}%</div>
          </div>
        ))}
      </div>
      {invalid && <Alert type="error">Needs + Wants exceed 100%</Alert>}
      {!invalid && savings >= 20 && <Alert type="gold">Saving {savings}% — excellent! 20%+ recommended.</Alert>}
    </div>
  );
}

// ─── Tool: Savings ────────────────────────────────────────────────────────────

function SavingsTool({ user, initial }: { user: User | null; initial: Partial<UserStats> }) {
  const [goal, setGoal] = useState(initial.savings_goal ?? 5000);
  const [saved, setSaved] = useState(initial.current_saved ?? 800);
  const [monthly, setMonthly] = useState(200);
  const [rate, setRate] = useState(4);

  useStatsSync(user, { savings_goal: goal, current_saved: saved });

  const remaining = Math.max(0, goal - saved);
  const pct = Math.min(100, (saved / goal) * 100);
  const r = rate / 100 / 12;
  let months = 0;
  if (remaining > 0 && monthly > 0) {
    if (r > 0 && monthly > remaining * r) months = Math.ceil(Math.log(1 + remaining * r / monthly) / Math.log(1 + r));
    else if (r <= 0) months = Math.ceil(remaining / monthly);
    else months = 999;
  }
  let interest = 0;
  if (r > 0) { let b = remaining; for (let i = 0; i < months && b > 0.01; i++) { interest += b * r; b = b + b * r - monthly; } }
  const timeStr = months <= 0 ? "Goal reached!" : months >= 999 ? "Increase contribution"
    : Math.floor(months / 12) > 0 ? `${Math.floor(months / 12)}y ${months % 12}m` : `${months} months`;
  const C = 2 * Math.PI * 32;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {user && <SyncIndicator />}
      <Slider label="Goal Amount" value={goal} min={500} max={50000} step={250} onChange={setGoal} display={v => "$" + v.toLocaleString()} />
      <Slider label="Already Saved" value={saved} min={0} max={goal} step={50} onChange={v => setSaved(Math.min(v, goal))} display={v => "$" + v.toLocaleString()} />
      <Slider label="Monthly Contribution" value={monthly} min={25} max={2000} step={25} onChange={setMonthly} display={v => "$" + v.toLocaleString()} />
      <Slider label="Interest Rate (APY)" value={rate} min={0} max={10} step={0.25} onChange={setRate} display={v => v + "%"} />
      <div style={{ display: "flex", alignItems: "center", gap: 14, background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: 14 }}>
        <svg width="80" height="80" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="7" />
          <circle cx="40" cy="40" r="32" fill="none" stroke="url(#sg)" strokeWidth="7"
            strokeDasharray={C} strokeDashoffset={C * (1 - pct / 100)}
            strokeLinecap="round" transform="rotate(-90 40 40)" style={{ transition: "stroke-dashoffset .4s" }} />
          <defs><linearGradient id="sg"><stop offset="0%" stopColor="#8B6914" /><stop offset="100%" stopColor="#E8C97A" /></linearGradient></defs>
          <text x="40" y="45" textAnchor="middle" fill="#C9A84C" fontSize="14" fontWeight="700">{Math.round(pct)}%</text>
        </svg>
        <div>
          <div style={{ fontSize: 10, color: "#5a5040", letterSpacing: ".08em", marginBottom: 4 }}>TIME TO GOAL</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#E8C97A" }}>{timeStr}</div>
          <div style={{ fontSize: 11, color: "#5a5040", marginTop: 3 }}>${saved.toLocaleString()} of ${goal.toLocaleString()}</div>
        </div>
      </div>
      {[["Remaining", "$" + remaining.toLocaleString(), false], ["Interest earned", "$" + Math.round(interest).toLocaleString(), true], ["Final", "$" + goal.toLocaleString(), false]].map(([l, v, accent]) => (
        <div key={l as string} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <span style={{ fontSize: 12, color: "#6b6458" }}>{l}</span>
          <span style={{ fontSize: 13, color: accent ? "#C9A84C" : "#c0b8a8", fontWeight: accent ? 700 : 400 }}>{v}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Tool: Loan ───────────────────────────────────────────────────────────────

function LoanTool({ user, initial }: { user: User | null; initial: Partial<UserStats> }) {
  const [principal, setPrincipal] = useState(initial.loan_principal ?? 25000);
  const [rate, setRate] = useState(initial.loan_rate ?? 5.5);
  const [years, setYears] = useState(10);
  const [extra, setExtra] = useState(0);

  useStatsSync(user, { loan_principal: principal, loan_rate: rate });

  const r = rate / 100 / 12, n = years * 12;
  const base = r > 0 ? principal * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1) : principal / n;
  const totalBase = base * n, totalInt = totalBase - principal;
  let bal = principal, mo = 0, intExtra = 0;
  while (bal > 0.01 && mo < 600) { const i = bal * r; intExtra += i; bal = Math.max(0, bal + i - base - extra); mo++; }
  const saved = totalInt - intExtra, savedMo = n - mo;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {user && <SyncIndicator />}
      <Slider label="Loan Amount" value={principal} min={1000} max={100000} step={500} onChange={setPrincipal} display={v => "$" + v.toLocaleString()} />
      <Slider label="Interest Rate" value={rate} min={0.5} max={15} step={0.25} onChange={setRate} display={v => v + "%"} />
      <Slider label="Term" value={years} min={1} max={25} onChange={setYears} display={v => v + " yrs"} />
      <Slider label="Extra Monthly" value={extra} min={0} max={600} step={10} onChange={setExtra} display={v => "$" + v} />
      <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
          <span style={{ fontSize: 10, color: "#5a5040", letterSpacing: ".06em" }}>MONTHLY PAYMENT</span>
          <span style={{ fontSize: 24, fontWeight: 800, color: "#E8C97A" }}>${Math.round(base).toLocaleString()}</span>
        </div>
        {[["Total paid", "$" + Math.round(totalBase).toLocaleString()], ["Total interest", "$" + Math.round(totalInt).toLocaleString()]].map(([l, v]) => (
          <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
            <span style={{ fontSize: 12, color: "#6b6458" }}>{l}</span>
            <span style={{ fontSize: 13, color: "#c0b8a8" }}>{v}</span>
          </div>
        ))}
      </div>
      {extra > 0 && (
        <div style={{ background: "rgba(34,197,94,.08)", border: "1px solid rgba(34,197,94,.2)", borderRadius: 12, padding: 14 }}>
          <div style={{ fontSize: 10, color: "#4ade80", marginBottom: 8, letterSpacing: ".06em" }}>WITH EXTRA ${extra}/MO</div>
          {[["Interest saved", "$" + Math.round(saved).toLocaleString(), true], ["Months sooner", savedMo > 0 ? savedMo + " months" : "—", false], ["New payoff", `${Math.floor(mo / 12)}y ${mo % 12}m`, false]].map(([l, v, accent]) => (
            <div key={l as string} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderTop: "1px solid rgba(34,197,94,.1)" }}>
              <span style={{ fontSize: 12, color: "#6b6458" }}>{l}</span>
              <span style={{ fontSize: 13, color: accent ? "#4ade80" : "#c0b8a8", fontWeight: accent ? 700 : 400 }}>{v}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Small helpers ────────────────────────────────────────────────────────────

function SyncIndicator() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10, color: "#4a4030" }}>
      <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#C9A84C", opacity: 0.7,
        animation: "wf-pulse 2s ease infinite" }} />
      Syncing to cloud
    </div>
  );
}

function Alert({ children, type }: { children: ReactNode; type: "error" | "gold" }) {
  const s = type === "error"
    ? { bg: "rgba(239,68,68,.12)", border: "rgba(239,68,68,.25)", color: "#f87171" }
    : { bg: "rgba(201,168,76,.1)", border: "rgba(201,168,76,.2)", color: "#b8952a" };
  return (
    <div style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: 8, padding: "8px 12px", fontSize: 12, color: s.color }}>
      {children}
    </div>
  );
}

function LogoIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="7" width="20" height="10" rx="2" fill="#C9A84C" />
      <rect x="4" y="9" width="16" height="6" rx="1" fill="#E8C97A" opacity=".5" />
      <line x1="8" y1="7" x2="8" y2="17" stroke="#8B6914" strokeWidth=".8" />
      <line x1="12" y1="7" x2="12" y2="17" stroke="#8B6914" strokeWidth=".8" />
      <line x1="16" y1="7" x2="16" y2="17" stroke="#8B6914" strokeWidth=".8" />
    </svg>
  );
}

function MsgText({ text }: { text: string }) {
  return (
    <div>
      {text.split("\n").map((line, i) => {
        const parts = line.split(/(\*\*[^*]+\*\*)/g).map((p, j) =>
          p.startsWith("**") && p.endsWith("**")
            ? <strong key={j} style={{ color: "#E8C97A" }}>{p.slice(2, -2)}</strong>
            : p
        );
        if (/^[-•]\s/.test(line)) return (
          <div key={i} style={{ display: "flex", gap: 8, marginBottom: 3 }}>
            <span style={{ color: "#C9A84C", flexShrink: 0 }}>▸</span>
            <span>{parts.map((p) => typeof p === "string" ? p.replace(/^[-•]\s/, "") : p)}</span>
          </div>
        );
        if (/^\d+\.\s/.test(line)) return (
          <div key={i} style={{ display: "flex", gap: 8, marginBottom: 4 }}>
            <span style={{ color: "#C9A84C", flexShrink: 0, minWidth: 18, fontWeight: 700 }}>{line.match(/^\d+/)![0]}.</span>
            <span>{parts.map((p) => typeof p === "string" ? p.replace(/^\d+\.\s/, "") : p)}</span>
          </div>
        );
        return <p key={i} style={{ margin: line === "" ? "5px 0" : "1px 0" }}>{parts}</p>;
      })}
    </div>
  );
}

function Dots() {
  return (
    <div style={{ display: "flex", gap: 5, padding: "2px 0" }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: "#C9A84C", opacity: .7,
          animation: "wf-bounce 1.2s infinite", animationDelay: `${i * .2}s` }} />
      ))}
    </div>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────

const Ico = {
  send: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  budget: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="2" y1="20" x2="22" y2="20" /><line x1="6" y1="14" x2="6" y2="20" /><line x1="12" y1="11" x2="12" y2="20" /><line x1="18" y1="8" x2="18" y2="20" /></svg>,
  savings: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>,
  loan: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>,
  scholarship: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></svg>,
  loanmatch: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /><line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" /></svg>,
  tax: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><line x1="10" y1="9" x2="8" y2="9" /></svg>,
  user: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>,
  trash: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6M9 6V4h6v2" /></svg>,
  back: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6" /></svg>,
};

// ─── Sidebar config ───────────────────────────────────────────────────────────

const ACTIVE_TOOLS = [
  { id: "budget",  label: "Budget",  Icon: Ico.budget },
  { id: "savings", label: "Savings", Icon: Ico.savings },
  { id: "loan",    label: "Loan",    Icon: Ico.loan },
];

const COMING_TOOLS = [
  { id: "scholarship", label: "Scholarships", Icon: Ico.scholarship, badge: "soon" as const },
  { id: "loanmatch",   label: "Loan Matcher", Icon: Ico.loanmatch,   badge: "soon" as const },
  { id: "tax",         label: "Tax Prep",     Icon: Ico.tax,         badge: "pro" as const },
];

const STARTERS = [
  "What should I do with my money right now?",
  "Give me a step-by-step savings plan",
  "Should I pay off debt or invest first?",
  "I have $500/month — where does it go?",
  "How do I build credit from zero?",
  "What accounts should I open as a student?",
];

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function WealthForgePage() {
  // Auth
  const [user, setUser] = useState<User | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [userStats, setUserStats] = useState<Partial<UserStats>>({});

  // UI
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [panelView, setPanelView] = useState<"chat" | "tool">("chat");
  const [country, setCountry] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Vercel AI SDK useChat
  const { messages, sendMessage, status, setMessages } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: { system: SYSTEM_PROMPT, country },
    }),
    onError: (err) => console.error("Chat error:", err),
  });
  
  const isLoading = status === "streaming" || status === "submitted";

  // Auth listener
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      if (data.session?.user) loadStats(data.session.user.id);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) loadStats(session.user.id);
      else setUserStats({});
    });
    return () => subscription.unsubscribe();
  }, []);

  const loadStats = async (userId: string) => {
    const { data } = await supabase.from("user_stats").select("*").eq("id", userId).single();
    if (data) setUserStats(data);
  };

  // Scroll to bottom on new messages
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isLoading]);

  const clearChat = useCallback(() => {
    setMessages([]);
    setInput("");
  }, [setMessages]);

  const openTool = (id: string) => {
    setActiveTool(id);
    setPanelView("tool");
  };

  const empty = messages.length === 0;

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: "#0a0b0e",
      color: "#e8e2d8", fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif", overflow: "hidden" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Cormorant+Garamond:wght@600;700&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: #2a2620; border-radius: 3px; }
        textarea, input { font-family: inherit; }
        input[type=range] { -webkit-appearance: none; appearance: none; background: transparent; cursor: pointer; }
        @keyframes wf-bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-5px)} }
        @keyframes wf-in     { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes wf-shimmer{ 0%{background-position:200%} 100%{background-position:-200%} }
        @keyframes wf-cursor { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes wf-pulse  { 0%,100%{opacity:1} 50%{opacity:0.4} }
        .wf-chip:hover { border-color:#C9A84C!important; color:#E8C97A!important; background:rgba(201,168,76,0.08)!important; }
        .wf-sb-btn:hover { background:rgba(255,255,255,0.05)!important; color:#8a7040!important; }
        .wf-active-tool { background:rgba(201,168,76,0.12)!important; color:#C9A84C!important; border-color:rgba(201,168,76,0.35)!important; }
      `}</style>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}

      {/* ── Header ── */}
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "11px 18px", borderBottom: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(10,11,14,0.98)", flexShrink: 0, zIndex: 10 }}>

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <div style={{ width: 30, height: 30, borderRadius: 7, background: "linear-gradient(135deg,#C9A84C,#7a5c10)",
            display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 14px rgba(201,168,76,0.28)" }}>
            <LogoIcon />
          </div>
          <div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 700,
              background: "linear-gradient(90deg,#E8C97A,#C9A84C,#a07830,#E8C97A)", backgroundSize: "200%",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", animation: "wf-shimmer 5s linear infinite" }}>
              WealthForge
            </div>
            <div style={{ fontSize: 9, color: "#3a3020", letterSpacing: ".1em" }}>STUDENT WEALTH CO-PILOT</div>
          </div>
        </div>

        {/* Right controls */}
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          {/* Country toggles */}
          {[["CA", "Canada"], ["US", "USA"]].map(([f, k]) => (
            <button key={k} onClick={() => setCountry(country === k ? null : k)}
              style={{ padding: "4px 9px", borderRadius: 20, border: `1px solid ${country === k ? "#C9A84C" : "rgba(255,255,255,0.08)"}`,
                background: country === k ? "rgba(201,168,76,0.12)" : "transparent",
                color: country === k ? "#C9A84C" : "#4a4030", fontSize: 11, cursor: "pointer",
                fontFamily: "inherit", transition: "all .2s" }}>
              {f} {k}
            </button>
          ))}

          {/* Clear chat */}
          {messages.length > 0 && (
            <button onClick={clearChat} title="Clear chat"
              style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 9px", borderRadius: 20,
                border: "1px solid rgba(255,255,255,0.08)", background: "transparent",
                color: "#4a4030", fontSize: 11, cursor: "pointer", fontFamily: "inherit", transition: "all .2s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = "#f87171"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(239,68,68,0.35)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = "#4a4030"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.08)"; }}>
              <Ico.trash /> Clear
            </button>
          )}

          {/* Auth */}
          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 11, color: "#6b5e40", maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {user.email}
              </span>
              <button onClick={() => supabase.auth.signOut()}
                style={{ padding: "4px 9px", borderRadius: 20, border: "1px solid rgba(255,255,255,0.08)",
                  background: "transparent", color: "#4a4030", fontSize: 11, cursor: "pointer", fontFamily: "inherit", transition: "all .2s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = "#f87171"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = "#4a4030"; }}>
                Sign Out
              </button>
            </div>
          ) : (
            <button onClick={() => setShowAuth(true)}
              style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 12px", borderRadius: 20,
                border: "1px solid rgba(201,168,76,0.3)", background: "rgba(201,168,76,0.1)",
                color: "#C9A84C", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", transition: "all .2s" }}>
              <Ico.user /> Sign In
            </button>
          )}
        </div>
      </header>

      {/* ── Body ── */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {/* ── Main Panel (Chat or Tool) ── */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

          {/* Tool panel */}
          {panelView === "tool" && activeTool && (() => {
            const t = ACTIVE_TOOLS.find(t => t.id === activeTool);
            const coming = COMING_TOOLS.find(t => t.id === activeTool);
            return (
              <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", animation: "wf-in .2s ease" }}>
                <div style={{ padding: "12px 18px", borderBottom: "1px solid rgba(255,255,255,0.06)",
                  display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                  <button onClick={() => setPanelView("chat")}
                    style={{ background: "none", border: "none", color: "#6b5e40", cursor: "pointer", padding: 2,
                      display: "flex", alignItems: "center", borderRadius: 6 }}>
                    <Ico.back />
                  </button>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#C9A84C" }}>
                    {t?.label ?? coming?.label} {coming && <Badge variant={coming.badge}>{coming.badge === "pro" ? "PRO ONLY" : "COMING SOON"}</Badge>}
                  </span>
                </div>
                <div style={{ flex: 1, overflowY: "auto", padding: 18 }}>
                  {t?.id === "budget" && <BudgetTool user={user} initial={userStats} />}
                  {t?.id === "savings" && <SavingsTool user={user} initial={userStats} />}
                  {t?.id === "loan" && <LoanTool user={user} initial={userStats} />}
                  {coming && (
                    <div style={{ textAlign: "center", paddingTop: 40 }}>
                      <div style={{ fontSize: 32, marginBottom: 12 }}>{coming.id === "scholarship" ? "Scholarships" : coming.id === "loanmatch" ? "Loan Matcher" : "Tax Prep"}</div>
                      <div style={{ fontSize: 16, fontWeight: 600, color: "#C9A84C", marginBottom: 8 }}>{coming.label}</div>
                      <Badge variant={coming.badge}>{coming.badge === "pro" ? "PRO ONLY" : "COMING SOON"}</Badge>
                      <p style={{ fontSize: 13, color: "#4a4438", marginTop: 12, lineHeight: 1.6, maxWidth: 260, marginInline: "auto" }}>
                        {coming.id === "scholarship" ? "AI-powered scholarship matching based on your profile, GPA, and interests." :
                         coming.id === "loanmatch" ? "Compare federal vs private loans and find the best rates for your situation." :
                         "Step-by-step tax filing guidance for Canadian and US students — T4s, W-2s, refunds, and credits."}
                      </p>
                      {!user && (
                        <button onClick={() => setShowAuth(true)}
                          style={{ marginTop: 16, padding: "9px 20px", borderRadius: 20, border: "none",
                            background: "linear-gradient(135deg,#C9A84C,#7a5c10)", color: "#0a0b0e",
                            fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                          Sign In to Get Notified
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })()}

          {/* Chat panel */}
          {panelView === "chat" && (
            <>
              <div style={{ flex: 1, overflowY: "auto", padding: "18px 18px 0" }}>
                {empty ? (
                  <div style={{ maxWidth: 560, margin: "0 auto", paddingTop: 28, animation: "wf-in .5s ease" }}>
                    <div style={{ textAlign: "center", marginBottom: 26 }}>
                      <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(26px,4.5vw,40px)",
                        fontWeight: 700, lineHeight: 1.15, margin: "0 0 10px",
                        background: "linear-gradient(175deg,#f5ead0,#C9A84C 50%,#8B6914)",
                        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                        Your Money.<br />Your Future.<br />Forged Here.
                      </h1>
                      <p style={{ color: "#4a4438", fontSize: 14, margin: 0, lineHeight: 1.65, maxWidth: 320, marginInline: "auto" }}>
                        Tell me your situation. I&apos;ll give you a real, personalized plan — not generic tips.
                      </p>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7, marginBottom: 20 }}>
                      {STARTERS.map((q, i) => (
                        <button key={i} className="wf-chip"
                          onClick={() => { setInput(q); setTimeout(() => inputRef.current?.form?.requestSubmit(), 0); }}
                          style={{ padding: "10px 12px", background: "rgba(255,255,255,0.03)",
                            border: "1px solid rgba(255,255,255,0.07)", borderRadius: 9,
                            color: "#7a7060", fontSize: 12, textAlign: "left", cursor: "pointer",
                            lineHeight: 1.4, transition: "all .2s", fontFamily: "inherit",
                            animation: `wf-in .4s ease ${i * .055}s both` }}>
                          {q}
                        </button>
                      ))}
                    </div>
                    <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 14 }}>
                      <p style={{ fontSize: 10, color: "#2a2418", margin: "0 0 9px", letterSpacing: ".06em" }}>FINANCIAL TOOLS</p>
                      <div style={{ display: "flex", gap: 7 }}>
                        {ACTIVE_TOOLS.map(t => (
                          <button key={t.id} onClick={() => openTool(t.id)}
                            style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 5,
                              padding: "11px 6px", background: "rgba(255,255,255,0.03)",
                              border: "1px solid rgba(255,255,255,0.07)", borderRadius: 9,
                              color: "#6b5e40", cursor: "pointer", fontFamily: "inherit", transition: "all .2s", fontSize: 11 }}
                            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(201,168,76,0.3)"; (e.currentTarget as HTMLButtonElement).style.color = "#C9A84C"; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.07)"; (e.currentTarget as HTMLButtonElement).style.color = "#6b5e40"; }}>
                            <t.Icon />{t.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={{ maxWidth: 640, margin: "0 auto", display: "flex", flexDirection: "column", gap: 13 }}>
                    {messages.map((m, i) => (
                      <div key={m.id} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start",
                        animation: "wf-in .25s ease" }}>
                        {m.role === "assistant" && (
                          <div style={{ width: 24, height: 24, borderRadius: 6, background: "linear-gradient(135deg,#C9A84C,#7a5c10)",
                            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                            marginRight: 8, marginTop: 2, boxShadow: "0 0 8px rgba(201,168,76,0.18)" }}>
                            <LogoIcon />
                          </div>
                        )}
                        <div style={{ maxWidth: "78%", padding: "9px 13px",
                          borderRadius: m.role === "user" ? "13px 13px 3px 13px" : "3px 13px 13px 13px",
                          background: m.role === "user" ? "rgba(201,168,76,0.1)" : "rgba(255,255,255,0.04)",
                          border: `1px solid ${m.role === "user" ? "rgba(201,168,76,0.18)" : "rgba(255,255,255,0.07)"}`,
                          fontSize: 14, lineHeight: 1.7,
                          color: m.role === "user" ? "#d4c080" : "#c0b8a8" }}>
                          {m.role === "assistant" ? (
                            <>
                              <MsgText text={getMessageText(m)} />
                              {/* Blinking cursor on last streaming message */}
                              {isLoading && i === messages.length - 1 && (
                                <span style={{ display: "inline-block", width: 2, height: 13, background: "#C9A84C",
                                  marginLeft: 2, verticalAlign: "middle", animation: "wf-cursor .7s steps(1) infinite" }} />
                              )}
                            </>
                          ) : getMessageText(m)}
                        </div>
                      </div>
                    ))}
                    {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
                      <div style={{ display: "flex", alignItems: "flex-start" }}>
                        <div style={{ width: 24, height: 24, borderRadius: 6, background: "linear-gradient(135deg,#C9A84C,#7a5c10)",
                          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginRight: 8 }}>
                          <LogoIcon />
                        </div>
                        <div style={{ padding: "9px 13px", background: "rgba(255,255,255,0.04)",
                          border: "1px solid rgba(255,255,255,0.07)", borderRadius: "3px 13px 13px 13px" }}>
                          <Dots />
                        </div>
                      </div>
                    )}
                    <div ref={bottomRef} />
                  </div>
                )}
              </div>

              {/* Input */}
              <div style={{ padding: "10px 18px 15px", flexShrink: 0 }}>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  if (!input.trim() || isLoading) return;
                  sendMessage({ text: input });
                  setInput("");
                }} style={{ maxWidth: 640, margin: "0 auto" }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "flex-end",
                    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)",
                    borderRadius: 11, padding: "9px 11px" }}>
                    <textarea
                      ref={inputRef} value={input} onChange={e => setInput(e.target.value)}
                      onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); e.currentTarget.form?.requestSubmit(); } }}
                      placeholder="Tell me your situation — I'll tell you exactly what to do..."
                      rows={1}
                      style={{ flex: 1, background: "transparent", border: "none", outline: "none",
                        color: "#e8e2d8", fontSize: 14, lineHeight: 1.6, maxHeight: 90, overflowY: "auto", padding: 0, resize: "none" }}
                    />
                    <button type="submit" disabled={!input.trim() || isLoading}
                      style={{ width: 32, height: 32, borderRadius: 7, border: "none", cursor: "pointer", flexShrink: 0,
                        background: input.trim() && !isLoading ? "linear-gradient(135deg,#C9A84C,#7a5c10)" : "rgba(255,255,255,0.06)",
                        color: input.trim() && !isLoading ? "#0a0b0e" : "#3a3020",
                        display: "flex", alignItems: "center", justifyContent: "center", transition: "all .2s" }}>
                      <Ico.send />
                    </button>
                  </div>
                  <p style={{ textAlign: "center", fontSize: 10, color: "#1e1a12", margin: "5px 0 0" }}>
                    General financial education — not personalized legal or tax advice.
                  </p>
                </form>
              </div>
            </>
          )}
        </div>

        {/* ── Sidebar ── */}
        <aside style={{ width: 52, flexShrink: 0, background: "rgba(255,255,255,0.015)",
          borderLeft: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column",
          alignItems: "center", paddingTop: 12, gap: 4 }}>

          {/* Active tools */}
          {ACTIVE_TOOLS.map(t => (
            <button key={t.id} className={`wf-sb-btn${activeTool === t.id && panelView === "tool" ? " wf-active-tool" : ""}`}
              onClick={() => openTool(t.id)} title={t.label}
              style={{ width: 36, height: 36, borderRadius: 8, border: `1px solid ${activeTool === t.id && panelView === "tool" ? "rgba(201,168,76,0.35)" : "transparent"}`,
                background: activeTool === t.id && panelView === "tool" ? "rgba(201,168,76,0.12)" : "transparent",
                color: activeTool === t.id && panelView === "tool" ? "#C9A84C" : "#3a3228",
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all .2s" }}>
              <t.Icon />
            </button>
          ))}

          {/* Divider */}
          <div style={{ width: 24, height: 1, background: "rgba(255,255,255,0.06)", margin: "4px 0" }} />

          {/* Coming soon tools */}
          {COMING_TOOLS.map(t => (
            <button key={t.id} className="wf-sb-btn" onClick={() => openTool(t.id)} title={t.label}
              style={{ width: 36, height: 36, borderRadius: 8, border: "1px solid transparent",
                background: "transparent", color: "#2a2420", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all .2s", position: "relative" }}>
              <t.Icon />
              {/* Dot indicator */}
              <span style={{ position: "absolute", top: 5, right: 5, width: 5, height: 5, borderRadius: "50%",
                background: t.badge === "pro" ? "#C9A84C" : "#6366f1", opacity: 0.7 }} />
            </button>
          ))}
        </aside>
      </div>
    </div>
  );
}
