export const CHAT_STORAGE_KEY = "wealthnutz.chatThread"

export type ChatRole = "user" | "assistant"
export type ChatMessage = { role: ChatRole; content: string }

const MAX_MESSAGES = 80

function isChatMessage(value: unknown): value is ChatMessage {
  if (!value || typeof value !== "object") return false
  const item = value as ChatMessage
  return (
    (item.role === "user" || item.role === "assistant") &&
    typeof item.content === "string"
  )
}

export function readChatThread(): ChatMessage[] {
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

export function writeChatThread(messages: ChatMessage[]): void {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(
      CHAT_STORAGE_KEY,
      JSON.stringify(messages.slice(-MAX_MESSAGES)),
    )
  } catch {
    /* quota / private mode */
  }
}

export function clearChatThread(): void {
  if (typeof window === "undefined") return
  try {
    window.localStorage.removeItem(CHAT_STORAGE_KEY)
  } catch {
    /* private mode */
  }
}
