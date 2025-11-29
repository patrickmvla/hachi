import type { UserAwareness, UserPresence } from "./types";

/**
 * Generate a random color for user presence
 */
export const generateUserColor = (userId: string): string => {
  const colors = [
    "#E57373", // Red
    "#81C784", // Green
    "#64B5F6", // Blue
    "#FFB74D", // Orange
    "#BA68C8", // Purple
    "#4DD0E1", // Cyan
    "#F06292", // Pink
    "#AED581", // Light Green
    "#FF8A65", // Deep Orange
    "#9575CD", // Deep Purple
  ];

  // Generate consistent color based on user ID
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash);
  }

  return colors[Math.abs(hash) % colors.length]!;
};

/**
 * Create user presence from user data
 */
export const createUserPresence = (user: {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}): UserPresence => ({
  id: user.id,
  name: user.name,
  email: user.email,
  color: generateUserColor(user.id),
  avatarUrl: user.avatarUrl,
});

/**
 * Filter active users (active within last 5 minutes)
 */
export const filterActiveUsers = (
  users: UserAwareness[],
  timeoutMs: number = 5 * 60 * 1000
): UserAwareness[] => {
  const now = Date.now();
  return users.filter(
    (u) => u.isActive && now - u.lastActiveAt < timeoutMs
  );
};

/**
 * Get users with active cursors
 */
export const getUsersWithCursors = (users: UserAwareness[]): UserAwareness[] => {
  return users.filter((u) => u.cursor !== null && u.isActive);
};

/**
 * Sort users by last active time (most recent first)
 */
export const sortByActivity = (users: UserAwareness[]): UserAwareness[] => {
  return [...users].sort((a, b) => b.lastActiveAt - a.lastActiveAt);
};
