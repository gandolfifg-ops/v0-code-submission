import Anthropic from "@anthropic-ai/sdk"
import { buildChatSystemPrompt, normalizeChatCountry } from "@/features/chat/catalog"
import { clientKey, rateLimit } from "@/lib/rateLimit"

export const dynamic = "force-dynamic"
export const maxDuration = 30

const CHAT_UNAVAILABLE =
  "Chat is temporarily unavailable. Please try again later, or use Scholarships and Loans to search official pages."

function getAnthropicClient() {
  const apiKey = process.env.ANTHROPIC_API_KEY?.trim()

  if (!apiKey) {
    throw new Error("Chat provider key is missing")
  }

  if (!apiKey.startsWith("sk-")) {
    throw new Error("Chat provider key is invalid")
  }

  return new Anthropic({ apiKey })
}

export async function GET() {
  const apiKey = process.env.ANTHROPIC_API_KEY?.trim()
  const configured = Boolean(apiKey && apiKey.startsWith("sk-"))
  return Response.json({ configured })
}

function lastUserText(messages: { role?: string; content?: string }[]): string {
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i]?.role === "user" && typeof messages[i]?.content === "string") {
      return messages[i].content ?? ""
    }
  }
  return ""
}

export async function POST(req: Request) {
  const limited = rateLimit(clientKey(req, "chat"), { limit: 20, windowMs: 60_000 })
  if (!limited.ok) {
    return Response.json(
      { error: "Too many chat messages. Please wait a moment and try again." },
      { status: 429, headers: { "Retry-After": String(limited.retryAfterSec) } },
    )
  }

  const apiKey = process.env.ANTHROPIC_API_KEY?.trim()
  if (!apiKey || !apiKey.startsWith("sk-")) {
    return Response.json({ error: CHAT_UNAVAILABLE }, { status: 503 })
  }

  const body = await req.json().catch(() => ({}))
  const messages = Array.isArray(body?.messages) ? body.messages : []
  const country = normalizeChatCountry(body?.country)
  const school = typeof body?.school === "string" ? body.school : ""
  const systemPrompt = buildChatSystemPrompt({
    country,
    school,
    lastUser: lastUserText(messages),
  })

  const anthropicMessages = messages
    .filter(
      (m: { role?: string; content?: unknown }) => m?.role === "user" || m?.role === "assistant",
    )
    .map((m: { role: string; content: string }) => ({
      role: m.role as "user" | "assistant",
      content: typeof m.content === "string" ? m.content : "",
    }))
    .filter((m: { content: string }) => m.content.length > 0)

  if (anthropicMessages.length === 0) {
    return Response.json({ error: "Send a question to start chat." }, { status: 400 })
  }

  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const anthropic = getAnthropicClient()
        const response = await anthropic.messages.stream({
          model: "claude-sonnet-4-5",
          max_tokens: 1200,
          system: systemPrompt,
          messages: anthropicMessages,
        })

        for await (const event of response) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            const data = JSON.stringify({ delta: { text: event.delta.text } })
            controller.enqueue(encoder.encode(`data: ${data}\n\n`))
          }
        }

        controller.enqueue(encoder.encode(`data: [DONE]\n\n`))
        controller.close()
      } catch (error) {
        console.error("[v0] Anthropic API error:", error)
        const data = JSON.stringify({
          delta: { text: CHAT_UNAVAILABLE },
        })
        controller.enqueue(encoder.encode(`data: ${data}\n\n`))
        controller.enqueue(encoder.encode(`data: [DONE]\n\n`))
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  })
}
