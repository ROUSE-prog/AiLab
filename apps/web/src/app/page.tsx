import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <header className="mb-10 space-y-3">
          <h1 className="text-4xl font-semibold tracking-tight">AiLab</h1>
          <p className="text-zinc-400">
            A personal AI engineering lab for building startup-style products.
          </p>
        </header>

        <section className="grid gap-6 sm:grid-cols-2">
          
          {/* Project 01 */}
          <Link
            href="/prompt-playground"
            className="group rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 transition hover:border-zinc-600 hover:bg-zinc-900"
          >
            <h2 className="text-xl font-medium mb-2">
              Prompt Playground
            </h2>
            <p className="text-sm text-zinc-400">
              Experiment with prompts, streaming responses, and AI UX patterns.
            </p>
          </Link>

          {/* Project 02 */}
          <Link
            href="/vox-coach"
            className="group rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 transition hover:border-zinc-600 hover:bg-zinc-900"
          >
            <h2 className="text-xl font-medium mb-2">
              VoxCoach
            </h2>
            <p className="text-sm text-zinc-400">
              Voice-first AI language tutor with captions, feedback, and adaptive memory.
            </p>
          </Link>

        </section>
      </div>
    </main>
  );
}