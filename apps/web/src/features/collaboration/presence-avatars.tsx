"use client";

interface User {
  id: string;
  name: string;
  color: string;
  avatarUrl?: string;
}

interface PresenceAvatarsProps {
  users: User[];
  max?: number;
}

export const PresenceAvatars = ({ users, max = 3 }: PresenceAvatarsProps) => {
  const displayUsers = users.slice(0, max);
  const remaining = users.length - max;

  return (
    <div className="flex items-center -space-x-2">
      {displayUsers.map((user) => (
        <div
          key={user.id}
          className="relative w-8 h-8 rounded-full border-2 border-[var(--background)] bg-[var(--muted)] flex items-center justify-center overflow-hidden"
          title={user.name}
          style={{ backgroundColor: user.color }}
        >
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-xs font-medium text-white">
              {user.name.slice(0, 2).toUpperCase()}
            </span>
          )}
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-[var(--background)]" />
        </div>
      ))}
      {remaining > 0 && (
        <div className="w-8 h-8 rounded-full border-2 border-[var(--background)] bg-[var(--muted)] flex items-center justify-center text-xs font-medium text-[var(--muted-foreground)]">
          +{remaining}
        </div>
      )}
    </div>
  );
};
