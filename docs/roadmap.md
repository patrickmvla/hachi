# Hachi Development Roadmap

**Implementation guide for completing the Hachi platform**

---

## Current State Summary

| Area | Status | Notes |
|------|--------|-------|
| **apps/web** | 85% | Landing, features, templates pages complete. Canvas needs interaction. |
| **apps/api** | 5% | Routes scaffolded, no database operations |
| **packages/mastra-core** | 0% | Empty stubs for steps/tools/agents |
| **packages/schemas** | 20% | Basic schemas only |
| **packages/database** | 90% | Schema complete, migrations pending |
| **packages/ui** | 100% | Full ShadcnUI component library |

---

## 1. New Packages to Add

| Package | Purpose | Priority |
|---------|---------|----------|
| `packages/auth` | Authentication logic (Better Auth) | High |
| `packages/encryption` | AES-256 encryption for API keys | High |
| `packages/mastra-nodes` | Node type definitions mapping to Mastra steps | High |
| `packages/realtime` | Yjs + WebSocket collaboration server | Medium |
| `packages/queue` | Background job processing (BullMQ or Inngest) | Medium |
| `packages/email` | Transactional emails (Resend) for invites | Low |

---

## 2. Logic & Services to Implement

### 2.1 Backend Services (apps/api)

```
apps/api/src/
├── services/
│   ├── auth/                    # Authentication
│   │   ├── session.ts           # Session management
│   │   ├── oauth.ts             # GitHub/Google OAuth
│   │   └── middleware.ts        # Auth middleware for routes
│   │
│   ├── workspace/               # Workspace management
│   │   ├── members.ts           # Add/remove members, roles
│   │   ├── invites.ts           # Generate/accept invites
│   │   └── credentials.ts       # Encrypt/decrypt API keys
│   │
│   ├── execution/               # Pipeline execution
│   │   ├── compiler.ts          # Canvas JSON → Mastra workflow
│   │   ├── runner.ts            # Execute workflow with SSE
│   │   └── tracer.ts            # Capture step outputs for Wire Tap
│   │
│   ├── documents/               # RAG document management
│   │   ├── chunker.ts           # Split docs into chunks
│   │   ├── embedder.ts          # Generate embeddings
│   │   └── search.ts            # Vector similarity search
│   │
│   └── integrations/            # External API clients
│       ├── openai.ts            # OpenAI client factory
│       ├── anthropic.ts         # Anthropic client factory
│       └── vector-stores.ts     # Pinecone/Qdrant/pgvector adapters
│
├── routes/
│   ├── auth.ts                  # Login, logout, OAuth callbacks
│   ├── workspaces.ts            # CRUD + member management
│   ├── credentials.ts           # API key management
│   └── (existing routes...)
│
└── middleware/
    ├── auth.ts                  # Require authenticated user
    ├── workspace.ts             # Require workspace membership
    └── rate-limit.ts            # API rate limiting
```

### 2.2 Mastra Core (packages/mastra-core)

```
packages/mastra-core/src/
├── steps/
│   ├── query.ts                 # Input query step
│   ├── hyde.ts                  # Hypothetical Document Embeddings
│   ├── embed.ts                 # Text → Vector embedding
│   ├── retrieve.ts              # Vector search retrieval
│   ├── rerank.ts                # Cross-encoder reranking
│   ├── judge.ts                 # CRAG relevance judge
│   ├── generate.ts              # LLM response generation
│   ├── parent-child.ts          # Parent-child retrieval
│   └── fusion.ts                # RRF fusion of multiple retrievals
│
├── tools/
│   ├── web-search.ts            # Tavily/Serper web search
│   ├── code-executor.ts         # Sandboxed code execution
│   └── http-request.ts          # Generic HTTP tool
│
├── agents/
│   ├── rag-agent.ts             # ReAct agent with retrieval tool
│   └── reflection-agent.ts      # Self-critique agent
│
├── workflows/
│   ├── naive-rag.ts             # Pre-built naive RAG workflow
│   ├── hyde-rag.ts              # Pre-built HyDE workflow
│   ├── crag.ts                  # Pre-built CRAG workflow
│   └── hybrid-search.ts         # Pre-built hybrid search workflow
│
└── compiler/
    ├── graph-to-workflow.ts     # Convert canvas JSON to Mastra workflow
    ├── validate.ts              # Validate node connections
    └── topological-sort.ts      # Determine execution order
```

