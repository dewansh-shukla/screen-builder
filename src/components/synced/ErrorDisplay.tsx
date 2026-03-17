// AUTO-SYNCED from zapigowebclient — DO NOT EDIT DIRECTLY
// Source: /Users/dewanshshukla/Desktop/zapigo/zapigowebclient/src/components/ErrorDisplay.tsx
// Last synced: 2026-03-17T11:17:26.989Z
// API integrations stripped. Use props for data and callbacks.
import React from 'react';
import { XCircle } from 'lucide-react';
import Link from 'next/link';

interface ErrorDisplayProps {
  title?: string;
  message?: string;
  showHomeLink?: boolean;
  showRetry?: boolean;
  onRetry?: () => void;
}

export function ErrorDisplay({
  title = 'Oops! Something went wrong',
  message = 'We encountered an error while processing your request.',
  showHomeLink = true,
  showRetry = false,
  onRetry,
}: ErrorDisplayProps) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-6">
      <XCircle className="mb-6 h-16 w-16 text-red-500" />
      <h1 className="mb-3 text-center text-2xl font-bold text-gray-900">
        {title}
      </h1>
      <p className="mb-8 max-w-sm text-center text-gray-600">{message}</p>
      <div className="flex gap-4">
        {showRetry && onRetry && (
          <button
            onClick={onRetry}
            className="bg-primary hover:bg-primary/90 rounded-lg px-6 py-2 text-white transition-colors"
          >
            Try Again
          </button>
        )}
        {showHomeLink && (
          <Link
            href="/"
            className="rounded-lg bg-gray-100 px-6 py-2 text-gray-700 transition-colors hover:bg-gray-200"
          >
            Go Home
          </Link>
        )}
      </div>
    </div>
  );
}
