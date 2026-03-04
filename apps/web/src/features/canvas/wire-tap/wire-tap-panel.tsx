"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronRight, Activity, Clock, Code, Loader2, CheckCircle2, XCircle, Coins, Cpu, FileText } from "lucide-react";
import { Panel } from "@xyflow/react";
import { useExecutionLogStore, type ExecutionLogEntry, type TraceInfo } from "@/stores/execution-log-store";

const StatusIcon = ({ status }: { status: ExecutionLogEntry["status"] }) => {
  switch (status) {
    case "running":
      return <Loader2 size={12} className="animate-spin text-blue-500" />;
    case "success":
      return <CheckCircle2 size={12} className="text-green-500" />;
    case "error":
      return <XCircle size={12} className="text-red-500" />;
  }
};

const TraceBadge = ({ trace }: { trace: TraceInfo | null }) => {
  if (!trace) return null;

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {trace.model && (
        <span className="inline-flex items-center gap-0.5 px-1 py-0.5 bg-blue-50 text-blue-600 rounded text-[9px] font-mono">
          <Cpu size={8} />
          {trace.model}
        </span>
      )}
      {trace.tokenCount?.total && (
        <span className="text-[9px] text-black/40 font-mono">
          {trace.tokenCount.total.toLocaleString()} tok
        </span>
      )}
      {trace.cost?.total && (
        <span className="inline-flex items-center gap-0.5 text-[9px] text-amber-600 font-mono">
          <Coins size={8} />
          ${trace.cost.total.toFixed(6)}
        </span>
      )}
      {trace.documentCount !== undefined && trace.documentCount > 0 && (
        <span className="inline-flex items-center gap-0.5 text-[9px] text-black/40 font-mono">
          <FileText size={8} />
          {trace.documentCount}
        </span>
      )}
    </div>
  );
};

const TraceDetails = ({ trace }: { trace: TraceInfo }) => {
  return (
    <div className="space-y-1.5 p-2 bg-black/[0.02] rounded-md border border-black/[0.04]">
      <div className="text-[10px] font-semibold text-black/50 uppercase tracking-wider">Trace</div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px]">
        {trace.model && (
          <>
            <span className="text-black/40">Model</span>
            <span className="text-black/70 font-mono">{trace.model}</span>
          </>
        )}
        {trace.provider && (
          <>
            <span className="text-black/40">Provider</span>
            <span className="text-black/70">{trace.provider}</span>
          </>
        )}
        {trace.tokenCount && (
          <>
            <span className="text-black/40">Tokens</span>
            <span className="text-black/70 font-mono">
              {trace.tokenCount.prompt !== undefined && `${trace.tokenCount.prompt} in`}
              {trace.tokenCount.prompt !== undefined && trace.tokenCount.completion !== undefined && " / "}
              {trace.tokenCount.completion !== undefined && `${trace.tokenCount.completion} out`}
              {trace.tokenCount.total !== undefined &&
                trace.tokenCount.prompt === undefined &&
                `${trace.tokenCount.total} total`}
            </span>
          </>
        )}
        {trace.cost && (
          <>
            <span className="text-black/40">Cost</span>
            <span className="text-black/70 font-mono">
              ${trace.cost.total?.toFixed(6) || "0.000000"}
            </span>
          </>
        )}
        {trace.dimensions && (
          <>
            <span className="text-black/40">Dimensions</span>
            <span className="text-black/70 font-mono">{trace.dimensions}</span>
          </>
        )}
        {trace.documentCount !== undefined && trace.documentCount > 0 && (
          <>
            <span className="text-black/40">Documents</span>
            <span className="text-black/70 font-mono">{trace.documentCount}</span>
          </>
        )}
        {trace.finishReason && (
          <>
            <span className="text-black/40">Finish</span>
            <span className="text-black/70">{trace.finishReason}</span>
          </>
        )}
      </div>
    </div>
  );
};

