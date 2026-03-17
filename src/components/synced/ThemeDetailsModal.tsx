// AUTO-SYNCED from zapigowebclient — DO NOT EDIT DIRECTLY
// Source: /Users/dewanshshukla/Desktop/zapigo/zapigowebclient/src/components/ThemeDetailsModal.tsx
// Last synced: 2026-03-17T11:17:27.012Z
// API integrations stripped. Use props for data and callbacks.
'use client';

import React from 'react';
import ReactDOM from 'react-dom';
import Image from 'next/image';
import { XClose, Star06, Edit02, Copy01, Trash01 } from '@untitledui/icons';
import { useRouter } from 'next/navigation';
// [STRIPPED] import { Theme } from '@/app/(events-and-wedding)/(events)/manage-event/[eventId]/theme-library/types';
// [STRIPPED] 
type ModalContext = 'favourites' | 'my-themes' | 'shared' | 'default';

// Type that extends Theme to support optional image_url (used as fallback from ThemeLibraryEntry)
type ThemeInput = Theme & {
  image_url?: string;
};

interface ThemeDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeInput | null;
  eventId?: string;
  context?: ModalContext;
  onUseTemplate?: (theme: ThemeInput) => void;
  onEditTheme?: (theme: ThemeInput) => void;
  onMarkFavourite?: (theme: ThemeInput) => void;
  onRemoveFromFavourites?: (theme: ThemeInput) => void;
  onMakeCopy?: (theme: ThemeInput) => void;
  onShare?: (theme: ThemeInput) => void;
  onDelete?: (theme: ThemeInput) => void;
  isFavourite?: boolean;
}

