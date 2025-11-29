import { Hono } from "hono";
import { auth } from "@hachi/auth/server";

/**
 * Auth routes - handles all Better Auth endpoints
 * Mounted at /api/auth/*
 */
export const authRoutes = new Hono()
  .on(["POST", "GET"], "/*", async (c) => {
    // Pass all auth requests to Better Auth handler
    return auth.handler(c.req.raw);
  });
