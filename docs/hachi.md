# Project Design Document: Hachi (ハチ)
**Visual Architecture Platform for Advanced RAG Systems**

---

## 1. Executive Summary

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

---

## 2. Target Users

### 2.1 Who Hachi Is For

**Experienced engineers and teams who:**
- Have already built naive RAG and hit its limitations
- Understand embeddings, vector search, and LLMs
- Need to implement advanced patterns but lack architectural clarity
- Want to collaborate on RAG architecture before writing production code

### 2.2 Who Hachi Is NOT For

- Beginners learning what RAG is
- No-code users building chatbots
- Teams looking for a production deployment platform

### 2.3 The Hachi User

```
Knows: Embeddings, vector DBs, LLMs, basic RAG
Struggles with: Why naive RAG fails, how to combine advanced patterns
Needs: Visual architecture tool to understand and design complex pipelines
```

---

## 3. Core Use Cases

### 3.1 Architecture Design

**Scenario:** A team needs to design a RAG system for legal document search. They know basic RAG won't handle ambiguous queries well.

**How Hachi helps:**
1. Team opens a shared canvas
2. Senior engineer drags in a HyDE node, explains the pattern
3. Team discusses: "Should we add a Judge node for self-correction?"
4. They wire up the architecture visually
5. Run it against sample queries, inspect Wire Taps
6. Iterate until the architecture handles edge cases
7. Team now has a clear blueprint to implement

### 3.2 Debugging Failures

**Scenario:** A team's RAG system retrieves irrelevant documents for short queries. They don't know why.

**How Hachi helps:**
1. Team recreates their current pipeline in Hachi
2. Run a failing query
3. Wire Tap the embedding step → "The query vector is too sparse"
4. Wire Tap the retrieval step → "Top results have low similarity scores"
5. Diagnosis: Short queries create poor embeddings
6. Solution: Add HyDE node to expand query
7. Test the fix, verify improvement via Wire Tap

### 3.3 Knowledge Sharing

**Scenario:** A senior engineer understands CRAG but needs to explain it to the team implementing it.

**How Hachi helps:**
1. Senior builds a CRAG pipeline on shared canvas
2. Team watches in real-time (live cursors)
3. Run a query that triggers the fallback path
4. Wire Tap shows the Judge's reasoning
5. Team sees exactly how CRAG routes to web search
6. Everyone now understands the pattern deeply

---

## 4. System Architecture

### 4.1 High-Level Stack
*   **Frontend:** Next.js 14 (App Router), React Flow (XYFlow), TailwindCSS, ShadcnUI
*   **State Management:** Zustand for local UI state, Yjs (CRDTs) for real-time collaboration
*   **Backend API:** Hono (lightweight, fast web framework)
*   **Database:** Supabase (PostgreSQL + pgvector), Drizzle ORM
*   **AI Engine:** Mastra (AI Framework)
*   **Infrastructure:** Docker, Server-Sent Events (SSE) for streaming

### 4.2 Monorepo Structure
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

---

## 5. The Visual Canvas

### 5.1 React Flow as the Core

The canvas is built on React Flow (XYFlow) because:
- Engineers think in graphs when designing data pipelines
- Nodes and edges map directly to RAG components
- Real-time collaboration fits naturally (Yjs integration)
- Execution state can be visualized (nodes light up, wires show data flow)

### 5.2 Canvas Capabilities

| Feature | Purpose |
|---------|---------|
| **Drag-and-drop nodes** | Build architectures quickly |
| **Typed connections** | Prevent invalid wiring (String→Vector blocked) |
| **Real-time sync** | Team sees changes instantly |
| **Execution visualization** | Nodes highlight as they run |
| **Wire Tap inspection** | Click any edge to see data |

### 5.3 Node Categories

**RAG Nodes** - Advanced retrieval patterns
**Agent Nodes** - Autonomous reasoning components
**Utility Nodes** - LLM calls, embeddings, basic I/O

---

## 6. Advanced RAG Nodes

These nodes encapsulate complex patterns from RAG research. Engineers can understand them by running and inspecting.

### 6.1 HyDE Node (Hypothetical Document Embeddings)

**Problem it solves:** Short/ambiguous queries produce poor embeddings

**How it works:**
1. LLM generates a hypothetical answer to the query
2. The hypothetical answer is embedded (not the query)
3. That embedding searches the vector database

**Wire Tap reveals:**
- The hypothetical document generated
- How it differs from the original query
- Why retrieval results improve

**When to use:** Queries are short, ambiguous, or lack domain vocabulary

### 6.2 Parent-Child Retriever Node

