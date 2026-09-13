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

async function hasSignedInUser(): Promise<boolean> {
  if (!isSupabaseConfigured()) return false
  try {
    const { createClient } = await import("@/lib/supabase/client")
    const supabase = createClient()
    const { data } = await supabase.auth.getSession()
    return Boolean(data.session?.user)
  } catch {
    return false
  }
}

export function useSavedItems() {
  const [items, setItems] = useState<SavedItem[]>([])
  const [ready, setReady] = useState(false)
  const [signedIn, setSignedIn] = useState(false)

  useEffect(() => {
    hydrateSaved()
    setItems(getSavedItems())
    setReady(true)
    void hasSignedInUser().then(setSignedIn)
    return subscribeSaved(() => setItems(getSavedItems()))
  }, [])

  const ids = useMemo(() => new Set(items.map((item) => item.id)), [items])

  const toggle = useCallback((item: SavedItem) => {
    toggleSaved(item)
  }, [])

  const remove = useCallback((id: string) => {
    removeSaved(id)
  }, [])

  return { items, ids, ready, signedIn, toggle, remove }
}