### 2.3 Schemas (packages/schemas)

```
packages/schemas/src/
├── nodes/
│   ├── base.ts                  # Base node schema
│   ├── query.ts                 # Query input node config
│   ├── hyde.ts                  # HyDE node config (model, temperature)
│   ├── embed.ts                 # Embedding node config (model, dimensions)
│   ├── retrieve.ts              # Retriever config (topK, threshold, filters)
│   ├── rerank.ts                # Reranker config (model, topN)
│   ├── judge.ts                 # Judge config (criteria, fallback)
│   ├── generate.ts              # LLM config (model, systemPrompt, temperature)
│   ├── agent.ts                 # Agent config (tools, maxIterations)
│   └── index.ts                 # Union type of all nodes
│
├── handles/
│   ├── types.ts                 # Handle types (string, vector, document[], json)
│   └── connections.ts           # Valid connection rules
│
├── execution/
│   ├── run.ts                   # Run state schema
│   ├── step-output.ts           # Step output schema
│   └── events.ts                # SSE event schemas
│
└── api/
    ├── workspace.ts             # Workspace CRUD schemas
    ├── canvas.ts                # Canvas CRUD schemas
    ├── credentials.ts           # Credential schemas
    └── documents.ts             # Document schemas
```

---

## 3. Pages & UI to Add

### 3.1 New Pages (apps/web)

```
apps/web/src/app/
├── (auth)/
│   ├── login/page.tsx           # Login page (OAuth + email)
│   ├── signup/page.tsx          # Signup page
│   ├── invite/[token]/page.tsx  # Accept workspace invite
│   └── layout.tsx               # Auth layout (centered card)
│
├── (dashboard)/
│   ├── layout.tsx               # Dashboard shell (sidebar)
│   ├── page.tsx                 # Dashboard home (recent canvases)
│   │
│   ├── workspaces/
│   │   ├── page.tsx             # Workspace list
│   │   ├── new/page.tsx         # Create workspace
│   │   └── [id]/
│   │       ├── page.tsx         # Workspace overview
│   │       ├── settings/page.tsx # Workspace settings
│   │       ├── members/page.tsx  # Member management
│   │       └── credentials/page.tsx # API key management
│   │
│   ├── canvases/
│   │   ├── page.tsx             # Canvas list for workspace
│   │   └── [id]/page.tsx        # Full canvas editor (existing)
│   │
│   ├── documents/
│   │   ├── page.tsx             # Document library
│   │   ├── upload/page.tsx      # Document upload wizard
│   │   └── [id]/page.tsx        # Document detail (chunks, embeddings)
│   │
│   ├── runs/
│   │   ├── page.tsx             # Run history
│   │   └── [id]/page.tsx        # Run detail with Wire Tap
│   │
│   └── templates/
│       └── page.tsx             # Template library (load into canvas)
│
└── api/                         # Next.js API routes (if needed)
    └── auth/[...nextauth]/route.ts  # Or Better Auth handlers
```

### 3.2 New Components (apps/web)

```
apps/web/src/features/
├── canvas/
│   ├── components/
│   │   ├── node-palette.tsx      # Draggable node types sidebar
│   │   ├── property-panel.tsx    # Selected node configuration
│   │   ├── execution-bar.tsx     # Run button, status, query input
│   │   ├── minimap.tsx           # Canvas minimap
│   │   └── toolbar.tsx           # Undo, redo, zoom, export
│   │
│   ├── nodes/
│   │   ├── query-node.tsx        # Input query node
│   │   ├── hyde-node.tsx         # HyDE node with config
│   │   ├── embed-node.tsx        # Embedding node
│   │   ├── retrieve-node.tsx     # Retriever node
│   │   ├── rerank-node.tsx       # Reranker node
│   │   ├── judge-node.tsx        # Judge/CRAG node
│   │   ├── generate-node.tsx     # LLM generation node
│   │   └── agent-node.tsx        # Agent node
│   │
│   ├── edges/
│   │   └── data-edge.tsx         # Custom edge with Wire Tap click
│   │
│   └── wire-tap/
│       ├── wire-tap-panel.tsx    # Main inspection panel
│       ├── json-viewer.tsx       # JSON tree view
│       ├── document-list.tsx     # Retrieved docs display
│       └── comparison-view.tsx   # Compare two runs
│
├── collaboration/
│   ├── presence-avatars.tsx      # Online users display
│   ├── cursor-overlay.tsx        # Live cursors on canvas
│   └── activity-feed.tsx         # "Alice is editing..."
│
├── workspace/
│   ├── workspace-switcher.tsx    # Dropdown to switch workspaces
│   ├── member-list.tsx           # Members with role badges
│   ├── invite-modal.tsx          # Invite members dialog
│   └── credential-form.tsx       # Add/edit API key form
│
├── documents/
│   ├── upload-dropzone.tsx       # Drag-drop file upload
│   ├── document-card.tsx         # Document in library
│   ├── chunk-viewer.tsx          # View document chunks
│   └── embedding-viz.tsx         # 2D/3D embedding visualization
│
└── runs/
    ├── run-card.tsx              # Run in history list
    ├── run-timeline.tsx          # Step-by-step execution timeline
    └── step-detail.tsx           # Individual step inspection
```

