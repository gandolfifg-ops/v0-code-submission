"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const T = {
  bg: "#07090d",
  text: "#e8e6e3",
  gold: "#c4b594",
  goldDim: "#a89968",
  border: "rgba(255,255,255,0.08)",
  mid: "#8a8780",
};

export default function TermsPage() {
  return (
    <div style={{ minHeight: "100vh", background: T.bg, color: T.text, fontFamily: "Inter, system-ui, -apple-system, sans-serif" }}>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 20px" }}>
        {/* Back link */}
        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 8, color: T.gold, textDecoration: "none", marginBottom: 32, fontSize: 14 }}>
          <ArrowLeft size={16} />
          Back to Forge
        </Link>

        {/* Header */}
        <h1 style={{ fontSize: 32, fontWeight: 800, color: T.gold, marginBottom: 8, letterSpacing: "-0.02em" }}>
          Terms of Service
        </h1>
        <p style={{ fontSize: 14, color: T.mid, marginBottom: 40 }}>
          Last updated: March 2026
        </p>

        {/* Content */}
        <div style={{ lineHeight: 1.8, fontSize: 16, color: T.text }}>
          <p style={{ marginBottom: 24 }}>
            By using Forge Finances, you agree that our AI-generated insights are for educational purposes only and do not constitute professional financial advice. We are an independent affiliate site.
          </p>
          
          <p style={{ marginBottom: 24 }}>
            Users should verify all credit card rates, fees, and terms directly on the issuer&apos;s website before applying. We are not responsible for third-party content or financial decisions made based on our platform.
          </p>

          <h2 style={{ fontSize: 20, fontWeight: 700, color: T.gold, marginTop: 40, marginBottom: 16 }}>
            Use of Service
          </h2>
          <p style={{ marginBottom: 24 }}>
            Forge Finances provides AI-powered financial education tools designed to help users understand personal finance concepts. Our tools analyze general scenarios and provide educational information based on publicly available data.
          </p>

          <h2 style={{ fontSize: 20, fontWeight: 700, color: T.gold, marginTop: 40, marginBottom: 16 }}>
            Disclaimer of Financial Advice
          </h2>
          <p style={{ marginBottom: 24 }}>
            The information provided through our platform is for general informational and educational purposes only. It should not be construed as professional financial, investment, tax, or legal advice. Always consult with qualified professionals before making financial decisions.
          </p>

          <h2 style={{ fontSize: 20, fontWeight: 700, color: T.gold, marginTop: 40, marginBottom: 16 }}>
            Affiliate Relationships
          </h2>
          <p style={{ marginBottom: 24 }}>
            Forge Finances may receive compensation from third-party financial institutions when users apply for products through our affiliate links. This compensation does not influence the educational content or AI-generated insights provided on our platform.
          </p>

          <h2 style={{ fontSize: 20, fontWeight: 700, color: T.gold, marginTop: 40, marginBottom: 16 }}>
            Limitation of Liability
          </h2>
          <p style={{ marginBottom: 24 }}>
            Forge Finances shall not be liable for any direct, indirect, incidental, consequential, or punitive damages arising from your use of our services or reliance on information provided through our platform.
          </p>

          <h2 style={{ fontSize: 20, fontWeight: 700, color: T.gold, marginTop: 40, marginBottom: 16 }}>
            Contact Us
          </h2>
          <p>
            If you have questions about these Terms of Service, please contact us through our Help Center.
          </p>
        </div>

        {/* Footer links */}
        <div style={{ marginTop: 60, paddingTop: 24, borderTop: `1px solid ${T.border}`, display: "flex", gap: 24, fontSize: 13 }}>
          <Link href="/privacy" style={{ color: T.mid, textDecoration: "none" }}>Privacy Policy</Link>
          <Link href="/cookies" style={{ color: T.mid, textDecoration: "none" }}>Cookie Policy</Link>
        </div>
      </div>
    </div>
  );
}
