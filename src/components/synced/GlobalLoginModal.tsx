// AUTO-SYNCED from zapigowebclient — DO NOT EDIT DIRECTLY
// Source: /Users/dewanshshukla/Desktop/zapigo/zapigowebclient/src/components/GlobalLoginModal.tsx
// Last synced: 2026-03-17T11:17:26.995Z
// API integrations stripped. Use props for data and callbacks.
'use client';
/*
 * ============================================================
 * EXTRACTED PROPS (added by api-stripper)
 * Add these to the component's props interface:
 * ============================================================
 * // Auth function — pass as prop
 * previousPath?: (...args: any[]) => void | Promise<void>;
 * ============================================================
 */


import { useLoginModal } from '@/contexts/LoginModalContext';
import { LoginModal } from './LoginModal';
// [STRIPPED] import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { usePostLoginStore } from '@/store/usePostLoginStore';

export function GlobalLoginModal() {
  const { isLoginModalOpen, closeLoginModal, redirectPath } = useLoginModal();
  // [STRIPPED] useAuth/useAuthStore — values now come from props
  const { postLoginAction, clearPostLoginAction } = usePostLoginStore();
  const router = useRouter();

  const handleLoginSuccess = () => {
    // Handle post-login actions
    if (postLoginAction) {
      clearPostLoginAction();
      closeLoginModal();
      return;
    }

    // Handle redirect logic
    const targetPath = redirectPath || previousPath || '/';
    router.push(targetPath);
    closeLoginModal();
  };

  return (
    <LoginModal
      open={isLoginModalOpen}
      onClose={closeLoginModal}
      onLoginSuccess={handleLoginSuccess}
      zIndex={9999}
    />
  );
}
