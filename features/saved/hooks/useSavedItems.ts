"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { isSupabaseConfigured } from "@/features/saved/storage"
import {
  getSavedItems,
  hydrateSaved,
  removeSaved,
  subscribeSaved,
  toggleSaved,
} from "@/features/saved/store"
import type { SavedItem } from "@/features/saved/types"

export function useSavedItems() {
  const [items, setItems] = useState<SavedItem[]>([])
  const [ready, setReady] = useState(false)
  const cloudEnabled = isSupabaseConfigured()

  useEffect(() => {
    hydrateSaved()
    setItems(getSavedItems())
    setReady(true)
    return subscribeSaved(() => setItems(getSavedItems()))
  }, [])

  const ids = useMemo(() => new Set(items.map((item) => item.id)), [items])

  const toggle = useCallback((item: SavedItem) => {
    toggleSaved(item)
  }, [])

  const remove = useCallback((id: string) => {
    removeSaved(id)
  }, [])

  return { items, ids, ready, cloudEnabled, toggle, remove }
}
