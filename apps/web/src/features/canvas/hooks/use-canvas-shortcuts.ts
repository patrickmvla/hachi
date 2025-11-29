"use client";

import { useCallback, useEffect } from "react";
import { useKeyPress, useReactFlow } from "@xyflow/react";
import { useCanvasStore } from "@/stores/canvas-store";

/**
 * Hook for canvas keyboard shortcuts
 * - Delete/Backspace: Delete selected nodes/edges
 * - Ctrl/Cmd+C: Copy selected
 * - Ctrl/Cmd+V: Paste
 * - Ctrl/Cmd+D: Duplicate selected
 * - Ctrl/Cmd+Z: Undo
 * - Ctrl/Cmd+Shift+Z / Ctrl+Y: Redo
 * - Ctrl/Cmd+A: Select all
 * - Escape: Clear selection
 */
export const useCanvasShortcuts = () => {
  const { fitView, getNodes, getEdges } = useReactFlow();
  const {
    deleteSelected,
    copySelected,
    paste,
    duplicate,
    undo,
    redo,
    setSelection,
    clearSelection,
    selectedNodeIds,
    selectedEdgeIds,
  } = useCanvasStore();

  // Delete key
  const deletePressed = useKeyPress(["Delete", "Backspace"]);

  // Copy: Ctrl/Cmd+C
  const copyPressed = useKeyPress(["Meta+c", "Control+c"]);

  // Paste: Ctrl/Cmd+V
  const pastePressed = useKeyPress(["Meta+v", "Control+v"]);

  // Duplicate: Ctrl/Cmd+D
  const duplicatePressed = useKeyPress(["Meta+d", "Control+d"]);

  // Undo: Ctrl/Cmd+Z
  const undoPressed = useKeyPress(["Meta+z", "Control+z"]);

  // Redo: Ctrl/Cmd+Shift+Z or Ctrl+Y
  const redoPressed = useKeyPress([
    "Meta+Shift+z",
    "Control+Shift+z",
    "Control+y",
  ]);

  // Select all: Ctrl/Cmd+A
  const selectAllPressed = useKeyPress(["Meta+a", "Control+a"]);

  // Escape: Clear selection
  const escapePressed = useKeyPress("Escape");

  // Fit view: Ctrl/Cmd+0
  const fitViewPressed = useKeyPress(["Meta+0", "Control+0"]);

  // Handle delete
  useEffect(() => {
    if (deletePressed && (selectedNodeIds.length > 0 || selectedEdgeIds.length > 0)) {
      deleteSelected();
    }
  }, [deletePressed, selectedNodeIds.length, selectedEdgeIds.length, deleteSelected]);

  // Handle copy
  useEffect(() => {
    if (copyPressed && selectedNodeIds.length > 0) {
      copySelected();
    }
  }, [copyPressed, selectedNodeIds.length, copySelected]);

  // Handle paste
  useEffect(() => {
    if (pastePressed) {
      paste();
    }
  }, [pastePressed, paste]);

  // Handle duplicate
  useEffect(() => {
    if (duplicatePressed && selectedNodeIds.length > 0) {
      duplicate();
    }
  }, [duplicatePressed, selectedNodeIds.length, duplicate]);

  // Handle undo
  useEffect(() => {
    if (undoPressed) {
      undo();
    }
  }, [undoPressed, undo]);

  // Handle redo
  useEffect(() => {
    if (redoPressed) {
      redo();
    }
  }, [redoPressed, redo]);

  // Handle select all
  useEffect(() => {
    if (selectAllPressed) {
      const allNodeIds = getNodes().map((n) => n.id);
      const allEdgeIds = getEdges().map((e) => e.id);
      setSelection(allNodeIds, allEdgeIds);
    }
  }, [selectAllPressed, getNodes, getEdges, setSelection]);

  // Handle escape
  useEffect(() => {
    if (escapePressed) {
      clearSelection();
    }
  }, [escapePressed, clearSelection]);

  // Handle fit view
  useEffect(() => {
    if (fitViewPressed) {
      fitView({ padding: 0.2 });
    }
  }, [fitViewPressed, fitView]);
};
