// AUTO-SYNCED from zapigowebclient — DO NOT EDIT DIRECTLY
// Source: /Users/dewanshshukla/Desktop/zapigo/zapigowebclient/src/hooks/useThemeLibrary.ts
// Last synced: 2026-03-17T11:05:34.444Z
// API integrations stripped. Use props for data and callbacks.
import { useState, useMemo } from 'react';
// [STRIPPED] import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
// [STRIPPED] import { useToast } from '@/hooks/use-toast';
// [STRIPPED] import { useAuth } from '@/hooks/useAuth';
// [STRIPPED] import { universalApi } from '@/lib/universal';
// [STRIPPED] import { updateEvent } from '@/app/(events-and-wedding)/(events)/services/eventApi';
// [STRIPPED] import { useEventStore } from '@/app/(events-and-wedding)/(events)/store/useEventStore';
// [STRIPPED] import { Theme, ThemeResponse } from '@/app/(events-and-wedding)/(events)/manage-event/[eventId]/theme-library/types';
export function useThemeLibrary(eventId: string) {
  const router = useRouter();
  // [STRIPPED] useToast — replaced with console.log
const toast = (...args: any[]) => console.log('[Toast]', ...args);
  // [STRIPPED] useQueryClient removed — no cache invalidation in mockup
  // [STRIPPED] useAuth/useAuthStore — values now come from props
  const { eventTypeId } = useEventStore();
/*
 * ============================================================
 * EXTRACTED PROPS (added by api-stripper)
 * Add these to the component's props interface:
 * ============================================================
 * // Data from useQuery — pass as prop
 * themeResponse?: ThemeResponse;
 * // Loading state from useQuery
 * isLoadingThemes?: boolean;
 * // Data from useQuery — pass as prop
 * eventData?: any;
 * // Loading state from useQuery
 * isLoading?: boolean;
 * // Callback replacing updateEventMutation.mutate()
 * onUpdateEvent?: (...args: any[]) => void;
 * // Pending state replacing updateEventMutation.isPending
 * isUpdateEventPending?: boolean;
 * // User data from auth — pass as prop
 * userData?: { id: string; name: string; email: string; phone?: string } | null;
 * ============================================================
 */


  const [selectedVariantId, setSelectedVariantId] = useState<Record<string, string>>({});
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch themes
  // [STRIPPED] useQuery — data now comes from props
      return response.data;
    },
    enabled: !!eventTypeId,
  });

  // Fetch current event to get current theme
  // [STRIPPED] useQuery — data now comes from props

  const currentThemeId = eventData?.event?.theme_id;

  // Update event mutation
  // [STRIPPED] updateEventMutation — use onUpdateEvent prop instead

  // Get current variant for a theme
  const getCurrentVariant = (theme: Theme) => {
    if (selectedVariantId[theme.theme_id]) {
      return theme.theme_variants.find(
        (v) => v.variant_id === selectedVariantId[theme.theme_id],
      );
    }
    return (
      theme.theme_variants.find((v) => v.is_default) || theme.theme_variants[0]
    );
  };

  // Handle variant selection
  const handleVariantSelect = (themeId: string, variantId: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    setSelectedVariantId((prev) => ({
      ...prev,
      [themeId]: variantId,
    }));
  };

  // Handle theme selection
  const handleThemeSelect = (theme: Theme) => {
    const variant = getCurrentVariant(theme);
    if (!variant) return;

    // If it's the same theme, just go back
    if (theme.theme_id === currentThemeId) {
      router.push(`/manage-event/${eventId}`);
      return;
    }

    onUpdateEvent?.({
      themeId: theme.theme_id,
      variantId: variant.variant_id,
    });
  };

  // Handle card click - opens modal
  const handleCardClick = (theme: Theme) => {
    setSelectedTheme(theme);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTheme(null);
  };

  // Get favourites (placeholder - implement actual logic)
  const favourites = useMemo(() => {
    if (!themeResponse?.data?.themes) return [];
    // TODO: Implement actual favourites filtering logic
    return [];
  }, [themeResponse?.data?.themes]);

  return {
    themeResponse,
    isLoadingThemes,
    currentThemeId,
    selectedVariantId,
    selectedTheme,
    isModalOpen,
    favourites,
    getCurrentVariant,
    handleVariantSelect,
    handleThemeSelect,
    handleCardClick,
    closeModal,
    updateEventMutation,
  };
}