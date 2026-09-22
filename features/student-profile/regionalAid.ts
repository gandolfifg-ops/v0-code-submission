import type { LoanResult } from "@/features/loans/types"
import { resolveSchool } from "@/features/scholarships/schools"
import type { CanadaProvinceChip, StudentCountry } from "@/features/student-profile/types"

export type RegionalAidLink = {
  code: CanadaProvinceChip
  label: string
  name: string
  href: string
  cta: string
  loanId: string
}

export const CANADA_PROVINCE_CHIPS: RegionalAidLink[] = [
  {
    code: "ON",
    label: "ON",
    name: "Ontario",
    href: "https://www.ontario.ca/page/osap-ontario-student-assistance-program",
    cta: "Open OSAP",
    loanId: "ca-osap",
  },
  {
    code: "BC",
    label: "BC",
    name: "British Columbia",
    href: "https://studentaidbc.ca/",
    cta: "Open StudentAid BC",
    loanId: "ca-studentaid-bc",
  },
  {
    code: "AB",
    label: "AB",
    name: "Alberta",
    href: "https://studentaid.alberta.ca/",
    cta: "Open Alberta Student Aid",
    loanId: "ca-alberta-aid",
  },
  {
    code: "QC",
    label: "QC",
    name: "Quebec",
    href: "https://www.quebec.ca/en/education/student-financial-assistance/online-services",
    cta: "Open AFE Quebec",
    loanId: "ca-afe-quebec",
  },
  {
    code: "NS",
    label: "NS",
    name: "Nova Scotia",
    href: "https://novascotia.ca/studentassistance/",
    cta: "Open NS Student Assistance",
    loanId: "ca-ns-student-assistance",
  },
  {
    code: "Other",
    label: "Other",
    name: "Other provinces and territories",
    href: "https://www.canada.ca/en/services/benefits/education/student-aid/grants-loans.html",
    cta: "Open Canada Student Grants",
    loanId: "ca-student-grants-loans",
  },
]

export const US_REGIONAL_LINKS = [
  {
    id: "fafsa",
    label: "File FAFSA",
    href: "https://studentaid.gov/h/apply-for-aid/fafsa",
    loanId: "us-fafsa",
  },
  {
    id: "federal-loans",
    label: "Federal loan types",
    href: "https://studentaid.gov/understand-aid/types/loans",
    loanId: "us-federal-aid",
  },
] as const

const REGION_TO_CHIP: Record<string, CanadaProvinceChip> = {
  ontario: "ON",
  "british columbia": "BC",
  alberta: "AB",
  quebec: "QC",
  québec: "QC",
  "nova scotia": "NS",
}

export function normalizeCanadaProvince(input: string): CanadaProvinceChip | "" {
  const text = input.trim().toLowerCase().replace(/\./g, "")
  if (!text) return ""
  if (text === "on" || text === "ontario") return "ON"
  if (text === "bc" || text === "british columbia") return "BC"
  if (text === "ab" || text === "alberta") return "AB"
  if (text === "qc" || text === "quebec" || text === "québec") return "QC"
  if (text === "ns" || text === "nova scotia") return "NS"
  if (text === "other") return "Other"
  return REGION_TO_CHIP[text] ?? "Other"
}

export function provinceFromSchool(school: string): CanadaProvinceChip | "" {
  const registered = resolveSchool(school)
  if (!registered || registered.country !== "Canada") return ""
  return REGION_TO_CHIP[registered.region.trim().toLowerCase()] ?? ""
}

export function regionalAidForProvince(province: string): RegionalAidLink {
  const code = normalizeCanadaProvince(province) || "Other"
  return (
    CANADA_PROVINCE_CHIPS.find((chip) => chip.code === code) ??
    CANADA_PROVINCE_CHIPS[CANADA_PROVINCE_CHIPS.length - 1]
  )
}

/** Official provincial/territorial (or FAFSA) scholarship/aid card for search results. */
export function regionalScholarshipSeed(
  country: StudentCountry,
  provinceOrState: string,
): {
  id: string
  title: string
  provider: string
  eligibility: string
  url: string
} | null {
  if (country === "USA") {
    return {
      id: "seed-us-fafsa-regional",
      title: "FAFSA",
      provider: "U.S. Department of Education",
      eligibility:
        "Free Application for Federal Student Aid — start here for U.S. federal grants, loans, and work-study.",
      url: "https://studentaid.gov/h/apply-for-aid/fafsa",
    }
  }
  const aid = regionalAidForProvince(provinceOrState)
  return {
    id: `seed-ca-regional-${aid.code.toLowerCase()}`,
    title: aid.name === "Other provinces and territories" ? "Canada Student Grants and Loans" : `${aid.name} student aid`,
    provider: aid.name,
    eligibility: `${aid.cta.replace(/^Open\s+/i, "")} — official government student aid for ${aid.name}. Confirm eligibility and deadlines on the official site.`,
    url: aid.href,
  }
}

export function pinRegionalScholarshipResults<T extends { id: string; url: string }>(
  results: T[],
  country: StudentCountry,
  provinceOrState: string,
): T[] {
  const seed = regionalScholarshipSeed(country, provinceOrState)
  if (!seed) return results
  const matchUrl = seed.url.replace(/\/$/, "").toLowerCase()
  const pinned = results.filter(
    (item) => item.id === seed.id || item.url.replace(/\/$/, "").toLowerCase() === matchUrl,
  )
  const rest = results.filter(
    (item) => item.id !== seed.id && item.url.replace(/\/$/, "").toLowerCase() !== matchUrl,
  )
  return [...pinned, ...rest]
}

export function pinRegionalLoanResults(
  results: LoanResult[],
  country: StudentCountry,
  provinceOrState: string,
  loanType: string,
): LoanResult[] {
  if (loanType !== "Student") return results
  const pinId =
    country === "USA"
      ? "us-fafsa"
      : regionalAidForProvince(provinceOrState).loanId
  const pinned = results.filter((item) => item.id === pinId)
  const rest = results.filter((item) => item.id !== pinId)
  return [...pinned, ...rest]
}

/** Big-bank ATM networks are a real Canada comparison point — never invent campus machine lists. */
export function campusAtmsMatter(country: StudentCountry): boolean {
  return country === "Canada"
}
