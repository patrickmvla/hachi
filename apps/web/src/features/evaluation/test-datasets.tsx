"use client";

import { useState } from "react";
import {
  Plus,
  Trash2,
  FileText,
  Loader2,
} from "lucide-react";
import {
  useDatasets,
  useCreateDataset,
  useDeleteDataset,
} from "./hooks/use-evaluation-queries";

interface TestDatasetsProps {
  organizationId: string;
  onSelectDataset: (id: string) => void;
}

export function TestDatasets({ organizationId, onSelectDataset }: TestDatasetsProps) {
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const { data: datasets, isLoading } = useDatasets(organizationId);
  const createMutation = useCreateDataset(organizationId);
  const deleteMutation = useDeleteDataset(organizationId);

  const handleCreate = () => {
    createMutation.mutate(
      { name, description: description || undefined },
      {
        onSuccess: () => {
          setShowCreate(false);
          setName("");
          setDescription("");
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Test Datasets</h2>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          <Plus size={14} />
          New Dataset
        </button>
      </div>

      {showCreate && (
        <div className="p-4 rounded-lg border border-border bg-card space-y-3">
          <input
            type="text"
            placeholder="Dataset name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background"
          />
          <input
            type="text"
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background"
          />
          <div className="flex gap-2">
            <button
              onClick={handleCreate}
              disabled={!name || createMutation.isPending}
              className="px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              {createMutation.isPending ? "Creating..." : "Create"}
            </button>
            <button
              onClick={() => setShowCreate(false)}
              className="px-3 py-1.5 text-sm border border-border rounded-md hover:bg-muted transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {(!datasets || datasets.length === 0) ? (
        <div className="p-8 text-center border border-dashed border-border rounded-lg">
          <FileText className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            No test datasets yet. Create one to start evaluating your pipelines.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {datasets.map((ds) => (
            <div
              key={ds.id}
              className="flex items-center justify-between p-4 rounded-lg border border-border bg-card hover:border-primary cursor-pointer transition-colors"
              onClick={() => onSelectDataset(ds.id)}
            >
              <div>
                <h3 className="font-medium text-sm">{ds.name}</h3>
                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                  {ds.description && <span>{ds.description}</span>}
                  <span>{ds.caseCount ?? 0} test cases</span>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteMutation.mutate(ds.id);
                }}
                className="p-1.5 rounded-md text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                aria-label={`Delete dataset ${ds.name}`}
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
