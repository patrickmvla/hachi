"use client";

import { useParams } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Loader2,
  AlertCircle,
  Cloud,
  CloudOff,
  Check,
  ArrowLeft,
  Pencil,
  Play,
  Square,
  Zap,
  Coins,
} from "lucide-react";
import { Canvas } from "@/features/canvas/canvas";
import { useBackendAutoSave, useCanvasEditor } from "@/features/canvas/hooks";
import { updateCanvas } from "@/features/canvas/api/canvas-api";
import { useCanvasStore } from "@/stores/canvas-store";
import { useExecutionLogStore } from "@/stores/execution-log-store";
import { useExecution } from "@/features/canvas/hooks/use-execution";

function InlineName({
  canvasId,
  initialName,
}: {
  canvasId: string;
  initialName: string;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(initialName);
  const [savedName, setSavedName] = useState(initialName);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setName(initialName);
    setSavedName(initialName);
  }, [initialName]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const save = async () => {
    const trimmed = name.trim();
    if (trimmed && trimmed !== savedName) {
      try {
        await updateCanvas(canvasId, { name: trimmed });
        setSavedName(trimmed);
        setName(trimmed);
      } catch {
        setName(savedName);
      }
    } else {
      setName(savedName);
    }
    setIsEditing(false);
  };

  const cancel = () => {
    setName(savedName);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        value={name}
        onChange={(e) => setName(e.target.value)}
        onBlur={save}
        onKeyDown={(e) => {
          if (e.key === "Enter") save();
          if (e.key === "Escape") cancel();
        }}
        className="text-sm font-semibold bg-transparent border-b border-primary outline-none px-0 py-0.5 min-w-[120px] max-w-[300px]"
        spellCheck={false}
      />
    );
  }

  return (
    <button
      onClick={() => setIsEditing(true)}
      className="flex items-center gap-1.5 text-sm font-semibold hover:text-primary transition-colors group"
      title="Click to rename"
    >
      <span className="truncate max-w-[200px]">{savedName}</span>
      <Pencil size={12} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
    </button>
  );
}

function SaveStatus({
  isSaving,
  lastSaved,
  error,
}: {
  isSaving: boolean;
  lastSaved: Date | null;
  error: string | null;
}) {
  if (isSaving) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Cloud className="w-3.5 h-3.5 animate-pulse" />
        <span className="hidden sm:inline">Saving...</span>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-destructive">
        <CloudOff className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Save failed</span>
      </div>
    );
  }
  if (lastSaved) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Check className="w-3.5 h-3.5 text-green-500" />
        <span className="hidden sm:inline">Saved</span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
      <Cloud className="w-3.5 h-3.5" />
    </div>
  );
}

function RunControls({ canvasId }: { canvasId: string }) {
  const isRunning = useCanvasStore((s) => s.isRunning);
  const { currentNodeId, entries, runTrace } = useExecutionLogStore();
  const { executeWorkflow, stopExecution } = useExecution(canvasId);

  const currentEntry = entries.find((e) => e.nodeId === currentNodeId);
  const currentStepName = currentEntry?.stepName;

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => executeWorkflow("")}
        disabled={isRunning}
        className={`
          flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors
          ${isRunning
            ? "bg-muted text-muted-foreground cursor-not-allowed"
            : "bg-primary text-primary-foreground hover:bg-primary/90"
          }
        `}
      >
        {isRunning ? (
          <>
            <Loader2 size={13} className="animate-spin" />
            <span className="hidden sm:inline">Running...</span>
          </>
        ) : (
          <>
            <Play size={13} className="fill-current" />
            <span className="hidden sm:inline">Run</span>
          </>
        )}
      </button>

      {isRunning && (
        <button
          onClick={stopExecution}
          className="p-1.5 text-destructive hover:bg-destructive/10 rounded-md transition-colors"
          aria-label="Stop"
        >
          <Square size={13} className="fill-current" />
        </button>
      )}

      {/* Current step while running */}
      {isRunning && currentStepName && (
        <span className="text-xs text-blue-600 font-medium hidden md:inline truncate max-w-[120px]">
          {currentStepName}
        </span>
      )}

      {/* Run metrics — always visible, zero when no runs yet */}
      <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-mono hidden sm:flex">
        <span className="flex items-center gap-0.5">
          <Zap size={10} />
          {runTrace ? `${runTrace.totalLatencyMs}ms` : "0ms"}
        </span>
        <span>
          {runTrace ? runTrace.totalTokens.toLocaleString() : "0"} tok
        </span>
        <span className="flex items-center gap-0.5">
          <Coins size={10} />
          ${runTrace ? runTrace.totalCost.toFixed(4) : "0.0000"}
        </span>
      </div>
    </div>
  );
}

export default function PipelineEditorPage() {
  const params = useParams();
  const canvasId = params.id as string;

  const { data: canvas, isLoading, error } = useCanvasEditor(canvasId);

  const { isSaving, lastSaved, error: saveError } = useBackendAutoSave({
    canvasId,
    debounceMs: 2000,
    enabled: !isLoading && !error,
  });

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          <p className="text-muted-foreground">Loading pipeline...</p>
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
          <h2 className="text-lg font-semibold">Failed to load pipeline</h2>
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
    <div className="h-full flex flex-col">
      {/* Unified top bar */}
      <div className="h-12 shrink-0 border-b border-border bg-background flex items-center px-3 gap-3">
        {/* Left: back + name */}
        <div className="flex items-center gap-2 min-w-0">
          <Link
            href="/pipelines"
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors shrink-0"
          >
            <ArrowLeft size={14} />
            <span className="hidden sm:inline">Pipelines</span>
          </Link>
          <div className="w-px h-5 bg-border shrink-0" />
          <InlineName
            canvasId={canvasId}
            initialName={canvas?.name ?? "Untitled Pipeline"}
          />
        </div>

        {/* Center: run controls */}
        <div className="flex items-center gap-2 ml-auto">
          <RunControls canvasId={canvasId} />
        </div>

        {/* Right: save status */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-px h-5 bg-border" />
          <SaveStatus
            isSaving={isSaving}
            lastSaved={lastSaved}
            error={saveError}
          />
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 relative">
        <Canvas canvasId={canvasId} collaborationEnabled={false} />
      </div>
    </div>
  );
}
