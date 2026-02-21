# Status & Roadmap

---

## 1. Implementation Status

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

## 2. Roadmap

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
