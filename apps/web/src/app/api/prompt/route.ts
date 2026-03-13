import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { prompt, systemPrompt } = await req.json();

    if (!prompt?.trim()) {
      return Response.json({ error: "Prompt is required." }, { status: 400 });
    }

    const result = streamText({
      model: openai("gpt-4o-mini"),
      system: systemPrompt?.trim() || undefined,
      prompt: prompt.trim(),
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Prompt route error:", error);
    return Response.json(
      { error: "Something went wrong while generating text." },
      { status: 500 }
    );
  }
}