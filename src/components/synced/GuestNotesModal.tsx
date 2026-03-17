// AUTO-SYNCED from zapigowebclient — DO NOT EDIT DIRECTLY
// Source: /Users/dewanshshukla/Desktop/zapigo/zapigowebclient/src/components/GuestNotesModal.tsx
// Last synced: 2026-03-17T11:17:26.996Z
// API integrations stripped. Use props for data and callbacks.
'use client';
/*
 * ============================================================
 * EXTRACTED PROPS (added by api-stripper)
 * Add these to the component's props interface:
 * ============================================================
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
// [STRIPPED] import { updateEvent, UpdateEventPayload } from '@/app/(events-and-wedding)/(events)/services/eventApi';
// [STRIPPED] import { useToast } from '@/hooks/use-toast';
// [STRIPPED] import { useAuth } from '@/hooks/useAuth';
// [STRIPPED] 
interface GuestNotesModalProps {
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
      dress_code_notes?: string;
      notes?: string;
    }
  };
}

export const GuestNotesModal: React.FC<GuestNotesModalProps> = ({
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
  const [dressCode, setDressCode] = useState('');
  const [note, setNote] = useState('');

  // Fetch event details
  // [STRIPPED] useQuery — data now comes from props

  // Initialize form values when data is loaded
  useEffect(() => {
    if (eventData?.event) {
      const event = eventData.event;
      setDressCode(event?.content_block?.dress_code_notes || '');
      setNote(event?.content_block?.notes || '');
    }
  }, [eventData]);

  // Update event mutation
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

    const payload: UpdateEventPayload = {
      created_by: userData.uid,
      dress_code_notes: dressCode,
      notes: note,
    };

    onUpdateEvent?.(payload);
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
      <div className="relative z-10 w-full max-w-[393px] rounded-tl-2xl rounded-tr-2xl bg-white shadow-[0px_20px_24px_-4px_rgba(10,13,18,0.08),0px_8px_8px_-4px_rgba(10,13,18,0.03),0px_3px_3px_-1.5px_rgba(10,13,18,0.04)]">
        {/* Header */}
        <div className="relative flex w-full flex-col items-center">
          <div className="flex w-full flex-col items-start gap-4 px-4 pb-0 pt-5">
            <div className="flex w-full flex-col items-start gap-0.5">
              <p className="font-lexend w-full text-base font-semibold leading-6 text-[#181d27]">
                Notes for Guests
              </p>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute right-3 top-3 flex size-11 items-center justify-center overflow-clip rounded-lg p-2 hover:bg-gray-100"
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
          <div className="flex w-full cursor-pointer flex-col items-start gap-3 px-4 pb-4 pt-0">
            {/* Dress Code Input */}
            <div className="flex w-full flex-col items-start gap-1.5">
              <div className="font-lexend flex items-start gap-0.5 whitespace-pre text-sm font-medium leading-5">
                <p className="text-[#414651]">Dress Code</p>
              </div>
              <TextEditor.Root
                content={dressCode}
                onUpdate={({ editor }) => setDressCode(editor.getHTML())}
                placeholder="Theme name"
                inputClassName="min-h-[120px]"
              >
                <TextEditor.Toolbar />
                <TextEditor.Content />
              </TextEditor.Root>
            </div>

            {/* Note Input */}
            <div className="flex w-full flex-col items-start gap-1.5">
              <div className="font-lexend flex items-start gap-0.5 whitespace-pre text-sm font-medium leading-5">
                <p className="text-[#414651]">Note</p>
              </div>
              <TextEditor.Root
                content={note}
                onUpdate={({ editor }) => setNote(editor.getHTML())}
                placeholder="Enter"
                inputClassName="min-h-[120px]"
              >
                <TextEditor.Toolbar />
                <TextEditor.Content />
              </TextEditor.Root>
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="flex w-full flex-col items-start gap-3 px-4 pb-4 pt-0">
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
    </div>,
    document.body,
  );
};

export default GuestNotesModal;

