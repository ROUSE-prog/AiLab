"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useCompletion } from "@ai-sdk/react";

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
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);

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
    setMounted(true);

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

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
    <>
      <main className="relative min-h-screen overflow-hidden bg-[#09090f] text-zinc-100">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.18),transparent_28%),linear-gradient(180deg,#09090f_0%,#0b1020_38%,#09090f_100%)]" />

        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="signal-flow signal-flow-1" />
          <div className="signal-flow signal-flow-2" />
          <div className="signal-grid" />
        </div>

        {mounted && (
          <div
            className="pointer-events-none absolute inset-0 z-10"
            style={{
              background: `radial-gradient(320px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(56,189,248,0.10), rgba(168,85,247,0.08) 22%, transparent 62%)`,
            }}
          />
        )}

        <div className="relative z-20 mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-10">
          <header className="mb-8 space-y-4">
            <Link
              href="/"
              className="inline-flex items-center text-sm text-zinc-400 transition hover:text-white"
            >
              ← Back to AiLab
            </Link>

            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.22em] text-cyan-300/70">
                AiLab / Project 01
              </p>

              <h1 className="text-5xl font-semibold tracking-tight text-white">
                Prompt Playground
              </h1>

              <p className="max-w-2xl text-lg leading-8 text-zinc-300">
                A signal-shaping studio for testing prompts, steering model
                behavior, and studying responses in real time.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 pt-1">
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-1 text-sm text-zinc-300 backdrop-blur">
                Streaming output
              </span>
              <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-1 text-sm text-cyan-200 backdrop-blur">
                Prompt history
              </span>
              <span className="rounded-full border border-fuchsia-400/20 bg-fuchsia-400/10 px-4 py-1 text-sm text-fuchsia-200 backdrop-blur">
                Experimental UI
              </span>
            </div>
          </header>

          <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <form
              onSubmit={onSubmit}
              className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
            >
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm uppercase tracking-[0.18em] text-zinc-400">
                    Controls
                  </p>
                  <h2 className="text-2xl font-semibold text-white">
                    Prompt Studio
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowHistoryMenu((prev) => !prev)}
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-zinc-200 transition hover:border-cyan-400/30 hover:bg-cyan-400/10"
                  >
                    History
                  </button>

                  {history.length > 0 ? (
                    <button
                      type="button"
                      onClick={clearHistory}
                      className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-zinc-400 transition hover:border-fuchsia-400/30 hover:bg-fuchsia-400/10 hover:text-fuchsia-200"
                    >
                      Clear
                    </button>
                  ) : null}
                </div>
              </div>

              {showHistoryMenu ? (
                <div className="mb-5 rounded-2xl border border-white/10 bg-black/20 p-4 backdrop-blur-sm">
                  <label className="mb-2 block text-sm font-medium text-zinc-200">
                    Prompt History
                  </label>

                  <select
                    value={selectedHistoryId}
                    onChange={(e) => loadHistoryItemById(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-100 outline-none"
                  >
                    <option value="">Select a previous prompt run</option>
                    {formattedHistory.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.label}
                      </option>
                    ))}
                  </select>

                  <p className="mt-2 text-xs text-zinc-400">
                    Load a previous system prompt, input, and response.
                  </p>
                </div>
              ) : null}

              <div className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-200">
                    System Prompt
                  </label>
                  <textarea
                    value={systemPrompt}
                    onChange={(e) => setSystemPrompt(e.target.value)}
                    rows={6}
                    className="w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-zinc-100 outline-none placeholder:text-zinc-500"
                    placeholder="Define the AI's behavior..."
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-200">
                    User Prompt
                  </label>
                  <div className="h-[280px] sm:h-[320px]">
                    <textarea
                      name="prompt"
                      value={input}
                      onChange={handleInputChange}
                      className="h-full w-full resize-none rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-zinc-100 outline-none placeholder:text-zinc-500"
                      placeholder="Ask something..."
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="min-w-[160px] flex-1 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-3 text-sm font-medium text-slate-950 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isLoading ? "Generating..." : "Run Prompt"}
                </button>

                <button
                  type="button"
                  onClick={resetPromptFields}
                  className="min-w-[140px] flex-1 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-zinc-200 transition hover:bg-white/10"
                >
                  Reset
                </button>
              </div>

              {error ? (
                <p className="mt-4 text-sm text-rose-300">{error.message}</p>
              ) : null}
            </form>

            <div className="flex min-h-[620px] flex-col rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.18em] text-zinc-400">
                    Output
                  </p>
                  <h2 className="text-2xl font-semibold text-white">
                    Response View
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={handleCopyOutput}
                  disabled={!completion.trim()}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-zinc-200 transition hover:border-cyan-400/30 hover:bg-cyan-400/10 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {copied ? "Copied!" : "Copy Output"}
                </button>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto rounded-2xl border border-white/10 bg-black/35 p-5 text-sm leading-7 text-zinc-100 whitespace-pre-wrap">
                {completion || "Model response will appear here..."}
              </div>
            </div>
          </section>

          <footer className="mt-auto pt-8 text-center text-sm text-zinc-500">
            Prompt Playground runs as a custom studio inside{" "}
            <span className="font-medium text-cyan-300">AiLab</span>.
          </footer>
        </div>
      </main>

      <style jsx global>{`
        .signal-flow {
          position: absolute;
          inset: -12%;
          filter: blur(90px);
          opacity: 0.65;
          mix-blend-mode: screen;
          pointer-events: none;
          will-change: transform;
        }

        .signal-flow-1 {
          background:
            radial-gradient(circle at 15% 25%, rgba(56, 189, 248, 0.20) 0%, transparent 24%),
            radial-gradient(circle at 78% 30%, rgba(168, 85, 247, 0.18) 0%, transparent 22%),
            radial-gradient(circle at 45% 80%, rgba(34, 211, 238, 0.12) 0%, transparent 20%);
          animation: driftSignalOne 24s ease-in-out infinite;
        }

        .signal-flow-2 {
          background:
            radial-gradient(circle at 82% 70%, rgba(59, 130, 246, 0.14) 0%, transparent 24%),
            radial-gradient(circle at 22% 72%, rgba(217, 70, 239, 0.12) 0%, transparent 20%),
            radial-gradient(circle at 56% 22%, rgba(103, 232, 249, 0.10) 0%, transparent 18%);
          animation: driftSignalTwo 30s ease-in-out infinite;
        }

        .signal-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 32px 32px;
          mask-image: radial-gradient(circle at center, black 35%, transparent 85%);
          opacity: 0.2;
          pointer-events: none;
        }

        @keyframes driftSignalOne {
          0% {
            transform: translateX(-3vw) translateY(-2vh) scale(1);
          }
          25% {
            transform: translateX(4vw) translateY(3vh) scale(1.06);
          }
          50% {
            transform: translateX(-2vw) translateY(6vh) scale(1.02);
          }
          75% {
            transform: translateX(6vw) translateY(-1vh) scale(1.08);
          }
          100% {
            transform: translateX(-3vw) translateY(-2vh) scale(1);
          }
        }

        @keyframes driftSignalTwo {
          0% {
            transform: translateX(2vw) translateY(2vh) scale(1.02);
          }
          25% {
            transform: translateX(-5vw) translateY(-2vh) scale(1.08);
          }
          50% {
            transform: translateX(3vw) translateY(5vh) scale(1.03);
          }
          75% {
            transform: translateX(-4vw) translateY(1vh) scale(1.06);
          }
          100% {
            transform: translateX(2vw) translateY(2vh) scale(1.02);
          }
        }
      `}</style>
    </>
  );
}