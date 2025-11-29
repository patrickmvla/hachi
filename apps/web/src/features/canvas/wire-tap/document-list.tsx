"use client";

import { FileText, ExternalLink } from "lucide-react";

interface Document {
  id: string;
  title: string;
  content: string;
  score: number;
  source?: string;
}

interface DocumentListProps {
  documents: Document[];
}

export const DocumentList = ({ documents }: DocumentListProps) => {
  return (
    <div className="space-y-3">
      {documents.map((doc) => (
        <div
          key={doc.id}
          className="p-3 rounded-lg border border-[var(--border)] bg-[var(--card)] hover:border-[var(--primary)]/50 transition-colors"
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <FileText size={16} className="text-[var(--primary)]" />
              <span className="text-sm font-medium">{doc.title}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono bg-[var(--muted)] px-1.5 py-0.5 rounded">
                {doc.score.toFixed(3)}
              </span>
              {doc.source && (
                <a
                  href={doc.source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                >
                  <ExternalLink size={14} />
                </a>
              )}
            </div>
          </div>
          <p className="text-xs text-[var(--muted-foreground)] line-clamp-3 font-mono leading-relaxed">
            {doc.content}
          </p>
        </div>
      ))}
    </div>
  );
};