**Problem it solves:** Small chunks match well but lack context; large chunks have context but match poorly

**How it works:**
- Documents split into parent chunks (1024 tokens) and child chunks (128 tokens)
- Search runs against child embeddings for precision
- Returns parent chunk for context

**Wire Tap reveals:**
- Which child chunk triggered the match
- The full parent context returned
- Precision vs context tradeoff in action

**When to use:** Need both precise matching and sufficient context for LLM

### 6.3 Fusion & Re-ranking Node

**Problem it solves:** Vector search misses keyword matches; keyword search misses semantic matches

**How it works:**
1. Parallel execution: BM25 keyword search + vector search
2. Reciprocal Rank Fusion merges both result lists
3. Cross-encoder reranks final candidates

**Wire Tap reveals:**
- Results from each search method
- How RRF merges rankings
- Cross-encoder relevance scores

**When to use:** Documents contain important keywords that semantic search misses

### 6.4 Judge Node (CRAG - Corrective RAG)

**Problem it solves:** Retrieved context is sometimes irrelevant, leading to hallucination

**How it works:**
- LLM evaluates: "Is this context relevant to the query?"
- Routes to fallback (web search) if context is irrelevant
- Passes through if context is good

**Wire Tap reveals:**
- The Judge's reasoning
- RELEVANT vs IRRELEVANT decision
- Which path execution took

**When to use:** Need robust retrieval with fallback for edge cases

---

## 7. Agentic Nodes

For teams exploring agentic RAG architectures.

### 7.1 Agent Node
- Implements ReAct (Reasoning + Acting) pattern
- Configurable: model, system prompt, tools, max iterations
- Wire Tap shows thought process and tool calls

### 7.2 Tool Node
- External capabilities: Web Search, Code Executor, HTTP, Database Query
- Wire Tap shows inputs/outputs

### 7.3 Loop Node
- Conditional iteration for refinement
- Wire Tap shows each iteration's state

### 7.4 Reflection Node
- Self-critique and improvement
- Wire Tap shows critique reasoning

---

## 8. The Wire Tap

The most important feature for engineering understanding.

### 8.1 What It Is

Click any connection between nodes to inspect the exact data flowing through:
- Input to the downstream node
- Output from the upstream node
- Transformation that occurred

### 8.2 Why Engineers Need This

| Without Wire Tap | With Wire Tap |
|------------------|---------------|
| "Retrieval is bad" | "The embedding has low magnitude for short queries" |
| "Reranking doesn't help" | "Cross-encoder scores are all below 0.3" |
| "The LLM hallucinates" | "Context passed to LLM is actually irrelevant" |

### 8.3 Implementation

- Backend caches every step output in Redis with `run_id`
- Frontend fetches cached data on edge click
- Shows JSON diff view: input vs output
- Supports large payloads (pagination for document arrays)

---

## 9. Real-Time Collaboration

### 9.1 Technical Foundation

- **Yjs** for conflict-free real-time sync (CRDTs)
- **WebSocket** connection for live updates
- **Presence** showing who's online and where they're working

### 9.2 Collaboration Features

| Feature | Engineering Value |
|---------|-------------------|
| **Live cursors** | See where teammates are working |
| **Instant sync** | Changes appear immediately |
| **Shared execution** | Everyone sees the same run results |
| **Shared Wire Tap** | Discuss data together in real-time |

### 9.3 Collaboration Scenarios

**Architecture Review:**
- Lead architect builds, team observes
- Team asks questions, architect demonstrates via Wire Tap

**Pair Debugging:**
- Two engineers diagnose a failing query together
- One runs, one inspects Wire Taps

**Design Session:**
- Team builds architecture together
- Discuss tradeoffs as they wire nodes

---

## 10. Reference Architectures

Pre-built pipelines representing production-grade RAG patterns. Engineers can load, run, inspect, and modify.

### 10.1 Available Architectures

| Architecture | Pattern | Key Insight |
|--------------|---------|-------------|
| **Naive RAG** | Basic retrieve + generate | Baseline for comparison |
| **HyDE Pipeline** | Query expansion via hallucination | Solves semantic gap |
| **Parent-Child** | Precision retrieval with context | Chunking strategy |
| **Hybrid Search** | BM25 + Vector + RRF + Reranker | Multi-signal retrieval |
| **CRAG Pipeline** | Self-correcting with fallback | Robust retrieval |
| **Multi-Hop RAG** | Iterative retrieval | Complex questions |
| **Agentic RAG** | Agent with retrieval tool | Autonomous retrieval |

### 10.2 How to Use Reference Architectures

