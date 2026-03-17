// AUTO-SYNCED from zapigowebclient — DO NOT EDIT DIRECTLY
// Source: /Users/dewanshshukla/Desktop/zapigo/zapigowebclient/src/hooks/useVisitorTracking.ts
// Last synced: 2026-03-17T11:17:27.038Z
// API integrations stripped. Use props for data and callbacks.
import { useEffect, useRef } from 'react';
// [STRIPPED] import { useAuthStore } from '@/store/useAuthStore';
import { generateSessionId, sendVisitorData } from '@/utils/analytics';
/*
 * ============================================================
 * EXTRACTED PROPS (added by api-stripper)
 * Add these to the component's props interface:
 * ============================================================
 * // Auth function — pass as prop
 * sessionId?: (...args: any[]) => void | Promise<void>;
 * // Auth function — pass as prop
 * setSessionId?: (...args: any[]) => void | Promise<void>;
 * // User data from auth — pass as prop
 * userData?: { id: string; name: string; email: string; phone?: string } | null;
 * ============================================================
 */


export const useVisitorTracking = (page: string, narration: string) => {
  // [STRIPPED] useAuth/useAuthStore — values now come from props
  const hasTracked = useRef(false);

  useEffect(() => {
    // Prevent multiple tracking calls for the same page
    if (hasTracked.current) {
      return;
    }

    const trackVisit = async () => {
      try {
        let currentSessionId = sessionId;

        // Generate new session ID if none exists
        if (!currentSessionId) {
          currentSessionId = generateSessionId();
          setSessionId(currentSessionId);
        }

        // Send visitor data
        await sendVisitorData(currentSessionId, page, narration, userData?.uid);

        // Mark as tracked to prevent duplicate calls
        hasTracked.current = true;
      } catch (error) {
        console.error('Error tracking visitor data:', error);
        // Don't mark as tracked on error so it can retry
      }
    };

    trackVisit();
  }, [page, narration, sessionId, setSessionId, userData?.uid]);

  // Reset tracking flag when page changes
  useEffect(() => {
    hasTracked.current = false;
  }, [page]);
};
