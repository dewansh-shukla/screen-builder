// AUTO-SYNCED from zapigowebclient — DO NOT EDIT DIRECTLY
// Source: /Users/dewanshshukla/Desktop/zapigo/zapigowebclient/src/hooks/party-kit.ts
// Last synced: 2026-03-17T11:05:34.438Z
// API integrations stripped. Use props for data and callbacks.
// [STRIPPED] import { useQuery } from '@tanstack/react-query';
// [STRIPPED] import { affiliateApi } from '@/lib/affiliate-api';
import type {
  PartyKitListResponse,
  PartyKitListQueryParams,
  PartyKit,
} from '@/types/party-kit';

// Fetch party kits list
export const fetchPartyKits = async (
  params?: PartyKitListQueryParams,
): Promise<PartyKitListResponse> => {
  const search = new URLSearchParams();
  if (params?.q) search.set('q', params.q);
  if (params?.limit !== undefined) search.set('limit', String(params.limit));
  if (params?.offset !== undefined) search.set('offset', String(params.offset));
  if (params?.status) search.set('status', params.status);
  
  const qs = search.toString();
  const { data } = await affiliateApi.get<PartyKitListResponse>(
    `/admin/party-kits${qs ? `?${qs}` : ''}`,
  );
  return data;
};

export const usePartyKits = (params?: PartyKitListQueryParams) => {
  return useQuery({
    queryKey: ['party-kits', params?.q ?? null, params?.limit ?? 50, params?.offset ?? 0],
    queryFn: () => fetchPartyKits(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Fetch single party kit
export const fetchPartyKitById = async (
  id: string,
): Promise<PartyKit> => {
  const { data } = await affiliateApi.get<PartyKit>(
    `/admin/party-kits/${id}`,
  );
  return data;
};

export const usePartyKitById = (id: string) => {
  return useQuery({
    queryKey: ['party-kit', id],
    queryFn: () => fetchPartyKitById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

