"use client";

import { MoreHorizontal, Shield, User } from "lucide-react";

interface Member {
  id: string;
  name: string;
  email: string;
  role: "owner" | "admin" | "member";
  avatarUrl?: string;
}

interface MemberListProps {
  members: Member[];
}

export const MemberList = ({ members }: MemberListProps) => {
  return (
    <div className="rounded-lg border border-[var(--border)] overflow-hidden">
      <table className="w-full text-sm text-left">
        <thead className="bg-[var(--muted)] text-[var(--muted-foreground)] uppercase text-xs font-medium">
          <tr>
            <th className="px-4 py-3">User</th>
            <th className="px-4 py-3">Role</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border)]">
          {members.map((member) => (
            <tr key={member.id} className="bg-[var(--background)] hover:bg-[var(--muted)]/30 transition-colors">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[var(--muted)] flex items-center justify-center overflow-hidden">
                    {member.avatarUrl ? (
                      <img src={member.avatarUrl} alt={member.name} className="w-full h-full object-cover" />
                    ) : (
                      <User size={16} className="text-[var(--muted-foreground)]" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium">{member.name}</div>
                    <div className="text-xs text-[var(--muted-foreground)]">{member.email}</div>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                  member.role === "owner"
                    ? "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800"
                    : member.role === "admin"
                    ? "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800"
                    : "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700"
                }`}>
                  {member.role === "owner" && <Shield size={10} />}
                  {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                </span>
              </td>
              <td className="px-4 py-3 text-right">
                <button className="p-1 hover:bg-[var(--muted)] rounded text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
                  <MoreHorizontal size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
