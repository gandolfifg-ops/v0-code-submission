"use client"

import { useEffect, useRef, useState, type FormEvent } from "react"
import Link from "next/link"
import { Send } from "lucide-react"
import { ChatMarkdown } from "@/features/chat/components/ChatMarkdown"
import { CHAT_SYSTEM_PROMPT, SUGGESTIONS } from "@/features/chat/constants"

type Role = "user" | "assistant"
type Msg = { role: Role; content: string }
type Country = "Canada" | "USA"

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
  const [country, setCountry] = useState<Country>("Canada")
  const [configured, setConfigured] = useState<boolean | null>(null)
  const [configError, setConfigError] = useState<string | null>(null)
  const [msgs, setMsgs] = useState<Msg[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

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
          country,
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

  return (
    <div className="mx-auto flex max-w-3xl flex-col px-4 py-8 sm:px-6 sm:py-10">
      <p className="text-xs font-semibold uppercase tracking-widest text-[#C9A84C]">Chat</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground">Student finance chat</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        Ask about scholarships, loans, and student banking. For search tools, use{" "}
        <Link href="/scholarships" className="font-medium text-[#8B6914] underline dark:text-[#C9A84C]">
          Scholarships
        </Link>{" "}
        or{" "}
        <Link href="/loans" className="font-medium text-[#8B6914] underline dark:text-[#C9A84C]">
          Loans
        </Link>
        . This is general education, not personalized advice.
      </p>

      <div className="mt-5 grid grid-cols-2 gap-2">
        {(["Canada", "USA"] as const).map((code) => (
          <button
            key={code}
            type="button"
            onClick={() => setCountry(code)}
            className={`min-h-11 rounded-xl text-sm font-semibold ${
              country === code
                ? "bg-[#C9A84C] text-[#07090d]"
                : "border border-border text-muted-foreground"
            }`}
          >
            {code === "Canada" ? "🇨🇦 Canada" : "🇺🇸 United States"}
          </button>
        ))}
      </div>

      {configured === false && (
        <div className="mt-6 rounded-xl border border-[#C9A84C]/40 bg-[#C9A84C]/10 px-4 py-3 text-sm text-foreground">
          {configError ??
            "Chat is unavailable because ANTHROPIC_API_KEY is missing or invalid. Add the key in your environment, then refresh this page."}
        </div>
      )}

      {configured !== false && (
        <>
          <div className="mt-6 min-h-[40vh] space-y-3 rounded-2xl border border-border bg-card p-4">
            {msgs.length === 0 && (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Try a question:</p>
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => void send(s)}
                    disabled={loading || configured === null}
                    className="block w-full rounded-xl border border-border px-3 py-2.5 text-left text-sm text-foreground hover:border-[#C9A84C]/40 disabled:opacity-50"
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
                    ? "ml-auto bg-[#C9A84C]/15 text-foreground"
                    : "bg-muted text-foreground"
                }`}
              >
                {m.role === "assistant" ? (
                  m.content ? (
                    <ChatMarkdown content={m.content} />
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
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl bg-[#C9A84C] text-[#07090d] disabled:opacity-50"
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
