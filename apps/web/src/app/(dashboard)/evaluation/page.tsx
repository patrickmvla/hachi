"use client";

import { useState } from "react";
import { FlaskConical } from "lucide-react";
import { TestDatasets } from "@/features/evaluation/test-datasets";
import { DatasetDetail } from "@/features/evaluation/dataset-detail";
import { authClient } from "@hachi/auth/client";

export default function EvaluationPage() {
  const { data: session } = authClient.useSession();
  const organizationId = session?.session?.activeOrganizationId;

  const [selectedDatasetId, setSelectedDatasetId] = useState<string | null>(null);

  if (!organizationId) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Select an organization to manage evaluation datasets.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <FlaskConical className="w-6 h-6 text-primary" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Evaluation</h1>
          <p className="text-sm text-muted-foreground">
            Manage test datasets and evaluate pipeline quality
          </p>
        </div>
      </div>

      {selectedDatasetId ? (
        <DatasetDetail
          datasetId={selectedDatasetId}
          onBack={() => setSelectedDatasetId(null)}
        />
      ) : (
        <TestDatasets
          organizationId={organizationId}
          onSelectDataset={setSelectedDatasetId}
        />
      )}
    </div>
  );
}
