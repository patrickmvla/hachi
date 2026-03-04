import { create } from "zustand";

export interface TraceInfo {
  model?: string;
  provider?: string;
  tokenCount?: {
    prompt?: number;
    completion?: number;
    total?: number;
  };
  cost?: {
    input?: number;
    output?: number;
    total?: number;
  };
  dimensions?: number;
  documentCount?: number;
  finishReason?: string;
}

export interface ExecutionLogEntry {
  id: string;
  nodeId: string;
  nodeName: string;
  nodeType: string;
  status: "running" | "success" | "error";
  stepName: string;
  latencyMs: number;
  input: Record<string, unknown> | null;
  output: Record<string, unknown> | null;
  trace: TraceInfo | null;
  logMessages: string[];
  timestamp: number;
}

export interface RunTrace {
  totalLatencyMs: number;
  totalTokens: number;
  totalCost: number;
  stepCount: number;
}

interface ExecutionLogState {
  entries: ExecutionLogEntry[];
  currentNodeId: string | null;
  testQuery: string;
  selectedEntryId: string | null;
  runTrace: RunTrace | null;

  addEntry: (entry: ExecutionLogEntry) => void;
  updateEntry: (id: string, updates: Partial<ExecutionLogEntry>) => void;
  setCurrentNodeId: (nodeId: string | null) => void;
  setTestQuery: (query: string) => void;
  setSelectedEntryId: (id: string | null) => void;
  setRunTrace: (trace: RunTrace) => void;
  clear: () => void;
}

export const useExecutionLogStore = create<ExecutionLogState>((set, get) => ({
  entries: [],
  currentNodeId: null,
  testQuery: "",
  selectedEntryId: null,
  runTrace: null,

  addEntry: (entry) => {
    set({ entries: [...get().entries, entry] });
  },

  updateEntry: (id, updates) => {
    set({
      entries: get().entries.map((e) =>
        e.id === id ? { ...e, ...updates } : e
      ),
    });
  },

  setCurrentNodeId: (nodeId) => set({ currentNodeId: nodeId }),

  setTestQuery: (query) => set({ testQuery: query }),

  setSelectedEntryId: (id) => set({ selectedEntryId: id }),

  setRunTrace: (trace) => set({ runTrace: trace }),

  clear: () =>
    set({
      entries: [],
      currentNodeId: null,
      selectedEntryId: null,
      runTrace: null,
    }),
}));
