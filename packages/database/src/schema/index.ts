import { pgTable, uuid, text, jsonb, timestamp, integer, vector } from "drizzle-orm/pg-core";

export const workspaces = pgTable("workspaces", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const canvases = pgTable("canvases", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: uuid("workspace_id").references(() => workspaces.id),
  name: text("name").notNull(),
  graphJson: jsonb("graph_json").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const runs = pgTable("runs", {
  id: uuid("id").primaryKey().defaultRandom(),
  canvasId: uuid("canvas_id").references(() => canvases.id),
  input: jsonb("input"),
  status: text("status"),
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
});

export const stepOutputs = pgTable("step_outputs", {
  id: uuid("id").primaryKey().defaultRandom(),
  runId: uuid("run_id").references(() => runs.id),
  nodeId: text("node_id").notNull(),
  input: jsonb("input"),
  output: jsonb("output"),
  latencyMs: integer("latency_ms"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const documents = pgTable("documents", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: uuid("workspace_id").references(() => workspaces.id),
  content: text("content").notNull(),
  metadata: jsonb("metadata"),
  embedding: vector("embedding", { dimensions: 1536 }),
  createdAt: timestamp("created_at").defaultNow(),
});
