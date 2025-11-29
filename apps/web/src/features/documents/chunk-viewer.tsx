"use client";

import { Search } from "lucide-react";

interface Chunk {
  id: string;
  content: string;
  tokenCount: number;
  index: number;
}

interface ChunkViewerProps {
  chunks: Chunk[];
}

export const ChunkViewer = ({ chunks }: ChunkViewerProps) => {
  return (
    <div className="flex flex-col h-full border border-[var(--border)] rounded-lg overflow-hidden bg-[var(--card)]">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)] bg-[var(--muted)]/30">
        <h3 className="font-medium text-sm">Document Chunks</h3>
        <div className="relative w-48">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" />
          <input
            type="text"
            placeholder="Search chunks..."
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-md border border-[var(--border)] bg-[var(--background)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chunks.map((chunk) => (
          <div key={chunk.id} className="p-3 rounded-md border border-[var(--border)] bg-[var(--background)] hover:border-[var(--primary)]/50 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-[var(--muted-foreground)]">
                Chunk #{chunk.index}
              </span>
              <span className="text-xs font-mono bg-[var(--muted)] px-1.5 py-0.5 rounded text-[var(--muted-foreground)]">
                {chunk.tokenCount} tokens
              </span>
            </div>
            <p className="text-sm text-[var(--foreground)] leading-relaxed font-mono whitespace-pre-wrap">
              {chunk.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
