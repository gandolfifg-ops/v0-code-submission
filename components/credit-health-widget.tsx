"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp } from "lucide-react";

// ── Theme tokens (duplicated from page to keep this file self-contained) ─────
const T = {
  bg: "#07090d", text: "#e8dcc8", mid: "#8a7d6b", dim: "#3a3228", dimmer: "#2A2218",
  gold: "#c9a84c", goldHi: "#e8c96a", goldDim: "#a07830", glow: "rgba(201,168,76,.25)",
  green: "#4ade80", red: "#f87171",
  border: "rgba(255,255,255,0.07)", cardBg: "rgba(255,255,255,0.03)",
  cardBorder: "rgba(255,255,255,0.06)", glass: "rgba(255,255,255,0.04)",
  glassHi: "rgba(255,255,255,0.08)", blur: "blur(12px)",
  r: "12px", rsm: "8px",
};

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

// ── What-If Scenarios ─────────────────────────────────────────────────────────
const WHAT_IF_SCENARIOS = [
  {
    id: "payoff_cc",
    label: "Pay off $500 CC debt",
    delta: +15,
    color: "#4ade80",
    tip: "Payment history makes up 35% of your total score. Paying down balances also lowers your credit utilization ratio — the second biggest factor at 30%.",
  },
  {
    id: "miss_bill",
    label: "Miss a phone bill payment",
    delta: -40,
    color: "#f87171",
    tip: "A single missed payment can stay on your report for up to 7 years. Payment history is the most heavily weighted factor across all major scoring models.",
  },
  {
    id: "new_card",
    label: "Open a new credit card",
    delta: -5,
    color: "#fbbf24",
    tip: "Opening new credit triggers a hard inquiry, temporarily dinging your score. Long-term, a higher limit improves your utilization ratio if you keep balances low.",
  },
];

const BASE_SCORE = 724;

