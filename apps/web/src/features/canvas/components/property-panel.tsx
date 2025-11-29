"use client";

import { useCanvasStore } from "@/stores/canvas-store";
import { X } from "lucide-react";

export const PropertyPanel = () => {
  const { selectedNodeId, nodes, setSelectedNodeId } = useCanvasStore();
  
  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  if (!selectedNode) {
    return (
      <div className="w-80 border-l border-[var(--border)] bg-[var(--background)] p-6 flex flex-col items-center justify-center text-center h-full">
        <div className="w-12 h-12 rounded-full bg-[var(--muted)] flex items-center justify-center mb-4">
          <div className="w-6 h-6 border-2 border-[var(--muted-foreground)] rounded-sm" />
        </div>
        <h3 className="font-medium text-[var(--foreground)]">No Selection</h3>
        <p className="text-sm text-[var(--muted-foreground)] mt-1">
          Select a node to configure its properties
        </p>
      </div>
    );
  }

  return (
    <div className="w-80 border-l border-[var(--border)] bg-[var(--background)] flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
        <div>
          <h2 className="font-semibold text-sm">{selectedNode.data.label}</h2>
          <p className="text-xs text-[var(--muted-foreground)] uppercase">{selectedNode.data.type}</p>
        </div>
        <button 
          onClick={() => setSelectedNodeId(null)}
          className="p-1 hover:bg-[var(--muted)] rounded-md transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Mock Configuration Fields */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-[var(--foreground)]">
            Name
          </label>
          <input 
            type="text" 
            defaultValue={selectedNode.data.label}
            className="w-full px-3 py-2 text-sm rounded-md border border-[var(--border)] bg-[var(--background)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-[var(--foreground)]">
            Description
          </label>
          <textarea 
            className="w-full px-3 py-2 text-sm rounded-md border border-[var(--border)] bg-[var(--background)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)] min-h-[80px]"
            placeholder="Describe what this step does..."
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-[var(--foreground)]">
            Model Configuration
          </label>
          <select className="w-full px-3 py-2 text-sm rounded-md border border-[var(--border)] bg-[var(--background)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]">
            <option>gpt-4-turbo</option>
            <option>gpt-3.5-turbo</option>
            <option>claude-3-opus</option>
            <option>claude-3-sonnet</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-[var(--foreground)]">
            Temperature
          </label>
          <div className="flex items-center gap-4">
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.1" 
              defaultValue="0.7"
              className="flex-1"
            />
            <span className="text-xs w-8 text-right font-mono">0.7</span>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-[var(--border)] bg-[var(--muted)]/30">
        <div className="flex items-center justify-between text-xs text-[var(--muted-foreground)]">
          <span>ID: {selectedNode.id}</span>
          <span>v1.0.0</span>
        </div>
      </div>
    </div>
  );
};
