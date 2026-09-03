"use client"

import { useState } from "react"
import { SaveButton } from "@/features/saved/components/SaveButton"
import { useSavedItems } from "@/features/saved/hooks/useSavedItems"
import type { SavedItem } from "@/features/saved/types"

type FollowThroughProps = {
  href: string
  cta: string
  checklist: readonly string[]
  item: SavedItem
  requirementsLabel?: string
}

export function FollowThrough({
  href,
  cta,
  checklist,
  item,
  requirementsLabel = "Common requirements:",
}: FollowThroughProps) {
  const [opened, setOpened] = useState(false)
  const { ids } = useSavedItems()
  const saved = ids.has(item.id)

  return (
    <div className="mt-3 min-w-0 space-y-3 md:mt-4">
      <div className="min-w-0">
        <p className="text-sm font-medium leading-snug text-muted-foreground">{requirementsLabel}</p>
        <ul className="mt-1.5 list-disc space-y-0.5 break-words pl-5 text-sm leading-snug text-muted-foreground">
          {checklist.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </div>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => setOpened(true)}
        className="inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-[#C9A84C] px-4 text-sm font-bold text-[#07090d] transition-colors hover:bg-[#b8973f]"
      >
        {cta}
      </a>
      {opened && !saved && (
        <p className="rounded-xl border border-[#C9A84C]/40 bg-[#C9A84C]/10 px-3 py-2 text-xs text-foreground">
          Come back and tap Save so you can track this.
        </p>
      )}
      <SaveButton item={item} />
    </div>
  )
}
