"use client";

import { useParams } from "next/navigation";
import { useState, useCallback, useRef } from "react";
import { Loader2, AlertCircle, Cloud, CloudOff, Check } from "lucide-react";
import { useDrawing } from "@/features/drawings/hooks";
import { useDrawingAutoSave } from "@/features/drawings/hooks";
import { ExcalidrawEditor } from "@/features/drawings/components/excalidraw-editor";
import type { AppState, BinaryFiles, ExcalidrawInitialDataState } from "@excalidraw/excalidraw/types";
import type { OrderedExcalidrawElement } from "@excalidraw/excalidraw/element/types";

export default function DrawingEditorPage() {
  const params = useParams();
  const drawingId = params.id as string;

  const { data: drawing, isLoading, error } = useDrawing(drawingId);
  const [pendingJson, setPendingJson] = useState<Record<string, unknown> | null>(null);
  const initializedRef = useRef(false);

  const { isSaving, lastSaved, error: saveError } = useDrawingAutoSave({
    drawingId,
    drawingJson: pendingJson,
    debounceMs: 2000,
  });

  const handleChange = useCallback(
    (elements: readonly OrderedExcalidrawElement[], appState: AppState, files: BinaryFiles) => {
      setPendingJson({ elements: [...elements], appState, files });
    },
    []
  );

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-8rem)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          <p className="text-muted-foreground">Loading drawing...</p>
        </div>
      </div>
    );
  }

  if (error || !drawing) {
    return (
      <div className="h-[calc(100vh-8rem)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center max-w-md">
          <div className="p-4 rounded-full bg-destructive/10">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="text-lg font-semibold">Failed to load drawing</h2>
          <p className="text-muted-foreground">{error?.message ?? "Drawing not found"}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Build initialData only once from the fetched drawing
  const initialData = (() => {
    if (initializedRef.current) return undefined;
    initializedRef.current = true;

    const json = drawing.drawingJson as Record<string, unknown> | null;
    if (!json) return undefined;

    return {
      elements: json.elements ?? [],
      appState: json.appState ?? {},
      files: json.files ?? undefined,
      scrollToContent: true,
    } as ExcalidrawInitialDataState;
  })();

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col relative -m-4 sm:-m-6">
      {/* Save indicator */}
      <div className="absolute top-3 left-4 z-10">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-card/80 backdrop-blur-sm border border-border text-xs">
          {isSaving ? (
            <>
              <Cloud className="w-3.5 h-3.5 text-muted-foreground animate-pulse" />
              <span className="text-muted-foreground">Saving...</span>
            </>
          ) : saveError ? (
            <>
              <CloudOff className="w-3.5 h-3.5 text-destructive" />
              <span className="text-destructive">Save failed</span>
            </>
          ) : lastSaved ? (
            <>
              <Check className="w-3.5 h-3.5 text-green-500" />
              <span className="text-muted-foreground">Saved</span>
            </>
          ) : (
            <>
              <Cloud className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-muted-foreground">Auto-save on</span>
            </>
          )}
        </div>
      </div>

      <div className="flex-1">
        <ExcalidrawEditor
          initialData={initialData}
          onChange={handleChange}
        />
      </div>
    </div>
  );
}
