import type { StudentCardProduct } from "@/features/marketplace/types"

/**
 * Official issuer student-card hubs only. Confirm fees/offers on the issuer site.
 * Welcome / fee copy is intentionally soft ("See issuer") — do not invent APRs.
 */
export const STUDENT_CARDS: StudentCardProduct[] = [
  // Canada — bank student card hubs
  {
    id: "rbc-student-cards",
    name: "RBC student credit cards",
    country: "CA",
    category: "credit",
    tagline: "Official RBC student credit card hub",
    whyStudents:
      "RBC’s student cards page covers student-friendly Visa and Mastercard options for building credit. Confirm annual fees, welcome offers, and eligibility on the official site.",
    href: "https://www.rbcroyalbank.com/credit-cards/student.html",
    cta: "See RBC student cards",
    source: "curated",
    affiliate: false,
    annualFee: "See issuer",
    advertisedWelcome: "See issuer",
    studentEligibility: "Post-secondary students — confirm on RBC",
    network: "Visa / Mastercard",
  },
  {
    id: "td-student-cards",
    name: "TD credit cards for students",
    country: "CA",
    category: "credit",
    tagline: "Official TD student credit cards page",
    whyStudents:
      "TD’s student credit cards page lists Cash Back, Rewards, and other options marketed to students. Confirm fees, offers, and eligibility on the official site.",
    href: "https://www.td.com/ca/en/personal-banking/solutions/student-banking/student-credit-cards",
    cta: "See TD student cards",
    source: "curated",
    affiliate: false,
    annualFee: "See issuer",
    advertisedWelcome: "See issuer",
    studentEligibility: "Students — confirm on TD",
    network: "Visa",
  },
  {
    id: "scotia-student-cards",
    name: "Scotiabank student credit cards",
    country: "CA",
    category: "credit",
    tagline: "Official Scotiabank student cards hub",
    whyStudents:
      "Scotiabank’s student credit cards hub covers Scene+ and Momentum student options. Confirm fees, offers, and eligibility on the official site.",
    href: "https://www.scotiabank.com/ca/en/personal/credit-cards/students.html",
    cta: "See Scotiabank student cards",
    source: "curated",
    affiliate: false,
    annualFee: "See issuer",
    advertisedWelcome: "See issuer",
    studentEligibility: "Students — confirm on Scotiabank",
    network: "Visa / Amex",
  },
  {
    id: "bmo-student-cards",
    name: "BMO student credit cards",
    country: "CA",
    category: "credit",
    tagline: "Official BMO student credit cards page",
    whyStudents:
      "BMO’s student credit cards page covers no-annual-fee student options for building credit. Confirm cash-back terms and eligibility on the official site.",
    href: "https://www.bmo.com/en-ca/main/personal/credit-cards/students/",
    cta: "See BMO student cards",
    source: "curated",
    affiliate: false,
    annualFee: "See issuer",
    advertisedWelcome: "See issuer",
    studentEligibility: "Ages 18–24 at a recognized school — confirm on BMO",
    network: "Mastercard",
  },
  {
    id: "cibc-student-cards",
    name: "CIBC student credit cards",
    country: "CA",
    category: "credit",
    tagline: "Official CIBC student credit cards hub",
    whyStudents:
      "CIBC’s student cards hub lists Dividend, Adapta, Aventura, and other student options. Confirm fees, welcome offers, and eligibility on the official site.",
    href: "https://www.cibc.com/en/personal-banking/credit-cards/student-cards.html",
    cta: "See CIBC student cards",
    source: "curated",
    affiliate: false,
    annualFee: "See issuer",
    advertisedWelcome: "See issuer",
    studentEligibility: "Post-secondary students — confirm on CIBC",
    network: "Visa / Mastercard",
  },
  // United States
  {
    id: "capital-one-students-hub",
    name: "Capital One student credit cards",
    country: "US",
    category: "credit",
    tagline: "Official Capital One students credit cards hub",
    whyStudents:
      "Capital One’s students hub explains student card options and how to compare them. Confirm current products and terms on the official site.",
    href: "https://www.capitalone.com/credit-cards/students/",
    cta: "See Capital One student cards",
    source: "curated",
    affiliate: false,
    annualFee: "See issuer",
    advertisedWelcome: "See issuer",
    studentEligibility: "Students — confirm on Capital One",
    network: "Mastercard / Visa",
  },
  {
    id: "capital-one-quicksilver-student",
    name: "Capital One Quicksilver Student",
    country: "US",
    category: "credit",
    tagline: "Official Quicksilver Student card page",
    whyStudents:
      "Capital One’s Quicksilver Student page covers cash-back style rewards for students. Confirm APR, fees, and approval criteria on the official site.",
    href: "https://www.capitalone.com/credit-cards/quicksilver-student/",
    cta: "See Quicksilver Student",
    source: "curated",
    affiliate: false,
    annualFee: "See issuer",
    advertisedWelcome: "See issuer",
    studentEligibility: "Students — confirm on Capital One",
    network: "Mastercard",
  },
  {
    id: "capital-one-savor-student",
    name: "Capital One Savor Student",
    country: "US",
    category: "credit",
    tagline: "Official Savor Student card page",
    whyStudents:
      "Capital One’s Savor Student page covers dining and entertainment rewards for students. Confirm current terms on the official site.",
    href: "https://www.capitalone.com/credit-cards/savor-student/",
    cta: "See Savor Student",
    source: "curated",
    affiliate: false,
    annualFee: "See issuer",
    advertisedWelcome: "See issuer",
    studentEligibility: "Students — confirm on Capital One",
    network: "Mastercard",
  },
  {
    id: "discover-student",
    name: "Discover it® Student Cash Back",
    country: "US",
    category: "credit",
    tagline: "Student cash-back card from Discover",
    whyStudents:
      "Built for students building credit. Compare rewards, fees, and credit requirements on Discover’s official student card page.",
    href: "https://www.discover.com/credit-cards/student-credit-card/",
    cta: "See Discover student cards",
    source: "curated",
    affiliate: true,
    // Demo paid slot — leave false until Francesco turns it on for a paid deal.
    sponsored: false,
    sponsorLabel: "Featured — paid placement",
    placement: "cards",
    annualFee: "See issuer",
    advertisedWelcome: "See issuer",
    studentEligibility: "Students — confirm on Discover",
    network: "Discover",
  },
]

export type CardComparisonRow = {
  productId: string
  name: string
  annualFee: string
  advertisedWelcome: string
  studentEligibility: string
  network: string
  href: string
  cta: string
}

export function cardsForCountry(country: "CA" | "US"): StudentCardProduct[] {
  return STUDENT_CARDS.filter((card) => card.country === country)
}

export function cardComparisonRows(country: "CA" | "US"): CardComparisonRow[] {
  return cardsForCountry(country).map((card) => ({
    productId: card.id,
    name: card.name,
    annualFee: card.annualFee,
    advertisedWelcome: card.advertisedWelcome,
    studentEligibility: card.studentEligibility,
    network: card.network,
    href: card.href,
    cta: card.cta,
  }))
}
