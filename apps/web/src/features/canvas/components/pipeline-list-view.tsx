"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  MoreHorizontal,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  Copy,
  Trash2,
} from "lucide-react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
  type Column,
} from "@tanstack/react-table";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cn } from "@hachi/ui/lib/utils";
import { StatusBadge } from "@hachi/ui";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@hachi/ui/components/dropdown-menu";
import { PipelineViz } from "./pipeline-viz";
import { deleteCanvas, createCanvas, fetchCanvas } from "../api/canvas-api";
import type { Canvas } from "../api/canvas-api";
import { formatRelativeDate } from "@/lib/format-date";
import { queryKeys } from "@/lib/query-keys";

function formatDuration(ms: number) {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60_000) return `${(ms / 1000).toFixed(1)}s`;
  return `${(ms / 60_000).toFixed(1)}m`;
}

function formatCost(cost: number) {
  if (cost === 0) return "$0.00";
  if (cost < 0.01) return `$${cost.toFixed(4)}`;
  return `$${cost.toFixed(2)}`;
}

function getNodeCount(canvas: Canvas) {
  return canvas.graphJson?.nodes?.length || 0;
}

function getGraphNodes(canvas: Canvas) {
  return (canvas.graphJson?.nodes ?? []) as Array<{ id: string; data: { type: string } }>;
}

function statusBorderColor(status: string | null | undefined): string {
  switch (status) {
    case "completed": return "border-l-green-500";
    case "failed": return "border-l-red-500";
    case "running": return "border-l-blue-500";
    default: return "border-l-border";
  }
}

const col = createColumnHelper<Canvas>();

const columns = [
  col.accessor("name", {
    header: "Name",
    cell: (info) => (
      <Link href={`/pipelines/${info.row.original.id}`} className="font-medium hover:text-primary flex items-center gap-2">
        <span className="truncate">{info.getValue()}</span>
        <span className="text-[10px] text-muted-foreground shrink-0">{getNodeCount(info.row.original)}n</span>
      </Link>
    ),
    sortingFn: "text",
  }),
  col.display({
    id: "pipeline",
    header: "Pipeline",
    cell: (info) => <PipelineViz nodes={getGraphNodes(info.row.original)} />,
    meta: { className: "hidden lg:table-cell" },
  }),
  col.accessor((row) => row.runSummary?.lastRunStatus ?? null, {
    id: "status",
    header: "Status",
    cell: (info) => {
      const status = info.getValue();
      if (!status) return <span className="text-xs text-muted-foreground">—</span>;
      return (
        <StatusBadge
          status={status === "completed" ? "completed" : status === "failed" ? "failed" : status === "running" ? "running" : "pending"}
        />
      );
    },
    meta: { className: "hidden sm:table-cell" },
  }),
  col.accessor((row) => row.runSummary?.totalRuns ?? 0, {
    id: "runs",
    header: "Runs",
    cell: (info) => {
      const summary = info.row.original.runSummary;
      if (!summary || summary.totalRuns === 0) return <span className="text-xs text-muted-foreground">—</span>;
      return (
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-green-600">{summary.completed}</span>
          <span className="text-muted-foreground">/</span>
          <span className="text-red-500">{summary.failed}</span>
        </div>
      );
    },
    meta: { className: "hidden md:table-cell" },
  }),
  col.accessor((row) => row.runSummary?.avgDurationMs ?? 0, {
    id: "duration",
    header: "Avg Duration",
    cell: (info) => {
      const v = info.getValue();
      return <span className="text-xs text-muted-foreground">{v > 0 ? formatDuration(v) : "—"}</span>;
    },
    meta: { className: "hidden md:table-cell" },
  }),
  col.accessor((row) => row.runSummary?.totalCost ?? 0, {
    id: "cost",
    header: "Cost",
    cell: (info) => {
      const v = info.getValue();
      return <span className="text-xs text-muted-foreground">{v > 0 ? formatCost(v) : "—"}</span>;
    },
    meta: { className: "hidden lg:table-cell" },
  }),
  col.accessor("updatedAt", {
    header: "Updated",
    cell: (info) => <span className="text-xs text-muted-foreground">{formatRelativeDate(info.getValue())}</span>,
    sortingFn: "datetime",
  }),
  col.display({
    id: "actions",
    header: "",
    cell: (info) => <RowActions canvas={info.row.original} />,
    meta: { className: "w-10 text-right" },
  }),
];

function RowActions({ canvas }: { canvas: Canvas }) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const duplicateMutation = useMutation({
    mutationFn: async () => {
      const source = await fetchCanvas(canvas.id);
      return createCanvas(
        canvas.organizationId!,
        `${canvas.name} (copy)`,
        source.graphJson || { nodes: [], edges: [] },
      );
    },
    onSuccess: (newCanvas) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.canvases.all });
      router.push(`/pipelines/${newCanvas.id}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteCanvas(canvas.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.canvases.all });
    },
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="p-1.5 hover:bg-muted rounded text-muted-foreground"
          aria-label={`More options for ${canvas.name}`}
        >
          <MoreHorizontal size={14} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem onClick={() => router.push(`/pipelines/${canvas.id}`)}>
          <ExternalLink size={14} />
          Open
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => duplicateMutation.mutate()}
          disabled={duplicateMutation.isPending}
        >
          <Copy size={14} />
          Duplicate
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => deleteMutation.mutate()}
          disabled={deleteMutation.isPending}
          className="text-destructive focus:text-destructive"
        >
          <Trash2 size={14} />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function SortableHeader({ column, children }: { column: Column<Canvas, unknown>; children: React.ReactNode }) {
  const sorted = column.getIsSorted();
  if (!column.getCanSort()) return <span>{children}</span>;

  return (
    <button
      className="flex items-center gap-1 hover:text-foreground transition-colors"
      onClick={column.getToggleSortingHandler()}
    >
      {children}
      {sorted === "asc" ? (
        <ArrowUp size={12} />
      ) : sorted === "desc" ? (
        <ArrowDown size={12} />
      ) : (
        <ArrowUpDown size={12} className="opacity-40" />
      )}
    </button>
  );
}

export function PipelineListView({ data }: { data: Canvas[] }) {
  const [sorting, setSorting] = useState<SortingState>([{ id: "updatedAt", desc: true }]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-muted/50 text-muted-foreground text-xs font-medium border-b border-border">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const meta = header.column.columnDef.meta as { className?: string } | undefined;
                return (
                  <th key={header.id} className={cn("px-4 py-2.5 text-left", meta?.className)}>
                    {header.isPlaceholder ? null : header.column.getCanSort() ? (
                      <SortableHeader column={header.column}>
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </SortableHeader>
                    ) : (
                      flexRender(header.column.columnDef.header, header.getContext())
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y divide-border">
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className={cn(
                "hover:bg-muted/30 transition-colors border-l-[3px]",
                statusBorderColor(row.original.runSummary?.lastRunStatus)
              )}
            >
              {row.getVisibleCells().map((cell) => {
                const meta = cell.column.columnDef.meta as { className?: string } | undefined;
                return (
                  <td key={cell.id} className={cn("px-4 py-3", meta?.className)}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
