// AUTO-SYNCED from zapigowebclient — DO NOT EDIT DIRECTLY
// Source: /Users/dewanshshukla/Desktop/zapigo/zapigowebclient/src/hooks/usePreserveScroll.ts
// Last synced: 2026-03-17T11:05:34.443Z
// API integrations stripped. Use props for data and callbacks.
'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';

export const usePreserveScroll = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const scrollPositions = useRef<{ [url: string]: number }>({});
  const isBack = useRef(false);

  // Create a full URL key from pathname and search params
  const urlKey = pathname + searchParams.toString();

  // Detect back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      isBack.current = true;
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Save scroll position before leaving the page
  useEffect(() => {
    if (pathname) {
      const saveScrollPosition = () => {
        // Find the scrollable container from PageWrapper
        const scrollableContainer = document.querySelector('.scrollbar-hide');
        if (scrollableContainer) {
          scrollPositions.current[urlKey] = scrollableContainer.scrollTop;
        }
      };

      // Save position when navigating away
      window.addEventListener('beforeunload', saveScrollPosition);

      return () => {
        window.removeEventListener('beforeunload', saveScrollPosition);
        saveScrollPosition();
      };
    }
  }, [pathname, urlKey]);

  // Restore scroll position when coming back to a page
  useEffect(() => {
    if (isBack.current && scrollPositions.current[urlKey] !== undefined) {
      // Small timeout to ensure the DOM is fully loaded
      setTimeout(() => {
        const scrollableContainer = document.querySelector('.scrollbar-hide');
        if (scrollableContainer) {
          scrollableContainer.scrollTop = scrollPositions.current[urlKey];
        }
      }, 0);
    }

    isBack.current = false;
  }, [pathname, urlKey]);
};
