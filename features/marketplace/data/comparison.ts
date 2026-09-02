import { MARKETPLACE_PRODUCTS } from "@/features/marketplace/data/products"

export const COMPARISON_DISCLAIMER =
  "Advertised details as of September 2026. Confirm fees, bonuses, and rates on the official site before you apply."

export type ComparisonRow = {
  productId: string
  account: string
  monthlyFee: string
  atmAccess: string
  advertisedPerk: string
  bestFor: string
  href: string
  cta: string
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
const sofi = hrefFor("sofi-students")
const ally = hrefFor("ally-savings")
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
]

export const US_COMPARISON: ComparisonRow[] = [
  {
    productId: "sofi-students",
    account: "SoFi Student Checking & Savings",
    monthlyFee: "$0",
    atmAccess: "See official site",
    advertisedPerk: "See official site",
    bestFor: "Best for .edu student banking (confirm bonus/APY on site)",
    href: sofi.href,
    cta: sofi.cta,
  },
  {
    productId: "ally-savings",
    account: "Ally Bank Online Savings",
    monthlyFee: "$0",
    atmAccess: "See official site",
    advertisedPerk: "No monthly fees, no minimums (confirm on Ally)",
    bestFor: "Best for online savings without a branch",
    href: ally.href,
    cta: ally.cta,
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
  },
]
