import { streamText, convertToModelMessages, UIMessage } from "ai";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, system, country }: { messages: UIMessage[]; system: string; country: string | null } = await req.json();

  const systemPrompt = country
    ? `[Student is in: ${country}]\n\n${system}`
    : system;

  const result = streamText({
    model: "anthropic/claude-haiku-4-5-20251001",
    system: systemPrompt,
    messages: await convertToModelMessages(messages),
    maxOutputTokens: 1024,
    abortSignal: req.signal,
  });

  return result.toUIMessageStreamResponse();
}
