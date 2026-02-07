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
    <div className="p-4 rounded-lg border border-border bg-card">
      <div className="flex items-center gap-2 mb-3">
        <Key size={16} className="text-primary" aria-hidden="true" />
        <h3 className="font-medium text-sm">{label}</h3>
        <span className="text-xs text-muted-foreground ml-auto font-mono">{provider}</span>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type={isVisible ? "text" : "password"}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder || "sk-..."}
            className="w-full pl-3 pr-10 py-2 text-sm rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary font-mono"
            aria-label={label}
          />
          <button
            onClick={() => setIsVisible(!isVisible)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label={isVisible ? "Hide value" : "Show value"}
          >
            {isVisible ? <EyeOff size={14} aria-hidden="true" /> : <Eye size={14} aria-hidden="true" />}
          </button>
        </div>
        <button
          onClick={handleSave}
          disabled={!value}
          className={`px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors ${
            isSaved
              ? "bg-green-500 text-white"
              : "bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          }`}
        >
          {isSaved ? <CheckIcon /> : <Save size={16} aria-hidden="true" />}
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
