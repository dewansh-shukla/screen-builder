// AUTO-SYNCED from zapigowebclient — DO NOT EDIT DIRECTLY
// Source: /Users/dewanshshukla/Desktop/zapigo/zapigowebclient/src/hooks/useRouteChangeTracking.ts
// Last synced: 2026-03-17T11:17:27.036Z
// API integrations stripped. Use props for data and callbacks.
'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

type RouteChangeCallback = (
  currentUrl: string,
  prevUrl: string | null,
  isBack: boolean,
) => void;

/**
 * Hook that tracks route changes and detects back/forward navigation
 * @param callback Function to call when route changes
 */
export function useRouteChangeTracking(callback: RouteChangeCallback) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentUrl = `${pathname}${searchParams ? `?${searchParams}` : ''}`;

  // Keep track of navigation history and previous URL
  const prevUrlRef = useRef<string | null>(null);
  const historyStack = useRef<string[]>([]);
  const isBackNavigation = useRef(false);
  const isInitialRender = useRef(true);

  // Detect popstate (back/forward browser buttons)
  useEffect(() => {
    const handlePopState = () => {
      isBackNavigation.current = true;
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Track route changes
  useEffect(() => {
    // Skip initial render
    if (isInitialRender.current) {
      isInitialRender.current = false;
      prevUrlRef.current = currentUrl;
      historyStack.current.push(currentUrl);
      return;
    }

    // Check if this is a new URL
    const prevUrl = prevUrlRef.current;
    const isBack = isBackNavigation.current;

    // If this is a back/forward navigation
    if (isBack) {
      // Remove the current URL from history stack since we're going back
      if (historyStack.current.length > 1) {
        historyStack.current.pop();
      }
    } else {
      // Regular navigation - add to history stack
      historyStack.current.push(currentUrl);
    }

    // Call the callback
    callback(currentUrl, prevUrl, isBack);

    // Reset state for next change
    prevUrlRef.current = currentUrl;
    isBackNavigation.current = false;
  }, [pathname, searchParams, currentUrl, callback]);
}