export const WireTapPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"timeline" | "output">("timeline");
  const { entries, selectedEntryId, setSelectedEntryId, runTrace } = useExecutionLogStore();
  const timelineRef = useRef<HTMLDivElement>(null);

  // Auto-scroll timeline during execution
  useEffect(() => {
    if (timelineRef.current && activeTab === "timeline") {
      timelineRef.current.scrollTop = timelineRef.current.scrollHeight;
    }
  }, [entries, activeTab]);

  // Find selected entry for output tab
  const selectedEntry = selectedEntryId
    ? entries.find((e) => e.id === selectedEntryId)
    : entries.filter((e) => e.status === "success").at(-1);

  if (!isOpen) {
    return (
      <Panel position="bottom-right" className="!mr-0">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-1.5 px-2.5 py-2 bg-white border border-r-0 border-black/[0.08] rounded-l-lg text-[12px] font-medium text-black/50 hover:text-black/80 hover:bg-black/[0.02] transition-colors shadow-sm"
          aria-expanded="false"
          aria-label="Open Wire Tap panel"
        >
          <Activity size={13} aria-hidden="true" />
          <span className="[writing-mode:vertical-lr] rotate-180">Wire Tap</span>
        </button>
      </Panel>
    );
  }

  return (
    <Panel position="bottom-right" className="!mr-0">
      <div
        className="w-[360px] h-[400px] bg-white border border-r-0 border-black/[0.08] rounded-l-xl shadow-lg flex flex-col"
        role="region"
        aria-label="Wire Tap panel"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-3 h-9 border-b border-black/[0.06] shrink-0">
          <div className="flex items-center gap-2">
            <Activity size={13} className="text-black/40" aria-hidden="true" />
            <span className="text-[12px] font-semibold text-black/70">Wire Tap</span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-black/[0.04] rounded transition-colors"
            aria-expanded="true"
            aria-label="Close Wire Tap panel"
          >
            <ChevronRight size={13} className="text-black/30" aria-hidden="true" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-black/[0.06] shrink-0" role="tablist">
          <button
            onClick={() => setActiveTab("timeline")}
            className={`flex items-center gap-1.5 px-3 py-2 text-[11px] font-medium border-b-2 transition-colors ${
              activeTab === "timeline"
                ? "border-black text-black"
                : "border-transparent text-black/35 hover:text-black/60"
            }`}
            role="tab"
            aria-selected={activeTab === "timeline"}
          >
            <Clock size={12} aria-hidden="true" />
            Timeline
            {entries.length > 0 && (
              <span className="bg-black/[0.05] text-black/40 px-1.5 py-0.5 rounded-full text-[9px]">
                {entries.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("output")}
            className={`flex items-center gap-1.5 px-3 py-2 text-[11px] font-medium border-b-2 transition-colors ${
              activeTab === "output"
                ? "border-black text-black"
                : "border-transparent text-black/35 hover:text-black/60"
            }`}
            role="tab"
            aria-selected={activeTab === "output"}
          >
            <Code size={12} aria-hidden="true" />
            Output
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto" role="tabpanel">
          {activeTab === "timeline" ? (
            <div ref={timelineRef} className="p-2 space-y-1 overflow-auto h-full">
              {entries.length === 0 ? (
                <div className="flex items-center justify-center h-full text-[11px] text-black/30">
                  Run a workflow to see execution data
                </div>
              ) : (
                entries.map((entry) => (
                  <button
                    key={entry.id}
                    onClick={() => {
                      setSelectedEntryId(entry.id);
                      setActiveTab("output");
                    }}
                    className={`w-full text-left p-2 rounded-md border transition-colors ${
                      selectedEntryId === entry.id
                        ? "border-primary/30 bg-primary/5"
                        : "border-black/[0.04] hover:bg-black/[0.02]"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <StatusIcon status={entry.status} />
                        <span className="text-[11px] font-medium text-black/70">
                          {entry.nodeName}
                        </span>
                      </div>
                      <span className="text-[10px] text-black/30 font-mono">
                        {entry.latencyMs}ms
                      </span>
                    </div>
                    <TraceBadge trace={entry.trace} />
                    <div className="space-y-0.5 mt-1">
                      {entry.logMessages.map((msg, i) => (
                        <p key={i} className="text-[10px] text-black/40 leading-tight truncate">
                          {msg}
                        </p>
                      ))}
                    </div>
                  </button>
                ))
              )}
            </div>
          ) : (
            <div className="p-3 overflow-auto h-full space-y-3">
              {selectedEntry ? (
                <>
                  {/* Trace section */}
                  {selectedEntry.trace && Object.keys(selectedEntry.trace).length > 0 && (
                    <TraceDetails trace={selectedEntry.trace} />
                  )}

                  {/* Raw output */}
                  {selectedEntry.output && (
                    <div>
                      <div className="text-[10px] font-semibold text-black/50 uppercase tracking-wider mb-1">
                        Output
                      </div>
                      <pre className="font-mono text-[10px] text-black/60 leading-relaxed whitespace-pre-wrap bg-black/[0.02] p-2 rounded-md border border-black/[0.04]">
                        {JSON.stringify(selectedEntry.output, null, 2)}
                      </pre>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-[11px] text-black/30">
                  Run a workflow to see execution data
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom summary */}
        {runTrace && (
          <div className="border-t border-black/[0.06] px-3 py-2 shrink-0">
            <div className="flex items-center justify-between text-[10px] text-black/40 font-mono">
              <span>{runTrace.stepCount} steps</span>
              <div className="flex items-center gap-3">
                <span>{runTrace.totalLatencyMs}ms</span>
                {runTrace.totalTokens > 0 && (
                  <span>{runTrace.totalTokens.toLocaleString()} tok</span>
                )}
                {runTrace.totalCost > 0 && (
                  <span className="text-amber-600">
                    ${runTrace.totalCost.toFixed(4)}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Panel>
  );
};
