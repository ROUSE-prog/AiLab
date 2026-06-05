<img width="1920" height="958" alt="Screenshot 2026-06-05 at 11 39 29 AM" src="https://github.com/user-attachments/assets/4439b328-f938-4cbd-941a-42ad3f85cc85" />
# AiLab

AiLab is a modern AI experimentation platform built with Next.js 16 focused on interactive AI tools, creative workflows, and developer productivity.

Created by Steven Rouse.

## Features

### Prompt Playground

An AI sandbox for experimenting with prompts, streaming responses, prompt history, and rapid iteration workflows.

### VoxCoach

A realtime voice-based AI tutor experience featuring:

* Live captions
* Conversational memory
* Realtime interaction
* AI-assisted learning flows

### RepoMind

An AI-powered GitHub repository intelligence tool that helps developers quickly understand codebases.

Features include:

* GitHub repository search
* AI-generated repository summaries
* Owner/repository dynamic routing
* Developer-focused repo exploration
* Fast project onboarding assistance

Route example:

```bash
/repo-mind/[owner]/[repo]
```

### Modern Stack

* Next.js 16
* React
* TypeScript
* Tailwind CSS
* Vercel AI SDK
* Clerk Authentication
* Neon Postgres
* Prisma ORM
* UploadThing

## Project Structure

```bash
apps/web/
├── src/app/
│   ├── prompt-playground/
│   ├── repo-mind/
│   ├── vox-coach/
│   └── api/
```

## Getting Started

Clone the repository:

```bash
git clone https://github.com/ROUSE-prog/AiLab.git
```

Install dependencies:

```bash
npm install
```

Move into the web app:

```bash
cd apps/web
```

Run the development server:

```bash
npm run dev
```

Open:

```bash
http://localhost:3000
```

## Environment Variables

Create a `.env.local` file inside `apps/web`:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
```

## Vision

AiLab is designed as a growing ecosystem of AI-native tools focused on:

* Creative development
* Learning systems
* Voice interaction
* Developer tooling
* AI-assisted workflows
* Experimental interfaces
