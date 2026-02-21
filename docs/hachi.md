# Hachi (ハチ) — The Complete Engineering Document

**Visual Architecture Platform for Advanced RAG Systems**

Version 1.0 | Production Reference

---

## Table of Contents

1. [Vision & Identity](#1-vision--identity)
2. [The Problem — In Detail](#2-the-problem--in-detail)
3. [Target Users](#3-target-users)
4. [Core Use Cases](#4-core-use-cases)
5. [System Architecture](#5-system-architecture)
6. [Monorepo Structure](#6-monorepo-structure)
7. [Package Architecture](#7-package-architecture)
8. [Database Schema](#8-database-schema)
9. [API Specification](#9-api-specification)
10. [Authentication & Security](#10-authentication--security)
11. [The Visual Canvas](#11-the-visual-canvas)
12. [Node System](#12-node-system)
13. [Execution Engine](#13-execution-engine)
14. [Wire Tap — The Debugger](#14-wire-tap--the-debugger)
15. [State Management](#15-state-management)
16. [Real-Time Collaboration](#16-real-time-collaboration)
17. [Reference Architectures](#17-reference-architectures)
18. [Frontend Architecture](#18-frontend-architecture)
19. [Configuration & Credentials](#19-configuration--credentials)
20. [Deployment & Infrastructure](#20-deployment--infrastructure)
21. [Environment Variables](#21-environment-variables)
22. [Development Workflow](#22-development-workflow)
23. [Implementation Status](#23-implementation-status)
24. [Roadmap](#24-roadmap)

---

## 1. Vision & Identity

Hachi is an engineering tool. Not a chatbot builder. Not a low-code platform. Not a demo.

It exists because production RAG systems are architecturally complex and the gap between "I read about HyDE" and "I implemented a working HyDE pipeline" is enormous. Teams waste weeks wiring up retrieval patterns they don't fully understand, debugging failures they can't see, and having architecture discussions on whiteboards that never execute.

Hachi gives engineering teams a **React Flow canvas** where they design RAG architectures visually, **execute them against real data**, and **inspect every step** through Wire Tap. When your retrieval scores are garbage, you don't stare at logs — you click the connection between your Embed node and your Retrieve node and see exactly what vector was produced, what similarity scores came back, and why your results are wrong.

The name comes from Hachikō (ハチ公) — the dog famous for loyalty and reliability. That's the standard: a platform you can depend on to show you the truth about your RAG pipeline.

**Hachi is not:**
- A production deployment platform (you take the architecture and implement it)
- A no-code tool (our users write code for a living)
- A playground (real LLM calls, real embeddings, real data)
- A wrapper around LangChain/LlamaIndex (it compiles to Mastra workflows)

**Hachi is:**
- An architecture design tool for RAG systems
- A debugging environment with full data inspection
- A collaboration platform for engineering teams
- A reference library of proven retrieval patterns

---

## 2. The Problem — In Detail

### 2.1 The Naive RAG Trap

Every team starts the same way:

```
Query → Embed → Vector Search → Top K Results → Stuff into LLM → Response
```

This works for demos. It fails in production because:

1. **Short queries produce weak embeddings.** "pricing" becomes a sparse vector that matches everything poorly. The team doesn't know this because they never see the embedding.

2. **Vector search alone misses keyword matches.** A user searching for "error code E-4201" gets semantic matches about error handling instead of the specific document mentioning E-4201. Vector search is semantic — it doesn't do exact matching.

3. **Irrelevant context causes hallucination.** The retriever returns 5 documents, 3 are irrelevant, the LLM hallucinates based on the irrelevant ones. The team blames the LLM when the problem is the retriever.

4. **No visibility into failures.** When the pipeline produces wrong answers, the team has no idea which step failed. Was it the embedding? The retrieval? The prompt? They add logging, but logs are flat text — they don't show the data flow.

### 2.2 The Architecture Gap

Teams know these patterns exist:

| Pattern | What It Does | Why Teams Don't Use It |
|---------|-------------|----------------------|
| **HyDE** | Generates a hypothetical answer, embeds that instead of the query | Hard to visualize the improvement |
| **Hybrid Search** | Combines BM25 keyword search with vector search using RRF | Complex to wire up correctly |
| **Reranking** | Cross-encoder rescores retrieval results | Unclear when it helps vs hurts |
| **CRAG** | Judge evaluates retrieval quality, falls back to web search | Conditional routing is hard to debug |
| **Parent-Child** | Embed small chunks, return parent chunks for context | Chunking strategy is non-obvious |
| **Multi-Hop** | Iteratively retrieves and refines | Stopping condition is tricky |
| **Agentic RAG** | Agent decides when/how to retrieve | Agent behavior is opaque |

The knowledge exists in papers and blog posts. But going from "I understand the concept" to "I have a working implementation" requires:
- Wiring components together correctly
- Understanding data transformations between steps
- Debugging when intermediate results are wrong
- Comparing approaches to find the best one for your data

This is what Hachi solves.

### 2.3 Why Whiteboards Fail

Architecture discussions happen on whiteboards. The whiteboard shows boxes and arrows. But it doesn't show:
- What data flows through each arrow
- What happens when the Judge says "irrelevant"
- How the embedding of "pricing" differs from the embedding of "What are your pricing tiers for enterprise customers?"
- Whether reranking actually improves your results or just adds latency

Hachi replaces the whiteboard with a canvas that executes. Same boxes, same arrows — but you can run it and inspect every step.

---

## 3. Target Users

### 3.1 Primary: The RAG Engineering Team

**Profile:**
- 2-8 engineers building retrieval-augmented systems
- Already past "hello world" RAG — they've shipped a basic pipeline
- Hitting quality issues they can't diagnose
- Need to evaluate advanced patterns before committing to production code

**What they know:** Embeddings, vector databases, LLM APIs, basic RAG pipeline structure.

**What they struggle with:** Choosing between retrieval strategies, debugging quality issues, understanding why a pattern helps or hurts their specific data.

### 3.2 Secondary: The ML Platform Engineer

**Profile:**
- Building internal RAG infrastructure for multiple teams
- Needs to standardize retrieval patterns across the organization
- Creates reference architectures that other teams can adopt

### 3.3 Not Our Users

- Beginners learning what RAG is (we assume foundational knowledge)
- No-code builders (we're an engineering tool)
- Teams looking for a hosted RAG solution (we help you design, not deploy)
- Solo developers building simple chatbots (overkill for basic use cases)

---

## 4. Core Use Cases

### 4.1 Architecture Design

A team needs a RAG system for legal document search. Ambiguous queries are the primary challenge — lawyers search for concepts, not keywords.

**Workflow in Hachi:**
1. Load the Naive RAG template as a baseline
2. Run sample queries, inspect Wire Tap — see that short queries produce weak embeddings
3. Insert a HyDE node between Query and Embed — run again, Wire Tap shows the hypothetical document is much richer
4. Add a Judge node after Retrieve — Wire Tap shows it catches irrelevant results
5. Compare retrieval scores before and after each change
6. Export the architecture as the team's implementation blueprint

### 4.2 Debugging Failures

A deployed RAG system returns wrong answers for medical terminology queries. The team doesn't know why.

**Workflow in Hachi:**
1. Recreate the current pipeline on canvas
2. Run a failing query: "contraindications for metformin with renal impairment"
3. Wire Tap the Embed node → embedding captures "renal" but loses "contraindications" nuance
4. Wire Tap the Retrieve node → top results are about metformin dosing, not contraindications
5. Diagnosis: the embedding model doesn't understand medical term relationships
6. Solution: add domain-specific reranking or switch embedding model
7. Test fix, verify via Wire Tap that retrieval quality improves

### 4.3 Team Knowledge Sharing

A senior engineer understands CRAG. The implementing team doesn't.

**Workflow in Hachi:**
1. Senior builds CRAG pipeline on shared canvas (live cursors show the team what's happening)
2. Run a query that triggers the "relevant" path — Wire Tap shows Judge reasoning
3. Run a query that triggers the "irrelevant" path — Wire Tap shows fallback to web search
4. Team sees both paths, understands the routing logic, asks questions in real-time
5. Everyone now has the mental model to implement it

### 4.4 Pattern Comparison

A team needs to decide between HyDE and Hybrid Search for their use case.

**Workflow in Hachi:**
1. Build both pipelines side by side (or sequentially)
2. Run the same 10 queries through both
3. Compare retrieval scores, latency, and output quality via Wire Tap
4. Data-driven decision: HyDE is better for short queries, Hybrid Search is better for keyword-heavy queries
5. Maybe combine both — wire them together on canvas and test

---

## 5. System Architecture

### 5.1 High-Level Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| **Frontend** | Next.js 15 (App Router) | SSR, file-based routing, React Server Components |
| **Canvas** | React Flow (XYFlow) | Industry standard for node-based UIs, extensible |
| **Styling** | Tailwind CSS 4 + ShadcnUI | Utility-first CSS, production-quality component library |
| **State** | Zustand | Lightweight, TypeScript-native, no boilerplate |
| **Backend API** | Hono | Fast, lightweight, TypeScript-first web framework |
| **Database** | PostgreSQL (Supabase) + pgvector | Relational + vector search in one database |
| **ORM** | Drizzle | Type-safe queries, schema-as-code, fast migrations |
| **AI Engine** | Mastra | TypeScript AI framework with workflow orchestration |
| **Auth** | Better Auth | TypeScript-first, flexible, not NextAuth |
| **Encryption** | Web Crypto API (AES-256-GCM) | Native, no dependencies, production-grade |
| **Realtime** | Yjs + WebSocket | CRDT-based, offline-capable, proven at scale |
| **Build** | Turborepo + Bun | Fast monorepo builds, native TypeScript runtime |
| **Deployment** | Vercel (web) + Docker (API) | Edge deployment for web, containerized API |

### 5.2 Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         FRONTEND (Next.js)                          │
│                                                                     │
│  ┌─────────────┐    ┌──────────────┐    ┌────────────────────────┐  │
│  │ React Flow  │    │ Canvas Store │    │ Execution Log Store    │  │
│  │  (Canvas)   │◄──►│  (Zustand)   │◄──►│     (Zustand)          │  │
│  └──────┬──────┘    └──────┬───────┘    └──────────┬─────────────┘  │
│         │                  │                       │                │
│         │         ┌────────┴────────┐    ┌─────────┴──────────┐     │
│         │         │ Property Panel  │    │  Wire Tap Panel     │     │
│         │         └─────────────────┘    └────────────────────┘     │
│         │                                                           │
│  ┌──────┴──────────────────────────────────────────────────────┐    │
│  │              Collaboration Provider (Yjs)                    │    │
│  │  Live Cursors │ Presence │ Shared Canvas State               │    │
│  └──────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────┬───────────────────────────────┘
                                      │ HTTP / SSE / WebSocket
┌─────────────────────────────────────┴───────────────────────────────┐
│                        BACKEND API (Hono)                           │
│                                                                     │
│  ┌──────────┐  ┌───────────┐  ┌──────────┐  ┌──────────────────┐   │
│  │  Auth     │  │ Canvas    │  │ Runs     │  │  Documents       │   │
│  │ (Better)  │  │  CRUD     │  │ Execute  │  │  Upload/Search   │   │
│  └────┬─────┘  └─────┬─────┘  └────┬─────┘  └──────┬───────────┘   │
│       │               │             │               │               │
│  ┌────┴───────────────┴─────────────┴───────────────┴────────────┐  │
│  │                    Execution Engine                             │  │
│  │  Canvas JSON → Validate → Topological Sort → Mastra Workflow   │  │
│  │           → Execute Steps → Stream via SSE → Store Outputs     │  │
│  └────────────────────────────────┬──────────────────────────────┘  │
└───────────────────────────────────┬──────────────────────────────────┘
                                    │
┌───────────────────────────────────┴──────────────────────────────────┐
│                        DATA LAYER                                    │
│                                                                      │
│  ┌─────────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │  PostgreSQL          │  │  pgvector        │  │  Redis          │  │
│  │  (Supabase)          │  │  (Embeddings)    │  │  (Cache/Queue)  │  │
│  │                      │  │                  │  │                 │  │
│  │  users               │  │  documents       │  │  step_outputs   │  │
│  │  workspaces          │  │  (1536-dim)      │  │  (hot cache)    │  │
│  │  canvases            │  │                  │  │                 │  │
│  │  runs                │  │                  │  │  yjs_state      │  │
│  │  step_outputs        │  │                  │  │  (realtime)     │  │
│  │  credentials (enc)   │  │                  │  │                 │  │
│  └─────────────────────┘  └─────────────────┘  └─────────────────┘  │
└──────────────────────────────────────────────────────────────────────┘
```

### 5.3 Request Flow — Executing a Pipeline

```
1. User clicks "Run Workflow" with query "What is RAG?"
   │
2. Frontend: executionBar → useMockExecution.executeWorkflow(query)
   │
3. Canvas Store: getExecutionOrder() → topological sort → [query, hyde, embed, retrieve, generate]
   │
4. For each node in order:
   │  a. canvasStore.setNodeStatus(nodeId, "loading")     → node turns yellow
   │  b. executionLogStore.addEntry({nodeId, status: "running"})
   │  c. POST /api/runs/execute {canvasId, query}          → API receives
   │     │
   │     d. API: validateCanvas(graphJson)                  → check node types, connections
   │     e. API: createExecutionPlan(graphJson)             → topological sort + input mapping
   │     f. API: for each step in plan:
   │     │   i.   Get Mastra step executor (createHyDEStep, createEmbedStep, etc.)
   │     │   ii.  Execute step with input from previous step's output
   │     │   iii. Store step_output to database
   │     │   iv.  Emit SSE event: { type: "step_completed", nodeId, output, latencyMs }
   │     │
   │     g. API: emit SSE event: { type: "run_completed", runId }
   │
5. Frontend receives SSE events:
   │  a. step_completed → setNodeStatus(nodeId, "success"), node turns green
   │  b. step_completed → executionLogStore.updateEntry({nodeId, output, latencyMs})
   │  c. run_completed → canvasStore.isRunning = false
   │
6. User clicks Wire Tap → sees timeline of all steps with outputs
```

---

## 6. Monorepo Structure

```
/hachi
├── apps/
│   ├── web/                          # Next.js 15 — Visual IDE
│   │   ├── src/
│   │   │   ├── app/                  # App Router pages
│   │   │   │   ├── (auth)/           # Login, signup, invite accept
│   │   │   │   │   ├── login/
│   │   │   │   │   └── signup/
│   │   │   │   ├── (dashboard)/      # Authenticated dashboard
│   │   │   │   │   ├── layout.tsx    # Sidebar + header shell
│   │   │   │   │   ├── page.tsx      # Dashboard home
│   │   │   │   │   ├── canvases/     # Canvas list + editor
│   │   │   │   │   ├── documents/    # Document library
│   │   │   │   │   ├── runs/         # Execution history
│   │   │   │   │   └── workspaces/   # Workspace management
│   │   │   │   ├── features/         # /features marketing page
│   │   │   │   ├── templates/        # /templates marketing page
│   │   │   │   ├── layout.tsx        # Root layout (providers)
│   │   │   │   ├── page.tsx          # Landing page
│   │   │   │   └── providers.tsx     # QueryClient, ThemeProvider
│   │   │   │
│   │   │   ├── features/             # Feature modules
│   │   │   │   ├── canvas/           # THE CORE — visual pipeline builder
│   │   │   │   │   ├── canvas.tsx    # React Flow canvas component
│   │   │   │   │   ├── components/   # ExecutionBar, PropertyPanel, TemplatePicker
│   │   │   │   │   ├── nodes/        # 9 node type components
│   │   │   │   │   ├── edges/        # Custom data edge
│   │   │   │   │   ├── wire-tap/     # WireTapPanel, JSON viewer
│   │   │   │   │   ├── hooks/        # useMockExecution, useCanvasShortcuts
│   │   │   │   │   ├── config/       # Node defaults, template definitions
│   │   │   │   │   └── mock/         # Mock execution data
│   │   │   │   │
│   │   │   │   ├── landing/          # Landing page sections
│   │   │   │   ├── features-page/    # /features page sections
│   │   │   │   └── templates-page/   # /templates page sections
│   │   │   │
│   │   │   ├── stores/               # Zustand state management
│   │   │   │   ├── canvas-store.ts   # Nodes, edges, history, selection
│   │   │   │   └── execution-log-store.ts  # Timeline, outputs, test query
│   │   │   │
│   │   │   ├── components/           # Shared app components
│   │   │   │   ├── navbar.tsx
│   │   │   │   └── footer.tsx
│   │   │   │
│   │   │   └── lib/                  # Utilities
│   │   │       └── api.ts            # API client (fetch wrapper)
│   │   │
│   │   ├── next.config.ts
│   │   ├── postcss.config.mjs
│   │   └── vercel.json
│   │
│   └── api/                          # Hono — Backend API
│       ├── src/
│       │   ├── index.ts              # Hono app, route registration
│       │   ├── routes/
│       │   │   ├── auth.ts           # Better Auth passthrough
│       │   │   ├── canvas.ts         # Canvas CRUD
│       │   │   ├── workspaces.ts     # Workspace management
│       │   │   ├── documents.ts      # Document upload/search
│       │   │   └── runs.ts           # Execution runs
│       │   ├── services/
│       │   │   ├── execution/
│       │   │   │   ├── runner.ts     # Canvas → Mastra workflow execution
│       │   │   │   └── tracer.ts     # Step output capture for Wire Tap
│       │   │   ├── documents/
│       │   │   │   ├── chunker.ts    # Document → chunks
│       │   │   │   ├── embedder.ts   # Chunks → vectors
│       │   │   │   └── search.ts     # Vector similarity search
│       │   │   └── collaboration/
│       │   │       ├── server.ts     # Yjs WebSocket server
│       │   │       └── persistence.ts # Save Yjs state to DB
│       │   ├── middleware/
│       │   │   └── auth.ts           # requireAuth, optionalAuth
│       │   └── drizzle/              # Generated migrations
│       └── drizzle.config.ts
│
├── packages/
│   ├── database/                     # @hachi/database — Drizzle ORM
│   │   ├── src/schema/index.ts       # All table definitions
│   │   ├── drizzle.config.ts
│   │   └── drizzle/                  # Migrations
│   │
│   ├── auth/                         # @hachi/auth — Better Auth
│   │   └── src/
│   │       ├── auth.ts               # Server auth instance
│   │       └── client.ts             # Browser auth client
│   │
│   ├── encryption/                   # @hachi/encryption — AES-256-GCM
│   │   └── src/index.ts              # encrypt(), decrypt(), generateKey()
│   │
│   ├── schemas/                      # @hachi/schemas — Zod validation
│   │   └── src/
│   │       ├── nodes/                # Per-node config/input/output schemas
│   │       ├── handles/              # Connection type definitions
│   │       ├── execution/            # Run + step output schemas
│   │       └── api/                  # API request/response schemas
│   │
│   ├── mastra-core/                  # @hachi/mastra-core — AI execution
│   │   └── src/
│   │       ├── steps/                # Mastra step implementations
│   │       ├── tools/                # External tool integrations
│   │       ├── agents/               # ReAct agent definitions
│   │       ├── workflows/            # Pre-built workflow definitions
│   │       └── compiler/             # Canvas JSON → Mastra workflow
│   │
│   ├── realtime/                     # @hachi/realtime — Collaboration
│   │   └── src/
│   │       ├── provider.ts           # Yjs WebSocket provider
│   │       ├── presence.ts           # User presence tracking
│   │       ├── store.ts              # Realtime Zustand store
│   │       ├── hooks.ts              # useRealtime, usePresence
│   │       ├── types.ts
│   │       └── utils.ts
│   │
│   └── ui/                           # @hachi/ui — ShadcnUI components
│       ├── src/
│       │   ├── components/           # 50+ production components
│       │   ├── hooks/                # useMobile, etc.
│       │   ├── lib/utils.ts          # cn() utility
│       │   └── styles/globals.css    # Tailwind base styles
│       └── components.json           # ShadcnUI config
│
├── docs/                             # Documentation
│   ├── hachi.md                      # This document
│   ├── roadmap.md                    # Implementation roadmap
│   ├── hono.md                       # Hono framework reference
│   └── mono-setup.md                 # Bun workspace reference
│
├── package.json                      # Root workspace config
├── turbo.json                        # Turborepo task definitions
├── tsconfig.json                     # Root TypeScript config
├── bun.lock                          # Lockfile
└── CLAUDE.md                         # AI assistant instructions
```

---

## 7. Package Architecture

### 7.1 @hachi/database

The single source of truth for all data structures. Every table, every column, every relation defined in Drizzle schema-as-code.

**Schema exports all tables from `src/schema/index.ts`:**

```typescript
// Auth (Better Auth managed)
export const users          // id, email, name, avatarUrl, emailVerified
export const sessions       // id, userId, token, expiresAt, ipAddress, userAgent
export const accounts       // id, userId, providerId, accountId (OAuth links)
export const verifications  // id, identifier, value, expiresAt (email verification)

// Workspaces
export const workspaces           // id, name, createdAt
export const workspaceMembers     // workspaceId, userId, role (owner|admin|editor|viewer)
export const workspaceInvites     // id, workspaceId, email, token, role, expiresAt

// Credentials (encrypted)
export const workspaceCredentials // id, workspaceId, provider, credentialType, encryptedValue

// Canvases
export const canvases       // id, workspaceId, name, graphJson (JSONB), yjsState, createdBy

// Execution
export const runs           // id, canvasId, triggeredBy, input, status, startedAt, completedAt
export const stepOutputs    // id, runId, nodeId, input, output, latencyMs

// Documents (RAG)
export const documents      // id, workspaceId, content, metadata, embedding (pgvector 1536)
```

**Configuration:**
- Dialect: PostgreSQL
- Driver: Supabase connection string via `DATABASE_URL`
- Vector: pgvector extension with 1536 dimensions (OpenAI text-embedding-3-small)
- Migrations: `drizzle/` directory, generated via `bunx drizzle-kit generate`

### 7.2 @hachi/auth

Better Auth integration. Not NextAuth — Better Auth is TypeScript-first, simpler to customize, and doesn't fight you on session management.

**Server (`auth.ts`):**
```typescript
export const auth = betterAuth({
  database: drizzle(pool, { schema }),
  emailAndPassword: { enabled: true },
  socialProviders: {
    github: { clientId, clientSecret },    // if env vars present
    google: { clientId, clientSecret },     // if env vars present
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,          // 7 days
    updateAge: 60 * 60 * 24,              // refresh if >1 day old
  },
  user: {
    additionalFields: { name: string, avatarUrl: string }
  }
})
```

**Client (`client.ts`):**
```typescript
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000",
  basePath: "/api/auth",
})
```

### 7.3 @hachi/encryption

AES-256-GCM encryption for workspace API keys. Uses the Web Crypto API — zero dependencies, runs in any JavaScript runtime.

```typescript
encrypt(plaintext: string): Promise<string>
// Generates random 12-byte IV
// Encrypts with AES-256-GCM
// Returns base64(IV + ciphertext + auth tag)

decrypt(ciphertext: string): Promise<string>
// Decodes base64
// Extracts IV (first 12 bytes)
// Decrypts with AES-256-GCM
// Returns plaintext

generateEncryptionKey(): string
// Generates 32 random bytes → hex string
// Use this to create ENCRYPTION_KEY for .env
```

Key is loaded from `ENCRYPTION_KEY` environment variable (32 bytes = 64 hex characters).

### 7.4 @hachi/schemas

Zod schemas for every data structure in the system. These are the contract between frontend and backend.

**Node schemas (`src/nodes/`):**

Each node type has three schemas:
- `configSchema` — what the user configures in the property panel
- `inputSchema` — what the node receives from upstream
- `outputSchema` — what the node produces for downstream

```
query     → config: (none)           | input: { query }              | output: { query, tokens, language }
hyde      → config: { model, temp }  | input: { query }              | output: { query, hypotheticalDocs, model }
embed     → config: { model, dims }  | input: { text }               | output: { vector, model, tokensUsed }
retrieve  → config: { topK, thresh } | input: { vector }             | output: { documents[], scores[] }
rerank    → config: { topN, model }  | input: { query, documents[] } | output: { documents[], scores[] }
judge     → config: { criteria }     | input: { query, documents[] } | output: { verdict, confidence, reasoning }
generate  → config: { model, temp }  | input: { query, context }     | output: { response, model, tokensUsed }
agent     → config: { tools, iter }  | input: { query }              | output: { response, plan, toolCalls[] }
```

**Handle types (`src/handles/`):**
```typescript
type HandleType = "string" | "vector" | "document[]" | "json"
// Colors: string=blue, vector=purple, document[]=green, json=orange
// Invalid connections (e.g., string → vector) are blocked with explanation
```

**Execution schemas (`src/execution/`):**
```typescript
runSchema          // { id, canvasId, status, input, startedAt, completedAt }
stepOutputSchema   // { id, runId, nodeId, input, output, latencyMs }
sseEventSchema     // { type, data } — RunStarted, StepCompleted, RunCompleted, RunFailed
```

### 7.5 @hachi/mastra-core

The execution engine. Converts canvas graphs into executable Mastra workflows.

**Steps (`src/steps/`):**

Each step is a Mastra `createStep()` with typed input/output and an async `execute` function:

```typescript
// Example: HyDE step
export const createHyDEStep = (config: HyDENodeConfig) =>
  createStep({
    id: "hyde",
    inputSchema: hydeNodeInputSchema,
    outputSchema: hydeNodeOutputSchema,
    execute: async ({ context }) => {
      const { query } = context;
      // Call LLM to generate hypothetical document
      const hypothetical = await generateText({
        model: openai(config.model || "gpt-4o"),
        prompt: `Write a detailed passage that answers: ${query}`,
        temperature: config.temperature || 0.7,
      });
      return {
        query,
        hypotheticalDocuments: [hypothetical.text],
        model: config.model || "gpt-4o",
      };
    },
  });
```

**Compiler (`src/compiler/`):**

```typescript
// graph-to-workflow.ts
compileGraph(canvasJson: CanvasGraph): MastraWorkflow
  // 1. Validate: check node types, connections, no cycles
  // 2. Sort: topological sort → execution order
  // 3. Create: instantiate Mastra steps with node configs
  // 4. Wire: map outputs to inputs between steps
  // 5. Build: chain steps into Mastra Workflow

// validate.ts
validateCanvas(graph: CanvasGraph): ValidationResult
  // Check all node types are known
  // Check all connections are between compatible handle types
  // Check for cycles (DFS-based)
  // Check all required configs are present

// topological-sort.ts
topologicalSort(nodes: Node[], edges: Edge[]): Node[]
  // DFS-based sort
  // Returns nodes in execution order (upstream before downstream)
  // Throws if cycle detected
```

**Pre-built workflows (`src/workflows/`):**
- `naive-rag.ts` — Query → Embed → Retrieve → Generate
- `hyde-rag.ts` — Query → HyDE → Embed → Retrieve → Generate
- `crag.ts` — Query → Embed → Retrieve → Judge → (Generate | Web Search → Generate)
- `hybrid-search.ts` — Query → (BM25 + Vector Search) → RRF Fusion → Rerank → Generate

### 7.6 @hachi/realtime

Real-time collaboration using Yjs CRDTs over WebSocket.

```typescript
// provider.ts — Yjs WebSocket provider setup
export const createRealtimeProvider = (roomId: string, wsUrl: string) => {
  const ydoc = new Y.Doc();
  const provider = new WebsocketProvider(wsUrl, roomId, ydoc);
  return { ydoc, provider };
};

// presence.ts — User presence (cursor position, selection, avatar)
export const createPresenceState = (awareness: Awareness, user: User) => {
  awareness.setLocalStateField("user", { name, avatar, color });
  awareness.setLocalStateField("cursor", { x, y });
  awareness.setLocalStateField("selection", { nodeIds });
};

// hooks.ts
export function useRealtime(canvasId: string)   // Sync Yjs doc with canvas store
export function usePresence()                   // Track remote users' cursors + selections

// store.ts — Zustand store for realtime state
// isConnected, remoteUsers[], remoteCursors[], remoteSelections[]
```

### 7.7 @hachi/ui

ShadcnUI component library. 50+ production components, all pre-configured with Tailwind CSS 4.

**Component list (partial):**
```
button, input, card, tabs, dialog, dropdown-menu, select, checkbox,
radio-group, switch, slider, textarea, label, badge, avatar, tooltip,
popover, command, separator, skeleton, spinner, progress, calendar,
navigation-menu, context-menu, toggle, toggle-group, aspect-ratio,
scroll-area, table, form, accordion, alert, sheet, sidebar, ...
```

**Utility:** `cn()` from `src/lib/utils.ts` — merges class names with `clsx` + `tailwind-merge`.

**Exports:**
```json
"@hachi/ui/components/*"     // import { Button } from "@hachi/ui/components/button"
"@hachi/ui/hooks/*"          // import { useMobile } from "@hachi/ui/hooks"
"@hachi/ui/lib/*"            // import { cn } from "@hachi/ui/lib/utils"
"@hachi/ui/styles/globals.css" // import "@hachi/ui/styles/globals.css"
```

---

## 8. Database Schema

### 8.1 Entity Relationship

```
users ──────────┬──── sessions
                ├──── accounts (OAuth)
                ├──── verifications
                │
                ├──── workspaceMembers ──── workspaces
                │                              │
                │                              ├──── workspaceInvites
                │                              ├──── workspaceCredentials
                │                              ├──── documents (with pgvector)
                │                              └──── canvases
                │                                       │
                └──────────────────────────────── runs ──┘
                                                   │
                                              stepOutputs
```

### 8.2 Table Definitions

#### Users & Authentication

```sql
CREATE TABLE users (
  id            TEXT PRIMARY KEY,
  email         TEXT NOT NULL UNIQUE,
  email_verified BOOLEAN DEFAULT FALSE,
  name          TEXT,
  image         TEXT,
  avatar_url    TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE session (
  id            TEXT PRIMARY KEY,
  user_id       TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token         TEXT NOT NULL UNIQUE,
  expires_at    TIMESTAMPTZ NOT NULL,
  ip_address    TEXT,
  user_agent    TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE account (
  id            TEXT PRIMARY KEY,
  user_id       TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  account_id    TEXT NOT NULL,
  provider_id   TEXT NOT NULL,
  access_token  TEXT,
  refresh_token TEXT,
  access_token_expires_at  TIMESTAMPTZ,
  refresh_token_expires_at TIMESTAMPTZ,
  scope         TEXT,
  id_token      TEXT,
  password      TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE verification (
  id            TEXT PRIMARY KEY,
  identifier    TEXT NOT NULL,
  value         TEXT NOT NULL,
  expires_at    TIMESTAMPTZ NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);
```

#### Workspaces

```sql
CREATE TABLE workspaces (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE workspace_members (
  workspace_id  UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id       TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role          TEXT NOT NULL DEFAULT 'editor',  -- owner, admin, editor, viewer
  invited_by    TEXT REFERENCES users(id),
  joined_at     TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(workspace_id, user_id)
);

CREATE TABLE workspace_invites (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id  UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  email         TEXT NOT NULL,
  role          TEXT NOT NULL DEFAULT 'editor',
  invited_by    TEXT NOT NULL REFERENCES users(id),
  token         TEXT NOT NULL UNIQUE,
  expires_at    TIMESTAMPTZ NOT NULL,
  accepted_at   TIMESTAMPTZ,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);
```

#### Credentials (Encrypted)

```sql
CREATE TABLE workspace_credentials (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id    UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  provider        TEXT NOT NULL,         -- 'openai', 'anthropic', 'pinecone', etc.
  credential_type TEXT NOT NULL,         -- 'api_key', 'connection_string'
  encrypted_value TEXT NOT NULL,         -- AES-256-GCM encrypted, base64
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(workspace_id, provider, credential_type)
);
```

#### Canvases

```sql
CREATE TABLE canvases (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id  UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  graph_json    JSONB NOT NULL DEFAULT '{"nodes":[],"edges":[]}',
  yjs_state     TEXT,                    -- Base64 Yjs document state
  created_by    TEXT REFERENCES users(id),
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);
```

**`graph_json` structure:**
```json
{
  "nodes": [
    {
      "id": "node-1",
      "type": "query",
      "position": { "x": 100, "y": 200 },
      "data": {
        "label": "User Query",
        "type": "query",
        "config": {}
      }
    }
  ],
  "edges": [
    {
      "id": "edge-1",
      "source": "node-1",
      "target": "node-2",
      "sourceHandle": "output",
      "targetHandle": "input"
    }
  ]
}
```

#### Execution

```sql
CREATE TABLE runs (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  canvas_id     UUID NOT NULL REFERENCES canvases(id) ON DELETE CASCADE,
  triggered_by  TEXT REFERENCES users(id),
  input         JSONB,                   -- { query, parameters }
  status        TEXT DEFAULT 'pending',  -- pending, running, completed, failed
  started_at    TIMESTAMPTZ,
  completed_at  TIMESTAMPTZ
);

CREATE TABLE step_outputs (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id        UUID NOT NULL REFERENCES runs(id) ON DELETE CASCADE,
  node_id       TEXT NOT NULL,
  input         JSONB,
  output        JSONB,
  latency_ms    INTEGER,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);
```

#### Documents (RAG Knowledge Base)

```sql
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE documents (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id  UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  content       TEXT NOT NULL,
  metadata      JSONB,                   -- { source, author, type, date, ... }
  embedding     VECTOR(1536),            -- OpenAI text-embedding-3-small
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Vector similarity search index
CREATE INDEX ON documents USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
```

### 8.3 Recommended Indexes

```sql
-- Auth lookups
CREATE INDEX idx_sessions_token ON session(token);
CREATE INDEX idx_sessions_user_id ON session(user_id);
CREATE INDEX idx_accounts_user_id ON account(user_id);

-- Workspace lookups
CREATE INDEX idx_workspace_members_user ON workspace_members(user_id);
CREATE INDEX idx_workspace_members_workspace ON workspace_members(workspace_id);
CREATE INDEX idx_workspace_invites_token ON workspace_invites(token);
CREATE INDEX idx_workspace_invites_email ON workspace_invites(email);

-- Canvas lookups
CREATE INDEX idx_canvases_workspace ON canvases(workspace_id);
CREATE INDEX idx_canvases_created_by ON canvases(created_by);

-- Run lookups
CREATE INDEX idx_runs_canvas ON runs(canvas_id);
CREATE INDEX idx_runs_status ON runs(status);
CREATE INDEX idx_step_outputs_run ON step_outputs(run_id);
CREATE INDEX idx_step_outputs_node ON step_outputs(run_id, node_id);

-- Document search
CREATE INDEX idx_documents_workspace ON documents(workspace_id);
CREATE INDEX idx_documents_metadata ON documents USING gin(metadata);
```

---

## 9. API Specification

### 9.1 Base Configuration

- **Framework:** Hono
- **Base URL:** `http://localhost:4000` (dev), configurable via `PORT` env
- **Content-Type:** `application/json` (except SSE endpoints)
- **Auth:** Session token in `Authorization: Bearer <token>` header or cookie

### 9.2 Authentication Routes

All handled by Better Auth. The API proxies these:

```
POST   /api/auth/sign-up              # Email/password signup
POST   /api/auth/sign-in/email        # Email/password login
POST   /api/auth/sign-out             # Logout (invalidate session)
GET    /api/auth/session              # Get current session
GET    /api/auth/sign-in/social       # Initiate OAuth (GitHub/Google)
GET    /api/auth/callback/:provider   # OAuth callback
```

### 9.3 Workspace Routes

```
GET    /api/workspaces
  → 200: WorkspaceWithRole[]
  → 401: Unauthorized

POST   /api/workspaces
  Body: { name: string }
  → 201: Workspace (creator becomes owner)
  → 400: Validation error
  → 401: Unauthorized

GET    /api/workspaces/:id
  → 200: WorkspaceWithMembers
  → 401: Unauthorized
  → 403: Not a member
  → 404: Not found

PUT    /api/workspaces/:id
  Body: { name?: string }
  → 200: Workspace
  → 403: Not admin/owner

DELETE /api/workspaces/:id
  → 204: No content
  → 403: Not owner

POST   /api/workspaces/:id/invite
  Body: { email: string, role: string }
  → 201: Invite (with token)
  → 403: Not admin/owner

POST   /api/workspaces/invite/:token/accept
  → 200: WorkspaceMember
  → 400: Expired/invalid token

GET    /api/workspaces/:id/members
  → 200: WorkspaceMember[]

PUT    /api/workspaces/:id/members/:userId
  Body: { role: string }
  → 200: WorkspaceMember
  → 403: Not admin/owner

DELETE /api/workspaces/:id/members/:userId
  → 204: No content
  → 403: Not admin/owner (or can't remove self if owner)
```

### 9.4 Credential Routes

```
GET    /api/workspaces/:id/credentials
  → 200: Credential[] (encrypted values NOT returned, just provider + type + createdAt)

POST   /api/workspaces/:id/credentials
  Body: { provider: string, credentialType: string, value: string }
  → 201: Credential (value encrypted before storage)
  → 403: Not admin/owner

PUT    /api/workspaces/:id/credentials/:credId
  Body: { value: string }
  → 200: Credential (re-encrypted)
  → 403: Not admin/owner

DELETE /api/workspaces/:id/credentials/:credId
  → 204: No content
  → 403: Not admin/owner

POST   /api/workspaces/:id/credentials/:credId/test
  → 200: { valid: true, details: string } (e.g., "GPT-4o access confirmed")
  → 200: { valid: false, error: string }
```

### 9.5 Canvas Routes

```
GET    /api/canvases?workspaceId=<uuid>
  → 200: Canvas[] (without graphJson for list view)

POST   /api/canvases
  Body: { workspaceId: string, name: string, graphJson?: object }
  → 201: Canvas

GET    /api/canvases/:id
  → 200: Canvas (with full graphJson)
  → 404: Not found

PUT    /api/canvases/:id
  Body: { name?: string, graphJson?: object }
  → 200: Canvas
  Notes: This is the auto-save endpoint. Called every 2 seconds while editing.

DELETE /api/canvases/:id
  → 204: No content
```

### 9.6 Execution Routes

```
POST   /api/runs/execute
  Body: { canvasId: string, query: string, parameters?: object }
  → 200: SSE stream (Content-Type: text/event-stream)

  SSE Events:
    event: run_started
    data: { runId: string, canvasId: string, startedAt: string }

    event: step_started
    data: { runId: string, nodeId: string, nodeType: string, stepName: string }

    event: step_completed
    data: { runId: string, nodeId: string, output: object, latencyMs: number }

    event: step_failed
    data: { runId: string, nodeId: string, error: string }

    event: run_completed
    data: { runId: string, completedAt: string, totalLatencyMs: number }

    event: run_failed
    data: { runId: string, error: string }

GET    /api/runs?canvasId=<uuid>
  → 200: Run[] (without step outputs)

GET    /api/runs/:id
  → 200: Run (with step outputs — full Wire Tap data)
```

### 9.7 Document Routes

```
GET    /api/documents?workspaceId=<uuid>
  → 200: Document[] (without content/embedding for list view)

POST   /api/documents
  Body: multipart/form-data { workspaceId, file, metadata? }
  → 201: Document (content extracted, not yet embedded)

POST   /api/documents/:id/process
  → 200: { chunks: number, embeddingsCreated: number }
  Notes: Chunks the document and generates embeddings. Can be slow.

GET    /api/documents/:id
  → 200: Document (with content, metadata, chunk count)

DELETE /api/documents/:id
  → 204: No content

POST   /api/documents/search
  Body: { workspaceId: string, query: string, topK?: number, filter?: object }
  → 200: { documents: Document[], scores: number[] }
```

### 9.8 Error Format

All errors follow a consistent format:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human-readable description",
    "details": {}
  }
}
```

Error codes:
```
400  VALIDATION_ERROR     — Invalid request body
401  UNAUTHORIZED         — Not authenticated
403  FORBIDDEN           — Not authorized for this action
404  NOT_FOUND           — Resource doesn't exist
409  CONFLICT            — Resource already exists
429  RATE_LIMITED        — Too many requests
500  INTERNAL_ERROR      — Server error
```

---

## 10. Authentication & Security

### 10.1 Authentication Flow

**Email/Password:**
```
1. User submits email + password to POST /api/auth/sign-up
2. Better Auth creates user record, hashes password (bcrypt)
3. Creates session, returns session token
4. Frontend stores token, includes in subsequent requests
```

**OAuth (GitHub/Google):**
```
1. User clicks "Continue with GitHub"
2. Frontend redirects to GET /api/auth/sign-in/social?provider=github
3. Better Auth redirects to GitHub OAuth consent screen
4. User approves, GitHub redirects to /api/auth/callback/github
5. Better Auth creates/links user, creates session
6. Redirects to frontend with session cookie
```

### 10.2 Session Management

- **Storage:** PostgreSQL `session` table
- **Token:** Cryptographically random, stored in cookie + DB
- **Expiry:** 7 days
- **Refresh:** Session updated if accessed and >1 day since last update
- **Invalidation:** DELETE session record on logout

### 10.3 Authorization Model

Workspace-based RBAC:

| Action | Owner | Admin | Editor | Viewer |
|--------|-------|-------|--------|--------|
| View canvases | Y | Y | Y | Y |
| Run pipelines | Y | Y | Y | Y |
| View Wire Tap | Y | Y | Y | Y |
| Create/edit canvases | Y | Y | Y | N |
| Delete own canvases | Y | Y | Y | N |
| Delete any canvas | Y | Y | N | N |
| Upload documents | Y | Y | Y | N |
| Manage credentials | Y | Y | N | N |
| Invite members | Y | Y | N | N |
| Change member roles | Y | Y | N | N |
| Delete workspace | Y | N | N | N |
| Transfer ownership | Y | N | N | N |

### 10.4 Credential Security

API keys (OpenAI, Anthropic, Pinecone, etc.) are stored encrypted:

1. User enters API key in workspace settings
2. Frontend sends plaintext to API over HTTPS
3. API encrypts with AES-256-GCM using `ENCRYPTION_KEY`
4. Stored as base64(IV + ciphertext + auth tag) in `workspace_credentials`
5. Decrypted only when needed for execution (never sent to frontend)
6. Each encryption uses a unique random IV (no IV reuse)

**Key management:**
- `ENCRYPTION_KEY` is a 32-byte hex string (64 characters)
- Generate with: `import { generateEncryptionKey } from "@hachi/encryption"; generateEncryptionKey()`
- Rotate by: decrypt all → change key → re-encrypt all (migration script needed)

### 10.5 Security Boundaries

- API keys never leave the backend
- `ENCRYPTION_KEY` never leaves the server environment
- Frontend only knows if a credential exists (provider + type), not its value
- Session tokens are httpOnly cookies (not accessible to JS)
- CORS configured to allow only the frontend origin
- Rate limiting on auth endpoints (prevent brute force)
- Workspace isolation: users only access data in their workspaces

---

## 11. The Visual Canvas

### 11.1 React Flow Foundation

The canvas is built on React Flow (XYFlow) — the industry standard for node-based UIs in React. We chose it because:

- Engineers think in directed graphs when designing data pipelines
- Nodes and edges map directly to RAG components and data flow
- Built-in support for drag/drop, zoom, pan, selection, minimap
- Extensible: custom node types, custom edges, custom controls
- Active ecosystem with Yjs integration for real-time collaboration

### 11.2 Canvas Component (`canvas.tsx`)

The main canvas component registers all node types and renders the React Flow instance:

```typescript
const nodeTypes = {
  query:     QueryNode,
  hyde:      HyDENode,
  embedding: EmbedNode,
  retriever: RetrieveNode,
  reranker:  RerankNode,
  judge:     JudgeNode,
  llm:       GenerateNode,
  agent:     AgentNode,
  base:      BaseNode,
};
```

**Important:** Node `type` values must match these keys exactly. The type "embedding" maps to the EmbedNode component, "retriever" maps to RetrieveNode, etc. Template definitions and the canvas store must use these exact strings.

**Props:**
- `mode: "full" | "demo"` — Full mode shows property panel + all controls. Demo mode is read-only with minimal UI (for landing page demos).
- `onOpenTemplatePicker: () => void` — Callback to open template selection modal.

### 11.3 Canvas Modes

**Full Mode (Dashboard):**
- Property panel (right sidebar) for node configuration
- Execution bar (bottom) with run button and query input
- Template picker for loading reference architectures
- Wire Tap panel for inspecting execution results
- Full keyboard shortcuts (undo, redo, delete, duplicate)
- Auto-save to API every 2 seconds

**Demo Mode (Landing Page):**
- Read-only canvas with pre-loaded template
- No property panel, no execution bar
- Visual only — demonstrates the concept

### 11.4 Canvas Interactions

| Action | Behavior |
|--------|----------|
| **Click node** | Select node, show in property panel |
| **Drag node** | Move node on canvas |
| **Click background** | Deselect all |
| **Drag from handle** | Create connection (edge) |
| **Click edge** | Select edge (Wire Tap shows data) |
| **Ctrl+Z** | Undo last action |
| **Ctrl+Y / Ctrl+Shift+Z** | Redo |
| **Delete / Backspace** | Delete selected nodes/edges |
| **Ctrl+D** | Duplicate selected nodes |
| **Ctrl+C / Ctrl+V** | Copy/paste nodes |
| **Scroll** | Zoom in/out |
| **Drag background** | Pan canvas |

---

## 12. Node System

### 12.1 Node Architecture

Every node follows the same component pattern:

```tsx
function NodeComponent({ data, selected }: NodeProps<HachiNodeData>) {
  return (
    <>
      <NodeToolbar isVisible={selected}>
        {/* Config button, delete button, duplicate button */}
      </NodeToolbar>

      <NodeStatusIndicator status={data.status}>
        {/* Shows loading spinner, success check, or error icon */}
      </NodeStatusIndicator>

      <div className={cn("node-container", selected && "ring-2")}>
        <Handle type="target" position={Position.Left} />

        {/* Node-specific content */}
        <div className="node-header">
          <Icon />
          <span>{data.label}</span>
        </div>
        <div className="node-body">
          {/* Config summary, status info */}
        </div>

        <Handle type="source" position={Position.Right} />
      </div>
    </>
  );
}
```

### 12.2 Node Types Reference

#### Query Node
- **Purpose:** Entry point — where the user's query enters the pipeline
- **Handles:** Source only (output)
- **Config:** None
- **Input:** User types query in execution bar
- **Output:** `{ query: string, tokens: number, language: string }`
- **Visual:** Blue accent, search icon

#### HyDE Node (Hypothetical Document Embeddings)
- **Purpose:** Expand short/ambiguous queries by generating a hypothetical answer, then embedding that instead
- **Handles:** Target (receives query) + Source (outputs expanded query)
- **Config:** `model` (LLM), `temperature`, `numHypothetical`, `systemPrompt`
- **Input:** `{ query: string }`
- **Output:** `{ query, hypotheticalDocuments: string[], model }`
- **Visual:** Purple accent, brain icon
- **Wire Tap insight:** Shows original query vs generated hypothesis — demonstrates why embedding the hypothesis produces better vectors

#### Embedding Node
- **Purpose:** Convert text to vector embedding
- **Handles:** Target (receives text) + Source (outputs vector)
- **Config:** `model`, `dimensions`, `chunkingEnabled`
- **Input:** `{ text: string }`
- **Output:** `{ vector: number[], model, tokensUsed, magnitude }`
- **Visual:** Cyan accent, grid icon
- **Wire Tap insight:** Shows vector magnitude (low = weak embedding), dimensions, token count

#### Retriever Node
- **Purpose:** Search vector database for similar documents
- **Handles:** Target (receives vector) + Source (outputs documents)
- **Config:** `topK`, `similarityThreshold`, `vectorStore`, `filter`
- **Input:** `{ vector: number[] }`
- **Output:** `{ documents: Document[], scores: number[] }`
- **Visual:** Green accent, database icon
- **Wire Tap insight:** Shows each retrieved document with similarity score, highlights score drops between results

#### Reranker Node
- **Purpose:** Rescore retrieved documents using a cross-encoder for better relevance
- **Handles:** Target (receives query + documents) + Source (outputs reranked documents)
- **Config:** `topN`, `model`
- **Input:** `{ query: string, documents: Document[] }`
- **Output:** `{ documents: Document[], scores: number[] }`
- **Visual:** Orange accent, sort icon
- **Wire Tap insight:** Shows before/after rankings, cross-encoder scores vs original similarity scores

#### Judge Node (CRAG — Corrective RAG)
- **Purpose:** Evaluate whether retrieved context is relevant to the query. Routes to fallback if irrelevant.
- **Handles:** Target (receives query + documents) + Source (outputs verdict + documents)
- **Config:** `criteria`, `confidenceThreshold`, `fallbackAction`
- **Input:** `{ query: string, documents: Document[] }`
- **Output:** `{ verdict: "RELEVANT" | "IRRELEVANT", confidence: number, reasoning: string, documents }`
- **Visual:** Red accent, scale icon
- **Wire Tap insight:** Shows the Judge's reasoning chain, confidence score, which path was taken

#### Generate Node (LLM)
- **Purpose:** Generate a response using an LLM with retrieved context
- **Handles:** Target (receives query + context) + Source (outputs response)
- **Config:** `model`, `temperature`, `maxTokens`, `systemPrompt`, `responseFormat`
- **Input:** `{ query: string, context: string | Document[] }`
- **Output:** `{ response: string, model, tokensUsed: { input, output }, latencyMs }`
- **Visual:** Yellow accent, sparkles icon
- **Wire Tap insight:** Shows full prompt sent to LLM (system + user + context), token usage breakdown

#### Agent Node
- **Purpose:** ReAct (Reasoning + Acting) agent that decides what tools to use and when
- **Handles:** Target (receives query) + Source (outputs response + plan)
- **Config:** `tools`, `maxIterations`, `model`, `systemPrompt`
- **Input:** `{ query: string }`
- **Output:** `{ response: string, plan: string[], toolCalls: ToolCall[], iterations: number }`
- **Visual:** Pink accent, bot icon
- **Wire Tap insight:** Shows each thought-action-observation loop, tool call inputs/outputs

### 12.3 Node Status Indicators

During execution, each node displays its current status:

| Status | Visual | Meaning |
|--------|--------|---------|
| `idle` | No indicator | Not yet executed |
| `loading` | Yellow spinner | Currently executing |
| `success` | Green checkmark | Completed successfully |
| `error` | Red X | Failed with error |

Status is managed via `canvasStore.setNodeStatus(nodeId, status)` and cleared with `clearAllNodeStatuses()` before each run.

---

## 13. Execution Engine

### 13.1 Overview

The execution engine converts a visual canvas graph into a runnable pipeline. There are two execution paths:

1. **Mock execution** (current) — Frontend-only simulation with realistic delays and mock data. Used for development and demos.
2. **Real execution** (production) — Backend compiles graph to Mastra workflow, executes with real LLM/embedding/search calls, streams results via SSE.

### 13.2 Mock Execution (`use-mock-execution.ts`)

```typescript
async function executeWorkflow(query: string) {
  // 1. Clear previous state
  clearAllNodeStatuses();
  executionLogStore.clear();
  setIsRunning(true);

  // 2. Get execution order (topological sort)
  const order = canvasStore.getExecutionOrder();

  // 3. Execute each node sequentially
  for (const node of order) {
    setNodeStatus(node.id, "loading");

    // Get mock output based on node type
    const mockOutput = getMockOutput(node.data.type, query);

    addLogEntry({
      nodeId: node.id,
      nodeName: node.data.label,
      nodeType: node.data.type,
      status: "running",
    });

    // Simulate processing time
    await sleep(mockOutput.latencyMs);

    setNodeStatus(node.id, "success");
    updateLogEntry(node.id, { output: mockOutput, status: "success" });
  }

  setIsRunning(false);
}
```

**Mock data latencies (realistic):**
```
query:     200ms
hyde:      1200ms
embedding: 350ms
retriever: 450ms
reranker:  600ms
judge:     800ms
agent:     900ms
llm:       1500ms
```

### 13.3 Real Execution (`runner.ts`)

The backend execution flow:

```typescript
// 1. Validate canvas
const validation = validateCanvas(canvas.graphJson);
if (!validation.valid) throw new Error(validation.errors);

// 2. Create execution plan
const plan = createExecutionPlan(canvas.graphJson);
// Returns: [{ nodeId, nodeType, config, inputMapping }]

// 3. Create run record
const run = await db.insert(runs).values({
  canvasId: canvas.id,
  triggeredBy: user.id,
  input: { query },
  status: "running",
  startedAt: new Date(),
});

// 4. Stream execution via SSE
const stream = new ReadableStream({
  async start(controller) {
    emit(controller, "run_started", { runId: run.id });

    let previousOutput = { query };

    for (const step of plan) {
      emit(controller, "step_started", { nodeId: step.nodeId });

      const startTime = Date.now();

      // Get step executor (Mastra step)
      const executor = getStepExecutor(step.nodeType, step.config);

      // Map previous output to this step's input
      const input = mapStepOutputToInput(previousOutput, step.inputMapping);

      // Execute step
      const output = await executor.execute({ context: input });

      const latencyMs = Date.now() - startTime;

      // Store for Wire Tap
      await db.insert(stepOutputs).values({
        runId: run.id,
        nodeId: step.nodeId,
        input,
        output,
        latencyMs,
      });

      emit(controller, "step_completed", { nodeId: step.nodeId, output, latencyMs });

      previousOutput = output;
    }

    await db.update(runs).set({ status: "completed", completedAt: new Date() });
    emit(controller, "run_completed", { runId: run.id });
  },
});
```

### 13.4 Graph Compilation

**Step 1: Validation**
```
- All node types are recognized
- All connections are between compatible handle types
- No cycles in the graph
- All required node configs are present
- At least one Query node exists
```

**Step 2: Topological Sort**
```
DFS-based traversal:
1. Find all root nodes (no incoming edges) — usually the Query node
2. Visit each root, traverse outgoing edges
3. Mark visited nodes, detect back-edges (cycles)
4. Return nodes in reverse post-order (upstream before downstream)
```

**Step 3: Step Instantiation**
```
For each node in execution order:
1. Look up node type → Mastra step factory
2. Pass node config to factory: createHyDEStep({ model: "gpt-4o", temperature: 0.7 })
3. Store step with its input mapping (which fields from previous output)
```

**Step 4: Input Mapping**
```
Each step's input comes from the previous step's output:
- Query → HyDE: { query: prev.query }
- HyDE → Embed: { text: prev.hypotheticalDocuments[0] }
- Embed → Retrieve: { vector: prev.vector }
- Retrieve → Generate: { query: firstInput.query, context: prev.documents }
```

### 13.5 Supported Execution Patterns

| Pattern | Node Sequence | Notes |
|---------|--------------|-------|
| **Naive RAG** | Query → Embed → Retrieve → Generate | Baseline |
| **HyDE** | Query → HyDE → Embed → Retrieve → Generate | Query expansion |
| **CRAG** | Query → Embed → Retrieve → Judge → Generate | With fallback |
| **Hybrid** | Query → (BM25 + Vector) → Fusion → Rerank → Generate | Multi-signal |
| **Agentic** | Query → Agent (with Retrieve tool) → Generate | Autonomous |

---

## 14. Wire Tap — The Debugger

### 14.1 What Wire Tap Is

Wire Tap is the inspection interface that lets engineers see exactly what data flows between nodes. It's the primary tool for understanding why a pipeline produces the results it does.

Without Wire Tap:
- "Retrieval is bad" → no idea why
- "The LLM hallucinates" → no idea what context it received
- "Reranking doesn't help" → no idea what scores changed

With Wire Tap:
- "The embedding has low magnitude (0.23) for this query" → explains poor retrieval
- "3 of 5 retrieved documents are irrelevant" → explains hallucination
- "Cross-encoder scores are all below 0.3" → explains why reranking can't help

### 14.2 Wire Tap Panel

**Location:** Bottom-right corner of canvas, collapsible.

**Two tabs:**

**Timeline tab:**
- Chronological list of all executed steps
- Each entry shows: node name, type icon, status (success/error), latency
- Click an entry to see its output in the Output tab
- Auto-scrolls during execution
- Color-coded: green for success, red for error, yellow for running

**Output tab:**
- JSON tree view of selected step's output
- Syntax highlighted, collapsible nested objects
- Shows input → output transformation
- Copy to clipboard button
- Large payloads paginated (document arrays)

### 14.3 Data Sources

**Mock execution:** Data comes from `executionLogStore` — mock outputs generated by `getMockOutput()`.

**Real execution:** Data comes from `step_outputs` table via `GET /api/runs/:id`. Each step's input and output are stored with latency, enabling:
- Full pipeline replay
- Run-to-run comparison
- Identifying which step degraded quality

### 14.4 Wire Tap Views by Node Type

**Embedding Node:**
```json
{
  "vector": [0.0123, -0.0456, 0.0789, "...1536 dimensions"],
  "model": "text-embedding-3-small",
  "tokensUsed": 12,
  "magnitude": 0.847
}
// Insight: Low magnitude (< 0.5) for short queries indicates weak embedding
```

**Retriever Node:**
```json
{
  "documents": [
    { "content": "RAG combines LLMs with...", "score": 0.89, "source": "docs/rag.md" },
    { "content": "Traditional chatbots...", "score": 0.76, "source": "blog/why-rag.md" },
    { "content": "Error handling in...", "score": 0.31, "source": "docs/errors.md" }
  ]
}
// Insight: Score drop from 0.76 → 0.31 indicates doc #3 is likely irrelevant
```

**Judge Node (CRAG):**
```json
{
  "verdict": "RELEVANT",
  "confidence": 0.94,
  "reasoning": "Documents directly address the query about RAG systems...",
  "route": "continue"  // or "fallback" if IRRELEVANT
}
// Insight: Shows exactly why the Judge passed/failed the context
```

---

## 15. State Management

### 15.1 Canvas Store (Zustand)

**Location:** `apps/web/src/stores/canvas-store.ts`

The central store for all canvas state. This is the source of truth for what's on the canvas.

**State:**
```typescript
interface CanvasState {
  // Graph
  nodes: HachiNode[];                    // React Flow nodes with custom data
  edges: HachiEdge[];                    // React Flow edges with custom data

  // Selection
  selectedNodeId: string | null;         // Single selection (property panel)
  selectedNodeIds: string[];             // Multi-selection
  selectedEdgeIds: string[];             // Edge selection

  // Execution
  isRunning: boolean;                    // Pipeline executing
  runId: string | null;                  // Current run ID

  // Canvas settings
  backgroundVariant: "dots" | "lines" | "cross";
  showBackground: boolean;

  // Clipboard
  clipboard: { nodes: HachiNode[], edges: HachiEdge[] } | null;

  // History (undo/redo)
  history: HistoryEntry[];               // Max 50 entries
  historyIndex: number;
}
```

**Key methods:**
```typescript
// Graph manipulation
addNode(type: string, position: { x, y }): void
deleteNode(id: string): void
duplicateNode(id: string): void
updateNodeData(id: string, data: Partial<HachiNodeData>): void
onConnect(connection: Connection): void

// Execution
setNodeStatus(id: string, status: "idle" | "loading" | "success" | "error"): void
clearAllNodeStatuses(): void

// Graph traversal
getExecutionOrder(): HachiNode[]         // Topological sort
getIncomers(nodeId: string): HachiNode[] // Nodes pointing to this node
getOutgoers(nodeId: string): HachiNode[] // Nodes this node points to
hasCycle(): boolean                      // Cycle detection

// History
pushHistory(): void                      // Save state for undo
undo(): void
redo(): void

// Clipboard
copySelected(): void
paste(): void
```

### 15.2 Execution Log Store (Zustand)

**Location:** `apps/web/src/stores/execution-log-store.ts`

Tracks the execution timeline and step outputs. This is what Wire Tap reads from.

```typescript
interface ExecutionLogState {
  entries: ExecutionLogEntry[];           // Timeline of step executions
  currentNodeId: string | null;          // Currently executing node
  testQuery: string;                     // Query input value
  selectedEntryId: string | null;        // Selected for inspection
}

interface ExecutionLogEntry {
  id: string;
  nodeId: string;
  nodeName: string;
  nodeType: string;
  status: "running" | "success" | "error";
  stepName: string;
  latencyMs: number;
  output: any;
  logMessages: string[];
  timestamp: Date;
}
```

### 15.3 State Flow

```
User Action → Canvas Store → React Flow renders → DOM updates
                  ↓
            History pushed (for undo)
                  ↓
            Auto-save to API (every 2s)

Run Workflow → Canvas Store (setNodeStatus) → Node visual updates
                  ↓
            Execution Log Store (addEntry) → Wire Tap Panel updates
                  ↓
            API call (POST /api/runs/execute) → SSE events
                  ↓
            Canvas Store (setNodeStatus from SSE) → Node animations
```

---

## 16. Real-Time Collaboration

### 16.1 Architecture

Yjs (CRDT library) + WebSocket for conflict-free real-time sync.

```
┌────────────────────┐         ┌────────────────────┐
│     User A          │         │     User B          │
│  ┌──────────────┐   │   WS   │   ┌──────────────┐  │
│  │ Yjs Doc (A)  │◄──┼────────┼──►│ Yjs Doc (B)  │  │
│  └──────┬───────┘   │         │   └──────┬───────┘  │
│         │           │         │          │          │
│  ┌──────▼───────┐   │         │   ┌──────▼───────┐  │
│  │ Canvas Store │   │         │   │ Canvas Store │  │
│  └──────────────┘   │         │   └──────────────┘  │
└────────────────────┘         └────────────────────┘
              │                          │
              └──────────┬───────────────┘
                         │
              ┌──────────▼──────────┐
              │   Yjs WS Server      │
              │   (Bun WebSocket)    │
              │                      │
              │   Room: canvas-{id}  │
              │   Persists to DB     │
              └─────────────────────┘
```

### 16.2 What Gets Synced

| Data | Sync Method | Conflict Resolution |
|------|------------|-------------------|
| Node positions | Yjs Map | Last writer wins |
| Node configs | Yjs Map | Field-level merge |
| Edges | Yjs Array | Both changes apply |
| Node additions/deletions | Yjs Map | CRDT automatic |
| Cursor positions | Awareness protocol | Ephemeral (not persisted) |
| User presence | Awareness protocol | Ephemeral |
| Selection highlights | Awareness protocol | Ephemeral |

### 16.3 Presence Features

- **Live cursors** — Each user has a colored cursor on the canvas
- **Selection highlights** — See what nodes others have selected
- **Activity status** — "Alice is editing HyDE node"
- **Online indicator** — Avatar stack showing who's in the canvas
- **Follow mode** — Click avatar to follow their viewport

### 16.4 Conflict Handling

Yjs CRDTs handle all conflicts automatically:

| Scenario | Resolution |
|----------|-----------|
| Two users move same node simultaneously | Last position wins (instant) |
| Two users edit same node config | Field-level merge (both apply) |
| User A deletes node that User B is editing | Node deleted, B gets notification |
| Both users create edges at same time | Both edges created |
| Offline user reconnects | Changes merged automatically |

### 16.5 Persistence

Canvas Yjs state is persisted to the `canvases.yjs_state` column:
- On each change, Yjs state is base64-encoded and saved
- On canvas load, if Yjs state exists, it's restored
- If no Yjs state, `graph_json` is used as the initial state
- This enables offline-capable editing

---

## 17. Reference Architectures

Pre-built pipeline templates that users can load, run, inspect, and modify.

### 17.1 Naive RAG

```
[Query] → [Embed] → [Retrieve] → [Generate]
```
- **Purpose:** Baseline for comparison
- **When to use:** Simple document Q&A, well-formed queries
- **Limitation:** Fails on short/ambiguous queries, no quality check

### 17.2 HyDE Pipeline

```
[Query] → [HyDE] → [Embed] → [Retrieve] → [Generate]
```
- **Purpose:** Solve the semantic gap for short queries
- **When to use:** User queries are short, ambiguous, or lack domain vocabulary
- **Key insight:** Embedding a hypothetical answer produces a richer vector than embedding the query directly

### 17.3 CRAG (Corrective RAG)

```
[Query] → [Embed] → [Retrieve] → [Judge] → [Generate]
                                      ↓ (if irrelevant)
                               [Web Search] → [Generate]
```
- **Purpose:** Self-correcting retrieval with fallback
- **When to use:** Need robust retrieval even when local knowledge base doesn't have the answer
- **Key insight:** A Judge LLM evaluates context relevance before generation, preventing hallucination from bad context

### 17.4 Hybrid Search

```
                    ┌→ [BM25 Search] ──┐
[Query] → [Split] ─┤                   ├→ [Fusion (RRF)] → [Rerank] → [Generate]
                    └→ [Vector Search] ─┘
```
- **Purpose:** Combine keyword and semantic search
- **When to use:** Documents contain important keywords/codes that semantic search misses
- **Key insight:** BM25 catches exact matches, vector search catches semantic matches, RRF merges them, cross-encoder reranks

### 17.5 Multi-Hop RAG

```
[Query] → [Embed] → [Retrieve] → [Generate Sub-Query] → [Embed] → [Retrieve] → [Generate Final]
```
- **Purpose:** Answer complex questions requiring information from multiple documents
- **When to use:** "Compare X and Y" or "What caused Z given A and B?"
- **Key insight:** Iterative retrieval refines the question based on partial answers

### 17.6 Agentic RAG

```
[Query] → [Agent] ←→ [Retrieve Tool]
              ↓         [Web Search Tool]
          [Generate]    [Calculator Tool]
```
- **Purpose:** Autonomous retrieval — agent decides when and what to retrieve
- **When to use:** Open-ended questions where the retrieval strategy isn't known upfront
- **Key insight:** ReAct loop (Reason → Act → Observe) lets the agent plan its own retrieval strategy

---

## 18. Frontend Architecture

### 18.1 Page Structure

**Public pages (no auth):**
```
/               → Landing page (hero, problem, features, templates, CTA)
/features       → Detailed feature showcase
/templates      → Template library
```

**Auth pages:**
```
/login          → Email/password + OAuth buttons
/signup         → Registration form
/invite/:token  → Accept workspace invite
```

**Dashboard (requires auth):**
```
/dashboard                 → Recent canvases, workspace overview
/dashboard/canvases        → Canvas list for current workspace
/dashboard/canvases/:id    → Full canvas editor
/dashboard/documents       → Document library
/dashboard/runs            → Execution history
/dashboard/workspaces      → Workspace management
```

### 18.2 Layout Hierarchy

```
RootLayout (providers: QueryClient, ThemeProvider)
├── Public Layout (navbar + footer)
│   ├── Landing Page
│   ├── Features Page
│   └── Templates Page
│
├── Auth Layout (centered card, no sidebar)
│   ├── Login
│   └── Signup
│
└── Dashboard Layout (sidebar + header)
    ├── Dashboard Home
    ├── Canvas List
    ├── Canvas Editor (full screen, sidebar hidden)
    ├── Documents
    ├── Runs
    └── Workspaces
```

### 18.3 Providers (`providers.tsx`)

```typescript
// Wraps the entire app
<QueryClientProvider>      // TanStack React Query for API caching
  <ThemeProvider>           // next-themes for dark/light mode
    {children}
  </ThemeProvider>
</QueryClientProvider>
```

### 18.4 API Client (`lib/api.ts`)

Fetch wrapper for all API calls:
```typescript
const api = {
  get: (path) => fetch(`${API_URL}${path}`, { credentials: "include" }),
  post: (path, body) => fetch(`${API_URL}${path}`, { method: "POST", body: JSON.stringify(body), credentials: "include" }),
  put: (path, body) => ...,
  delete: (path) => ...,
};
```

All requests include `credentials: "include"` to send session cookies.

### 18.5 Landing Page Sections

1. **Hero** — "Design, Execute, Debug RAG Architectures" + demo canvas
2. **Problem** — Three pain points: mediocre results, unclear patterns, no debugging
3. **Features** — Canvas, Wire Tap, Collaboration, Execution
4. **Advanced Nodes** — HyDE, Judge, Reranker, Fusion cards
5. **Templates** — Naive RAG, HyDE, CRAG, Hybrid Search previews
6. **CTA** — "Start building" + signup

---

## 19. Configuration & Credentials

### 19.1 Workspace-Level Configuration

Each workspace maintains its own:
- **LLM Provider** — Which API to use for generation (OpenAI, Anthropic, Google, Groq)
- **Embedding Model** — Which model generates vectors
- **Vector Store** — Where documents are stored and searched
- **API Keys** — Encrypted, scoped to workspace

### 19.2 Supported Providers

**LLM Providers:**

| Provider | Models | Key Variable |
|----------|--------|-------------|
| OpenAI | GPT-4o, GPT-4o-mini, GPT-4-turbo | `OPENAI_API_KEY` |
| Anthropic | Claude 4 Sonnet, Claude 4 Opus | `ANTHROPIC_API_KEY` |
| Google | Gemini 2.0 Flash, Gemini 2.0 Pro | `GOOGLE_API_KEY` |
| Groq | Llama 3.3, Mixtral | `GROQ_API_KEY` |

**Embedding Models:**

| Provider | Model | Dimensions |
|----------|-------|-----------|
| OpenAI | text-embedding-3-small | 1536 |
| OpenAI | text-embedding-3-large | 3072 |
| Cohere | embed-english-v3.0 | 1024 |

**Vector Stores:**

| Provider | Type | Key Variables |
|----------|------|-------------|
| pgvector (Supabase) | Self-hosted in existing DB | `DATABASE_URL` |
| Pinecone | Managed cloud | `PINECONE_API_KEY`, `PINECONE_INDEX` |
| Qdrant | Self-hosted or cloud | `QDRANT_URL`, `QDRANT_API_KEY` |

### 19.3 Node-Level Overrides

Individual nodes can override workspace defaults. For example, a HyDE node might use GPT-4o while the Generate node uses Claude:

```json
{
  "type": "hyde",
  "config": {
    "model": "gpt-4o",
    "temperature": 0.7
  }
}
```

If `config.model` is not set, the workspace default is used.

---

## 20. Deployment & Infrastructure

### 20.1 Frontend (Vercel)

```json
// apps/web/vercel.json
{
  "framework": "nextjs"
}
```

- Deployed to Vercel Edge Network
- Automatic deployments on push to `main`
- Environment variables configured in Vercel dashboard
- Preview deployments for PRs

### 20.2 Backend API (Docker / VPS)

```dockerfile
FROM oven/bun:1 AS base
WORKDIR /app

COPY package.json bun.lock ./
COPY packages/ ./packages/
COPY apps/api/ ./apps/api/

RUN bun install --production

EXPOSE 4000
CMD ["bun", "run", "apps/api/src/index.ts"]
```

### 20.3 Database (Supabase)

- Managed PostgreSQL with pgvector extension
- Connection pooling via Supabase
- Automatic backups
- Row-level security available if needed

### 20.4 Collaboration Server (Bun WebSocket)

Separate process running Yjs WebSocket server:
```
bun run apps/api/src/services/collaboration/server.ts
```
- Handles WebSocket connections for canvas rooms
- Persists Yjs state to `canvases.yjs_state`
- Can be deployed alongside API or separately

---

## 21. Environment Variables

### Required (Production)

```env
# Database
DATABASE_URL=postgresql://user:pass@host:5432/hachi?sslmode=require

# Authentication
BETTER_AUTH_SECRET=<32-byte-hex>              # Session signing key
BETTER_AUTH_URL=https://api.hachi.dev         # API base URL

# OAuth (at least one recommended)
GITHUB_CLIENT_ID=<from github.com/settings/developers>
GITHUB_CLIENT_SECRET=<from github>
GOOGLE_CLIENT_ID=<from console.cloud.google.com>
GOOGLE_CLIENT_SECRET=<from google>

# Encryption
ENCRYPTION_KEY=<64-hex-chars>                 # For credential encryption

# Server
PORT=4000                                     # API server port

# Frontend
NEXT_PUBLIC_API_URL=https://api.hachi.dev     # Backend URL for frontend
```

### Optional

```env
# For real execution (workspace-level, but can also be global defaults)
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...

# Background jobs
INNGEST_EVENT_KEY=...
INNGEST_SIGNING_KEY=...

# Email (invites)
RESEND_API_KEY=re_...

# Web search tool (for CRAG fallback)
TAVILY_API_KEY=tvly-...

# Collaboration server
COLLABORATION_WS_URL=wss://collab.hachi.dev
```

### Generate Keys

```bash
# Generate BETTER_AUTH_SECRET
openssl rand -hex 32

# Generate ENCRYPTION_KEY
bun -e "import { generateEncryptionKey } from '@hachi/encryption'; console.log(generateEncryptionKey())"
```

---

## 22. Development Workflow

### 22.1 Initial Setup

```bash
# Clone and install
git clone <repo>
cd hachi
bun install

# Set up environment
cp .env.example .env
# Fill in DATABASE_URL, BETTER_AUTH_SECRET, ENCRYPTION_KEY

# Set up database
cd packages/database
bunx drizzle-kit push          # Push schema to DB (dev mode)
cd ../..

# Run everything
bun run dev                    # Starts web + api via Turborepo
```

### 22.2 Development Commands

```bash
# Run all apps
bun run dev

# Run specific app
bun run dev:web                # Next.js on :3000
bun run dev:api                # Hono on :4000

# Database
bun run db:generate            # Generate migration from schema changes
bun run db:push                # Push schema directly (dev only)
bun run db:migrate             # Apply migrations (production)
bun run db:studio              # Open Drizzle Studio UI

# Build
bun run build                  # Build all packages + apps
bun run typecheck              # TypeScript type checking
bun run lint                   # Run linters

# Test
bun test                       # Run all tests
```

### 22.3 Turborepo Tasks (`turbo.json`)

```json
{
  "tasks": {
    "dev": { "persistent": true, "cache": false },
    "build": { "dependsOn": ["^build"] },
    "typecheck": { "dependsOn": ["^typecheck"] },
    "lint": {},
    "test": {}
  }
}
```

### 22.4 Package Dependencies

```
@hachi/ui          → (no internal deps, standalone)
@hachi/encryption  → (no internal deps, standalone)
@hachi/schemas     → (no internal deps, standalone)
@hachi/database    → (no internal deps, standalone)
@hachi/auth        → @hachi/database
@hachi/mastra-core → @hachi/schemas
@hachi/realtime    → (no internal deps, uses yjs)

apps/web           → @hachi/ui, @hachi/schemas, @hachi/auth (client), @hachi/realtime
apps/api           → @hachi/database, @hachi/auth, @hachi/encryption, @hachi/schemas, @hachi/mastra-core
```

---

## 23. Implementation Status

### Overall Progress

| Component | Status | Completion |
|-----------|--------|-----------|
| Landing page & marketing | Done | 85% |
| Dashboard layout & navigation | Done | 90% |
| Canvas (React Flow + nodes) | Done | 90% |
| Property panel (node config) | Done | 80% |
| Execution bar UI | Done | 85% |
| Wire Tap panel | Done | 75% |
| Mock execution | Done | 100% |
| ShadcnUI component library | Done | 100% |
| Database schema | Done | 90% |
| Auth (Better Auth) | Done | 80% |
| Encryption package | Done | 100% |
| Zod schemas | Done | 70% |
| Canvas CRUD API | Done | 80% |
| Mastra step implementations | Partial | 30% |
| Graph compiler | Partial | 40% |
| Real execution (SSE) | Scaffolded | 15% |
| Document processing | Scaffolded | 20% |
| Vector search | Scaffolded | 15% |
| Workspace management API | Scaffolded | 20% |
| Credential management | Scaffolded | 25% |
| Real-time collaboration | Scaffolded | 20% |
| Login/signup UI | Scaffolded | 30% |
| Rate limiting | Not started | 0% |
| Email invites | Not started | 0% |
| Run comparison | Not started | 0% |
| Export to code | Not started | 0% |

### What Works Today

1. Full landing page with interactive demo canvas
2. Dashboard with sidebar navigation
3. Canvas editor with 9 node types, drag-and-drop, connections
4. Property panel for node configuration
5. Mock pipeline execution with realistic delays
6. Wire Tap timeline and output inspection
7. Template loading (Naive RAG, HyDE, CRAG, Hybrid)
8. Undo/redo, copy/paste, keyboard shortcuts
9. Canvas auto-save to API
10. Better Auth integration (email + OAuth)

### What Needs Work

1. **Real execution** — Connect runner.ts to API routes, implement actual LLM/embedding calls
2. **Document pipeline** — Upload → chunk → embed → store → search
3. **Workspace management** — Member invites, role management, credential storage
4. **Collaboration** — Wire Yjs provider to canvas store, deploy WebSocket server
5. **Production hardening** — Rate limiting, error tracking, logging, monitoring

---

## 24. Roadmap

### Phase 1: Core Backend (Foundation)

**Goal:** Authentication works. Canvases save to database. API keys stored securely.

| Task | Location | Status |
|------|----------|--------|
| Better Auth setup | `packages/auth` | Done |
| Auth middleware | `apps/api/src/middleware/auth.ts` | Done |
| Canvas CRUD routes | `apps/api/src/routes/canvas.ts` | Done |
| Workspace CRUD routes | `apps/api/src/routes/workspaces.ts` | Partial |
| Credential encryption | `packages/encryption` | Done |
| Credential API routes | `apps/api/src/routes/credentials.ts` | Scaffolded |
| Login/signup pages | `apps/web/src/app/(auth)` | Scaffolded |
| Database migrations | `packages/database/drizzle` | Pending |

**Deliverable:** Users sign in, create workspaces, save canvases, store API keys.

### Phase 2: Execution Engine (Core Value)

**Goal:** RAG pipelines actually execute with real LLM and embedding calls.

| Task | Location | Status |
|------|----------|--------|
| Query step | `packages/mastra-core/src/steps/query.ts` | Done |
| Embed step (OpenAI) | `packages/mastra-core/src/steps/embed.ts` | Done |
| Retrieve step (pgvector) | `packages/mastra-core/src/steps/retrieve.ts` | Done |
| Generate step (LLM) | `packages/mastra-core/src/steps/generate.ts` | Done |
| HyDE step | `packages/mastra-core/src/steps/hyde.ts` | Done |
| Judge step (CRAG) | `packages/mastra-core/src/steps/judge.ts` | Done |
| Rerank step | `packages/mastra-core/src/steps/rerank.ts` | Done |
| Graph compiler | `packages/mastra-core/src/compiler` | Partial |
| Execution runner (SSE) | `apps/api/src/services/execution/runner.ts` | Scaffolded |
| Step output storage | `apps/api/src/services/execution/tracer.ts` | Scaffolded |
| Frontend SSE listener | `apps/web` | Not started |

**Deliverable:** Users run pipelines and see real results stream back.

### Phase 3: Document Pipeline

**Goal:** Users upload documents, chunk them, embed them, search against them.

| Task | Location | Status |
|------|----------|--------|
| Document upload API | `apps/api/src/routes/documents.ts` | Scaffolded |
| Chunker service | `apps/api/src/services/documents/chunker.ts` | Done |
| Embedder service | `apps/api/src/services/documents/embedder.ts` | Done |
| Vector search service | `apps/api/src/services/documents/search.ts` | Done |
| Upload UI | `apps/web/src/features/documents` | Not started |
| Document library page | `apps/web/src/app/(dashboard)/documents` | Scaffolded |

**Deliverable:** Users upload PDFs/docs, system chunks and embeds them, retrieval nodes search against them.

### Phase 4: Collaboration & Polish

**Goal:** Real-time collaboration, production hardening.

| Task | Location | Status |
|------|----------|--------|
| Yjs WebSocket server | `apps/api/src/services/collaboration` | Scaffolded |
| Yjs → Canvas Store sync | `packages/realtime` | Scaffolded |
| Live cursors | `apps/web/src/features/collaboration` | Scaffolded |
| Presence avatars | `apps/web/src/features/collaboration` | Scaffolded |
| Workspace member management | Full stack | Scaffolded |
| Email invites (Resend) | `packages/email` | Not started |
| Rate limiting | `apps/api/src/middleware` | Not started |
| Error tracking | Full stack | Not started |
| Run history + comparison | Full stack | Not started |

**Deliverable:** Teams collaborate in real-time on shared canvases.

### Future (Post-Launch)

- **Export to Code** — Generate Mastra/LangChain implementation from canvas
- **Custom Nodes** — User-defined nodes with custom logic
- **Comparison Mode** — Run two architectures side-by-side on same query
- **Performance Profiling** — Detailed latency breakdown, token cost tracking
- **Architecture Templates Marketplace** — Community-contributed templates
- **Batch Evaluation** — Run N queries through pipeline, aggregate metrics
- **Version History** — Canvas versioning with diff view

---

*This document is the single source of truth for the Hachi platform. When in doubt, check here first.*
