// AUTO-SYNCED from zapigowebclient — DO NOT EDIT DIRECTLY
// Source: /Users/dewanshshukla/Desktop/zapigo/zapigowebclient/src/components/AddGuestManuallyModal.tsx
// Last synced: 2026-03-17T11:17:26.977Z
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
 * isEventLoading?: boolean;
 * // Callback replacing createGuestMutation.mutate()
 * onCreateGuest?: (...args: any[]) => void;
 * // Pending state replacing createGuestMutation.isPending
 * isCreateGuestPending?: boolean;
 * // User data from auth — pass as prop
 * userData?: { id: string; name: string; email: string; phone?: string } | null;
 * ============================================================
 */


import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { XClose, Plus, Minus } from '@untitledui/icons';
import { Button } from '@/components/base/buttons/button';
// [STRIPPED] import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
// [STRIPPED] import { toast } from 'sonner';
import { Toaster } from '@/components/application/notifications/toaster';
// [STRIPPED] import api from '@/lib/axios';
// [STRIPPED] import { AxiosError } from 'axios';
// [STRIPPED] import { universalApi } from '@/lib/universal';
// [STRIPPED] import { useAuthStore } from '@/store/useAuthStore';
// [STRIPPED] 
interface AddGuestManuallyModalProps {
  open: boolean;
  onClose: () => void;
  eventId: string;
}

interface ApiErrorResponse {
  message?: string;
  error?: string;
}

interface EventResponse {
  status: string;
  message: string;
  event: {
    event_id: string;
    event_type_id?: string;
    food_preference?: boolean;
    food_allergies?: boolean;
    meta_data?: {
      event_type_id?: string;
      cutoff_age?: number;
      cutoff_age_2?: number;
      can_have_below_cutoff?: boolean;
      can_have_below_cutoff_2?: boolean;
    };
    cutoff_age?: number;
    cutoff_age_2?: number;
  };
}

interface NumberPickerProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

const NumberPicker: React.FC<NumberPickerProps> = ({ label, value, onChange, min = 0, max = 99 }) => {
  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  return (
    <div className="flex w-full items-center gap-4">
      <div className="flex grow basis-0 items-start gap-2">
        <div className="flex shrink-0 flex-col items-start">
          <p className="font-lexend w-full text-md font-normal leading-5 text-gray-600">
            {label}
          </p>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          onClick={handleDecrement}
          disabled={value <= min}
          className="flex size-10 shrink-0 items-center justify-center gap-2.5 rounded-lg border border-gray-100 p-2.5 disabled:opacity-50"
        >
          <Minus className="size-6 shrink-0" />
        </button>
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg p-2">
          <p className="font-lexend shrink-0 text-center text-xl font-normal leading-[30px] text-gray-700">
            {value}
          </p>
        </div>
        <button
          type="button"
          onClick={handleIncrement}
          disabled={value >= max}
          className="flex size-10 shrink-0 items-center justify-center gap-2.5 rounded-lg border border-gray-100 p-2.5 disabled:opacity-50"
        >
          <Plus className="size-6 shrink-0" />
        </button>
      </div>
    </div>
  );
};

interface CreateUserWithRsvpPayload {
  added_by_host_id: string;
  adult_count: number;
  children_count: number;
  email: string;
  event_id: string;
  firstName: string;
  food_allergies?: string;
  lastName: string;
  phone_number?: string;
  rsvp_notes: string;
  rsvp_response: 'YES' | 'NO' | 'MAYBE';
  non_veg_count: number;
  veg_count: number;
  veg_egg?: number;
  infant_count?: number; // adding it anyway in case backend supports it
}

