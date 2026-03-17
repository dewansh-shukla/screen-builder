// AUTO-SYNCED from zapigowebclient — DO NOT EDIT DIRECTLY
// Source: /Users/dewanshshukla/Desktop/zapigo/zapigowebclient/src/components/PageLayout.tsx
// Last synced: 2026-03-17T11:17:27.007Z
// API integrations stripped. Use props for data and callbacks.
// components/PageLayout.tsx
/* eslint-disable react-hooks/exhaustive-deps */
'use client';
/*
 * ============================================================
 * EXTRACTED PROPS (added by api-stripper)
 * Add these to the component's props interface:
 * ============================================================
 * // Auth function — pass as prop
 * setPreviousPath?: (...args: any[]) => void | Promise<void>;
 * ============================================================
 */


import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
// [STRIPPED] import { useAuth } from '@/hooks/useAuth';
import { ProtectedRoute } from './ProtectedRoute';
import { isPublicRoute } from '@/utils/auth';

interface PageLayoutProps {
  children: React.ReactNode;
}

export default function PageLayout({ children }: PageLayoutProps) {
  const pathname = usePathname();
  // [STRIPPED] useAuth/useAuthStore — values now come from props

  // Check if current route requires authentication using utility function
  const isPublic = isPublicRoute(pathname);

  // Set previous path for non-public routes
  useEffect(() => {
    if (!isPublic) {
      setPreviousPath(pathname);
    }
  }, [pathname, isPublic, setPreviousPath]);

  // If it's a public route, render children directly
  if (isPublic) {
    return <>{children}</>;
  }

  // For protected routes, use the ProtectedRoute component
  return <ProtectedRoute requireAuth={true}>{children}</ProtectedRoute>;
}
