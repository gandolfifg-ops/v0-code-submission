import Link from "next/link"
import { InfoPage } from "@/components/layout/InfoPage"

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
          scholarships and loans may be stored in your browser (localStorage) when account login
          is not configured. Marketplace clicks may use affiliate tracking cookies.
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
        <Link href="/help" className="font-medium text-[#8B6914] underline dark:text-[#C9A84C]">
          Help Center
        </Link>{" "}
        or{" "}
        <Link href="/contact" className="font-medium text-[#8B6914] underline dark:text-[#C9A84C]">
          Contact
        </Link>{" "}
        page.
      </p>
    </InfoPage>
  )
}
