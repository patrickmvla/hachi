# Database Schema

---

## 1. Entity Relationship

```
users ──────────┬──── sessions
                ├──── accounts (OAuth)
                ├──── verifications
                │
                ├──── workspaceMembers ──── workspaces
                │                              │
                │                              ├──── workspaceInvites
                │                              ├──── workspaceCredentials
                │                              ├──── documents (with pgvector)
                │                              └──── canvases
                │                                       │
                └──────────────────────────────── runs ──┘
                                                   │
                                              stepOutputs
```

## 2. Table Definitions

#### Users & Authentication

```sql
CREATE TABLE users (
  id            TEXT PRIMARY KEY,
  email         TEXT NOT NULL UNIQUE,
  email_verified BOOLEAN DEFAULT FALSE,
  name          TEXT,
  image         TEXT,
  avatar_url    TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE session (
  id            TEXT PRIMARY KEY,
  user_id       TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token         TEXT NOT NULL UNIQUE,
  expires_at    TIMESTAMPTZ NOT NULL,
  ip_address    TEXT,
  user_agent    TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE account (
  id            TEXT PRIMARY KEY,
  user_id       TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  account_id    TEXT NOT NULL,
  provider_id   TEXT NOT NULL,
  access_token  TEXT,
  refresh_token TEXT,
  access_token_expires_at  TIMESTAMPTZ,
  refresh_token_expires_at TIMESTAMPTZ,
  scope         TEXT,
  id_token      TEXT,
  password      TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE verification (
  id            TEXT PRIMARY KEY,
  identifier    TEXT NOT NULL,
  value         TEXT NOT NULL,
  expires_at    TIMESTAMPTZ NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);
```

#### Workspaces

```sql
CREATE TABLE workspaces (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE workspace_members (
  workspace_id  UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id       TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role          TEXT NOT NULL DEFAULT 'editor',  -- owner, admin, editor, viewer
  invited_by    TEXT REFERENCES users(id),
  joined_at     TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(workspace_id, user_id)
);

CREATE TABLE workspace_invites (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id  UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  email         TEXT NOT NULL,
  role          TEXT NOT NULL DEFAULT 'editor',
  invited_by    TEXT NOT NULL REFERENCES users(id),
  token         TEXT NOT NULL UNIQUE,
  expires_at    TIMESTAMPTZ NOT NULL,
  accepted_at   TIMESTAMPTZ,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);
```

#### Credentials (Encrypted)

```sql
CREATE TABLE workspace_credentials (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id    UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  provider        TEXT NOT NULL,         -- 'openai', 'anthropic', 'pinecone', etc.
  credential_type TEXT NOT NULL,         -- 'api_key', 'connection_string'
  encrypted_value TEXT NOT NULL,         -- AES-256-GCM encrypted, base64
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(workspace_id, provider, credential_type)
);
```

#### Canvases

```sql
CREATE TABLE canvases (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id  UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  graph_json    JSONB NOT NULL DEFAULT '{"nodes":[],"edges":[]}',
  yjs_state     TEXT,                    -- Base64 Yjs document state
  created_by    TEXT REFERENCES users(id),
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);
```

**`graph_json` structure:**
```json
{
  "nodes": [
    {
      "id": "node-1",
      "type": "query",
      "position": { "x": 100, "y": 200 },
      "data": {
        "label": "User Query",
        "type": "query",
        "config": {}
      }
    }
  ],
  "edges": [
    {
      "id": "edge-1",
      "source": "node-1",
      "target": "node-2",
      "sourceHandle": "output",
      "targetHandle": "input"
    }
  ]
}
```

#### Execution

```sql
CREATE TABLE runs (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  canvas_id     UUID NOT NULL REFERENCES canvases(id) ON DELETE CASCADE,
  triggered_by  TEXT REFERENCES users(id),
  input         JSONB,                   -- { query, parameters }
  status        TEXT DEFAULT 'pending',  -- pending, running, completed, failed
  started_at    TIMESTAMPTZ,
  completed_at  TIMESTAMPTZ
);

CREATE TABLE step_outputs (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id        UUID NOT NULL REFERENCES runs(id) ON DELETE CASCADE,
  node_id       TEXT NOT NULL,
  input         JSONB,
  output        JSONB,
  latency_ms    INTEGER,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);
```

#### Documents (RAG Knowledge Base)

```sql
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE documents (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id  UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  content       TEXT NOT NULL,
  metadata      JSONB,                   -- { source, author, type, date, ... }
  embedding     VECTOR(1536),            -- OpenAI text-embedding-3-small
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Vector similarity search index
CREATE INDEX ON documents USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
```

## 3. Recommended Indexes

```sql
-- Auth lookups
CREATE INDEX idx_sessions_token ON session(token);
CREATE INDEX idx_sessions_user_id ON session(user_id);
CREATE INDEX idx_accounts_user_id ON account(user_id);

-- Workspace lookups
CREATE INDEX idx_workspace_members_user ON workspace_members(user_id);
CREATE INDEX idx_workspace_members_workspace ON workspace_members(workspace_id);
CREATE INDEX idx_workspace_invites_token ON workspace_invites(token);
CREATE INDEX idx_workspace_invites_email ON workspace_invites(email);

-- Canvas lookups
CREATE INDEX idx_canvases_workspace ON canvases(workspace_id);
CREATE INDEX idx_canvases_created_by ON canvases(created_by);

-- Run lookups
CREATE INDEX idx_runs_canvas ON runs(canvas_id);
CREATE INDEX idx_runs_status ON runs(status);
CREATE INDEX idx_step_outputs_run ON step_outputs(run_id);
CREATE INDEX idx_step_outputs_node ON step_outputs(run_id, node_id);

-- Document search
CREATE INDEX idx_documents_workspace ON documents(workspace_id);
CREATE INDEX idx_documents_metadata ON documents USING gin(metadata);
```