export const AddGuestManuallyModal: React.FC<AddGuestManuallyModalProps> = ({
  open,
  onClose,
  eventId,
}) => {
  // [STRIPPED] useQueryClient removed — no cache invalidation in mockup
  // [STRIPPED] useAuth/useAuthStore — stubbed for screen-builder
  const isAuthenticated = false;
  const userData: { display_name?: string } | null = null;
  const logout = () => {};

  // Form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [adultCount, setAdultCount] = useState(1);
  const [childrenCount, setChildrenCount] = useState(0);
  const [infantCount, setInfantCount] = useState(0);
  const [rsvpResponse, setRsvpResponse] = useState<'YES' | 'NO' | 'MAYBE'>('YES');
  const [vegCount, setVegCount] = useState(0);
  const [vegAndEggCount, setVegAndEggCount] = useState(0);
  const [nonVegCount, setNonVegCount] = useState(0);
  const [foodAllergies, setFoodAllergies] = useState('');
  const [rsvpNotes, setRsvpNotes] = useState('');
  const [cutoffAge, setCutoffAge] = useState(13);
  const [cutoffAge2, setCutoffAge2] = useState(2);
  const [canHaveBelowCutoff, setCanHaveBelowCutoff] = useState(true);
  const [canHaveBelowCutoff2, setCanHaveBelowCutoff2] = useState(true);

  // Fetch event details to check food preferences flags
  // [STRIPPED] useQuery — data now comes from props

  // Reset form when modal opens/closes
  useEffect(() => {
    if (open) {
      setFirstName('');
      setLastName('');
      setEmail('');
      setPhoneNumber('');
      setAdultCount(1);
      setChildrenCount(0);
      setInfantCount(0);
      setRsvpResponse('YES');
      setVegCount(0);
      setVegAndEggCount(0);
      setNonVegCount(0);
      setFoodAllergies('');
      setRsvpNotes('');
    }
  }, [open]);

  // Update cutoff ages from event data
  useEffect(() => {
    if (eventData?.event) {
      const { cutoff_age, cutoff_age_2, meta_data } = eventData.event;
      const finalCutoff = cutoff_age ?? meta_data?.cutoff_age ?? 13;
      const finalCutoff2 = cutoff_age_2 ?? meta_data?.cutoff_age_2 ?? 2;
      setCutoffAge(finalCutoff);
      setCutoffAge2(finalCutoff2);

      const canBelow = eventData.event.meta_data?.can_have_below_cutoff ?? true;
      const canBelow2 = eventData.event.meta_data?.can_have_below_cutoff_2 ?? (finalCutoff2 > 0);
      setCanHaveBelowCutoff(canBelow);
      setCanHaveBelowCutoff2(canBelow2);
    }
  }, [eventData]);

  // Check if event type is kids birthday (check both top-level and meta_data)
  const isKidsBirthday =
    eventData?.event?.event_type_id === 'kids-birthday' ||
    eventData?.event?.meta_data?.event_type_id === 'kids-birthday';

  // Calculate total guests
  const totalGuests = adultCount + childrenCount + infantCount;

  // Reset counts when RSVP response changes to NO or MAYBE
  useEffect(() => {
    if (rsvpResponse === 'NO') {
      setAdultCount(0);
      setChildrenCount(0);
      setInfantCount(0);
      setVegCount(0);
      setVegAndEggCount(0);
      setNonVegCount(0);
      setFoodAllergies('');
    } else if (rsvpResponse === 'MAYBE') {
      // For MAYBE, reset guest count and food-related fields
      setAdultCount(0);
      setChildrenCount(0);
      setInfantCount(0);
      setVegCount(0);
      setVegAndEggCount(0);
      setNonVegCount(0);
      setFoodAllergies('');
    }
  }, [rsvpResponse]);

  // Adjust food preferences when guest count decreases below current food preferences
  useEffect(() => {
    if (rsvpResponse === 'YES' && eventData?.event?.food_preference && totalGuests > 0) {
      const totalFoodPreferences = vegCount + vegAndEggCount + nonVegCount;
      if (totalFoodPreferences > totalGuests) {
        // Reduce food preferences proportionally to fit within total guests
        const hasMultipleTypes = [vegCount, vegAndEggCount, nonVegCount].filter(c => c > 0).length > 1;

        if (hasMultipleTypes) {
          // Scale down proportionally to fit totalGuests
          const scale = totalGuests / totalFoodPreferences;
          const newVegCount = Math.floor(vegCount * scale);
          const newVegAndEggCount = Math.floor(vegAndEggCount * scale);
          // Ensure remainder goes to non-veg to maintain exact total
          const newNonVegCount = Math.max(0, totalGuests - newVegCount - newVegAndEggCount);
          // Only update if values actually changed to avoid infinite loops
          if (newVegCount !== vegCount || newVegAndEggCount !== vegAndEggCount || newNonVegCount !== nonVegCount) {
            setVegCount(newVegCount);
            setVegAndEggCount(newVegAndEggCount);
            setNonVegCount(newNonVegCount);
          }
        } else if (vegCount > 0 && vegCount > totalGuests) {
          setVegCount(totalGuests);
        } else if (vegAndEggCount > 0 && vegAndEggCount > totalGuests) {
          setVegAndEggCount(totalGuests);
        } else if (nonVegCount > 0 && nonVegCount > totalGuests) {
          setNonVegCount(totalGuests);
        }
      }
    } else if (rsvpResponse === 'YES' && eventData?.event?.food_preference && totalGuests === 0) {
      // Reset food preferences if guest count becomes 0
      if (vegCount > 0 || vegAndEggCount > 0 || nonVegCount > 0) {
        setVegCount(0);
        setVegAndEggCount(0);
        setNonVegCount(0);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalGuests, rsvpResponse, eventData?.event?.food_preference]);

  // Handler for veg count change with validation
  const handleVegCountChange = (value: number) => {
    const maxVeg = totalGuests - vegAndEggCount - nonVegCount;
    setVegCount(Math.min(value, maxVeg));
  };

  // Handler for veg and egg count change with validation
  const handleVegAndEggCountChange = (value: number) => {
    const maxVegAndEgg = totalGuests - vegCount - nonVegCount;
    setVegAndEggCount(Math.min(value, maxVegAndEgg));
  };

  // Handler for non-veg count change with validation
  const handleNonVegCountChange = (value: number) => {
    const maxNonVeg = totalGuests - vegCount - vegAndEggCount;
    setNonVegCount(Math.min(value, maxNonVeg));
  };

  // Create guest mutation
  // [STRIPPED] createGuestMutation — use onCreateGuest prop instead

// Toast shim (original was from sonner)
const toast = Object.assign(
  (...args: any[]) => console.log('[Toast]', ...args),
  {
    success: (...args: any[]) => console.log('[Toast:success]', ...args),
    error: (...args: any[]) => console.log('[Toast:error]', ...args),
    info: (...args: any[]) => console.log('[Toast:info]', ...args),
    warning: (...args: any[]) => console.log('[Toast:warning]', ...args),
    loading: (...args: any[]) => console.log('[Toast:loading]', ...args),
    dismiss: () => {},
  }
);

  // Handle save
  const handleSave = () => {
    const addedByHostId = userData?.uid;
    if (!addedByHostId) {
      toast.error('Session expired', {
        description: 'Please sign in again to add guests.',
        duration: 3000,
      });
      return;
    }

    // Validation - First Name
    if (!firstName.trim()) {
      toast.error('Required Field Missing', {
        description: 'Please enter the guest\'s first name',
        duration: 3000,
      });
      return;
    }

    // Validation - Email (only if provided)
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Invalid Email', {
        description: 'Please enter a valid email address (e.g., john@example.com)',
        duration: 3000,
      });
      return;
    }

    // Validation - Phone Number (only validate format if provided)
    const cleanedPhone = phoneNumber.replace(/\D/g, '');
    let phoneWithCountryCode: string | undefined;

    if (cleanedPhone.length > 0) {
      if (cleanedPhone.length !== 10) {
        toast.error('Invalid Phone Number', {
          description: 'Phone number must be exactly 10 digits',
          duration: 3000,
        });
        return;
      }
      // Prepend "91" to the phone number for API
      phoneWithCountryCode = '91' + cleanedPhone;
    }

    // Validation - Food preferences should not exceed total guests
    if (rsvpResponse === 'YES' && eventData?.event?.food_preference) {
      const totalFoodPreferences = vegCount + vegAndEggCount + nonVegCount;
      const totalGuestsCount = adultCount + childrenCount + infantCount;
      if (totalFoodPreferences > totalGuestsCount) {
        toast.error('Invalid Food Preferences', {
          description: `Total food preferences (${totalFoodPreferences}) cannot exceed total guests (${totalGuestsCount})`,
          duration: 3000,
        });
        return;
      }
    }

    // If response is NO or MAYBE, set all counts to 0
    const isNoOrMaybeResponse = rsvpResponse === 'NO' || rsvpResponse === 'MAYBE';
    const finalAdultCount = isNoOrMaybeResponse ? 0 : adultCount;
    const finalChildrenCount = isNoOrMaybeResponse ? 0 : childrenCount;
    const finalInfantCount = isNoOrMaybeResponse ? 0 : infantCount;
    const finalVegCount = isNoOrMaybeResponse ? 0 : vegCount;
    const finalVegAndEggCount = isNoOrMaybeResponse ? 0 : vegAndEggCount;
    const finalNonVegCount = isNoOrMaybeResponse ? 0 : nonVegCount;

    const payload: CreateUserWithRsvpPayload = {
      added_by_host_id: addedByHostId,
      adult_count: finalAdultCount,
      children_count: finalChildrenCount + finalInfantCount, // Merge for now
      infant_count: finalInfantCount,
      email: email.trim() || '',
      event_id: eventId,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      rsvp_notes: rsvpNotes.trim(),
      rsvp_response: rsvpResponse,
      non_veg_count: finalNonVegCount,
      veg_count: finalVegCount,
      veg_egg: finalVegAndEggCount,
    };

    // Add phone_number only if provided
    if (phoneWithCountryCode) {
      payload.phone_number = phoneWithCountryCode;
    }

    // Add food_allergies only if provided
    if (foodAllergies.trim()) {
      payload.food_allergies = foodAllergies.trim();
    }

    onCreateGuest?.(payload);
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
    <>
      {/* Mount toast notifications locally for this modal */}
      <Toaster />
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
        <div className="relative z-10 w-full max-w-[393px] max-h-[85vh] flex flex-col rounded-tl-2xl rounded-tr-2xl bg-white shadow-[0px_20px_24px_-4px_rgba(10,13,18,0.08),0px_8px_8px_-4px_rgba(10,13,18,0.03),0px_3px_3px_-1.5px_rgba(10,13,18,0.04)]">
          {/* Header */}
          <div className="relative flex w-full flex-col items-center flex-shrink-0">
            <div className="flex w-full flex-col items-start gap-4 px-4 pb-0 pt-5">
              <div className="flex w-full flex-col items-start gap-0.5">
                <p className="font-lexend w-full text-base font-semibold leading-6 text-[#181d27]">
                  Add Guest Manually
                </p>
                <p className="font-lexend text-sm font-normal leading-5 text-[#717680]">
                  Add guest details and their RSVP response
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

          {/* Scrollable Content */}
          <div className="flex w-full flex-col px-4 pb-4 gap-4 overflow-y-auto flex-1">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="font-lexend text-sm font-medium leading-5 text-[#414651]">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="John"
                  className="font-lexend w-full rounded-lg border border-solid border-[#d5d7da] bg-white px-3.5 py-2.5 text-base font-normal leading-6 text-[#181d27] placeholder:text-[#717680] focus:outline-none focus:border-brand-600"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-lexend text-sm font-medium leading-5 text-[#414651]">
                  Last Name
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Doe"
                  className="font-lexend w-full rounded-lg border border-solid border-[#d5d7da] bg-white px-3.5 py-2.5 text-base font-normal leading-6 text-[#181d27] placeholder:text-[#717680] focus:outline-none focus:border-brand-600"
                />
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="font-lexend text-sm font-medium leading-5 text-[#414651]">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john.doe@example.com"
                className="font-lexend w-full rounded-lg border border-solid border-[#d5d7da] bg-white px-3.5 py-2.5 text-base font-normal leading-6 text-[#181d27] placeholder:text-[#717680] focus:outline-none focus:border-brand-600"
              />
            </div>

            {/* Phone Number */}
            <div className="flex flex-col gap-1.5">
              <label className="font-lexend text-sm font-medium leading-5 text-[#414651]">
                Phone Number
              </label>
              <div className="flex gap-2">
                <div className="flex items-center justify-center rounded-lg border border-solid border-[#d5d7da] bg-gray-50 px-3.5 py-2.5">
                  <p className="font-lexend text-base font-normal leading-6 text-gray-600">
                    +91
                  </p>
                </div>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => {
                    // Only allow digits and limit to 10
                    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                    setPhoneNumber(value);
                  }}
                  placeholder="9876543210"
                  maxLength={10}
                  className="font-lexend flex-1 rounded-lg border border-solid border-[#d5d7da] bg-white px-3.5 py-2.5 text-base font-normal leading-6 text-[#181d27] placeholder:text-[#717680] focus:outline-none focus:border-brand-600"
                />
              </div>
              <p className="font-lexend text-xs font-normal leading-[18px] text-[#717680]">
                Enter 10 digit mobile number without country code
              </p>
            </div>

            {/* RSVP Response */}
            <div className="flex flex-col gap-1.5">
              <label className="font-lexend text-sm font-medium leading-5 text-[#414651]">
                RSVP Response
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setRsvpResponse('YES')}
                  className={`flex-1 rounded-lg border-2 px-4 py-2.5 font-lexend text-sm font-semibold transition-colors ${rsvpResponse === 'YES'
                      ? 'border-brand-600 bg-brand-600 text-white'
                      : 'border-[#d5d7da] bg-white text-[#414651]'
                    }`}
                >
                  Yes
                </button>
                <button
                  onClick={() => setRsvpResponse('NO')}
                  className={`flex-1 rounded-lg border-2 px-4 py-2.5 font-lexend text-sm font-semibold transition-colors ${rsvpResponse === 'NO'
                      ? 'border-brand-600 bg-brand-600 text-white'
                      : 'border-[#d5d7da] bg-white text-[#414651]'
                    }`}
                >
                  No
                </button>
                <button
                  onClick={() => setRsvpResponse('MAYBE')}
                  className={`flex-1 rounded-lg border-2 px-4 py-2.5 font-lexend text-sm font-semibold transition-colors ${rsvpResponse === 'MAYBE'
                      ? 'border-brand-600 bg-brand-600 text-white'
                      : 'border-[#d5d7da] bg-white text-[#414651]'
                    }`}
                >
                  Maybe
                </button>
              </div>
            </div>

            {/* Guest Count - Only show for YES response */}
            {rsvpResponse === 'YES' && (
              <div className="flex flex-col gap-4">
                <label className="font-lexend text-sm font-medium leading-5 text-[#414651]">
                  Guest Count
                </label>
                <NumberPicker
                  label={`Adults (${cutoffAge}+)`}
                  value={adultCount}
                  onChange={setAdultCount}
                  min={1}
                />
                {/* Only show children for kids birthday events OR if config allows */}
                {(isKidsBirthday || canHaveBelowCutoff) && (
                  <NumberPicker
                    label={`Children (${cutoffAge2}-${cutoffAge})`}
                    value={childrenCount}
                    onChange={setChildrenCount}
                    min={0}
                  />
                )}
                {canHaveBelowCutoff2 && (
                  <NumberPicker
                    label={`Infants (Below ${cutoffAge2})`}
                    value={infantCount}
                    onChange={setInfantCount}
                    min={0}
                  />
                )}
              </div>
            )}

            {/* Food Count - Only show if food_preference flag is true AND RSVP is YES */}
            {rsvpResponse === 'YES' && eventData?.event?.food_preference && (
              <div className="flex flex-col gap-4">
                <label className="font-lexend text-sm font-medium leading-5 text-[#414651]">
                  Food Preference Count
                </label>
                {totalGuests === 0 && (
                  <p className="font-lexend text-xs font-normal leading-[18px] text-red-500">
                    Please add at least one guest before setting food preferences
                  </p>
                )}
                <NumberPicker
                  label="Only Veg"
                  value={vegCount}
                  onChange={handleVegCountChange}
                  min={0}
                  max={Math.max(0, totalGuests - vegAndEggCount - nonVegCount)}
                />
                <NumberPicker
                  label="Veg & Egg"
                  value={vegAndEggCount}
                  onChange={handleVegAndEggCountChange}
                  min={0}
                  max={Math.max(0, totalGuests - vegCount - nonVegCount)}
                />
                <NumberPicker
                  label="Non - Vegetarian"
                  value={nonVegCount}
                  onChange={handleNonVegCountChange}
                  min={0}
                  max={Math.max(0, totalGuests - vegCount - vegAndEggCount)}
                />
              </div>
            )}

            {/* Food Allergies - Only show if food_allergies flag is true AND RSVP is YES */}
            {rsvpResponse === 'YES' && eventData?.event?.food_allergies && (
              <div className="flex flex-col gap-1.5">
                <label className="font-lexend text-sm font-medium leading-5 text-[#414651]">
                  Food Allergies
                </label>
                <textarea
                  value={foodAllergies}
                  onChange={(e) => setFoodAllergies(e.target.value)}
                  placeholder="Enter any food allergies (e.g., Nuts, Shellfish)"
                  className="font-lexend min-h-[80px] w-full resize-y rounded-lg border border-solid border-[#d5d7da] bg-white px-3.5 py-3 text-base font-normal leading-6 text-[#181d27] placeholder:text-[#717680] focus:outline-none focus:border-brand-600"
                />
              </div>
            )}

            {/* RSVP Notes */}
            <div className="flex flex-col gap-1.5">
              <label className="font-lexend text-sm font-medium leading-5 text-[#414651]">
                RSVP Notes
              </label>
              <textarea
                value={rsvpNotes}
                onChange={(e) => setRsvpNotes(e.target.value)}
                placeholder="Any additional notes..."
                className="font-lexend min-h-[80px] w-full resize-y rounded-lg border border-solid border-[#d5d7da] bg-white px-3.5 py-3 text-base font-normal leading-6 text-[#181d27] placeholder:text-[#717680] focus:outline-none focus:border-brand-600"
              />
            </div>
          </div>

          {/* Fixed Footer with Save Button */}
          <div className="flex w-full flex-col items-start gap-3 px-4 py-4 border-t border-gray-200 bg-white flex-shrink-0">
            <Button
              onClick={handleSave}
              disabled={isCreateGuestPending || isEventLoading}
              color="primary"
              size="md"
              className="w-full"
            >
              {isEventLoading ? 'Loading...' : isCreateGuestPending ? 'Adding Guest...' : 'Add Guest'}
            </Button>
          </div>
        </div>
      </div>
    </>,
    document.body,
  );
};

export default AddGuestManuallyModal;

