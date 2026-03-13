export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-semibold">AiLab</h1>

        <p className="text-zinc-400">
          A personal AI engineering lab for building AI products.
        </p>

        <a
          href="/prompt-playground"
          className="inline-block rounded-lg bg-white px-5 py-2 text-black font-medium"
        >
          Open Prompt Playground
        </a>
      </div>
    </main>
  )
}