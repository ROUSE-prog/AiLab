"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useCompletion } from "@ai-sdk/react";
import Link from "next/link";

type PromptHistoryItem = {
  id: string;
  systemPrompt: string;
  userPrompt: string;
  output: string;
  createdAt: string;
};

const HISTORY_KEY = "ailab-prompt-history";

function summarizePrompt(prompt: string) {
  const cleaned = prompt.replace(/\s+/g, " ").trim();
  if (!cleaned) return "Untitled prompt";
  return cleaned.length > 60 ? `${cleaned.slice(0, 60)}...` : cleaned;
}

export default function PromptPlaygroundPage() {
  const [systemPrompt, setSystemPrompt] = useState(
    "You are a helpful AI assistant."
  );
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<PromptHistoryItem[]>([]);
  const [lastSavedSignature, setLastSavedSignature] = useState("");
  const [showHistoryMenu, setShowHistoryMenu] = useState(false);
  const [selectedHistoryId, setSelectedHistoryId] = useState("");

  const {
    completion,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
    setInput,
    setCompletion,
  } = useCompletion({
    api: "/api/prompt",
    streamProtocol: "text",
    body: {
      systemPrompt,
    },
  });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      if (!raw) return;

      const parsed = JSON.parse(raw) as PromptHistoryItem[];
      if (Array.isArray(parsed)) {
        setHistory(parsed);
      }
    } catch (err) {
      console.error("Failed to load prompt history:", err);
    }
  }, []);

  useEffect(() => {
    if (isLoading) return;
    if (!input.trim() || !completion.trim()) return;

    const signature = `${systemPrompt}__${input}__${completion}`;
    if (signature === lastSavedSignature) return;

    const newItem: PromptHistoryItem = {
      id: crypto.randomUUID(),
      systemPrompt,
      userPrompt: input,
      output: completion,
      createdAt: new Date().toISOString(),
    };

    const nextHistory = [newItem, ...history].slice(0, 20);

    setHistory(nextHistory);
    setLastSavedSignature(signature);

    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(nextHistory));
    } catch (err) {
      console.error("Failed to save prompt history:", err);
    }
  }, [isLoading, completion, input, systemPrompt, history, lastSavedSignature]);

  async function handleCopyOutput() {
    if (!completion.trim()) return;

    try {
      await navigator.clipboard.writeText(completion);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch (err) {
      console.error("Failed to copy output:", err);
    }
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    handleSubmit(e);
  }

  function loadHistoryItemById(id: string) {
    const item = history.find((entry) => entry.id === id);
    if (!item) return;

    setSelectedHistoryId(id);
    setSystemPrompt(item.systemPrompt);
    setInput(item.userPrompt);
    setCompletion(item.output);
    setShowHistoryMenu(false);
  }

  function clearHistory() {
    setHistory([]);
    setSelectedHistoryId("");
    localStorage.removeItem(HISTORY_KEY);
    setShowHistoryMenu(false);
  }

  function resetPromptFields() {
    setInput("");
    setCompletion("");
    setSelectedHistoryId("");
  }

  const formattedHistory = useMemo(() => {
    return history.map((item) => ({
      ...item,
      label: summarizePrompt(item.userPrompt),
    }));
  }, [history]);

  return (
    <main className="h-screen overflow-hidden bg-cyan-950 text-zinc-100">
      <div className="mx-auto flex h-full max-w-6xl flex-col px-6 py-8">
        <header className="mb-6 space-y-3">
  
  <Link
    href="/"
    className="inline-flex items-center text-sm text-zinc-400 transition hover:text-white"
  >
    ← Back to AiLab
  </Link>

  <p className="text-xs uppercase tracking-widest text-zinc-400">
    AiLab / Project 01
  </p>

  <h1 className="text-4xl font-semibold tracking-tight">
    Prompt Playground
  </h1>

  <p className="text-zinc-400">
    Experiment with prompts, stream responses, and explore AI UX.
  </p>

</header>

        <section className="grid min-h-0 flex-1 gap-6 lg:grid-cols-2">
          <form
            onSubmit={onSubmit}
            className="flex min-h-0 flex-col rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-xl"
          >
            <div className="mb-5 flex items-center justify-between gap-3">
              <h2 className="text-lg font-medium">Prompt Controls</h2>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowHistoryMenu((prev) => !prev)}
                  className="rounded-xl border border-zinc-700 px-3 py-2 text-sm font-medium text-zinc-200 transition hover:bg-zinc-800"
                >
                  History
                </button>

                {history.length > 0 ? (
                  <button
                    type="button"
                    onClick={clearHistory}
                    className="rounded-xl border border-zinc-700 px-3 py-2 text-sm font-medium text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
                  >
                    Clear
                  </button>
                ) : null}
              </div>
            </div>

            {showHistoryMenu ? (
              <div className="mb-5 space-y-2 rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                <label className="text-sm font-medium text-zinc-200">
                  Prompt History
                </label>

                <select
                  value={selectedHistoryId}
                  onChange={(e) => loadHistoryItemById(e.target.value)}
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-zinc-100 outline-none"
                >
                  <option value="">Select a previous prompt run</option>
                  {formattedHistory.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label}
                    </option>
                  ))}
                </select>

                <p className="text-xs text-zinc-500">
                  Choose a previous prompt to reload its system prompt, input,
                  and output.
                </p>
              </div>
            ) : null}

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

            <div className="mt-5 flex min-h-0 flex-1 flex-col space-y-2">
              <label className="text-sm font-medium text-zinc-200">
                User Prompt
              </label>
              <textarea
                name="prompt"
                value={input}
                onChange={handleInputChange}
                rows={12}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm outline-none placeholder:text-zinc-500"
                placeholder="Ask something..."
              />
            </div>

            <div className="mt-6 flex flex-wrap gap-3">

  <button
    type="submit"
    disabled={isLoading}
    className="flex-1 min-w-[160px] rounded-xl bg-white px-5 py-3 text-sm font-medium text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
  >
    {isLoading ? "Generating..." : "Run Prompt"}
  </button>

  <button
    type="button"
    onClick={resetPromptFields}
    className="flex-1 min-w-[140px] rounded-xl border border-zinc-700 px-5 py-3 text-sm font-medium text-zinc-200 transition hover:bg-zinc-800"
  >
    Reset
  </button>

</div>

            {error ? (
              <p className="mt-4 text-sm text-red-400">{error.message}</p>
            ) : null}
          </form>

          <div className="flex min-h-0 flex-col rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-xl">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-medium">Output</h2>
                <span className="text-xs text-zinc-500">
                  Streaming response
                </span>
              </div>

              <button
                type="button"
                onClick={handleCopyOutput}
                disabled={!completion.trim()}
                className="rounded-xl border border-zinc-700 px-4 py-2.5 text-sm font-medium text-zinc-200 transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {copied ? "Copied!" : "Copy Output"}
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-sm leading-7 whitespace-pre-wrap">
              {completion || "Model response will appear here..."}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}