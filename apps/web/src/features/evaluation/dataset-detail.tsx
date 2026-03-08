"use client";

import { useState } from "react";
import { ArrowLeft, Plus, Trash2, Loader2 } from "lucide-react";
import {
  useDatasetWithCases,
  useAddTestCases,
  useDeleteTestCase,
} from "./hooks/use-evaluation-queries";

interface DatasetDetailProps {
  datasetId: string;
  onBack: () => void;
}

export function DatasetDetail({ datasetId, onBack }: DatasetDetailProps) {
  const [newQuery, setNewQuery] = useState("");
  const [newGroundTruth, setNewGroundTruth] = useState("");
  const [bulkInput, setBulkInput] = useState("");
  const [mode, setMode] = useState<"single" | "bulk">("single");

  const { data, isLoading } = useDatasetWithCases(datasetId);
  const addMutation = useAddTestCases(datasetId);
  const deleteMutation = useDeleteTestCase(datasetId);

  const handleAddSingle = () => {
    if (!newQuery.trim()) return;
    addMutation.mutate(
      [{ query: newQuery.trim(), groundTruth: newGroundTruth.trim() || undefined }],
      {
        onSuccess: () => {
          setNewQuery("");
          setNewGroundTruth("");
        },
      }
    );
  };

  const handleAddBulk = () => {
    if (!bulkInput.trim()) return;
    const lines = bulkInput.trim().split("\n");
    const cases = lines
      .map((line) => {
        const parts = line.split("\t");
        return {
          query: (parts[0] ?? "").trim(),
          groundTruth: parts[1]?.trim() || undefined,
        };
      })
      .filter((c) => c.query);
    if (cases.length > 0) {
      addMutation.mutate(cases, {
        onSuccess: () => setBulkInput(""),
      });
    }
  };

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center h-32">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const { dataset, cases } = data;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2 rounded-md hover:bg-muted text-muted-foreground transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h2 className="text-lg font-semibold">{dataset.name}</h2>
          {dataset.description && (
            <p className="text-sm text-muted-foreground">{dataset.description}</p>
          )}
        </div>
      </div>

      {/* Add test cases */}
      <div className="p-4 rounded-lg border border-border bg-card space-y-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMode("single")}
            className={`px-3 py-1 text-xs rounded-md transition-colors ${
              mode === "single" ? "bg-primary text-primary-foreground" : "bg-muted"
            }`}
          >
            Single
          </button>
          <button
            onClick={() => setMode("bulk")}
            className={`px-3 py-1 text-xs rounded-md transition-colors ${
              mode === "bulk" ? "bg-primary text-primary-foreground" : "bg-muted"
            }`}
          >
            Bulk
          </button>
        </div>

        {mode === "single" ? (
          <>
            <input
              type="text"
              placeholder="Query"
              value={newQuery}
              onChange={(e) => setNewQuery(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background"
              onKeyDown={(e) => e.key === "Enter" && handleAddSingle()}
            />
            <input
              type="text"
              placeholder="Ground truth (optional)"
              value={newGroundTruth}
              onChange={(e) => setNewGroundTruth(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background"
              onKeyDown={(e) => e.key === "Enter" && handleAddSingle()}
            />
            <button
              onClick={handleAddSingle}
              disabled={!newQuery.trim() || addMutation.isPending}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
            >
              <Plus size={14} />
              Add Case
            </button>
          </>
        ) : (
          <>
            <textarea
              placeholder="One query per line. Use tab to separate query and ground truth.&#10;Example:&#10;What is RAG?&#9;Retrieval Augmented Generation..."
              value={bulkInput}
              onChange={(e) => setBulkInput(e.target.value)}
              className="w-full h-32 px-3 py-2 text-sm border border-border rounded-md bg-background font-mono resize-y"
            />
            <button
              onClick={handleAddBulk}
              disabled={!bulkInput.trim() || addMutation.isPending}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
            >
              <Plus size={14} />
              Add All
            </button>
          </>
        )}
      </div>

      {/* Test cases list */}
      <div className="space-y-1">
        <h3 className="text-sm font-medium text-muted-foreground mb-2">
          {cases.length} Test Case{cases.length !== 1 ? "s" : ""}
        </h3>
        {cases.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No test cases yet. Add queries above.
          </p>
        ) : (
          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/30">
                <tr>
                  <th className="px-4 py-2 text-left font-medium text-muted-foreground">#</th>
                  <th className="px-4 py-2 text-left font-medium text-muted-foreground">Query</th>
                  <th className="px-4 py-2 text-left font-medium text-muted-foreground">Ground Truth</th>
                  <th className="px-4 py-2 w-10" />
                </tr>
              </thead>
              <tbody>
                {cases.map((tc, i) => (
                  <tr key={tc.id} className="border-t border-border hover:bg-muted/10">
                    <td className="px-4 py-2 text-muted-foreground">{i + 1}</td>
                    <td className="px-4 py-2">{tc.query}</td>
                    <td className="px-4 py-2 text-muted-foreground">
                      {tc.groundTruth || "—"}
                    </td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => deleteMutation.mutate(tc.id)}
                        className="p-1 rounded text-muted-foreground hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
