/* build:v120 — plain anchor tags only */
"use client";

import { useState } from "react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("General");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Show success message
    setSubmitted(true);
    // Reset form after 3 seconds
    setTimeout(() => {
      setName("");
      setEmail("");
      setReason("General");
      setMessage("");
      setSubmitted(false);
    }, 3000);
  };

  return (
    <main style={{ minHeight: "100vh", background: "white" }} className="dark:bg-slate-950">
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "80px 20px 60px" }}>
        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <a href="/" style={{ color: "#f59e0b", textDecoration: "none", fontSize: 14, fontWeight: 600, marginBottom: 16, display: "inline-block" }}>
            ← Back to Home
          </a>
          <h1 style={{ fontSize: 40, fontWeight: 900, color: "#1a1a1a", margin: "20px 0 12px" }} className="dark:text-white">
            Contact Us
          </h1>
          <p style={{ fontSize: 16, color: "#666", margin: 0 }} className="dark:text-slate-300">
            Have questions? Reach out to us anytime.
          </p>
        </div>

        {/* Contact Email — plain text to avoid browser blocking issues */}
        <div
          style={{
            padding: "24px 16px",
            background: "rgba(245,158,11,0.08)",
            borderRadius: 12,
            border: "1px solid rgba(245,158,11,0.2)",
            marginBottom: 40,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            minHeight: 100,
            width: "100%",
            boxSizing: "border-box",
          }}
          className="dark:bg-slate-900 dark:border-slate-700"
        >
          <p style={{ fontSize: 11, color: "#666", margin: "0 0 10px", fontWeight: 700, letterSpacing: ".12em" }} className="dark:text-slate-400">
            MAIN CONTACT
          </p>
          <span
            style={{
              fontSize: 14,
              fontWeight: 800,
              color: "#f59e0b",
              whiteSpace: "nowrap",
              userSelect: "all",
            }}
          >
            wealthnutz.official@gmail.com
          </span>
          <p style={{ fontSize: 11, color: "#888", margin: "10px 0 0", fontStyle: "italic" }} className="dark:text-slate-500">
            (Copy and paste to your email app)
          </p>
        </div>

        {/* Contact Form */}
        {submitted ? (
          <div style={{ padding: 32, background: "rgba(34,197,94,0.08)", borderRadius: 12, border: "1px solid rgba(34,197,94,0.3)", textAlign: "center" }} className="dark:bg-slate-900 dark:border-slate-700">
            <p style={{ fontSize: 18, fontWeight: 700, color: "#1a1a1a", margin: 0 }} className="dark:text-white">
              ✓ Message sent successfully!
            </p>
            <p style={{ fontSize: 14, color: "#666", margin: "8px 0 0" }} className="dark:text-slate-300">
              We'll get back to you shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Name Field */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#1a1a1a", marginBottom: 8, letterSpacing: ".05em" }} className="dark:text-white">
                NAME
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  fontSize: 14,
                  border: "1.5px solid #ddd",
                  borderRadius: 8,
                  fontFamily: "inherit",
                  color: "#1a1a1a",
                  boxSizing: "border-box",
                }}
                className="dark:bg-slate-900 dark:border-slate-700 dark:text-white"
              />
            </div>

            {/* Email Field */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#1a1a1a", marginBottom: 8, letterSpacing: ".05em" }} className="dark:text-white">
                EMAIL
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  fontSize: 14,
                  border: "1.5px solid #ddd",
                  borderRadius: 8,
                  fontFamily: "inherit",
                  color: "#1a1a1a",
                  boxSizing: "border-box",
                }}
                className="dark:bg-slate-900 dark:border-slate-700 dark:text-white"
              />
            </div>

            {/* Reason Dropdown */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#1a1a1a", marginBottom: 8, letterSpacing: ".05em" }} className="dark:text-white">
                REASON FOR INQUIRY
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  fontSize: 14,
                  border: "1.5px solid #ddd",
                  borderRadius: 8,
                  fontFamily: "inherit",
                  color: "#1a1a1a",
                  boxSizing: "border-box",
                  cursor: "pointer",
                }}
                className="dark:bg-slate-900 dark:border-slate-700 dark:text-white"
              >
                <option value="General">General Inquiry</option>
                <option value="Technical">Technical Support</option>
                <option value="Scholarship Submission">Scholarship Submission</option>
              </select>
            </div>

            {/* Message Field */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#1a1a1a", marginBottom: 8, letterSpacing: ".05em" }} className="dark:text-white">
                MESSAGE
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us how we can help..."
                required
                rows={5}
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  fontSize: 14,
                  border: "1.5px solid #ddd",
                  borderRadius: 8,
                  fontFamily: "inherit",
                  color: "#1a1a1a",
                  boxSizing: "border-box",
                  resize: "vertical",
                }}
                className="dark:bg-slate-900 dark:border-slate-700 dark:text-white"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              style={{
                width: "100%",
                padding: "14px",
                fontSize: 14,
                fontWeight: 800,
                letterSpacing: ".08em",
                color: "#07090d",
                background: "linear-gradient(135deg, #c9a84c, #d4b760)",
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
                transition: "transform 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              Send Message
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
