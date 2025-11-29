"use client";

import Link from "next/link";
import { Check, UserPlus } from "lucide-react";
import { useParams } from "next/navigation";

export default function InvitePage() {
  const params = useParams();
  const token = params.token as string;
  return (
    <div className="bg-[var(--background)] border border-[var(--border)] rounded-xl shadow-sm p-8 text-center">
      <div className="w-16 h-16 bg-[var(--primary)]/10 text-[var(--primary)] rounded-full mx-auto mb-6 flex items-center justify-center">
        <UserPlus size={32} />
      </div>
      
      <h2 className="text-xl font-semibold mb-2">You've been invited!</h2>
      <p className="text-[var(--muted-foreground)] mb-6">
        <span className="font-medium text-[var(--foreground)]">Alice Smith</span> has invited you to join the <span className="font-medium text-[var(--foreground)]">Acme Corp</span> workspace on Hachi.
      </p>

      <div className="space-y-4">
        <Link href="/signup" className="block w-full py-2.5 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg font-medium hover:bg-[var(--primary)]/90 transition-colors">
          Accept Invitation
        </Link>
        <Link href="/" className="block text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
          Decline
        </Link>
      </div>
    </div>
  );
}
