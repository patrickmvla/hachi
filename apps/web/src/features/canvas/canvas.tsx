"use client";

import { useCallback, useRef, type DragEvent, type MouseEvent } from "react";
import { useState } from "react";
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  Panel,
  useReactFlow,
  ReactFlowProvider,
  reconnectEdge,
  type NodeTypes,
  type EdgeTypes,
  type Edge,
  type Connection,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { useCanvasStore } from "@/stores/canvas-store";
import { BaseNode } from "./nodes/base-node";
import { QueryNode } from "./nodes/query-node";
import { HyDENode } from "./nodes/hyde-node";
import { RetrieveNode } from "./nodes/retrieve-node";
import { GenerateNode } from "./nodes/generate-node";
import { EmbedNode } from "./nodes/embed-node";
import { RerankNode } from "./nodes/rerank-node";
import { JudgeNode } from "./nodes/judge-node";
import { AgentNode } from "./nodes/agent-node";
import { DataEdge } from "./edges/data-edge";
import { AnimatedEdge } from "./edges/animated-edge";
import { FloatingEdge } from "./edges/floating-edge";
import { BidirectionalEdge } from "./edges/bidirectional-edge";
import { EdgeMarkers } from "./edges/edge-markers";

import { NodePalette } from "./components/node-palette";
import { PropertyPanel } from "./components/property-panel";
import { getNodeDefaults } from "./config/node-defaults";
import { ExecutionBar } from "./components/execution-bar";
import { NodeSearch } from "./components/node-search";
import { ContextMenu, type ContextMenuState, initialContextMenuState } from "./components/context-menu";
import { WireTapPanel } from "./wire-tap/wire-tap-panel";
import { CursorOverlay } from "../collaboration/cursor-overlay";
import { PresenceAvatars } from "../collaboration/presence-avatars";
import {
  CollaborationProvider,
  useCanvasCollaboration,
} from "../collaboration/use-canvas-collaboration";
import { useCanvasShortcuts, useSelectionSync, useConnectionValidation } from "./hooks";

const nodeTypes: NodeTypes = {
  base: BaseNode,
  query: QueryNode,
  hyde: HyDENode,
  retriever: RetrieveNode,
  reranker: RerankNode,
  judge: JudgeNode,
  llm: GenerateNode,
  embedding: EmbedNode,
  agent: AgentNode,
};

const edgeTypes: EdgeTypes = {
  data: DataEdge,
  animated: AnimatedEdge,
  floating: FloatingEdge,
  bidirectional: BidirectionalEdge,
};

// Map store variant to React Flow BackgroundVariant
const variantMap = {
  dots: BackgroundVariant.Dots,
  lines: BackgroundVariant.Lines,
  cross: BackgroundVariant.Cross,
} as const;