1. Load architecture from library
2. Run against sample queries
3. Inspect Wire Taps to understand each step
4. Modify nodes to experiment
5. Compare results before/after changes
6. Use as blueprint for production implementation

---

## 11. Execution Engine

### 11.1 Graph-to-Mastra Compilation

Hachi compiles visual graphs to executable Mastra workflows:

1. **Serialize:** Canvas state → JSON graph
2. **Validate:** Zod schemas verify node configurations
3. **Sort:** Topological sort determines execution order
4. **Hydrate:** Map nodes to Mastra Steps/Tools/Agents
5. **Execute:** Run with SSE streaming

### 11.2 Why Real Execution Matters

- **Not a simulation** - Actual LLM calls, actual embeddings
- **Real data** - Engineers use their own documents
- **Real failures** - See exactly where and why things break
- **Real latency** - Understand performance characteristics

---

## 12. Technical Considerations

### 12.1 Type Safety

Strict typing prevents invalid architectures:
- Handle types: String (blue), Vector (purple), Document (green), JSON (orange)
- Invalid connections blocked with explanation
- Zod schemas validate node configurations

### 12.2 Streaming

Real-time feedback during execution:
- Nodes highlight as they start/complete
- Results stream progressively
- Wire Tap data available immediately after step completes

### 12.3 Error Handling

Errors provide engineering insight:
- Token overflow shows count and limit
- Type mismatches explain the incompatibility
- API failures show response details

---

## 13. Data Model

### 13.1 Core Entities

```sql
-- Workspaces for team collaboration
CREATE TABLE workspaces (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Canvases (saved architectures)
CREATE TABLE canvases (
  id UUID PRIMARY KEY,
  workspace_id UUID REFERENCES workspaces(id),
  name TEXT NOT NULL,
  graph_json JSONB NOT NULL,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Execution runs
CREATE TABLE runs (
  id UUID PRIMARY KEY,
  canvas_id UUID REFERENCES canvases(id),
  input JSONB,
  status TEXT,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
);

-- Step outputs (for Wire Tap)
CREATE TABLE step_outputs (
  id UUID PRIMARY KEY,
  run_id UUID REFERENCES runs(id),
  node_id TEXT NOT NULL,
  input JSONB,
  output JSONB,
  latency_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Documents for RAG testing
CREATE TABLE documents (
  id UUID PRIMARY KEY,
  workspace_id UUID REFERENCES workspaces(id),
  content TEXT NOT NULL,
  metadata JSONB,
  embedding VECTOR(1536),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 14. Future Considerations

Potential additions after core platform is validated:

- **Export to Code** - Generate Mastra/LangChain implementation from canvas
- **Architecture Templates** - More reference architectures from the community
- **Custom Nodes** - Engineers create reusable nodes for their patterns
- **Comparison Mode** - Run two architectures side-by-side on same query
- **Performance Profiling** - Detailed latency breakdown per node

---

## 15. Mastra Integration

### 15.1 What is Mastra?

**Mastra** is a TypeScript-first AI framework that Hachi uses as its execution engine. It provides:
- **Workflows** - Graph-based state machines for orchestrating AI operations
- **Steps** - Typed building blocks with input/output schema validation
- **RAG Pipeline** - Document processing, embedding, and retrieval
- **Unified Vector Store API** - Same interface across different providers

### 15.2 Why Mastra?

| Capability | How Hachi Uses It |
|------------|-------------------|
| **Workflow orchestration** | Canvas graphs compile to Mastra workflows |
| **Step schemas** | Node inputs/outputs validate via Zod |
| **RAG primitives** | Chunking, embedding, retrieval built-in |
| **Vector store abstraction** | Support multiple DBs without code changes |
| **Human-in-the-loop** | Pause execution for user review (Wire Tap) |

### 15.3 Graph-to-Mastra Compilation

When a user clicks "Run" on the canvas:

```
Canvas JSON → Topological Sort → Mastra Workflow
     ↓              ↓                  ↓
  Nodes/Edges   Execution Order    Steps chained with .then()/.parallel()
```

**Example compilation:**

```typescript
// Canvas has: Query → HyDE → Retriever → Generator
const workflow = new Workflow({ name: 'rag-pipeline' })
  .then(queryStep)
  .then(hydeStep)
  .then(retrieverStep)
  .then(generatorStep)
  .commit();
