// AUTO-SYNCED from zapigowebclient — DO NOT EDIT DIRECTLY
// Source: /Users/dewanshshukla/Desktop/zapigo/zapigowebclient/src/components/FoodPreferenceModal.tsx
// Last synced: 2026-03-17T11:17:26.992Z
// API integrations stripped. Use props for data and callbacks.
'use client';
/*
 * ============================================================
 * EXTRACTED PROPS (added by api-stripper)
 * Add these to the component's props interface:
 * ============================================================
 * // Data from useQuery — pass as prop
 * eventConfigData?: any;
 * // Loading state from useQuery
 * isLoading?: boolean;
 * // Data from useQuery — pass as prop
 * eventData?: EventResponse;
 * // Loading state from useQuery
 * isLoading?: boolean;
 * // Callback replacing updateEventMutation.mutate()
 * onUpdateEvent?: (...args: any[]) => void;
 * // Pending state replacing updateEventMutation.isPending
 * isUpdateEventPending?: boolean;
 * // User data from auth — pass as prop
 * userData?: { id: string; name: string; email: string; phone?: string } | null;
 * ============================================================
 */


import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { XClose } from '@untitledui/icons';
import { Button } from '@/components/base/buttons/button';
import { TextEditor } from '@/components/base/text-editor/text-editor';
// [STRIPPED] import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// [STRIPPED] import { universalApi } from '@/lib/universal';
// [STRIPPED] import { updateEvent } from '@/app/(events-and-wedding)/(events)/services/eventApi';
// [STRIPPED] import { getEventConfig, updateEventConfigWithMerge, toFoodFieldStatus, isFoodPreferenceRequired, isAskFoodField, ConfigFieldStatus } from '@/app/(events-and-wedding)/(events)/services/eventConfigApi';
// [STRIPPED] import { useToast } from '@/hooks/use-toast';
// [STRIPPED] import { useAuth } from '@/hooks/useAuth';
// [STRIPPED] 
interface FoodPreferenceModalProps {
  open: boolean;
  onClose: () => void;
  eventId: string;
}

interface EventResponse {
  status: string;
  message: string;
  event: {
    event_id: string;
    content_block: {
      food_notes?: string;
    } | null;
  };
}

