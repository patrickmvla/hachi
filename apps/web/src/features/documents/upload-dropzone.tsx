"use client";

import { useState, useCallback } from "react";
import { UploadCloud, File, X } from "lucide-react";

export const UploadDropzone = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFiles((prev) => [...prev, ...Array.from(e.dataTransfer.files)]);
    }
  }, []);

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full">
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`
          border-2 border-dashed rounded-lg p-10 text-center transition-colors cursor-pointer
          ${isDragging
            ? "border-[var(--primary)] bg-[var(--primary)]/5"
            : "border-[var(--border)] hover:border-[var(--primary)]/50 hover:bg-[var(--muted)]/30"
          }
        `}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 rounded-full bg-[var(--muted)]">
            <UploadCloud size={32} className="text-[var(--muted-foreground)]" />
          </div>
          <div>
            <p className="text-lg font-medium">Click to upload or drag and drop</p>
            <p className="text-sm text-[var(--muted-foreground)] mt-1">
              PDF, TXT, MD, or DOCX (max 10MB)
            </p>
          </div>
          <button className="px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-md font-medium hover:bg-[var(--primary)]/90 transition-colors">
            Select Files
          </button>
        </div>
      </div>

      {files.length > 0 && (
        <div className="mt-6 space-y-3">
          <h3 className="text-sm font-medium text-[var(--muted-foreground)]">Selected Files</h3>
          {files.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-[var(--border)] bg-[var(--card)]">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded bg-[var(--muted)]">
                  <File size={16} className="text-[var(--muted-foreground)]" />
                </div>
                <div>
                  <p className="text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>
              <button
                onClick={() => removeFile(index)}
                className="p-1 hover:bg-[var(--muted)] rounded text-[var(--muted-foreground)] hover:text-[var(--destructive)]"
              >
                <X size={16} />
              </button>
            </div>
          ))}
          <div className="flex justify-end mt-4">
            <button className="px-6 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-md font-medium hover:bg-[var(--primary)]/90 transition-colors">
              Upload {files.length} Files
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
