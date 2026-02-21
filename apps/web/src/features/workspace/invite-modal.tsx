"use client";

import { useState } from "react";
import { X, Mail, Loader2 } from "lucide-react";
import { authClient } from "@hachi/auth/client";

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  organizationId: string;
}

export const InviteModal = ({ isOpen, onClose, organizationId }: InviteModalProps) => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"admin" | "editor" | "viewer">("editor");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleInvite = async () => {
    if (!email.trim()) return;
    setIsSending(true);
    setError(null);
    setSuccess(false);

    try {
      const { error: apiError } = await authClient.organization.inviteMember({
        email: email.trim(),
        role,
        organizationId,
      });

      if (apiError) {
        setError(apiError.message || "Failed to send invitation");
      } else {
        setSuccess(true);
        setEmail("");
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch {
      setError("Failed to send invitation. Please try again.");
    } finally {
      setIsSending(false);
    }
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
          {error && (
            <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm" role="alert">
              {error}
            </div>
          )}
          {success && (
            <div className="p-3 rounded-md bg-green-500/10 text-green-600 dark:text-green-400 text-sm" role="status">
              Invitation sent successfully!
            </div>
          )}

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
                onChange={(e) => setRole(e.target.value as "admin" | "editor" | "viewer")}
                className="px-3 py-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                aria-label="Select role"
              >
                <option value="admin">Admin</option>
                <option value="editor">Editor</option>
                <option value="viewer">Viewer</option>
              </select>
            </div>
            <button
              onClick={handleInvite}
              disabled={isSending || !email.trim()}
              className="w-full py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSending ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Invite"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
