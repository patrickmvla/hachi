"use client";

import Link from "next/link";
import { Plus, Search, FileText, MoreHorizontal, Clock, Filter, Grid, List } from "lucide-react";
import { recentCanvases } from "@/lib/mock-data";

export default function CanvasesPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Canvases</h1>
          <p className="text-[var(--muted-foreground)]">Design and manage your RAG architectures.</p>
        </div>
        <Link 
          href="/canvases/new" 
          className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-md font-medium hover:bg-[var(--primary)]/90 transition-colors shadow-sm"
        >
          <Plus size={16} />
          New Canvas
        </Link>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full md:max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" />
          <input
            type="text"
            placeholder="Search canvases..."
            className="w-full pl-9 pr-3 py-2 rounded-md border border-[var(--border)] bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all"
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <button className="flex items-center gap-2 px-3 py-2 rounded-md border border-[var(--border)] bg-[var(--background)] hover:bg-[var(--muted)] transition-colors text-sm font-medium">
            <Filter size={16} />
            Filter
          </button>
          <div className="h-6 w-px bg-[var(--border)] mx-1 hidden md:block" />
          <div className="flex bg-[var(--muted)] p-1 rounded-md">
            <button className="p-1.5 rounded bg-[var(--background)] shadow-sm text-[var(--foreground)]">
              <Grid size={16} />
            </button>
            <button className="p-1.5 rounded text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {recentCanvases.map((canvas) => (
          <Link 
            key={canvas.id} 
            href={`/canvases/${canvas.id}`}
            className="group flex flex-col p-5 rounded-xl border border-[var(--border)] bg-[var(--card)] hover:border-[var(--primary)]/50 transition-all shadow-sm hover:shadow-md h-full"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-2.5 rounded-lg bg-[var(--primary)]/10 text-[var(--primary)] group-hover:bg-[var(--primary)] group-hover:text-[var(--primary-foreground)] transition-colors">
                <FileText size={20} />
              </div>
              <button className="p-1 hover:bg-[var(--muted)] rounded text-[var(--muted-foreground)] opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreHorizontal size={16} />
              </button>
            </div>
            
            <div className="flex-1">
              <h3 className="font-semibold mb-1 line-clamp-1 group-hover:text-[var(--primary)] transition-colors">{canvas.name}</h3>
              <p className="text-sm text-[var(--muted-foreground)] line-clamp-2 mb-4 h-10">{canvas.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {canvas.tags?.map(tag => (
                  <span key={tag} className="px-2 py-0.5 rounded-full bg-[var(--muted)] text-[10px] font-medium text-[var(--muted-foreground)]">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[var(--border)] text-xs text-[var(--muted-foreground)]">
              <div className="flex items-center gap-1">
                <Clock size={12} />
                {canvas.updatedAt}
              </div>
              <div>
                {canvas.nodes} nodes
              </div>
            </div>
          </Link>
        ))}
        
        <Link 
          href="/canvases/new"
          className="flex flex-col items-center justify-center gap-3 p-5 rounded-xl border border-dashed border-[var(--border)] hover:border-[var(--primary)] hover:bg-[var(--muted)]/30 transition-all text-[var(--muted-foreground)] hover:text-[var(--primary)] group h-full min-h-[200px]"
        >
          <div className="p-3 rounded-full bg-[var(--muted)] group-hover:bg-[var(--primary)]/10 transition-colors">
            <Plus size={24} />
          </div>
          <span className="font-medium">Create New Canvas</span>
        </Link>
      </div>
    </div>
  );
}