```

### 15.4 Supported Vector Stores

Mastra provides a unified API across all stores:

| Provider | Best For | Setup Complexity |
|----------|----------|------------------|
| **pgvector** | Teams already on PostgreSQL/Supabase | Low (use existing DB) |
| **Pinecone** | Managed, scalable cloud solution | Low (SaaS) |
| **Qdrant** | Self-hosted, high performance | Medium |
| **MongoDB Atlas** | Teams using MongoDB ecosystem | Low |

All stores use MongoDB-style query syntax for metadata filtering:
```typescript
// Same query works on any provider
const results = await vectorStore.query({
  vector: embedding,
  topK: 10,
  filter: { "metadata.source": { $eq: "legal-docs" } }
});
```

---

## 16. Configuration & Credentials

### 16.1 Workspace Settings

Each workspace maintains its own configuration for:
- **LLM Providers** - API keys for OpenAI, Anthropic, etc.
- **Vector Store** - Connection to team's vector database
- **Embedding Model** - Which model generates embeddings

### 16.2 Credential Management

**Security principles:**
- API keys encrypted at rest (AES-256)
- Keys never sent to frontend (backend-only)
- Scoped to workspace (team isolation)
- Audit log for key usage

**Database schema:**

```sql
CREATE TABLE workspace_credentials (
  id UUID PRIMARY KEY,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,        -- 'openai', 'anthropic', 'pinecone', etc.
  credential_type TEXT NOT NULL, -- 'api_key', 'connection_string'
  encrypted_value TEXT NOT NULL, -- AES-256 encrypted
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(workspace_id, provider, credential_type)
);
```

### 16.3 Supported Providers

**LLM Providers:**
| Provider | Models | Required Credential |
|----------|--------|---------------------|
| OpenAI | GPT-4o, GPT-4o-mini | `OPENAI_API_KEY` |
| Anthropic | Claude 3.5 Sonnet, Claude 3 Opus | `ANTHROPIC_API_KEY` |
| Google | Gemini 1.5 Pro | `GOOGLE_API_KEY` |
| Groq | Llama 3, Mixtral | `GROQ_API_KEY` |

**Vector Stores:**
| Provider | Required Credentials |
|----------|---------------------|
| pgvector (Supabase) | `DATABASE_URL` |
| Pinecone | `PINECONE_API_KEY`, `PINECONE_INDEX` |
| Qdrant | `QDRANT_URL`, `QDRANT_API_KEY` (if cloud) |
| MongoDB Atlas | `MONGODB_URI` |

**Embedding Models:**
| Provider | Model | Dimensions |
|----------|-------|------------|
| OpenAI | text-embedding-3-small | 1536 |
| OpenAI | text-embedding-3-large | 3072 |
| Cohere | embed-english-v3.0 | 1024 |

### 16.4 Configuration UI

**Workspace Settings Panel:**
```
┌─────────────────────────────────────────────────────┐
│ Workspace Settings                              [×] │
├─────────────────────────────────────────────────────┤
│                                                     │
│ LLM Provider                                        │
│ ┌─────────────────────────────────────────────────┐ │
│ │ OpenAI                                      [▼] │ │
│ └─────────────────────────────────────────────────┘ │
│ API Key                                             │
│ ┌─────────────────────────────────────────────────┐ │
│ │ sk-••••••••••••••••••••••••••••••••    [Test]  │ │
│ └─────────────────────────────────────────────────┘ │
│ ✓ Connected successfully                            │
│                                                     │
│ ─────────────────────────────────────────────────── │
│                                                     │
│ Vector Store                                        │
│ ┌─────────────────────────────────────────────────┐ │
│ │ Supabase (pgvector)                         [▼] │ │
│ └─────────────────────────────────────────────────┘ │
│ Connection String                                   │
│ ┌─────────────────────────────────────────────────┐ │
│ │ postgresql://...                       [Test]   │ │
│ └─────────────────────────────────────────────────┘ │
│ ✓ 3 collections found                               │
│                                                     │
│                              [Cancel]  [Save]       │
└─────────────────────────────────────────────────────┘
```

### 16.5 Node-Level Overrides

Individual nodes can override workspace defaults:

```
┌────────────────────────────────┐
│ HyDE Node Config               │
├────────────────────────────────┤
│ Model                          │
│ [Workspace Default (GPT-4o) ▼] │
│                                │
│ ☐ Override with custom model   │
│   └─ [Claude 3.5 Sonnet    ▼]  │
│                                │
│ Temperature: [0.7        ]     │
│ Max Tokens:  [500        ]     │
└────────────────────────────────┘
```

---

## 17. Onboarding Flow

### 17.1 New User Journey

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  Sign Up ──→ Create/Join ──→ Configure ──→ First ──→ Learn  │
│              Workspace       Credentials   Canvas    Patterns│
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### 17.2 Step 1: Authentication

**Options:**
- Email/password (basic)
- OAuth: GitHub, Google (recommended for teams)

```
┌─────────────────────────────────────┐
│           Welcome to Hachi          │
│                                     │
│   Design RAG architectures that     │
│   actually work.                    │
│                                     │
│   ┌─────────────────────────────┐   │
│   │  Continue with GitHub       │   │
│   └─────────────────────────────┘   │
│   ┌─────────────────────────────┐   │
│   │  Continue with Google       │   │
│   └─────────────────────────────┘   │
│                                     │
│   ──────────── or ────────────      │
│                                     │
│   Email                             │
│   ┌─────────────────────────────┐   │
│   │                             │   │
│   └─────────────────────────────┘   │
│                                     │
│   ┌─────────────────────────────┐   │
│   │     Continue with Email     │   │
│   └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

