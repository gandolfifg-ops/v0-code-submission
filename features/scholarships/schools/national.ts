import type { SchoolAwardLink } from "@/features/scholarships/schools/types"

export const NSLSC: SchoolAwardLink = {
  id: "nslsc",
  title: "NSLSC",
  summary:
    "National Student Loans Service Centre — manage Canada Student Loans and grants after you apply through your province.",
  href: "https://www.csnpe-nslsc.canada.ca/en/home",
}

export function osapLink(schoolName: string): SchoolAwardLink {
  return {
    id: "osap",
    title: "OSAP",
    summary: `Ontario Student Assistance Program grants and loans for eligible students, including those at ${schoolName}.`,
    href: "https://www.ontario.ca/page/osap-ontario-student-assistance-program",
  }
}

export const QUEBEC_AFE: SchoolAwardLink = {
  id: "quebec-afe",
  title: "Aide financière aux études",
  summary:
    "Quebec’s official student loans and bursaries — apply and manage your file on the government site.",
  href: "https://www.quebec.ca/en/education/student-financial-assistance/online-services",
}

export const STUDENTAID_BC: SchoolAwardLink = {
  id: "studentaid-bc",
  title: "StudentAid BC",
  summary:
    "British Columbia student loans and grants for eligible residents — confirm terms on the official site.",
  href: "https://studentaidbc.ca/",
}

export const LORAN: SchoolAwardLink = {
  id: "loran",
  title: "Loran Scholars Award",
  summary:
    "National undergraduate award for Canadian high school students with character, service, and leadership.",
  href: "https://loranscholar.ca/",
}

export function schulichLink(schoolName?: string): SchoolAwardLink {
  return {
    id: "schulich",
    title: "Schulich Leader Scholarships",
    summary: schoolName
      ? `STEM entrance scholarships at selected Canadian universities, including ${schoolName} — confirm terms on the official site.`
      : "STEM entrance scholarships at selected Canadian universities — confirm partner schools and terms on the official site.",
    href: "https://www.schulichleaders.com/",
  }
}
