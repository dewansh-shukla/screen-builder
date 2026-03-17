// AUTO-SYNCED from zapigowebclient — DO NOT EDIT DIRECTLY
// Source: /Users/dewanshshukla/Desktop/zapigo/zapigowebclient/src/components/InviteDesignModal.tsx
// Last synced: 2026-03-17T11:17:27.002Z
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
// [STRIPPED] import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// [STRIPPED] import { universalApi } from '@/lib/universal';
// [STRIPPED] import { updateEvent, UpdateEventPayload } from '@/app/(events-and-wedding)/(events)/services/eventApi';
// [STRIPPED] import { useToast } from '@/hooks/use-toast';
// [STRIPPED] import { useAuth } from '@/hooks/useAuth';
// [STRIPPED] 
interface InviteDesignModalProps {
  open: boolean;
  onClose: () => void;
  eventId: string;
}

interface EventResponse {
  status: string;
  message: string;
  event: {
    event_id: string;
    title?: string;
    meta_data?: {
      event_type_id?: string;
      occasion_title?: string;
    };
    content_block?: {
      header_text?: string;
      subtitle?: string;
    };
    theme_instance_data?: {
      theme_data?: {
        meta_data?: {
          default_text?: {
            header?: string;
            title?: string;
            subtitle?: string;
          };
        };
      };
    };
  };
}

