"use client";

import { useState } from "react";
import { Bug, Plug, Unplug, Loader2 } from "lucide-react";
import { Panel } from "@xyflow/react";
import { useDebugConnection } from "../hooks/use-debug-connection";

export const DebugMode = () => {
  const [url, setUrl] = useState("ws://localhost:4002");
  const [runId, setRunId] = useState("");
  const { isConnected, connectionError, connect, disconnect } = useDebugConnection();

  const handleConnect = () => {
    if (!runId.trim()) return;
    connect(url, runId.trim());
  };

  return (
    <Panel position="top-left" className="!ml-14 !mt-14">
      <div className="bg-white border border-black/[0.08] rounded-lg shadow-lg p-3 w-[280px]">
        <div className="flex items-center gap-2 mb-3">
          <Bug size={14} className="text-amber-600" />
          <span className="text-[12px] font-semibold text-black/70">Remote Debug</span>
          <span
            className={`ml-auto w-2 h-2 rounded-full ${
              isConnected ? "bg-green-500" : "bg-black/20"
            }`}
          />
        </div>

        {!isConnected ? (
          <div className="space-y-2">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="ws://localhost:4002"
              className="w-full px-2 py-1.5 text-[11px] rounded border border-black/10 bg-black/[0.02] focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <input
              type="text"
              value={runId}
              onChange={(e) => setRunId(e.target.value)}
              placeholder="Run ID to debug..."
              className="w-full px-2 py-1.5 text-[11px] rounded border border-black/10 bg-black/[0.02] focus:outline-none focus:ring-1 focus:ring-primary font-mono"
            />
            {connectionError && (
              <p className="text-[10px] text-red-500">{connectionError}</p>
            )}
            <button
              onClick={handleConnect}
              disabled={!runId.trim()}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200 rounded hover:bg-amber-100 disabled:opacity-40 transition-colors"
            >
              <Plug size={12} />
              Connect
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-[10px] text-green-600 font-medium">
              <Loader2 size={10} className="animate-spin" />
              Connected — streaming events
            </div>
            <p className="text-[10px] text-black/40 font-mono truncate">{runId}</p>
            <button
              onClick={disconnect}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 text-[11px] font-medium text-red-600 border border-red-200 rounded hover:bg-red-50 transition-colors"
            >
              <Unplug size={12} />
              Disconnect
            </button>
          </div>
        )}
      </div>
    </Panel>
  );
};
