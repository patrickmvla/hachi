"use client";

import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Panel,
  type NodeTypes,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { useCanvasStore } from "@/stores/canvas-store";
import { BaseNode } from "./nodes/base-node";

const nodeTypes: NodeTypes = {
  base: BaseNode,
  hyde: BaseNode,
  retriever: BaseNode,
  reranker: BaseNode,
  judge: BaseNode,
  llm: BaseNode,
  embedding: BaseNode,
  agent: BaseNode,
};

export function Canvas() {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
  } = useCanvasStore();

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
      fitView
      className="bg-[var(--background)]"
    >
      <Background />
      <Controls />
      <MiniMap />
      <Panel position="top-left" className="flex gap-2">
        <div className="px-4 py-2 bg-[var(--muted)] rounded-lg text-sm font-medium">
          Hachi Canvas
        </div>
      </Panel>
    </ReactFlow>
  );
}
