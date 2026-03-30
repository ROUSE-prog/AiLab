"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
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

  return (
    <>
      <main className="relative min-h-screen flex flex-col overflow-hidden bg-[#7e5041d0] text-zinc-800">
        {/* Base background */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,#dfe8e4_0%,#c8d6cf_22%,#b8c7bf_45%,#9eb1ad_68%)]" />

        {/* VERY visible moving flow */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="flow-marquee">
            <div className="flow-sheet" />
            <div className="flow-sheet" />
          </div>
        </div>

        {/* Cursor spotlight */}
        {mounted && (
          <div
            className="pointer-events-none absolute inset-0 z-10"
            style={{
              background: `radial-gradient(360px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(226,240,232,0.18), rgba(144,170,162,0.10) 24%, transparent 62%)`,
            }}
          />
        )}

        {/* Soft top glow */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,240,205,0.10),transparent_42%)]" />

        <div className="relative z-20 mx-auto flex w-full max-w-5xl flex-1 flex-col px-6 py-12">
          <header className="mb-10 space-y-4">
            <p className="text-xs uppercase tracking-[0.2em] text-[#5c7166]">
              Steven Rouse / AI Product Lab
            </p>

            <h1 className="text-5xl font-semibold tracking-tight">AiLab</h1>

            <p className="max-w-xl text-[#33413b]">
              A personal AI engineering lab for building startup-style products,
              testing ideas fast, and turning prototypes into real tools.
            </p>

            <div className="flex gap-3 pt-2">
              <span className="rounded-full border border-white/30 bg-[#eef3ef]/80 px-4 py-1 text-sm text-[#33413b] backdrop-blur">
                3 live projects
              </span>
              <span className="rounded-full border border-white/30 bg-[#eef3ef]/80 px-4 py-1 text-sm text-[#33413b] backdrop-blur">
                Next.js + AI
              </span>
              <span className="rounded-full border border-white/30 bg-[#eef3ef]/80 px-4 py-1 text-sm text-[#33413b] backdrop-blur">
                YC-style prototypes
              </span>
            </div>
          </header>

          <section className="grid gap-6 sm:grid-cols-2">
            <Link
              href="/prompt-playground"
              className="group rounded-2xl border border-white/30 bg-[#f2f5f1]/60 p-6 backdrop-blur-md transition hover:scale-[1.02] hover:shadow-xl"
            >
              <div className="mb-3 flex justify-between text-sm text-[#6c7d76]">
                <span>01</span>
                <span className="rounded-full border px-3 py-0.5 text-xs">
                  Live
                </span>
              </div>

              <h2 className="mb-2 text-xl font-semibold">Prompt Playground</h2>

              <p className="text-sm text-[#43514b]">
                Experiment with prompts, streaming responses, and AI UX
                patterns.
              </p>
            </Link>

            <Link
              href="/vox-coach"
              className="group rounded-2xl border border-white/30 bg-[#f2f5f1]/60 p-6 backdrop-blur-md transition hover:scale-[1.02] hover:shadow-xl"
            >
              <div className="mb-3 flex justify-between text-sm text-[#6c7d76]">
                <span>02</span>
                <span className="rounded-full border px-3 py-0.5 text-xs">
                  Voice AI
                </span>
              </div>

              <h2 className="mb-2 text-xl font-semibold">VoxCoach</h2>

              <p className="text-sm text-[#43514b]">
                Voice-first AI language tutor with captions, feedback, and
                adaptive memory.
              </p>
            </Link>

            <Link
              href="/repo-mind"
              className="group rounded-2xl border border-white/30 bg-[#f2f5f1]/60 p-6 backdrop-blur-md transition hover:scale-[1.02] hover:shadow-xl"
            >
              <div className="mb-3 flex justify-between text-sm text-[#6c7d76]">
                <span>03</span>
                <span className="rounded-full border px-3 py-0.5 text-xs">
                  Search + AI
                </span>
              </div>

              <h2 className="mb-2 text-xl font-semibold">RepoMind</h2>

              <p className="text-sm text-[#43514b]">
                Search GitHub repositories and instantly understand what they
                do.
              </p>
            </Link>

            <div className="rounded-2xl border border-white/30 bg-[#edf2ee]/50 p-6 backdrop-blur-sm">
              <div className="mb-3 flex justify-between text-sm text-[#7b8b84]">
                <span>04</span>
                <span className="rounded-full border px-3 py-0.5 text-xs">
                  Coming Soon
                </span>
              </div>

              <h2 className="mb-2 text-xl font-semibold text-[#61736c]">
                Next Project
              </h2>

              <p className="text-sm text-[#5a6b65]">
                A new YC-style AI product is coming soon.
              </p>
            </div>
          </section>

          <footer className="mt-auto text-center text-sm text-[#4a5c55]">
            Created by{" "}
            <a
              href="https://linktr.ee/stevendrouse"
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-4 hover:text-[#1f3a2e]"
            >
              Steven Rouse
            </a>
          </footer>
        </div>
      </main>

      <style jsx global>{`
  .flow-marquee {
    position: absolute;
    inset: -20%;
    width: 120%;
    height: 120%;
    display: flex;
    justify-content: center;
    align-items: center;
    filter: blur(80px);
    mix-blend-mode: multiply;
    pointer-events: none;
  }

  .flow-sheet {
    position: absolute;
    width: 100%;
    height: 100%;
    background:
      radial-gradient(circle at 70% 30%, rgba(144, 88, 66, 0.42) 0%, transparent 20%),
      radial-gradient(circle at 40% 60%, rgba(95, 203, 119, 0.32) 0%, transparent 22%),
      radial-gradient(circle at 80% 75%, rgba(237, 150, 153, 0.28) 0%, transparent 20%),
      radial-gradient(circle at 30% 30%, rgba(173, 205, 189, 0.26) 0%, transparent 22%);
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }

  /* Layer 1 */
  .flow-marquee:nth-child(1) {
    animation: wanderOne 28s ease-in-out infinite;
  }

  /* Layer 2 (offset + different speed = "random") */
  .flow-marquee:nth-child(2) {
    animation: wanderTwo 34s ease-in-out infinite;
    animation-delay: -12s;
    opacity: 0.7;
  }

  @keyframes wanderOne {
    0% {
      transform: translateX(-10vw) translateY(-2vh) scale(1.05);
    }
    20% {
      transform: translateX(12vw) translateY(3vh) scale(1.1);
    }
    40% {
      transform: translateX(-6vw) translateY(6vh) scale(1.02);
    }
    60% {
      transform: translateX(14vw) translateY(-4vh) scale(1.12);
    }
    80% {
      transform: translateX(-8vw) translateY(2vh) scale(1.06);
    }
    100% {
      transform: translateX(-10vw) translateY(-2vh) scale(1.05);
    }
  }

  @keyframes wanderTwo {
    0% {
      transform: translateX(8vw) translateY(4vh) scale(1.02);
    }
    25% {
      transform: translateX(-14vw) translateY(-3vh) scale(1.08);
    }
    50% {
      transform: translateX(6vw) translateY(8vh) scale(1.04);
    }
    75% {
      transform: translateX(-10vw) translateY(1vh) scale(1.1);
    }
    100% {
      transform: translateX(8vw) translateY(4vh) scale(1.02);
    }
  }
`}</style>
    </>
  );
}