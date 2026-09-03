export type ChatDeepLink = {
  href: string
  label: string
}

const DESTINATIONS: { label: string; href: string; pattern: RegExp }[] = [
  { label: "Scholarships", href: "/scholarships", pattern: /\bScholarships\b|\/scholarships(?:#|\b)/ },
  { label: "Loans", href: "/loans", pattern: /\bLoans\b|\/loans\b/ },
  { label: "Marketplace", href: "/", pattern: /\bMarketplace\b/ },
  { label: "Saved", href: "/saved", pattern: /\bSaved\b|\/saved\b/ },
  { label: "Profile", href: "/scholarships#student-profile", pattern: /\bstudent profile\b|\bYour profile\b|\bProfile\b|\/scholarships#student-profile/ },
]

/** Page destinations the assistant pointed to — not every use of “scholarship” or “loan”. */
export function extractChatDeepLinks(content: string): ChatDeepLink[] {
  const found: { href: string; label: string; index: number }[] = []
  for (const dest of DESTINATIONS) {
    const match = dest.pattern.exec(content)
    if (!match) continue
    found.push({ href: dest.href, label: dest.label, index: match.index })
  }
  found.sort((a, b) => a.index - b.index)
  return found.slice(0, 3).map(({ href, label }) => ({ href, label }))
}
