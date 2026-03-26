"use client";

/**
 * InlineChat — extracted component to bust Next.js dev-server module cache.
 * Wraps the chat UI + CreditHealthWidget dashboard section inside InlineChat.
 */

import React, { useState, useRef, useEffect, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send } from "lucide-react";
import CreditHealthWidget from "@/components/credit-health-widget";

// ── re-exported from page so this file stays thin ──────────────────────────

// These are duplicated minimally here; the page passes them as props.
// Keeping this component pure and prop-driven avoids the stale-closure bug.

interface Msg { role: "user" | "assistant"; content: string }

interface Props {
  country: string;
  onBuildCredit: () => void;
  // Slot components passed in to keep shared state in page.tsx
  LoanMarketplaceHero: React.ComponentType<{ country: string }>;
  TopPicksSection: React.ComponentType<{ country: string }>;
  TypewriterGreeting: React.ComponentType;
  MsgText: React.ComponentType<{ text: string }>;
  Dots: React.ComponentType;
  Glass: React.ComponentType<{ style?: React.CSSProperties; children?: React.ReactNode }>;
  LogoMark: React.ComponentType<{ size?: number }>;
  SYSTEM_PROMPT: string;
  COUNTRY_CONFIG: Record<string, { flag: string; currency: string; tip: string }>;
  T: Record<string, string>;
  fadeUp: object;
  tapAnim: { tap: object };
  stagger: object;
}

