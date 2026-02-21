# State Management

---

## 1. Canvas Store (Zustand)

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

## 2. Execution Log Store (Zustand)

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

## 3. State Flow

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