---

## 4. Implementation Phases

### Phase 1: Core Backend (Foundation)

**Goal:** Authentication and database operations working

| Task | Package/Location | Description |
|------|------------------|-------------|
| Setup Better Auth | `packages/auth` | Auth library with OAuth support |
| Auth middleware | `apps/api/src/middleware/auth.ts` | Protect API routes |
| Auth routes | `apps/api/src/routes/auth.ts` | Login, logout, OAuth callbacks |
| Connect canvas routes to DB | `apps/api/src/routes/canvas.ts` | CRUD operations with Drizzle |
| Connect runs routes to DB | `apps/api/src/routes/runs.ts` | CRUD operations with Drizzle |
| Connect documents routes to DB | `apps/api/src/routes/documents.ts` | CRUD operations with Drizzle |
| Encryption utility | `packages/encryption` | AES-256 for API keys |
| Credentials service | `apps/api/src/services/workspace/credentials.ts` | Encrypt/decrypt keys |

**Deliverable:** Users can sign in, create workspaces, save canvases to database.

---

### Phase 2: Execution Engine (Core Value)

**Goal:** RAG pipelines actually execute

| Task | Package/Location | Description |
|------|------------------|-------------|
| Query step | `packages/mastra-core/src/steps/query.ts` | Input handling |
| Embed step | `packages/mastra-core/src/steps/embed.ts` | OpenAI embeddings |
| Retrieve step | `packages/mastra-core/src/steps/retrieve.ts` | Vector search |
| Generate step | `packages/mastra-core/src/steps/generate.ts` | LLM response |
| HyDE step | `packages/mastra-core/src/steps/hyde.ts` | Query expansion |
| Judge step | `packages/mastra-core/src/steps/judge.ts` | CRAG routing |
| Rerank step | `packages/mastra-core/src/steps/rerank.ts` | Cross-encoder |
| Graph compiler | `packages/mastra-core/src/compiler/graph-to-workflow.ts` | Canvas → Mastra |
| Execution runner | `apps/api/src/services/execution/runner.ts` | SSE streaming |
| Step tracer | `apps/api/src/services/execution/tracer.ts` | Wire Tap data |
| Node schemas | `packages/schemas/src/nodes/*.ts` | All node configs |

**Deliverable:** Users can run RAG pipelines and see results stream back.

---

### Phase 3: Canvas UI (User Experience)

**Goal:** Interactive canvas building experience

| Task | Package/Location | Description |
|------|------------------|-------------|
| Node palette | `apps/web/src/features/canvas/components/node-palette.tsx` | Drag node types |
| Property panel | `apps/web/src/features/canvas/components/property-panel.tsx` | Configure nodes |
| Execution bar | `apps/web/src/features/canvas/components/execution-bar.tsx` | Run button + input |
| Toolbar | `apps/web/src/features/canvas/components/toolbar.tsx` | Undo, zoom, export |
| Query node | `apps/web/src/features/canvas/nodes/query-node.tsx` | Styled input node |
| HyDE node | `apps/web/src/features/canvas/nodes/hyde-node.tsx` | With config UI |
| Retrieve node | `apps/web/src/features/canvas/nodes/retrieve-node.tsx` | With config UI |
| Generate node | `apps/web/src/features/canvas/nodes/generate-node.tsx` | With config UI |
| Data edge | `apps/web/src/features/canvas/edges/data-edge.tsx` | Clickable for Wire Tap |
| Wire Tap panel | `apps/web/src/features/canvas/wire-tap/wire-tap-panel.tsx` | Inspect data |
| Template loading | `apps/web/src/features/canvas/` | Load reference architectures |

