"use client";

import { useState } from "react";
import { X, Mail, Link as LinkIcon, Check } from "lucide-react";

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InviteModal = ({ isOpen, onClose }: InviteModalProps) => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("member");
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText("https://hachi.app/invite/abc-123");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[var(--background)] rounded-lg shadow-xl border border-[var(--border)] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
          <h2 className="text-lg font-semibold">Invite Members</h2>
          <button onClick={onClose} className="p-1 hover:bg-[var(--muted)] rounded transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-md border border-[var(--border)] bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                />
              </div>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="px-3 py-2 rounded-md border border-[var(--border)] bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              >
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button className="w-full py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-md font-medium hover:bg-[var(--primary)]/90 transition-colors">
              Send Invite
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-[var(--border)]" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[var(--background)] px-2 text-[var(--muted-foreground)]">Or share link</span>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 rounded-md bg-[var(--muted)]/50 border border-[var(--border)]">
            <div className="p-2 bg-[var(--background)] rounded-full border border-[var(--border)]">
              <LinkIcon size={14} className="text-[var(--muted-foreground)]" />
            </div>
            <div className="flex-1 text-sm font-mono text-[var(--muted-foreground)] truncate">
              https://hachi.app/invite/abc-123
            </div>
            <button
              onClick={handleCopyLink}
              className="px-3 py-1.5 text-xs font-medium bg-[var(--background)] border border-[var(--border)] rounded hover:bg-[var(--muted)] transition-colors flex items-center gap-1"
            >
              {copied ? <Check size={12} className="text-green-500" /> : null}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
