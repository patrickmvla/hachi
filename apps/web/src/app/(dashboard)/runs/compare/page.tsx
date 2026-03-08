"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, GitCompare } from "lucide-react";
import { RunComparison } from "@/features/runs/run-comparison";

export default function RunComparisonPage() {
  const searchParams = useSearchParams();
  const runA = searchParams.get("a");
  const runB = searchParams.get("b");

  if (!runA || !runB) {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-3">
          <Link href="/runs" className="p-2 rounded-md hover:bg-muted text-muted-foreground">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">Compare Runs</h1>
        </div>
        <div className="p-8 text-center text-muted-foreground">
          Select two runs to compare. Use query params: <code>?a=runId&b=runId</code>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <Link href="/runs" className="p-2 rounded-md hover:bg-muted text-muted-foreground">
          <ArrowLeft size={20} />
        </Link>
        <GitCompare className="w-5 h-5 text-primary" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Compare Runs</h1>
          <p className="text-sm text-muted-foreground">
            {runA.slice(0, 8)}... vs {runB.slice(0, 8)}...
          </p>
        </div>
      </div>

      <RunComparison runIdA={runA} runIdB={runB} />
    </div>
  );
}
