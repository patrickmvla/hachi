"use client";

import { useCallback } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  type NodeTypes,
  type EdgeTypes,
} from "@xyflow/react";
import { usePlaygroundStore } from "../store/playground-store";
import { usePlaygroundConnection } from "../hooks/use-playground-connection";
import { usePlaygroundDnd } from "../hooks/use-playground-dnd";
import { PlaygroundNode } from "../nodes/playground-node";
import { PlaygroundEdge } from "../edges/playground-edge";
import { PlaygroundWireTap } from "./playground-wire-tap";

const playgroundNodeTypes: NodeTypes = {
  query: PlaygroundNode,
  hyde: PlaygroundNode,
  embedding: PlaygroundNode,
  retriever: PlaygroundNode,
  reranker: PlaygroundNode,
  judge: PlaygroundNode,
  llm: PlaygroundNode,
  agent: PlaygroundNode,
  base: PlaygroundNode,
};

const playgroundEdgeTypes: EdgeTypes = {
  default: PlaygroundEdge,
  data: PlaygroundEdge,
};

export function PlaygroundCanvas() {
  const nodes = usePlaygroundStore((s) => s.nodes);
  const edges = usePlaygroundStore((s) => s.edges);
  const onNodesChange = usePlaygroundStore((s) => s.onNodesChange);
  const onEdgesChange = usePlaygroundStore((s) => s.onEdgesChange);
  const setSelectedNodeId = usePlaygroundStore((s) => s.setSelectedNodeId);
  const setShowPropertyPanel = usePlaygroundStore((s) => s.setShowPropertyPanel);
  const { isValidConnection, onConnect } = usePlaygroundConnection();
  const { reactFlowWrapper, onDragOver, onDrop } = usePlaygroundDnd();

  const handleNodeClick = useCallback(
    (_: React.MouseEvent, node: { id: string }) => {
      setSelectedNodeId(node.id);
      setShowPropertyPanel(true);
    },
    [setSelectedNodeId, setShowPropertyPanel]
  );

  const handlePaneClick = useCallback(() => {
    setSelectedNodeId(null);
  }, [setSelectedNodeId]);

  return (
    <div ref={reactFlowWrapper} className="flex-1 h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        isValidConnection={isValidConnection}
        onNodeClick={handleNodeClick}
        onPaneClick={handlePaneClick}
        onDragOver={onDragOver}
        onDrop={onDrop}
        nodeTypes={playgroundNodeTypes}
        edgeTypes={playgroundEdgeTypes}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        deleteKeyCode={["Backspace", "Delete"]}
        proOptions={{ hideAttribution: true }}
      >
        <Background gap={16} size={1} />
        <Controls showInteractive={false} />
        <MiniMap
          zoomable
          pannable
          className="!bg-background !border-border"
        />
        <PlaygroundWireTap />
      </ReactFlow>
    </div>
  );
}
