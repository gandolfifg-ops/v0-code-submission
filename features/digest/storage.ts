export const DIGEST_LEAD_KEY = "wealthnutz-digest-lead"

export type DigestLead = {
  email: string
  country: "Canada" | "USA"
  school?: string
  cadence: "weekly"
  partnerUpdates: boolean
  savedAt: number
}

export function readDigestLead(): DigestLead | null {
  if (typeof window === "undefined") return null
  try {
    const raw = window.localStorage.getItem(DIGEST_LEAD_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as DigestLead
    if (!parsed?.email || typeof parsed.email !== "string") return null
    return parsed
  } catch {
    return null
  }
}

export function writeDigestLead(lead: DigestLead): void {
  if (typeof window === "undefined") return
  window.localStorage.setItem(DIGEST_LEAD_KEY, JSON.stringify(lead))
}
