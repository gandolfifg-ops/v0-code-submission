export const CHAT_STORAGE_KEY = "wealthnutz.chatThread"
export const CHAT_THREADS_KEY = "wealthnutz.chatThreads"
export const CHAT_ACTIVE_ID_KEY = "wealthnutz.chatActiveThreadId"

export type ChatRole = "user" | "assistant"
export type ChatMessage = { role: ChatRole; content: string }

export type ChatThread = {
  id: string
  title: string
  createdAt: number
  updatedAt: number
  messages: ChatMessage[]
}

const MAX_MESSAGES = 80
const MAX_THREADS = 40
const TITLE_MAX = 48

function isChatMessage(value: unknown): value is ChatMessage {
  if (!value || typeof value !== "object") return false
  const item = value as ChatMessage
  return (
    (item.role === "user" || item.role === "assistant") &&
    typeof item.content === "string"
  )
}

function isChatThread(value: unknown): value is ChatThread {
  if (!value || typeof value !== "object") return false
  const item = value as ChatThread
  return (
    typeof item.id === "string" &&
    typeof item.title === "string" &&
    typeof item.createdAt === "number" &&
    typeof item.updatedAt === "number" &&
    Array.isArray(item.messages)
  )
}

function newId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID()
  }
  return `chat-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function titleFromMessages(messages: ChatMessage[]): string {
  const firstUser = messages.find((m) => m.role === "user")
  const raw = firstUser?.content.trim() ?? ""
  if (!raw) return "New chat"
  const oneLine = raw.split(/\n/)[0]?.trim() || raw
  if (oneLine.length <= TITLE_MAX) return oneLine
  return `${oneLine.slice(0, TITLE_MAX - 1)}…`
}

export function createEmptyThread(): ChatThread {
  const now = Date.now()
  return {
    id: newId(),
    title: "New chat",
    createdAt: now,
    updatedAt: now,
    messages: [],
  }
}

function clampMessages(messages: ChatMessage[]): ChatMessage[] {
  return messages.filter(isChatMessage).slice(-MAX_MESSAGES)
}

function normalizeThread(thread: ChatThread): ChatThread {
  const messages = clampMessages(thread.messages)
  return {
    ...thread,
    messages,
    title: titleFromMessages(messages),
  }
}

function sortThreads(threads: ChatThread[]): ChatThread[] {
  return [...threads].sort((a, b) => b.updatedAt - a.updatedAt)
}

function capThreads(threads: ChatThread[], activeId: string): ChatThread[] {
  const sorted = sortThreads(threads)
  if (sorted.length <= MAX_THREADS) return sorted
  const kept = sorted.slice(0, MAX_THREADS)
  if (!kept.some((t) => t.id === activeId)) {
    const active = sorted.find((t) => t.id === activeId)
    if (active) {
      kept.pop()
      kept.unshift(active)
    }
  }
  return sortThreads(kept)
}

function readLegacyMessages(): ChatMessage[] {
  if (typeof window === "undefined") return []
  try {
    const raw = window.localStorage.getItem(CHAT_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed.filter(isChatMessage).slice(-MAX_MESSAGES)
  } catch {
    return []
  }
}

function persistThreads(threads: ChatThread[]): void {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(CHAT_THREADS_KEY, JSON.stringify(threads))
  } catch {
    /* quota / private mode */
  }
}

function persistActiveId(id: string): void {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(CHAT_ACTIVE_ID_KEY, id)
  } catch {
    /* quota / private mode */
  }
}

function clearLegacyThread(): void {
  if (typeof window === "undefined") return
  try {
    window.localStorage.removeItem(CHAT_STORAGE_KEY)
  } catch {
    /* private mode */
  }
}

export function readChatThreads(): ChatThread[] {
  if (typeof window === "undefined") return []
  try {
    const raw = window.localStorage.getItem(CHAT_THREADS_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as unknown
      if (Array.isArray(parsed)) {
        return parsed.filter(isChatThread).map(normalizeThread)
      }
    }
  } catch {
    /* ignore corrupt store */
  }

  const legacy = readLegacyMessages()
  if (legacy.length === 0) return []
  const now = Date.now()
  const migrated: ChatThread = {
    id: newId(),
    title: titleFromMessages(legacy),
    createdAt: now,
    updatedAt: now,
    messages: legacy,
  }
  persistThreads([migrated])
  persistActiveId(migrated.id)
  clearLegacyThread()
  return [migrated]
}

export function readActiveThreadId(threads: ChatThread[]): string | null {
  if (typeof window === "undefined") return threads[0]?.id ?? null
  try {
    const id = window.localStorage.getItem(CHAT_ACTIVE_ID_KEY)
    if (id && threads.some((t) => t.id === id)) return id
  } catch {
    /* private mode */
  }
  return sortThreads(threads)[0]?.id ?? null
}

export function writeChatThreads(threads: ChatThread[], activeId: string): void {
  const capped = capThreads(threads.map(normalizeThread), activeId)
  persistThreads(capped)
  persistActiveId(activeId)
}

export function writeActiveThread(
  threads: ChatThread[],
  activeId: string,
  messages: ChatMessage[],
): ChatThread[] {
  const now = Date.now()
  const nextMessages = clampMessages(messages)
  const existing = threads.find((t) => t.id === activeId)
  const nextThread: ChatThread = existing
    ? {
        ...existing,
        messages: nextMessages,
        title: titleFromMessages(nextMessages),
        updatedAt: now,
      }
    : {
        id: activeId,
        title: titleFromMessages(nextMessages),
        createdAt: now,
        updatedAt: now,
        messages: nextMessages,
      }

  const others = threads.filter((t) => t.id !== activeId)
  const next = [nextThread, ...others]
  writeChatThreads(next, activeId)
  return next
}

export function deleteChatThread(
  threads: ChatThread[],
  id: string,
  activeId: string,
): { threads: ChatThread[]; activeId: string; messages: ChatMessage[] } {
  const remaining = threads.filter((t) => t.id !== id)
  if (remaining.length === 0) {
    const empty = createEmptyThread()
    writeChatThreads([], empty.id)
    return { threads: [empty], activeId: empty.id, messages: [] }
  }

  const nextActiveId =
    id === activeId ? sortThreads(remaining)[0].id : activeId
  writeChatThreads(remaining, nextActiveId)
  const active = remaining.find((t) => t.id === nextActiveId) ?? remaining[0]
  return {
    threads: remaining,
    activeId: nextActiveId,
    messages: active.messages,
  }
}

/** Start a blank thread. Existing saved threads are kept. */
export function startNewChatThread(threads: ChatThread[]): {
  threads: ChatThread[]
  activeId: string
} {
  const kept = threads.filter((t) => t.messages.length > 0)
  const empty = createEmptyThread()
  const next = [empty, ...kept]
  writeChatThreads(next, empty.id)
  return { threads: next, activeId: empty.id }
}
