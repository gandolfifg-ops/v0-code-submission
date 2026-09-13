"use client"

import { useEffect, useRef, useState, type FormEvent } from "react"
import Link from "next/link"
import { Send } from "lucide-react"
import { ChatMarkdown } from "@/features/chat/components/ChatMarkdown"
import { ChatDeepLinks } from "@/features/chat/components/ChatDeepLinks"
import { SavedChats } from "@/features/chat/components/SavedChats"
import { CHAT_SYSTEM_PROMPT, SUGGESTIONS } from "@/features/chat/constants"
import {
  createEmptyThread,
  deleteChatThread,
  readActiveThreadId,
  readChatThreads,
  startNewChatThread,
  writeActiveThread,
  writeChatThreads,
  type ChatMessage,
  type ChatThread,
} from "@/features/chat/storage"

type Msg = ChatMessage

async function readChatStream(
  res: Response,
  onDelta: (text: string) => void,
): Promise<string> {
  if (!res.body) throw new Error("No response body")
  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let acc = ""
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    const chunk = decoder.decode(value, { stream: true })
    for (const line of chunk.split("\n").filter((l) => l.startsWith("data: "))) {
      const json = line.slice(6)
      if (json === "[DONE]") continue
      try {
        const parsed = JSON.parse(json)
        const delta = parsed?.delta?.text ?? ""
        if (delta) {
          acc += delta
          onDelta(acc)
        }
      } catch {
        /* ignore partial SSE chunks */
      }
    }
  }
  return acc
}

