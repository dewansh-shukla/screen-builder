// AUTO-SYNCED from zapigowebclient — DO NOT EDIT DIRECTLY
// Source: /Users/dewanshshukla/Desktop/zapigo/zapigowebclient/src/hooks/useCommerce.ts
// Last synced: 2026-03-17T11:05:34.441Z
// API integrations stripped. Use props for data and callbacks.
// [STRIPPED] import { useQuery } from '@tanstack/react-query';
// [STRIPPED] import { universalApi } from '@/lib/universal';
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
  return useQuery({
    queryKey: ['commerce-collections', shopId, limit, offset],
    enabled: Boolean(shopId) && enabled,
    queryFn: async () => {
      const params = { shopId, limit, offset } as const;
      const { data } = /* TODO: Manual review needed — universalApi call stripped */ undefined;
      return data.collections;
    },
    staleTime: 1000 * 60 * 5,
  });
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
  return useQuery({
    queryKey: ['collection-products', collectionId, limit, offset, search],
    enabled: Boolean(collectionId) && enabled,
    queryFn: async () => {
      const params: Record<string, string | number> = { limit, offset };
      if (search) params.search = search;
      const { data } = /* TODO: Manual review needed — universalApi call stripped */ undefined;
      return data.products;
    },
    staleTime: 1000 * 60 * 5,
  });
}


