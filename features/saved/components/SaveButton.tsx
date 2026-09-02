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
      onClick={() => toggle(item)}
      className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-border text-sm font-semibold text-foreground transition-colors hover:border-[#C9A84C]/40 hover:bg-muted/60 disabled:opacity-50"
    >
      <Bookmark className="h-4 w-4" fill={saved ? "currentColor" : "none"} />
      {saved ? "Saved" : "Save"}
    </button>
  )
}
