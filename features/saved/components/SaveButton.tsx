"use client"

import { Bookmark } from "lucide-react"
import { useSavedItems } from "@/features/saved/hooks/useSavedItems"
import type { SavedItem } from "@/features/saved/types"

export function SaveButton({ item }: { item: SavedItem }) {
  const { ids, toggle, ready } = useSavedItems()
  const saved = ids.has(item.id)

  return (
    <button
      type="button"
      disabled={!ready}
      aria-pressed={saved}
      aria-label={saved ? "Remove from saved" : "Save this listing"}
      onClick={() => toggle(item)}
      className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-border text-sm font-semibold text-foreground transition-colors hover:border-border hover:bg-muted/60 disabled:opacity-50"
    >
      <Bookmark className="h-4 w-4" fill={saved ? "currentColor" : "none"} aria-hidden="true" />
      {saved ? "Saved" : "Save"}
    </button>
  )
}