export default function InlineChat({
  country,
  onBuildCredit,
  LoanMarketplaceHero,
  TopPicksSection,
  TypewriterGreeting,
  MsgText,
  Dots,
  Glass,
  LogoMark,
  SYSTEM_PROMPT,
  COUNTRY_CONFIG,
  T,
  tapAnim,
}: Props) {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const countryVal = country === "Canada" || country === "USA" ? country : "USA";

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, loading]);

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
        body: JSON.stringify({
          messages: [...msgs, { role: "user", content: txt }],
          system: SYSTEM_PROMPT,
          country: country || null,
        }),
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
            const delta =
              parsed?.delta?.text ??
              parsed?.choices?.[0]?.delta?.content ??
              "";
            if (delta) {
              acc += delta;
              setMsgs(p => {
                const copy = [...p];
                copy[copy.length - 1] = { role: "assistant", content: acc };
                return copy;
              });
            }
          } catch {}
        }
      }

      if (!acc) {
        setMsgs(p => {
          const copy = [...p];
          copy[copy.length - 1] = {
            role: "assistant",
            content:
              "I'm here to help! Ask me anything about budgeting, scholarships, or student finances.",
          };
          return copy;
        });
      }
    } catch {
      setMsgs(p => [
        ...p,
        { role: "assistant", content: "Couldn't reach the AI. Please try again." },
      ]);
    }
    setLoading(false);
    inputRef.current?.focus();
  };

  return (
    <>
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
        {msgs.length === 0 && (
          <div
            style={{ padding: "20px 20px 0", maxWidth: 900, margin: "0 auto", width: "100%" }}
            className="forge-hero-section"
          >
            {/* Country context banner */}
            <AnimatePresence mode="wait">
              {(country === "Canada" || country === "USA") && (
                <motion.div
                  key={country}
                  initial={{ opacity: 0, y: -8, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -8, height: 0 }}
                  style={{
                    marginBottom: 14,
                    padding: "9px 14px",
                    borderRadius: 10,
                    background: "rgba(201,168,76,0.07)",
                    border: "1px solid rgba(201,168,76,0.22)",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    overflow: "hidden",
                  }}
                >
                  <span style={{ fontSize: 20 }}>
                    {COUNTRY_CONFIG[country]?.flag}
                  </span>
                  <p style={{ fontSize: 11, color: T.mid, margin: 0, lineHeight: 1.5 }}>
                    <span style={{ color: T.gold, fontWeight: 700 }}>
                      {COUNTRY_CONFIG[country]?.currency} Mode —
                    </span>{" "}
                    {COUNTRY_CONFIG[country]?.tip}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <LoanMarketplaceHero country={countryVal} />

            <div
              style={{ display: "flex", gap: 16, flexWrap: "wrap" }}
              className="forge-picks-credit-row"
            >
              <div style={{ flex: "1 1 400px", minWidth: 280 }}>
                <TopPicksSection country={countryVal} />
              </div>
              <div style={{ flex: "0 0 280px" }}>
                {/* onBuildCredit is the prop — never references setShowCreditPath directly */}
                <CreditHealthWidget onBuildClick={onBuildCredit} />
              </div>
            </div>
          </div>
        )}

        {msgs.length === 0 && <TypewriterGreeting />}

        <div
          style={{
            flex: 1,
            padding: "10px 20px",
            display: "flex",
            flexDirection: "column",
            gap: 14,
            maxWidth: 720,
            margin: "0 auto",
            width: "100%",
          }}
        >
          {msgs.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                display: "flex",
                justifyContent: m.role === "user" ? "flex-end" : "flex-start",
                alignItems: "flex-start",
              }}
            >
              {m.role === "assistant" && (
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 6,
                    backgroundImage: `linear-gradient(135deg,${T.gold},${T.goldDim})`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    marginRight: 8,
                    marginTop: 2,
                  }}
                >
                  <LogoMark size={14} />
                </div>
              )}
              <div
                style={{
                  maxWidth: "78%",
                  padding: "10px 14px",
                  borderRadius:
                    m.role === "user"
                      ? "14px 14px 4px 14px"
                      : "4px 14px 14px 14px",
                  background:
                    m.role === "user" ? "rgba(201,168,76,0.1)" : T.cardBg,
                  border: `1px solid ${
                    m.role === "user"
                      ? "rgba(201,168,76,0.18)"
                      : T.cardBorder
                  }`,
                  fontSize: 14,
                  lineHeight: 1.7,
                  color: m.role === "user" ? "#d4c080" : "#c0b8a8",
                }}
              >
                {m.role === "assistant" ? (
                  <>
                    <MsgText text={m.content ?? ""} />
                    {loading && i === msgs.length - 1 && (
                      <span
                        style={{
                          display: "inline-block",
                          width: 2,
                          height: 13,
                          background: T.gold,
                          marginLeft: 2,
                          verticalAlign: "middle",
                          animation: "wf-cur .65s steps(1) infinite",
                        }}
                      />
                    )}
                  </>
                ) : (
                  m.content ?? ""
                )}
              </div>
            </motion.div>
          ))}

          {loading && msgs[msgs.length - 1]?.role !== "assistant" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ display: "flex", alignItems: "flex-start" }}
            >
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 6,
                  backgroundImage: `linear-gradient(135deg,${T.gold},${T.goldDim})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  marginRight: 8,
                }}
              >
                <LogoMark size={14} />
              </div>
              <div
                style={{
                  padding: "10px 14px",
                  background: T.cardBg,
                  border: `1px solid ${T.cardBorder}`,
                  borderRadius: "4px 14px 14px 14px",
                }}
              >
                <Dots />
              </div>
            </motion.div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input bar */}
      <div
        style={{ padding: "10px 20px 10px", flexShrink: 0 }}
        className="forge-chat-input-bar"
      >
        <form onSubmit={submitForm} style={{ maxWidth: 680, margin: "0 auto" }}>
          <Glass
            style={{
              display: "flex",
              gap: 9,
              alignItems: "flex-end",
              padding: "10px 12px",
            }}
          >
            <textarea
              ref={inputRef}
              value={input ?? ""}
              onChange={e => setInput(e.target.value ?? "")}
              onKeyDown={e => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  if ((input?.trim() ?? "").length > 0)
                    e.currentTarget.form?.requestSubmit();
                }
              }}
              placeholder="Tell me your situation — I'll tell you exactly what to do..."
              rows={1}
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                outline: "none",
                color: T.text,
                fontSize: 14,
                lineHeight: 1.6,
                maxHeight: 90,
                overflowY: "auto",
                padding: 0,
                resize: "none",
              }}
            />
            <motion.button
              type="submit"
              whileTap={tapAnim.tap}
              disabled={!(input?.trim()) || loading}
              style={{
                width: 33,
                height: 33,
                borderRadius: 8,
                border: "none",
                cursor: input?.trim() && !loading ? "pointer" : "not-allowed",
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all .2s",
                background:
                  input?.trim() && !loading ? undefined : T.glassHi,
                backgroundImage:
                  input?.trim() && !loading
                    ? `linear-gradient(135deg,${T.gold},${T.goldDim})`
                    : undefined,
                color: input?.trim() && !loading ? "#07090d" : T.dim,
              }}
            >
              <Send size={15} />
            </motion.button>
          </Glass>
        </form>
      </div>
    </>
  );
}
