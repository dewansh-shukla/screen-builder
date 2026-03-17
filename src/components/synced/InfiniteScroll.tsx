// AUTO-SYNCED from zapigowebclient — DO NOT EDIT DIRECTLY
// Source: /Users/dewanshshukla/Desktop/zapigo/zapigowebclient/src/components/InfiniteScroll.tsx
// Last synced: 2026-03-17T11:17:27.000Z
// API integrations stripped. Use props for data and callbacks.
'use client';
import { useEffect, useRef, ReactNode } from 'react';

interface InfiniteScrollProps {
  loadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
  children: ReactNode;
  loadingComponent?: ReactNode;
  threshold?: number;
}

export const InfiniteScroll = ({
  loadMore,
  hasMore,
  isLoading,
  children,
  loadingComponent,
  threshold = 300,
}: InfiniteScrollProps) => {
  const observerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Log the current state for debugging
    const observer = new IntersectionObserver(
      entries => {
        const [entry] = entries;
        if (entry.isIntersecting && hasMore && !isLoading) {
          loadMore();
        }
      },
      {
        rootMargin: `0px 0px ${threshold}px 0px`,
      },
    );

    const currentObserver = observerRef.current;
    if (currentObserver) {
      observer.observe(currentObserver);
    }

    return () => {
      if (currentObserver) {
        observer.unobserve(currentObserver);
      }
    };
  }, [loadMore, hasMore, isLoading, threshold]);

  return (
    <>
      {children}
      <div ref={observerRef} className="h-10 w-full" />
      {isLoading &&
        (loadingComponent || (
          <div className="py-4 text-center">Loading more...</div>
        ))}
      {!hasMore && !isLoading && (
        <div className="py-4 text-center text-gray-500">
          No more items to load
        </div>
      )}
    </>
  );
};