### 17.3 Step 2: Workspace Setup

**First-time users choose:**

```
┌────────────────────────────────────────────────────────┐
│                  Get Started                           │
│                                                        │
│  ┌────────────────────┐  ┌────────────────────┐       │
│  │                    │  │                    │       │
│  │   Create New       │  │   Join Existing    │       │
│  │   Workspace        │  │   Workspace        │       │
│  │                    │  │                    │       │
│  │   Start fresh      │  │   Got an invite?   │       │
│  │   with your team   │  │   Enter code here  │       │
│  │                    │  │                    │       │
│  └────────────────────┘  └────────────────────┘       │
│                                                        │
└────────────────────────────────────────────────────────┘
```

**Creating a workspace:**
```
┌────────────────────────────────────────────┐
│  Create Workspace                          │
│                                            │
│  Workspace Name                            │
│  ┌────────────────────────────────────┐    │
│  │ Acme AI Team                       │    │
│  └────────────────────────────────────┘    │
│                                            │
│  What are you building?                    │
│  ┌────────────────────────────────────┐    │
│  │ ◉ Internal knowledge base         │    │
│  │ ○ Customer support bot            │    │
│  │ ○ Document search                 │    │
│  │ ○ Research assistant              │    │
│  │ ○ Other                           │    │
│  └────────────────────────────────────┘    │
│                                            │
│             [Create Workspace]             │
└────────────────────────────────────────────┘
```

### 17.4 Step 3: Configure Credentials

**Guided setup with validation:**

```
┌──────────────────────────────────────────────────────┐
│  Connect Your AI Services               Step 1 of 2  │
│                                                      │
│  Hachi needs API access to run your RAG pipelines.   │
│                                                      │
│  LLM Provider                                        │
│  ┌──────────────────────────────────────────────┐    │
│  │  [OpenAI logo]  OpenAI                   ✓   │    │
│  │  [Anthropic]    Anthropic                    │    │
│  │  [Google]       Google AI                    │    │
│  └──────────────────────────────────────────────┘    │
│                                                      │
│  OpenAI API Key                                      │
│  ┌──────────────────────────────────────────────┐    │
│  │ sk-proj-xxxxxxxxxxxxx                        │    │
│  └──────────────────────────────────────────────┘    │
│  ⓘ Get your key at platform.openai.com              │
│                                                      │
│  [Testing connection...]  ✓ Valid - GPT-4o access    │
│                                                      │
│                    [Skip for now]  [Continue →]      │
└──────────────────────────────────────────────────────┘
```

### 17.5 Step 4: First Canvas Experience

**Interactive tutorial with a pre-loaded template:**

