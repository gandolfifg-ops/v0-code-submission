import { MARKETPLACE_PRODUCTS } from "@/features/marketplace/data/products"

export const COMPARISON_DISCLAIMER =
  "Advertised details as of September 2026. Confirm on the official site."

export const HOW_WE_PICK = [
  "We list no-fee or student-fee everyday accounts already on Marketplace — not every bank in Canada or the US.",
  "Fees, ATM access, and advertised perks are as of September 2026. Confirm them on the bank’s site before you apply.",
  "Some product buttons are affiliate links. We may earn a commission if you open an account.",
  "Table order is editorial, not paid placement. Placement is editorial.",
  "No bank paid for its rank on this page.",
] as const

export type ComparisonKind = "banking" | "investing" | "credit"

export type ComparisonRow = {
  productId: string
  account: string
  monthlyFee: string
  atmAccess: string
  advertisedPerk: string
  bestFor: string
  href: string
  cta: string
  kind?: ComparisonKind
}

function hrefFor(id: string): { href: string; cta: string } {
  const product = MARKETPLACE_PRODUCTS.find((item) => item.id === id)
  if (!product) {
    return { href: "/", cta: "Open site" }
  }
  return { href: product.href, cta: product.cta }
}

const eq = hrefFor("eq-bank")
const tangerine = hrefFor("tangerine-student")
const rbc = hrefFor("rbc-student")
const wealthsimple = hrefFor("wealthsimple")
const td = hrefFor("td-student")
const scotia = hrefFor("scotia-student")
const bmo = hrefFor("bmo-student")
const cibc = hrefFor("cibc-student")
const simplii = hrefFor("simplii-chequing")
const sofi = hrefFor("sofi-students")
const ally = hrefFor("ally-savings")
const bofa = hrefFor("bofa-student")
const capitalOne = hrefFor("capital-one-student")
const fidelity = hrefFor("fidelity-roth")
const betterment = hrefFor("betterment")
const discover = hrefFor("discover-student")

export const CANADA_COMPARISON: ComparisonRow[] = [
  {
    productId: "eq-bank",
    account: "EQ Bank Personal Account",
    monthlyFee: "$0",
    atmAccess: "ATM via EQ Bank Card (operator fees may apply)",
    advertisedPerk:
      "Interest up to 2.75% with qualifying direct deposit; 1.00% base",
    bestFor: "Best for interest on cash",
    href: eq.href,
    cta: eq.cta,
  },
  {
    productId: "tangerine-student",
    account: "Tangerine Chequing",
    monthlyFee: "$0 forever (not student-only)",
    atmAccess: "Free Scotiabank ATMs",
    advertisedPerk: "New-client $250 if you move payroll (offer/terms change)",
    bestFor: "Best for no-fee after graduation + ATM network",
    href: tangerine.href,
    cta: tangerine.cta,
  },
  {
    productId: "rbc-student",
    account: "RBC Advantage Banking for Students",
    monthlyFee: "$0 while a full-time student (fee returns after)",
    atmAccess: "RBC ATMs + non-RBC Canada withdrawals per RBC terms",
    advertisedPerk: "Branch access / student perks",
    bestFor: "Best if you want a big bank and branches",
    href: rbc.href,
    cta: rbc.cta,
  },
  {
    productId: "wealthsimple",
    account: "Wealthsimple",
    monthlyFee: "$0",
    atmAccess: "App / card per Wealthsimple terms",
    advertisedPerk: "Investing + cash in one app",
    bestFor: "Best if you already want to invest",
    href: wealthsimple.href,
    cta: wealthsimple.cta,
  },
  {
    productId: "td-student",
    account: "TD Student Chequing Account",
    monthlyFee: "$0 until 23 or with full-time proof of enrolment",
    atmAccess: "Free TD ATMs; $2 non-TD ATM in Canada",
    advertisedPerk:
      "$0 monthly fee until 23 or with full-time proof of enrolment; unlimited transactions; free Interac e-Transfer",
    bestFor: "TD branches + $0 student fee",
    href: td.href,
    cta: td.cta,
  },
  {
    productId: "scotia-student",
    account: "Scotiabank Preferred Package for Students and Youth",
    monthlyFee: "$0 if under 25 or full-time student",
    atmAccess: "Scotiabank ATMs; 1 free non-Scotia Interac ATM in Canada per month then $2",
    advertisedPerk:
      "$0 monthly fee if under 25 or full-time student; unlimited debit + e-Transfer; Scene+; advertised $200 welcome (terms, check offer end date)",
    bestFor: "Scene+ / branch bank",
    href: scotia.href,
    cta: scotia.cta,
  },
  {
    productId: "bmo-student",
    account: "BMO Student Banking",
    monthlyFee: "$0 while a student",
    atmAccess: "BMO ATMs; 1 free non-BMO Canada ATM/month then $2",
    advertisedPerk:
      "$0 monthly fee while a student; unlimited debit + e-Transfer. Confirm current student offer on BMO",
    bestFor: "BMO branches",
    href: bmo.href,
    cta: bmo.cta,
  },
  {
    productId: "cibc-student",
    account: "CIBC Smart for Students",
    monthlyFee: "$0 for eligible full-time students",
    atmAccess: "CIBC ATMs; 1 non-CIBC Canada ATM rebate per month",
    advertisedPerk:
      "$0 monthly fee for eligible full-time students (CIBC Smart Start is the under-25 version)",
    bestFor: "CIBC students 25+ / Smart Start if under 25",
    href: cibc.href,
    cta: cibc.cta,
  },
  {
    productId: "simplii-chequing",
    account: "Simplii Financial No Fee Chequing",
    monthlyFee: "$0 for everyone (not student-only)",
    atmAccess: "Free CIBC ATMs",
    advertisedPerk: "$0 monthly fee for everyone, not student-only; unlimited transactions",
    bestFor: "no-fee after graduation",
    href: simplii.href,
    cta: simplii.cta,
  },
]

