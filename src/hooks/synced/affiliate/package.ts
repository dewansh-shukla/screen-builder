// AUTO-SYNCED from zapigowebclient — DO NOT EDIT DIRECTLY
// Source: /Users/dewanshshukla/Desktop/zapigo/zapigowebclient/src/hooks/affiliate/package.ts
// Last synced: 2026-03-17T11:05:34.437Z
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
  const { data } = await affiliateApi.get<AffiliatePackagesResponse>(
    `/public/packages${queryString}`,
  );
  return data;
};

export const useAffiliatePackages = (params?: AffiliatePackagesQueryParams) => {
  return useQuery({
    queryKey: ['affiliate-packages', params?.q ?? null, params?.limit ?? 50, params?.offset ?? 0],
    queryFn: () => fetchAffiliatePackages(params),
  });
};

export const createPackageBooking = async (
  params: CreatePackageBookingParams,
): Promise<PackageBookingResponse> => {
  const { package_id, customer_id, booking_id } = params;
  const { data } = await affiliateApi.post<PackageBookingResponse>(
    '/customer/package-bookings',
    {},
    {
      params: {
        package_id,
        customer_id,
        ...(booking_id ? { booking_id } : {}),
      },
    },
  );
  return data;
};

export const useCreatePackageBooking = () =>
  useMutation({
    mutationFn: createPackageBooking,
  });

export const fetchAffiliatePackageById = async (
  packageId: string,
): Promise<AffiliatePackageItem> => {
  const { data } = await affiliateApi.get<AffiliatePackageItem>(
    `/public/packages/${packageId}`,
  );
  return data;
};

export const useAffiliatePackageById = (packageId: string) => {
  return useQuery({
    queryKey: ['affiliate-package', packageId],
    queryFn: () => fetchAffiliatePackageById(packageId),
    enabled: !!packageId,
  });
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
  const { data } = await affiliateApi.get<AffiliatePackagesByTagResponse>(
    `/public/packages/by-tag${qs ? `?${qs}` : ''}`,
  );
  return data;
};

export const useAffiliatePackagesByTag = (
  params: AffiliatePackagesByTagQueryParams,
) => {
  return useQuery({
    queryKey: ['affiliate-packages-by-tag', params.tagId ?? null, params.tagIds ?? null, params.limit ?? null],
    queryFn: () => fetchAffiliatePackagesByTag(params),
    enabled: Boolean(params.tagId || params.tagIds),
  });
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
  const { data } = await affiliateApi.get<AffiliatePackagesByTagNameResponse>(
    `/public/packages/by-tag-name${qs ? `?${qs}` : ''}`,
  );
  return data;
};

export const useAffiliatePackagesByTagName = (
  params: AffiliatePackagesByTagNameQueryParams,
) => {
  return useQuery<AffiliatePackagesByTagNameResponse>({
    queryKey: ['affiliate-packages-by-tag-name', params.tagName, params.q ?? null, params.limit ?? null, params.offset ?? 0],
    queryFn: () => fetchAffiliatePackagesByTagName(params),
    enabled: Boolean(params.tagName && params.tagName.length > 0),
  });
};