export const ThemeDetailsModal: React.FC<ThemeDetailsModalProps> = ({
  isOpen,
  onClose,
  theme,
  eventId,
  // context is part of the API but currently unused (commented out in code)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  context: _context = 'default',
  onUseTemplate,
  onEditTheme,
  onMakeCopy,
  onDelete,
}) => {
  const router = useRouter();

  if (!isOpen || !theme) return null;

  // Get the default or first variant for preview
  // Handle case where theme_variants might be empty (from ThemeLibraryEntry conversion)
  const variant = theme.theme_variants?.find((v) => v.is_default) || theme.theme_variants?.[0];
  const imageUrl = variant?.assets?.main_asset_desktop?.uploadedAssetUrl ||
                   variant?.assets?.main_asset?.uploadedAssetUrl ||
                   variant?.preview_image ||
                   theme.image_url; // Fallback to image_url from ThemeLibraryEntry

  const handleUseTemplate = () => {
    if (onUseTemplate) {
      onUseTemplate(theme);
    } else if (eventId) {
      // Default behavior: navigate to theme page
      router.push(`/event-theme/${theme.theme_id}?eventId=${eventId}`);
    }
    onClose();
  };

  const handleEditTheme = () => {
    if (onEditTheme) {
      onEditTheme(theme);
    }
    onClose();
  };

  const handleMakeCopy = () => {
    if (onMakeCopy) {
      onMakeCopy(theme);
    }
    onClose();
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(theme);
    }
    onClose();
  };

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative z-10 mx-4 w-full max-w-2xl rounded-xl bg-gray-100 shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Row 1: Header - Title (left) and Close X (right) */}
        <div className="flex items-center justify-between bg-gray-100 px-4 py-3">
          <h2 className="text-base font-semibold text-gray-900" style={{ fontFamily: 'Lexend' }}>
            {theme.display_name}
          </h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-gray-200 transition-colors"
            aria-label="Close modal"
            type="button"
          >
            <XClose className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Row 2: Image (left) and Theme Name + Description (right) */}
        <div className="flex flex-row bg-gray-100">
          {/* Left Side - Preview Card */}
          <div className="w-1/2 p-4">
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
              <div className="p-3">
                <h3 className="text-sm font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Lexend' }}>
                  {theme.display_name}
                </h3>
                <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gradient-to-br from-blue-200 via-blue-300 to-blue-400">
                  {imageUrl ? (
                    <Image
                      src={imageUrl.startsWith('http') ? imageUrl : `https://${imageUrl}`}
                      alt={theme.display_name}
                      fill
                      className="object-cover"
                      sizes="50vw"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <div className="text-center">
                        <div className="text-3xl mb-1">🎉</div>
                        <div className="text-xs text-gray-600 font-medium">{theme.display_name}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Header and Description */}
          <div className="w-1/2 p-4 flex flex-col bg-gray-100">
            <h3 className="text-base font-bold text-gray-900 mb-2" style={{ fontFamily: 'Lexend' }}>
              {theme.display_name}
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed" style={{ fontFamily: 'Lexend' }}>
              {theme.description || 'No description available.'}
            </p>
          </div>
        </div>

        {/* Row 3: Action Buttons (below the image on left side) */}
        <div className="bg-gray-100 px-4 pb-4">
          <div className="w-1/2 flex flex-col gap-2">
            <button
              onClick={handleUseTemplate}
              className="flex items-center gap-2 px-0 py-2 hover:opacity-80 transition-opacity text-left disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontFamily: 'Lexend' }}
              type="button"
            >
              <Star06 className="h-4 w-4 text-gray-600" />
              <span className="text-xs font-medium text-gray-900">Use this template</span>
            </button>

            {onEditTheme && (
              <button
                onClick={handleEditTheme}
                className="flex items-center gap-2 px-0 py-2 hover:opacity-80 transition-opacity text-left"
                style={{ fontFamily: 'Lexend' }}
                type="button"
              >
                <div className="h-4 w-4 flex items-center justify-center border border-gray-300 rounded">
                  <Edit02 className="h-2.5 w-2.5 text-gray-600" />
                </div>
                <span className="text-xs font-medium text-gray-900">Edit theme</span>
              </button>
            )}

            {/* Favourite action intentionally disabled for Theme Library */}
            {/*
            {context === 'favourites' ? (
              <button
                onClick={handleMarkFavourite}
                className="flex items-center gap-2 px-0 py-2 hover:opacity-80 transition-opacity text-left disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ fontFamily: 'Lexend' }}
                type="button"
              >
                <Heart className="h-4 w-4 text-red-500 fill-red-500" />
                <span className="text-xs font-medium text-gray-900">Remove From Favourites</span>
              </button>
            ) : (
              <button
                onClick={handleMarkFavourite}
                className="flex items-center gap-2 px-0 py-2 hover:opacity-80 transition-opacity text-left disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ fontFamily: 'Lexend' }}
                type="button"
              >
                <Heart className={`h-4 w-4 ${isFavourite ? 'text-red-500 fill-red-500' : 'text-gray-600'}`} />
                <span className="text-xs font-medium text-gray-900">
                  {isFavourite ? 'Remove from Favourites' : 'Mark Favourite'}
                </span>
              </button>
            )}
            */}

            {onMakeCopy && (
              <button
                onClick={handleMakeCopy}
                className="flex items-center gap-2 px-0 py-2 hover:opacity-80 transition-opacity text-left"
                style={{ fontFamily: 'Lexend' }}
                type="button"
              >
                <Copy01 className="h-4 w-4 text-gray-600" />
                <span className="text-xs font-medium text-gray-900">Make a copy</span>
              </button>
            )}

            {onDelete && (
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 px-0 py-2 hover:opacity-80 transition-opacity text-left"
                style={{ fontFamily: 'Lexend' }}
                type="button"
              >
                <Trash01 className="h-4 w-4 text-gray-600" />
                <span className="text-xs font-medium text-gray-900">Delete theme</span>
              </button>
            )}

            {/* Share action intentionally disabled for Theme Library */}
            {/*
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-0 py-2 hover:opacity-80 transition-opacity text-left"
              style={{ fontFamily: 'Lexend' }}
              type="button"
            >
              <Share07 className="h-4 w-4 text-gray-600" />
              <span className="text-xs font-medium text-gray-900">Share</span>
            </button>
            */}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
};