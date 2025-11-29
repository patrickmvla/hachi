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
          className="p-2 rounded-md hover:bg-[var(--muted)] text-[var(--muted-foreground)] transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Workspace Settings</h1>
          <p className="text-[var(--muted-foreground)]">Manage your workspace configuration.</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="p-6 rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-sm space-y-6">
          <h2 className="text-lg font-semibold">General</h2>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Workspace Name</label>
            <input 
              type="text" 
              defaultValue={workspace.name}
              className="w-full px-3 py-2 rounded-md border border-[var(--border)] bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Workspace URL</label>
            <div className="flex items-center gap-2">
              <span className="text-[var(--muted-foreground)]">hachi.app/</span>
              <input 
                type="text" 
                defaultValue={workspace.name.toLowerCase().replace(/\s+/g, '-')}
                className="flex-1 px-3 py-2 rounded-md border border-[var(--border)] bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-[var(--border)] flex justify-end">
            <button className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-md font-medium hover:bg-[var(--primary)]/90 transition-colors shadow-sm">
              <Save size={16} />
              Save Changes
            </button>
          </div>
        </div>

        <div className="p-6 rounded-xl border border-red-200 bg-red-50 dark:bg-red-950/10 dark:border-red-900/50 space-y-4">
          <h2 className="text-lg font-semibold text-red-600 dark:text-red-400">Danger Zone</h2>
          <p className="text-sm text-[var(--muted-foreground)]">
            Deleting a workspace is irreversible. All canvases, documents, and runs will be permanently removed.
          </p>
          <button className="flex items-center gap-2 px-4 py-2 border border-red-200 bg-white text-red-600 rounded-md font-medium hover:bg-red-50 transition-colors dark:bg-transparent dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/30">
            <Trash2 size={16} />
            Delete Workspace
          </button>
        </div>
      </div>
    </div>
  );
}
