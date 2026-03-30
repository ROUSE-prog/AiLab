"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type RepoDetailPageProps = {
  params: Promise<{
    owner: string;
    repo: string;
  }>;
};

export default function RepoDetailPage({ params }: RepoDetailPageProps) {
  const [owner, setOwner] = useState("");
  const [repo, setRepo] = useState("");
  const [loading, setLoading] = useState(true);
  const [explanation, setExplanation] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function init() {
      const resolved = await params;
      setOwner(resolved.owner);
      setRepo(resolved.repo);

      try {
        const res = await fetch("/api/repo-explain", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(resolved),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to explain repository.");
        }

        setExplanation(data.explanation || "");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error.");
      } finally {
        setLoading(false);
      }
    }

    init();
  }, [params]);

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-5xl px-6 py-8">
        <header className="mb-8 space-y-3">
          <Link
            href="/repo-mind"
            className="inline-flex items-center text-sm text-zinc-400 transition hover:text-white"
          >
            ← Back to RepoMind
          </Link>

          <p className="text-xs uppercase tracking-widest text-zinc-400">
            AiLab / Project 03
          </p>
          <h1 className="text-4xl font-semibold tracking-tight">
            {owner && repo ? `${owner}/${repo}` : "Repository"}
          </h1>
          <p className="text-zinc-400">
            AI-generated explanation of a GitHub repository.
          </p>
        </header>

        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-xl">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-medium">Explanation</h2>
            {owner && repo ? (
              <a
                href={`https://github.com/${owner}/${repo}`}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-zinc-400 transition hover:text-white"
              >
                Open on GitHub ↗
              </a>
            ) : null}
          </div>

          <div className="min-h-[300px] whitespace-pre-wrap rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-sm leading-7 text-zinc-200">
            {loading
              ? "Generating explanation..."
              : error
              ? error
              : explanation || "No explanation available."}
          </div>
        </section>
      </div>
    </main>
  );
}