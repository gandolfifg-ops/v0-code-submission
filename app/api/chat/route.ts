import Anthropic from "@anthropic-ai/sdk";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

// Get and validate API key on each request (not at module init time)
function getAnthropicClient() {
  const apiKey = process.env.ANTHROPIC_API_KEY?.trim();
  
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY is missing or empty. Please add it in Settings > Vars.");
  }
  
  if (!apiKey.startsWith("sk-")) {
    throw new Error(`ANTHROPIC_API_KEY appears invalid. It should start with 'sk-' but starts with '${apiKey.substring(0, 3)}...'`);
  }
  
  return new Anthropic({ apiKey });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const messages = body?.messages ?? [];
  const system = body?.system ?? "";
  const country = body?.country ?? null;
  const systemPrompt = country ? `[Student is in: ${country}]\n\n${system}` : system;

  // Convert messages to Anthropic format
  const anthropicMessages = messages.map((m: { role: string; content: string }) => ({
    role: m.role as "user" | "assistant",
    content: m.content,
  }));

  // Create streaming response using Anthropic SDK
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const anthropic = getAnthropicClient();
        const response = await anthropic.messages.stream({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1200,
          system: systemPrompt,
          messages: anthropicMessages,
        });

        for await (const event of response) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            const data = JSON.stringify({ delta: { text: event.delta.text } });
            controller.enqueue(encoder.encode(`data: ${data}\n\n`));
          }
        }
        
        controller.enqueue(encoder.encode(`data: [DONE]\n\n`));
        controller.close();
      } catch (error) {
        console.error("[v0] Anthropic API error:", error);
        const errorMsg = error instanceof Error ? error.message : "Unknown error";
        const data = JSON.stringify({ delta: { text: `Error: ${errorMsg}. Please check your ANTHROPIC_API_KEY.` } });
        controller.enqueue(encoder.encode(`data: ${data}\n\n`));
        controller.enqueue(encoder.encode(`data: [DONE]\n\n`));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
