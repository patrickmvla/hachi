"use client";

import { FileText, MoreVertical, Clock, Database } from "lucide-react";

interface Document {
  id: string;
  title: string;
  type: string;
  size: string;
  updatedAt: string;
  chunks: number;
}

interface DocumentCardProps {
  document: Document;
}

export const DocumentCard = ({ document }: DocumentCardProps) => {
  return (
    <div className="group relative p-4 rounded-lg border border-border bg-card hover:border-primary transition-all hover:shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
          <FileText size={20} />
        </div>
        <button
          className="p-1 hover:bg-muted rounded text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="More options"
        >
          <MoreVertical size={16} />
        </button>
      </div>

      <h3 className="font-semibold text-sm mb-1 truncate" title={document.title}>
        {document.title}
      </h3>

      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
        <span className="uppercase">{document.type}</span>
        <span>•</span>
        <span>{document.size}</span>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-border text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <Database size={12} />
          <span>{document.chunks} chunks</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock size={12} />
          <span>{document.updatedAt}</span>
        </div>
      </div>
    </div>
  );
};
