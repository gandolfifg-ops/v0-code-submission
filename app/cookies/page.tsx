import Link from "next/link"
import { InfoPage } from "@/components/layout/InfoPage"

export default function CookiesPage() {
  return (
    <InfoPage title="Cookie Policy" lede="Last updated: September 2026">
      <p>
        WealthNutz may use cookies to keep the site working and to track affiliate referrals.
        Saved items in this browser use localStorage, not cookies.
      </p>
      <section>
        <h2 className="text-lg font-semibold text-foreground">Types of cookies</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Essential cookies for basic site function</li>
          <li>Affiliate cookies when you click partner product links</li>
        </ul>
      </section>
      <section>
        <h2 className="text-lg font-semibold text-foreground">Managing cookies</h2>
        <p className="mt-2">
          You can disable cookies in your browser settings. Some affiliate tracking may stop
          working if you do.
        </p>
      </section>
      <p>
        Related:{" "}
        <Link href="/privacy" className="font-medium text-[#8B6914] underline dark:text-[#C9A84C]">
          Privacy Policy
        </Link>
        .
      </p>
    </InfoPage>
  )
}
