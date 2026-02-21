# Execution Engine

---

## 1. Overview

The execution engine converts a visual canvas graph into a runnable pipeline. There are two execution paths:

1. **Mock execution** (current) — Frontend-only simulation with realistic delays and mock data. Used for development and demos.
2. **Real execution** (production) — Backend compiles graph to Mastra workflow, executes with real LLM/embedding/search calls, streams results via SSE.

## 2. Mock Execution (`use-mock-execution.ts`)

```typescript
async function executeWorkflow(query: string) {
  // 1. Clear previous state
  clearAllNodeStatuses();
  executionLogStore.clear();
  setIsRunning(true);

  // 2. Get execution order (topological sort)
  const order = canvasStore.getExecutionOrder();

  // 3. Execute each node sequentially
  for (const node of order) {
    setNodeStatus(node.id, "loading");

    // Get mock output based on node type
    const mockOutput = getMockOutput(node.data.type, query);

    addLogEntry({
      nodeId: node.id,
      nodeName: node.data.label,
      nodeType: node.data.type,
      status: "running",
    });

    // Simulate processing time
    await sleep(mockOutput.latencyMs);

    setNodeStatus(node.id, "success");
    updateLogEntry(node.id, { output: mockOutput, status: "success" });
  }

  setIsRunning(false);
}
```

**Mock data latencies (realistic):**
```
query:     200ms
hyde:      1200ms
embedding: 350ms
retriever: 450ms
reranker:  600ms
judge:     800ms
agent:     900ms
llm:       1500ms
```

## 3. Real Execution (`runner.ts`)

The backend execution flow:

```typescript
// 1. Validate canvas
const validation = validateCanvas(canvas.graphJson);
if (!validation.valid) throw new Error(validation.errors);

// 2. Create execution plan
const plan = createExecutionPlan(canvas.graphJson);
// Returns: [{ nodeId, nodeType, config, inputMapping }]

// 3. Create run record
const run = await db.insert(runs).values({
  canvasId: canvas.id,
  triggeredBy: user.id,
  input: { query },
  status: "running",
  startedAt: new Date(),
});

// 4. Stream execution via SSE
const stream = new ReadableStream({
  async start(controller) {
    emit(controller, "run_started", { runId: run.id });

    let previousOutput = { query };

    for (const step of plan) {
      emit(controller, "step_started", { nodeId: step.nodeId });

      const startTime = Date.now();

      // Get step executor (Mastra step)
      const executor = getStepExecutor(step.nodeType, step.config);

      // Map previous output to this step's input
      const input = mapStepOutputToInput(previousOutput, step.inputMapping);

      // Execute step
      const output = await executor.execute({ context: input });

      const latencyMs = Date.now() - startTime;

      // Store for Wire Tap
      await db.insert(stepOutputs).values({
        runId: run.id,
        nodeId: step.nodeId,
        input,
        output,
        latencyMs,
      });

      emit(controller, "step_completed", { nodeId: step.nodeId, output, latencyMs });

      previousOutput = output;
    }

    await db.update(runs).set({ status: "completed", completedAt: new Date() });
    emit(controller, "run_completed", { runId: run.id });
  },
});
```

## 4. Graph Compilation

**Step 1: Validation**
```
- All node types are recognized
- All connections are between compatible handle types
- No cycles in the graph
- All required node configs are present
- At least one Query node exists
```

**Step 2: Topological Sort**
```
DFS-based traversal:
1. Find all root nodes (no incoming edges) — usually the Query node
2. Visit each root, traverse outgoing edges
3. Mark visited nodes, detect back-edges (cycles)
4. Return nodes in reverse post-order (upstream before downstream)
```

**Step 3: Step Instantiation**
```
For each node in execution order:
1. Look up node type → Mastra step factory
2. Pass node config to factory: createHyDEStep({ model: "gpt-4o", temperature: 0.7 })
3. Store step with its input mapping (which fields from previous output)
```

**Step 4: Input Mapping**
```
Each step's input comes from the previous step's output:
- Query → HyDE: { query: prev.query }
- HyDE → Embed: { text: prev.hypotheticalDocuments[0] }
- Embed → Retrieve: { vector: prev.vector }
- Retrieve → Generate: { query: firstInput.query, context: prev.documents }
```

## 5. Supported Execution Patterns

| Pattern | Node Sequence | Notes |
|---------|--------------|-------|
| **Naive RAG** | Query → Embed → Retrieve → Generate | Baseline |
| **HyDE** | Query → HyDE → Embed → Retrieve → Generate | Query expansion |
| **CRAG** | Query → Embed → Retrieve → Judge → Generate | With fallback |
| **Hybrid** | Query → (BM25 + Vector) → Fusion → Rerank → Generate | Multi-signal |
| **Agentic** | Query → Agent (with Retrieve tool) → Generate | Autonomous |
