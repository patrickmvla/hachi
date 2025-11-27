import {
  pgTable,
  uuid,
  text,
  jsonb,
  timestamp,
  integer,
  vector,
  unique,
} from "drizzle-orm/pg-core";

// ============================================================================
// Users & Authentication
// ============================================================================

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").unique().notNull(),
  name: text("name"),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

// ============================================================================
// Workspaces
// ============================================================================

export const workspaces = pgTable("workspaces", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const workspaceMembers = pgTable(
  "workspace_members",
  {
    workspaceId: uuid("workspace_id")
      .references(() => workspaces.id, { onDelete: "cascade" })
      .notNull(),
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    role: text("role").notNull(), // 'owner', 'admin', 'editor', 'viewer'
    invitedBy: uuid("invited_by").references(() => users.id),
    joinedAt: timestamp("joined_at").defaultNow(),
  },
  (table) => [unique().on(table.workspaceId, table.userId)]
);

export const workspaceInvites = pgTable("workspace_invites", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: uuid("workspace_id")
    .references(() => workspaces.id, { onDelete: "cascade" })
    .notNull(),
  email: text("email").notNull(),
  role: text("role").notNull(), // 'admin', 'editor', 'viewer'
  invitedBy: uuid("invited_by").references(() => users.id),
  token: text("token").unique().notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  acceptedAt: timestamp("accepted_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// ============================================================================
// Credentials & Configuration
// ============================================================================

export const workspaceCredentials = pgTable(
  "workspace_credentials",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    workspaceId: uuid("workspace_id")
      .references(() => workspaces.id, { onDelete: "cascade" })
      .notNull(),
    provider: text("provider").notNull(), // 'openai', 'anthropic', 'pinecone', etc.
    credentialType: text("credential_type").notNull(), // 'api_key', 'connection_string'
    encryptedValue: text("encrypted_value").notNull(), // AES-256 encrypted
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [unique().on(table.workspaceId, table.provider, table.credentialType)]
);

// ============================================================================
// Canvases
// ============================================================================

export const canvases = pgTable("canvases", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: uuid("workspace_id").references(() => workspaces.id),
  name: text("name").notNull(),
  graphJson: jsonb("graph_json").notNull(),
  createdBy: uuid("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ============================================================================
// Execution & Wire Tap
// ============================================================================

export const runs = pgTable("runs", {
  id: uuid("id").primaryKey().defaultRandom(),
  canvasId: uuid("canvas_id").references(() => canvases.id),
  triggeredBy: uuid("triggered_by").references(() => users.id),
  input: jsonb("input"),
  status: text("status"), // 'pending', 'running', 'completed', 'failed'
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

// ============================================================================
// Documents (RAG Knowledge Base)
// ============================================================================

export const documents = pgTable("documents", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: uuid("workspace_id").references(() => workspaces.id),
  content: text("content").notNull(),
  metadata: jsonb("metadata"),
  embedding: vector("embedding", { dimensions: 1536 }),
  createdAt: timestamp("created_at").defaultNow(),
});
