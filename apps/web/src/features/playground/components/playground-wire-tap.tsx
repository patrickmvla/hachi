"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Clock, CheckCircle, Loader2 } from "lucide-react";
import { cn } from "@hachi/ui/lib/utils";
import { Panel } from "@xyflow/react";
import { usePlaygroundStore, type LogEntry } from "../store/playground-store";
import { nodeRegistry } from "../config/node-registry";

function LogEntryItem({
  entry,
  isSelected,
  onSelect,
}: {
  entry: LogEntry;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const registry = nodeRegistry[entry.nodeType];
  const Icon = registry?.icon;

  return (
    <button
      onClick={onSelect}
      className={cn(
        "w-full text-left px-3 py-2 border-b border-border/50 hover:bg-muted/50 transition-colors",
        isSelected && "bg-muted"
      )}
    >
      <div className="flex items-center gap-2">
        {entry.status === "loading" ? (
          <Loader2 size={12} className="animate-spin text-blue-500 shrink-0" />
        ) : entry.status === "success" ? (
          <CheckCircle size={12} className="text-green-500 shrink-0" />
        ) : (
          <Clock size={12} className="text-muted-foreground shrink-0" />
        )}
        <div className="flex items-center gap-1.5 min-w-0">
          {Icon && <Icon size={11} className={cn("shrink-0", registry.color)} />}
          <span className="text-xs font-medium truncate">{entry.stepName}</span>
        </div>
        {entry.latencyMs && (
          <span className="text-[10px] text-muted-foreground ml-auto shrink-0">
            {entry.latencyMs}ms
          </span>
        )}
      </div>
    </button>
  );
}

export function PlaygroundWireTap() {
  const logEntries = usePlaygroundStore((s) => s.logEntries);
  const selectedLogEntryId = usePlaygroundStore((s) => s.selectedLogEntryId);
  const setSelectedLogEntryId = usePlaygroundStore((s) => s.setSelectedLogEntryId);
  const [collapsed, setCollapsed] = useState(false);

  if (logEntries.length === 0) return null;

  const selectedEntry = logEntries.find((e) => e.id === selectedLogEntryId) ?? logEntries[logEntries.length - 1];

  return (
    <Panel position="bottom-right" className="!m-3">
      <div className="bg-background border border-border rounded-lg shadow-lg w-80 max-h-80 flex flex-col overflow-hidden">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-between px-3 py-2 border-b border-border hover:bg-muted/50 transition-colors"
        >
          <span className="text-xs font-semibold">Wire Tap</span>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-muted-foreground">
              {logEntries.filter((e) => e.status === "success").length}/{logEntries.length} steps
            </span>
            {collapsed ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </div>
        </button>

        {!collapsed && (
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Timeline */}
            <div className="overflow-y-auto max-h-32 border-b border-border">
              {logEntries.map((entry) => (
                <LogEntryItem
                  key={entry.id}
                  entry={entry}
                  isSelected={entry.id === (selectedLogEntryId ?? logEntries[logEntries.length - 1]?.id)}
                  onSelect={() => setSelectedLogEntryId(entry.id)}
                />
              ))}
            </div>

            {/* Detail view */}
            {selectedEntry && selectedEntry.output && (
              <div className="overflow-y-auto max-h-36 p-3">
                {selectedEntry.logMessages && selectedEntry.logMessages.length > 0 && (
                  <div className="mb-2">
                    {selectedEntry.logMessages.map((msg, i) => (
                      <p key={i} className="text-[10px] text-muted-foreground leading-relaxed">
                        {msg}
                      </p>
                    ))}
                  </div>
                )}
                <pre className="text-[10px] text-foreground bg-muted rounded p-2 overflow-x-auto">
                  {JSON.stringify(selectedEntry.output, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </Panel>
  );
}
