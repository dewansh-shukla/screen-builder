// AUTO-SYNCED from zapigowebclient — DO NOT EDIT DIRECTLY
// Source: /Users/dewanshshukla/Desktop/zapigo/zapigowebclient/src/components/GuestResponseTypeModal.tsx
// Last synced: 2026-03-17T11:05:34.411Z
// API integrations stripped. Use props for data and callbacks.
'use client';
/*
 * ============================================================
 * EXTRACTED PROPS (added by api-stripper)
 * Add these to the component's props interface:
 * ============================================================
 * // Data from useQuery — pass as prop
 * configResponse?: any;
 * // Loading state from useQuery
 * isLoading?: boolean;
 * // Callback replacing updateRsvpMutation.mutate()
 * onUpdateRsvp?: (...args: any[]) => void;
 * // Pending state replacing updateRsvpMutation.isPending
 * isUpdateRsvpPending?: boolean;
 * ============================================================
 */


import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { XClose } from '@untitledui/icons';
import { Button } from '@/components/base/buttons/button';
// [STRIPPED] import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// [STRIPPED] import { getEventConfig, updateEventConfigWithMerge } from '@/app/(events-and-wedding)/(events)/services/eventConfigApi';
// [STRIPPED] import { useToast } from '@/hooks/use-toast';
import { cx } from '@/utils/cx';

interface GuestResponseTypeModalProps {
  open: boolean;
  onClose: () => void;
  eventId: string;
}

// Radio Button Component
interface RadioButtonProps {
  label: string;
  description: string;
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
}

const RadioButton = ({ label, description, selected, onClick, disabled = false }: RadioButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cx(
        'flex w-full items-start gap-3 rounded-xl p-4 transition-all duration-200 text-left',
        disabled
          ? 'cursor-not-allowed border border-gray-300 bg-gray-100'
          : selected
          ? 'border-2 border-[var(--border-color-orange)] bg-white'
          : 'border border-gray-300 bg-white hover:border-gray-400'
      )}
    >
      {/* Radio Circle */}
      <div className="flex items-center justify-center pb-0 pt-0.5">
        <div
          className={cx(
            'flex size-4 shrink-0 items-center justify-center rounded-full',
            disabled
              ? 'border border-gray-400 bg-gray-200'
              : selected
              ? 'bg-[var(--border-color-orange)]'
              : 'border border-gray-300'
          )}
        >
          {selected && !disabled && <div className="size-1.5 rounded-full bg-white" />}
        </div>
      </div>

      {/* Label and Description */}
      <div className="flex flex-1 flex-col items-start gap-1 text-left">
        <p className={cx(
          'font-lexend text-sm font-medium leading-5 text-left',
          disabled ? 'text-gray-600' : 'text-gray-700'
        )}>
          {label}
        </p>
        <p className={cx(
          'font-lexend text-xs font-normal leading-[18px] text-left',
          disabled ? 'text-gray-500' : 'text-gray-500'
        )}>
          {description}
        </p>
      </div>
    </button>
  );
};

export const GuestResponseTypeModal: React.FC<GuestResponseTypeModalProps> = ({
  open,
  onClose,
  eventId,
}) => {
  // [STRIPPED] useToast — replaced with console.log
const toast = (...args: any[]) => console.log('[Toast]', ...args);
  // [STRIPPED] useQueryClient removed — no cache invalidation in mockup
  
  // Local state for selected option
  // null = RSVP, "PASS" = Get a pass, undefined = not set
  const [selectedType, setSelectedType] = useState<string | null | undefined>(undefined);

  // Fetch event config (pass_type lives in rsvp config)
  // [STRIPPED] useQuery — data now comes from props

  const eventType = configResponse?.data?.event?.type;

  // Initialize selected type when modal opens - derive from event.type
  // event.type = "PASS" → Get a pass, "YES_NO_MAYBE" (or other) → RSVP
  useEffect(() => {
    if (!open) return;
    if (configResponse?.data) {
      setSelectedType(eventType === 'PASS' ? 'PASS' : null);
    } else {
      setSelectedType(undefined);
    }
  }, [configResponse?.data, eventType, open]);

  // Update event config (event.type) mutation
  // [STRIPPED] updateRsvpMutation — use onUpdateRsvp prop instead

  // Handle save - update pass_type in event-config RSVP API
  const handleSave = () => {
    // If selectedType is undefined, don't save (user hasn't selected anything)
    if (selectedType === undefined) {
      toast({
        title: 'Please select an option',
        description: 'Please select a guest response type before saving.',
        variant: 'default',
        duration: 3000,
        className: 'z-50 bg-yellow-500 text-white',
      });
      return;
    }

    const eventTypeToSave: 'YES_NO_MAYBE' | 'PASS' = selectedType === 'PASS' ? 'PASS' : 'YES_NO_MAYBE';
    onUpdateRsvp?.(eventTypeToSave);
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
                Guest Response Type
              </p>
              <p className="font-lexend text-xs font-normal leading-[18px] text-[#717680] mt-1">
                Radio group
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
        <div className="flex w-full flex-col px-4 pb-4 gap-3">
          {/* RSVP Option */}
          <RadioButton
            label="RSVP (yes/no/not sure)"
            description="Guests can confirm, and receive reminders, directions, MyGate passes, etc."
            selected={selectedType === null}
            onClick={() => setSelectedType(null)}
          />

          {/* Get a pass Option */}
          <RadioButton
            label="Get a pass"
            description="A unique pass is generated for each attendee, and can be verified by ushers using the Zapigo host app. The pass is sent on WhatsApp as well as available on the invite page. Ideal for larger events"
            selected={selectedType === 'PASS'}
            onClick={() => setSelectedType('PASS')}
          />

          {/* Remind me Option (Coming Soon) */}
          <RadioButton
            label="Remind me (coming soon)"
            description="Guests can opt to be reminded via WhatsApp/SMS. We send them the reminder and directions automatically"
            selected={false}
            onClick={() => {}}
            disabled={true}
          />

          {/* Save Button */}
          <div className="flex w-full flex-col items-start gap-3 pt-2">
            <Button
              onClick={handleSave}
              disabled={isUpdateRsvpPending || isLoading}
              color="primary"
              size="md"
              className="w-full"
              style={{ backgroundColor: 'var(--border-color-orange)' }}
            >
              {isUpdateRsvpPending ? 'Saving...' : 'Save Details'}
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default GuestResponseTypeModal;

