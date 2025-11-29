"use client";

import Link from "next/link";
import { Search, Filter, Copy, ArrowRight, LayoutTemplate } from "lucide-react";
import { templates } from "@/lib/mock-data";

export default function TemplatesPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Templates</h1>
          <p className="text-[var(--muted-foreground)]">Start with a pre-built RAG architecture.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full md:max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" />
          <input
            type="text"
            placeholder="Search templates..."
            className="w-full pl-9 pr-3 py-2 rounded-md border border-[var(--border)] bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all"
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <button className="flex items-center gap-2 px-3 py-2 rounded-md border border-[var(--border)] bg-[var(--background)] hover:bg-[var(--muted)] transition-colors text-sm font-medium">
            <Filter size={16} />
            Filter Difficulty
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <div key={template.id} className="group flex flex-col p-6 rounded-xl border border-[var(--border)] bg-[var(--card)] hover:border-[var(--primary)]/50 transition-all shadow-sm hover:shadow-md h-full">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2.5 rounded-lg bg-[var(--primary)]/10 text-[var(--primary)] group-hover:bg-[var(--primary)] group-hover:text-[var(--primary-foreground)] transition-colors">
                <LayoutTemplate size={24} />
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                template.difficulty === 'Beginner' ? 'bg-green-500/10 text-green-600' :
                template.difficulty === 'Intermediate' ? 'bg-blue-500/10 text-blue-600' :
                template.difficulty === 'Advanced' ? 'bg-orange-500/10 text-orange-600' :
                'bg-red-500/10 text-red-600'
              }`}>
                {template.difficulty}
              </span>
            </div>
            
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-2 group-hover:text-[var(--primary)] transition-colors">{template.name}</h3>
              <p className="text-sm text-[var(--muted-foreground)] mb-4">{template.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {template.tags?.map(tag => (
                  <span key={tag} className="px-2 py-0.5 rounded-full bg-[var(--muted)] text-[10px] font-medium text-[var(--muted-foreground)]">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-[var(--border)]">
              <Link 
                href={`/canvases/new?template=${template.id}`}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-md font-medium hover:bg-[var(--primary)]/90 transition-colors shadow-sm text-sm"
              >
                <Copy size={16} />
                Use Template
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
