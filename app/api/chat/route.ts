import { streamText } from "ai";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  const { messages, system, country } = await req.json();

  const systemPrompt = country
    ? `[Student is in: ${country}]\n\n${system}`
    : system;

  const result = await streamText({
    model: "anthropic/claude-haiku-4-5-20251001",
    system: systemPrompt,
    messages,
    maxTokens: 1024,
  });

  return result.toDataStreamResponse();
}
