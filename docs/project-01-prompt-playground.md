# Project 01 — Prompt Playground

## Overview

The Prompt Playground is a simple AI experimentation tool built to explore how different prompts affect model responses.

It allows users to define a **system prompt** and **user prompt**, then observe how the model generates responses in real time using streaming.

This project focuses on building the core foundation for AI-powered applications using modern web tooling.

---

# Features

* System prompt input
* User prompt input
* Streaming AI responses
* Scrollable output panel
* Clean responsive UI
* Error handling for API requests

---

# Tech Stack

Frontend

* Next.js (App Router)
* TypeScript
* Tailwind CSS

AI Layer

* Vercel AI SDK
* OpenAI API

Infrastructure

* Next.js API Routes
* Streaming text responses

---

# Architecture

User Flow

```text
User enters system prompt
        ↓
User enters prompt
        ↓
Frontend sends request to API route
        ↓
API route calls OpenAI model
        ↓
Model streams response
        ↓
Frontend renders tokens in real-time
```

---

# Folder Structure

```text
AiLab/
  apps/
    web/
      src/
        app/
          api/
            prompt/
              route.ts
          page.tsx
          layout.tsx
```

---

# Key Files

### `page.tsx`

The main UI for the prompt playground.

Responsibilities:

* prompt input UI
* system prompt input
* streaming output display
* form submission

---

### `route.ts`

Server-side route responsible for:

* receiving prompt requests
* calling the OpenAI API
* streaming model responses

---

# Streaming Implementation

Streaming responses improve UX by displaying text as the model generates it instead of waiting for the full response.

Implementation uses:

* `streamText` from the Vercel AI SDK
* `useCompletion` hook for frontend streaming

Example server flow:

```ts
const result = streamText({
  model: openai("gpt-4o-mini"),
  prompt,
  system: systemPrompt
})
```

The result is returned as a streaming response.

---

# What I Learned

This project introduced several important AI engineering concepts:

* integrating AI APIs into web apps
* handling streaming responses
* building prompt-driven interfaces
* debugging API route errors
* structuring a modern Next.js application

---

# Challenges

Some early issues included:

* incorrect Next.js folder structure
* route handling errors
* mismatched request body fields
* handling streaming responses in the frontend

These were resolved by aligning the API route with the frontend request structure and clearing stale Next.js builds.

---

# Future Improvements

Planned upgrades include:

### Prompt History

Allow users to revisit previous prompts.

### Prompt Comparison

Run two prompts side-by-side to compare results.

### Copy Output Button

Quickly copy AI responses.

### Prompt Templates

Save commonly used prompts.

### Markdown Rendering

Render formatted AI responses.

---

# Example Prompt

System Prompt

```text
You are a senior JavaScript mentor.
Explain concepts clearly with examples.
```

User Prompt

```text
Explain closures in JavaScript.
```

---

# Purpose in AiLab

The Prompt Playground serves as the **foundation project** for the AiLab repository.

It introduces the core building blocks used across many AI applications:

* prompt engineering
* AI API integration
* streaming model output
* frontend AI UX patterns

These skills will carry forward into later projects involving RAG systems, agents, and AI-assisted workflows.

