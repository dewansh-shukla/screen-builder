// AUTO-SYNCED from zapigowebclient — DO NOT EDIT DIRECTLY
// Source: /Users/dewanshshukla/Desktop/zapigo/zapigowebclient/src/hooks/affiliate/package.ts
// Last synced: 2026-03-17T11:17:27.028Z
// API integrations stripped. Use props for data and callbacks.
// [STRIPPED] import { useQuery } from '@tanstack/react-query';
// [STRIPPED] import { affiliateApi } from '@/lib/affiliate-api';
import type {
  AffiliatePackagesQueryParams,
  AffiliatePackagesResponse,
  AffiliatePackageItem,
  CreatePackageBookingParams,
  PackageBookingResponse,
  AffiliatePackagesByTagQueryParams,
  AffiliatePackagesByTagResponse,
  AffiliatePackagesByTagNameQueryParams,
  AffiliatePackagesByTagNameResponse,
} from '@/types/affiliate/package';
// [STRIPPED] import { useMutation } from '@tanstack/react-query';
// [STRIPPED] 
const buildQueryString = (params?: AffiliatePackagesQueryParams) => {
  const limit = params?.limit ?? 50;
  const offset = params?.offset ?? 0;
  const q = params?.q ?? undefined;
  const search = new URLSearchParams();
  search.set('limit', String(limit));
  search.set('offset', String(offset));
  if (q !== undefined && q !== null && String(q).length > 0) {
    search.set('q', String(q));
  }
  const qs = search.toString();
  return qs ? `?${qs}` : '';
};

export const fetchAffiliatePackages = async (
  params?: AffiliatePackagesQueryParams,
): Promise<AffiliatePackagesResponse> => {
  const queryString = buildQueryString(params);
  const { data } = /* [STRIPPED] affiliateApi call */ undefined;
  return data;
};

export const useAffiliatePackages = (params?: AffiliatePackagesQueryParams) => {
  return { data: undefined, isLoading: false, isFetching: false, error: null, refetch: () => Promise.resolve({} as any), isSuccess: false, isError: false, status: 'idle' as const };
};

export const createPackageBooking = async (
  params: CreatePackageBookingParams,
): Promise<PackageBookingResponse> => {
  const { package_id, customer_id, booking_id } = params;
  const { data } = /* [STRIPPED] affiliateApi call */ undefined;
  return data;
};

export const useCreatePackageBooking = () => ({ mutate: () => {}, mutateAsync: async () => ({} as any), isPending: false, isLoading: false, error: null, reset: () => {}, isSuccess: false, isError: false, data: undefined, status: 'idle' as const });

export const fetchAffiliatePackageById = async (
  packageId: string,
): Promise<AffiliatePackageItem> => {
  const { data } = /* [STRIPPED] affiliateApi call */ undefined;
  return data;
};

export const useAffiliatePackageById = (packageId: string) => {
  return { data: undefined, isLoading: false, isFetching: false, error: null, refetch: () => Promise.resolve({} as any), isSuccess: false, isError: false, status: 'idle' as const };
};


// Fetch packages by tag(s)
export const fetchAffiliatePackagesByTag = async (
  params: AffiliatePackagesByTagQueryParams,
): Promise<AffiliatePackagesByTagResponse> => {
  const search = new URLSearchParams();
  if (params.limit !== undefined) search.set('limit', String(params.limit));
  if (params.tagId) search.set('tagId', params.tagId);
  if (params.tagIds) search.set('tagIds', params.tagIds);
  const qs = search.toString();
  const { data } = /* [STRIPPED] affiliateApi call */ undefined;
  return data;
};

export const useAffiliatePackagesByTag = (
  params: AffiliatePackagesByTagQueryParams,
) => {
  return { data: undefined, isLoading: false, isFetching: false, error: null, refetch: () => Promise.resolve({} as any), isSuccess: false, isError: false, status: 'idle' as const };
};

// Fetch packages by tag name
export const fetchAffiliatePackagesByTagName = async (
  params: AffiliatePackagesByTagNameQueryParams,
): Promise<AffiliatePackagesByTagNameResponse> => {
  const search = new URLSearchParams();
  search.set('tagName', params.tagName);
  if (params.q) search.set('q', params.q);
  if (params.limit !== undefined) search.set('limit', String(params.limit));
  if (params.offset !== undefined) search.set('offset', String(params.offset));
  const qs = search.toString();
  const { data } = /* [STRIPPED] affiliateApi call */ undefined;
  return data;
};

export const useAffiliatePackagesByTagName = (
  params: AffiliatePackagesByTagNameQueryParams,
) => {
  return { data: undefined, isLoading: false, isFetching: false, error: null, refetch: () => Promise.resolve({} as any), isSuccess: false, isError: false, status: 'idle' as const };
};