const CanvasContent = ({ mode = "full", onOpenTemplatePicker }: { mode?: "full" | "demo"; onOpenTemplatePicker?: () => void }) => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition } = useReactFlow();
  const [contextMenu, setContextMenu] = useState<ContextMenuState>(initialContextMenuState);
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    setEdges,
    setSelectedNodeId,
    backgroundVariant,
    showBackground,
    reset,
    selectedNodeIds,
    selectedEdgeIds,
  } = useCanvasStore();

  const { cursors, users, updateCursor, isConnected } = useCanvasCollaboration();
  const { isValidConnection } = useConnectionValidation({ preventCycles: true });

  // Canvas hooks
  useCanvasShortcuts();
  useSelectionSync();

  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData("application/reactflow");
      const label = event.dataTransfer.getData("application/reactflow-label");

      if (typeof type === "undefined" || !type) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = {
        id: crypto.randomUUID(),
        type,
        position,
        data: {
          label: label || `${type} node`,
          type,
          config: { ...getNodeDefaults(type) },
        },
      };

      addNode(newNode);
    },
    [screenToFlowPosition, addNode]
  );

  // Track mouse movement for collaboration cursors
  const onMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!reactFlowWrapper.current || !isConnected) return;

      const rect = reactFlowWrapper.current.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      updateCursor({ x, y });
    },
    [isConnected, updateCursor]
  );

  const onMouseLeave = useCallback(() => {
    updateCursor(null);
  }, [updateCursor]);

  // Handle edge reconnection (dragging edge to new handle)
  const onReconnect = useCallback(
    (oldEdge: Edge, newConnection: Connection) => {
      setEdges(reconnectEdge(oldEdge, newConnection, edges));
    },
    [edges, setEdges]
  );

  // Context menu handlers
  const onNodeContextMenu = useCallback(
    (event: React.MouseEvent, node: { id: string }) => {
      event.preventDefault();
      setContextMenu({
        show: true,
        type: "node",
        id: node.id,
        position: { x: event.clientX, y: event.clientY },
      });
    },
    []
  );

  const onEdgeContextMenu = useCallback(
    (event: React.MouseEvent, edge: { id: string }) => {
      event.preventDefault();
      setContextMenu({
        show: true,
        type: "edge",
        id: edge.id,
        position: { x: event.clientX, y: event.clientY },
      });
    },
    []
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onPaneContextMenu = useCallback((event: any) => {
    event.preventDefault();
    setContextMenu({
      show: true,
      type: "pane",
      position: { x: event.clientX, y: event.clientY },
    });
  }, []);

  const closeContextMenu = useCallback(() => {
    setContextMenu(initialContextMenuState);
  }, []);

  return (
    <div className="flex flex-col h-full w-full">
      <ExecutionBar onOpenTemplatePicker={mode === "demo" ? onOpenTemplatePicker : undefined} />

      <div className="flex flex-1 overflow-hidden">
        {mode !== "demo" && <NodePalette />}

        <div
          className="flex-1 relative h-full"
          ref={reactFlowWrapper}
          onMouseMove={onMouseMove}
          onMouseLeave={onMouseLeave}
        >
          {/* Custom edge markers */}
          <EdgeMarkers />

          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onReconnect={onReconnect}
            isValidConnection={isValidConnection}
            edgesReconnectable
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            onDragOver={onDragOver}
            onDrop={onDrop}
            onNodeClick={(_, node) => {
              setSelectedNodeId(node.id);
              closeContextMenu();
            }}
            onPaneClick={() => {
              setSelectedNodeId(null);
              closeContextMenu();
            }}
            onNodeContextMenu={onNodeContextMenu}
            onEdgeContextMenu={onEdgeContextMenu}
            onPaneContextMenu={onPaneContextMenu}
            fitView
            colorMode="light"
            defaultEdgeOptions={{ type: "data", markerEnd: "url(#arrow)" }}
          >
            {/* Background with variant support */}
            {showBackground && (
              <Background
                variant={variantMap[backgroundVariant]}
                gap={20}
                size={1}
              />
            )}

            {/* MiniMap */}
            <MiniMap position="top-right" />

            {/* React Flow Controls */}
            <Controls />

            {/* Node Search */}
            <NodeSearch position="top-left" />

            {/* Wire Tap Panel */}
            <WireTapPanel />

            {/* Presence indicators */}
            {users.length > 0 && (
              <Panel position="top-right" className="!m-4">
                <PresenceAvatars users={users} />
              </Panel>
            )}
          </ReactFlow>

          {/* Cursor overlay */}
          <CursorOverlay cursors={cursors} />
        </div>

        <PropertyPanel />
      </div>

      {/* Context Menu */}
      {contextMenu.show && (
        <ContextMenu
          id={contextMenu.id}
          type={contextMenu.type}
          position={contextMenu.position}
          onClose={closeContextMenu}
        />
      )}
    </div>
  );
};

interface CanvasProps {
  canvasId?: string;
  user?: { id: string; name: string; email: string; avatarUrl?: string } | null;
  collaborationEnabled?: boolean;
  mode?: "full" | "demo";
  onOpenTemplatePicker?: () => void;
}

export const Canvas = ({
  canvasId = "default",
  user = null,
  collaborationEnabled = false,
  mode = "full",
  onOpenTemplatePicker,
}: CanvasProps) => {
  return (
    <ReactFlowProvider>
      <CollaborationProvider
        canvasId={canvasId}
        user={user}
        enabled={collaborationEnabled}
      >
        <CanvasContent mode={mode} onOpenTemplatePicker={onOpenTemplatePicker} />
      </CollaborationProvider>
    </ReactFlowProvider>
  );
};
