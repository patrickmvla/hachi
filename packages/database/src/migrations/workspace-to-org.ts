/**
 * Migration: Workspace → Organization
 *
 * Migrates data from the legacy workspace tables to the Better Auth
 * organization plugin tables in a single transaction.
 *
 * Steps:
 * 1. workspaces → organization
 * 2. workspace_members → member
 * 3. workspace_invites → invitation
 * 4. Backfill organizationId on canvases, documents, workspace_credentials
 *
 * Usage: bun run packages/database/src/migrations/workspace-to-org.ts
 */

import { db } from "../client";
import { sql } from "drizzle-orm";

async function migrate() {
  console.log("[Migration] Starting workspace → organization migration...");

  await db.execute(sql`
    BEGIN;

    -- 1. Migrate workspaces → organization
    INSERT INTO organization (id, name, slug, created_at)
    SELECT
      id::text,
      name,
      lower(regexp_replace(name, '[^a-zA-Z0-9]+', '-', 'g')),
      created_at
    FROM workspaces
    ON CONFLICT (id) DO NOTHING;

    -- Handle slug uniqueness by appending a suffix for duplicates
    WITH dupes AS (
      SELECT id, slug, ROW_NUMBER() OVER (PARTITION BY slug ORDER BY created_at) as rn
      FROM organization
    )
    UPDATE organization
    SET slug = organization.slug || '-' || dupes.rn
    FROM dupes
    WHERE organization.id = dupes.id AND dupes.rn > 1;

    -- 2. Migrate workspace_members → member
    INSERT INTO member (id, user_id, organization_id, role, created_at)
    SELECT
      gen_random_uuid()::text,
      user_id,
      workspace_id::text,
      role,
      joined_at
    FROM workspace_members
    ON CONFLICT DO NOTHING;

    -- 3. Migrate workspace_invites → invitation
    INSERT INTO invitation (id, email, inviter_id, organization_id, role, status, expires_at, created_at)
    SELECT
      id::text,
      email,
      invited_by,
      workspace_id::text,
      role,
      CASE WHEN accepted_at IS NOT NULL THEN 'accepted' ELSE 'pending' END,
      expires_at,
      created_at
    FROM workspace_invites
    WHERE invited_by IS NOT NULL
    ON CONFLICT DO NOTHING;

    -- 4. Backfill organizationId on resource tables
    UPDATE canvases SET organization_id = workspace_id::text WHERE workspace_id IS NOT NULL AND organization_id IS NULL;
    UPDATE documents SET organization_id = workspace_id::text WHERE workspace_id IS NOT NULL AND organization_id IS NULL;
    UPDATE workspace_credentials SET organization_id = workspace_id::text WHERE workspace_id IS NOT NULL AND organization_id IS NULL;

    COMMIT;
  `);

  // Verify migration
  const [orgCount] = await db.execute(sql`SELECT count(*)::int as count FROM organization`);
  const [wsCount] = await db.execute(sql`SELECT count(*)::int as count FROM workspaces`);
  const [memberCount] = await db.execute(sql`SELECT count(*)::int as count FROM member`);
  const [wsMemberCount] = await db.execute(sql`SELECT count(*)::int as count FROM workspace_members`);

  console.log(`[Migration] Organizations: ${(orgCount as any).count} (from ${(wsCount as any).count} workspaces)`);
  console.log(`[Migration] Members: ${(memberCount as any).count} (from ${(wsMemberCount as any).count} workspace_members)`);
  console.log("[Migration] Done!");
}

migrate().catch((err) => {
  console.error("[Migration] Failed:", err);
  process.exit(1);
});
