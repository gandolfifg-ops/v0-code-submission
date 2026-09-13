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
}

export function normalizeCanadaProvince(input: string): CanadaProvinceChip | "" {
  const text = input.trim().toLowerCase().replace(/\./g, "")
  if (!text) return ""
  if (text === "on" || text === "ontario") return "ON"
  if (text === "bc" || text === "british columbia") return "BC"
  if (text === "ab" || text === "alberta") return "AB"
  if (text === "qc" || text === "quebec" || text === "québec") return "QC"
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
  return CANADA_PROVINCE_CHIPS.find((chip) => chip.code === code) ?? CANADA_PROVINCE_CHIPS[4]
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
