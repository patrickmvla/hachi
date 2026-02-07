"use client";

import { useState } from "react";
import { ChevronUp, ChevronDown, Activity, Code, FileText } from "lucide-react";

export const WireTapPanel = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<"json" | "docs">("json");

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="absolute bottom-0 right-8 h-10 px-4 flex items-center gap-2 bg-background border-t border-x border-border rounded-t-lg text-sm font-medium hover:bg-muted transition-colors z-10"
        aria-expanded="false"
        aria-label="Open Wire Tap panel"
      >
        <Activity size={16} className="text-primary" aria-hidden="true" />
        Wire Tap
        <ChevronUp size={14} className="ml-2 text-muted-foreground" aria-hidden="true" />
      </button>
    );
  }

  return (
    <div className="absolute bottom-0 right-8 w-[500px] h-[300px] bg-background border-t border-x border-border rounded-t-lg shadow-xl flex flex-col z-10" role="region" aria-label="Wire Tap panel">
      <div className="flex items-center justify-between px-4 h-10 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <Activity size={16} className="text-primary" aria-hidden="true" />
          <span className="text-sm font-medium">Wire Tap</span>
          <span className="text-xs text-muted-foreground ml-2">Step Output Inspection</span>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="p-1 hover:bg-muted rounded transition-colors"
          aria-expanded="true"
          aria-label="Close Wire Tap panel"
        >
          <ChevronDown size={14} aria-hidden="true" />
        </button>
      </div>

      <div className="flex border-b border-border" role="tablist">
        <button
          onClick={() => setActiveTab("json")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-medium border-b-2 transition-colors ${
            activeTab === "json"
              ? "border-primary text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
          role="tab"
          aria-selected={activeTab === "json"}
          aria-controls="json-panel"
        >
          <Code size={14} aria-hidden="true" />
          JSON Output
        </button>
        <button
          onClick={() => setActiveTab("docs")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-medium border-b-2 transition-colors ${
            activeTab === "docs"
              ? "border-primary text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
          role="tab"
          aria-selected={activeTab === "docs"}
          aria-controls="docs-panel"
        >
          <FileText size={14} aria-hidden="true" />
          Retrieved Documents
          <span className="bg-muted px-1.5 py-0.5 rounded-full text-[10px]">3</span>
        </button>
      </div>

      <div className="flex-1 overflow-auto p-4 bg-muted/10 font-mono text-xs" role="tabpanel" id={activeTab === "json" ? "json-panel" : "docs-panel"}>
        {activeTab === "json" ? (
          <pre className="text-foreground">
{`{
  "step": "generate",
  "status": "success",
  "latency_ms": 1240,
  "output": {
    "text": "Based on the retrieved documents, the Hachi platform is designed to be a comprehensive agentic coding assistant...",
    "usage": {
      "prompt_tokens": 450,
      "completion_tokens": 120,
      "total_tokens": 570
    }
  }
}`}
          </pre>
        ) : (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-3 bg-background border border-border rounded-md">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-primary">doc_{i}.md</span>
                  <span className="text-muted-foreground">Score: 0.8{9-i}</span>
                </div>
                <p className="text-muted-foreground line-clamp-2">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
