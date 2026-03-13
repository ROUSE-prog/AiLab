"use client";

import { FormEvent, useState } from "react";
import { useCompletion } from "@ai-sdk/react";

export default function Home() {
  const [systemPrompt, setSystemPrompt] = useState(
    "You are a helpful AI assistant."
  );

  const {
    completion,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
  } = useCompletion({
    api: "/api/prompt",
    streamProtocol: "text",
    body: {
      systemPrompt,
    },
  });

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    handleSubmit(e);
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-10">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-widest text-zinc-400">
            AiLab / Project 01
          </p>
          <h1 className="text-4xl font-semibold tracking-tight">
            Prompt Playground
          </h1>
          <p className="text-zinc-400">
            Experiment with prompts and observe how the model responds.
          </p>
        </header>

        <section className="grid gap-6 lg:grid-cols-2">
          <form
            onSubmit={onSubmit}
            className="space-y-5 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-xl"
          >
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-200">
                System Prompt
              </label>
              <textarea
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                rows={6}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm outline-none placeholder:text-zinc-500"
                placeholder="Define the AI's behavior..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-200">
                User Prompt
              </label>
              <textarea
                name="prompt"
                value={input}
                onChange={handleInputChange}
                rows={10}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm outline-none placeholder:text-zinc-500"
                placeholder="Ask something..."
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? "Generating..." : "Run Prompt"}
            </button>

            {error ? (
              <p className="text-sm text-red-400">{error.message}</p>
            ) : null}
          </form>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-xl">
  <div className="mb-3 flex items-center justify-between">
    <h2 className="text-lg font-medium">Output</h2>
    <span className="text-xs text-zinc-500">Streaming response</span>
  </div>

  <div className="h-[70vh] overflow-y-auto rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-sm leading-7 whitespace-pre-wrap">
    {completion || "Model response will appear here..."}
  </div>
</div>
        </section>
      </div>
    </main>
  );
}