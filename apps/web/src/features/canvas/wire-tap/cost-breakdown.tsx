"use client";

import type { ExecutionLogEntry } from "@/stores/execution-log-store";

interface CostBreakdownProps {
  entries: ExecutionLogEntry[];
}

export const CostBreakdown = ({ entries }: CostBreakdownProps) => {
  const entriesWithTrace = entries.filter((e) => e.trace);
  if (entriesWithTrace.length === 0) return null;

  const totals = {
    tokens: 0,
    cost: 0,
  };

  for (const entry of entriesWithTrace) {
    totals.tokens += entry.trace?.tokenCount?.total ?? 0;
    totals.cost += entry.trace?.cost?.total ?? 0;
  }

  return (
    <div className="overflow-auto">
      <table className="w-full text-[10px]">
        <thead>
          <tr className="border-b border-black/[0.06]">
            <th className="text-left py-1.5 px-2 font-semibold text-black/50">Node</th>
            <th className="text-left py-1.5 px-2 font-semibold text-black/50">Model</th>
            <th className="text-right py-1.5 px-2 font-semibold text-black/50">Tokens</th>
            <th className="text-right py-1.5 px-2 font-semibold text-black/50">Cost</th>
          </tr>
        </thead>
        <tbody>
          {entriesWithTrace.map((entry) => (
            <tr key={entry.id} className="border-b border-black/[0.03]">
              <td className="py-1.5 px-2 text-black/70 font-medium truncate max-w-[100px]">
                {entry.nodeName}
              </td>
              <td className="py-1.5 px-2 text-black/50 font-mono truncate max-w-[100px]">
                {entry.trace?.model ?? "-"}
              </td>
              <td className="py-1.5 px-2 text-black/50 font-mono text-right">
                {entry.trace?.tokenCount?.total?.toLocaleString() ?? "-"}
              </td>
              <td className="py-1.5 px-2 font-mono text-right">
                {entry.trace?.cost?.total != null ? (
                  <span className="text-amber-600">${entry.trace.cost.total.toFixed(6)}</span>
                ) : (
                  <span className="text-black/30">-</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t border-black/[0.08]">
            <td colSpan={2} className="py-1.5 px-2 font-semibold text-black/70">
              Total
            </td>
            <td className="py-1.5 px-2 font-mono font-semibold text-black/70 text-right">
              {totals.tokens > 0 ? totals.tokens.toLocaleString() : "-"}
            </td>
            <td className="py-1.5 px-2 font-mono font-semibold text-right">
              {totals.cost > 0 ? (
                <span className="text-amber-600">${totals.cost.toFixed(6)}</span>
              ) : (
                <span className="text-black/30">-</span>
              )}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};
