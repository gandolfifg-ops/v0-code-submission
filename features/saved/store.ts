import { readSaved, writeSaved } from "@/features/saved/storage"
import type { SavedItem } from "@/features/saved/types"

type Listener = () => void

let items: SavedItem[] = []
let hydrated = false
const listeners = new Set<Listener>()

function emit() {
  for (const listener of listeners) listener()
}

export function hydrateSaved() {
  if (hydrated) return
  items = readSaved()
  hydrated = true
  emit()
}

export function getSavedItems() {
  return items
}

export function subscribeSaved(listener: Listener) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function toggleSaved(item: SavedItem) {
  const exists = items.some((row) => row.id === item.id)
  items = exists ? items.filter((row) => row.id !== item.id) : [item, ...items]
  writeSaved(items)
  emit()
}

export function removeSaved(id: string) {
  items = items.filter((row) => row.id !== id)
  writeSaved(items)
  emit()
}
