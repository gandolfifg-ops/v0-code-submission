"use client"

import type { ChatThread } from "@/features/chat/storage"

function formatSavedAt(ts: number): string {
  try {
    return new Intl.DateTimeFormat(undefined, {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(ts))
  } catch {
    return ""
  }
}

export function SavedChats({
  threads,
  activeId,
  disabled,
  onSelect,
  onDelete,
}: {
  threads: ChatThread[]
  activeId: string
  disabled?: boolean
  onSelect: (id: string) => void
  onDelete: (id: string) => void
}) {
  const listed = [...threads]
    .filter((t) => t.messages.length > 0)
    .sort((a, b) => b.updatedAt - a.updatedAt)

  if (listed.length === 0) return null

  return (
    <section className="mt-6" aria-labelledby="saved-chats-heading">
      <h2
        id="saved-chats-heading"
        className="text-xs font-semibold uppercase tracking-widest text-[#C9A84C]"
      >
        Saved chats
      </h2>
      <ul className="mt-2 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
        {listed.map((thread) => {
          const isActive = thread.id === activeId
          return (
            <li key={thread.id} className="flex items-stretch gap-1">
              <button
                type="button"
                onClick={() => onSelect(thread.id)}
                disabled={disabled}
                className={`min-h-11 flex-1 px-3 py-2 text-left transition-colors disabled:opacity-50 ${
                  isActive
                    ? "bg-[#C9A84C]/15"
                    : "hover:bg-muted/60"
                }`}
              >
                <span className="block text-sm font-medium text-foreground">
                  {thread.title}
                </span>
                <span className="mt-0.5 block text-xs text-muted-foreground">
                  {formatSavedAt(thread.updatedAt)}
                  {isActive ? " · Open" : ""}
                </span>
              </button>
              <button
                type="button"
                onClick={() => onDelete(thread.id)}
                disabled={disabled}
                className="min-h-11 shrink-0 px-3 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
                aria-label={`Delete ${thread.title}`}
              >
                Delete
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
