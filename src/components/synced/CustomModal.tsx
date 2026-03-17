// AUTO-SYNCED from zapigowebclient — DO NOT EDIT DIRECTLY
// Source: /Users/dewanshshukla/Desktop/zapigo/zapigowebclient/src/components/CustomModal.tsx
// Last synced: 2026-03-17T11:17:26.982Z
// API integrations stripped. Use props for data and callbacks.
import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { CloseButton } from '@/components/base/buttons/close-button';

interface CustomModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  themeColors?: {
    primary?: string;
    background?: string;
    text?: string;
  };
  showRemoveButton?: boolean;
  onRemove?: () => void;
  zIndex?: number;
  fullWidth?: boolean;
  className?: string;
}

const CustomModal: React.FC<CustomModalProps> = ({
  open,
  onClose,
  title,
  children,
  zIndex = 50,
  fullWidth = false,
  className = '',
  // themeColors,
  // showRemoveButton = false,
  // onRemove,
}) => {
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  // Handle browser back button to close modal
  const closedViaPopstate = useRef(false);

  useEffect(() => {
    if (!open) return;

    // Reset the ref when modal opens
    closedViaPopstate.current = false;

    // Push a history state when modal opens
    window.history.pushState({ modal: 'custom-modal' }, '');

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
      className="fixed inset-0 flex items-center justify-center bg-black/50"
      style={{ zIndex: zIndex }}
    >
      <div
        className="absolute inset-0"
        onClick={onClose}
        aria-label="Close modal overlay"
      />
      <div className={`relative z-10 mx-2 sm:mx-4 w-full overflow-hidden rounded-xl bg-white shadow-lg ${
        fullWidth 
          ? 'max-w-[95vw] h-[95vh]' 
          : 'max-w-[95vw] sm:max-w-[400px] md:max-w-[450px] max-h-[90vh] sm:max-h-[85vh]'
      } ${className}`}>
        {/* Close button at top right */}
        <div className="absolute top-0 right-0 z-20 p-2 sm:p-3">
          <CloseButton 
            onPress={onClose} 
            size="lg" 
            theme="light" 
            className="!size-10 sm:!size-8 [&>svg]:!size-6 sm:[&>svg]:!size-5 bg-white/80 hover:bg-white rounded-full shadow-md"
          />
        </div>
        {title && (
          <div className="flex items-center justify-between p-4 border-b border-gray-100 pr-12 sm:pr-14">
            <h2 className="font-lexend text-text-primary text-lg font-semibold sm:text-xl pr-2">
              {title}
            </h2>
          </div>
        )}
        <div className={`${fullWidth ? 'h-[calc(95vh-80px)] overflow-auto' : 'max-h-[calc(90vh-80px)] sm:max-h-[calc(85vh-80px)] overflow-y-auto px-4 pt-4 pb-4'} ${className.includes('image-modal') ? '!max-h-[calc(100vh-80px)] !h-[calc(100vh-80px)] sm:!max-h-[calc(90vh-80px)] sm:!h-auto !p-0 !flex !items-center !justify-center' : ''}`}>{children}</div>
        {/* {showRemoveButton && (
          <div className="p-4 pt-0">
            <button
              onClick={onRemove}
              disabled={true}
              className="flex w-full items-center font-lexend justify-center gap-2 rounded-lg bg-red-100 p-3 text-sm font-medium text-red-600 hover:bg-red-200"
            >
              <Trash2 size={18} />
              <span>Remove Entire Section</span>
            </button>
          </div>
        )} */}
      </div>
    </div>,
    document.body,
  );
};

export default CustomModal;
