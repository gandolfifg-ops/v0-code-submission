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

export default function PrivacyPage() {
  return (
    <div style={{ minHeight: "100vh", background: T.bg, color: T.text, fontFamily: "Inter, system-ui, -apple-system, sans-serif" }}>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 20px" }}>
        {/* Back link */}
        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 8, color: T.gold, textDecoration: "none", marginBottom: 32, fontSize: 14 }}>
          <ArrowLeft size={16} />
          Back to WealthNutz
        </Link>

        {/* Header */}
        <h1 style={{ fontSize: 32, fontWeight: 800, color: T.gold, marginBottom: 8, letterSpacing: "-0.02em" }}>
          Privacy Policy
        </h1>
        <p style={{ fontSize: 14, color: T.mid, marginBottom: 40 }}>
          Last updated: March 2026
        </p>

        {/* Content */}
        <div style={{ lineHeight: 1.8, fontSize: 16, color: T.text }}>
          <p style={{ marginBottom: 24 }}>
            WealthNutz respects your privacy. We collect minimal data necessary to provide AI-driven financial insights. We do not sell your personal data to third parties.
          </p>
          
          <p style={{ marginBottom: 24 }}>
            Our site contains links to affiliate banking partners; once you leave our site, their privacy policies apply. We use industry-standard encryption to protect any information you share with our AI tools.
          </p>

          <h2 style={{ fontSize: 20, fontWeight: 700, color: T.gold, marginTop: 40, marginBottom: 16 }}>
            Information We Collect
          </h2>
          <p style={{ marginBottom: 24 }}>
            We may collect information you voluntarily provide when using our AI financial tools, such as general financial questions or scenarios. This information is used solely to provide personalized educational insights.
          </p>

          <h2 style={{ fontSize: 20, fontWeight: 700, color: T.gold, marginTop: 40, marginBottom: 16 }}>
            How We Protect Your Data
          </h2>
          <p style={{ marginBottom: 24 }}>
            All data transmitted through our platform is protected using industry-standard SSL/TLS encryption. We implement appropriate technical and organizational measures to maintain the security of your information.
          </p>

          <h2 style={{ fontSize: 20, fontWeight: 700, color: T.gold, marginTop: 40, marginBottom: 16 }}>
            Third-Party Links
          </h2>
          <p style={{ marginBottom: 24 }}>
            Our platform includes links to third-party banking and financial partners. When you click these links, you will be directed to external sites governed by their own privacy policies. We encourage you to review those policies before providing any personal information.
          </p>

          <h2 style={{ fontSize: 20, fontWeight: 700, color: T.gold, marginTop: 40, marginBottom: 16 }}>
            Contact Us
          </h2>
          <p>
            If you have questions about this Privacy Policy, please contact us through our Help Center.
          </p>
        </div>

        {/* Footer links */}
        <div style={{ marginTop: 60, paddingTop: 24, borderTop: `1px solid ${T.border}`, display: "flex", gap: 24, fontSize: 13 }}>
          <Link href="/terms" style={{ color: T.mid, textDecoration: "none" }}>Terms of Service</Link>
          <Link href="/cookies" style={{ color: T.mid, textDecoration: "none" }}>Cookie Policy</Link>
        </div>
      </div>
    </div>
  );
}
