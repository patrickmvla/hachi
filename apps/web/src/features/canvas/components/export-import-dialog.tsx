"use client";

import { useState, useRef } from "react";
import { Download, Upload, Copy, Check, X, FileJson } from "lucide-react";
import { useCanvasStore } from "@/stores/canvas-store";
import { exportCanvas, importCanvas, exportCanvasAsFile } from "../export";

interface ExportImportDialogProps {
  canvasName: string;
  mode: "export" | "import";
  onClose: () => void;
  onImport?: (data: { nodes: any[]; edges: any[]; name: string }) => void;
}

export const ExportImportDialog = ({ canvasName, mode, onClose, onImport }: ExportImportDialogProps) => {
  const { nodes, edges } = useCanvasStore();
  const [copied, setCopied] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [importPreview, setImportPreview] = useState<{ name: string; nodeCount: number; edgeCount: number } | null>(null);
  const [importData, setImportData] = useState<{ nodes: any[]; edges: any[]; name: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const exportData = mode === "export" ? exportCanvas(canvasName, nodes, edges) : null;
  const exportJson = exportData ? JSON.stringify(exportData, null, 2) : "";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(exportJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    exportCanvasAsFile(canvasName, nodes, edges);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportError(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        const result = importCanvas(json);
        setImportData(result);
        setImportPreview({ name: result.name, nodeCount: result.nodes.length, edgeCount: result.edges.length });
      } catch (err) {
        setImportError(err instanceof Error ? err.message : "Invalid file format");
      }
    };
    reader.readAsText(file);
  };

  const handleImport = () => {
    if (importData && onImport) {
      onImport(importData);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onClick={onClose}>
      <div
        className="bg-white rounded-xl shadow-2xl w-[520px] max-h-[80vh] flex flex-col border border-black/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-black/[0.06]">
          <div className="flex items-center gap-2">
            {mode === "export" ? <Download size={16} /> : <Upload size={16} />}
            <h2 className="text-sm font-semibold">
              {mode === "export" ? "Export Canvas" : "Import Canvas"}
            </h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-black/5 rounded transition-colors">
            <X size={16} className="text-black/40" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-5">
          {mode === "export" ? (
            <div className="space-y-3">
              <div className="text-xs text-black/50">
                {exportData?.metadata?.nodeCount} nodes, {exportData?.metadata?.edgeCount} edges
              </div>
              <pre className="bg-black/[0.03] rounded-lg p-3 text-[11px] font-mono text-black/60 max-h-[300px] overflow-auto border border-black/[0.06]">
                {exportJson}
              </pre>
            </div>
          ) : (
            <div className="space-y-4">
              <div
                className="border-2 border-dashed border-black/10 rounded-lg p-8 text-center cursor-pointer hover:border-black/20 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <FileJson size={32} className="mx-auto text-black/20 mb-2" />
                <p className="text-sm text-black/50">Click to select a .hachi.json file</p>
                <p className="text-[10px] text-black/30 mt-1">or drop it here</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,.hachi.json"
                onChange={handleFileSelect}
                className="hidden"
              />
              {importError && (
                <div className="bg-red-50 text-red-600 text-xs p-3 rounded-lg border border-red-100">
                  {importError}
                </div>
              )}
              {importPreview && (
                <div className="bg-green-50 text-green-700 text-xs p-3 rounded-lg border border-green-100">
                  <p className="font-medium">{importPreview.name}</p>
                  <p className="text-green-600 mt-0.5">
                    {importPreview.nodeCount} nodes, {importPreview.edgeCount} edges
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-black/[0.06]">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs text-black/50 hover:text-black/70 transition-colors"
          >
            Cancel
          </button>
          {mode === "export" ? (
            <>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-black/10 rounded-md hover:bg-black/[0.03] transition-colors"
              >
                {copied ? <Check size={12} /> : <Copy size={12} />}
                {copied ? "Copied" : "Copy"}
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                <Download size={12} />
                Download
              </button>
            </>
          ) : (
            <button
              onClick={handleImport}
              disabled={!importData}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <Upload size={12} />
              Import
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
