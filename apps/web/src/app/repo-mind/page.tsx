"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

type Repo = {
  id: number;
  name: string;
  full_name: string;
  owner: string;
  description: string | null;
  stars: number;
  html_url: string;
};

export default function RepoMindPage() {
  const [query, setQuery] = useState("");
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
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

  async function handleSearch(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setRepos([]);

    try {
      const res = await fetch(
        `/api/github-search?q=${encodeURIComponent(query)}`
      );
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Search failed.");
      }

      setRepos(data.repos || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <main className="relative min-h-screen overflow-hidden bg-[#08110d] text-zinc-100">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.12),transparent_26%),linear-gradient(180deg,#08110d_0%,#0b1510_40%,#08110d_100%)]" />

        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="atlas-layer atlas-one" />
          <div className="atlas-layer atlas-two" />
          <div className="atlas-grid" />
        </div>

        {mounted && (
          <div
            className="pointer-events-none absolute inset-0 z-10"
            style={{
              background: `radial-gradient(340px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(74,222,128,0.10), rgba(59,130,246,0.06) 24%, transparent 62%)`,
            }}
          />
        )}

        <div className="relative z-20 mx-auto max-w-6xl px-6 py-10">
          <header className="mb-8 space-y-4">
            <Link
              href="/"
              className="inline-flex items-center text-sm text-zinc-400 transition hover:text-white"
            >
              ← Back to AiLab
            </Link>

            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.22em] text-emerald-300/70">
                AiLab / Project 03
              </p>

              <h1 className="text-5xl font-semibold tracking-tight text-white">
                RepoMind
              </h1>

              <p className="max-w-2xl text-lg leading-8 text-zinc-300">
                Search GitHub repositories, map the terrain, and understand
                codebases faster with AI-generated summaries.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 pt-1">
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-1 text-sm text-zinc-300 backdrop-blur">
                GitHub search
              </span>
              <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-1 text-sm text-emerald-200 backdrop-blur">
                Code exploration
              </span>
              <span className="rounded-full border border-sky-400/20 bg-sky-400/10 px-4 py-1 text-sm text-sky-200 backdrop-blur">
                AI summaries
              </span>
            </div>
          </header>

          <form
            onSubmit={handleSearch}
            className="mb-8 rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
          >
            <div className="flex flex-col gap-3 md:flex-row">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search repos, e.g. nextjs auth starter"
                className="flex-1 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-zinc-100 outline-none placeholder:text-zinc-500"
              />

              <button
                type="submit"
                disabled={loading || !query.trim()}
                className="rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-500 px-5 py-3 text-sm font-medium text-slate-950 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Searching..." : "Search"}
              </button>
            </div>

            {error ? (
              <p className="mt-3 text-sm text-rose-300">{error}</p>
            ) : null}
          </form>

          <section className="grid gap-4">
            {repos.map((repo) => (
              <Link
                key={repo.id}
                href={`/repo-mind/${repo.owner}/${repo.name}`}
                className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.25)] transition hover:border-emerald-400/20 hover:bg-white/[0.06]"
              >
                <div className="mb-2 flex items-center justify-between gap-4">
                  <h2 className="text-lg font-medium text-white">
                    {repo.full_name}
                  </h2>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-zinc-300">
                    ★ {repo.stars}
                  </span>
                </div>

                <p className="text-sm leading-7 text-zinc-300">
                  {repo.description || "No description available."}
                </p>
              </Link>
            ))}

            {!loading && repos.length === 0 && !error ? (
              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 text-sm text-zinc-400 backdrop-blur-xl">
                Search for a repository to get started.
              </div>
            ) : null}
          </section>
        </div>
      </main>

      <style jsx global>{`
        .atlas-layer {
          position: absolute;
          inset: -12%;
          filter: blur(90px);
          opacity: 0.55;
          mix-blend-mode: screen;
          pointer-events: none;
          will-change: transform;
        }

        .atlas-one {
          background:
            radial-gradient(circle at 18% 28%, rgba(74, 222, 128, 0.14) 0%, transparent 20%),
            radial-gradient(circle at 82% 22%, rgba(56, 189, 248, 0.10) 0%, transparent 18%);
          animation: atlasDriftOne 24s ease-in-out infinite;
        }

        .atlas-two {
          background:
            radial-gradient(circle at 62% 72%, rgba(16, 185, 129, 0.10) 0%, transparent 22%),
            radial-gradient(circle at 30% 74%, rgba(148, 163, 184, 0.08) 0%, transparent 18%);
          animation: atlasDriftTwo 30s ease-in-out infinite;
        }

        .atlas-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 32px 32px;
          mask-image: radial-gradient(circle at center, black 35%, transparent 85%);
          opacity: 0.18;
          pointer-events: none;
        }

        @keyframes atlasDriftOne {
          0% {
            transform: translateX(-2vw) translateY(-2vh) scale(1);
          }
          50% {
            transform: translateX(4vw) translateY(2vh) scale(1.06);
          }
          100% {
            transform: translateX(-2vw) translateY(-2vh) scale(1);
          }
        }

        @keyframes atlasDriftTwo {
          0% {
            transform: translateX(2vw) translateY(2vh) scale(1.02);
          }
          50% {
            transform: translateX(-4vw) translateY(-2vh) scale(1.08);
          }
          100% {
            transform: translateX(2vw) translateY(2vh) scale(1.02);
          }
        }
      `}</style>
    </>
  );
}