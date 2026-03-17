// AUTO-SYNCED from zapigowebclient — DO NOT EDIT DIRECTLY
// Source: /Users/dewanshshukla/Desktop/zapigo/zapigowebclient/src/hooks/useCarousel.ts
// Last synced: 2026-03-17T11:17:27.033Z
// API integrations stripped. Use props for data and callbacks.
import { useState, useCallback } from 'react';
import type { CarouselApi } from '@/components/ui/carousel';

export function useCarousel() {
  const [api, setApi] = useState<CarouselApi>();
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!api) return;
    setSelectedIndex(api.selectedScrollSnap());
  }, [api]);

  const scrollTo = useCallback(
    (index: number) => {
      api?.scrollTo(index);
    },
    [api],
  );

  const handleApiChange = useCallback(
    (newApi: CarouselApi) => {
      setApi(newApi);
      newApi.on('select', onSelect);
    },
    [onSelect],
  );

  return {
    api,
    selectedIndex,
    setApi: handleApiChange,
    scrollTo,
  };
}
