# Authentication & Security

---

## 1. Authentication Flow

**Email/Password:**
```
1. User submits email + password to POST /api/auth/sign-up
2. Better Auth creates user record, hashes password (bcrypt)
3. Creates session, returns session token
4. Frontend stores token, includes in subsequent requests
```

**OAuth (GitHub/Google):**
```
1. User clicks "Continue with GitHub"
2. Frontend redirects to GET /api/auth/sign-in/social?provider=github
3. Better Auth redirects to GitHub OAuth consent screen
4. User approves, GitHub redirects to /api/auth/callback/github
5. Better Auth creates/links user, creates session
6. Redirects to frontend with session cookie
```

## 2. Session Management

- **Storage:** PostgreSQL `session` table
- **Token:** Cryptographically random, stored in cookie + DB
- **Expiry:** 7 days
- **Refresh:** Session updated if accessed and >1 day since last update
- **Invalidation:** DELETE session record on logout

## 3. Authorization Model

Workspace-based RBAC:

| Action | Owner | Admin | Editor | Viewer |
|--------|-------|-------|--------|--------|
| View canvases | Y | Y | Y | Y |
| Run pipelines | Y | Y | Y | Y |
| View Wire Tap | Y | Y | Y | Y |
| Create/edit canvases | Y | Y | Y | N |
| Delete own canvases | Y | Y | Y | N |
| Delete any canvas | Y | Y | N | N |
| Upload documents | Y | Y | Y | N |
| Manage credentials | Y | Y | N | N |
| Invite members | Y | Y | N | N |
| Change member roles | Y | Y | N | N |
| Delete workspace | Y | N | N | N |
| Transfer ownership | Y | N | N | N |

## 4. Credential Security

API keys (OpenAI, Anthropic, Pinecone, etc.) are stored encrypted:

1. User enters API key in workspace settings
2. Frontend sends plaintext to API over HTTPS
3. API encrypts with AES-256-GCM using `ENCRYPTION_KEY`
4. Stored as base64(IV + ciphertext + auth tag) in `workspace_credentials`
5. Decrypted only when needed for execution (never sent to frontend)
6. Each encryption uses a unique random IV (no IV reuse)

**Key management:**
- `ENCRYPTION_KEY` is a 32-byte hex string (64 characters)
- Generate with: `import { generateEncryptionKey } from "@hachi/encryption"; generateEncryptionKey()`
- Rotate by: decrypt all → change key → re-encrypt all (migration script needed)

## 5. Security Boundaries

- API keys never leave the backend
- `ENCRYPTION_KEY` never leaves the server environment
- Frontend only knows if a credential exists (provider + type), not its value
- Session tokens are httpOnly cookies (not accessible to JS)
- CORS configured to allow only the frontend origin
- Rate limiting on auth endpoints (prevent brute force)
- Workspace isolation: users only access data in their workspaces
