import { useEffect, useRef, useState, useCallback } from "react";
import { updateDrawing } from "../api/drawings-api";

interface UseDrawingAutoSaveOptions {
  drawingId: string;
  drawingJson: Record<string, unknown> | null;
  debounceMs?: number;
}

export function useDrawingAutoSave({
  drawingId,
  drawingJson,
  debounceMs = 2000,
}: UseDrawingAutoSaveOptions) {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastJsonRef = useRef<string | null>(null);

  const save = useCallback(
    async (json: Record<string, unknown>) => {
      const serialized = JSON.stringify(json);
      if (serialized === lastJsonRef.current) return;

      setIsSaving(true);
      setError(null);
      try {
        await updateDrawing(drawingId, { drawingJson: json });
        lastJsonRef.current = serialized;
        setLastSaved(new Date());
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Save failed"));
      } finally {
        setIsSaving(false);
      }
    },
    [drawingId]
  );

  useEffect(() => {
    if (!drawingJson) return;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      save(drawingJson);
    }, debounceMs);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [drawingJson, debounceMs, save]);

  return { isSaving, lastSaved, error };
}