**Deliverable:** Users can visually build and configure RAG pipelines.

---

### Phase 4: Collaboration & Polish (Differentiation)

**Goal:** Real-time collaboration and production polish

| Task | Package/Location | Description |
|------|------------------|-------------|
| Yjs provider | `packages/realtime` | WebSocket + Yjs CRDT |
| Presence service | `packages/realtime` | Track online users |
| Cursor overlay | `apps/web/src/features/collaboration/cursor-overlay.tsx` | Live cursors |
| Presence avatars | `apps/web/src/features/collaboration/presence-avatars.tsx` | Who's online |
| Document upload | `apps/web/src/features/documents/upload-dropzone.tsx` | File upload |
| Chunker service | `apps/api/src/services/documents/chunker.ts` | Split documents |
| Embedder service | `apps/api/src/services/documents/embedder.ts` | Generate vectors |
| Run history page | `apps/web/src/app/(dashboard)/runs/page.tsx` | View past runs |
| Run comparison | `apps/web/src/features/runs/` | Compare runs |
| Email invites | `packages/email` | Resend integration |

**Deliverable:** Teams can collaborate in real-time on RAG architectures.

---

## 5. Quick Wins (No Backend Required)

These can be implemented immediately with static/mock data:

| Task | Impact | Effort |
|------|--------|--------|
| Node palette UI (static list) | Users see available node types | Low |
| Property panel UI (static form) | Users see configuration options | Low |
| Template → Canvas loading | Users can try reference architectures | Medium |
| Execution bar UI (static) | Visual completeness | Low |
| Style existing nodes | Better visual hierarchy | Low |
| Add minimap component | Canvas navigation | Low |
| Add toolbar (zoom, fit) | Canvas controls | Low |

---

## 6. Technical Decisions Needed

### Authentication

**Decision:** Using **Better Auth** for authentication.

**Rationale:**
- TypeScript-first design for better type safety
- Simple and flexible API
- Easy to customize and extend
- Built-in OAuth support for GitHub and Google
- Good documentation and active development

### Background Jobs
| Option | Pros | Cons |
|--------|------|------|
| **Inngest** | Serverless, great DX, built-in UI | SaaS dependency |
| **BullMQ** | Self-hosted, Redis-based, mature | Need to manage Redis |
| **Trigger.dev** | Open-source, good DX | Newer |

**Recommendation:** Inngest for simplicity, BullMQ for self-hosted.

### Real-time Collaboration
| Option | Pros | Cons |
|--------|------|------|
| **Yjs + y-websocket** | CRDT, offline support, proven | Need WebSocket server |
| **Liveblocks** | Managed, great DX, presence built-in | SaaS cost |
| **PartyKit** | Edge-deployed, good DX | Newer platform |

**Recommendation:** Yjs for control, Liveblocks for speed.

---

## 7. Environment Variables Required

```env
# Database
DATABASE_URL=postgresql://...

# Authentication
BETTER_AUTH_SECRET=...
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

# Encryption
ENCRYPTION_KEY=... # 32 bytes for AES-256

# LLM Providers (workspace-level, stored encrypted)
# These are per-workspace, not global

# Optional: Background Jobs
INNGEST_EVENT_KEY=...
INNGEST_SIGNING_KEY=...

# Optional: Email
RESEND_API_KEY=...

# Optional: Real-time
# If self-hosting Yjs WebSocket server
```

---

## 8. Database Migrations

Run after schema changes:

```bash
# Generate migration
cd packages/database
bunx drizzle-kit generate

# Apply migration
bunx drizzle-kit migrate

# Or push directly (dev only)
bunx drizzle-kit push
```

---

## 9. Suggested Starting Point

1. **Run database migrations** to create tables
2. **Implement `packages/auth`** with Better Auth
3. **Connect API routes to database** (canvas CRUD first)
4. **Build node palette UI** (static, no backend needed)
5. **Implement first Mastra step** (embed or generate)
6. **Wire up execution** (single node first, then chains)

This gets you to a working prototype fastest.
