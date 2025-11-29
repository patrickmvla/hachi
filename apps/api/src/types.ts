/**
 * Hono Environment Types
 * Defines the Variables available in context throughout the API
 */

export interface User {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
}

export interface Session {
  id: string;
  userId: string;
  expiresAt: Date;
}

export interface Workspace {
  id: string;
  name: string;
}

export type MemberRole = "owner" | "admin" | "editor" | "viewer";

/**
 * Variables set by middleware and available via c.get()
 */
export interface AppVariables {
  user: User;
  session: Session;
  workspace: Workspace;
  memberRole: MemberRole;
}

/**
 * Environment type for Hono app
 */
export interface AppEnv {
  Variables: AppVariables;
}
