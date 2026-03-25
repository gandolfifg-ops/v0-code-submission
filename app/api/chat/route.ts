import { streamText, convertToModelMessages, UIMessage } from "ai";
import { anthropic } from "@ai-sdk/anthropic";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, system, country }: { messages: UIMessage[]; system: string; country: string | null } = await req.json();

  const systemPrompt = country
    ? `[Student is in: ${country}]\n\n${system}`
    : system;

  const result = streamText({
    model: anthropic("claude-3-5-haiku-20241022"),
    system: systemPrompt,
    messages: await convertToModelMessages(messages),
    maxTokens: 1024,
    abortSignal: req.signal,
  });

  return result.toUIMessageStreamResponse();
}
