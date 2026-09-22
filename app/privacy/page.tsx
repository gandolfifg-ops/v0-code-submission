import type { Metadata } from "next"
import Link from "next/link"
import { InfoPage } from "@/components/layout/InfoPage"
import { pageMeta } from "@/lib/seo"

export const metadata: Metadata = pageMeta(
  "Privacy — WealthNutz",
  "How WealthNutz handles data. We do not sell personal information. Last updated September 2026.",
  "/privacy",
)

export default function PrivacyPage() {
  return (
    <InfoPage title="Privacy Policy" lede="Last updated: September 2026">
      <p>
        WealthNutz collects only what we need to run the site. We do not sell your personal data
        to third parties.
      </p>
      <section>
        <h2 className="text-lg font-semibold text-foreground">Information we collect</h2>
        <p className="mt-2">
          Chat messages you send are transmitted to our AI provider to generate a reply. Saved
          scholarships and loans stay in your browser only (localStorage) — there is no account
          sync. Marketplace clicks may use affiliate tracking cookies.
        </p>
      </section>
      <section>
        <h2 className="text-lg font-semibold text-foreground">Third-party sites</h2>
        <p className="mt-2">
          When you leave WealthNutz for a bank, lender, or scholarship site, that site’s privacy
          policy applies.
        </p>
      </section>
      <p>
        Questions? See the{" "}
        <Link href="/help" className="font-medium text-link underline">
          Help Center
        </Link>{" "}
        or{" "}
        <Link href="/contact" className="font-medium text-link underline">
          Contact
        </Link>{" "}
        page.
      </p>
    </InfoPage>
  )
}
