import { db } from "@hachi/database/client";
import { workspaceCredentials } from "@hachi/database/schema";
import { encrypt, decrypt } from "@hachi/encryption";
import { eq, and } from "drizzle-orm";

export interface Credential {
  id: string;
  workspaceId: string;
  provider: string;
  credentialType: string;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export interface CredentialWithValue extends Credential {
  value: string;
}

/**
 * Store encrypted credential for workspace
 */
export const storeCredential = async (
  workspaceId: string,
  provider: string,
  credentialType: string,
  value: string
): Promise<Credential> => {
  const encryptedValue = await encrypt(value);

  const [credential] = await db
    .insert(workspaceCredentials)
    .values({
      workspaceId,
      provider,
      credentialType,
      encryptedValue,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: [
        workspaceCredentials.workspaceId,
        workspaceCredentials.provider,
        workspaceCredentials.credentialType,
      ],
      set: {
        encryptedValue,
        updatedAt: new Date(),
      },
    })
    .returning();

  if (!credential) {
    throw new Error("Failed to store credential");
  }

  return {
    id: credential.id,
    workspaceId: credential.workspaceId,
    provider: credential.provider,
    credentialType: credential.credentialType,
    createdAt: credential.createdAt,
    updatedAt: credential.updatedAt,
  };
};

/**
 * Get and decrypt credential
 */
export const getCredential = async (
  workspaceId: string,
  provider: string,
  credentialType: string
): Promise<CredentialWithValue | null> => {
  const [credential] = await db
    .select()
    .from(workspaceCredentials)
    .where(
      and(
        eq(workspaceCredentials.workspaceId, workspaceId),
        eq(workspaceCredentials.provider, provider),
        eq(workspaceCredentials.credentialType, credentialType)
      )
    )
    .limit(1);

  if (!credential) {
    return null;
  }

  const decryptedValue = await decrypt(credential.encryptedValue);

  return {
    id: credential.id,
    workspaceId: credential.workspaceId,
    provider: credential.provider,
    credentialType: credential.credentialType,
    value: decryptedValue,
    createdAt: credential.createdAt,
    updatedAt: credential.updatedAt,
  };
};

/**
 * List all credentials for workspace (without values)
 */
export const listCredentials = async (
  workspaceId: string
): Promise<Credential[]> => {
  const credentials = await db
    .select({
      id: workspaceCredentials.id,
      workspaceId: workspaceCredentials.workspaceId,
      provider: workspaceCredentials.provider,
      credentialType: workspaceCredentials.credentialType,
      createdAt: workspaceCredentials.createdAt,
      updatedAt: workspaceCredentials.updatedAt,
    })
    .from(workspaceCredentials)
    .where(eq(workspaceCredentials.workspaceId, workspaceId));

  return credentials;
};

/**
 * Delete credential
 */
export const deleteCredential = async (
  workspaceId: string,
  provider: string,
  credentialType: string
): Promise<boolean> => {
  const result = await db
    .delete(workspaceCredentials)
    .where(
      and(
        eq(workspaceCredentials.workspaceId, workspaceId),
        eq(workspaceCredentials.provider, provider),
        eq(workspaceCredentials.credentialType, credentialType)
      )
    );

  return true;
};
