"use client";

import { useState } from "react";
import { Eye, EyeOff, Key, Save } from "lucide-react";

interface CredentialFormProps {
  provider: string;
  label: string;
  placeholder?: string;
}

export const CredentialForm = ({ provider, label, placeholder }: CredentialFormProps) => {
  const [value, setValue] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    // Mock save
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--card)]">
      <div className="flex items-center gap-2 mb-3">
        <Key size={16} className="text-[var(--primary)]" />
        <h3 className="font-medium text-sm">{label}</h3>
        <span className="text-xs text-[var(--muted-foreground)] ml-auto font-mono">{provider}</span>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type={isVisible ? "text" : "password"}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder || "sk-..."}
            className="w-full pl-3 pr-10 py-2 text-sm rounded-md border border-[var(--border)] bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] font-mono"
          />
          <button
            onClick={() => setIsVisible(!isVisible)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
          >
            {isVisible ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        </div>
        <button
          onClick={handleSave}
          disabled={!value}
          className={`px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors ${
            isSaved
              ? "bg-green-500 text-white"
              : "bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary)]/90 disabled:opacity-50 disabled:cursor-not-allowed"
          }`}
        >
          {isSaved ? <CheckIcon /> : <Save size={16} />}
          {isSaved ? "Saved" : "Save"}
        </button>
      </div>
    </div>
  );
};

const CheckIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
};
