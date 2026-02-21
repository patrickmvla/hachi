import { createAuthClient } from "better-auth/react";
import { organizationClient } from "better-auth/client/plugins";
import { ac, owner, admin, editor, viewer } from "./permissions";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000",
  basePath: "/api/auth",
  plugins: [
    organizationClient({
      ac,
      roles: { owner, admin, editor, viewer },
      teams: { enabled: true },
    }),
  ],
});

export type AuthClient = typeof authClient;
