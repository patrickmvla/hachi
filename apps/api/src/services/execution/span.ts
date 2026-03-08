import { randomBytes } from "crypto";

/**
 * Generates a 32-character hex trace ID (128-bit).
 */
export function generateTraceId(): string {
  return randomBytes(16).toString("hex");
}

/**
 * Generates a 16-character hex span ID (64-bit).
 */
export function generateSpanId(): string {
  return randomBytes(8).toString("hex");
}
