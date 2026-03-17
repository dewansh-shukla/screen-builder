// AUTO-SYNCED from zapigowebclient — DO NOT EDIT DIRECTLY
// Source: /Users/dewanshshukla/Desktop/zapigo/zapigowebclient/src/components/SimpleResponsiveGallery.tsx
// Last synced: 2026-03-17T11:17:27.011Z
// API integrations stripped. Use props for data and callbacks.
'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, X } from '@untitledui/icons';

interface SimpleResponsiveGalleryProps {
  images: string[];
  className?: string;
}

/**
 * SimpleResponsiveGallery
 * A clean, responsive masonry-style gallery using CSS columns.
 * - Mobile: 2 columns
 * - Tablet: 3 columns
 * - Desktop: 4 columns
 */
export const SimpleResponsiveGallery: React.FC<
  SimpleResponsiveGalleryProps
> = ({ images, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const openAtIndex = useCallback((index: number) => {
    setActiveIndex(index);
    setIsOpen(true);
    setZoom(1);
    setTranslate({ x: 0, y: 0 });
  }, []);

  const goNext = useCallback(() => {
    setActiveIndex(prev => (prev + 1) % images.length);
  }, [images.length]);

  const goPrev = useCallback(() => {
    setActiveIndex(prev => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setZoom(1);
    setTranslate({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        goNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goPrev();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        closeModal();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, goNext, goPrev, closeModal]);

  const onWheel = useCallback(
    (e: React.WheelEvent) => {
      if (!isOpen) return;
      // Do not allow zooming via wheel; allow panning when zoomed only
      if (zoom > 1) {
        e.preventDefault();
        setTranslate(t => ({ x: t.x - e.deltaX, y: t.y - e.deltaY }));
      }
    },
    [isOpen, zoom],
  );

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (zoom === 1) return;
      isDraggingRef.current = true;
      lastPointRef.current = { x: e.clientX, y: e.clientY };
    },
    [zoom],
  );

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDraggingRef.current || zoom === 1 || !lastPointRef.current) return;
      const dx = e.clientX - lastPointRef.current.x;
      const dy = e.clientY - lastPointRef.current.y;
      lastPointRef.current = { x: e.clientX, y: e.clientY };
      setTranslate(t => ({ x: t.x + dx, y: t.y + dy }));
    },
    [zoom],
  );

  const endDrag = useCallback(() => {
    isDraggingRef.current = false;
    lastPointRef.current = null;
  }, []);

  const onTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (zoom === 1) return;
      const touch = e.touches[0];
      lastPointRef.current = { x: touch.clientX, y: touch.clientY };
    },
    [zoom],
  );

  const onTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (zoom === 1 || !lastPointRef.current) return;
      const touch = e.touches[0];
      const dx = touch.clientX - lastPointRef.current.x;
      const dy = touch.clientY - lastPointRef.current.y;
      lastPointRef.current = { x: touch.clientX, y: touch.clientY };
      setTranslate(t => ({ x: t.x + dx, y: t.y + dy }));
    },
    [zoom],
  );

  // Disable double click zooming; zoom is controlled only by buttons

  if (!images || images.length === 0) return null;

  return (
    <section className={className}>
      <div className="columns-2 gap-3 md:columns-3 md:gap-4 lg:columns-4">
        {images.map((src, index) => (
          <div
            key={`${src}-${index}`}
            className="bg-muted mb-3 cursor-zoom-in break-inside-avoid overflow-hidden rounded-xl md:mb-4"
            onClick={() => openAtIndex(index)}
          >
            <img
              src={src}
              alt={`Photo ${index + 1}`}
              loading="lazy"
              className="h-auto w-full transition-transform duration-300 ease-out hover:scale-[1.02]"
            />
          </div>
        ))}
      </div>

      {/* Custom Modal */}
      {isOpen && (
        <div className="fixed inset-0 top-0 left-0 z-50 grid h-[100dvh] w-screen max-w-none translate-x-0 translate-y-0 gap-0 border-0 bg-black/95 p-0 sm:rounded-none">
          <div
            ref={containerRef}
            className={`relative flex h-full w-full touch-none items-center justify-center ${zoom > 1 ? 'overflow-hidden' : 'overflow-visible'}`}
            onWheel={onWheel}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={endDrag}
            onMouseLeave={endDrag}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={endDrag}
            // double click intentionally disabled to avoid zooming
            role="application"
            aria-label="Image viewer"
          >
            <button
              aria-label="Close"
              onClick={closeModal}
              className="absolute top-3 right-3 z-20 rounded-full bg-black/60 p-2 text-white shadow ring-1 ring-white/20 backdrop-blur transition hover:bg-black/80"
            >
              <X className="h-5 w-5" />
            </button>
            <button
              aria-label="Previous image"
              onClick={goPrev}
              className="fixed top-1/2 left-4 z-30 -translate-y-1/2 rounded-full bg-black/60 p-3 text-white shadow transition hover:bg-black/80"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            <div className={`relative max-h-full max-w-full select-none`}>
              <img
                src={images[activeIndex]}
                alt={`Photo ${activeIndex + 1}`}
                className="block h-auto max-h-full w-auto max-w-full object-contain"
                style={{
                  transform: `translate(${translate.x}px, ${translate.y}px) scale(${zoom})`,
                  transformOrigin: 'center center',
                  willChange: 'transform',
                }}
                draggable={false}
              />
            </div>

            <button
              aria-label="Next image"
              onClick={goNext}
              className="fixed top-1/2 right-4 z-30 -translate-y-1/2 rounded-full bg-black/60 p-3 text-white shadow transition hover:bg-black/80"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            <div className="fixed bottom-4 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/60 px-3 py-1 text-xs text-white">
              <button
                aria-label="Zoom out"
                className="rounded-full bg-black/50 p-2 text-sm font-bold text-white hover:bg-black/70"
                onClick={() => {
                  setZoom(z => {
                    const next = Math.max(1, Number((z - 0.25).toFixed(2)));
                    if (next === 1) setTranslate({ x: 0, y: 0 });
                    return next;
                  });
                }}
              >
                −
              </button>
              <span className="min-w-[50px] text-center">
                {Math.round(zoom * 100)}%
              </span>
              <button
                aria-label="Zoom in"
                className="rounded-full bg-black/50 p-2 hover:bg-black/70"
                onClick={() =>
                  setZoom(z => Math.min(4, Number((z + 0.25).toFixed(2))))
                }
              >
                <Plus className="h-4 w-4" />
              </button>
              <button
                aria-label="Reset zoom"
                className="ml-2 rounded-full bg-black/50 p-2 text-sm font-bold text-white hover:bg-black/70"
                onClick={() => {
                  setZoom(1);
                  setTranslate({ x: 0, y: 0 });
                }}
              >
                ↻
              </button>
              <div className="ml-3 rounded-full bg-black/40 px-2 py-1">
                {activeIndex + 1} / {images.length}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export type { SimpleResponsiveGalleryProps };
