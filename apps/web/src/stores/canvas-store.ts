import { create } from "zustand";
import {
  type Node,
  type Edge,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  getIncomers,
  getOutgoers,
  getConnectedEdges,
} from "@xyflow/react";

export type NodeStatus = "initial" | "loading" | "success" | "error";

export type HachiNode = Node<{
  label: string;
  type: string;
  config?: Record<string, unknown>;
  status?: NodeStatus;
  statusMessage?: string;
}>;

export type EdgePathStyle = "bezier" | "smoothstep" | "straight" | "simplebezier";

export type HachiEdge = Edge<{
  dataType?: "string" | "vector" | "document" | "json";
  pathStyle?: EdgePathStyle;
  animated?: boolean;
}>;

export type BackgroundVariant = "dots" | "lines" | "cross";

// Clipboard type for copy/paste
interface Clipboard {
  nodes: HachiNode[];
  edges: HachiEdge[];
}

// History entry for undo/redo
interface HistoryEntry {
  nodes: HachiNode[];
  edges: HachiEdge[];
}

interface CanvasState {
  nodes: HachiNode[];
  edges: HachiEdge[];
  selectedNodeId: string | null;
  selectedNodeIds: string[];
  selectedEdgeIds: string[];
  isRunning: boolean;
  runId: string | null;
  backgroundVariant: BackgroundVariant;
  showBackground: boolean;

  // Clipboard
  clipboard: Clipboard | null;

  // History for undo/redo
  history: HistoryEntry[];
  historyIndex: number;
  maxHistory: number;

  // Actions
  onNodesChange: OnNodesChange<HachiNode>;
  onEdgesChange: OnEdgesChange<HachiEdge>;
  onConnect: OnConnect;
  setNodes: (nodes: HachiNode[]) => void;
  setEdges: (edges: HachiEdge[]) => void;
  addNode: (node: HachiNode) => void;
  deleteNode: (nodeId: string) => void;
  duplicateNode: (nodeId: string) => void;
  updateNodeData: (nodeId: string, data: Partial<HachiNode["data"]>) => void;
  deleteEdge: (edgeId: string) => void;
  updateEdgeData: (edgeId: string, data: Partial<HachiEdge["data"]>) => void;
  setSelectedNodeId: (id: string | null) => void;
  setIsRunning: (isRunning: boolean) => void;
  setRunId: (runId: string | null) => void;
  setBackgroundVariant: (variant: BackgroundVariant) => void;
  toggleBackground: () => void;
  reset: () => void;

  // Multi-selection
  setSelection: (nodeIds: string[], edgeIds: string[]) => void;
  clearSelection: () => void;
  deleteSelected: () => void;

  // Clipboard operations
  copySelected: () => void;
  paste: (offset?: { x: number; y: number }) => void;
  duplicate: () => void;

  // History operations
  pushHistory: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;

  // Graph traversal helpers
  getIncomers: (nodeId: string) => HachiNode[];
  getOutgoers: (nodeId: string) => HachiNode[];
  getConnectedEdges: (nodeIds: string[]) => HachiEdge[];
  getRootNodes: () => HachiNode[];
  getLeafNodes: () => HachiNode[];
  getExecutionOrder: () => HachiNode[];
  hasCycle: () => boolean;

  // Edge operations
  reconnectEdge: (edgeId: string, newSource: string, newTarget: string) => void;
  setEdgePathStyle: (edgeId: string, style: EdgePathStyle) => void;
  setEdgeAnimated: (edgeId: string, animated: boolean) => void;

  // Node status operations
  setNodeStatus: (nodeId: string, status: NodeStatus, message?: string) => void;
  clearAllNodeStatuses: () => void;
}

const initialNodes: HachiNode[] = [];
const initialEdges: HachiEdge[] = [];

