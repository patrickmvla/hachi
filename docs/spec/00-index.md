# Hachi (ハチ) — Production Specification

**Visual Architecture Platform for Advanced RAG Systems**

Version 1.0

---

## Documents

| # | File | Contents |
|---|------|----------|
| 01 | [Vision & Product](./01-vision.md) | Identity, problem space, target users, core use cases |
| 02 | [System Architecture](./02-architecture.md) | Stack, data flow diagrams, monorepo structure |
| 03 | [Package Architecture](./03-packages.md) | All 7 packages — database, auth, encryption, schemas, mastra-core, realtime, ui |
| 04 | [Database Schema](./04-database.md) | Tables, ER diagram, SQL definitions, indexes |
| 05 | [API Specification](./05-api.md) | Every endpoint — auth, workspaces, credentials, canvases, runs, documents |
| 06 | [Authentication & Security](./06-security.md) | Auth flows, sessions, RBAC, credential encryption, security boundaries |
| 07 | [Canvas & Node System](./07-canvas.md) | React Flow setup, 9 node types, interactions, status indicators |
| 08 | [Execution Engine](./08-execution.md) | Mock execution, real execution, graph compilation, SSE streaming |
| 09 | [Wire Tap](./09-wiretap.md) | Debugging interface, panel UI, data sources, per-node views |
| 10 | [State Management](./10-state.md) | Canvas store, execution log store, state flow |
| 11 | [Real-Time Collaboration](./11-collaboration.md) | Yjs architecture, sync model, presence, conflict handling |
| 12 | [Reference Architectures](./12-templates.md) | 6 pre-built templates — Naive RAG, HyDE, CRAG, Hybrid, Multi-Hop, Agentic |
| 13 | [Frontend & Configuration](./13-frontend.md) | Pages, layouts, providers, supported providers, node overrides |
| 14 | [Deployment & Development](./14-deployment.md) | Vercel, Docker, Supabase, env vars, dev commands |
| 15 | [Status & Roadmap](./15-status.md) | Implementation progress, what works, what's next, 4-phase roadmap |
