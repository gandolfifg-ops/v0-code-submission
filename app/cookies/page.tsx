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

export default function CookiesPage() {
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
          Cookie Policy
        </h1>
        <p style={{ fontSize: 14, color: T.mid, marginBottom: 40 }}>
          Last updated: March 2026
        </p>

        {/* Content */}
        <div style={{ lineHeight: 1.8, fontSize: 16, color: T.text }}>
          <p style={{ marginBottom: 24 }}>
            Forge Finances uses cookies to improve user experience and track affiliate referrals. These cookies allow us to recognize your browser and remember certain information.
          </p>
          
          <p style={{ marginBottom: 24 }}>
            You can choose to disable cookies through your browser settings, though some features of our AI tools may not function as intended.
          </p>

          <h2 style={{ fontSize: 20, fontWeight: 700, color: T.gold, marginTop: 40, marginBottom: 16 }}>
            What Are Cookies?
          </h2>
          <p style={{ marginBottom: 24 }}>
            Cookies are small text files stored on your device when you visit a website. They help websites remember your preferences and improve your browsing experience.
          </p>

          <h2 style={{ fontSize: 20, fontWeight: 700, color: T.gold, marginTop: 40, marginBottom: 16 }}>
            Types of Cookies We Use
          </h2>
          <ul style={{ marginBottom: 24, paddingLeft: 24 }}>
            <li style={{ marginBottom: 12 }}>
              <strong style={{ color: T.gold }}>Essential Cookies:</strong> Required for basic site functionality and security.
            </li>
            <li style={{ marginBottom: 12 }}>
              <strong style={{ color: T.gold }}>Analytics Cookies:</strong> Help us understand how visitors interact with our platform.
            </li>
            <li style={{ marginBottom: 12 }}>
              <strong style={{ color: T.gold }}>Affiliate Cookies:</strong> Track referrals to our banking and financial partners.
            </li>
          </ul>

          <h2 style={{ fontSize: 20, fontWeight: 700, color: T.gold, marginTop: 40, marginBottom: 16 }}>
            Managing Your Cookie Preferences
          </h2>
          <p style={{ marginBottom: 24 }}>
            Most web browsers allow you to control cookies through their settings. You can typically find these options in your browser&apos;s &quot;Privacy&quot; or &quot;Security&quot; settings. Please note that disabling certain cookies may impact your experience on our platform.
          </p>

          <h2 style={{ fontSize: 20, fontWeight: 700, color: T.gold, marginTop: 40, marginBottom: 16 }}>
            Contact Us
          </h2>
          <p>
            If you have questions about our use of cookies, please contact us through our Help Center.
          </p>
        </div>

        {/* Footer links */}
        <div style={{ marginTop: 60, paddingTop: 24, borderTop: `1px solid ${T.border}`, display: "flex", gap: 24, fontSize: 13 }}>
          <Link href="/privacy" style={{ color: T.mid, textDecoration: "none" }}>Privacy Policy</Link>
          <Link href="/terms" style={{ color: T.mid, textDecoration: "none" }}>Terms of Service</Link>
        </div>
      </div>
    </div>
  );
}
