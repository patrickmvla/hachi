"use client";

import Link from "next/link";
import { ArrowLeft, FileText, Download, Trash2, Database, Search } from "lucide-react";
import { documents } from "@/lib/mock-data";
import { useParams } from "next/navigation";

export default function DocumentDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const document = documents.find(d => d.id === id) || documents[0]!;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/documents"
            className="p-2 rounded-md hover:bg-muted text-muted-foreground transition-colors"
            aria-label="Back to documents"
          >
            <ArrowLeft size={20} aria-hidden="true" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{document.name}</h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{document.size}</span>
              <span aria-hidden="true">•</span>
              <span>{document.chunks} chunks</span>
              <span aria-hidden="true">•</span>
              <span>Uploaded {document.uploadedAt}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="p-2 rounded-md border border-border bg-background hover:bg-muted transition-colors text-muted-foreground"
            aria-label="Download document"
          >
            <Download size={20} aria-hidden="true" />
          </button>
          <button
            className="p-2 rounded-md border border-border bg-background hover:bg-muted transition-colors text-red-500 hover:text-red-600"
            aria-label="Delete document"
          >
            <Trash2 size={20} aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Chunks</h2>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
              <input
                type="text"
                placeholder="Search chunks..."
                className="pl-8 pr-3 py-1.5 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                aria-label="Search chunks"
              />
            </div>
          </div>

          <div className="space-y-4" role="list" aria-label="Document chunks">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="p-4 rounded-xl border border-border bg-card hover:border-primary/30 transition-colors" role="listitem">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs font-mono text-muted-foreground">Chunk #{i}</div>
                  <div className="text-xs font-mono text-muted-foreground">256 tokens</div>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-6 rounded-xl border border-border bg-card space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Database size={16} aria-hidden="true" />
              Metadata
            </h3>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-border">
                <dt className="text-muted-foreground">Type</dt>
                <dd className="font-medium">{document.type}</dd>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <dt className="text-muted-foreground">Embedding Model</dt>
                <dd className="font-medium">text-embedding-3-small</dd>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <dt className="text-muted-foreground">Dimensions</dt>
                <dd className="font-medium">1536</dd>
              </div>
              <div className="flex justify-between py-2">
                <dt className="text-muted-foreground">Collection</dt>
                <dd className="font-medium">products_v2</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
