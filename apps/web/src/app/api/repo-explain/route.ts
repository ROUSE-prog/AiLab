import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";

export async function POST(req: Request) {
  try {
    const { owner, repo, question } = await req.json();

    if (!owner || !repo) {
      return Response.json(
        { error: "Owner and repo are required." },
        { status: 400 }
      );
    }

    const readmeResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/readme`,
      {
        headers: {
          Accept: "application/vnd.github.raw+json",
          ...(process.env.GITHUB_TOKEN
            ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
            : {}),
        },
        cache: "no-store",
      }
    );

    if (!readmeResponse.ok) {
      return Response.json(
        { error: "Could not fetch repository README." },
        { status: 404 }
      );
    }

    const readme = await readmeResponse.text();

    const prompt = question
      ? `
You are a senior engineer helping someone understand a codebase.

Repository: ${owner}/${repo}

README:
${readme}

User question:
${question}

Answer clearly and practically.
`
      : `
Repository: ${owner}/${repo}

README:
${readme}

Explain:
1. What this repo does
2. Who it’s for
3. Key architecture
4. How to run it
`;

    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      prompt,
    });

    return Response.json({ result: text });
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}