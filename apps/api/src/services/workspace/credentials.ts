import { db } from "@hachi/database/client";
import { organizationCredentials } from "@hachi/database/schema";
import { encrypt, decrypt } from "@hachi/encryption";
import { eq, and } from "drizzle-orm";

export interface Credential {
  id: string;
  organizationId: string;
  provider: string;
  credentialType: string;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export interface CredentialWithValue extends Credential {
  value: string;
}

/**
 * Store encrypted credential for organization
 */
export const storeCredential = async (
  organizationId: string,
  provider: string,
  credentialType: string,
  value: string
): Promise<Credential> => {
  const encryptedValue = await encrypt(value);

  // Check if credential already exists for this org
  const existing = await db
    .select()
    .from(organizationCredentials)
    .where(
      and(
        eq(organizationCredentials.organizationId, organizationId),
        eq(organizationCredentials.provider, provider),
        eq(organizationCredentials.credentialType, credentialType)
      )
    )
    .limit(1);

  let credential;
  if (existing[0]) {
    [credential] = await db
      .update(organizationCredentials)
      .set({ encryptedValue, updatedAt: new Date() })
      .where(eq(organizationCredentials.id, existing[0].id))
      .returning();
  } else {
    [credential] = await db
      .insert(organizationCredentials)
      .values({
        organizationId,
        provider,
        credentialType,
        encryptedValue,
        updatedAt: new Date(),
      })
      .returning();
  }

  if (!credential) {
    throw new Error("Failed to store credential");
  }

  return {
    id: credential.id,
    organizationId: credential.organizationId,
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
  organizationId: string,
  provider: string,
  credentialType: string
): Promise<CredentialWithValue | null> => {
  const [credential] = await db
    .select()
    .from(organizationCredentials)
    .where(
      and(
        eq(organizationCredentials.organizationId, organizationId),
        eq(organizationCredentials.provider, provider),
        eq(organizationCredentials.credentialType, credentialType)
      )
    )
    .limit(1);

  if (!credential) {
    return null;
  }

  const decryptedValue = await decrypt(credential.encryptedValue);

  return {
    id: credential.id,
    organizationId: credential.organizationId,
    provider: credential.provider,
    credentialType: credential.credentialType,
    value: decryptedValue,
    createdAt: credential.createdAt,
    updatedAt: credential.updatedAt,
  };
};

/**
 * List all credentials for organization (without values)
 */
export const listCredentials = async (
  organizationId: string
): Promise<Credential[]> => {
  const credentials = await db
    .select({
      id: organizationCredentials.id,
      organizationId: organizationCredentials.organizationId,
      provider: organizationCredentials.provider,
      credentialType: organizationCredentials.credentialType,
      createdAt: organizationCredentials.createdAt,
      updatedAt: organizationCredentials.updatedAt,
    })
    .from(organizationCredentials)
    .where(eq(organizationCredentials.organizationId, organizationId));

  return credentials;
};

/**
 * Delete credential
 */
export const deleteCredential = async (
  organizationId: string,
  provider: string,
  credentialType: string
): Promise<boolean> => {
  await db
    .delete(organizationCredentials)
    .where(
      and(
        eq(organizationCredentials.organizationId, organizationId),
        eq(organizationCredentials.provider, provider),
        eq(organizationCredentials.credentialType, credentialType)
      )
    );

  return true;
};
