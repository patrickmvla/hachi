import type { Context, Next } from "hono";
import { auth } from "@hachi/auth/server";

export interface AuthenticatedContext extends Context {
  var: {
    user: {
      id: string;
      email: string;
      name: string | null;
      image: string | null;
    };
    session: {
      id: string;
      userId: string;
      expiresAt: Date;
    };
  };
}

/**
 * Middleware to require authentication
 * Validates session and attaches user to context
 */
export const requireAuth = async (c: Context, next: Next) => {
  try {
    const session = await auth.api.getSession({
      headers: c.req.raw.headers
    });

    if (!session || !session.user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Attach user and session to context
    c.set("user", session.user);
    c.set("session", session.session);

    await next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return c.json({ error: "Unauthorized" }, 401);
  }
};

/**
 * Optional auth middleware - doesn't fail if no session
 * Attaches user to context if authenticated
 */
export const optionalAuth = async (c: Context, next: Next) => {
  try {
    const session = await auth.api.getSession({
      headers: c.req.raw.headers
    });

    if (session?.user) {
      c.set("user", session.user);
      c.set("session", session.session);
    }
  } catch (error) {
    // Silently continue without auth
  }

  await next();
};
