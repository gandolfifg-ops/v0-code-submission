/* build:v109-cache-bust */
import Link from "next/link";

export const metadata = {
  title: "Help Center - WealthNutz",
  description: "Frequently asked questions about WealthNutz AI Scholarship Scout",
};

export default function HelpPage() {
  return (
    <main style={{ minHeight: "100vh", background: "white" }} className="dark:bg-slate-950">
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "60px 20px" }}>
        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <Link href="/" style={{ color: "#f59e0b", textDecoration: "none", fontSize: 14, fontWeight: 600, marginBottom: 16, display: "inline-block" }}>
            ← Back to Home
          </Link>
          <h1 style={{ fontSize: 40, fontWeight: 900, color: "#1a1a1a", margin: "20px 0 12px" }} className="dark:text-white">
            Help Center
          </h1>
          <p style={{ fontSize: 16, color: "#666" }} className="dark:text-slate-300">
            Frequently asked questions about WealthNutz
          </p>
        </div>

        {/* FAQ Section */}
        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          {/* FAQ Item 1 */}
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "#1a1a1a", margin: "0 0 8px" }} className="dark:text-white">
              Is WealthNutz free?
            </h2>
            <p style={{ fontSize: 15, color: "#555", lineHeight: 1.6, margin: 0 }} className="dark:text-slate-300">
              Yes! The AI Scholarship Scout is <strong>100% free</strong> with <strong>no paywalls</strong>. We believe financial education and scholarship discovery should be accessible to everyone.
            </p>
          </div>

          {/* FAQ Item 2 */}
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "#1a1a1a", margin: "0 0 8px" }} className="dark:text-white">
              Which countries does WealthNutz cover?
            </h2>
            <p style={{ fontSize: 15, color: "#555", lineHeight: 1.6, margin: 0 }} className="dark:text-slate-300">
              WealthNutz focuses exclusively on <strong>North America</strong>, specifically the <strong>USA and Canada</strong>. We provide scholarships, loan information, and financial guidance tailored to students in these regions.
            </p>
          </div>

          {/* FAQ Item 3 */}
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "#1a1a1a", margin: "0 0 8px" }} className="dark:text-white">
              How accurate is the scholarship information?
            </h2>
            <p style={{ fontSize: 15, color: "#555", lineHeight: 1.6, margin: 0 }} className="dark:text-slate-300">
              Our AI scouts scholarship databases and loan options to find the best matches for you. However, always verify information directly with the institutions and lenders before applying.
            </p>
          </div>

          {/* FAQ Item 4 */}
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "#1a1a1a", margin: "0 0 8px" }} className="dark:text-white">
              Do you store my personal information?
            </h2>
            <p style={{ fontSize: 15, color: "#555", lineHeight: 1.6, margin: 0 }} className="dark:text-slate-300">
              Your privacy is important to us. Please review our <Link href="/privacy" style={{ color: "#f59e0b", textDecoration: "underline" }}>Privacy Policy</Link> for complete details about data handling and storage.
            </p>
          </div>

          {/* FAQ Item 5 */}
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "#1a1a1a", margin: "0 0 8px" }} className="dark:text-white">
              Can I use WealthNutz on mobile?
            </h2>
            <p style={{ fontSize: 15, color: "#555", lineHeight: 1.6, margin: 0 }} className="dark:text-slate-300">
              Absolutely! WealthNutz is fully responsive and works seamlessly on mobile, tablet, and desktop devices.
            </p>
          </div>

          {/* CTA */}
          <div style={{ marginTop: 40, padding: 24, background: "rgba(245,158,11,0.08)", borderRadius: 12, border: "1px solid rgba(245,158,11,0.2)" }} className="dark:bg-slate-900 dark:border-slate-700">
            <p style={{ fontSize: 15, color: "#1a1a1a", margin: 0 }} className="dark:text-white">
              Can't find what you're looking for?{" "}
              <Link href="/contact" style={{ color: "#f59e0b", fontWeight: 600, textDecoration: "none" }}>Contact us</Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
