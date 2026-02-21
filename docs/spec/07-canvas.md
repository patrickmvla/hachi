# Canvas & Node System

---

## 1. React Flow Foundation

The canvas is built on React Flow (XYFlow) — the industry standard for node-based UIs in React. We chose it because:

- Engineers think in directed graphs when designing data pipelines
- Nodes and edges map directly to RAG components and data flow
- Built-in support for drag/drop, zoom, pan, selection, minimap
- Extensible: custom node types, custom edges, custom controls
- Active ecosystem with Yjs integration for real-time collaboration

## 2. Canvas Component (`canvas.tsx`)

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

## 3. Canvas Modes

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

## 4. Canvas Interactions

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

## 5. Node Architecture

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

## 6. Node Types Reference

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

## 7. Node Status Indicators

During execution, each node displays its current status:

| Status | Visual | Meaning |
|--------|--------|---------|
| `idle` | No indicator | Not yet executed |
| `loading` | Yellow spinner | Currently executing |
| `success` | Green checkmark | Completed successfully |
| `error` | Red X | Failed with error |

Status is managed via `canvasStore.setNodeStatus(nodeId, status)` and cleared with `clearAllNodeStatuses()` before each run.
