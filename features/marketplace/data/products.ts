import type { MarketplaceProduct } from "@/features/marketplace/types"

export const MARKETPLACE_PRODUCTS: MarketplaceProduct[] = [
  // Canada — banking
  {
    id: "eq-bank",
    name: "EQ Bank Personal Account",
    country: "CA",
    category: "banking",
    tagline: "No monthly fees, high-interest everyday account",
    whyStudents:
      "One account for spending and saving, with no monthly fees. Open to Canadian residents who have reached the age of majority.",
    href: "https://www.eqbank.ca/personal-banking/personal-account",
    cta: "Open EQ Bank account",
    source: "curated",
    affiliate: true,
    featured: true,
  },
  {
    id: "tangerine-student",
    name: "Tangerine Chequing",
    country: "CA",
    category: "banking",
    tagline: "No-fee chequing that works as a student account",
    whyStudents:
      "Tangerine’s student banking page explains how to open a no-monthly-fee chequing account online (age 16+ for chequing).",
    href: "https://www.tangerine.ca/en/offers/student-bank-accounts",
    cta: "See Tangerine student banking",
    source: "curated",
    affiliate: true,
  },
  {
    id: "rbc-student",
    name: "RBC Advantage Banking for Students",
    country: "CA",
    category: "banking",
    tagline: "No monthly fee student chequing at a major bank",
    whyStudents:
      "Official RBC page for the Advantage Banking account for full-time students (13+), including how to apply online.",
    href: "https://www.rbcroyalbank.com/bank-accounts/youth-student-banking/advantage-banking-students.html",
    cta: "See RBC student chequing",
    source: "curated",
    affiliate: true,
  },
  // Canada — investing
  {
    id: "wealthsimple",
    name: "Wealthsimple",
    country: "CA",
    category: "investing",
    tagline: "Cash, TFSA, RRSP, and FHSA in one app",
    whyStudents:
      "A practical starting point for Canadian students who want commission-free investing and registered accounts.",
    href: "https://www.wealthsimple.com/en-ca",
    cta: "Open Wealthsimple",
    source: "curated",
    affiliate: true,
    featured: true,
  },
  // Canada — student aid
  {
    id: "nslsc",
    name: "NSLSC (Canada Student Loans)",
    country: "CA",
    category: "student-aid",
    tagline: "Official federal student loan and grant account",
    whyStudents:
      "Apply through your province/territory; manage repayment, RAP, and loan details on the National Student Loans Service Centre.",
    href: "https://www.csnpe-nslsc.canada.ca/en/home",
    cta: "Go to NSLSC",
    source: "official",
    affiliate: false,
    featured: true,
  },
  {
    id: "canlearn",
    name: "Canada Student Financial Assistance",
    country: "CA",
    category: "student-aid",
    tagline: "Federal grants and loans overview",
    whyStudents:
      "Government explainer for Canada Student Grants and Loans, eligibility, and how to apply in your province or territory.",
    href: "https://www.canada.ca/en/services/benefits/education/student-aid.html",
    cta: "Read student aid guide",
    source: "official",
    affiliate: false,
  },
  // US — banking
  {
    id: "sofi-students",
    name: "SoFi Student Checking & Savings",
    country: "US",
    category: "banking",
    tagline: "Student checking and savings with no monthly fees",
    whyStudents:
      "SoFi’s student banking page is for .edu applicants. Confirm current bonus and APY on their site — they change.",
    href: "https://www.sofi.com/banking/students/",
    cta: "Open SoFi student banking",
    source: "curated",
    affiliate: true,
    featured: true,
  },
  {
    id: "ally-savings",
    name: "Ally Bank Online Savings",
    country: "US",
    category: "banking",
    tagline: "No monthly fees, no minimums",
    whyStudents:
      "A straightforward U.S. online savings account if you want FDIC-insured savings without a branch requirement.",
    href: "https://www.ally.com/bank/online-savings-account/",
    cta: "See Ally savings",
    source: "curated",
    affiliate: true,
  },
  // US — investing
  {
    id: "fidelity-roth",
    name: "Fidelity Roth IRA",
    country: "US",
    category: "investing",
    tagline: "Roth IRA and zero-expense-ratio index funds",
    whyStudents:
      "Useful if you have earned income and want a long-term U.S. retirement account. Read eligibility on Fidelity’s Roth IRA page.",
    href: "https://www.fidelity.com/retirement-ira/roth-ira",
    cta: "Open a Fidelity Roth IRA",
    source: "curated",
    affiliate: true,
    featured: true,
  },
  {
    id: "betterment",
    name: "Betterment",
    country: "US",
    category: "investing",
    tagline: "Automated investing and IRAs",
    whyStudents:
      "Set-and-forget portfolios if you prefer target allocations over picking individual funds.",
    href: "https://www.betterment.com/",
    cta: "Start with Betterment",
    source: "curated",
    affiliate: true,
  },
  // US — student aid
  {
    id: "fafsa",
    name: "Federal Student Aid (FAFSA)",
    country: "US",
    category: "student-aid",
    tagline: "Official grants, federal loans, and work-study",
    whyStudents:
      "Start here for U.S. federal aid. Fill out the FAFSA on the government site — not a lender marketplace.",
    href: "https://studentaid.gov/h/apply-for-aid/fafsa",
    cta: "Start the FAFSA",
    source: "official",
    affiliate: false,
    featured: true,
  },
  {
    id: "studentaid",
    name: "StudentAid.gov",
    country: "US",
    category: "student-aid",
    tagline: "Aid types, repayment, and loan simulator",
    whyStudents:
      "The U.S. Department of Education hub for understanding aid, managing loans, and comparing repayment plans.",
    href: "https://studentaid.gov/",
    cta: "Explore StudentAid.gov",
    source: "official",
    affiliate: false,
  },
  // US — credit
  {
    id: "discover-student",
    name: "Discover it® Student Cash Back",
    country: "US",
    category: "credit",
    tagline: "Student cash-back card from Discover",
    whyStudents:
      "Built for students building credit. Compare rewards, fees, and credit requirements on Discover’s official student card page.",
    href: "https://www.discover.com/credit-cards/student/",
    cta: "See Discover student cards",
    source: "curated",
    affiliate: true,
  },
]

export const CATEGORY_LABELS: Record<MarketplaceProduct["category"], string> = {
  banking: "Banking & savings",
  investing: "Investing",
  "student-aid": "Official student aid",
  credit: "Credit building",
}

export const CATEGORY_ORDER: MarketplaceProduct["category"][] = [
  "banking",
  "investing",
  "student-aid",
  "credit",
]