export const useCanvasStore = create<CanvasState>((set, get) => ({
  nodes: initialNodes,
  edges: initialEdges,
  selectedNodeId: null,
  selectedNodeIds: [],
  selectedEdgeIds: [],
  isRunning: false,
  runId: null,
  backgroundVariant: "dots",
  showBackground: true,
  clipboard: null,
  history: [],
  historyIndex: -1,
  maxHistory: 50,

  onNodesChange: (changes) => {
    set({ nodes: applyNodeChanges(changes, get().nodes) });
  },

  onEdgesChange: (changes) => {
    set({ edges: applyEdgeChanges(changes, get().edges) });
  },

  onConnect: (connection) => {
    get().pushHistory();
    set({ edges: addEdge(connection, get().edges) });
  },

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),

  addNode: (node) => {
    get().pushHistory();
    set({ nodes: [...get().nodes, node] });
  },

  deleteNode: (nodeId) => {
    get().pushHistory();
    const { nodes, edges, selectedNodeId, selectedNodeIds } = get();
    set({
      nodes: nodes.filter((n) => n.id !== nodeId),
      edges: edges.filter((e) => e.source !== nodeId && e.target !== nodeId),
      selectedNodeId: selectedNodeId === nodeId ? null : selectedNodeId,
      selectedNodeIds: selectedNodeIds.filter((id) => id !== nodeId),
    });
  },

  duplicateNode: (nodeId) => {
    const node = get().nodes.find((n) => n.id === nodeId);
    if (!node) return;

    get().pushHistory();
    const newNode: HachiNode = {
      ...node,
      id: crypto.randomUUID(),
      position: {
        x: node.position.x + 50,
        y: node.position.y + 50,
      },
      selected: false,
    };
    set({ nodes: [...get().nodes, newNode] });
  },

  updateNodeData: (nodeId, data) => {
    set({
      nodes: get().nodes.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, ...data } }
          : node
      ),
    });
  },

  deleteEdge: (edgeId) => {
    get().pushHistory();
    const { selectedEdgeIds } = get();
    set({
      edges: get().edges.filter((e) => e.id !== edgeId),
      selectedEdgeIds: selectedEdgeIds.filter((id) => id !== edgeId),
    });
  },

  updateEdgeData: (edgeId, data) => {
    set({
      edges: get().edges.map((edge) =>
        edge.id === edgeId
          ? { ...edge, data: { ...edge.data, ...data } }
          : edge
      ),
    });
  },

  setSelectedNodeId: (id) => set({ selectedNodeId: id }),

  setIsRunning: (isRunning) => set({ isRunning }),

  setRunId: (runId) => set({ runId }),

  setBackgroundVariant: (variant) => set({ backgroundVariant: variant }),

  toggleBackground: () => set({ showBackground: !get().showBackground }),

  reset: () => {
    get().pushHistory();
    set({
      nodes: initialNodes,
      edges: initialEdges,
      selectedNodeId: null,
      selectedNodeIds: [],
      selectedEdgeIds: [],
      backgroundVariant: "dots",
      showBackground: true,
    });
  },

  // Multi-selection
  setSelection: (nodeIds, edgeIds) => {
    set({
      selectedNodeIds: nodeIds,
      selectedEdgeIds: edgeIds,
      selectedNodeId: nodeIds.length === 1 ? nodeIds[0] : null,
    });
  },

  clearSelection: () => {
    set({
      selectedNodeIds: [],
      selectedEdgeIds: [],
      selectedNodeId: null,
      nodes: get().nodes.map((n) => ({ ...n, selected: false })),
      edges: get().edges.map((e) => ({ ...e, selected: false })),
    });
  },

  deleteSelected: () => {
    const { nodes, edges, selectedNodeIds, selectedEdgeIds } = get();
    if (selectedNodeIds.length === 0 && selectedEdgeIds.length === 0) return;

    get().pushHistory();
    const nodeIdSet = new Set(selectedNodeIds);
    set({
      nodes: nodes.filter((n) => !nodeIdSet.has(n.id)),
      edges: edges.filter(
        (e) =>
          !selectedEdgeIds.includes(e.id) &&
          !nodeIdSet.has(e.source) &&
          !nodeIdSet.has(e.target)
      ),
      selectedNodeIds: [],
      selectedEdgeIds: [],
      selectedNodeId: null,
    });
  },

  // Clipboard operations
  copySelected: () => {
    const { nodes, edges, selectedNodeIds, selectedEdgeIds } = get();
    const selectedNodes = nodes.filter((n) => selectedNodeIds.includes(n.id));
    const nodeIdSet = new Set(selectedNodeIds);

    // Include edges that connect selected nodes
    const selectedEdges = edges.filter(
      (e) =>
        selectedEdgeIds.includes(e.id) ||
        (nodeIdSet.has(e.source) && nodeIdSet.has(e.target))
    );

    if (selectedNodes.length > 0) {
      set({ clipboard: { nodes: selectedNodes, edges: selectedEdges } });
    }
  },

  paste: (offset = { x: 50, y: 50 }) => {
    const { clipboard } = get();
    if (!clipboard || clipboard.nodes.length === 0) return;

    get().pushHistory();

    // Create ID mapping for new nodes
    const idMap = new Map<string, string>();
    const newNodes = clipboard.nodes.map((node) => {
      const newId = crypto.randomUUID();
      idMap.set(node.id, newId);
      return {
        ...node,
        id: newId,
        position: {
          x: node.position.x + offset.x,
          y: node.position.y + offset.y,
        },
        selected: true,
      };
    });

    // Remap edge source/target IDs
    const newEdges = clipboard.edges
      .filter((edge) => idMap.has(edge.source) && idMap.has(edge.target))
      .map((edge) => ({
        ...edge,
        id: crypto.randomUUID(),
        source: idMap.get(edge.source)!,
        target: idMap.get(edge.target)!,
        selected: true,
      }));

    // Deselect existing and add new
    set({
      nodes: [
        ...get().nodes.map((n) => ({ ...n, selected: false })),
        ...newNodes,
      ],
      edges: [
        ...get().edges.map((e) => ({ ...e, selected: false })),
        ...newEdges,
      ],
      selectedNodeIds: newNodes.map((n) => n.id),
      selectedEdgeIds: newEdges.map((e) => e.id),
    });
  },

  duplicate: () => {
    get().copySelected();
    get().paste({ x: 50, y: 50 });
  },

  // History operations
  pushHistory: () => {
    const { nodes, edges, history, historyIndex, maxHistory } = get();
    const newEntry: HistoryEntry = {
      nodes: JSON.parse(JSON.stringify(nodes)),
      edges: JSON.parse(JSON.stringify(edges)),
    };

    // Remove any future history if we're not at the end
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newEntry);

    // Limit history size
    if (newHistory.length > maxHistory) {
      newHistory.shift();
    }

    set({
      history: newHistory,
      historyIndex: newHistory.length - 1,
    });
  },

  undo: () => {
    const { history, historyIndex, nodes, edges } = get();
    if (historyIndex < 0) return;

    // Save current state if at the end
    if (historyIndex === history.length - 1) {
      const currentEntry: HistoryEntry = {
        nodes: JSON.parse(JSON.stringify(nodes)),
        edges: JSON.parse(JSON.stringify(edges)),
      };
      history[historyIndex] = currentEntry;
    }

    const newIndex = historyIndex - 1;
    const entry = history[newIndex];
    if (newIndex >= 0 && entry) {
      set({
        nodes: JSON.parse(JSON.stringify(entry.nodes)),
        edges: JSON.parse(JSON.stringify(entry.edges)),
        historyIndex: newIndex,
        selectedNodeIds: [],
        selectedEdgeIds: [],
        selectedNodeId: null,
      });
    }
  },

  redo: () => {
    const { history, historyIndex } = get();
    const newIndex = historyIndex + 1;
    const entry = history[newIndex];
    if (newIndex < history.length && entry) {
      set({
        nodes: JSON.parse(JSON.stringify(entry.nodes)),
        edges: JSON.parse(JSON.stringify(entry.edges)),
        historyIndex: newIndex,
        selectedNodeIds: [],
        selectedEdgeIds: [],
        selectedNodeId: null,
      });
    }
  },

  canUndo: () => get().historyIndex >= 0,
  canRedo: () => get().historyIndex < get().history.length - 1,

  // Graph traversal helpers
  getIncomers: (nodeId: string) => {
    const { nodes, edges } = get();
    const node = nodes.find((n) => n.id === nodeId);
    if (!node) return [];
    return getIncomers(node, nodes, edges);
  },

  getOutgoers: (nodeId: string) => {
    const { nodes, edges } = get();
    const node = nodes.find((n) => n.id === nodeId);
    if (!node) return [];
    return getOutgoers(node, nodes, edges);
  },

  getConnectedEdges: (nodeIds: string[]) => {
    const { nodes, edges } = get();
    const selectedNodes = nodes.filter((n) => nodeIds.includes(n.id));
    return getConnectedEdges(selectedNodes, edges);
  },

  getRootNodes: () => {
    const { nodes, edges } = get();
    const hasIncoming = new Set(edges.map((e) => e.target));
    return nodes.filter((n) => !hasIncoming.has(n.id));
  },

  getLeafNodes: () => {
    const { nodes, edges } = get();
    const hasOutgoing = new Set(edges.map((e) => e.source));
    return nodes.filter((n) => !hasOutgoing.has(n.id));
  },

  getExecutionOrder: () => {
    const { nodes, edges } = get();
    const inDegree = new Map<string, number>();
    const adjList = new Map<string, string[]>();

    for (const node of nodes) {
      inDegree.set(node.id, 0);
      adjList.set(node.id, []);
    }

    for (const edge of edges) {
      const neighbors = adjList.get(edge.source);
      if (neighbors) {
        neighbors.push(edge.target);
      }
      inDegree.set(edge.target, (inDegree.get(edge.target) || 0) + 1);
    }

    const queue: string[] = [];
    for (const [nodeId, degree] of inDegree) {
      if (degree === 0) {
        queue.push(nodeId);
      }
    }

    const result: HachiNode[] = [];
    while (queue.length > 0) {
      const nodeId = queue.shift()!;
      const node = nodes.find((n) => n.id === nodeId);
      if (node) {
        result.push(node);
      }

      const neighbors = adjList.get(nodeId) || [];
      for (const neighbor of neighbors) {
        const newDegree = (inDegree.get(neighbor) || 0) - 1;
        inDegree.set(neighbor, newDegree);
        if (newDegree === 0) {
          queue.push(neighbor);
        }
      }
    }

    return result;
  },

  hasCycle: () => {
    const { nodes } = get();
    const executionOrder = get().getExecutionOrder();
    return executionOrder.length !== nodes.length;
  },

  // Edge operations
  reconnectEdge: (edgeId: string, newSource: string, newTarget: string) => {
    get().pushHistory();
    set({
      edges: get().edges.map((edge) =>
        edge.id === edgeId
          ? { ...edge, source: newSource, target: newTarget }
          : edge
      ),
    });
  },

  setEdgePathStyle: (edgeId: string, style: EdgePathStyle) => {
    set({
      edges: get().edges.map((edge) =>
        edge.id === edgeId
          ? { ...edge, data: { ...edge.data, pathStyle: style } }
          : edge
      ),
    });
  },

  setEdgeAnimated: (edgeId: string, animated: boolean) => {
    set({
      edges: get().edges.map((edge) =>
        edge.id === edgeId
          ? { ...edge, data: { ...edge.data, animated } }
          : edge
      ),
    });
  },

  // Node status operations
  setNodeStatus: (nodeId: string, status: NodeStatus, message?: string) => {
    set({
      nodes: get().nodes.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, status, statusMessage: message } }
          : node
      ),
    });
  },

  clearAllNodeStatuses: () => {
    set({
      nodes: get().nodes.map((node) => ({
        ...node,
        data: { ...node.data, status: "initial" as NodeStatus, statusMessage: undefined },
      })),
    });
  },
}));
