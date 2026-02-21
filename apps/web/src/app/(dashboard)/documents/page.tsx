"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { Search, FileText, MoreHorizontal, Filter, UploadCloud, File, X, Loader2 } from "lucide-react";
import { authClient } from "@hachi/auth/client";
import { useDocumentList } from "@/features/documents/hooks/use-document-queries";
import type { Document } from "@/features/documents/api/documents-api";
import {
  PageHeader,
  PageHeaderContent,
  PageHeaderTitle,
  PageHeaderDescription,
  PageHeaderActions,
  Empty,
  EmptyMedia,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
} from "@hachi/ui";

type FilterType = string | null;

export default function DocumentsPage() {
  const { data: activeOrg } = authClient.useActiveOrganization();
  const { data, isLoading } = useDocumentList(activeOrg?.id);
  const documents = data?.documents ?? [];

  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<FilterType>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Derive type from metadata or filename
  const getDocType = (doc: Document): string => {
    const meta = doc.metadata as Record<string, unknown> | null;
    if (meta?.type) return String(meta.type);
    if (meta?.filename) {
      const ext = String(meta.filename).split(".").pop()?.toUpperCase();
      if (ext) return ext;
    }
    return "Unknown";
  };

  // Get all unique document types
  const allTypes = useMemo(() => {
    const types = new Set<string>();
    documents.forEach(doc => {
      types.add(getDocType(doc));
    });
    return Array.from(types);
  }, [documents]);

  // Filter documents based on search and type filter
  const filteredDocuments = useMemo(() => {
    return documents.filter(doc => {
      const docName = (doc.metadata as any)?.filename || doc.id;
      const matchesSearch = searchQuery === "" ||
        String(docName).toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = filterType === null ||
        getDocType(doc) === filterType;

      return matchesSearch && matchesType;
    });
  }, [documents, searchQuery, filterType]);

  const clearFilters = () => {
    setSearchQuery("");
    setFilterType(null);
  };

  const hasActiveFilters = searchQuery !== "" || filterType !== null;

  if (!activeOrg) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Select an organization to view documents.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader>
        <PageHeaderContent>
          <PageHeaderTitle>Documents</PageHeaderTitle>
          <PageHeaderDescription>Manage your knowledge base for RAG.</PageHeaderDescription>
        </PageHeaderContent>
        <PageHeaderActions>
          <Link
            href="/documents/upload"
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors shadow-sm"
          >
            <UploadCloud size={16} aria-hidden="true" />
            Upload Documents
          </Link>
        </PageHeaderActions>
      </PageHeader>

      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full md:max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            aria-label="Search documents"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-3 py-2 rounded-md border transition-colors text-sm font-medium ${
                filterType ? "border-primary bg-primary/10 text-primary" : "border-border bg-background hover:bg-muted"
              }`}
              aria-expanded={showFilters}
              aria-haspopup="true"
            >
              <Filter size={16} aria-hidden="true" />
              {filterType || "Filter"}
            </button>
            {showFilters && (
              <div className="absolute top-full left-0 mt-2 w-48 rounded-md border border-border bg-card shadow-lg z-10" role="menu">
                <div className="p-2">
                  <button
                    onClick={() => { setFilterType(null); setShowFilters(false); }}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                      filterType === null ? "bg-primary/10 text-primary" : "hover:bg-muted"
                    }`}
                    role="menuitem"
                  >
                    All Types
                  </button>
                  {allTypes.map(type => (
                    <button
                      key={type}
                      onClick={() => { setFilterType(type); setShowFilters(false); }}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                        filterType === type ? "bg-primary/10 text-primary" : "hover:bg-muted"
                      }`}
                      role="menuitem"
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 px-2 py-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <X size={14} />
              Clear
            </button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-muted-foreground font-medium border-b border-border">
                <tr>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Type</th>
                  <th className="px-6 py-3">Embedded</th>
                  <th className="px-6 py-3">Created</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredDocuments.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12">
                      <Empty className="border-0">
                        <EmptyMedia variant="icon">
                          <File size={24} />
                        </EmptyMedia>
                        <EmptyHeader>
                          <EmptyTitle>No documents found</EmptyTitle>
                          <EmptyDescription>
                            {hasActiveFilters ? (
                              <>No documents match your filters. <button onClick={clearFilters} className="text-primary hover:underline">Clear filters</button></>
                            ) : (
                              <Link href="/documents/upload" className="text-primary hover:underline">
                                Upload your first document
                              </Link>
                            )}
                          </EmptyDescription>
                        </EmptyHeader>
                      </Empty>
                    </td>
                  </tr>
                ) : (
                  filteredDocuments.map((doc) => {
                    const docName = (doc.metadata as any)?.filename || doc.id;
                    return (
                      <tr key={doc.id} className="group hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4 font-medium flex items-center gap-3">
                          <div className="p-2 rounded bg-primary/10 text-primary">
                            <FileText size={16} aria-hidden="true" />
                          </div>
                          {docName}
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">
                          <span className="px-2 py-1 rounded-full bg-muted text-xs font-medium">
                            {getDocType(doc)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">
                          {doc.hasEmbedding ? "Yes" : "No"}
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">
                          {doc.createdAt ? new Date(doc.createdAt).toLocaleDateString() : "-"}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="p-2 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors" aria-label={`More actions for ${docName}`}>
                            <MoreHorizontal size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
