// AUTO-SYNCED from zapigowebclient — DO NOT EDIT DIRECTLY
// Source: /Users/dewanshshukla/Desktop/zapigo/zapigowebclient/src/hooks/useClearSession.ts
// Last synced: 2026-03-17T11:05:34.440Z
// API integrations stripped. Use props for data and callbacks.
// [STRIPPED] import { useEventStore } from '@/app/(events-and-wedding)/(events)/store/useEventStore';
// [STRIPPED] import { useWeddingStore } from '@/app/(events-and-wedding)/(wedding)/store/useWeddingStore';
import { useSessionStore } from '@/store/useSessionStore';

export const useClearAllSessionStore = () => {
  const { clearEventSession } = useEventStore(state => state);
  const { clearWeddingSession } = useWeddingStore(state => state);
  const { clearPersistentData } = useSessionStore(state => state);

  const clearAllSessionStore = () => {
    clearWeddingSession();
    clearPersistentData();
    clearEventSession();
  };

  return clearAllSessionStore;
};
