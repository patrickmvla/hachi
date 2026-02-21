"use client";

import { useParams } from "next/navigation";
import { Loader2, AlertCircle, Cloud, CloudOff, Check } from "lucide-react";
import { Canvas } from "@/features/canvas/canvas";
import { PresenceAvatars } from "@/features/collaboration/presence-avatars";
import { CursorOverlay } from "@/features/collaboration/cursor-overlay";
import { useBackendAutoSave, useCanvasEditor } from "@/features/canvas/hooks";

export default function CanvasEditorPage() {
  const params = useParams();
  const canvasId = params.id as string;

  const { isLoading, error } = useCanvasEditor(canvasId);

  // Auto-save to backend
  const { isSaving, lastSaved, error: saveError } = useBackendAutoSave({
    canvasId,
    debounceMs: 2000,
    enabled: !isLoading && !error,
  });

  // Mock collaboration data (will be replaced with real collaboration)
  const users = [
    { id: "1", name: "Alice", color: "#f87171" },
    { id: "2", name: "Bob", color: "#60a5fa" },
  ];

  const cursors = [
    { userId: "2", x: 400, y: 300, color: "#60a5fa", name: "Bob" },
  ];

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          <p className="text-muted-foreground">Loading canvas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center max-w-md">
          <div className="p-4 rounded-full bg-destructive/10">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="text-lg font-semibold">Failed to load canvas</h2>
          <p className="text-muted-foreground">{error.message}</p>
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

  return (
    <div className="h-full flex flex-col relative">
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

      <div className="absolute top-3 right-4 z-10">
        <PresenceAvatars users={users} />
      </div>

      <div className="flex-1 relative">
        <Canvas canvasId={canvasId} collaborationEnabled={false} />
        <CursorOverlay cursors={cursors} />
      </div>
    </div>
  );
}
