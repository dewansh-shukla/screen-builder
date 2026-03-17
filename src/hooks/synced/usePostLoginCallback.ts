// AUTO-SYNCED from zapigowebclient — DO NOT EDIT DIRECTLY
// Source: /Users/dewanshshukla/Desktop/zapigo/zapigowebclient/src/hooks/usePostLoginCallback.ts
// Last synced: 2026-03-17T11:17:27.035Z
// API integrations stripped. Use props for data and callbacks.
import { useRouter } from 'next/navigation';
import { usePostLoginStore } from '@/store/usePostLoginStore';

export const usePostLoginCallback = () => {
  const router = useRouter();
  const { setPostLoginAction, clearPostLoginAction, getPostLoginAction } =
    usePostLoginStore();

  const redirectToLogin = (returnPath?: string) => {
    const currentPath = window.location.pathname;
    const loginPath = returnPath
      ? `/login?returnTo=${encodeURIComponent(returnPath)}`
      : `/login?returnTo=${encodeURIComponent(currentPath)}`;

    router.push(loginPath);
  };

  return {
    setPostLoginAction,
    getPostLoginAction,
    clearPostLoginAction,
    redirectToLogin,
  };
};
