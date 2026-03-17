// AUTO-SYNCED from zapigowebclient — DO NOT EDIT DIRECTLY
// Source: /Users/dewanshshukla/Desktop/zapigo/zapigowebclient/src/hooks/useCommerce.ts
// Last synced: 2026-03-17T11:17:27.034Z
// API integrations stripped. Use props for data and callbacks.
// [STRIPPED] import { useQuery } from '@tanstack/react-query';
// [STRIPPED] import { universalApi } from '@/lib/universal';
// [STRIPPED] 
// ============== Types ==============
export interface CommerceCollection {
  id: string;
  title: string;
  description: string | null;
  product_image: string | null;
}

export interface CollectionsResponse {
  collections: CommerceCollection[];
}

export interface ImageSet {
  original?: string;
  mobile?: string;
  thumbnail?: string;
  desktop?: string;
}

export interface CommerceProduct {
  id: string;
  c56_title: string;
  c56_description?: string | null;
  featured_image?: ImageSet | null;
  images?: Record<string, ImageSet> | null;
  min_product_price?: number | null;
  max_product_price?: number | null;
  currency?: string | null;
}

export interface CollectionProductsResponse {
  collection_id: string;
  products: CommerceProduct[];
}

// ============== Hooks ==============
export function useCommerceCollections({
  shopId,
  limit = 12,
  offset = 0,
  enabled = true,
}: {
  shopId: string;
  limit?: number;
  offset?: number;
  enabled?: boolean;
}) {
  return { data: undefined, isLoading: false, isFetching: false, error: null, refetch: () => Promise.resolve({} as any), isSuccess: false, isError: false, status: 'idle' as const };
}

export function useCollectionProducts({
  collectionId,
  limit = 24,
  offset = 0,
  search = null,
  enabled = true,
}: {
  collectionId: string;
  limit?: number;
  offset?: number;
  search?: string | null;
  enabled?: boolean;
}) {
  return { data: undefined, isLoading: false, isFetching: false, error: null, refetch: () => Promise.resolve({} as any), isSuccess: false, isError: false, status: 'idle' as const };
}


