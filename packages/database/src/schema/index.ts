import {
  pgTable,
  uuid,
  text,
  jsonb,
  timestamp,
  integer,
  vector,
  unique,
  boolean,
} from "drizzle-orm/pg-core";

// ============================================================================
// Users & Authentication
// ============================================================================

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").unique().notNull(),
  emailVerified: boolean("email_verified").notNull().default(false), // Required by Better Auth
  name: text("name"),
  image: text("image"), // Better Auth uses 'image' instead of 'avatarUrl'
  avatarUrl: text("avatar_url"), // Keep for backward compatibility
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ============================================================================
// Better Auth Tables
// ============================================================================

export const sessions = pgTable("session", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  token: text("token").unique().notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const accounts = pgTable("account", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  idToken: text("id_token"),
  password: text("password"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const verifications = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
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
    userId: text("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    role: text("role").notNull(), // 'owner', 'admin', 'editor', 'viewer'
    invitedBy: text("invited_by").references(() => users.id),
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
  invitedBy: text("invited_by").references(() => users.id),
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
  yjsState: text("yjs_state"), // Base64 encoded Yjs document state for collaboration
  createdBy: text("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ============================================================================
// Execution & Wire Tap
// ============================================================================

export const runs = pgTable("runs", {
  id: uuid("id").primaryKey().defaultRandom(),
  canvasId: uuid("canvas_id").references(() => canvases.id),
  triggeredBy: text("triggered_by").references(() => users.id),
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
