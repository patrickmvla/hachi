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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="invite-modal-title"
    >
      <div className="w-full max-w-md bg-background rounded-lg shadow-xl border border-border overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 id="invite-modal-title" className="text-lg font-semibold">Invite Members</h2>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded transition-colors" aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  aria-label="Email address"
                />
              </div>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="px-3 py-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                aria-label="Select role"
              >
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button className="w-full py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors">
              Send Invite
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" aria-hidden="true" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or share link</span>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 rounded-md bg-muted/50 border border-border">
            <div className="p-2 bg-background rounded-full border border-border">
              <LinkIcon size={14} className="text-muted-foreground" aria-hidden="true" />
            </div>
            <div className="flex-1 text-sm font-mono text-muted-foreground truncate" aria-label="Invite link">
              https://hachi.app/invite/abc-123
            </div>
            <button
              onClick={handleCopyLink}
              className="px-3 py-1.5 text-xs font-medium bg-background border border-border rounded hover:bg-muted transition-colors flex items-center gap-1"
              aria-label={copied ? "Link copied" : "Copy invite link"}
            >
              {copied ? <Check size={12} className="text-green-500" aria-hidden="true" /> : null}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