export function StudentChat() {
  const [configured, setConfigured] = useState<boolean | null>(null)
  const [configError, setConfigError] = useState<string | null>(null)
  const [msgs, setMsgs] = useState<Msg[]>([])
  const [threads, setThreads] = useState<ChatThread[]>([])
  const [activeId, setActiveId] = useState("")
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [threadReady, setThreadReady] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const threadsRef = useRef<ChatThread[]>([])
  const activeIdRef = useRef("")

  useEffect(() => {
    const loaded = readChatThreads()
    if (loaded.length === 0) {
      const empty = createEmptyThread()
      threadsRef.current = [empty]
      activeIdRef.current = empty.id
      setThreads([empty])
      setActiveId(empty.id)
      setMsgs([])
    } else {
      const id = readActiveThreadId(loaded) ?? loaded[0].id
      threadsRef.current = loaded
      activeIdRef.current = id
      setThreads(loaded)
      setActiveId(id)
      setMsgs(loaded.find((t) => t.id === id)?.messages ?? [])
    }
    setThreadReady(true)
  }, [])

  useEffect(() => {
    if (!threadReady || !activeId) return
    const next = writeActiveThread(threadsRef.current, activeId, msgs)
    threadsRef.current = next
    activeIdRef.current = activeId
    setThreads(next)
  }, [msgs, activeId, threadReady])

  useEffect(() => {
    let cancelled = false
    fetch("/api/chat")
      .then((r) => r.json())
      .then((data: { configured?: boolean }) => {
        if (!cancelled) setConfigured(Boolean(data.configured))
      })
      .catch(() => {
        if (!cancelled) {
          setConfigured(false)
          setConfigError("Could not reach the chat service.")
        }
      })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "nearest" })
  }, [msgs, loading])

  async function send(text: string) {
    const trimmed = text.trim()
    if (!trimmed || loading || configured === false) return

    const nextMsgs: Msg[] = [...msgs, { role: "user", content: trimmed }]
    setMsgs(nextMsgs)
    setInput("")
    setLoading(true)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMsgs,
          system: CHAT_SYSTEM_PROMPT,
        }),
      })

      if (res.status === 503) {
        const data = await res.json().catch(() => ({}))
        setConfigured(false)
        setConfigError(
          data?.error ??
            "Chat is unavailable because ANTHROPIC_API_KEY is not configured.",
        )
        setMsgs(nextMsgs)
        return
      }

      if (!res.ok) throw new Error("Chat request failed")

      setMsgs([...nextMsgs, { role: "assistant", content: "" }])
      const acc = await readChatStream(res, (textSoFar) => {
        setMsgs([...nextMsgs, { role: "assistant", content: textSoFar }])
      })
      if (!acc) {
        setMsgs([
          ...nextMsgs,
          {
            role: "assistant",
            content: "I didn't get a reply. Please try again.",
          },
        ])
      }
    } catch {
      setMsgs([
        ...nextMsgs,
        { role: "assistant", content: "Couldn't reach the assistant. Please try again." },
      ])
    } finally {
      setLoading(false)
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    void send(input)
  }

  function newChat() {
    if (loading) return
    threadsRef.current = writeActiveThread(threadsRef.current, activeIdRef.current, msgs)
    const started = startNewChatThread(threadsRef.current)
    threadsRef.current = started.threads
    activeIdRef.current = started.activeId
    setThreads(started.threads)
    setActiveId(started.activeId)
    setMsgs([])
  }

  function selectThread(id: string) {
    if (loading || id === activeIdRef.current) return
    threadsRef.current = writeActiveThread(threadsRef.current, activeIdRef.current, msgs)
    writeChatThreads(threadsRef.current, id)
    const next = threadsRef.current.find((t) => t.id === id)
    activeIdRef.current = id
    setThreads(threadsRef.current)
    setActiveId(id)
    setMsgs(next?.messages ?? [])
  }

  function removeThread(id: string) {
    if (loading) return
    threadsRef.current = writeActiveThread(threadsRef.current, activeIdRef.current, msgs)
    const result = deleteChatThread(threadsRef.current, id, activeIdRef.current)
    threadsRef.current = result.threads
    activeIdRef.current = result.activeId
    setThreads(result.threads)
    setActiveId(result.activeId)
    setMsgs(result.messages)
  }

  function deepLinkContext(index: number, assistantContent: string): string {
    let userText = ""
    for (let j = index - 1; j >= 0; j--) {
      if (msgs[j].role === "user") {
        userText = msgs[j].content
        break
      }
    }
    return `${userText}\n${assistantContent}`
  }

  const hasSaved = threads.some((t) => t.messages.length > 0)
  const showNewChat = threadReady && (msgs.length > 0 || hasSaved)

  return (
    <div className="mx-auto flex max-w-3xl flex-col px-4 py-8 sm:px-6 sm:py-10">
      <p className="text-xs font-semibold uppercase tracking-widest text-link">Chat</p>
      <div className="mt-2 flex flex-wrap items-start justify-between gap-3">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Student finance chat</h1>
        {showNewChat && (
          <button
            type="button"
            onClick={newChat}
            disabled={loading}
            className="min-h-11 shrink-0 rounded-lg border border-border px-3 text-sm font-medium text-foreground transition-colors hover:bg-muted disabled:opacity-50"
          >
            New chat
          </button>
        )}
      </div>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        Ask about scholarships, loans, and student banking. For search tools, use{" "}
        <Link href="/scholarships" className="font-medium text-link underline">
          Scholarships
        </Link>{" "}
        or{" "}
        <Link href="/loans" className="font-medium text-link underline">
          Loans
        </Link>
        . This is general education, not personalized advice. This thread stays in
        this browser only until you tap New chat.
      </p>

      {configured === false && (
        <div className="mt-6 rounded-xl border border-border bg-muted px-4 py-3 text-sm text-foreground">
          {configError ??
            "Chat is unavailable because ANTHROPIC_API_KEY is missing or invalid. Add the key in your environment, then refresh this page."}
        </div>
      )}

      {configured !== false && (
        <>
          {threadReady && (
            <SavedChats
              threads={threads}
              activeId={activeId}
              disabled={loading}
              onSelect={selectThread}
              onDelete={removeThread}
            />
          )}

          <div className="mt-6 min-h-[40vh] space-y-3 rounded-2xl border border-border bg-card p-4">
            {threadReady && msgs.length === 0 && (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Try a question:</p>
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => void send(s)}
                    disabled={loading || configured === null}
                    className="block w-full rounded-xl border border-border px-3 py-2.5 text-left text-sm text-foreground transition-colors hover:border-border hover:bg-muted/60 disabled:opacity-50"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
            {msgs.map((m, i) => (
              <div
                key={`${m.role}-${i}`}
                className={`max-w-[90%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "ml-auto bg-muted text-foreground"
                    : "bg-muted text-foreground"
                }`}
              >
                {m.role === "assistant" ? (
                  m.content ? (
                    <>
                      <ChatMarkdown content={m.content} />
                      <ChatDeepLinks content={deepLinkContext(i, m.content)} />
                    </>
                  ) : loading && i === msgs.length - 1 ? (
                    "…"
                  ) : (
                    ""
                  )
                ) : (
                  m.content
                )}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          <form onSubmit={onSubmit} className="mt-4 flex gap-2">
            <input
              className="min-h-11 flex-1 rounded-xl border border-border bg-background px-3 text-sm text-foreground"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about scholarships, loans, or banking…"
              disabled={loading || configured !== true}
            />
            <button
              type="submit"
              disabled={loading || !input.trim() || configured !== true}
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl bg-gold text-gold-foreground transition-colors hover:bg-gold-hover disabled:opacity-50"
              aria-label="Send"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </>
      )}
    </div>
  )
}
