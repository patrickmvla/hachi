"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { UserPlus, Loader2 } from "lucide-react";
import { authClient } from "@hachi/auth/client";
import { useState, useEffect } from "react";

export default function InvitePage() {
  const params = useParams();
  const router = useRouter();
  const invitationId = params.token as string;
  const { data: session } = authClient.useSession();
  const [isAccepting, setIsAccepting] = useState(false);
  const [isDeclining, setIsDeclining] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAccept = async () => {
    if (!session) {
      // Must be logged in to accept — redirect to sign in
      router.push(`/sign-in?redirect=/invite/${invitationId}`);
      return;
    }
    setIsAccepting(true);
    setError(null);

    try {
      const { error: apiError } = await authClient.organization.acceptInvitation({
        invitationId,
      });
      if (apiError) {
        setError(apiError.message || "Failed to accept invitation");
        setIsAccepting(false);
      } else {
        router.push("/workspaces");
      }
    } catch {
      setError("Failed to accept invitation. Please try again.");
      setIsAccepting(false);
    }
  };

  const handleDecline = async () => {
    setIsDeclining(true);
    setError(null);

    try {
      await authClient.organization.rejectInvitation({
        invitationId,
      });
      router.push("/");
    } catch {
      setError("Failed to decline invitation.");
      setIsDeclining(false);
    }
  };

  return (
    <div className="bg-background border border-border rounded-xl shadow-sm p-8 text-center" role="main">
      <div className="w-16 h-16 bg-primary/10 text-primary rounded-full mx-auto mb-6 flex items-center justify-center" aria-hidden="true">
        <UserPlus size={32} />
      </div>

      <h2 className="text-xl font-semibold mb-2">You've been invited!</h2>
      <p className="text-muted-foreground mb-6">
        You've been invited to join an organization on Hachi.
        {!session && " Please sign in to accept the invitation."}
      </p>

      {error && (
        <div className="mb-4 p-3 rounded-md bg-destructive/10 text-destructive text-sm" role="alert">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <button
          onClick={handleAccept}
          disabled={isAccepting}
          className="block w-full py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isAccepting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Accepting...
            </>
          ) : (
            session ? "Accept Invitation" : "Sign In to Accept"
          )}
        </button>
        <button
          onClick={handleDecline}
          disabled={isDeclining}
          className="block w-full text-sm text-muted-foreground hover:text-foreground disabled:opacity-50"
        >
          {isDeclining ? "Declining..." : "Decline"}
        </button>
      </div>
    </div>
  );
}
