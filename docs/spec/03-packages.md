# Package Architecture

---

## 1. @hachi/database

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

## 2. @hachi/auth

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

## 3. @hachi/encryption

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

## 4. @hachi/schemas

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

## 5. @hachi/mastra-core

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

## 6. @hachi/realtime

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

## 7. @hachi/ui

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
