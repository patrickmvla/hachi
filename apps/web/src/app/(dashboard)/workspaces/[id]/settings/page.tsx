"use client";

import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Save, Trash2, Loader2 } from "lucide-react";
import { authClient } from "@hachi/auth/client";
import { useState, useEffect } from "react";
import { useOrganization } from "@/features/workspaces/hooks/use-workspace-queries";

export default function WorkspaceSettingsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { data: org, isLoading } = useOrganization(id);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [domain, setDomain] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (org) {
      setName(org.name);
      setSlug(org.slug || "");
      setDomain((org as any).domain || "");
    }
  }, [org]);

  const handleSave = async () => {
    if (!name.trim()) return;
    setIsSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const { error: apiError } = await authClient.organization.update({
        data: {
          name: name.trim(),
          slug: slug.trim() || undefined,
          domain: domain.trim() || undefined,
        },
        organizationId: id,
      });
      if (apiError) {
        setError(apiError.message || "Failed to save changes");
      } else {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 2000);
      }
    } catch {
      setError("Failed to save changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this organization? This action is irreversible.")) return;
    setIsDeleting(true);
    setError(null);

    try {
      const { error: apiError } = await authClient.organization.delete({
        organizationId: id,
      });
      if (apiError) {
        setError(apiError.message || "Failed to delete organization");
        setIsDeleting(false);
      } else {
        router.push("/workspaces");
      }
    } catch {
      setError("Failed to delete organization. Please try again.");
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!org) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Organization not found
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link
          href={`/workspaces/${id}`}
          className="p-2 rounded-md hover:bg-muted text-muted-foreground transition-colors"
          aria-label="Back to organization"
        >
          <ArrowLeft size={20} aria-hidden="true" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Organization Settings</h1>
          <p className="text-muted-foreground">Manage your organization configuration.</p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm" role="alert">
          {error}
        </div>
      )}

      <div className="space-y-6">
        <div className="p-6 rounded-xl border border-border bg-card shadow-sm space-y-6">
          <h2 className="text-lg font-semibold">General</h2>

          <div className="space-y-2">
            <label htmlFor="org-name" className="text-sm font-medium">Organization Name</label>
            <input
              id="org-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="org-slug" className="text-sm font-medium">Organization URL</label>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">hachi.app/</span>
              <input
                id="org-slug"
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="flex-1 px-3 py-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="org-domain" className="text-sm font-medium">Domain</label>
            <input
              id="org-domain"
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="e.g. acme.com"
              className="w-full px-3 py-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="text-xs text-muted-foreground">
              Users signing up with @{domain || "domain"} emails will automatically join this organization.
            </p>
          </div>

          <div className="pt-4 border-t border-border flex justify-end">
            <button
              onClick={handleSave}
              disabled={isSaving || !name.trim()}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50"
            >
              {isSaving ? (
                <Loader2 size={16} className="animate-spin" />
              ) : success ? (
                "Saved!"
              ) : (
                <>
                  <Save size={16} aria-hidden="true" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>

        <div className="p-6 rounded-xl border border-red-200 bg-red-50 dark:bg-red-950/10 dark:border-red-900/50 space-y-4" role="region" aria-labelledby="danger-zone-heading">
          <h2 id="danger-zone-heading" className="text-lg font-semibold text-red-600 dark:text-red-400">Danger Zone</h2>
          <p className="text-sm text-muted-foreground">
            Deleting an organization is irreversible. All canvases, documents, and runs will be permanently removed.
          </p>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center gap-2 px-4 py-2 border border-red-200 bg-white text-red-600 rounded-md font-medium hover:bg-red-50 transition-colors dark:bg-transparent dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/30 disabled:opacity-50"
          >
            {isDeleting ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Trash2 size={16} aria-hidden="true" />
            )}
            {isDeleting ? "Deleting..." : "Delete Organization"}
          </button>
        </div>
      </div>
    </div>
  );
}
