// AUTO-SYNCED from zapigowebclient — DO NOT EDIT DIRECTLY
// Source: /Users/dewanshshukla/Desktop/zapigo/zapigowebclient/src/hooks/themeLibraryHooks.ts
// Last synced: 2026-03-17T11:05:34.438Z
// API integrations stripped. Use props for data and callbacks.
// src/hooks/themeLibraryHooks.ts
// Theme Library API Contract V2 — React Query Hooks

// [STRIPPED] import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  // Theme CRUD
  createTheme,
  getTheme,
  listThemes,
  updateTheme,
  deleteTheme,
  // Library CRUD
  createLibrary,
  getLibrary,
  listLibraries,
  updateLibrary,
  // Associations
  createAssociation,
  setDefaultAssociation,
  deleteAssociation,
  // Library ↔ User/Org
  createLibraryObject,
  getUserLibraries,
  deleteLibraryObject,
  // Favourites & Usage
  toggleFavourite,
  getUserFavourites,
  markThemeUsed,
  getUserRecent,
  // Convenience
  getUserDefault,
  setupDefault,
  copyTheme,
  removeBanner,
  // Color extraction
  extractColors,
} from '@/lib/themeLibraryService';

import type {
  CreateThemePayload,
  UpdateThemePayload,
  CopyThemePayload,
  RemoveBannerPayload,
  CreateLibraryPayload,
  UpdateLibraryPayload,
  CreateAssociationPayload,
  CreateLibraryObjectPayload,
  ToggleFavouritePayload,
  MarkUsedPayload,
  ExtractColorsPayload,
} from '@/lib/themeLibraryTypes';

// ─── Theme CRUD Hooks ───────────────────────────────────────────────────────

export const useCreateTheme = () => {
  // [STRIPPED] useQueryClient removed — no cache invalidation in mockup
  return useMutation({
    mutationFn: (payload: CreateThemePayload) => createTheme(payload),
    onSuccess: () => {
      // [STRIPPED] cache invalidation removed
    },
  });
};

export const useTheme = (themeId?: string) => {
  return useQuery({
    queryKey: ['themeLibrary', 'theme', themeId],
    queryFn: () => getTheme(themeId!),
    enabled: Boolean(themeId),
  });
};

export const useThemes = (
  params?: { creator_type?: string; created_by?: string; limit?: number; offset?: number },
) => {
  return useQuery({
    queryKey: ['themeLibrary', 'themes', params],
    queryFn: () => listThemes(params || {}),
    enabled: params !== undefined,
    staleTime: 1000 * 60 * 5,
  });
};

export const useUpdateTheme = () => {
  // [STRIPPED] useQueryClient removed — no cache invalidation in mockup
  return useMutation({
    mutationFn: ({ themeId, payload }: { themeId: string; payload: UpdateThemePayload }) =>
      updateTheme(themeId, payload),
    onSuccess: (_data, variables) => {
      // [STRIPPED] cache invalidation removed
      // [STRIPPED] cache invalidation removed
    },
  });
};

export const useDeleteTheme = () => {
  // [STRIPPED] useQueryClient removed — no cache invalidation in mockup
  return useMutation({
    mutationFn: (themeId: string) => deleteTheme(themeId),
    onSuccess: () => {
      // [STRIPPED] cache invalidation removed
    },
  });
};

// ─── Library CRUD Hooks ─────────────────────────────────────────────────────

export const useCreateLibrary = () => {
  // [STRIPPED] useQueryClient removed — no cache invalidation in mockup
  return useMutation({
    mutationFn: (payload: CreateLibraryPayload) => createLibrary(payload),
    onSuccess: () => {
      // [STRIPPED] cache invalidation removed
    },
  });
};

export const useLibrary = (libraryId?: string) => {
  return useQuery({
    queryKey: ['themeLibrary', 'library', libraryId],
    queryFn: () => getLibrary(libraryId!),
    enabled: Boolean(libraryId),
  });
};

export const useLibraries = (
  params?: { created_by?: string; is_public?: boolean; limit?: number; offset?: number },
) => {
  return useQuery({
    queryKey: ['themeLibrary', 'libraries', params],
    queryFn: () => listLibraries(params || {}),
    enabled: params !== undefined,
    staleTime: 1000 * 60 * 5,
  });
};

export const useUpdateLibrary = () => {
  // [STRIPPED] useQueryClient removed — no cache invalidation in mockup
  return useMutation({
    mutationFn: ({ libraryId, payload }: { libraryId: string; payload: UpdateLibraryPayload }) =>
      updateLibrary(libraryId, payload),
    onSuccess: (_data, variables) => {
      // [STRIPPED] cache invalidation removed
      // [STRIPPED] cache invalidation removed
    },
  });
};

// ─── Association Hooks ──────────────────────────────────────────────────────

