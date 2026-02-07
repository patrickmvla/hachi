"use client";

import { useCanvasStore } from "@/stores/canvas-store";
import { X } from "lucide-react";

export const PropertyPanel = () => {
  const { selectedNodeId, nodes, setSelectedNodeId } = useCanvasStore();

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  if (!selectedNode) {
    return (
      <div className="w-80 border-l border-border bg-background p-6 flex flex-col items-center justify-center text-center h-full">
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
          <div className="w-6 h-6 border-2 border-muted-foreground rounded-sm" />
        </div>
        <h3 className="font-medium text-foreground">No Selection</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Select a node to configure its properties
        </p>
      </div>
    );
  }

  return (
    <div className="w-80 border-l border-border bg-background flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div>
          <h2 className="font-semibold text-sm">{selectedNode.data.label}</h2>
          <p className="text-xs text-muted-foreground uppercase">{selectedNode.data.type}</p>
        </div>
        <button
          onClick={() => setSelectedNodeId(null)}
          className="p-1 hover:bg-muted rounded-md transition-colors"
          aria-label="Close panel"
        >
          <X size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Mock Configuration Fields */}
        <div className="space-y-2">
          <label htmlFor="node-name" className="text-xs font-medium text-foreground">
            Name
          </label>
          <input
            id="node-name"
            type="text"
            defaultValue={selectedNode.data.label}
            className="w-full px-3 py-2 text-sm rounded-md border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="node-description" className="text-xs font-medium text-foreground">
            Description
          </label>
          <textarea
            id="node-description"
            className="w-full px-3 py-2 text-sm rounded-md border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary min-h-[80px]"
            placeholder="Describe what this step does..."
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="model-config" className="text-xs font-medium text-foreground">
            Model Configuration
          </label>
          <select
            id="model-config"
            className="w-full px-3 py-2 text-sm rounded-md border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option>gpt-4-turbo</option>
            <option>gpt-3.5-turbo</option>
            <option>claude-3-opus</option>
            <option>claude-3-sonnet</option>
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="temperature" className="text-xs font-medium text-foreground">
            Temperature
          </label>
          <div className="flex items-center gap-4">
            <input
              id="temperature"
              type="range"
              min="0"
              max="1"
              step="0.1"
              defaultValue="0.7"
              className="flex-1"
              aria-label="Temperature slider"
            />
            <span className="text-xs w-8 text-right font-mono">0.7</span>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-border bg-muted/30">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>ID: {selectedNode.id}</span>
          <span>v1.0.0</span>
        </div>
      </div>
    </div>
  );
};
