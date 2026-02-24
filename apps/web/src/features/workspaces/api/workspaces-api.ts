import { authClient } from "@hachi/auth/client";
import { apiFetch, unwrap } from "@/lib/api";

export interface Credential {
  id: string;
  provider: string;
  type: string;
  createdAt: string;
  lastUsedAt: string | null;
  maskedValue: string;
}

export async function fetchOrganization(id: string) {
  const { data, error } = await authClient.organization.getFullOrganization({
    query: { organizationId: id },
  });
  if (error) throw new Error(error.message || "Failed to fetch organization");
  return data;
}

export async function fetchMembers(orgId: string) {
  const { data, error } = await authClient.organization.listMembers({
    query: { organizationId: orgId },
  });
  if (error) throw new Error(error.message || "Failed to fetch members");
  return (data as any)?.members || data || [];
}

export async function fetchInvitations(orgId: string) {
  const { data, error } = await authClient.organization.listInvitations({
    query: { organizationId: orgId },
  });
  if (error) throw new Error(error.message || "Failed to fetch invitations");
  return (data || []).filter((inv: any) => inv.status === "pending");
}

export async function fetchCredentials(orgId: string) {
  const { credentials } = unwrap(
    await apiFetch<{ credentials: Credential[] }>(
      `/api/organizations/${orgId}/credentials`
    )
  );
  return credentials;
}
