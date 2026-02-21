import { create } from "zustand";

export interface ExecutionLogEntry {
  id: string;
  nodeId: string;
  nodeName: string;
  nodeType: string;
  status: "running" | "success" | "error";
  stepName: string;
  latencyMs: number;
  output: Record<string, unknown> | null;
  logMessages: string[];
  timestamp: number;
}

interface ExecutionLogState {
  entries: ExecutionLogEntry[];
  currentNodeId: string | null;
  testQuery: string;
  selectedEntryId: string | null;

  addEntry: (entry: ExecutionLogEntry) => void;
  updateEntry: (id: string, updates: Partial<ExecutionLogEntry>) => void;
  setCurrentNodeId: (nodeId: string | null) => void;
  setTestQuery: (query: string) => void;
  setSelectedEntryId: (id: string | null) => void;
  clear: () => void;
}

export const useExecutionLogStore = create<ExecutionLogState>((set, get) => ({
  entries: [],
  currentNodeId: null,
  testQuery: "",
  selectedEntryId: null,

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

  clear: () => set({ entries: [], currentNodeId: null, selectedEntryId: null }),
}));
