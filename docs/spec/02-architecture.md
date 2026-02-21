# System Architecture

---

## 1. High-Level Stack

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

---

## 2. Data Flow Architecture

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

---

## 3. Request Flow — Executing a Pipeline

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

## 4. Monorepo Structure

```
/hachi
├── apps/
│   ├── web/                          # Next.js 15 — Visual IDE
│   │   ├── src/
│   │   │   ├── app/                  # App Router pages
│   │   │   │   ├── (auth)/           # Login, signup, invite accept
│   │   │   │   ├── (dashboard)/      # Authenticated dashboard
│   │   │   │   ├── layout.tsx        # Root layout (providers)
│   │   │   │   ├── page.tsx          # Landing page
│   │   │   │   └── providers.tsx     # QueryClient, ThemeProvider
│   │   │   ├── features/             # Feature modules
│   │   │   │   ├── canvas/           # THE CORE — visual pipeline builder
│   │   │   │   ├── landing/          # Landing page sections
│   │   │   │   ├── features-page/    # /features page sections
│   │   │   │   └── templates-page/   # /templates page sections
│   │   │   ├── stores/               # Zustand state management
│   │   │   ├── components/           # Shared app components
│   │   │   └── lib/                  # Utilities
│   │   ├── next.config.ts
│   │   └── vercel.json
│   │
│   └── api/                          # Hono — Backend API
│       ├── src/
│       │   ├── index.ts              # Hono app, route registration
│       │   ├── routes/               # auth, canvas, workspaces, documents, runs
│       │   ├── services/             # execution, documents, collaboration
│       │   ├── middleware/            # auth middleware
│       │   └── drizzle/              # Generated migrations
│       └── drizzle.config.ts
│
├── packages/
│   ├── database/                     # @hachi/database — Drizzle ORM
│   ├── auth/                         # @hachi/auth — Better Auth
│   ├── encryption/                   # @hachi/encryption — AES-256-GCM
│   ├── schemas/                      # @hachi/schemas — Zod validation
│   ├── mastra-core/                  # @hachi/mastra-core — AI execution
│   ├── realtime/                     # @hachi/realtime — Collaboration
│   └── ui/                           # @hachi/ui — ShadcnUI components
│
├── docs/                             # Documentation
│   ├── spec/                         # This specification
│   ├── roadmap.md
│   ├── hono.md                       # Hono framework reference
│   └── mono-setup.md                 # Bun workspace reference
│
├── package.json                      # Root workspace config
├── turbo.json                        # Turborepo task definitions
├── tsconfig.json                     # Root TypeScript config
└── bun.lock
```

### Package Dependencies

```
@hachi/ui          → (standalone)
@hachi/encryption  → (standalone)
@hachi/schemas     → (standalone)
@hachi/database    → (standalone)
@hachi/auth        → @hachi/database
@hachi/mastra-core → @hachi/schemas
@hachi/realtime    → (standalone, uses yjs)

apps/web           → @hachi/ui, @hachi/schemas, @hachi/auth (client), @hachi/realtime
apps/api           → @hachi/database, @hachi/auth, @hachi/encryption, @hachi/schemas, @hachi/mastra-core
```
