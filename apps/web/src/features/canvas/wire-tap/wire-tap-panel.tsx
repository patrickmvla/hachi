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
        className="absolute bottom-0 right-8 h-10 px-4 flex items-center gap-2 bg-[var(--background)] border-t border-x border-[var(--border)] rounded-t-lg text-sm font-medium hover:bg-[var(--muted)] transition-colors z-10"
      >
        <Activity size={16} className="text-[var(--primary)]" />
        Wire Tap
        <ChevronUp size={14} className="ml-2 text-[var(--muted-foreground)]" />
      </button>
    );
  }

  return (
    <div className="absolute bottom-0 right-8 w-[500px] h-[300px] bg-[var(--background)] border-t border-x border-[var(--border)] rounded-t-lg shadow-xl flex flex-col z-10">
      <div className="flex items-center justify-between px-4 h-10 border-b border-[var(--border)] bg-[var(--muted)]/30">
        <div className="flex items-center gap-2">
          <Activity size={16} className="text-[var(--primary)]" />
          <span className="text-sm font-medium">Wire Tap</span>
          <span className="text-xs text-[var(--muted-foreground)] ml-2">Step Output Inspection</span>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="p-1 hover:bg-[var(--muted)] rounded transition-colors"
        >
          <ChevronDown size={14} />
        </button>
      </div>

      <div className="flex border-b border-[var(--border)]">
        <button
          onClick={() => setActiveTab("json")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-medium border-b-2 transition-colors ${
            activeTab === "json"
              ? "border-[var(--primary)] text-[var(--foreground)]"
              : "border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
          }`}
        >
          <Code size={14} />
          JSON Output
        </button>
        <button
          onClick={() => setActiveTab("docs")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-medium border-b-2 transition-colors ${
            activeTab === "docs"
              ? "border-[var(--primary)] text-[var(--foreground)]"
              : "border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
          }`}
        >
          <FileText size={14} />
          Retrieved Documents
          <span className="bg-[var(--muted)] px-1.5 py-0.5 rounded-full text-[10px]">3</span>
        </button>
      </div>

      <div className="flex-1 overflow-auto p-4 bg-[var(--muted)]/10 font-mono text-xs">
        {activeTab === "json" ? (
          <pre className="text-[var(--foreground)]">
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
              <div key={i} className="p-3 bg-[var(--background)] border border-[var(--border)] rounded-md">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-[var(--primary)]">doc_{i}.md</span>
                  <span className="text-[var(--muted-foreground)]">Score: 0.8{9-i}</span>
                </div>
                <p className="text-[var(--muted-foreground)] line-clamp-2">
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