export const FoodPreferenceModal: React.FC<FoodPreferenceModalProps> = ({
  open,
  onClose,
  eventId,
}) => {
  // [STRIPPED] useToast — replaced with console.log
const toast = (...args: any[]) => console.log('[Toast]', ...args);
  // [STRIPPED] useQueryClient removed — no cache invalidation in mockup
  // [STRIPPED] useAuth/useAuthStore — stubbed for screen-builder
  const isAuthenticated = false;
  const userData: { display_name?: string } | null = null;
  const logout = () => {};

  // Local state for form values
  const [vegEnabled, setVegEnabled] = useState(false);
  const [nonVegEnabled, setNonVegEnabled] = useState(false);
  const [allergiesNote, setAllergiesNote] = useState('');

  // Fetch event config for toggle state (food_preference, food_allergies) – only event config API
  // [STRIPPED] useQuery — data now comes from props

  // Fetch event details only for food_notes (event API)
  // [STRIPPED] useQuery — data now comes from props

  // Initialize form: toggles from event config only; food note from event
  useEffect(() => {
    if (eventConfigData?.data?.event) {
      setVegEnabled(/* [STRIPPED] isFoodPreferenceRequired call */ ((() => undefined) as any)());
      // For allergies, if it's OPTIONAL or REQUIRED in the backend, the toggle should be ON
      setNonVegEnabled(/* [STRIPPED] isAskFoodField call */ ((() => undefined) as any)());
    }
  }, [eventConfigData]);
  useEffect(() => {
    if (eventData?.event) {
      setAllergiesNote(eventData.event.content_block?.food_notes || '');
    }
  }, [eventData]);

  // Update toggles via event config API only; update food_notes via event API
  // [STRIPPED] updateEventMutation — use onUpdateEvent prop instead

  // Handle save
  const handleSave = () => {
    if (!userData?.uid) {
      toast({
        title: 'Error',
        description: 'User not authenticated. Please log in again.',
        variant: 'destructive',
        duration: 3000,
        className: 'z-50 bg-error-red text-white',
      });
      return;
    }

    onUpdateEvent?.({
      created_by: userData.uid,
      food_notes: allergiesNote,
      food_preference: vegEnabled,
      food_allergies: nonVegEnabled,
    });
  };

  // Close on escape key
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center"
      style={{ backgroundColor: 'rgba(10, 13, 18, 0.7)' }}
    >
      <div
        className="absolute inset-0"
        onClick={onClose}
        aria-label="Close modal overlay"
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-[393px] max-h-[85vh] overflow-y-auto rounded-tl-2xl rounded-tr-2xl bg-white shadow-[0px_20px_24px_-4px_rgba(10,13,18,0.08),0px_8px_8px_-4px_rgba(10,13,18,0.03),0px_3px_3px_-1.5px_rgba(10,13,18,0.04)]">
        {/* Header */}
        <div className="relative flex w-full flex-col items-center">
          <div className="flex w-full flex-col items-start gap-4 px-4 pb-0 pt-5">
            <div className="flex w-full flex-col items-start gap-0.5">
              <p className="font-lexend w-full text-base font-semibold leading-6 text-[#181d27]">
                Food Preferences
              </p>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute right-3 top-1 flex size-11 items-center justify-center overflow-clip rounded-lg p-2 hover:bg-gray-100"
            aria-label="Close"
          >
            <XClose className="size-6 text-[#a4a7ae]" />
          </button>

          {/* Bottom Padding */}
          <div className="h-5 w-full" />
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex w-full items-center justify-center p-8">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
          </div>
        ) : (
          <div className="flex w-full flex-col">
            {/* Veg Toggle */}
            <div className="flex w-full items-start gap-3 px-4 pb-4">
              <div className="flex min-w-0 grow basis-0 flex-col items-start gap-0.5">
                <p className="font-lexend w-full text-base font-medium leading-6 text-[#414651]">
                  Ask for veg/non-veg
                </p>
              </div>
              <div className="flex w-10 flex-col items-start pb-0 pt-0.5 px-0">
                <button
                  onClick={() => setVegEnabled(!vegEnabled)}
                  className={`flex h-5 w-full items-center overflow-clip rounded-full transition-colors ${vegEnabled ? 'justify-end bg-brand-600' : 'justify-start bg-gray-300'
                    }`}
                  aria-label={`Toggle veg ${vegEnabled ? 'off' : 'on'}`}
                >
                  <div
                    className={`size-5 rounded-full border border-solid ${vegEnabled ? 'border-brand-600 bg-white' : 'border-gray-300 bg-white'
                      }`}
                  />
                </button>
              </div>
            </div>

            {/* Non-Veg Toggle */}
            <div className="flex w-full items-start gap-3 px-4 pb-4 pt-2">
              <div className="flex min-w-0 grow basis-0 flex-col items-start gap-0.5">
                <p className="font-lexend w-full text-base font-medium leading-6 text-[#414651]">
                  Ask for food allergies
                </p>
              </div>
              <div className="flex w-10 flex-col items-start pb-0 pt-0.5 px-0">
                <button
                  onClick={() => setNonVegEnabled(!nonVegEnabled)}
                  className={`flex h-5 w-full items-center overflow-clip rounded-full transition-colors ${nonVegEnabled ? 'justify-end bg-brand-600' : 'justify-start bg-gray-300'
                    }`}
                  aria-label={`Toggle non-veg ${nonVegEnabled ? 'off' : 'on'}`}
                >
                  <div
                    className={`size-5 rounded-full border border-solid ${nonVegEnabled ? 'border-brand-600 bg-white' : 'border-gray-300 bg-white'
                      }`}
                  />
                </button>
              </div>
            </div>

            {/* Food Note TextArea */}
            <div className="flex w-full flex-col items-start gap-2.5 px-4 pb-4 pt-2">
              <div className="flex w-full flex-col items-start gap-1.5">
                <div className="flex flex-col items-start gap-0.5">
                  <p className="font-lexend text-sm font-medium leading-5 text-[#414651]">
                    A Note on the Food
                  </p>
                  <p className="font-lexend text-xs font-normal leading-[18px] text-[#717680]">
                    (For your guests. Maybe the menu, or any other information you may want to share)
                  </p>
                </div>
                <TextEditor.Root
                  content={allergiesNote}
                  onUpdate={({ editor }) => setAllergiesNote(editor.getHTML())}
                  placeholder="Enter here"
                  inputClassName="min-h-[120px]"
                >
                  <TextEditor.Toolbar />
                  <TextEditor.Content />
                </TextEditor.Root>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex w-full flex-col items-start gap-3 px-4 pb-4">
              <Button
                onClick={handleSave}
                disabled={isUpdateEventPending || isLoading}
                color="primary"
                size="md"
                className="w-full"
              >
                {isUpdateEventPending ? 'Saving...' : 'Save Details'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
};

export default FoodPreferenceModal;

