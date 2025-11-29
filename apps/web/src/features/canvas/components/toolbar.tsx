"use client";

import {
  ZoomIn,
  ZoomOut,
  Maximize,
  Undo2,
  Redo2,
  Download,
  Grid,
  Circle,
  LayoutGrid,
  X,
  Copy,
  Clipboard,
  Trash2,
} from "lucide-react";
import { Panel, useReactFlow } from "@xyflow/react";
import { useCanvasStore, type BackgroundVariant } from "@/stores/canvas-store";

const backgroundVariants: { value: BackgroundVariant; icon: typeof Grid; label: string }[] = [
  { value: "dots", icon: Circle, label: "Dots" },
  { value: "lines", icon: LayoutGrid, label: "Lines" },
  { value: "cross", icon: X, label: "Cross" },
];

export const Toolbar = () => {
  const { zoomIn, zoomOut, fitView } = useReactFlow();
  const {
    backgroundVariant,
    showBackground,
    setBackgroundVariant,
    toggleBackground,
    undo,
    redo,
    canUndo,
    canRedo,
    selectedNodeIds,
    selectedEdgeIds,
    copySelected,
    paste,
    deleteSelected,
    clipboard,
  } = useCanvasStore();

  const hasSelection = selectedNodeIds.length > 0 || selectedEdgeIds.length > 0;
  const hasClipboard = clipboard !== null && clipboard.nodes.length > 0;
  const selectionCount = selectedNodeIds.length + selectedEdgeIds.length;

  return (
    <Panel position="bottom-center">
      <div className="flex items-center gap-1 p-1 rounded-lg border border-[var(--border)] bg-[var(--background)] shadow-lg">
        {/* Undo/Redo */}
        <div className="flex items-center gap-0.5 pr-2 border-r border-[var(--border)]">
          <button
            onClick={undo}
            disabled={!canUndo()}
            className={`p-2 rounded-md transition-colors ${
              canUndo()
                ? "hover:bg-[var(--muted)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                : "text-[var(--muted-foreground)]/30 cursor-not-allowed"
            }`}
            title="Undo (Ctrl+Z)"
          >
            <Undo2 size={16} />
          </button>
          <button
            onClick={redo}
            disabled={!canRedo()}
            className={`p-2 rounded-md transition-colors ${
              canRedo()
                ? "hover:bg-[var(--muted)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                : "text-[var(--muted-foreground)]/30 cursor-not-allowed"
            }`}
            title="Redo (Ctrl+Shift+Z)"
          >
            <Redo2 size={16} />
          </button>
        </div>

        {/* Selection Actions */}
        {hasSelection && (
          <div className="flex items-center gap-0.5 px-2 border-r border-[var(--border)]">
            <span className="text-xs text-[var(--muted-foreground)] px-1">
              {selectionCount} selected
            </span>
            <button
              onClick={copySelected}
              className="p-2 hover:bg-[var(--muted)] rounded-md text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
              title="Copy (Ctrl+C)"
            >
              <Copy size={16} />
            </button>
            <button
              onClick={deleteSelected}
              className="p-2 hover:bg-red-500/10 rounded-md text-[var(--muted-foreground)] hover:text-red-500 transition-colors"
              title="Delete (Del)"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}

        {/* Paste */}
        {hasClipboard && !hasSelection && (
          <div className="flex items-center gap-0.5 px-2 border-r border-[var(--border)]">
            <button
              onClick={() => paste()}
              className="p-2 hover:bg-[var(--muted)] rounded-md text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
              title="Paste (Ctrl+V)"
            >
              <Clipboard size={16} />
            </button>
          </div>
        )}

        {/* Zoom Controls */}
        <div className="flex items-center gap-0.5 px-2 border-r border-[var(--border)]">
          <button
            onClick={() => zoomOut()}
            className="p-2 hover:bg-[var(--muted)] rounded-md text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
            title="Zoom Out"
          >
            <ZoomOut size={16} />
          </button>
          <button
            onClick={() => fitView({ padding: 0.2 })}
            className="p-2 hover:bg-[var(--muted)] rounded-md text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
            title="Fit View (Ctrl+0)"
          >
            <Maximize size={16} />
          </button>
          <button
            onClick={() => zoomIn()}
            className="p-2 hover:bg-[var(--muted)] rounded-md text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
            title="Zoom In"
          >
            <ZoomIn size={16} />
          </button>
        </div>

        {/* Background Controls */}
        <div className="flex items-center gap-0.5 px-2 border-r border-[var(--border)]">
          <button
            onClick={toggleBackground}
            className={`p-2 rounded-md transition-colors ${
              showBackground
                ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                : "hover:bg-[var(--muted)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            }`}
            title="Toggle Background"
          >
            <Grid size={16} />
          </button>
          {showBackground && (
            <div className="flex items-center gap-0.5 ml-1">
              {backgroundVariants.map(({ value, icon: Icon, label }) => (
                <button
                  key={value}
                  onClick={() => setBackgroundVariant(value)}
                  className={`p-2 rounded-md transition-colors ${
                    backgroundVariant === value
                      ? "bg-[var(--muted)] text-[var(--foreground)]"
                      : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]/50"
                  }`}
                  title={label}
                >
                  <Icon size={14} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Export */}
        <div className="flex items-center gap-0.5 pl-2">
          <button
            className="p-2 hover:bg-[var(--muted)] rounded-md text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
            title="Export"
          >
            <Download size={16} />
          </button>
        </div>
      </div>
    </Panel>
  );
};
