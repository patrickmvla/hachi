"use client";

import { Maximize2 } from "lucide-react";

export const EmbeddingViz = () => {
  return (
    <div className="relative w-full h-[300px] rounded-lg border border-border bg-card overflow-hidden flex items-center justify-center" role="img" aria-label="3D embedding space visualization">
      <div className="absolute top-3 right-3 z-10">
        <button className="p-1.5 rounded-md bg-background border border-border hover:bg-muted transition-colors" aria-label="Expand visualization">
          <Maximize2 size={14} aria-hidden="true" />
        </button>
      </div>

      {/* Mock Visualization Placeholder */}
      <div className="text-center">
        <div className="relative w-48 h-48 mx-auto mb-4 opacity-50" aria-hidden="true">
          <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-primary rounded-full -translate-x-1/2 -translate-y-1/2 shadow-[0_0_20px_var(--primary)]" />
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1.5 h-1.5 bg-muted-foreground rounded-full"
              style={{
                top: `${50 + Math.sin(i) * 40}%`,
                left: `${50 + Math.cos(i) * 40}%`,
                opacity: Math.random() * 0.5 + 0.2,
              }}
            />
          ))}
        </div>
        <p className="text-sm font-medium text-muted-foreground">
          3D Embedding Space
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          1,024 vectors projected to 3D (UMAP)
        </p>
      </div>
    </div>
  );
};
