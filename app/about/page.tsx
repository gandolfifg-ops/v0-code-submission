"use client";

import Link from "next/link";

// Forge theme tokens
const T = {
  bg: "#07090d",
  gold: "#c4b594",
  goldDim: "#a89860",
  text: "#e8e4dc",
  mid: "#9a9078",
  dim: "#6b6455",
  border: "rgba(255,255,255,0.08)",
};

export default function AboutPage() {
  return (
    <div style={{ minHeight: "100vh", background: T.bg, color: T.text, fontFamily: "Inter, system-ui, sans-serif" }}>
      {/* Header */}
      <header style={{ padding: "20px 24px", borderBottom: `1px solid ${T.border}` }}>
        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
          <span style={{ fontSize: 20 }}>🔥</span>
          <span style={{ fontSize: 17, fontWeight: 900, color: T.gold, textTransform: "uppercase", letterSpacing: "-0.03em" }}>WealthNutz</span>
        </Link>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: 800, margin: "0 auto", padding: "48px 24px 80px" }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: T.gold, marginBottom: 12, letterSpacing: "-0.02em" }}>
          About Us
        </h1>
        <p style={{ fontSize: 14, color: T.dim, marginBottom: 48 }}>
          Learn more about WealthNutz and our commitment to your financial success.
        </p>

        {/* Section 1: About Forge Finances */}
        <section style={{ marginBottom: 48 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: `linear-gradient(135deg, ${T.gold}, ${T.goldDim})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 20 }}>🔥</span>
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: T.text, margin: 0 }}>About WealthNutz</h2>
          </div>
          <p style={{ fontSize: 15, lineHeight: 1.8, color: T.mid, margin: 0 }}>
            WealthNutz is a cutting-edge financial technology platform designed to bridge the gap between AI-driven insights and personal wealth management. We empower users to take control of their financial future by providing a centralized dashboard for monitoring credit, evaluating financial tools, and accessing tailored marketplace recommendations.
          </p>
        </section>

        {/* Section 2: Our Mission */}
        <section id="mission" style={{ marginBottom: 48, scrollMarginTop: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: `linear-gradient(135deg, ${T.gold}, ${T.goldDim})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 20 }}>🎯</span>
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: T.text, margin: 0 }}>Our Mission</h2>
          </div>
          <p style={{ fontSize: 15, lineHeight: 1.8, color: T.mid, margin: 0 }}>
            Our mission is to democratize financial literacy. We believe that everyone—regardless of their starting point—deserves access to sophisticated tools that make building credit, managing debt, and growing wealth simple, transparent, and achievable. We build stronger financial futures through technology.
          </p>
        </section>

        {/* Section 3: Security & Data Protection */}
        <section id="security" style={{ marginBottom: 48, scrollMarginTop: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: `linear-gradient(135deg, ${T.gold}, ${T.goldDim})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 20 }}>🔒</span>
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: T.text, margin: 0 }}>Security &amp; Data Protection</h2>
          </div>
          <p style={{ fontSize: 15, lineHeight: 1.8, color: T.mid, margin: 0 }}>
            Security is our core priority. WealthNutz uses bank-level 256-bit encryption to ensure that your data is protected at all times. We do not store sensitive login credentials for your external bank accounts, and we adhere to strict industry standards to ensure your financial journey remains private and secure.
          </p>
        </section>

        {/* Trust Badges */}
        <section style={{ padding: 24, background: "rgba(196,181,148,0.05)", borderRadius: 12, border: `1px solid ${T.border}`, marginBottom: 48 }}>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 32 }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 28, marginBottom: 6 }}>🔐</div>
              <p style={{ fontSize: 11, color: T.mid, margin: 0, fontWeight: 600 }}>256-BIT ENCRYPTION</p>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 28, marginBottom: 6 }}>🛡️</div>
              <p style={{ fontSize: 11, color: T.mid, margin: 0, fontWeight: 600 }}>BANK-LEVEL SECURITY</p>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 28, marginBottom: 6 }}>✅</div>
              <p style={{ fontSize: 11, color: T.mid, margin: 0, fontWeight: 600 }}>NO DATA SELLING</p>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 28, marginBottom: 6 }}>🇨🇦🇺🇸</div>
              <p style={{ fontSize: 11, color: T.mid, margin: 0, fontWeight: 600 }}>CA &amp; USA SUPPORT</p>
            </div>
          </div>
        </section>

        {/* Back link */}
        <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 24 }}>
          <Link href="/" style={{ color: T.gold, fontSize: 14, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}>
            ← Back to WealthNutz
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ borderTop: `1px solid ${T.border}`, padding: "20px 24px", textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", gap: 24, flexWrap: "wrap", marginBottom: 12 }}>
          <Link href="/privacy" style={{ color: T.dim, fontSize: 12, textDecoration: "none" }}>Privacy Policy</Link>
          <Link href="/terms" style={{ color: T.dim, fontSize: 12, textDecoration: "none" }}>Terms of Service</Link>
          <Link href="/cookies" style={{ color: T.dim, fontSize: 12, textDecoration: "none" }}>Cookie Policy</Link>
        </div>
        <p style={{ fontSize: 11, color: T.dim, margin: 0 }}>© 2026 WealthNutz. All rights reserved.</p>
      </footer>
    </div>
  );
}
