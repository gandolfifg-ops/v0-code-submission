export type ChatDeepLink = {
  href: string
  label: string
}

const BANKING =
  /\b(bank|banking|chequing|checking|savings|hisa|tfsa|rrsp|fhsa|roth|eq bank|tangerine|rbc|wealthsimple|sofi|ally|fidelity|betterment|student account)\b/i
const CANADA_BANKING =
  /\b(canada|canadian|eq bank|tangerine|rbc|wealthsimple|osap|chequing)\b/i
const US_ONLY =
  /\b(united states|\bu\.?s\.?a?\b|sofi|ally|fidelity|betterment|fafsa|roth)\b/i
const SCHOLARSHIPS = /\b(scholarships?|bursar|awards?\b|grants?)\b/i
const LOANS = /\b(loans?|lender|osap|nslsc|apr|federal student loan)\b/i
const QUEENS = /\bqueen'?s\b|\bqueensu\b/i
const UOFT = /\b(u\s*of\s*t|uoft|university of toronto|utoronto)\b/i
const UBC = /\b(ubc|university of british columbia)\b/i
const SCHOOLS_HUB = /\b(school pages?|which school|my university|registrar)\b/i

/** Topic destinations — 2–4 in-app buttons, not auto-links in the paragraph. */
export function extractChatDeepLinks(content: string): ChatDeepLink[] {
  const text = content.trim()
  if (!text) return []

  const banking = BANKING.test(text)
  const scholarships = SCHOLARSHIPS.test(text)
  const loans = LOANS.test(text)
  const canadaGuide = banking && (CANADA_BANKING.test(text) || !US_ONLY.test(text))
  const queens = QUEENS.test(text)
  const uoft = UOFT.test(text)
  const ubc = UBC.test(text)

  const links: ChatDeepLink[] = []
  const add = (href: string, label: string) => {
    if (links.some((l) => l.href === href)) return
    if (links.length >= 4) return
    links.push({ href, label })
  }

  if (queens) add("/scholarships/queens", "Queen’s awards")
  if (uoft) add("/scholarships/u-of-t", "U of T awards")
  if (ubc) add("/scholarships/ubc", "UBC awards")
  if (queens || uoft || ubc || SCHOOLS_HUB.test(text)) add("/schools", "School pages")

  if (banking) {
    add("/", "Marketplace")
    if (canadaGuide) add("/guides/best-student-bank-canada", "Canada bank guide")
  }
  if (scholarships) add("/scholarships", "Scholarships")
  if (loans) add("/loans", "Loans")
  if (loans && /\bosap\b/i.test(text)) add("/guides/osap-vs-private-loans", "OSAP vs private")

  if (links.length === 1 && scholarships) add("/scholarships#student-profile", "Profile")
  if (links.length === 1 && loans) add("/", "Marketplace")

  return links.slice(0, 4)
}
