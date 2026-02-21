# Deployment & Development

---

## 1. Frontend (Vercel)

```json
// apps/web/vercel.json
{
  "framework": "nextjs"
}
```

- Deployed to Vercel Edge Network
- Automatic deployments on push to `main`
- Environment variables configured in Vercel dashboard
- Preview deployments for PRs

## 2. Backend API (Docker / VPS)

```dockerfile
FROM oven/bun:1 AS base
WORKDIR /app

COPY package.json bun.lock ./
COPY packages/ ./packages/
COPY apps/api/ ./apps/api/

RUN bun install --production

EXPOSE 4000
CMD ["bun", "run", "apps/api/src/index.ts"]
```

## 3. Database (Supabase)

- Managed PostgreSQL with pgvector extension
- Connection pooling via Supabase
- Automatic backups
- Row-level security available if needed

## 4. Collaboration Server (Bun WebSocket)

Separate process running Yjs WebSocket server:
```
bun run apps/api/src/services/collaboration/server.ts
```
- Handles WebSocket connections for canvas rooms
- Persists Yjs state to `canvases.yjs_state`
- Can be deployed alongside API or separately

## 5. Environment Variables

### Required (Production)

```env
# Database
DATABASE_URL=postgresql://user:pass@host:5432/hachi?sslmode=require

# Authentication
BETTER_AUTH_SECRET=<32-byte-hex>              # Session signing key
BETTER_AUTH_URL=https://api.hachi.dev         # API base URL

# OAuth (at least one recommended)
GITHUB_CLIENT_ID=<from github.com/settings/developers>
GITHUB_CLIENT_SECRET=<from github>
GOOGLE_CLIENT_ID=<from console.cloud.google.com>
GOOGLE_CLIENT_SECRET=<from google>

# Encryption
ENCRYPTION_KEY=<64-hex-chars>                 # For credential encryption

# Server
PORT=4000                                     # API server port

# Frontend
NEXT_PUBLIC_API_URL=https://api.hachi.dev     # Backend URL for frontend
```

### Optional

```env
# For real execution (workspace-level, but can also be global defaults)
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...

# Background jobs
INNGEST_EVENT_KEY=...
INNGEST_SIGNING_KEY=...

# Email (invites)
RESEND_API_KEY=re_...

# Web search tool (for CRAG fallback)
TAVILY_API_KEY=tvly-...

# Collaboration server
COLLABORATION_WS_URL=wss://collab.hachi.dev
```

### Generate Keys

```bash
# Generate BETTER_AUTH_SECRET
openssl rand -hex 32

# Generate ENCRYPTION_KEY
bun -e "import { generateEncryptionKey } from '@hachi/encryption'; console.log(generateEncryptionKey())"
```

## 6. Initial Setup

```bash
# Clone and install
git clone <repo>
cd hachi
bun install

# Set up environment
cp .env.example .env
# Fill in DATABASE_URL, BETTER_AUTH_SECRET, ENCRYPTION_KEY

# Set up database
cd packages/database
bunx drizzle-kit push          # Push schema to DB (dev mode)
cd ../..

# Run everything
bun run dev                    # Starts web + api via Turborepo
```

## 7. Development Commands

```bash
# Run all apps
bun run dev

# Run specific app
bun run dev:web                # Next.js on :3000
bun run dev:api                # Hono on :4000

# Database
bun run db:generate            # Generate migration from schema changes
bun run db:push                # Push schema directly (dev only)
bun run db:migrate             # Apply migrations (production)
bun run db:studio              # Open Drizzle Studio UI

# Build
bun run build                  # Build all packages + apps
bun run typecheck              # TypeScript type checking
bun run lint                   # Run linters

# Test
bun test                       # Run all tests
```

## 8. Turborepo Tasks (`turbo.json`)

```json
{
  "tasks": {
    "dev": { "persistent": true, "cache": false },
    "build": { "dependsOn": ["^build"] },
    "typecheck": { "dependsOn": ["^typecheck"] },
    "lint": {},
    "test": {}
  }
}
```

## 9. Package Dependencies

```
@hachi/ui          → (no internal deps, standalone)
@hachi/encryption  → (no internal deps, standalone)
@hachi/schemas     → (no internal deps, standalone)
@hachi/database    → (no internal deps, standalone)
@hachi/auth        → @hachi/database
@hachi/mastra-core → @hachi/schemas
@hachi/realtime    → (no internal deps, uses yjs)

apps/web           → @hachi/ui, @hachi/schemas, @hachi/auth (client), @hachi/realtime
apps/api           → @hachi/database, @hachi/auth, @hachi/encryption, @hachi/schemas, @hachi/mastra-core
```
