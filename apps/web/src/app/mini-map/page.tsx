"use client";

import Link from "next/link";
import { Canvas } from "@/features/canvas/canvas";
import { TemplatePicker } from "@/features/canvas/components/template-picker";
import { Map, X, ArrowLeft } from "lucide-react";
import { useState, useCallback } from "react";
import { useCanvasStore, type HachiNode, type HachiEdge } from "@/stores/canvas-store";
import { useExecutionLogStore } from "@/stores/execution-log-store";
import type { Template } from "@/features/canvas/components/template-loader";

function MiniMapInner() {
  const [showBanner, setShowBanner] = useState(true);
  const [showTemplatePicker, setShowTemplatePicker] = useState(true);
  const { setNodes, setEdges, clearAllNodeStatuses } = useCanvasStore();
  const { setTestQuery, clear: clearLog } = useExecutionLogStore();

  const pickerVisible = showTemplatePicker;

  const handleTemplateSelect = useCallback((template: Template) => {
    clearAllNodeStatuses();
    clearLog();
    setNodes(template.nodes as HachiNode[]);
    setEdges(template.edges as HachiEdge[]);
    setTestQuery(template.defaultQuery);
    setShowTemplatePicker(false);
  }, [setNodes, setEdges, setTestQuery, clearAllNodeStatuses, clearLog]);

  const handleDismiss = useCallback(() => {
    setShowTemplatePicker(false);
  }, []);

  const handleOpenPicker = useCallback(() => {
    setShowTemplatePicker(true);
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col">
      {showBanner && (
        <div className="bg-blue-500/10 border-b border-blue-500/20 px-4 py-2 flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-blue-600">
            <Link
              href="/"
              className="inline-flex items-center gap-1 hover:underline"
            >
              <ArrowLeft size={14} />
              Home
            </Link>
            <span className="text-blue-400">|</span>
            <Map size={16} />
            <span>
              <strong>Mini Map</strong> — Explore the platform interactively.{" "}
              <Link href="/signup" className="underline hover:no-underline">
                Create an account
              </Link>{" "}
              to build your own pipelines.
            </span>
          </div>
          <button
            onClick={() => setShowBanner(false)}
            className="p-1 hover:bg-blue-500/20 rounded text-blue-600"
            aria-label="Dismiss"
          >
            <X size={14} />
          </button>
        </div>
      )}
      <div className="flex-1 relative">
        <Canvas mode="demo" onOpenTemplatePicker={handleOpenPicker} />
        {pickerVisible && (
          <TemplatePicker onSelect={handleTemplateSelect} onDismiss={handleDismiss} />
        )}
      </div>
    </div>
  );
}

export default function MiniMapPage() {
  return <MiniMapInner />;
}
