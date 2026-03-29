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

  // ... (full component as shown above)
