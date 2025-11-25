# Hachi (ハチ)

**Visual Architecture Platform for Advanced RAG Systems**

## Executive Summary

**Hachi** is a collaborative visual platform for engineering teams who are building RAG systems and need to understand advanced retrieval architectures before implementation.

### The Problem

Engineering teams attempting to build production RAG systems often get stuck at naive implementations:
- They retrieve documents, pass them to an LLM, and get mediocre results
- They've read about HyDE, CRAG, and Fusion but can't visualize how these patterns fit together
- Architecture discussions happen on whiteboards that don't execute
- Failed experiments provide no insight into *why* they failed

### Hachi's Solution

Hachi provides a **React Flow canvas** where engineers can:
- **Design** advanced RAG architectures collaboratively
- **Execute** real pipelines against real data
- **Inspect** data flow at every step (Wire Tap)
- **Diagnose** why their approaches are failing
- **Iterate** on architecture as a team before committing to code

Hachi is not a low-code builder. It's an **engineering tool for understanding complex RAG systems**.

## Key Features

- **Visual Canvas**: Built on React Flow for designing data pipelines.
- **Wire Tap**: Inspect data flow at every step (inputs, outputs, transformations).
- **Real-Time Collaboration**: Live cursors, instant sync, and shared execution using Yjs.
- **Advanced RAG Nodes**: Pre-built nodes for HyDE, Parent-Child Retrieval, Fusion & Re-ranking, and CRAG.
- **Execution Engine**: Compiles visual graphs to executable Mastra workflows.

## System Architecture

### High-Level Stack
*   **Frontend:** Next.js 14 (App Router), React Flow (XYFlow), TailwindCSS, ShadcnUI
*   **State Management:** Zustand for local UI state, Yjs (CRDTs) for real-time collaboration
*   **Backend API:** Hono (lightweight, fast web framework)
*   **Database:** Supabase (PostgreSQL + pgvector), Drizzle ORM
*   **AI Engine:** Mastra (AI Framework)
*   **Infrastructure:** Docker, Server-Sent Events (SSE) for streaming

### Monorepo Structure
```text
/hachi-monorepo
├── apps
│   ├── web                 # Visual Architecture IDE (Next.js)
│   └── api                 # Mastra Execution Engine (Hono)
├── packages
│   ├── database            # Drizzle Schema & Migrations (Supabase + pgvector)
│   ├── mastra-core         # Custom Mastra Steps, Tools & Agents
│   ├── schemas             # Shared Zod Schemas (Node Inputs/Outputs)
│   └── ui                  # Shared Design System Components (ShadcnUI)
```

## Getting Started

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.3.0. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.
