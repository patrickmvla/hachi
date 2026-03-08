"use client";

import { useState } from "react";
import {
  ZoomIn,
  ZoomOut,
  Maximize,
  Undo2,
  Redo2,
  Download,
  Upload,
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
import { ExportImportDialog } from "./export-import-dialog";

const backgroundVariants: { value: BackgroundVariant; icon: typeof Grid; label: string }[] = [
  { value: "dots", icon: Circle, label: "Dots" },
  { value: "lines", icon: LayoutGrid, label: "Lines" },
  { value: "cross", icon: X, label: "Cross" },
];

export const Toolbar = ({ canvasName = "canvas" }: { canvasName?: string }) => {
  const { zoomIn, zoomOut, fitView } = useReactFlow();
  const [dialogMode, setDialogMode] = useState<"export" | "import" | null>(null);
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
      <div className="flex items-center gap-1 p-1 rounded-lg border border-border bg-background shadow-lg">
        {/* Undo/Redo */}
        <div className="flex items-center gap-0.5 pr-2 border-r border-border">
          <button
            onClick={undo}
            disabled={!canUndo()}
            className={`p-2 rounded-md transition-colors ${
              canUndo()
                ? "hover:bg-muted text-muted-foreground hover:text-foreground"
                : "text-muted-foreground/30 cursor-not-allowed"
            }`}
            title="Undo (Ctrl+Z)"
            aria-label="Undo"
          >
            <Undo2 size={16} />
          </button>
          <button
            onClick={redo}
            disabled={!canRedo()}
            className={`p-2 rounded-md transition-colors ${
              canRedo()
                ? "hover:bg-muted text-muted-foreground hover:text-foreground"
                : "text-muted-foreground/30 cursor-not-allowed"
            }`}
            title="Redo (Ctrl+Shift+Z)"
            aria-label="Redo"
          >
            <Redo2 size={16} />
          </button>
        </div>

        {/* Selection Actions */}
        {hasSelection && (
          <div className="flex items-center gap-0.5 px-2 border-r border-border">
            <span className="text-xs text-muted-foreground px-1">
              {selectionCount} selected
            </span>
            <button
              onClick={copySelected}
              className="p-2 hover:bg-muted rounded-md text-muted-foreground hover:text-foreground transition-colors"
              title="Copy (Ctrl+C)"
              aria-label="Copy selection"
            >
              <Copy size={16} />
            </button>
            <button
              onClick={deleteSelected}
              className="p-2 hover:bg-red-500/10 rounded-md text-muted-foreground hover:text-red-500 transition-colors"
              title="Delete (Del)"
              aria-label="Delete selection"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}

        {/* Paste */}
        {hasClipboard && !hasSelection && (
          <div className="flex items-center gap-0.5 px-2 border-r border-border">
            <button
              onClick={() => paste()}
              className="p-2 hover:bg-muted rounded-md text-muted-foreground hover:text-foreground transition-colors"
              title="Paste (Ctrl+V)"
              aria-label="Paste"
            >
              <Clipboard size={16} />
            </button>
          </div>
        )}

        {/* Zoom Controls */}
        <div className="flex items-center gap-0.5 px-2 border-r border-border">
          <button
            onClick={() => zoomOut()}
            className="p-2 hover:bg-muted rounded-md text-muted-foreground hover:text-foreground transition-colors"
            title="Zoom Out"
            aria-label="Zoom out"
          >
            <ZoomOut size={16} />
          </button>
          <button
            onClick={() => fitView({ padding: 0.2 })}
            className="p-2 hover:bg-muted rounded-md text-muted-foreground hover:text-foreground transition-colors"
            title="Fit View (Ctrl+0)"
            aria-label="Fit view"
          >
            <Maximize size={16} />
          </button>
          <button
            onClick={() => zoomIn()}
            className="p-2 hover:bg-muted rounded-md text-muted-foreground hover:text-foreground transition-colors"
            title="Zoom In"
            aria-label="Zoom in"
          >
            <ZoomIn size={16} />
          </button>
        </div>

        {/* Background Controls */}
        <div className="flex items-center gap-0.5 px-2 border-r border-border">
          <button
            onClick={toggleBackground}
            className={`p-2 rounded-md transition-colors ${
              showBackground
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted text-muted-foreground hover:text-foreground"
            }`}
            title="Toggle Background"
            aria-label="Toggle background"
            aria-pressed={showBackground}
          >
            <Grid size={16} />
          </button>
          {showBackground && (
            <div className="flex items-center gap-0.5 ml-1" role="group" aria-label="Background pattern">
              {backgroundVariants.map(({ value, icon: Icon, label }) => (
                <button
                  key={value}
                  onClick={() => setBackgroundVariant(value)}
                  className={`p-2 rounded-md transition-colors ${
                    backgroundVariant === value
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                  title={label}
                  aria-label={label}
                  aria-pressed={backgroundVariant === value}
                >
                  <Icon size={14} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Export / Import */}
        <div className="flex items-center gap-0.5 pl-2">
          <button
            onClick={() => setDialogMode("export")}
            className="p-2 hover:bg-muted rounded-md text-muted-foreground hover:text-foreground transition-colors"
            title="Export"
            aria-label="Export canvas"
          >
            <Download size={16} />
          </button>
          <button
            onClick={() => setDialogMode("import")}
            className="p-2 hover:bg-muted rounded-md text-muted-foreground hover:text-foreground transition-colors"
            title="Import"
            aria-label="Import canvas"
          >
            <Upload size={16} />
          </button>
        </div>
      </div>

      {dialogMode && (
        <ExportImportDialog
          canvasName={canvasName}
          mode={dialogMode}
          onClose={() => setDialogMode(null)}
          onImport={(data) => {
            const store = useCanvasStore.getState();
            store.setNodes(data.nodes);
            store.setEdges(data.edges);
          }}
        />
      )}
    </Panel>
  );
};
