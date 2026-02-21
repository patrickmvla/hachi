# API Specification

---

## 1. Base Configuration

- **Framework:** Hono
- **Base URL:** `http://localhost:4000` (dev), configurable via `PORT` env
- **Content-Type:** `application/json` (except SSE endpoints)
- **Auth:** Session token in `Authorization: Bearer <token>` header or cookie

## 2. Authentication Routes

All handled by Better Auth. The API proxies these:

```
POST   /api/auth/sign-up              # Email/password signup
POST   /api/auth/sign-in/email        # Email/password login
POST   /api/auth/sign-out             # Logout (invalidate session)
GET    /api/auth/session              # Get current session
GET    /api/auth/sign-in/social       # Initiate OAuth (GitHub/Google)
GET    /api/auth/callback/:provider   # OAuth callback
```

## 3. Workspace Routes

```
GET    /api/workspaces
  → 200: WorkspaceWithRole[]
  → 401: Unauthorized

POST   /api/workspaces
  Body: { name: string }
  → 201: Workspace (creator becomes owner)
  → 400: Validation error
  → 401: Unauthorized

GET    /api/workspaces/:id
  → 200: WorkspaceWithMembers
  → 401: Unauthorized
  → 403: Not a member
  → 404: Not found

PUT    /api/workspaces/:id
  Body: { name?: string }
  → 200: Workspace
  → 403: Not admin/owner

DELETE /api/workspaces/:id
  → 204: No content
  → 403: Not owner

POST   /api/workspaces/:id/invite
  Body: { email: string, role: string }
  → 201: Invite (with token)
  → 403: Not admin/owner

POST   /api/workspaces/invite/:token/accept
  → 200: WorkspaceMember
  → 400: Expired/invalid token

GET    /api/workspaces/:id/members
  → 200: WorkspaceMember[]

PUT    /api/workspaces/:id/members/:userId
  Body: { role: string }
  → 200: WorkspaceMember
  → 403: Not admin/owner

DELETE /api/workspaces/:id/members/:userId
  → 204: No content
  → 403: Not admin/owner (or can't remove self if owner)
```

## 4. Credential Routes

```
GET    /api/workspaces/:id/credentials
  → 200: Credential[] (encrypted values NOT returned, just provider + type + createdAt)

POST   /api/workspaces/:id/credentials
  Body: { provider: string, credentialType: string, value: string }
  → 201: Credential (value encrypted before storage)
  → 403: Not admin/owner

PUT    /api/workspaces/:id/credentials/:credId
  Body: { value: string }
  → 200: Credential (re-encrypted)
  → 403: Not admin/owner

DELETE /api/workspaces/:id/credentials/:credId
  → 204: No content
  → 403: Not admin/owner

POST   /api/workspaces/:id/credentials/:credId/test
  → 200: { valid: true, details: string } (e.g., "GPT-4o access confirmed")
  → 200: { valid: false, error: string }
```

## 5. Canvas Routes

```
GET    /api/canvases?workspaceId=<uuid>
  → 200: Canvas[] (without graphJson for list view)

POST   /api/canvases
  Body: { workspaceId: string, name: string, graphJson?: object }
  → 201: Canvas

GET    /api/canvases/:id
  → 200: Canvas (with full graphJson)
  → 404: Not found

PUT    /api/canvases/:id
  Body: { name?: string, graphJson?: object }
  → 200: Canvas
  Notes: This is the auto-save endpoint. Called every 2 seconds while editing.

DELETE /api/canvases/:id
  → 204: No content
```

## 6. Execution Routes

```
POST   /api/runs/execute
  Body: { canvasId: string, query: string, parameters?: object }
  → 200: SSE stream (Content-Type: text/event-stream)

  SSE Events:
    event: run_started
    data: { runId: string, canvasId: string, startedAt: string }

    event: step_started
    data: { runId: string, nodeId: string, nodeType: string, stepName: string }

    event: step_completed
    data: { runId: string, nodeId: string, output: object, latencyMs: number }

    event: step_failed
    data: { runId: string, nodeId: string, error: string }

    event: run_completed
    data: { runId: string, completedAt: string, totalLatencyMs: number }

    event: run_failed
    data: { runId: string, error: string }

GET    /api/runs?canvasId=<uuid>
  → 200: Run[] (without step outputs)

GET    /api/runs/:id
  → 200: Run (with step outputs — full Wire Tap data)
```

## 7. Document Routes

```
GET    /api/documents?workspaceId=<uuid>
  → 200: Document[] (without content/embedding for list view)

POST   /api/documents
  Body: multipart/form-data { workspaceId, file, metadata? }
  → 201: Document (content extracted, not yet embedded)

POST   /api/documents/:id/process
  → 200: { chunks: number, embeddingsCreated: number }
  Notes: Chunks the document and generates embeddings. Can be slow.

GET    /api/documents/:id
  → 200: Document (with content, metadata, chunk count)

DELETE /api/documents/:id
  → 204: No content

POST   /api/documents/search
  Body: { workspaceId: string, query: string, topK?: number, filter?: object }
  → 200: { documents: Document[], scores: number[] }
```

## 8. Error Format

All errors follow a consistent format:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human-readable description",
    "details": {}
  }
}
```

Error codes:
```
400  VALIDATION_ERROR     — Invalid request body
401  UNAUTHORIZED         — Not authenticated
403  FORBIDDEN           — Not authorized for this action
404  NOT_FOUND           — Resource doesn't exist
409  CONFLICT            — Resource already exists
429  RATE_LIMITED        — Too many requests
500  INTERNAL_ERROR      — Server error
```
