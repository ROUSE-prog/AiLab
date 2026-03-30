"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

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

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);

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
    <>
      <main className="relative min-h-screen overflow-hidden bg-[#17110f] text-zinc-100">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(251,146,60,0.18),transparent_26%),linear-gradient(180deg,#17110f_0%,#1f1512_34%,#241814_68%,#17110f_100%)]" />

        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="aurora-layer aurora-one" />
          <div className="aurora-layer aurora-two" />
          <div className="aurora-layer aurora-three" />
        </div>

        {mounted && (
          <div
            className="pointer-events-none absolute inset-0 z-10"
            style={{
              background: `radial-gradient(340px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,220,190,0.14), rgba(251,146,60,0.10) 22%, transparent 62%)`,
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
              <p className="text-xs uppercase tracking-[0.22em] text-orange-200/70">
                AiLab / Project 02
              </p>

              <h1 className="text-5xl font-semibold tracking-tight text-white">
                VoxCoach
              </h1>

              <p className="max-w-2xl text-lg leading-8 text-zinc-300">
                A voice-first AI language tutor with conversation, pronunciation
                feedback, captions, and adaptive learner memory.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 pt-1">
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-1 text-sm text-zinc-300 backdrop-blur">
                Live captions
              </span>
              <span className="rounded-full border border-orange-400/20 bg-orange-400/10 px-4 py-1 text-sm text-orange-200 backdrop-blur">
                Voice practice
              </span>
              <span className="rounded-full border border-rose-400/20 bg-rose-400/10 px-4 py-1 text-sm text-rose-200 backdrop-blur">
                Adaptive memory
              </span>
            </div>
          </header>

          <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-6 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.18em] text-zinc-400">
                    Today&apos;s lesson
                  </p>
                  <h2 className="text-3xl font-semibold text-white">
                    {lessonTitle}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={startSession}
                  disabled={sessionStatus === "connecting"}
                  className="rounded-full bg-gradient-to-r from-orange-400 to-rose-400 px-5 py-2.5 text-sm font-medium text-slate-950 transition hover:opacity-90 disabled:opacity-50"
                >
                  {sessionStatus === "connecting"
                    ? "Connecting..."
                    : sessionStatus === "connected"
                    ? "Session Live"
                    : "Start Session"}
                </button>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-lg font-medium text-white">
                    Live Captions
                  </h3>
                  <span className="rounded-full border border-orange-400/20 bg-orange-400/10 px-3 py-1 text-xs text-orange-200">
                    realtime
                  </span>
                </div>

                <div className="h-[380px] overflow-y-auto space-y-3 text-sm leading-7 text-zinc-200">
                  {captions.map((line, idx) => (
                    <p
                      key={`${line}-${idx}`}
                      className="rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3"
                    >
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-6 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
                <div className="mb-3">
                  <p className="text-sm uppercase tracking-[0.18em] text-zinc-400">
                    Feedback
                  </p>
                  <h3 className="text-2xl font-semibold text-white">
                    Pronunciation Notes
                  </h3>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm leading-7 text-zinc-200">
                  {feedback}
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-6 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
                <div className="mb-3">
                  <p className="text-sm uppercase tracking-[0.18em] text-zinc-400">
                    Learner profile
                  </p>
                  <h3 className="text-2xl font-semibold text-white">
                    Memory Signals
                  </h3>
                </div>

                <div className="space-y-3">
                  {memory.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-zinc-200"
                    >
                      {item.text}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <footer className="mt-auto pt-8 text-center text-sm text-zinc-500">
            VoxCoach explores voice-native learning inside{" "}
            <span className="font-medium text-orange-200">AiLab</span>.
          </footer>
        </div>
      </main>

      <style jsx global>{`
        .aurora-layer {
          position: absolute;
          inset: -12%;
          filter: blur(90px);
          opacity: 0.68;
          mix-blend-mode: screen;
          pointer-events: none;
          will-change: transform;
        }

        .aurora-one {
          background:
            radial-gradient(circle at 20% 22%, rgba(251, 146, 60, 0.22) 0%, transparent 22%),
            radial-gradient(circle at 78% 28%, rgba(251, 113, 133, 0.16) 0%, transparent 24%);
          animation: auroraDriftOne 22s ease-in-out infinite;
        }

        .aurora-two {
          background:
            radial-gradient(circle at 68% 70%, rgba(255, 200, 120, 0.10) 0%, transparent 22%),
            radial-gradient(circle at 28% 74%, rgba(244, 114, 182, 0.08) 0%, transparent 20%);
          animation: auroraDriftTwo 28s ease-in-out infinite;
        }

        .aurora-three {
          background:
            radial-gradient(circle at 52% 42%, rgba(255, 155, 90, 0.08) 0%, transparent 20%);
          animation: auroraDriftThree 32s ease-in-out infinite;
        }

        @keyframes auroraDriftOne {
          0% {
            transform: translateX(-3vw) translateY(-2vh) scale(1);
          }
          50% {
            transform: translateX(4vw) translateY(3vh) scale(1.08);
          }
          100% {
            transform: translateX(-3vw) translateY(-2vh) scale(1);
          }
        }

        @keyframes auroraDriftTwo {
          0% {
            transform: translateX(2vw) translateY(2vh) scale(1.02);
          }
          50% {
            transform: translateX(-5vw) translateY(-3vh) scale(1.08);
          }
          100% {
            transform: translateX(2vw) translateY(2vh) scale(1.02);
          }
        }

        @keyframes auroraDriftThree {
          0% {
            transform: translateX(0vw) translateY(0vh) scale(1);
          }
          50% {
            transform: translateX(3vw) translateY(-2vh) scale(1.04);
          }
          100% {
            transform: translateX(0vw) translateY(0vh) scale(1);
          }
        }
      `}</style>
    </>
  );
}