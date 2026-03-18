"use client";

import { useState } from "react";
import { Eye, ArrowLeftRight, Timer, MessageSquare } from "lucide-react";
import { useExecutionLogStore } from "@/stores/execution-log-store";
import { useCanvasStore } from "@/stores/canvas-store";
import { DocumentResults } from "./document-results";
import { LlmInspector } from "./llm-inspector";
import { JudgeInspector } from "./judge-inspector";
import { RouterInspector } from "./router-inspector";
import { ExecutionIO } from "./execution-io";
import { ExecutionPerf } from "./execution-perf";
import { ExecutionPrompt } from "./execution-prompt";
import { JsonViewer } from "../../wire-tap/json-viewer";

interface ExecutionSubTabsProps {
  nodeId: string;
  nodeType: string;
}

const INSPECTOR_MAP: Record<string, "llm" | "documents" | "judge" | "router"> = {
  llm: "llm",
  generate: "llm",
  hyde: "llm",
  agent: "llm",
  queryRewriter: "llm",
  retriever: "documents",
  retrieve: "documents",
  reranker: "documents",
  rerank: "documents",
  fusion: "documents",
  webSearch: "documents",
  contextCompressor: "documents",
  contextOptimizer: "documents",
  judge: "judge",
  router: "router",
};

const LLM_FAMILY = new Set(["llm", "generate", "hyde", "agent", "queryRewriter"]);

type SubTab = "result" | "io" | "perf" | "prompt";

const PLACEHOLDER_ENTRY = {
  id: "",
  nodeId: "",
  nodeName: "",
  nodeType: "",
  status: "success" as const,
  stepName: "",
  latencyMs: 0,
  input: null,
  output: null,
  trace: { model: undefined, tokenCount: { prompt: 0, completion: 0, total: 0 }, cost: { input: 0, output: 0, total: 0 } },
  logMessages: [] as string[],
  timestamp: 0,
};

export const ExecutionSubTabs = ({ nodeId, nodeType }: ExecutionSubTabsProps) => {
  const [activeTab, setActiveTab] = useState<SubTab>("result");
  const entries = useExecutionLogStore((s) => s.entries);
  const entry = entries.find((e) => e.nodeId === nodeId && e.status !== "running");
  const nodeConfig = useCanvasStore((s) => s.nodes.find((n) => n.id === nodeId)?.data.config);
  const threshold = (nodeConfig?.similarityThreshold ?? nodeConfig?.confidenceThreshold) as number | undefined;

  const hasRun = !!entry;
  const displayEntry = entry ?? PLACEHOLDER_ENTRY;
  const inspectorType = INSPECTOR_MAP[nodeType];
  const isLlmFamily = LLM_FAMILY.has(nodeType);

  const tabs: { key: SubTab; label: string; icon: React.ElementType }[] = [
    { key: "result", label: "Result", icon: Eye },
    { key: "io", label: "I/O", icon: ArrowLeftRight },
    { key: "perf", label: "Perf", icon: Timer },
  ];

  if (isLlmFamily) {
    tabs.push({ key: "prompt", label: "Prompt", icon: MessageSquare });
  }

  const emptyMessage = (
    <div className="flex items-center justify-center py-8 text-xs text-muted-foreground">
      No execution data yet. Run the pipeline first.
    </div>
  );

  return (
    <div>
      {/* Sub-tab bar */}
      <div className="flex border-b border-border" role="tablist">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex-1 flex items-center justify-center gap-1 py-1.5 text-[10px] font-medium border-b-2 transition-colors ${
              activeTab === key
                ? "border-foreground text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
            role="tab"
            aria-selected={activeTab === key}
          >
            <Icon size={12} />
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "result" && (
        hasRun ? (
          <div className="p-4 space-y-4">
            {inspectorType === "llm" && <LlmInspector entry={displayEntry} />}
            {inspectorType === "documents" && <DocumentResults entry={displayEntry} threshold={threshold} />}
            {inspectorType === "judge" && <JudgeInspector entry={displayEntry} />}
            {inspectorType === "router" && <RouterInspector entry={displayEntry} />}
            {!inspectorType && displayEntry.output && <JsonViewer data={displayEntry.output} />}
          </div>
        ) : emptyMessage
      )}

      {activeTab === "io" && (
        hasRun ? <ExecutionIO entry={displayEntry} /> : emptyMessage
      )}

      {activeTab === "perf" && (
        <ExecutionPerf entry={displayEntry} allEntries={entries} nodeId={nodeId} />
      )}

      {activeTab === "prompt" && isLlmFamily && (
        <ExecutionPrompt
          entry={displayEntry}
          systemPrompt={nodeConfig?.systemPrompt as string | undefined}
        />
      )}
    </div>
  );
};
