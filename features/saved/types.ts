export type SavedKind = "scholarship" | "loan" | "product"

export type SavedItem = {
  id: string
  kind: SavedKind
  title: string
  href: string
  subtitle: string
  savedAt: number
}

export const SAVED_STORAGE_KEY = "wealthnutz-saved-items"