```
┌─────────────────────────────────────────────────────────────────┐
│  Quick Start: Your First RAG Pipeline               [Skip Tour] │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  We've loaded a simple Naive RAG pipeline.                      │
│  Let's run it and see how Wire Tap works!                       │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                                                         │    │
│  │   [Query]────→[Embed]────→[Retrieve]────→[Generate]     │    │
│  │      │           │            │              │          │    │
│  │      ▼           ▼            ▼              ▼          │    │
│  │   "What is     Vector     Top 3 docs    Final answer    │    │
│  │    RAG?"       [0.12..]   returned      generated       │    │
│  │                                                         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│     ┌─────────────────────────────────────────────────────┐     │
│  1. │ Type a query and click Run                     [1/4]│     │
│     └─────────────────────────────────────────────────────┘     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 17.6 Step 5: Explore Reference Architectures

After the tutorial, users are guided to:

```
┌──────────────────────────────────────────────────────────┐
│  Ready to explore advanced patterns?                     │
│                                                          │
│  Your Naive RAG works, but production needs more.        │
│  Try these patterns to see the difference:               │
│                                                          │
│  ┌────────────────┐ ┌────────────────┐ ┌────────────────┐│
│  │     HyDE       │ │   Hybrid       │ │     CRAG       ││
│  │                │ │   Search       │ │                ││
│  │ Better for     │ │ Better for     │ │ Better for     ││
│  │ short queries  │ │ keyword+semantic│ │ reliability   ││
│  │                │ │                │ │                ││
│  │  [Try It →]    │ │  [Try It →]    │ │  [Try It →]    ││
│  └────────────────┘ └────────────────┘ └────────────────┘│
│                                                          │
│                    [Go to Dashboard]                     │
└──────────────────────────────────────────────────────────┘
```

---

## 18. Wire Tap Interface

### 18.1 Core Concept

Wire Tap is the **debugging interface** that lets engineers inspect data flowing between nodes. It's the primary tool for understanding *why* a RAG pipeline behaves the way it does.

### 18.2 Activation

**Two ways to open Wire Tap:**
1. **Click an edge** - See data flowing through that connection
2. **Click a node** - See all inputs/outputs for that node

### 18.3 Edge Wire Tap View

```
┌─────────────────────────────────────────────────────────────────┐
│ Wire Tap: Embed → Retrieve                              [×]     │
├─────────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────┐   ┌─────────────────────────┐       │
│ │ OUTPUT from Embed       │ → │ INPUT to Retrieve       │       │
│ └─────────────────────────┘   └─────────────────────────┘       │
│                                                                 │
│ ┌───────────────────────────────────────────────────────────┐   │
│ │ {                                                         │   │
│ │   "vector": [0.0123, -0.0456, 0.0789, ...],  // 1536 dims │   │
│ │   "model": "text-embedding-3-small",                      │   │
│ │   "tokens_used": 12                                       │   │
│ │ }                                                         │   │
│ └───────────────────────────────────────────────────────────┘   │
│                                                                 │
│ Stats                                                           │
│ ├─ Latency: 145ms                                               │
│ ├─ Data size: 12.4 KB                                           │
│ └─ Vector magnitude: 0.847 (⚠️ low for short queries)           │
│                                                                 │
│ [Copy JSON]  [Download]  [Compare with Previous Run]            │
└─────────────────────────────────────────────────────────────────┘
```

### 18.4 Node Wire Tap View (Full Inspection)

```
┌─────────────────────────────────────────────────────────────────────┐
│ Wire Tap: HyDE Node                                         [×]     │
├─────────────────────────────────────────────────────────────────────┤
│  [Input]    [Output]    [Config]    [Logs]                          │
│  ─────────────────────────────────────────                          │
│                                                                     │
│ ┌─ Input ───────────────────────────────────────────────────────┐   │
│ │ {                                                             │   │
│ │   "query": "What is RAG?"                                     │   │
│ │ }                                                             │   │
│ └───────────────────────────────────────────────────────────────┘   │
│                                                                     │
│ ┌─ Output ──────────────────────────────────────────────────────┐   │
│ │ {                                                             │   │
│ │   "hypothetical_document": "RAG (Retrieval-Augmented          │   │
│ │     Generation) is an AI framework that enhances large        │   │
│ │     language model responses by first retrieving relevant     │   │
│ │     documents from a knowledge base, then using that          │   │
│ │     context to generate more accurate, grounded answers.      │   │
│ │     Unlike pure LLMs that rely solely on training data,       │   │
│ │     RAG systems can access up-to-date information and         │   │
│ │     cite specific sources...",                                │   │
│ │   "original_query": "What is RAG?",                           │   │
│ │   "expansion_factor": 15.2  // 15x more context               │   │
│ │ }                                                             │   │
│ └───────────────────────────────────────────────────────────────┘   │
│                                                                     │
│ ⓘ Insight: Query expanded from 3 tokens to 47 tokens.               │
│   This helps embedding capture more semantic meaning.               │
│                                                                     │
│ Latency: 823ms  |  Tokens: 12 in → 47 out  |  Model: GPT-4o        │
└─────────────────────────────────────────────────────────────────────┘
```

### 18.5 Specialized Views by Node Type

**Retriever Node - Document Results:**
```
┌─────────────────────────────────────────────────────────────────┐
│ Wire Tap: Retriever                                     [×]     │
├─────────────────────────────────────────────────────────────────┤
│ Retrieved 5 documents (showing top 3)                           │
│                                                                 │
│ ┌─ #1 ─────────────────────────────────────────────────────┐    │
│ │ Score: 0.89  │  Source: technical-docs/rag-overview.md   │    │
│ ├──────────────────────────────────────────────────────────┤    │
│ │ "Retrieval-Augmented Generation combines the power of    │    │
│ │ large language models with external knowledge retrieval. │    │
│ │ The key insight is that LLMs can produce more accurate   │    │
│ │ responses when provided with relevant context..."        │    │
│ └──────────────────────────────────────────────────────────┘    │
│                                                                 │
│ ┌─ #2 ─────────────────────────────────────────────────────┐    │
│ │ Score: 0.76  │  Source: blog/why-rag-matters.md          │    │
│ ├──────────────────────────────────────────────────────────┤    │
│ │ "Traditional chatbots hallucinate because they only      │    │
│ │ know what was in their training data. RAG solves this    │    │
│ │ by retrieving real documents at query time..."           │    │
│ └──────────────────────────────────────────────────────────┘    │
│                                                                 │
│ ⚠️ Warning: Score drop between #1 (0.89) and #2 (0.76)          │
│    Consider reducing topK or adding a score threshold.          │
│                                                                 │
│ [View All 5]  [Export Results]  [Explain Scores]                │
└─────────────────────────────────────────────────────────────────┘
```

**Judge Node (CRAG) - Decision View:**
```
┌─────────────────────────────────────────────────────────────────┐
│ Wire Tap: Judge (CRAG)                                  [×]     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│                    ┌──────────────┐                             │
│                    │   RELEVANT   │  ← Decision                 │
│                    │    ✓ Pass    │                             │
│                    └──────────────┘                             │
│                                                                 │
│ ┌─ Reasoning ───────────────────────────────────────────────┐   │
│ │ "The retrieved documents directly address the query       │   │
│ │ about RAG systems. Document #1 provides a technical       │   │
│ │ definition, and Document #2 explains the motivation.      │   │
│ │ Both are highly relevant to answering 'What is RAG?'      │   │
│ │                                                           │   │
│ │ Confidence: 0.94                                          │   │
│ │ Decision: RELEVANT - proceed to generation"               │   │
│ └───────────────────────────────────────────────────────────┘   │
│                                                                 │
│ Route taken: Context → Generator (not Web Search fallback)      │
│                                                                 │
│ [View Alternative Path]  [Test with Different Context]          │
└─────────────────────────────────────────────────────────────────┘
```

### 18.6 Run History & Comparison

```
┌─────────────────────────────────────────────────────────────────┐
│ Run History                                             [×]     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ ┌─ Current Run ────────────────────────────────────────────┐    │
│ │ Run #47  •  2 min ago  •  "What is RAG?"  •  1.2s        │    │
│ └──────────────────────────────────────────────────────────┘    │
│                                                                 │
│ Previous runs:                                                  │
│ ┌──────────────────────────────────────────────────────────┐    │
│ │ ○ Run #46  •  5 min ago  •  "Explain embeddings"  •  1.8s│    │
│ │ ○ Run #45  •  12 min ago •  "What is RAG?"  •  2.1s      │    │
│ │ ● Run #44  •  15 min ago •  "What is RAG?"  •  0.9s      │    │
│ └──────────────────────────────────────────────────────────┘    │
│                                                                 │
│         [Compare #47 vs #44]  ← Same query, different runs      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 18.7 Implementation Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      Wire Tap Data Flow                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Execution Engine                    Frontend                   │
│  ┌─────────────┐                    ┌─────────────┐             │
│  │ Mastra Step │──step_output──────→│ SSE Stream  │             │
│  │  executes   │                    │  listener   │             │
│  └─────────────┘                    └──────┬──────┘             │
│         │                                  │                    │
│         ▼                                  ▼                    │
│  ┌─────────────┐                    ┌─────────────┐             │
│  │ step_outputs│                    │ Zustand     │             │
│  │   table     │◀──on click────────│ Canvas Store│             │
│  │ (PostgreSQL)│                    │             │             │
│  └─────────────┘                    └──────┬──────┘             │
│                                            │                    │
│                                            ▼                    │
│                                     ┌─────────────┐             │
│                                     │ Wire Tap    │             │
│                                     │  Panel UI   │             │
│                                     └─────────────┘             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 19. Collaboration & Permissions

### 19.1 Permission Model

Hachi uses a **workspace-based RBAC** (Role-Based Access Control) model:

```
Workspace
├── Owner (1 per workspace)
├── Admins (manage members, settings)
├── Editors (create/edit canvases)
└── Viewers (read-only access)
```

### 19.2 Role Capabilities

| Capability | Owner | Admin | Editor | Viewer |
|------------|-------|-------|--------|--------|
| View canvases | ✓ | ✓ | ✓ | ✓ |
| Run pipelines | ✓ | ✓ | ✓ | ✓ |
| View Wire Tap | ✓ | ✓ | ✓ | ✓ |
| Create/edit canvases | ✓ | ✓ | ✓ | ✗ |
| Delete canvases | ✓ | ✓ | ✓ (own) | ✗ |
| Upload documents | ✓ | ✓ | ✓ | ✗ |
| Manage credentials | ✓ | ✓ | ✗ | ✗ |
| Invite members | ✓ | ✓ | ✗ | ✗ |
| Change member roles | ✓ | ✓ | ✗ | ✗ |
| Delete workspace | ✓ | ✗ | ✗ | ✗ |
| Transfer ownership | ✓ | ✗ | ✗ | ✗ |

### 19.3 Invitation Flow

```
┌────────────────────────────────────────────────────────┐
│ Invite Team Members                            [×]     │
├────────────────────────────────────────────────────────┤
│                                                        │
│ Email addresses (one per line)                         │
│ ┌────────────────────────────────────────────────────┐ │
│ │ alice@acme.com                                     │ │
│ │ bob@acme.com                                       │ │
│ │                                                    │ │
│ └────────────────────────────────────────────────────┘ │
│                                                        │
│ Role                                                   │
│ ┌────────────────────────────────────────────────────┐ │
│ │ Editor                                         [▼] │ │
│ └────────────────────────────────────────────────────┘ │
│ Can create, edit, and run pipelines                    │
│                                                        │
│ ── Or share invite link ──                             │
│                                                        │
│ ┌────────────────────────────────────────────────────┐ │
│ │ https://hachi.dev/invite/abc123...         [Copy]  │ │
│ └────────────────────────────────────────────────────┘ │
│ Link expires in 7 days                                 │
│                                                        │
│                           [Cancel]  [Send Invites]     │
└────────────────────────────────────────────────────────┘
```

### 19.4 Real-Time Presence

**Live collaboration features:**

```
┌─────────────────────────────────────────────────────────────────┐
│ Canvas: Legal RAG Pipeline                                      │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │                                     Online: 👤 👤 👤 (3)     │ │
│ │                                     Alice (editing)          │ │
│ │  ┌─────┐      ┌─────┐      ┌─────┐  Bob (viewing)           │ │
│ │  │Query│─────→│HyDE │─────→│Retr.│  You                     │ │
│ │  └─────┘      └──┬──┘      └─────┘                          │ │
│ │                  │                                           │ │
│ │              [Alice]  ← Live cursor                          │ │
│ │                  │                                           │ │
│ │              👤 Alice is editing HyDE node                   │ │
│ │                                                              │ │
│ └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

**Presence indicators:**
- **Colored cursors** - Each user has a unique color
- **Selection highlights** - See what nodes others have selected
- **Activity status** - "Alice is editing HyDE node"
- **Follow mode** - Click avatar to follow their view

### 19.5 Conflict Resolution

Yjs CRDTs handle concurrent edits automatically:

| Scenario | Resolution |
|----------|------------|
| Two users move same node | Last position wins (instant sync) |
| Two users edit same config | Field-level merge (both changes apply) |
| User A deletes node User B is editing | Node deleted, B sees notification |
| Simultaneous edge creation | Both edges created |

**Edge case handling:**
```
┌────────────────────────────────────────────┐
│ ⚠️ Node Deleted                            │
│                                            │
│ The "HyDE" node you were editing was       │
│ deleted by Alice.                          │
│                                            │
│ [Undo Delete]  [Dismiss]                   │
└────────────────────────────────────────────┘
```

### 19.6 Canvas-Level Permissions (Future)

For teams that need finer control:

```
┌────────────────────────────────────────────────────────┐
│ Canvas Settings: Production RAG v2             [×]     │
├────────────────────────────────────────────────────────┤
│                                                        │
│ Access Control                                         │
│ ○ Inherit from workspace (Editors can edit)            │
│ ● Custom permissions                                   │
│                                                        │
│ ┌────────────────────────────────────────────────────┐ │
│ │ Alice (Owner)                           [Owner ▼]  │ │
│ │ Bob                                     [Editor▼]  │ │
│ │ Carol                                   [Viewer▼]  │ │
│ │ + Add people...                                    │ │
│ └────────────────────────────────────────────────────┘ │
│                                                        │
│ ☑ Lock canvas (prevent all edits)                      │
│ ☐ Require approval for changes                         │
│                                                        │
│                              [Cancel]  [Save]          │
└────────────────────────────────────────────────────────┘
```
