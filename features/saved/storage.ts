import { SAVED_STORAGE_KEY, type SavedItem } from "@/features/saved/types"

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim(),
  )
}

export function readSaved(): SavedItem[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(SAVED_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed.filter(isSavedItem)
  } catch {
    return []
  }
}

export function writeSaved(items: SavedItem[]) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(items))
  } catch {
    /* quota / private mode */
  }
}

function isSavedItem(value: unknown): value is SavedItem {
  if (!value || typeof value !== "object") return false
  const item = value as SavedItem
  return (
    typeof item.id === "string" &&
    (item.kind === "scholarship" || item.kind === "loan") &&
    typeof item.title === "string" &&
    typeof item.href === "string" &&
    typeof item.subtitle === "string"
  )
}
