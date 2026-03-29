/* build:v200 — WealthNutz Contact Page — dark mode, gold branding */
"use client";

import { useState } from "react";

const GOLD = "#C9A84C";
const GOLD_DIM = "#8B6914";
const BG = "#050505";
const CARD = "rgba(255,255,255,0.03)";
const BORDER = "rgba(255,255,255,0.08)";
const GOLD_BORDER = "rgba(201,168,76,0.18)";
const TEXT = "#E8DCC8";
const MID = "#9A8F7E";
const DIM = "#5A5248";
const INPUT_BG = "rgba(255,255,255,0.04)";

const CONTACT_INFO = [
  { icon: "✉️", label: "Email", value: "wealthnutz.official@gmail.com", sub: "Fastest response — typically within 24 hours" },
  { icon: "🐦", label: "X / Twitter", value: "@WealthNutz", sub: "DMs open for quick questions" },
  { icon: "📍", label: "Based In", value: "North America", sub: "Supporting students across Canada & USA" },
];

export default function ContactPage() {
  const [name, setName]           = useState("");
  const [email, setEmail]         = useState("");
  const [reason, setReason]       = useState("General Inquiry");
  const [message, setMessage]     = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [focused, setFocused]     = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setName(""); setEmail(""); setReason("General Inquiry"); setMessage(""); setSubmitted(false);
    }, 4000);
  };

  const inputStyle = (field: string): React.CSSProperties => ({
    width: "100%",
    padding: "12px 14px",
    fontSize: 14,
    background: INPUT_BG,
    border: `1.5px solid ${focused === field ? GOLD : BORDER}`,
    borderRadius: 10,
    fontFamily: "inherit",
    color: TEXT,
    boxSizing: "border-box",
    outline: "none",
    transition: "border-color .2s",
  });

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: 11,
    fontWeight: 700,
    color: MID,
    marginBottom: 8,
    letterSpacing: ".08em",
    textTransform: "uppercase",
  };

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
        <span style={{ fontSize: 14, color: MID, fontWeight: 500 }}>Contact</span>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "60px 24px 80px" }}>
        {/* ── Hero ──────────────────────────────────────── */}
        <div style={{ marginBottom: 52, textAlign: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 56, height: 56, borderRadius: 16, background: `linear-gradient(135deg, ${GOLD}, ${GOLD_DIM})`, marginBottom: 20, boxShadow: "0 0 32px rgba(201,168,76,0.25)" }}>
            <span style={{ fontSize: 24 }}>📬</span>
          </div>
          <h1 style={{ fontSize: "clamp(28px,6vw,42px)", fontWeight: 900, color: TEXT, margin: "0 0 12px", letterSpacing: "-0.03em" }}>
            Get in Touch
          </h1>
          <p style={{ fontSize: 16, color: MID, margin: 0, lineHeight: 1.6 }}>
            Have a question, feature request, or just want to say hi? We would love to hear from you.
          </p>
        </div>

        {/* ── Contact Info Cards ────────────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12, marginBottom: 28 }}>
          {CONTACT_INFO.map(info => (
            <div key={info.label}
              style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: "20px 22px", display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                <span style={{ fontSize: 20 }}>{info.icon}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: GOLD, letterSpacing: ".08em", textTransform: "uppercase" }}>{info.label}</span>
              </div>
              <p style={{ fontSize: 14, fontWeight: 700, color: TEXT, margin: 0 }}>{info.value}</p>
              <p style={{ fontSize: 12, color: DIM, margin: 0, lineHeight: 1.4 }}>{info.sub}</p>
            </div>
          ))}
        </div>

        {/* ── Contact Form ──────────────────────────────── */}
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: "32px 28px" }}>
          {submitted ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 280, gap: 16, textAlign: "center" }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(74,222,128,0.12)", border: "1px solid rgba(74,222,128,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>✓</div>
              <h3 style={{ fontSize: 20, fontWeight: 800, color: TEXT, margin: 0 }}>Message Sent!</h3>
              <p style={{ fontSize: 14, color: MID, margin: 0, lineHeight: 1.5 }}>
                Thanks for reaching out. We will get back to you at <span style={{ color: GOLD }}>{email}</span> within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <p style={{ fontSize: 11, fontWeight: 700, color: GOLD, letterSpacing: ".1em", textTransform: "uppercase", margin: "0 0 24px" }}>Send a Message</p>

              {/* Name + Email row */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
                <div>
                  <label style={labelStyle}>Name</label>
                  <input
                    type="text" value={name} onChange={e => setName(e.target.value)}
                    placeholder="Your name" required
                    onFocus={() => setFocused("name")} onBlur={() => setFocused(null)}
                    style={inputStyle("name")}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Email</label>
                  <input
                    type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="your@email.com" required
                    onFocus={() => setFocused("email")} onBlur={() => setFocused(null)}
                    style={inputStyle("email")}
                  />
                </div>
              </div>

              {/* Reason */}
              <div style={{ marginBottom: 20 }}>
                <label style={labelStyle}>Reason for Inquiry</label>
                <select value={reason} onChange={e => setReason(e.target.value)}
                  onFocus={() => setFocused("reason")} onBlur={() => setFocused(null)}
                  style={{ ...inputStyle("reason"), cursor: "pointer" }}>
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Scholarship Submission">Scholarship Submission</option>
                  <option value="Technical Support">Technical Support</option>
                  <option value="Partnership">Partnership / Business</option>
                  <option value="Feedback">Product Feedback</option>
                  <option value="Account">Account Issue</option>
                </select>
              </div>

              {/* Message */}
              <div style={{ marginBottom: 28 }}>
                <label style={labelStyle}>Message</label>
                <textarea
                  value={message} onChange={e => setMessage(e.target.value)}
                  placeholder="Tell us how we can help..." required rows={5}
                  onFocus={() => setFocused("message")} onBlur={() => setFocused(null)}
                  style={{ ...inputStyle("message"), resize: "vertical", minHeight: 120 } as React.CSSProperties}
                />
              </div>

              {/* Submit */}
              <button type="submit"
                style={{ width: "100%", padding: "14px", fontSize: 14, fontWeight: 800, letterSpacing: ".06em", textTransform: "uppercase", color: "#07090d", background: `linear-gradient(135deg, ${GOLD}, ${GOLD_DIM})`, border: "none", borderRadius: 10, cursor: "pointer", boxShadow: "0 0 24px rgba(201,168,76,0.25)", transition: "box-shadow .2s, transform .15s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.015)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}>
                Send Message →
              </button>

              <p style={{ fontSize: 11, color: DIM, textAlign: "center", margin: "14px 0 0", lineHeight: 1.5 }}>
                We respect your privacy. Your info is never shared with third parties.
              </p>
            </form>
          )}
        </div>

        {/* ── Help Center link ──────────────────────────── */}
        <div style={{ marginTop: 36, display: "flex", justifyContent: "center" }}>
          <p style={{ fontSize: 14, color: MID, margin: 0 }}>
            Looking for quick answers?{" "}
            <a href="/help" style={{ color: GOLD, textDecoration: "none", fontWeight: 600 }}>Visit our Help Center →</a>
          </p>
        </div>
      </div>

      {/* ── Footer ────────────────────────────────────── */}
      <div style={{ borderTop: `1px solid ${BORDER}`, padding: "20px 24px", display: "flex", justifyContent: "center", gap: 24, flexWrap: "wrap" }}>
        {[["Home", "/"], ["Help Center", "/help"], ["Privacy Policy", "/privacy"], ["Terms", "/terms"]].map(([label, href]) => (
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
