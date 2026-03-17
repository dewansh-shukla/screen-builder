// AUTO-SYNCED from zapigowebclient — DO NOT EDIT DIRECTLY
// Source: /Users/dewanshshukla/Desktop/zapigo/zapigowebclient/src/hooks/useHeaderConfig.ts
// Last synced: 2026-03-17T11:05:34.442Z
// API integrations stripped. Use props for data and callbacks.
import { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { HeaderConfig } from '@/types/navigation';
import { HEADER_ROUTES } from '@/config/headerConfig';

export const useHeaderConfig = (): HeaderConfig | null => {
  const pathname = usePathname();

  return useMemo(() => {
    if (!pathname) return null;

    const matchingConfig = HEADER_ROUTES.find(config =>
      config.pattern.test(pathname),
    );

    return matchingConfig || null;
  }, [pathname]);
};
