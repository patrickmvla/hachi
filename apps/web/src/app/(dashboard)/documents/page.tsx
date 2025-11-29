"use client";

import Link from "next/link";
import { Plus, Search, FileText, MoreHorizontal, Filter, UploadCloud, File } from "lucide-react";
import { documents } from "@/lib/mock-data";

export default function DocumentsPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Documents</h1>
          <p className="text-[var(--muted-foreground)]">Manage your knowledge base for RAG.</p>
        </div>
        <Link 
          href="/documents/upload" 
          className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-md font-medium hover:bg-[var(--primary)]/90 transition-colors shadow-sm"
        >
          <UploadCloud size={16} />
          Upload Documents
        </Link>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full md:max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" />
          <input
            type="text"
            placeholder="Search documents..."
            className="w-full pl-9 pr-3 py-2 rounded-md border border-[var(--border)] bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all"
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <button className="flex items-center gap-2 px-3 py-2 rounded-md border border-[var(--border)] bg-[var(--background)] hover:bg-[var(--muted)] transition-colors text-sm font-medium">
            <Filter size={16} />
            Filter
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-[var(--muted)]/50 text-[var(--muted-foreground)] font-medium border-b border-[var(--border)]">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">Size</th>
                <th className="px-6 py-3">Chunks</th>
                <th className="px-6 py-3">Uploaded</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {documents.map((doc) => (
                <tr key={doc.id} className="group hover:bg-[var(--muted)]/30 transition-colors">
                  <td className="px-6 py-4 font-medium flex items-center gap-3">
                    <div className="p-2 rounded bg-[var(--primary)]/10 text-[var(--primary)]">
                      <FileText size={16} />
                    </div>
                    {doc.name}
                  </td>
                  <td className="px-6 py-4 text-[var(--muted-foreground)]">
                    <span className="px-2 py-1 rounded-full bg-[var(--muted)] text-xs font-medium">
                      {doc.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[var(--muted-foreground)]">{doc.size}</td>
                  <td className="px-6 py-4 text-[var(--muted-foreground)]">{doc.chunks}</td>
                  <td className="px-6 py-4 text-[var(--muted-foreground)]">{doc.uploadedAt}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-[var(--muted)] rounded text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
                      <MoreHorizontal size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {documents.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[var(--muted-foreground)]">
                    <div className="flex flex-col items-center gap-2">
                      <File size={32} className="opacity-20" />
                      <p>No documents found</p>
                      <Link href="/documents/upload" className="text-[var(--primary)] hover:underline">
                        Upload your first document
                      </Link>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
