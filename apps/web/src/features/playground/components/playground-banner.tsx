"use client";

import { useState } from "react";
import Link from "next/link";
import { Map, X, ArrowLeft } from "lucide-react";

export function PlaygroundBanner() {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  return (
    <div className="bg-blue-500/10 border-b border-blue-500/20 px-4 py-2 flex items-center justify-between text-sm">
      <div className="flex items-center gap-2 text-blue-600">
        <Link
          href="/"
          className="inline-flex items-center gap-1 hover:underline"
        >
          <ArrowLeft size={14} />
          Home
        </Link>
        <span className="text-blue-400">|</span>
        <Map size={16} />
        <span>
          <strong>Playground</strong> — Explore RAG pipelines interactively.{" "}
          <Link href="/signup" className="underline hover:no-underline">
            Create an account
          </Link>{" "}
          to build your own.
        </span>
      </div>
      <button
        onClick={() => setVisible(false)}
        className="p-1 hover:bg-blue-500/20 rounded text-blue-600"
        aria-label="Dismiss banner"
      >
        <X size={14} />
      </button>
    </div>
  );
}