// ── Component ─────────────────────────────────────────────────────────────────
export default function CreditHealthWidget({
  onBuildClick,
}: {
  onBuildClick: () => void;
}) {
  const [toggled, setToggled] = useState<Record<string, boolean>>({});
  const [showWhatIf, setShowWhatIf] = useState(false);

  const score = useMemo(() => {
    let s = BASE_SCORE;
    WHAT_IF_SCENARIOS.forEach(sc => {
      if (toggled[sc.id]) s += sc.delta;
    });
    return Math.max(300, Math.min(850, s));
  }, [toggled]);

  const delta = score - BASE_SCORE;
  const scoreColor = score >= 750 ? T.green : score >= 670 ? T.gold : T.red;
  const scoreLabel =
    score >= 750 ? "Excellent" : score >= 670 ? "Good" : score >= 580 ? "Fair" : "Poor";

  const CX = 72, CY = 66, R = 52;
  const pct = (score - 300) / (850 - 300);
  const angleRad = Math.PI - pct * Math.PI;
  const needleX = CX + R * Math.cos(angleRad);
  const needleY = CY - R * Math.sin(angleRad);

  const activeTip = [...WHAT_IF_SCENARIOS].reverse().find(sc => toggled[sc.id]);
  const toggle = (id: string) =>
    setToggled(prev => ({ ...prev, [id]: !prev[id] }));

  return (
    <motion.div
      variants={fadeUp}
      style={{
        padding: 18,
        borderRadius: T.r,
        background: T.cardBg,
        border: `1px solid ${T.cardBorder}`,
        marginBottom: 20,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 14,
        }}
      >
        <div>
          <p style={{ fontSize: 13, fontWeight: 700, color: T.text, margin: 0 }}>
            Credit Score Simulator
          </p>
          <p style={{ fontSize: 10, color: T.mid, margin: 0 }}>
            Model how actions affect your score
          </p>
        </div>
        <motion.button
          whileTap={{ scale: 0.93 }}
          onClick={() => setShowWhatIf(v => !v)}
          style={{
            fontSize: 10,
            fontWeight: 700,
            padding: "5px 11px",
            borderRadius: 7,
            border: `1px solid ${showWhatIf ? T.gold : T.border}`,
            background: showWhatIf ? "rgba(201,168,76,0.12)" : T.glass,
            color: showWhatIf ? T.gold : T.mid,
            cursor: "pointer",
            fontFamily: "inherit",
            transition: "all 0.2s",
          }}
        >
          What If?
        </motion.button>
      </div>

      {/* Gauge + delta badge */}
      <div style={{ display: "flex", alignItems: "flex-end", gap: 12, marginBottom: 4 }}>
        <svg
          width={144}
          height={82}
          viewBox="0 0 144 82"
          style={{ overflow: "visible", flexShrink: 0 }}
        >
          {(
            [
              [0, 0.34, "#f87171"],
              [0.34, 0.6, "#fbbf24"],
              [0.6, 1, "#4ade80"],
            ] as [number, number, string][]
          ).map(([f, t, c]) => {
            const a1 = Math.PI - f * Math.PI;
            const a2 = Math.PI - t * Math.PI;
            const x1 = CX + R * Math.cos(a1),
              y1 = CY - R * Math.sin(a1);
            const x2 = CX + R * Math.cos(a2),
              y2 = CY - R * Math.sin(a2);
            return (
              <path
                key={c}
                d={`M ${x1} ${y1} A ${R} ${R} 0 0 1 ${x2} ${y2}`}
                stroke={c}
                strokeWidth={7}
                fill="none"
                strokeLinecap="butt"
                opacity={0.2}
              />
            );
          })}

          <path
            d={`M ${CX - R} ${CY} A ${R} ${R} 0 0 1 ${needleX} ${needleY}`}
            stroke={scoreColor}
            strokeWidth={7}
            fill="none"
            strokeLinecap="round"
          />

          <motion.line
            x1={CX}
            y1={CY}
            initial={{ x2: CX + R * 0.5, y2: CY - R * 0.5 }}
            animate={{ x2: needleX, y2: needleY }}
            transition={{ type: "spring", stiffness: 110, damping: 16 }}
            stroke={scoreColor}
            strokeWidth={2.5}
            strokeLinecap="round"
          />
          <circle cx={CX} cy={CY} r={4.5} fill={scoreColor} />

          <motion.text
            key={score}
            initial={{ opacity: 0.4 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
            x={CX}
            y={CY - 10}
            textAnchor="middle"
            style={{
              fontFamily: "inherit",
              fontWeight: 800,
              fontSize: 24,
              fill: scoreColor,
            }}
          >
            {score}
          </motion.text>
          <text
            x={CX}
            y={CY + 4}
            textAnchor="middle"
            style={{ fontFamily: "inherit", fontSize: 9, fill: T.mid }}
          >
            {scoreLabel}
          </text>
          <text
            x={CX - R - 2}
            y={CY + 14}
            textAnchor="end"
            style={{ fontFamily: "inherit", fontSize: 8, fill: T.dim }}
          >
            300
          </text>
          <text
            x={CX + R + 2}
            y={CY + 14}
            textAnchor="start"
            style={{ fontFamily: "inherit", fontSize: 8, fill: T.dim }}
          >
            850
          </text>
        </svg>

        <AnimatePresence>
          {delta !== 0 && (
            <motion.div
              key="delta"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              style={{
                fontSize: 15,
                fontWeight: 800,
                lineHeight: 1,
                color: delta > 0 ? T.green : T.red,
                background:
                  delta > 0 ? "rgba(74,222,128,0.1)" : "rgba(248,113,113,0.1)",
                border: `1px solid ${
                  delta > 0 ? "rgba(74,222,128,0.25)" : "rgba(248,113,113,0.25)"
                }`,
                padding: "6px 12px",
                borderRadius: 9,
                whiteSpace: "nowrap",
              }}
            >
              {delta > 0 ? "+" : ""}
              {delta} pts
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* What If? toggle panel */}
      <AnimatePresence>
        {showWhatIf && (
          <motion.div
            key="whatif"
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: 12 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            style={{ overflow: "hidden" }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              {WHAT_IF_SCENARIOS.map(sc => {
                const on = !!toggled[sc.id];
                return (
                  <div
                    key={sc.id}
                    onClick={() => toggle(sc.id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "9px 12px",
                      borderRadius: T.rsm,
                      cursor: "pointer",
                      border: `1px solid ${on ? sc.color + "55" : T.border}`,
                      background: on ? sc.color + "0e" : T.glass,
                      transition: "all 0.2s",
                      userSelect: "none",
                    }}
                  >
                    <div>
                      <p
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          color: T.text,
                          margin: 0,
                        }}
                      >
                        {sc.label}
                      </p>
                      <p
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          margin: 0,
                          color: sc.delta > 0 ? T.green : T.red,
                        }}
                      >
                        {sc.delta > 0 ? "+" : ""}
                        {sc.delta} pts
                      </p>
                    </div>
                    <div
                      style={{
                        width: 36,
                        height: 20,
                        borderRadius: 10,
                        flexShrink: 0,
                        position: "relative",
                        background: on ? sc.color : T.dim,
                        transition: "background 0.25s",
                      }}
                    >
                      <motion.div
                        animate={{ x: on ? 18 : 2 }}
                        transition={{ type: "spring", stiffness: 320, damping: 28 }}
                        style={{
                          position: "absolute",
                          top: 3,
                          width: 14,
                          height: 14,
                          borderRadius: "50%",
                          background: "#fff",
                          boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
                        }}
                      />
                    </div>
                  </div>
                );
              })}

              <AnimatePresence mode="wait">
                {activeTip ? (
                  <motion.div
                    key={activeTip.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2 }}
                    style={{
                      padding: "10px 12px",
                      borderRadius: T.rsm,
                      marginTop: 2,
                      background: "rgba(201,168,76,0.07)",
                      border: "1px solid rgba(201,168,76,0.22)",
                    }}
                  >
                    <p
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        color: T.gold,
                        margin: "0 0 4px",
                      }}
                    >
                      Tip
                    </p>
                    <p
                      style={{
                        fontSize: 10,
                        color: T.mid,
                        margin: 0,
                        lineHeight: 1.65,
                      }}
                    >
                      {activeTip.tip}
                    </p>
                  </motion.div>
                ) : (
                  <motion.p
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{
                      fontSize: 10,
                      color: T.dim,
                      margin: 0,
                      textAlign: "center",
                      padding: "4px 0",
                    }}
                  >
                    Toggle a scenario above to see its impact
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Build Credit CTA — calls onBuildClick prop directly, no page state reference */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={onBuildClick}
        style={{
          marginTop: 14,
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
