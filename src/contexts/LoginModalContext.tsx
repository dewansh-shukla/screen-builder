'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface LoginModalContextType {
  isLoginModalOpen: boolean;
  openLoginModal: (redirectPath?: string) => void;
  closeLoginModal: () => void;
  redirectPath: string | null;
}

const LoginModalContext = createContext<LoginModalContextType | undefined>(undefined);

export function LoginModalProvider({ children }: { children: ReactNode }) {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [redirectPath, setRedirectPath] = useState<string | null>(null);

  const openLoginModal = useCallback((path?: string) => {
    setRedirectPath(path || null);
    setIsLoginModalOpen(true);
  }, []);

  const closeLoginModal = useCallback(() => {
    setIsLoginModalOpen(false);
    setRedirectPath(null);
  }, []);

  return (
    <LoginModalContext.Provider value={{ isLoginModalOpen, openLoginModal, closeLoginModal, redirectPath }}>
      {children}
    </LoginModalContext.Provider>
  );
}

export function useLoginModal() {
  const context = useContext(LoginModalContext);
  if (context === undefined) {
    // In screen-builder, return a no-op stub instead of throwing
    return {
      isLoginModalOpen: false,
      openLoginModal: () => {},
      closeLoginModal: () => {},
      redirectPath: null,
    };
  }
  return context;
}