export const InviteDesignModal: React.FC<InviteDesignModalProps> = ({
  open,
  onClose,
  eventId,
}) => {
  // [STRIPPED] useToast — replaced with console.log
const toast = (...args: any[]) => console.log('[Toast]', ...args);
  // [STRIPPED] useQueryClient removed — no cache invalidation in mockup
  // [STRIPPED] useAuth/useAuthStore — values now come from props
  
  // Local state for form values
  const [headerText, setHeaderText] = useState('');
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');

  // Fetch event details
  // [STRIPPED] useQuery — data now comes from props

  // Function to get default text from theme metadata if available
  const getDefaultFromMetaData = (
    field: 'header' | 'title' | 'subtitle',
    currentValue: string,
    themeMetaData: unknown,
  ): string => {
    if (currentValue) return currentValue;
    const metaDataTyped = themeMetaData as {
      default_text?: { [key: string]: string };
    };
    if (metaDataTyped?.default_text?.[field]) {
      return metaDataTyped.default_text[field];
    }
    return '';
  };

  // Initialize form values when data is loaded
  useEffect(() => {
    if (eventData?.event && open) {
      const event = eventData.event;
      const contentBlock = event.content_block;
      const themeMetaData = event.theme_instance_data?.theme_data?.meta_data;
      // const eventType = event.meta_data?.event_type_id; // Commented out - not currently used
      
      // Always use event.title for the title field (not occasion_title)
      // Title and occasion_title are separate fields
      const titleValue = event.title || '';
      
      // Pre-populate with existing values or theme defaults
      setHeaderText(
        getDefaultFromMetaData('header', contentBlock?.header_text || '', themeMetaData)
      );
      setTitle(
        getDefaultFromMetaData('title', titleValue, themeMetaData)
      );
      setSubtitle(
        getDefaultFromMetaData('subtitle', contentBlock?.subtitle || '', themeMetaData)
      );
    }
  }, [eventData, open]);

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

    // Validation - all three fields are required
    if (!headerText.trim()) {
      toast({
        title: 'Missing Information',
        description: 'Header Text is required.',
        variant: 'destructive',
        duration: 3000,
        className: 'z-50 bg-amber-500 text-white',
      });
      return;
    }

    if (!title.trim()) {
      toast({
        title: 'Missing Information',
        description: 'Title is required.',
        variant: 'destructive',
        duration: 3000,
        className: 'z-50 bg-amber-500 text-white',
      });
      return;
    }

    if (!subtitle.trim()) {
      toast({
        title: 'Missing Information',
        description: 'Subtitle is required.',
        variant: 'destructive',
        duration: 3000,
        className: 'z-50 bg-amber-500 text-white',
      });
      return;
    }

    // Prepare update payload
    // const eventType = eventData?.event?.meta_data?.event_type_id; // Commented out - not currently used
    const existingContentBlock = eventData?.event?.content_block as Record<string, unknown> | null | undefined;
    
    // Build content_block object - all fields are required now
    const contentBlockUpdate: Record<string, unknown> = {
      ...(existingContentBlock || {}),
      header_text: headerText.trim(),
      subtitle: subtitle.trim(),
    };
    
    const payload: UpdateEventPayload = {
      created_by: userData.uid,
      header_text: headerText.trim(),
      subtitle: subtitle.trim(),
      content_block: contentBlockUpdate,
      title: title.trim(), // Always update title, never update occasion_title from this modal
    };

    onUpdateEvent?.(payload);
  };

  // Handle escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onClose();
      }
    };

    if (open) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return ReactDOM.createPortal(
    <>
      <div
        className="fixed inset-0 z-[100] flex items-end justify-center"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0"
          onClick={onClose}
          aria-label="Close modal overlay"
        />
        
        {/* Modal */}
        <div className="relative z-10 w-full max-w-[393px] max-h-[90vh] overflow-y-auto rounded-tl-2xl rounded-tr-2xl bg-white shadow-[0px_20px_24px_-4px_rgba(10,13,18,0.08),0px_8px_8px_-4px_rgba(10,13,18,0.03),0px_3px_3px_-1.5px_rgba(10,13,18,0.04)]">
          {/* Header */}
          <div className="sticky top-0 z-10 bg-white flex w-full flex-col items-center">
            <div className="flex w-full flex-col items-start gap-4 px-4 pb-0 pt-5">
              <div className="flex w-full flex-col items-start gap-0.5">
                <p className="font-lexend w-full text-base font-semibold leading-6 text-[#181d27]">
                  Edit Invite Design
                </p>
                <p className="font-lexend text-sm font-normal leading-5 text-[#717680]">
                  Customize your invitation text
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
          <div className="flex w-full flex-col items-start px-4 pb-4 pt-0">
            <div className="flex w-full flex-col items-start gap-4">
              {/* Header Text Input */}
              <div className="flex w-full flex-col items-start gap-1.5">
                <div className="flex w-full items-center justify-between">
                  <div className="font-lexend flex items-start gap-0.5 whitespace-pre text-sm font-medium leading-5">
                    <p className="text-[#414651]">Header Text</p>
                    <p className="text-brand-600">*</p>
                  </div>
                  <span className="font-lexend text-xs text-[#717680]">
                    {headerText.length}/100
                  </span>
                </div>
                <div className="flex w-full items-start gap-2 rounded-lg border border-solid border-[#d5d7da] bg-white px-3 py-2">
                  <textarea
                    value={headerText}
                    onChange={(e) => setHeaderText(e.target.value)}
                    maxLength={100}
                    placeholder="e.g., We are celebrating"
                    rows={2}
                    className="font-lexend min-w-0 grow basis-0 text-base font-normal leading-6 text-[#181d27] placeholder:text-[#717680] focus:outline-none resize-none"
                  />
                </div>
              </div>

              {/* Title Input */}
              <div className="flex w-full flex-col items-start gap-1.5">
                <div className="flex w-full items-center justify-between">
                  <div className="font-lexend flex items-start gap-0.5 whitespace-pre text-sm font-medium leading-5">
                    <p className="text-[#414651]">Title</p>
                    <p className="text-brand-600">*</p>
                  </div>
                  <span className="font-lexend text-xs text-[#717680]">
                    {title.length}/100
                  </span>
                </div>
                <div className="flex w-full items-start gap-2 rounded-lg border border-solid border-[#d5d7da] bg-white px-3 py-2">
                  <textarea
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={100}
                    placeholder="e.g., Kalpana's Birthday"
                    rows={2}
                    className="font-lexend min-w-0 grow basis-0 text-base font-normal leading-6 text-[#181d27] placeholder:text-[#717680] focus:outline-none resize-none"
                  />
                </div>
              </div>

              {/* Subtitle Input */}
              <div className="flex w-full flex-col items-start gap-1.5">
                <div className="flex w-full items-center justify-between">
                  <div className="font-lexend flex items-start gap-0.5 whitespace-pre text-sm font-medium leading-5">
                    <p className="text-[#414651]">Subtitle</p>
                    <p className="text-brand-600">*</p>
                  </div>
                  <span className="font-lexend text-xs text-[#717680]">
                    {subtitle.length}/200
                  </span>
                </div>
                <div className="flex w-full items-start gap-2 rounded-lg border border-solid border-[#d5d7da] bg-white px-3 py-2">
                  <textarea
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    maxLength={200}
                    placeholder="e.g., You are invited"
                    rows={3}
                    className="font-lexend min-w-0 grow basis-0 text-base font-normal leading-6 text-[#181d27] placeholder:text-[#717680] focus:outline-none resize-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="sticky bottom-0 z-10 bg-white flex w-full flex-col items-start gap-3 px-4 pb-4 pt-3 border-t border-gray-100">
            <Button
              onClick={handleSave}
              disabled={isUpdateEventPending || isLoading || !headerText.trim() || !title.trim() || !subtitle.trim()}
              color="primary"
              size="md"
              className="w-full"
            >
              {isUpdateEventPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
};

