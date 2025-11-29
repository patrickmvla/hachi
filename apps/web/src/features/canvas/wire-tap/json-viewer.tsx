"use client";

import { Copy } from "lucide-react";

interface JsonViewerProps {
  data: unknown;
}

export const JsonViewer = ({ data }: JsonViewerProps) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
  };

  return (
    <div className="relative group">
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 p-1.5 rounded-md bg-[var(--muted)] text-[var(--muted-foreground)] opacity-0 group-hover:opacity-100 transition-opacity hover:text-[var(--foreground)]"
        title="Copy JSON"
      >
        <Copy size={14} />
      </button>
      <pre className="p-4 rounded-lg bg-[var(--muted)]/30 overflow-auto text-xs font-mono text-[var(--foreground)]">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
};
