# Frontend & Configuration

---

## 1. Page Structure

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

## 2. Layout Hierarchy

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

## 3. Providers (`providers.tsx`)

```typescript
// Wraps the entire app
<QueryClientProvider>      // TanStack React Query for API caching
  <ThemeProvider>           // next-themes for dark/light mode
    {children}
  </ThemeProvider>
</QueryClientProvider>
```

## 4. API Client (`lib/api.ts`)

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

## 5. Landing Page Sections

1. **Hero** — "Design, Execute, Debug RAG Architectures" + demo canvas
2. **Problem** — Three pain points: mediocre results, unclear patterns, no debugging
3. **Features** — Canvas, Wire Tap, Collaboration, Execution
4. **Advanced Nodes** — HyDE, Judge, Reranker, Fusion cards
5. **Templates** — Naive RAG, HyDE, CRAG, Hybrid Search previews
6. **CTA** — "Start building" + signup

## 6. Workspace-Level Configuration

Each workspace maintains its own:
- **LLM Provider** — Which API to use for generation (OpenAI, Anthropic, Google, Groq)
- **Embedding Model** — Which model generates vectors
- **Vector Store** — Where documents are stored and searched
- **API Keys** — Encrypted, scoped to workspace

## 7. Supported Providers

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

## 8. Node-Level Overrides

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
