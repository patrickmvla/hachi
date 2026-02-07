"use client";

import Link from "next/link";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import { workspaces } from "@/lib/mock-data";
import { useParams } from "next/navigation";

export default function WorkspaceSettingsPage() {
  const params = useParams();
  const id = params.id as string;
  const workspace = workspaces.find(w => w.id === id) || workspaces[0]!;

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link
          href={`/workspaces/${params.id}`}
          className="p-2 rounded-md hover:bg-muted text-muted-foreground transition-colors"
          aria-label="Back to workspace"
        >
          <ArrowLeft size={20} aria-hidden="true" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Workspace Settings</h1>
          <p className="text-muted-foreground">Manage your workspace configuration.</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="p-6 rounded-xl border border-border bg-card shadow-sm space-y-6">
          <h2 className="text-lg font-semibold">General</h2>

          <div className="space-y-2">
            <label htmlFor="workspace-name" className="text-sm font-medium">Workspace Name</label>
            <input
              id="workspace-name"
              type="text"
              defaultValue={workspace.name}
              className="w-full px-3 py-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="workspace-url" className="text-sm font-medium">Workspace URL</label>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">hachi.app/</span>
              <input
                id="workspace-url"
                type="text"
                defaultValue={workspace.name.toLowerCase().replace(/\s+/g, '-')}
                className="flex-1 px-3 py-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-border flex justify-end">
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors shadow-sm">
              <Save size={16} aria-hidden="true" />
              Save Changes
            </button>
          </div>
        </div>

        <div className="p-6 rounded-xl border border-red-200 bg-red-50 dark:bg-red-950/10 dark:border-red-900/50 space-y-4" role="region" aria-labelledby="danger-zone-heading">
          <h2 id="danger-zone-heading" className="text-lg font-semibold text-red-600 dark:text-red-400">Danger Zone</h2>
          <p className="text-sm text-muted-foreground">
            Deleting a workspace is irreversible. All canvases, documents, and runs will be permanently removed.
          </p>
          <button className="flex items-center gap-2 px-4 py-2 border border-red-200 bg-white text-red-600 rounded-md font-medium hover:bg-red-50 transition-colors dark:bg-transparent dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/30">
            <Trash2 size={16} aria-hidden="true" />
            Delete Workspace
          </button>
        </div>
      </div>
    </div>
  );
}
