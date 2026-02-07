"use client";

import Link from "next/link";
import { ArrowLeft, Plus, Eye, EyeOff, Copy, Trash2 } from "lucide-react";
import { useState } from "react";
import { useParams } from "next/navigation";

export default function WorkspaceCredentialsPage() {
  const params = useParams();
  const id = params.id as string;
  const [showKey, setShowKey] = useState<string | null>(null);

  const credentials = [
    { id: "1", provider: "OpenAI", type: "API Key", created: "2 weeks ago", lastUsed: "2 hours ago", masked: "sk-proj-••••••••••••••••" },
    { id: "2", provider: "Pinecone", type: "API Key", created: "1 month ago", lastUsed: "1 day ago", masked: "pc-••••••••••••••••" },
    { id: "3", provider: "Supabase", type: "Connection String", created: "1 month ago", lastUsed: "5 mins ago", masked: "postgresql://••••••••••••••••" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href={`/workspaces/${params.id}`}
            className="p-2 rounded-md hover:bg-muted text-muted-foreground transition-colors"
            aria-label="Back to workspace"
          >
            <ArrowLeft size={20} aria-hidden="true" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Credentials</h1>
            <p className="text-muted-foreground">Manage API keys and database connections.</p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors shadow-sm">
          <Plus size={16} aria-hidden="true" />
          Add Credential
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4" role="list" aria-label="API credentials">
        {credentials.map((cred) => (
          <div key={cred.id} className="p-6 rounded-xl border border-border bg-card shadow-sm" role="listitem">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center font-bold text-lg" aria-hidden="true">
                  {cred.provider.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold">{cred.provider}</h3>
                  <div className="text-sm text-muted-foreground">{cred.type}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="p-2 hover:bg-muted rounded text-muted-foreground hover:text-red-500 transition-colors"
                  aria-label={`Delete ${cred.provider} credential`}
                >
                  <Trash2 size={16} aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-muted/50 p-3 rounded-md font-mono text-sm border border-border">
              <div className="flex-1 truncate" aria-label={showKey === cred.id ? "API key visible" : "API key hidden"}>
                {showKey === cred.id ? "sk-proj-actual-api-key-would-be-here" : cred.masked}
              </div>
              <button
                onClick={() => setShowKey(showKey === cred.id ? null : cred.id)}
                className="p-1.5 hover:bg-background rounded text-muted-foreground transition-colors"
                aria-label={showKey === cred.id ? "Hide API key" : "Show API key"}
              >
                {showKey === cred.id ? <EyeOff size={14} aria-hidden="true" /> : <Eye size={14} aria-hidden="true" />}
              </button>
              <button
                className="p-1.5 hover:bg-background rounded text-muted-foreground transition-colors"
                aria-label="Copy API key to clipboard"
              >
                <Copy size={14} aria-hidden="true" />
              </button>
            </div>

            <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
              <span>Added {cred.created}</span>
              <span aria-hidden="true">•</span>
              <span>Last used {cred.lastUsed}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