export const useCreateAssociation = () => {
  // [STRIPPED] useQueryClient removed — no cache invalidation in mockup
  return useMutation({
    mutationFn: (payload: CreateAssociationPayload) => createAssociation(payload),
    onSuccess: () => {
      // [STRIPPED] cache invalidation removed
    },
  });
};

export const useSetDefaultAssociation = () => {
  // [STRIPPED] useQueryClient removed — no cache invalidation in mockup
  return useMutation({
    mutationFn: (assocId: string) => setDefaultAssociation(assocId),
    onSuccess: () => {
      // [STRIPPED] cache invalidation removed
    },
  });
};

export const useDeleteAssociation = () => {
  // [STRIPPED] useQueryClient removed — no cache invalidation in mockup
  return useMutation({
    mutationFn: (assocId: string) => deleteAssociation(assocId),
    onSuccess: () => {
      // [STRIPPED] cache invalidation removed
    },
  });
};

// ─── Library ↔ User/Org Hooks ───────────────────────────────────────────────

export const useCreateLibraryObject = () => {
  // [STRIPPED] useQueryClient removed — no cache invalidation in mockup
  return useMutation({
    mutationFn: (payload: CreateLibraryObjectPayload) => createLibraryObject(payload),
    onSuccess: () => {
      // [STRIPPED] cache invalidation removed
    },
  });
};

export const useUserLibraries = (userId?: string) => {
  return useQuery({
    queryKey: ['themeLibrary', 'userLibraries', userId],
    queryFn: () => getUserLibraries(userId!),
    enabled: Boolean(userId),
    staleTime: 1000 * 60 * 5,
  });
};

export const useDeleteLibraryObject = () => {
  // [STRIPPED] useQueryClient removed — no cache invalidation in mockup
  return useMutation({
    mutationFn: (assocId: string) => deleteLibraryObject(assocId),
    onSuccess: () => {
      // [STRIPPED] cache invalidation removed
    },
  });
};

// ─── Favourites & Usage Hooks ───────────────────────────────────────────────

export const useToggleFavourite = () => {
  // [STRIPPED] useQueryClient removed — no cache invalidation in mockup
  return useMutation({
    mutationFn: (payload: ToggleFavouritePayload) => toggleFavourite(payload),
    onSuccess: (_data, variables) => {
      // [STRIPPED] cache invalidation removed
      // [STRIPPED] cache invalidation removed
    },
  });
};

export const useUserFavourites = (
  userId?: string,
  params?: { limit?: number; offset?: number },
) => {
  return useQuery({
    queryKey: ['themeLibrary', 'favourites', userId, params],
    queryFn: () => getUserFavourites(userId!, params),
    enabled: Boolean(userId),
    staleTime: 1000 * 60 * 5,
  });
};

export const useMarkThemeUsed = () => {
  // [STRIPPED] useQueryClient removed — no cache invalidation in mockup
  return useMutation({
    mutationFn: (payload: MarkUsedPayload) => markThemeUsed(payload),
    onSuccess: (_data, variables) => {
      // [STRIPPED] cache invalidation removed
      // [STRIPPED] cache invalidation removed
    },
  });
};

export const useUserRecent = (
  userId?: string,
  params?: { limit?: number },
) => {
  return useQuery({
    queryKey: ['themeLibrary', 'recent', userId, params],
    queryFn: () => getUserRecent(userId!, params),
    enabled: Boolean(userId),
    staleTime: 1000 * 60 * 5,
  });
};

// ─── Convenience / Flow Hooks ───────────────────────────────────────────────

export const useUserDefault = (userId?: string) => {
  return useQuery({
    queryKey: ['themeLibrary', 'default', userId],
    queryFn: () => getUserDefault(userId!),
    enabled: Boolean(userId),
  });
};

export const useSetupDefault = () => {
  // [STRIPPED] useQueryClient removed — no cache invalidation in mockup
  return useMutation({
    mutationFn: (userId: string) => setupDefault(userId),
    onSuccess: () => {
      // [STRIPPED] cache invalidation removed
    },
  });
};

export const useCopyTheme = () => {
  // [STRIPPED] useQueryClient removed — no cache invalidation in mockup
  return useMutation({
    mutationFn: (payload: CopyThemePayload) => copyTheme(payload),
    onSuccess: () => {
      // [STRIPPED] cache invalidation removed
    },
  });
};

export const useRemoveBanner = () => {
  // [STRIPPED] useQueryClient removed — no cache invalidation in mockup
  return useMutation({
    mutationFn: (payload: RemoveBannerPayload) => removeBanner(payload),
    onSuccess: () => {
      // [STRIPPED] cache invalidation removed
    },
  });
};

// ─── Color Extraction Hook ─────────────────────────────────────────────────

export const useExtractColors = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // [STRIPPED] useQueryClient removed — no cache invalidation in mockup
  return useMutation({
    mutationFn: (payload: ExtractColorsPayload) => extractColors(payload),
    onSuccess: () => {
      // Color extraction results are not cached queries to invalidate
    },
  });
};
