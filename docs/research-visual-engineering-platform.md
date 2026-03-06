# Hachi Research: Building a Visual RAG Engineering Platform

**Research Date:** March 2026
**Scope:** Canvas frameworks, execution engines, observability/tracing, competitive landscape, and phased implementation plan

---

## Table of Contents

1. [Research Motivation](#1-research-motivation)
2. [Competitive Landscape](#2-competitive-landscape)
3. [Visual Programming Frameworks](#3-visual-programming-frameworks)
4. [Execution Engines](#4-execution-engines)
5. [Observability & Tracing](#5-observability--tracing)
6. [RAG Evaluation Frameworks](#6-rag-evaluation-frameworks)
7. [Key UX Patterns to Adopt](#7-key-ux-patterns-to-adopt)
8. [What Separates Engineering Tool from Toy](#8-what-separates-engineering-tool-from-toy)
9. [Architecture Decisions](#9-architecture-decisions)
10. [Phased Implementation Plan](#10-phased-implementation-plan)
11. [Sources & References](#11-sources--references)

---

## 1. Research Motivation

Hachi's vision is not a flowchart builder or a no-code chatbot maker. It's a **visual engineering environment** where building, testing, and debugging RAG pipelines becomes as clear and precise as stepping through code in a debugger.

The core question: **What tools, patterns, and architectural decisions will get Hachi there?**

This research covers:
- Every major visual AI pipeline builder on the market (Langflow, Flowise, ComfyUI, Rivet, Dify, Vellum, PromptFlow)
- Every viable canvas/graph rendering library (React Flow, Rete.js, Litegraph, Flume, BaklavaJS, custom canvas)
- Every relevant execution engine (Mastra, LangGraph, Temporal, Inngest, Hatchet, LlamaIndex Workflows)
- Every relevant observability/tracing tool (Langfuse, Arize Phoenix, LangSmith, OpenTelemetry, Ragas, DeepEval, TruLens)

---

## 2. Competitive Landscape

### 2.1 Langflow (by DataStax/LangChain)

**What it is:** Node-based visual canvas for LangChain components. Drag-and-drop Python components, connect with wires, serialize as JSON.

**Stars:** ~42K GitHub | **License:** Apache 2.0 | **Stack:** Python (FastAPI) backend, React + React Flow frontend

**What's good:**
- Large component library (50+ integration groups)
- Pre-made templates for common RAG patterns
- Individual component testing via playground

**What's bad:**
- 10-15 second delays before LLM calls, 100% CPU spikes
- Agent execution 5x slower than equivalent LangGraph code (2.5 min vs 30 sec)
- Memory leak on file uploads — crashes during data-intensive RAG
- No team collaboration features
- Critical RCE vulnerability (CVE-2025-3248) in 2025
- Breaking bugs between versions (env files not read, state persistence lost)

**Takeaway for Hachi:** Langflow proves the concept but fails on performance and reliability. The lack of deep debugging means users can't understand *why* their pipelines produce bad results. This is exactly the gap Hachi fills.

---

### 2.2 Flowise

**What it is:** Three visual builder modes (Assistant, Chatflow, Agentflow) for LangChain.js components.

**Stars:** ~32K GitHub | **License:** Apache 2.0 | **Stack:** Node.js/Express backend, React + React Flow frontend

**What's good:**
- Node.js/TypeScript stack (natural fit for JS teams)
- Quick deployment (`npx flowise start`)
- 100+ data source integrations
- Built-in chat testing interface

**What's bad:**
- High RAM consumption and memory leaks on long-running flows
- Complex flows are nearly impossible to debug
- No token limit enforcement (abuse vector)
- No managed cloud — users must self-host
- AgentFlow V2 bugs with chat history and tool integration

**Takeaway for Hachi:** Flowise shares the same debugging gap as Langflow. "Complex flows become very difficult to debug" is the exact problem Wire Tap solves.

---

### 2.3 ComfyUI — The Gold Standard

**What it is:** Node editor for Stable Diffusion pipelines. Every part of the image generation process is exposed as a node. Simple workflows use 6 nodes; advanced ones use hundreds.

**Stars:** ~75K+ GitHub | **License:** GPL-3.0 | **Stack:** Python + PyTorch backend, LiteGraph.js canvas (migrating to Vue.js)

**Why ComfyUI feels so powerful (and what Hachi should steal):**

#### Incremental Execution with Hash-Based Caching
This is the single most impactful UX decision in the entire space. The execution engine hashes every node's inputs. When you change one parameter, it walks the graph backward to find the first changed node, then only re-executes from that point forward. For a 20-node pipeline with expensive model loading, this reduces iteration from 5 minutes to 30 seconds.

**For Hachi:** In a 15-node RAG pipeline where embedding + retrieval takes 10 seconds, hash-based caching means prompt iteration drops from 10s to <1s. This single feature would make Hachi feel 10x faster than every competitor.

#### Embedded Reproducibility
The entire workflow JSON is saved in the PNG metadata of every generated image. Drag-drop any image back onto the canvas to get the exact workflow. Every output is its own documentation.

**For Hachi:** Every pipeline run should carry its complete provenance — the graph, node configs, credentials used, query input, and all intermediate results. Any run should be fully reproducible and shareable.

#### Radical Extensibility
Custom nodes are Python modules dropped into `custom_nodes/`. They register into `NODE_CLASS_MAPPINGS` and are automatically discovered. New models and techniques appear as custom nodes often within hours of paper release.

**For Hachi:** A `custom_nodes/` equivalent with automatic discovery. Engineers should be able to add a new RAG pattern (e.g., a custom chunking strategy) by dropping a file and having it appear in the node palette.

#### No Abstraction Tax
Unlike tools that hide complexity behind "easy mode," ComfyUI shows the full graph. Users build genuine understanding, which pays off when debugging.

**For Hachi:** Never hide the pipeline internals. The whole point is visibility.

#### Strong Type System on Ports
Each input/output has a type (IMAGE, LATENT, MODEL, CLIP, VAE, CONDITIONING). Invalid connections are prevented at the UI level. Types are color-coded.

**For Hachi:** Define RAG-specific types (Document, Chunk, Embedding, Query, LLMResponse, Score) with color-coded handles and compile-time connection validation.

**What's bad about ComfyUI:**
- Steep learning curve (2-4 weeks to proficiency)
- LiteGraph.js canvas is dated (migrating to Vue.js "Node 2.0")
- Custom node compatibility issues between versions
- No version control for workflows
- No collaboration features

---

### 2.4 Rivet (by Ironclad) — The Debugging Champion

**What it is:** Desktop app for building AI agents through visual prompt chaining. YAML graph format (version-control friendly).

**Stars:** ~4.5K GitHub | **License:** Open Source | **Stack:** Tauri (Rust + web), TypeScript core library

**What Rivet does for debugging that nobody else does:**

#### Remote Debugging
Embed Rivet Core (TypeScript library) in your production app. The Rivet desktop app connects to a debugging endpoint and displays execution in real-time. This is Chrome DevTools for AI pipelines. No other tool offers this.

**For Hachi (long-term):** Connect the canvas to a running deployed pipeline. See production execution live on the visual graph.

#### Wire Inspection
All data moves through wires as JSON. Hover over any wire to see the exact payload. This makes data flow debugging trivial.

**For Hachi:** This is exactly what Wire Tap should be — but rendered on the canvas edges, not just in a side panel.

#### Pause and Abort
Pause execution mid-graph from the IDE to inspect state, then resume or abort. True breakpoint-style debugging.

**For Hachi:** Implement `await suspend()` (Mastra vNext) as a visual breakpoint. Click a node to set a breakpoint, execution pauses there, you inspect state, then resume.

#### Trace Timeline (Gantt Chart)
Visual timeline showing how long each LLM/HTTP call took, with a cost estimator showing live token counts and approximate spend per run.

**For Hachi:** Build an execution timeline bar at the bottom of the canvas showing the Gantt chart of each run.

#### Node Replay
Replay any single node with the same inputs to iterate on a prompt without re-running the entire graph.

**For Hachi:** Combined with hash-based caching, this makes prompt iteration near-instant. Change the system prompt on the LLM node, replay just that node.

**What's bad about Rivet:**
- Desktop-only (web mode has "janky" saving)
- Smaller community
- No built-in evaluation framework
- Limited documentation for advanced patterns

---

### 2.5 Dify — Most Complete Open Source

**What it is:** Feature-complete open-source platform covering workflows, RAG, agents, model management, and observability.

**Stars:** ~114K GitHub | **License:** Apache 2.0 | **Stack:** Python + Flask backend, Next.js + React Flow frontend

**What's good:**
- Best debugging experience among open-source tools
- Execution duration for each node, input/output values, clear error messages
- Maintains complete logs of all executed tests (revisitable)
- Plugin architecture for extensibility
- Polished UI

**What's bad:**
- Generic (not RAG-specialized)
- No typed port system
- No incremental execution
- User feedback not synced to external tracing providers
- Can feel overwhelming

**Takeaway for Hachi:** Dify's run history with full logs is the right approach. Every test run should be persisted, revisitable, and comparable. But Dify lacks the depth of debugging (no wire inspection, no node replay, no caching).

---

### 2.6 Vellum — The Evaluation Pioneer

**What it is:** Commercial end-to-end AI development platform. Workflow builder with deep evaluation integration.

**License:** Closed source | **Pricing:** ~$500/mo Pro tier

**What Vellum does for evaluation that others don't:**

#### Three Evaluation Modes
1. **Offline** — Pre-deployment testing against curated datasets
2. **Online** — Continuous production monitoring
3. **Inline** — Runtime guardrails that prevent bad outputs

#### Baseline Comparison
Designate any deployed version as a "baseline." Compare draft versions against it across a bank of test cases. Aggregate metrics (Mean, Median, P90) with regression tracking.

#### Side-by-Side Variant Testing
Compare outputs from different models, prompts, or pipeline configs on the same inputs. This is A/B testing for RAG pipelines.

**What's bad:**
- Closed source
- UX "could be more intuitive," "clunky and buggy"
- Opaque enterprise pricing
- RBAC only on paid plans

**Takeaway for Hachi:** Evaluation should be a first-class concept, not bolted on. Vellum's three-mode evaluation (offline/online/inline) and variant comparison are the right design patterns. Build them into the canvas, not as a separate product.

---

### 2.7 PromptFlow (Microsoft)

**What it is:** DAG-based visual editor in Azure AI Foundry + VS Code extension.

**What's unique:**
- **Prompt variants:** Create and compare multiple prompt versions within the same flow
- **Evaluation flows:** Dedicated flow type for building eval pipelines
- **VS Code extension:** Edit flows in your IDE

**What's bad:** Heavy Azure lock-in. The full experience requires Azure AI Foundry.

**Takeaway for Hachi:** The concept of "evaluation flows" — building an eval pipeline the same way you build a production pipeline — is elegant. Hachi could let users build eval pipelines as canvases that take pipeline outputs and compute quality metrics.

---

### 2.8 Competitive Gap Summary

| Feature | Langflow | Flowise | ComfyUI | Rivet | Dify | Vellum | **Hachi (Target)** |
|---------|----------|---------|---------|-------|------|--------|---------------------|
| Deep debugging | No | No | Partial | **Yes** | Partial | No | **Yes** |
| Wire/edge inspection | No | No | No | **Yes** | No | No | **Yes** |
| Hash-based caching | No | No | **Yes** | No | No | No | **Yes** |
| Node replay | No | No | Partial | **Yes** | No | No | **Yes** |
| Typed port system | No | No | **Yes** | Partial | No | Partial | **Yes** |
| Built-in evaluation | No | No | No | No | Partial | **Yes** | **Yes** |
| Variant comparison | No | No | No | No | No | **Yes** | **Yes** |
| Canvas-native tracing | No | No | Partial | Partial | No | No | **Yes** |
| Run history | No | No | No | No | **Yes** | **Yes** | **Yes** |
| Real-time collaboration | No | No | No | No | No | No | **Yes** |
| RAG-specialized | Partial | Partial | No | No | No | No | **Yes** |
| Open source | Yes | Yes | Yes | Yes | Yes | No | **Yes** |

**Hachi's opportunity:** No existing tool combines deep debugging (Rivet), incremental execution (ComfyUI), first-class evaluation (Vellum), canvas-native tracing, real-time collaboration, and RAG specialization. That's the gap.

---

## 3. Visual Programming Frameworks

### 3.1 React Flow / XYFlow (Current Choice)

**Stars:** ~31.8K | **NPM Downloads:** ~2.94M/week | **Version:** 12.x | **License:** MIT

**Strengths:**
- Dominant library for AI workflow builders (Langflow, Flowise, Dify, Vercel all use it)
- Custom nodes are standard React components (maximum flexibility)
- Built-in viewport virtualization (`onlyRenderVisibleElements`)
- Extensible plugin system (Background, MiniMap, Controls)
- React Flow Pro adds helper lines, auto-layout, workflow editor templates
- Massive community and ecosystem

**Limitations:**
- No built-in type system for ports (must build `isValidConnection` yourself)
- No execution engine (must build graph traversal yourself)
- No dynamic ports out of the box (must manage handle rendering manually)
- DOM-based rendering — performance ceiling at ~200-300 complex nodes
- Performance requires careful optimization (React.memo, useCallback, minimal CSS)

**What to build on top:**
1. `PortTypeRegistry` — typed handles with color coding and connection validation
2. Dynamic handle rendering based on node config
3. Wire inspection on edge hover/click
4. Execution state overlay (status badges, latency, animated edges)

**Verdict:** Stay with React Flow. The ecosystem alignment with AI workflow builders is decisive. The missing pieces (type system, execution, debugging) are domain-specific and must be custom-built regardless of which canvas library you choose.

---

### 3.2 Rete.js v2

**Stars:** ~10.8K | **NPM Downloads:** ~25.8K/week | **Version:** 2.0.6 | **License:** MIT

**Strengths:**
- First-class socket type system (sockets define what can connect to what)
- Built-in execution engine with three modes:
  - **Dataflow Engine:** Pull model (like Blender compositor)
  - **Control Flow Engine:** Push model (like Unreal Blueprints)
  - **Hybrid Engine:** Both simultaneously
- Dynamic ports natively supported
- Framework-agnostic core (React, Vue, Angular renderers)
- Plugin-based architecture

**Limitations:**
- ~100x smaller community than React Flow
- Historically weaker performance at scale (improved in v2 with LOD)
- Still DOM-based rendering (same fundamental scaling limitation)
- Not widely adopted by AI workflow tools
- Migration from React Flow would be substantial work

**Verdict:** If starting from scratch, Rete.js would be compelling for its type system and execution engine. But the ecosystem gap vs React Flow, plus migration cost, makes it impractical. Study its socket type system and hybrid engine for design inspiration.

---

### 3.3 Litegraph.js (Powers ComfyUI)

**Stars:** ~7.9K | **Status:** Original minimally maintained; ComfyUI fork archived, merged into frontend monorepo

**Strengths:**
- Canvas2D rendering — orders of magnitude faster than DOM (handles hundreds of nodes)
- Built-in slot type system with color coding
- Built-in execution engine (dataflow and event-based)

**Limitations:**
- ComfyUI is actively migrating AWAY from it to Vue.js (Nodes 2.0)
- No React integration
- All node UI is imperative Canvas2D drawing (no React components)
- Building custom node UIs (forms, dropdowns, editors) is extremely labor-intensive

**Verdict:** Not recommended. Stagnant library, no React integration, and ComfyUI's migration away from it is a strong negative signal. The performance advantage is irrelevant for RAG pipelines (typically 5-30 nodes).

---

### 3.4 Other Frameworks

| Framework | Stars | NPM/week | Fit for Hachi | Verdict |
|-----------|-------|----------|---------------|---------|
| **Flume** | 1.6K | ~400 | Low | Basic port types but too limited. Sync execution model is a non-starter for async RAG. No plugin system. Skip. |
| **BaklavaJS** | 2K | ~1.5K | Medium | Interesting type system + engine plugins. But Vue-only. Not viable for React/Next.js stack. Study Interface Types plugin for inspiration. |
| **Pixi.js** (custom) | 44K | N/A | High effort | WebGL rendering at 60fps with 8K+ objects. But building a node editor from scratch = 6-12 months. Not justified. |
| **Konva.js** (custom) | 11K | N/A | Medium effort | Canvas2D with React integration (`react-konva`). 4-8 months to build an editor. Still not justified. |

### 3.5 Framework Decision

**Decision: Stay with React Flow.**

Rationale:
1. Every major AI workflow builder validates it (Langflow, Flowise, Dify, Vercel)
2. You're already on v12 with working canvas code
3. The engineering experience comes from what you build ON TOP (type system, execution, debugging)
4. Migration cost to any alternative is weeks of work for marginal benefit
5. RAG pipelines are typically 5-30 nodes — well within React Flow's performance range
6. React Flow Pro offers growing component library for workflow editors

---

## 4. Execution Engines

### 4.1 Mastra vNext (Recommended — Upgrade from 0.24.9)

**Current state:** Hachi uses `@mastra/core@^0.24.9` (legacy API) with `@mastra/rag@^1.3.6`. Mastra is now at 1.8.0 with a completely rewritten "vNext" workflow system.

**What vNext gives you:**

| Feature | How |
|---------|-----|
| **Streaming per step** | Each step receives a `writer` argument (WritableStream). `workflow.stream()` returns a ReadableStream. |
| **Suspend/Resume** | `await suspend({ ... })` in any step. Full state serialized as snapshot. Survives server restarts. |
| **Parallel execution** | `.parallel()` for unconditional, `.branch()` for conditional branches. |
| **Loops (for CRAG)** | `.loop()` with `while`/`until` conditions and iteration limits. |
| **Typed data flow** | Zod `inputSchema`/`outputSchema` on every step. End-to-end type safety. |
| **State snapshots** | Full workflow state serialized at suspend points. Addressable by runId. |

**vNext API pattern:**
```typescript
import { createStep, Workflow } from "@mastra/core/workflows/vNext";

const embedStep = createStep({
  id: "embed",
  inputSchema: z.object({ text: z.string() }),
  outputSchema: z.object({ vector: z.array(z.number()), model: z.string() }),
  execute: async ({ inputData, mapiData, writer }) => {
    // Real embedding call
    const result = await embeddings.embed(inputData.text);
    writer?.write({ type: "progress", nodeId: "embed", progress: 100 });
    return { vector: result.vector, model: "text-embedding-3-small" };
  },
});

const pipeline = new Workflow({ name: "naive-rag" })
  .then(queryStep)
  .then(embedStep)
  .then(retrieveStep)
  .then(generateStep);

// Stream execution
const stream = pipeline.stream({ query: "What is RAG?" });
```

**Migration from 0.24.9 to 1.8.x:**
1. Replace `Workflow` + `Step` imports with `createStep` + `new Workflow({...}).then().branch().parallel()`
2. Rewrite `graph-to-workflow.ts` compiler to produce `.then()` / `.parallel()` / `.branch()` chains
3. Replace `use-mock-execution.ts` with real streaming via `workflow.stream()`
4. Relax cycle validation — allow `.loop()` patterns for CRAG

**Why Mastra over alternatives:**
- Already invested (packages/mastra-core, step factories, compiler)
- TypeScript-first with Zod throughout
- Built-in `@mastra/rag` with vector store integrations
- Official workflow-builder-template for React-based visual builders
- Runs in-process (no external server required)

---

### 4.2 LangGraph JS (Alternative — Worth Monitoring)

**Stars:** Used by Replit, Uber, LinkedIn, GitLab | **Version:** 1.0 (Oct 2025)

**Strengths:**
- Native cycle support (not just DAGs) — critical for CRAG/Self-RAG
- Shared state model: all nodes read/write to a shared state object
- Pluggable checkpointing: saves state at every "super-step" (PostgresSaver, MemorySaver)
- First-class streaming: token-by-token + intermediate step streaming
- Reference implementations for CRAG, Adaptive RAG, Self-Reflective RAG

**Weaknesses:**
- Brings entire LangChain ecosystem as dependency
- TypeScript version less mature than Python
- Overlap with Mastra's capabilities

**Verdict:** Consider only if Mastra's execution engine proves insufficient for sophisticated agent patterns (multi-agent, hierarchical, self-correcting). LangGraph's shared-state model and cycle-native execution are architecturally elegant.

---

### 4.3 Other Engines Evaluated

| Engine | Type | Streaming | DAG Support | TS Support | Verdict |
|--------|------|-----------|-------------|------------|---------|
| **Temporal** | Durable execution | No (determinism kills it) | Imperative only | Good (sandboxed) | Too heavy. Determinism constraints prevent streaming. Requires separate cluster. |
| **Inngest** | Event-driven durable functions | Limited | No graph abstraction | Excellent | Good for background jobs, not for visual DAG execution. |
| **Hatchet** | Distributed task queue + DAGs | Yes (SSE via putStream) | Native DAGs | Good (v1 SDK) | Interesting as production deployment target. MIT + Postgres. But adds operational overhead. |
| **BullMQ** | Job queue (Redis) | No | Parent-child only (not true DAGs) | Good | Too low-level. No DAG execution. |
| **Graphile Worker** | Task executor (Postgres) | No | No | TypeScript | Too low-level. Simple task queue. |
| **Trigger.dev** | Durable execution | Yes (Realtime feature) | No graph abstraction | Excellent | Similar to Inngest. Infrastructure layer, not pipeline framework. |
| **LlamaIndex Workflows** | Event-driven | Yes (stream-oriented) | No static graph (event-driven) | Good | Event-driven model doesn't map to visual node graphs. |
| **Haystack** (Python) | Component-driven DAG | AsyncPipeline | Directed multigraph | Python only | Excellent architecture to study. Component protocol with declared inputs/outputs and pipeline-level validation. |
| **CrewAI** | Agent pipelines | No | Sequential stages only | Python only | Too coarse-grained. Python only. |
| **DSPy** | Prompt optimization | N/A (compilation, not execution) | N/A | Python only | Orthogonal — optimizes prompts, doesn't execute pipelines. Compilation concept worth studying. |

---

### 4.4 Execution Engine Decision

**Decision: Upgrade Mastra to vNext (1.8.x).**

**Build on top:**
1. **Hash-based caching** (ComfyUI pattern) — hash each node's inputs, skip re-execution for unchanged subgraphs
2. **Breakpoint support** — use Mastra's `suspend()` as visual breakpoints
3. **Node replay** — re-execute single node with cached upstream outputs
4. **SSE streaming** — stream execution events from Hono API to React Flow canvas

---

## 5. Observability & Tracing

### 5.1 The Key Insight: Canvas-Native Tracing

Every existing observability tool (LangSmith, Langfuse, Phoenix) shows traces as a **waterfall/tree view** in a separate panel. But Hachi already has the pipeline topology rendered visually on the canvas. This is the differentiation opportunity.

**Traces should be overlaid directly on the canvas — not in a separate view.**

What this looks like:
- Each node shows status badge (pending → running → success → error) with latency
- Edges animate to show data flow direction and timing
- Click any node → side panel shows inputs, outputs, retrieved documents, scores
- Click any edge → see the exact data payload that flowed through it
- Timeline bar at the bottom → Gantt chart of execution (what ran when, duration, cost)
- Cost accumulator → running total of tokens and $ per run

This is fundamentally different from and potentially superior to the tree/waterfall views that all existing tools use.

---

### 5.2 Trace Data Model: OpenInference on OpenTelemetry

**Recommendation: Emit OpenTelemetry spans from the execution engine following OpenInference semantic conventions.**

OpenInference (by Arize) defines span kinds that map directly to Hachi's node types:

| Hachi Node | OpenInference Span Kind | Key Attributes |
|------------|------------------------|----------------|
| query | CHAIN | `input.value`, rewritten query |
| embedding | EMBEDDING | `embedding.model_name`, `embedding.text`, vector dimensions, batch size |
| retriever | RETRIEVER | `retrieval.documents[].id`, `.score`, `.content`, `.metadata` |
| reranker | RERANKER | input/output docs, score before/after, model name, top_k |
| llm | LLM | `llm.input_messages`, `llm.output_messages`, `llm.token_count.*`, model params |
| judge | EVALUATOR | metric name, score, reasoning chain |
| agent | AGENT | reasoning steps, tool calls, iterations |
| hyde | CHAIN | sub-spans for LLM generation + embedding |

**Why OpenTelemetry:**
- Industry standard (not vendor lock-in)
- Users can optionally route traces to Langfuse, Phoenix, Datadog, Jaeger, or any OTLP backend
- TypeScript SDKs exist for both emission and consumption
- The primary experience is the canvas-native viewer; external tools are optional

---

### 5.3 Observability Tools Comparison

| Tool | Open Source | Self-Hosted | TS SDK | Data Standard | Best For |
|------|------------|-------------|--------|---------------|----------|
| **Langfuse** | Yes (MIT) | Yes (free) | Yes | OpenTelemetry | General-purpose LLM observability. Most popular open-source option (19K+ stars). Excellent trace/span/generation model. Scoring system for evaluations. |
| **Arize Phoenix** | Yes (EL2.0) | Yes (free) | Yes | OpenInference/OTLP | Embedding analysis, drift detection. UMAP/t-SNE projections of query + document embeddings. Strong retriever analysis. |
| **LangSmith** | No | Enterprise only | Yes | Proprietary (Run Tree) | LangChain-native apps. Tight zero-config integration. But vendor-locked and paid. |
| **Helicone** | Yes (MIT) | Yes (Docker) | Proxy-based | Proprietary | Zero-code LLM logging via proxy. Good for LLM calls but doesn't capture non-LLM pipeline stages. |
| **Braintrust** | No | No | Yes | OpenTelemetry | CI/CD evaluation quality gates. GitHub Action posts experiment comparison on PRs. Mastra integration exists. |
| **W&B Weave** | SDK only | No | Partial | Proprietary | ML teams already on W&B. Python-first. |
| **OpenLLMetry** | Yes (Apache 2.0) | N/A (library) | In progress | OTel + GenAI conventions | Instrumentation library for LLM providers + vector DBs. Pairs with any OTLP backend. |

### 5.4 Integration Strategy

**Primary: Build canvas-native trace viewer** that consumes execution events directly from the Mastra execution engine via SSE.

**Secondary: Emit OTLP traces** so users can optionally send data to Langfuse or Phoenix for aggregate analytics, embedding visualization, and long-term trace storage.

**Implementation:**
1. Execution engine emits structured events per node (start, progress, complete, error)
2. Events include full inputs/outputs, latency, token counts, costs
3. Frontend receives via SSE and renders on canvas (status badges, edge animation, side panel)
4. Optionally, events are also emitted as OTLP spans for external consumption

---

### 5.5 What Traces/Metrics to Capture

#### Per-Node Metrics

| Pipeline Stage | Metrics | Attributes |
|----------------|---------|------------|
| **Query** | Query length, rewrite latency | Original query, rewritten query, language |
| **Embedding** | Latency, vector dimensions, magnitude | Input text, model, batch size, vector (optional) |
| **Retriever** | Latency, docs returned (k), score distribution, precision@k, MRR | Query vector, doc IDs, scores, content, metadata, vector DB |
| **Reranker** | Latency, score shift distribution, model | Input/output docs, scores before/after, top_k |
| **Context Assembly** | Total token count, chunk overlap, window utilization | Selected chunks, ordering, truncation |
| **LLM** | TTFT, total latency, tokens (input/output), cost, model | Messages, model params, finish reason |
| **Judge** | Latency, verdict, confidence | Criteria, reasoning chain, route taken |
| **Agent** | Iterations, tool calls, total latency | Reasoning trace, tool inputs/outputs |

#### End-to-End Metrics

| Metric | Description |
|--------|-------------|
| Total pipeline latency | Breakdown per stage |
| Faithfulness/Groundedness | Answer supported by retrieved context? |
| Answer Relevancy | Answer relevant to original question? |
| Context Relevance | Retrieved documents relevant? |
| Hallucination Rate | Claims not grounded in context |
| Total cost | Sum of embedding + LLM costs |

#### Aggregate/Distribution Metrics

- Embedding similarity score distributions across queries
- Retrieval score distributions (bimodal? clustered?)
- Reranker score lift over raw retrieval
- Token usage patterns over time
- Latency percentiles (p50, p95, p99) per stage
- Cost per query over time
- Failure/error rates per stage

---

## 6. RAG Evaluation Frameworks

### 6.1 Ragas — The Standard

**What it is:** Reference-free RAG evaluation framework. Suite of metrics without requiring ground truth human annotations.

**Core Metrics:**
- **Context Precision:** Did you retrieve the right documents? Are relevant ones ranked higher?
- **Context Recall:** Did you retrieve all relevant documents?
- **Faithfulness:** Is the generated answer grounded in retrieved context?
- **Answer Relevancy:** Is the answer relevant to the question?

**For Hachi:** Implement these as built-in evaluation functions that can run automatically on every pipeline execution. They can power the Judge node and evaluation dashboards.

### 6.2 DeepEval

**Key innovation:** Metrics are **debuggable** — you can inspect the LLM judge's reasoning chain to understand why a score was given.

**For Hachi:** When showing evaluation scores on the canvas, always show the reasoning. A faithfulness score of 0.6 means nothing without knowing *which claim* wasn't grounded.

### 6.3 TruLens — The RAG Triad

**Model:**
1. **Context Relevance:** Is the retrieved context relevant to the query?
2. **Groundedness:** Is the response factually supported by the context?
3. **Answer Relevance:** Is the answer relevant to the original question?

**For Hachi:** The RAG Triad is a clean conceptual model for the Judge node. Display these three scores prominently for every pipeline run.

### 6.4 Evaluation Design for Hachi

**Three modes (from Vellum):**
1. **Offline:** Run pipeline against curated test datasets. Compare against baselines. Regression detection.
2. **Online:** Monitor production pipeline quality continuously. Alert on metric degradation.
3. **Inline:** Runtime guardrails — if faithfulness < threshold, trigger fallback (CRAG pattern).

**Canvas integration:**
- The Judge node computes RAG Triad scores inline during execution
- Scores are displayed on the node itself (color-coded badges)
- Run history shows score trends over time
- Variant comparison: swap one node, re-run on same test set, compare scores

---

## 7. Key UX Patterns to Adopt

| Pattern | Source | Description | Priority |
|---------|--------|-------------|----------|
| **Hash-based incremental execution** | ComfyUI | Hash node inputs, skip unchanged subgraphs. 10x iteration speed. | Critical |
| **Wire/edge data inspection** | Rivet | Click/hover any connection to see exact data payload. | Critical |
| **Canvas-native trace overlay** | Novel (Hachi) | Show execution state directly on nodes and edges, not in separate view. | Critical |
| **Node replay** | Rivet | Re-run single node with cached upstream data. | High |
| **Typed port system** | ComfyUI | Color-coded handles, compile-time connection validation. | High |
| **Execution timeline (Gantt)** | Rivet | Visual bar showing what ran when, duration, cost per step. | High |
| **Run history with full logs** | Dify | Persist every test run. Revisitable and comparable. | High |
| **Embedded reproducibility** | ComfyUI | Every run output carries full pipeline provenance. | High |
| **Variant comparison** | Vellum | Swap one node, compare results side-by-side. | Medium |
| **Three evaluation modes** | Vellum | Offline (test datasets), Online (production), Inline (guardrails). | Medium |
| **Remote debugging** | Rivet | Connect canvas to running deployed pipeline. | Long-term |
| **JSON graph in git** | Rivet/ComfyUI | Flows are code artifacts — diffable, reviewable, version-controlled. | Medium |
| **Custom node discovery** | ComfyUI | Drop a file, register it, appears in palette. | Medium |

---

## 8. What Separates Engineering Tool from Toy

These are the principles that must guide every design decision:

### 1. Debuggability
Toys show a pretty graph. Engineering tools let you pause execution, inspect every wire, replay individual nodes, and connect to live systems.

### 2. Incremental Execution
Toys re-run everything from scratch. Engineering tools cache intermediate results and only re-execute what changed.

### 3. Reproducibility
Toys produce outputs. Engineering tools produce outputs that carry their own provenance — you can always trace back to the exact configuration.

### 4. Type Safety
Toys let you connect anything to anything and fail at runtime. Engineering tools enforce type compatibility at the graph level, preventing entire categories of errors before execution.

### 5. Version Control Integration
Toys store flows in databases. Engineering tools store flows as text files (JSON/YAML) that work with git, code review, and CI/CD.

### 6. Evaluation as First-Class
Toys let you run a flow and eyeball the output. Engineering tools have built-in test suites, baseline comparisons, aggregate metrics, and regression detection.

### 7. Production Observability
Toys are for prototyping. Engineering tools provide tracing, cost tracking, latency monitoring, and alerting in production.

---

## 9. Architecture Decisions

### 9.1 Overall Architecture

```
┌──────────────────────────────────────────────────────┐
│                  Frontend (Next.js)                   │
│  ┌──────────────┐  ┌──────────┐  ┌───────────────┐  │
│  │  React Flow   │  │  Trace   │  │  Evaluation   │  │
│  │  Canvas +     │  │  Overlay │  │  Dashboard    │  │
│  │  Type System  │  │  + Panel │  │  + Comparison │  │
│  └──────────────┘  └──────────┘  └───────────────┘  │
│              │              │              │          │
│              └──────────────┴──────────────┘          │
│                         │                            │
│                    SSE / WebSocket                    │
└────────────────────────┬─────────────────────────────┘
                         │
┌────────────────────────▼─────────────────────────────┐
│                   Backend (Hono)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────┐  │
│  │    Graph      │  │  Execution   │  │   Trace   │  │
│  │   Compiler    │  │   Engine     │  │  Emitter  │  │
│  │  (RF → Mastra)│  │ (Mastra vNext│  │  (OTLP)   │  │
│  └──────────────┘  │  + Cache)    │  └───────────┘  │
│                    └──────────────┘                   │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────┐  │
│  │  Port Type   │  │    Node      │  │   Eval    │  │
│  │  Registry    │  │   Registry   │  │  Engine   │  │
│  └──────────────┘  └──────────────┘  └───────────┘  │
└──────────────────────────────────────────────────────┘
```

### 9.2 Key Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Canvas library | React Flow (stay) | Ecosystem dominance, existing code, performance sufficient for RAG (5-30 nodes) |
| Execution engine | Mastra vNext 1.8.x (upgrade) | Already invested, TypeScript-first, streaming, suspend/resume, Zod types, built-in RAG |
| Caching strategy | Hash-based (ComfyUI pattern) | Single most impactful UX feature. 10x iteration speed. |
| Trace data model | OpenInference on OpenTelemetry | Maps to node types, industry standard, backend-agnostic |
| Primary trace UI | Canvas-native overlay | Unique differentiator — no other tool does this |
| External tracing | Langfuse (optional) | MIT, self-hostable, excellent TS SDK, OpenTelemetry-native |
| Evaluation metrics | RAG Triad (Ragas/TruLens) | Context Relevance, Groundedness, Answer Relevancy |
| Graph format | JSON (version-controllable) | Diff-able, reviewable in PRs, git-friendly |
| Streaming protocol | SSE via Hono | Lightweight, HTTP-native, no WebSocket complexity for execution |
| Port type system | Custom registry with `isValidConnection` | Color-coded handles, compile-time validation, RAG-specific types |

### 9.3 Port Type System Design

```typescript
// RAG-specific port types
enum PortType {
  TEXT = "text",              // Plain string
  QUERY = "query",            // Search query (text + metadata)
  EMBEDDING = "embedding",    // Float vector
  DOCUMENT = "document",      // Single document (content + metadata + score)
  DOCUMENTS = "documents",    // Document array
  LLM_RESPONSE = "llm_response", // LLM output (text + tokens + cost)
  SCORE = "score",            // Numeric score (0-1)
  VERDICT = "verdict",        // Judge verdict (RELEVANT/IRRELEVANT + reasoning)
  JSON = "json",              // Arbitrary JSON
}

// Color mapping
const PORT_COLORS: Record<PortType, string> = {
  text: "#3b82f6",       // blue
  query: "#6366f1",      // indigo
  embedding: "#06b6d4",  // cyan
  document: "#22c55e",   // green
  documents: "#16a34a",  // dark green
  llm_response: "#eab308", // yellow
  score: "#f97316",      // orange
  verdict: "#ef4444",    // red
  json: "#8b5cf6",       // purple
};

// Connection rules
const VALID_CONNECTIONS: Record<PortType, PortType[]> = {
  text: [PortType.TEXT, PortType.QUERY, PortType.JSON],
  query: [PortType.TEXT, PortType.QUERY],
  embedding: [PortType.EMBEDDING],
  document: [PortType.DOCUMENT, PortType.DOCUMENTS, PortType.JSON],
  documents: [PortType.DOCUMENTS],
  llm_response: [PortType.TEXT, PortType.LLM_RESPONSE, PortType.JSON],
  score: [PortType.SCORE, PortType.JSON],
  verdict: [PortType.VERDICT, PortType.JSON],
  json: [PortType.JSON, PortType.TEXT],
};
```

### 9.4 Hash-Based Caching Design

```typescript
// ComfyUI-inspired execution cache
interface NodeExecutionCache {
  // Map of nodeId → { inputHash, output }
  cache: Map<string, { inputHash: string; output: unknown; timestamp: number }>;

  // Hash function: deterministic hash of node config + all upstream outputs
  computeInputHash(nodeId: string, config: NodeConfig, upstreamOutputs: Map<string, unknown>): string;

  // Check if node needs re-execution
  needsExecution(nodeId: string, currentInputHash: string): boolean;

  // Get cached output
  getCachedOutput(nodeId: string): unknown | null;

  // Store output after execution
  setCachedOutput(nodeId: string, inputHash: string, output: unknown): void;

  // Invalidate downstream cache when a node changes
  invalidateDownstream(nodeId: string, graph: GraphDefinition): void;
}

// Execution flow with caching:
// 1. For each node in topological order:
//    a. Compute inputHash from config + upstream outputs
//    b. If cache hit → skip execution, use cached output
//    c. If cache miss → execute node, store output in cache
// 2. Only re-execute from the first changed node forward
```

---

## 10. Phased Implementation Plan

### Phase 1: Execution Foundation (Makes It Real)

**Goal:** RAG pipelines actually execute with real APIs and stream results back to the canvas.

**Duration estimate:** This phase turns Hachi from a visual mockup into a functional tool.

#### 1.1 Upgrade Mastra to vNext

| Task | Location | Details |
|------|----------|---------|
| Upgrade `@mastra/core` | `packages/mastra-core/package.json` | `^0.24.9` → `^1.8.0` |
| Upgrade `@mastra/rag` | `packages/mastra-core/package.json` | Update to match vNext |
| Rewrite step factories | `packages/mastra-core/src/steps/*.ts` | Convert to `createStep()` with Zod inputSchema/outputSchema |
| Rewrite graph compiler | `packages/mastra-core/src/compiler/graph-to-workflow.ts` | Produce `.then()` / `.parallel()` / `.branch()` / `.loop()` chains |
| Update validation | `packages/mastra-core/src/compiler/validate.ts` | Allow `.loop()` patterns for CRAG, reject only true infinite cycles |

**Step factory example (vNext):**
```typescript
export const embedStep = createStep({
  id: "embed",
  inputSchema: z.object({
    text: z.string(),
    model: z.string().default("text-embedding-3-small"),
  }),
  outputSchema: z.object({
    vector: z.array(z.number()),
    model: z.string(),
    tokensUsed: z.number(),
    dimensions: z.number(),
    latencyMs: z.number(),
  }),
  execute: async ({ inputData, writer }) => {
    const start = Date.now();
    const result = await openai.embeddings.create({
      model: inputData.model,
      input: inputData.text,
    });
    return {
      vector: result.data[0].embedding,
      model: inputData.model,
      tokensUsed: result.usage.total_tokens,
      dimensions: result.data[0].embedding.length,
      latencyMs: Date.now() - start,
    };
  },
});
```

#### 1.2 SSE Streaming from API

| Task | Location | Details |
|------|----------|---------|
| Execution endpoint | `apps/api/src/routes/runs.ts` | `POST /runs/:canvasId/execute` — accepts query, returns SSE stream |
| SSE event format | `packages/schemas/src/execution/events.ts` | Define event types: `run_started`, `node_started`, `node_progress`, `node_completed`, `node_error`, `run_completed` |
| Stream adapter | `apps/api/src/services/execution/stream.ts` | Bridge Mastra `workflow.stream()` → Hono SSE response |

**SSE event schema:**
```typescript
type ExecutionEvent =
  | { type: "run_started"; runId: string; timestamp: number }
  | { type: "node_started"; nodeId: string; nodeType: string; timestamp: number }
  | { type: "node_progress"; nodeId: string; progress: number; partialOutput?: unknown }
  | { type: "node_completed"; nodeId: string; output: unknown; latencyMs: number; tokensUsed?: number; cost?: number }
  | { type: "node_error"; nodeId: string; error: string; stack?: string }
  | { type: "run_completed"; runId: string; totalLatencyMs: number; totalCost: number };
```

#### 1.3 Canvas Execution Overlay

| Task | Location | Details |
|------|----------|---------|
| Replace mock execution | `apps/web/src/features/canvas/hooks/use-execution.ts` | New hook that connects to SSE endpoint, updates node statuses in real-time |
| Node status badges | `apps/web/src/features/canvas/nodes/*.tsx` | Show latency, token count, cost on each node after execution |
| Edge animation | `apps/web/src/features/canvas/edges/data-edge.tsx` | Animate edges during data flow (CSS pulse or SVG dash animation) |
| Cost accumulator | `apps/web/src/features/canvas/components/execution-bar.tsx` | Running total of tokens and $ during execution |

**Deliverable:** Users can build a RAG pipeline on the canvas, hit "Run," and watch real data flow through the graph with live status updates, latency, and costs.

---

### Phase 2: Type System & Debugging (Makes It Professional)

**Goal:** Typed connections prevent errors. Wire inspection and node detail panels enable deep debugging.

#### 2.1 Port Type Registry

| Task | Location | Details |
|------|----------|---------|
| Define port types | `packages/schemas/src/handles/types.ts` | PortType enum, color mapping, icons |
| Connection validation | `packages/schemas/src/handles/connections.ts` | `VALID_CONNECTIONS` matrix, `isValidConnection()` function |
| Typed handles | `apps/web/src/features/canvas/components/typed-handle.tsx` | Color-coded Handle component with tooltip showing type name |
| Node port declarations | `packages/schemas/src/nodes/*.ts` | Each node schema declares its input/output port types |
| Canvas integration | `apps/web/src/features/canvas/canvas.tsx` | Pass `isValidConnection` to `<ReactFlow>`, show invalid connection feedback |

#### 2.2 Wire Inspection

| Task | Location | Details |
|------|----------|---------|
| Edge data store | `apps/web/src/stores/wire-tap-store.ts` | Store last execution's data per edge (source output → target input) |
| Edge hover preview | `apps/web/src/features/canvas/edges/data-edge.tsx` | On hover, show tooltip with truncated payload preview |
| Edge click detail | `apps/web/src/features/canvas/wire-tap/edge-inspector.tsx` | Full JSON tree view of data that flowed through the edge |

#### 2.3 Node Detail Panel

| Task | Location | Details |
|------|----------|---------|
| Detail panel component | `apps/web/src/features/canvas/wire-tap/node-detail-panel.tsx` | Slide-out panel showing inputs, outputs, config, metrics |
| Document list view | `apps/web/src/features/canvas/wire-tap/document-list.tsx` | For retriever/reranker: show retrieved docs with scores, content preview, metadata |
| Score visualization | `apps/web/src/features/canvas/wire-tap/score-chart.tsx` | Bar chart of retrieval/reranking scores with relevance thresholds |
| LLM prompt inspector | `apps/web/src/features/canvas/wire-tap/prompt-inspector.tsx` | For LLM nodes: show full prompt (system + user + context), token breakdown, cost |
| Judge reasoning | `apps/web/src/features/canvas/wire-tap/judge-detail.tsx` | Show reasoning chain, confidence score, route taken |

#### 2.4 Execution Timeline

| Task | Location | Details |
|------|----------|---------|
| Timeline bar | `apps/web/src/features/canvas/components/execution-timeline.tsx` | Gantt chart at bottom of canvas showing per-node timing, total pipeline latency |
| Cost breakdown | Within timeline | Token usage and cost per node, highlighted most expensive nodes |

**Deliverable:** Typed ports prevent invalid connections. Users can inspect every wire and every node's internals. Timeline shows exactly where time and money are spent.

---

### Phase 3: Caching & Iteration (Makes It Fast)

**Goal:** Hash-based caching makes iteration near-instant. Node replay enables rapid prompt development.

#### 3.1 Hash-Based Execution Cache

| Task | Location | Details |
|------|----------|---------|
| Cache module | `packages/mastra-core/src/cache/execution-cache.ts` | `NodeExecutionCache` class: hash computation, cache storage, invalidation |
| Hash function | Same | Deterministic hash of node config + upstream outputs (use `object-hash` or `stable-stringify` + SHA-256) |
| Graph diff detection | Same | Walk backward from changed node, identify first changed node, invalidate all downstream |
| Integration with engine | `packages/mastra-core/src/compiler/graph-to-workflow.ts` | Before each step: check cache → skip or execute |
| Cache status UI | `apps/web/src/features/canvas/nodes/*.tsx` | Visual indicator: "cached" badge on nodes that were skipped |

#### 3.2 Node Replay

| Task | Location | Details |
|------|----------|---------|
| Replay action | `apps/web/src/features/canvas/components/node-toolbar.tsx` | "Replay" button in node toolbar — re-executes just this node with same inputs |
| Replay API endpoint | `apps/api/src/routes/runs.ts` | `POST /runs/:canvasId/replay/:nodeId` — fetches cached inputs, executes single node, returns result |
| Output comparison | `apps/web/src/features/canvas/wire-tap/replay-diff.tsx` | Side-by-side diff of previous vs new output after replay |

#### 3.3 Dynamic Ports

| Task | Location | Details |
|------|----------|---------|
| Dynamic handle rendering | `apps/web/src/features/canvas/nodes/*.tsx` | Nodes add/remove handles based on config (e.g., LLM node gains `tools` handle when function calling enabled) |
| Port declaration in node schema | `packages/schemas/src/nodes/*.ts` | `getPorts(config): { inputs: Port[], outputs: Port[] }` function per node type |

**Deliverable:** Changing a prompt and re-running skips all upstream nodes (embedding, retrieval). Node replay lets you iterate on a single node without touching the rest. Dynamic ports adapt to node configuration.

---

### Phase 4: Evaluation & Testing (Makes It Trustworthy)

**Goal:** Built-in evaluation makes pipeline quality measurable and comparable.

#### 4.1 Evaluation Nodes

| Task | Location | Details |
|------|----------|---------|
| Faithfulness evaluator | `packages/mastra-core/src/steps/eval-faithfulness.ts` | LLM-as-judge: is the answer grounded in context? Returns score + reasoning |
| Relevancy evaluator | `packages/mastra-core/src/steps/eval-relevancy.ts` | Is the answer relevant to the query? Score + reasoning |
| Context precision evaluator | `packages/mastra-core/src/steps/eval-context-precision.ts` | Are relevant documents ranked higher? Score + per-doc relevance |
| Evaluation node UI | `apps/web/src/features/canvas/nodes/eval-node.tsx` | New node type "Evaluator" with metric selector and score display |

#### 4.2 Run History & Comparison

| Task | Location | Details |
|------|----------|---------|
| Run persistence | `apps/api/src/routes/runs.ts` | Store complete run data: graph snapshot, query, all node outputs, all metrics, total cost |
| Run history UI | `apps/web/src/features/runs/run-history.tsx` | Chronological list of runs with status, metrics, cost, duration |
| Run detail page | `apps/web/src/features/runs/run-detail.tsx` | Full trace view — click to replay on canvas |
| Run comparison | `apps/web/src/features/runs/run-comparison.tsx` | Side-by-side comparison of two runs: metric deltas, output diffs, cost comparison |

#### 4.3 Variant Testing

| Task | Location | Details |
|------|----------|---------|
| Test dataset management | `apps/web/src/features/evaluation/test-datasets.tsx` | Upload/create test datasets (query + optional ground truth) |
| Batch execution | `apps/api/src/routes/runs.ts` | `POST /runs/:canvasId/batch` — run pipeline on entire test dataset |
| Baseline designation | `apps/web/src/features/evaluation/baseline.tsx` | Mark any run as "baseline" for comparison |
| Variant comparison UI | `apps/web/src/features/evaluation/variant-comparison.tsx` | Swap one node config, re-run on same dataset, compare aggregate metrics (Mean, P50, P90) |
| Regression detection | `apps/web/src/features/evaluation/regression.tsx` | Alert when metrics drop below baseline thresholds |

**Deliverable:** Users can measure pipeline quality with standard RAG metrics. Compare variants (different reranker, different prompt, different model) on the same test set. Detect regressions automatically.

---

### Phase 5: Production & Collaboration (Makes It Complete)

**Goal:** Real-time collaboration, production observability, and remote debugging.

#### 5.1 OpenTelemetry Integration

| Task | Location | Details |
|------|----------|---------|
| OTLP span emission | `apps/api/src/services/execution/tracer.ts` | Emit OpenInference spans for each node execution |
| Langfuse integration | `apps/api/src/services/execution/langfuse.ts` | Optional: route traces to self-hosted Langfuse |
| Trace viewer | `apps/web/src/features/observability/trace-viewer.tsx` | In-app trace explorer for aggregate analytics |

#### 5.2 Real-Time Collaboration

| Task | Location | Details |
|------|----------|---------|
| Yjs CRDT provider | `packages/realtime/src/yjs-provider.ts` | WebSocket + Yjs for canvas sync |
| Presence system | `packages/realtime/src/presence.ts` | Track who's online, cursor positions |
| Live cursors | `apps/web/src/features/collaboration/cursor-overlay.tsx` | Show collaborator cursors on canvas |
| Conflict resolution | `packages/realtime/src/conflict.ts` | CRDT-based automatic merge |

#### 5.3 Remote Debugging (Long-Term)

| Task | Location | Details |
|------|----------|---------|
| Debug endpoint | `apps/api/src/routes/debug.ts` | Deployed pipeline exposes WebSocket endpoint for live trace data |
| Canvas debug mode | `apps/web/src/features/canvas/modes/debug-mode.tsx` | Connect canvas to a running pipeline, see live execution |
| Production replay | `apps/web/src/features/observability/replay.tsx` | Replay a production run on the canvas for debugging |

#### 5.4 Ecosystem

| Task | Location | Details |
|------|----------|---------|
| Custom node SDK | `packages/node-sdk/` | TypeScript SDK for building custom nodes (declare ports, config schema, execute function) |
| Node registry | `apps/api/src/services/nodes/registry.ts` | Discover and load custom nodes from filesystem or npm |
| Export/Import | `apps/web/src/features/canvas/export.tsx` | Export canvas as JSON file (git-friendly), import from file or URL |

**Deliverable:** Teams collaborate in real-time. Deployed pipelines can be debugged remotely. Custom nodes extend the platform.

---

## 11. Sources & References

### Visual Programming Frameworks
- [React Flow / xyflow GitHub](https://github.com/xyflow/xyflow) — 31.8K stars, 2.94M npm downloads/week
- [React Flow Documentation](https://reactflow.dev/)
- [React Flow Performance Guide](https://reactflow.dev/learn/advanced-use/performance)
- [React Flow Computing Flows](https://reactflow.dev/learn/advanced-use/computing-flows)
- [React Flow Pro](https://reactflow.dev/pro)
- [Rete.js Official Site](https://retejs.org/) — 10.8K stars
- [Rete.js Dataflow Guide](https://retejs.org/docs/guides/processing/dataflow/)
- [Rete.js Hybrid Engine](https://retejs.org/examples/processing/hybrid-engine/)
- [Litegraph.js GitHub](https://github.com/jagenjo/litegraph.js) — 7.9K stars
- [Flume](https://flume.dev/) — 1.6K stars
- [BaklavaJS](https://baklava.tech/) — 2K stars
- [Pixi.js GitHub](https://github.com/pixijs/pixijs) — 44K+ stars
- [Canvas Engine Benchmarks](https://benchmarks.slaylines.io/)

### Competitive Landscape
- [ComfyUI GitHub](https://github.com/Comfy-Org/ComfyUI) — 75K+ stars
- [ComfyUI Technical Deep Dive](https://medium.com/@mucahitceylan/comfyui-a-technical-deep-dive-into-the-ultimate-stable-diffusion-workflow-engine-df1a7db3f7f5)
- [ComfyUI Nodes 2.0 Announcement](https://blog.comfy.org/p/comfyui-node-2-0)
- [Rivet GitHub](https://github.com/Ironclad/rivet) — 4.5K stars
- [Rivet Remote Debugging](https://rivet.ironcladapp.com/docs/user-guide/remote-debugging)
- [Langflow GitHub](https://github.com/langflow-ai/langflow) — 42K stars
- [Flowise GitHub](https://github.com/FlowiseAI/Flowise) — 32K stars
- [Dify GitHub](https://github.com/langgenius/dify) — 114K+ stars
- [Dify Architecture Analysis](https://www.oreateai.com/blog/analysis-of-difys-technical-architecture/)
- [Vellum Evaluations](https://www.vellum.ai/products/evaluation)
- [PromptFlow GitHub](https://github.com/microsoft/promptflow)
- [Relevance AI Review](https://skywork.ai/skypage/ko/Relevance%20AI%20In-Depth%20Review%20(2025))

### Execution Engines
- [Mastra Workflows Overview](https://mastra.ai/docs/workflows/overview)
- [Mastra vNext Announcement](https://mastra.ai/blog/vNext-workflows)
- [Mastra Workflow Streaming](https://mastra.ai/docs/streaming/workflow-streaming)
- [Mastra Suspend & Resume](https://mastra.ai/docs/workflows/suspend-and-resume)
- [Mastra Snapshots Reference](https://mastra.ai/reference/workflows/snapshots)
- [LangGraphJS GitHub](https://github.com/langchain-ai/langgraphjs)
- [LangGraph Checkpointing Architecture](https://deepwiki.com/langchain-ai/langgraph/4.1-checkpointing-architecture)
- [Inngest Documentation](https://www.inngest.com/docs)
- [Inngest Workflow Kit](https://github.com/inngest/workflow-kit)
- [Hatchet Documentation](https://docs.hatchet.run/home)
- [Temporal TypeScript SDK](https://docs.temporal.io/develop/typescript)
- [Haystack Pipelines](https://docs.haystack.deepset.ai/docs/pipelines)
- [LlamaIndex Workflows TS](https://developers.llamaindex.ai/typescript/workflows/)
- [DSPy GitHub](https://github.com/stanfordnlp/dspy)
- [Node-RED Architecture](https://github.com/node-red/node-red/wiki/Architecture-Overview)

### Observability & Tracing
- [Langfuse GitHub](https://github.com/langfuse/langfuse) — 19K+ stars, MIT license
- [Langfuse Data Model](https://langfuse.com/docs/observability/data-model)
- [Langfuse RAG Observability](https://langfuse.com/blog/2025-10-28-rag-observability-and-evals)
- [Arize Phoenix GitHub](https://github.com/Arize-ai/phoenix) — Elastic License 2.0
- [OpenInference Semantic Conventions](https://arize-ai.github.io/openinference/spec/semantic_conventions.html)
- [OpenInference Specification](https://arize-ai.github.io/openinference/spec/)
- [LangSmith Observability](https://www.langchain.com/langsmith/observability)
- [Helicone GitHub](https://github.com/Helicone/helicone) — MIT license
- [Braintrust](https://www.braintrust.dev/)
- [OpenLLMetry GitHub](https://github.com/traceloop/openllmetry) — Apache 2.0
- [OpenTelemetry LLM Observability](https://opentelemetry.io/blog/2024/llm-observability/)

### RAG Evaluation
- [Ragas Documentation](https://docs.ragas.io/en/stable/)
- [DeepEval RAG Evaluation](https://deepeval.com/guides/guides-rag-evaluation)
- [TruLens RAG Triad](https://www.trulens.org/getting_started/core_concepts/rag_triad/)
- [RAG Without the Lag (arXiv 2504.13587)](https://arxiv.org/abs/2504.13587)

### Architecture Inspiration
- [n8n GitHub](https://github.com/n8n-io/n8n) — Workflow automation, Vue Flow canvas
- [Node-RED 5.0 Roadmap](https://nodered.org/blog/2025/12/03/node-red-roadmap-to-5)
- [Vercel Workflow Builder Template](https://vercel.com/templates/next.js/workflow-builder)
- [Haystack Architecture (Canals)](https://www.zansara.dev/posts/2023-10-26-haystack-series-canals/)
