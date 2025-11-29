"use client";

import Link from "next/link";
import { UploadCloud, File, X, CheckCircle2, ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import { useState, useCallback } from "react";
import { documentsApi } from "@/lib/api";

interface UploadedFile {
  file: File;
  status: "pending" | "uploading" | "processing" | "done" | "error";
  documentId?: string;
  error?: string;
  progress?: string;
}

// TODO: Get from context or URL params
const WORKSPACE_ID = "00000000-0000-0000-0000-000000000000";

export default function UploadDocumentPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    addFiles(droppedFiles);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addFiles(Array.from(e.target.files));
    }
  };

  const addFiles = (newFiles: File[]) => {
    const validFiles = newFiles.filter((file) => {
      const ext = file.name.split(".").pop()?.toLowerCase();
      return ["txt", "md", "markdown", "csv", "json"].includes(ext || "");
    });
    setFiles((prev) => [
      ...prev,
      ...validFiles.map((file) => ({ file, status: "pending" as const })),
    ]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsText(file);
    });
  };

  const uploadFiles = useCallback(async () => {
    if (files.length === 0 || isUploading) return;

    setIsUploading(true);

    for (let i = 0; i < files.length; i++) {
      const uploadedFile = files[i];
      if (!uploadedFile || uploadedFile.status !== "pending") continue;

      // Update status to uploading
      setFiles((prev) =>
        prev.map((f, idx) =>
          idx === i ? { ...f, status: "uploading", progress: "Reading file..." } : f
        )
      );

      try {
        // Read file content
        const content = await readFileContent(uploadedFile.file);

        // Update progress
        setFiles((prev) =>
          prev.map((f, idx) =>
            idx === i ? { ...f, progress: "Uploading..." } : f
          )
        );

        // Upload document
        const uploadResult = await documentsApi.upload(
          WORKSPACE_ID,
          uploadedFile.file.name,
          content,
          {
            fileSize: uploadedFile.file.size,
            fileType: uploadedFile.file.type,
          }
        );

        if (uploadResult.error || !uploadResult.data) {
          throw new Error(uploadResult.error || "Upload failed");
        }

        const documentId = uploadResult.data.document.id;

        // Update progress
        setFiles((prev) =>
          prev.map((f, idx) =>
            idx === i
              ? { ...f, status: "processing", progress: "Processing & embedding...", documentId }
              : f
          )
        );

        // Process document (chunk + embed)
        const processResult = await documentsApi.process(documentId);

        if (processResult.error) {
          throw new Error(processResult.error);
        }

        // Update status to done
        setFiles((prev) =>
          prev.map((f, idx) =>
            idx === i
              ? {
                  ...f,
                  status: "done",
                  progress: `${processResult.data?.totalChunks} chunks created`,
                }
              : f
          )
        );
      } catch (error) {
        // Update status to error
        setFiles((prev) =>
          prev.map((f, idx) =>
            idx === i
              ? {
                  ...f,
                  status: "error",
                  error: error instanceof Error ? error.message : "Upload failed",
                }
              : f
          )
        );
      }
    }

    setIsUploading(false);
  }, [files, isUploading]);

  const pendingCount = files.filter((f) => f.status === "pending").length;
  const completedCount = files.filter((f) => f.status === "done").length;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link
          href="/documents"
          className="p-2 rounded-md hover:bg-[var(--muted)] text-[var(--muted-foreground)] transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Upload Documents</h1>
          <p className="text-[var(--muted-foreground)]">
            Add files to your knowledge base.
          </p>
        </div>
      </div>

      <div
        className={`
          border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200
          ${
            isDragging
              ? "border-[var(--primary)] bg-[var(--primary)]/5 scale-[1.02]"
              : "border-[var(--border)] bg-[var(--card)] hover:border-[var(--primary)]/50"
          }
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center gap-4">
          <div
            className={`p-4 rounded-full bg-[var(--muted)] ${
              isDragging ? "text-[var(--primary)]" : "text-[var(--muted-foreground)]"
            }`}
          >
            <UploadCloud size={32} />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-1">
              Drag and drop files here
            </h3>
            <p className="text-[var(--muted-foreground)] text-sm">
              Support for TXT, Markdown, CSV, and JSON (max 10MB)
            </p>
          </div>
          <div className="flex items-center gap-2 w-full max-w-xs my-4">
            <div className="h-px bg-[var(--border)] flex-1" />
            <span className="text-xs text-[var(--muted-foreground)] uppercase font-medium">
              Or
            </span>
            <div className="h-px bg-[var(--border)] flex-1" />
          </div>
          <label className="px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-md font-medium hover:bg-[var(--primary)]/90 transition-colors cursor-pointer">
            Browse Files
            <input
              type="file"
              multiple
              accept=".txt,.md,.markdown,.csv,.json"
              onChange={handleFileSelect}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {files.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">
              Files to upload ({files.length})
              {completedCount > 0 && (
                <span className="text-green-600 ml-2">
                  {completedCount} completed
                </span>
              )}
            </h3>
            {completedCount === files.length && files.length > 0 && (
              <Link
                href="/documents"
                className="text-sm text-[var(--primary)] hover:underline"
              >
                View Documents
              </Link>
            )}
          </div>
          <div className="space-y-2">
            {files.map((uploadedFile, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-lg border border-[var(--border)] bg-[var(--card)]"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded ${
                      uploadedFile.status === "done"
                        ? "bg-green-500/10 text-green-600"
                        : uploadedFile.status === "error"
                          ? "bg-red-500/10 text-red-600"
                          : "bg-[var(--primary)]/10 text-[var(--primary)]"
                    }`}
                  >
                    {uploadedFile.status === "done" ? (
                      <CheckCircle2 size={16} />
                    ) : uploadedFile.status === "error" ? (
                      <AlertCircle size={16} />
                    ) : uploadedFile.status === "uploading" ||
                      uploadedFile.status === "processing" ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <File size={16} />
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-medium">
                      {uploadedFile.file.name}
                    </div>
                    <div className="text-xs text-[var(--muted-foreground)]">
                      {uploadedFile.status === "error"
                        ? uploadedFile.error
                        : uploadedFile.progress ||
                          `${(uploadedFile.file.size / 1024).toFixed(1)} KB`}
                    </div>
                  </div>
                </div>
                {uploadedFile.status === "pending" && (
                  <button
                    onClick={() => removeFile(i)}
                    className="p-1 hover:bg-[var(--muted)] rounded text-[var(--muted-foreground)]"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
          {pendingCount > 0 && (
            <div className="flex justify-end pt-4">
              <button
                onClick={uploadFiles}
                disabled={isUploading}
                className="px-6 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-md font-medium hover:bg-[var(--primary)]/90 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isUploading && <Loader2 size={16} className="animate-spin" />}
                {isUploading ? "Uploading..." : `Upload ${pendingCount} Files`}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
