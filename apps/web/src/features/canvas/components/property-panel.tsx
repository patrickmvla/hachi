"use client";

import { useCallback, useState } from "react";
import { useCanvasStore } from "@/stores/canvas-store";
import {
  X,
  Search,
  FileText,
  GitBranch,
  Database,
  ArrowRightLeft,
  Scale,
  Cpu,
  Bot,
  Box,
} from "lucide-react";
import { PanelSection } from "./property-panel/panel-section";
import { PanelField } from "./property-panel/panel-field";
import { CONFIG_PANELS } from "./property-panel/node-configs";
import { getNodeDefaults } from "../config/node-defaults";

const NODE_ICONS: Record<string, { icon: React.ElementType; color: string }> = {
  query: { icon: Search, color: "text-primary" },
  hyde: { icon: FileText, color: "text-blue-500" },
  embedding: { icon: GitBranch, color: "text-pink-500" },
  retriever: { icon: Database, color: "text-orange-500" },
  reranker: { icon: ArrowRightLeft, color: "text-yellow-500" },
  judge: { icon: Scale, color: "text-red-500" },
  llm: { icon: Cpu, color: "text-purple-500" },
  agent: { icon: Bot, color: "text-green-500" },
};

export const PropertyPanel = () => {
  const { selectedNodeId, nodes, edges, setSelectedNodeId, updateNodeData } =
    useCanvasStore();

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);
  const [nameValue, setNameValue] = useState("");
  const [descValue, setDescValue] = useState("");
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);

  // Sync local state when selection changes
  if (selectedNode && selectedNode.id !== activeNodeId) {
    setActiveNodeId(selectedNode.id);
    setNameValue(selectedNode.data.label);
    setDescValue((selectedNode.data as Record<string, unknown>).description as string ?? "");
  } else if (!selectedNode && activeNodeId) {
    setActiveNodeId(null);
  }

  const handleConfigUpdate = useCallback(
    (key: string, value: unknown) => {
      if (!selectedNode) return;
      const existing = selectedNode.data.config ?? {};
      updateNodeData(selectedNode.id, {
        config: { ...existing, [key]: value },
      });
    },
    [selectedNode, updateNodeData]
  );

  const handleNameBlur = useCallback(() => {
    if (!selectedNode || nameValue === selectedNode.data.label) return;
    updateNodeData(selectedNode.id, { label: nameValue });
  }, [selectedNode, nameValue, updateNodeData]);

  const handleDescBlur = useCallback(() => {
    if (!selectedNode) return;
    updateNodeData(selectedNode.id, {
      description: descValue,
    } as Record<string, unknown>);
  }, [selectedNode, descValue, updateNodeData]);

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

  const nodeType = selectedNode.data.type || "base";
  const iconEntry = NODE_ICONS[nodeType] ?? { icon: Box, color: "text-muted-foreground" };
  const IconComponent = iconEntry.icon;

  const config = selectedNode.data.config ?? getNodeDefaults(nodeType);
  const ConfigPanel = CONFIG_PANELS[nodeType];

  // Connection counts
  const incomingCount = edges.filter((e) => e.target === selectedNode.id).length;
  const outgoingCount = edges.filter((e) => e.source === selectedNode.id).length;

  return (
    <div className="w-80 border-l border-border bg-background flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2 min-w-0">
          <IconComponent size={16} className={iconEntry.color} />
          <div className="min-w-0">
            <h2 className="font-semibold text-sm truncate">{selectedNode.data.label}</h2>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
              {nodeType}
            </span>
          </div>
        </div>
        <button
          onClick={() => setSelectedNodeId(null)}
          className="p-1 hover:bg-muted rounded-md transition-colors shrink-0"
          aria-label="Close panel"
        >
          <X size={16} />
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto divide-y divide-border">
        {/* General section */}
        <PanelSection title="General" defaultOpen>
          <PanelField label="Name">
            <input
              type="text"
              className="w-full px-3 py-1.5 text-sm rounded-md border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
              value={nameValue}
              onChange={(e) => setNameValue(e.target.value)}
              onBlur={handleNameBlur}
              onKeyDown={(e) => {
                if (e.key === "Enter") e.currentTarget.blur();
              }}
            />
          </PanelField>
          <PanelField label="Description">
            <textarea
              className="w-full px-3 py-1.5 text-sm rounded-md border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary min-h-[60px] resize-y"
              value={descValue}
              placeholder="Describe what this step does..."
              onChange={(e) => setDescValue(e.target.value)}
              onBlur={handleDescBlur}
            />
          </PanelField>
        </PanelSection>

        {/* Configuration section */}
        {ConfigPanel && (
          <PanelSection title="Configuration" defaultOpen>
            {/* @ts-ignore -- QueryConfig takes no props, others take ConfigProps */}
            <ConfigPanel config={config} onUpdate={handleConfigUpdate} />
          </PanelSection>
        )}

        {/* Info section */}
        <PanelSection title="Info" defaultOpen={false}>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Node ID</span>
              <span className="font-mono text-foreground truncate ml-2 max-w-[140px]">
                {selectedNode.id.slice(0, 8)}...
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Type</span>
              <span className="font-mono text-foreground">{nodeType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Position</span>
              <span className="font-mono text-foreground">
                {Math.round(selectedNode.position.x)}, {Math.round(selectedNode.position.y)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Connections</span>
              <span className="text-foreground">
                {incomingCount} in, {outgoingCount} out
              </span>
            </div>
          </div>
        </PanelSection>
      </div>
    </div>
  );
};
