"use client";

import { useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { ReactFlowProvider } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useTemplates } from "@/features/templates/hooks";
import type { Template } from "@/features/templates/api";
import { getNodeDefaults } from "@/features/canvas/config/node-defaults";
import {
  usePlaygroundStore,
  type PlaygroundNode,
  type PlaygroundEdge,
} from "./store/playground-store";
import { PlaygroundBanner } from "./components/playground-banner";
import { PlaygroundExecutionBar } from "./components/playground-execution-bar";
import { PlaygroundNodePalette } from "./components/playground-node-palette";
import { PlaygroundCanvas } from "./components/playground-canvas";
import { PlaygroundPropertyPanel } from "./components/playground-property-panel";
import { PlaygroundTemplatePicker } from "./components/playground-template-picker";

function PlaygroundInner() {
  const searchParams = useSearchParams();
  const { data: templates, isLoading } = useTemplates();
  const showTemplatePicker = usePlaygroundStore((s) => s.showTemplatePicker);
  const setShowTemplatePicker = usePlaygroundStore((s) => s.setShowTemplatePicker);
  const setNodes = usePlaygroundStore((s) => s.setNodes);
  const setEdges = usePlaygroundStore((s) => s.setEdges);
  const setTestQuery = usePlaygroundStore((s) => s.setTestQuery);
  const clearAllNodeStatuses = usePlaygroundStore((s) => s.clearAllNodeStatuses);
  const clearLog = usePlaygroundStore((s) => s.clearLog);

  const loadTemplate = useCallback(
    (template: Template) => {
      clearAllNodeStatuses();
      clearLog();
      const nodes = (template.graphJson.nodes as PlaygroundNode[]).map((node) => {
        const defaults = getNodeDefaults(node.data.type);
        return {
          ...node,
          data: {
            ...node.data,
            config: { ...defaults, ...node.data.config },
          },
        };
      });
      setNodes(nodes);
      setEdges(template.graphJson.edges as PlaygroundEdge[]);
      setTestQuery("");
      setShowTemplatePicker(false);
    },
    [setNodes, setEdges, setTestQuery, clearAllNodeStatuses, clearLog, setShowTemplatePicker]
  );

  // Load template from URL param once templates are fetched
  useEffect(() => {
    if (!templates) return;

    const templateId = searchParams.get("template");
    if (templateId) {
      const template = templates.find((t) => t.id === templateId);
      if (template) {
        loadTemplate(template);
        return;
      }
    }
    // No valid template param — show picker
    setShowTemplatePicker(true);
  }, [templates]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDismiss = useCallback(() => {
    setShowTemplatePicker(false);
  }, [setShowTemplatePicker]);

  return (
    <div className="h-screen w-screen flex flex-col">
      <PlaygroundBanner />
      <PlaygroundExecutionBar />
      <div className="flex flex-1 overflow-hidden">
        <PlaygroundNodePalette />
        <PlaygroundCanvas />
        <PlaygroundPropertyPanel />
      </div>
      {showTemplatePicker && templates && (
        <PlaygroundTemplatePicker
          templates={templates}
          onSelect={loadTemplate}
          onDismiss={handleDismiss}
        />
      )}
    </div>
  );
}

export function Playground() {
  return (
    <ReactFlowProvider>
      <PlaygroundInner />
    </ReactFlowProvider>
  );
}
