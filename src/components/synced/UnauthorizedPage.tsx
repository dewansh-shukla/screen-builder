// AUTO-SYNCED from zapigowebclient — DO NOT EDIT DIRECTLY
// Source: /Users/dewanshshukla/Desktop/zapigo/zapigowebclient/src/components/UnauthorizedPage.tsx
// Last synced: 2026-03-17T11:17:27.013Z
// API integrations stripped. Use props for data and callbacks.
'use client';

import { useRouter } from 'next/navigation';
import EmptyState from '@/components/application/empty-state/empty-state';

interface UnauthorizedPageProps {
  onLoginClick?: () => void;
  title?: string;
  message?: string;
  showHomeButton?: boolean;
  showLoginButton?: boolean;
}

export function UnauthorizedPage({
  onLoginClick,
  title = 'Access Restricted',
  message = 'You need to be logged in to access this page.',
  showHomeButton = true,
  showLoginButton = true,
}: UnauthorizedPageProps) {
  const router = useRouter();

  const handleHomeClick = () => {
    router.push('/');
  };

  const handleLoginClick = () => {
    if (onLoginClick) {
      onLoginClick();
    } else {
      router.push('/login');
    }
  };

  return (
    <div className="flex min-h-[60vh] w-full items-center justify-center p-4">
      <EmptyState
        property1={
          showHomeButton && showLoginButton ? 'two-buttons' : 'default'
        }
        imageSrc="/assets/images/empty-state/access-denied.svg"
        imageAlt="Access denied illustration"
        title={title}
        description={message}
        showText={true}
        showSubtext={true}
        showButtons={showHomeButton || showLoginButton}
        // When two buttons, secondary=Home and primary=Login per design
        secondaryCtaLabel="Back to Home"
        onSecondaryClick={showHomeButton ? handleHomeClick : undefined}
        primaryCtaLabel={showLoginButton ? 'Login' : 'Back to Home'}
        onPrimaryClick={showLoginButton ? handleLoginClick : handleHomeClick}
      />
    </div>
  );
}
