import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import {
  fetchOrganization,
  fetchMembers,
  fetchInvitations,
  fetchCredentials,
} from "../api/workspaces-api";

export function useOrganization(id: string) {
  return useQuery({
    queryKey: queryKeys.organizations.detail(id),
    queryFn: () => fetchOrganization(id),
    enabled: !!id,
  });
}

export function useMembers(orgId: string) {
  return useQuery({
    queryKey: queryKeys.organizations.members(orgId),
    queryFn: () => fetchMembers(orgId),
    enabled: !!orgId,
  });
}

export function useInvitations(orgId: string) {
  return useQuery({
    queryKey: queryKeys.organizations.invitations(orgId),
    queryFn: () => fetchInvitations(orgId),
    enabled: !!orgId,
  });
}

export function useCredentials(orgId: string) {
  return useQuery({
    queryKey: queryKeys.organizations.credentials(orgId),
    queryFn: () => fetchCredentials(orgId),
    enabled: !!orgId,
  });
}
