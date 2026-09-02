import { InfoPage } from "@/components/layout/InfoPage"

export default function AboutPage() {
  return (
    <InfoPage title="About Us" lede="WealthNutz helps students in Canada and the US find scholarships, loans, and student banking products.">
      <section>
        <h2 className="text-lg font-semibold text-foreground">About WealthNutz</h2>
        <p className="mt-2">
          WealthNutz is a student finance discovery site. We point you to official scholarship
          pages, lender sites, and student banking products, plus a simple AI chat for general
          questions. We are not a bank, lender, or licensed advisor.
        </p>
      </section>
      <section>
        <h2 className="text-lg font-semibold text-foreground">Our Mission</h2>
        <p className="mt-2">
          Make scholarships, student loans, and everyday banking easier to compare — with honest
          labels for live search vs curated picks, and advertised rates that you always confirm
          on the official site.
        </p>
      </section>
      <section>
        <h2 className="text-lg font-semibold text-foreground">Affiliate disclosure</h2>
        <p className="mt-2">
          Some Marketplace links are affiliate links. We may earn a commission if you open an
          account. That does not change which products we list. Government pages such as FAFSA
          and NSLSC are not affiliates.
        </p>
      </section>
    </InfoPage>
  )
}
