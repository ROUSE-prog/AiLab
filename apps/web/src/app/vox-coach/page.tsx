"use client";

import { useState } from "react";
import Link from "next/link";

type MemoryNote = {
  id: string;
  text: string;
};

export default function VoxCoachPage() {
  const [sessionStatus, setSessionStatus] = useState<
    "idle" | "connecting" | "connected"
  >("idle");
  const [lessonTitle] = useState("Ordering Coffee in Spanish");
  const [captions, setCaptions] = useState<string[]>([
    "AI: Hola. Hoy vamos a practicar cómo pedir café en español.",
  ]);
  const [feedback, setFeedback] = useState<string>(
    "Pronunciation feedback will appear here."
  );
  const [memory] = useState<MemoryNote[]>([
    { id: "1", text: "Needs practice with café stress." },
    { id: "2", text: "Still hesitates with quiero phrases." },
  ]);

  async function startSession() {
    try {
      setSessionStatus("connecting");

      const res = await fetch("/api/realtime", {
        method: "POST",
      });

      if (!res.ok) {
        throw new Error("Failed to create realtime session.");
      }

      const data = await res.json();
      console.log("Realtime session:", data);

      // Next step:
      // Use this ephemeral key to create a realtime client connection.
      setSessionStatus("connected");
      setCaptions((prev) => [
        ...prev,
        "System: Realtime session created successfully.",
      ]);
      setFeedback("Session connected. Next: wire microphone + live captions.");
    } catch (error) {
      console.error(error);
      setSessionStatus("idle");
      setFeedback("Could not start session.");
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-8">
       <header className="space-y-3">

  <Link
    href="/"
    className="inline-flex items-center text-sm text-zinc-400 transition hover:text-white"
  >
    ← Back to AiLab
  </Link>

  <p className="text-xs uppercase tracking-widest text-zinc-400">
    AiLab / Project 02
  </p>

  <h1 className="text-4xl font-semibold tracking-tight">
    VoxCoach
  </h1>

  <p className="text-zinc-400">
    Voice-first AI language coaching with captions, feedback, and memory.
  </p>

</header>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-zinc-400">Today&apos;s lesson</p>
                <h2 className="text-2xl font-semibold">{lessonTitle}</h2>
              </div>

              <button
                type="button"
                onClick={startSession}
                disabled={sessionStatus === "connecting"}
                className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-black transition hover:opacity-90 disabled:opacity-50"
              >
                {sessionStatus === "connecting"
                  ? "Connecting..."
                  : sessionStatus === "connected"
                  ? "Session Live"
                  : "Start Session"}
              </button>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
              <h3 className="mb-3 text-sm font-medium text-zinc-300">
                Live Captions
              </h3>

              <div className="h-[360px] overflow-y-auto space-y-3 text-sm leading-7">
                {captions.map((line, idx) => (
                  <p key={`${line}-${idx}`} className="text-zinc-200">
                    {line}
                  </p>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-xl">
              <h3 className="mb-3 text-lg font-medium">Pronunciation Feedback</h3>
              <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-sm text-zinc-200">
                {feedback}
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-xl">
              <h3 className="mb-3 text-lg font-medium">Learner Memory</h3>
              <div className="space-y-3">
                {memory.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-sm text-zinc-200"
                  >
                    {item.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}