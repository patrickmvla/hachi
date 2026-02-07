"use client";

import Link from "next/link";
import { Canvas } from "@/features/canvas/canvas";
import { FlaskConical, X } from "lucide-react";
import { useState } from "react";

export default function SandboxPage() {
  const [showBanner, setShowBanner] = useState(true);

  return (
    <div className="h-screen w-screen flex flex-col">
      {showBanner && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
            <FlaskConical size={16} />
            <span>
              <strong>Sandbox Mode</strong> — Changes are saved to your browser only.{" "}
              <Link href="/canvases/new" className="underline hover:no-underline">
                Create an account
              </Link>{" "}
              to save to the cloud.
            </span>
          </div>
          <button
            onClick={() => setShowBanner(false)}
            className="p-1 hover:bg-amber-500/20 rounded text-amber-600 dark:text-amber-400"
            aria-label="Dismiss"
          >
            <X size={14} />
          </button>
        </div>
      )}
      <div className="flex-1">
        <Canvas />
      </div>
    </div>
  );
}
