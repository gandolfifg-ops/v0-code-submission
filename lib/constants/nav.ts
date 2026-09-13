export type NavLink = {
  href: string
  label: string
}

export const PRIMARY_NAV: NavLink[] = [
  { href: "/", label: "Marketplace" },
  { href: "/scholarships", label: "Scholarships" },
  { href: "/loans", label: "Loans" },
]

export const SECONDARY_NAV: NavLink[] = [
  { href: "/chat", label: "Chat" },
  { href: "/saved", label: "Saved" },
]

export const FOOTER_NAV: NavLink[] = [
  { href: "/about", label: "About" },
  { href: "/help", label: "Help" },
  { href: "/contact", label: "Contact" },
  { href: "/schools", label: "Schools" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/cookies", label: "Cookies" },
]

export const GUIDE_NAV: NavLink[] = [
  { href: "/guides/best-student-bank-canada", label: "Best student bank accounts (Canada)" },
  { href: "/guides/osap-vs-private-loans", label: "OSAP vs private loans" },
]

import { SCHOOL_PAGES, schoolPagePath } from "@/features/scholarships/schools"

export const SCHOOL_NAV: NavLink[] = SCHOOL_PAGES.map((school) => ({
  href: schoolPagePath(school),
  label: school.name,
}))

export const ALL_NAV: NavLink[] = [...PRIMARY_NAV, ...SECONDARY_NAV]

export function isActivePath(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/"
  return pathname === href || pathname.startsWith(`${href}/`)
}
