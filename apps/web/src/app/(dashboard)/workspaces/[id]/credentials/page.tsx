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
            className="p-2 rounded-md hover:bg-[var(--muted)] text-[var(--muted-foreground)] transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Credentials</h1>
            <p className="text-[var(--muted-foreground)]">Manage API keys and database connections.</p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-md font-medium hover:bg-[var(--primary)]/90 transition-colors shadow-sm">
          <Plus size={16} />
          Add Credential
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {credentials.map((cred) => (
          <div key={cred.id} className="p-6 rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[var(--muted)] flex items-center justify-center font-bold text-lg">
                  {cred.provider.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold">{cred.provider}</h3>
                  <div className="text-sm text-[var(--muted-foreground)]">{cred.type}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-[var(--muted)] rounded text-[var(--muted-foreground)] hover:text-red-500 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-[var(--muted)]/50 p-3 rounded-md font-mono text-sm border border-[var(--border)]">
              <div className="flex-1 truncate">
                {showKey === cred.id ? "sk-proj-actual-api-key-would-be-here" : cred.masked}
              </div>
              <button 
                onClick={() => setShowKey(showKey === cred.id ? null : cred.id)}
                className="p-1.5 hover:bg-[var(--background)] rounded text-[var(--muted-foreground)] transition-colors"
              >
                {showKey === cred.id ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
              <button className="p-1.5 hover:bg-[var(--background)] rounded text-[var(--muted-foreground)] transition-colors">
                <Copy size={14} />
              </button>
            </div>

            <div className="flex items-center gap-4 mt-4 text-xs text-[var(--muted-foreground)]">
              <span>Added {cred.created}</span>
              <span>•</span>
              <span>Last used {cred.lastUsed}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
