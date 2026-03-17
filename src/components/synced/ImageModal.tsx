// AUTO-SYNCED from zapigowebclient — DO NOT EDIT DIRECTLY
// Source: /Users/dewanshshukla/Desktop/zapigo/zapigowebclient/src/components/ImageModal.tsx
// Last synced: 2026-03-17T11:17:26.999Z
// API integrations stripped. Use props for data and callbacks.
'use client';

import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import Image from 'next/image';

interface ImageModalProps {
  open: boolean;
  onClose: () => void;
  imageSrc: string;
  imageAlt: string;
  zIndex?: number;
}

export function ImageModal({
  open,
  onClose,
  imageSrc,
  imageAlt,
  zIndex = 60,
}: ImageModalProps) {
  const closedViaPopstate = useRef(false);

  // Handle Escape key
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  // Handle browser back button to close modal
  useEffect(() => {
    if (!open) return;

    // Reset the ref when modal opens
    closedViaPopstate.current = false;

    // Push a history state when modal opens
    window.history.pushState({ modal: 'image-modal' }, '');

    const handlePopState = () => {
      closedViaPopstate.current = true;
      onClose();
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      // Pop the history entry if modal closes programmatically (not via back button)
      if (!closedViaPopstate.current) {
        window.history.back();
      }
      closedViaPopstate.current = false;
    };
  }, [open, onClose]);

  if (!open) return null;

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/90"
      style={{ zIndex: zIndex }}
    >
      <div
        className="absolute inset-0"
        onClick={onClose}
        role="presentation"
      />
      <div className="relative z-10 !max-w-none !w-full sm:!w-fit !max-h-[100vh] sm:!max-h-[90vh] !mx-0 sm:!mx-4 !rounded-none sm:!rounded-xl overflow-hidden bg-white shadow-lg flex flex-col">
        <div className="relative w-full flex-1 flex items-center justify-center p-0 min-h-0">
          <Image
            src={imageSrc}
            alt={imageAlt}
            width={1200}
            height={900}
            className="object-contain w-full h-auto sm:max-h-[calc(90vh-80px)] sm:max-w-[90vw] sm:w-auto"
            style={{
              maxHeight: 'calc(100vh - 80px)',
              maxWidth: '100vw',
              width: '100%',
              height: 'auto',
              display: 'block',
            }}
          />
        </div>
        <button
          onClick={onClose}
          className="flex items-center justify-center border-t border-gray-100 bg-[#FF8C00] hover:bg-[#E67E00] py-4 w-full text-white font-semibold text-base sm:text-lg transition-colors"
        >
          Close
        </button>
      </div>
    </div>,
    document.body,
  );
}