export const US_COMPARISON: ComparisonRow[] = [
  {
    productId: "sofi-students",
    account: "SoFi Student Checking & Savings",
    monthlyFee: "$0",
    atmAccess: "55,000+ Allpoint",
    advertisedPerk:
      "No monthly/overdraft/minimum fees; .edu signup bonus advertised up to $30 (terms)",
    bestFor: "online student banking",
    href: sofi.href,
    cta: sofi.cta,
  },
  {
    productId: "ally-savings",
    account: "Ally Bank Online Savings",
    monthlyFee: "$0",
    atmAccess: "Online / Ally terms",
    advertisedPerk: "No monthly fee, no minimum (confirm on Ally)",
    bestFor: "online savings",
    href: ally.href,
    cta: ally.cta,
  },
  {
    productId: "bofa-student",
    account: "Bank of America student banking",
    monthlyFee: "Fee waived under 25 on SafeBalance (confirm on BofA)",
    atmAccess: "See official site",
    advertisedPerk: "Fee waived under 25 on SafeBalance (confirm on BofA)",
    bestFor: "Best for Bank of America students and young adults",
    href: bofa.href,
    cta: bofa.cta,
  },
  {
    productId: "capital-one-student",
    account: "Capital One checking for students",
    monthlyFee: "$0",
    atmAccess: "Large fee-free ATM network (confirm current network on Capital One)",
    advertisedPerk: "$0 monthly fee; large fee-free ATM network (confirm current network on Capital One)",
    bestFor: "Best for Capital One student checking options",
    href: capitalOne.href,
    cta: capitalOne.cta,
  },
  {
    productId: "fidelity-roth",
    account: "Fidelity Roth IRA",
    monthlyFee: "See official site",
    atmAccess: "See official site",
    advertisedPerk: "Roth IRA and zero-expense-ratio index funds (confirm on Fidelity)",
    bestFor: "Best if you have earned income and want a Roth IRA",
    href: fidelity.href,
    cta: fidelity.cta,
    kind: "investing",
  },
  {
    productId: "betterment",
    account: "Betterment",
    monthlyFee: "See official site",
    atmAccess: "See official site",
    advertisedPerk: "See official site",
    bestFor: "Best for automated investing",
    href: betterment.href,
    cta: betterment.cta,
    kind: "investing",
  },
  {
    productId: "discover-student",
    account: "Discover it® Student Cash Back",
    monthlyFee: "See official site",
    atmAccess: "See official site",
    advertisedPerk: "See official site",
    bestFor: "Best for building credit (student card)",
    href: discover.href,
    cta: discover.cta,
    kind: "credit",
  },
]
