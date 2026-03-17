// AUTO-SYNCED from zapigowebclient — DO NOT EDIT DIRECTLY
// Source: /Users/dewanshshukla/Desktop/zapigo/zapigowebclient/src/components/EditEventModal.tsx
// Last synced: 2026-03-17T11:05:34.404Z
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
import { XClose, Calendar as CalendarIcon } from '@untitledui/icons';
import { Button } from '@/components/base/buttons/button';
// [STRIPPED] import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// [STRIPPED] import { universalApi } from '@/lib/universal';
// [STRIPPED] import { updateEvent, UpdateEventPayload } from '@/app/(events-and-wedding)/(events)/services/eventApi';
// [STRIPPED] import { useToast } from '@/hooks/use-toast';
// [STRIPPED] import { useAuth } from '@/hooks/useAuth';
import { DatePicker } from '@/components/application/date-picker/date-picker';
import { parseDate } from '@internationalized/date';
import { TimePicker, TimeValue } from '@/components/application/time-picker/time-picker';

interface EditEventModalProps {
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
    event_date?: string;
    start_timestamp?: string;
    end_timestamp?: string;
    meta_data?: {
      event_type_id?: string;
      child_name?: string;
      birthday_year?: string;
      gender?: string;
      occasion_title?: string;
      host_names?: string;
    };
    content_block?: {
      child_name?: string;
      birthday_year?: string;
      gender?: string;
    };
  };
}

const EVENT_TYPE_LABELS: { [key: string]: string } = {
  'kids-birthday': "Kid's Birthday",
  'party': 'Party',
  'cultural-gatherings': 'Cultural Gathering',
};

export const EditEventModal: React.FC<EditEventModalProps> = ({
  open,
  onClose,
  eventId,
}) => {
  // [STRIPPED] useToast — replaced with console.log
const toast = (...args: any[]) => console.log('[Toast]', ...args);
  // [STRIPPED] useQueryClient removed — no cache invalidation in mockup
  // [STRIPPED] useAuth/useAuthStore — values now come from props

  // Local state for form values
  const [eventType, setEventType] = useState('');
  const [childName, setChildName] = useState('');
  const [age, setAge] = useState('');
  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  const [occasionTitle, setOccasionTitle] = useState('');
  const [occasionTitleError, setOccasionTitleError] = useState('');
  const [hostNames, setHostNames] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [startTimeValue, setStartTimeValue] = useState<TimeValue[]>([]);
  const [endTimeValue, setEndTimeValue] = useState<TimeValue[]>([]);
  const [headerText, setHeaderText] = useState('');
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');

  // Helper to parse timestamp to TimeValue
  const parseTimeToTimeValue = (timestamp: string | null | undefined): TimeValue | null => {
    if (!timestamp) return null;
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) return null;
      let hours = date.getUTCHours() + 5;
      let minutes = date.getUTCMinutes() + 30;
      if (minutes >= 60) {
        hours += 1;
        minutes -= 60;
      }
      hours = hours % 24;
      const period: 'AM' | 'PM' = hours >= 12 ? 'PM' : 'AM';
      let hours12 = hours % 12;
      hours12 = hours12 === 0 ? 12 : hours12;
      return {
        hour: String(hours12).padStart(2, '0'),
        minute: String(minutes).padStart(2, '0'),
        period,
      };
    } catch {
      return null;
    }
  };

  // Add hours to a TimeValue
  const addHoursToTime = (time: TimeValue, hoursToAdd: number): TimeValue => {
    let hour = parseInt(time.hour, 10);
    if (time.period === 'PM' && hour < 12) hour += 12;
    if (time.period === 'AM' && hour === 12) hour = 0;
    const minute = parseInt(time.minute, 10);
    const totalMinutes = (hour * 60 + minute) + (hoursToAdd * 60);
    const minutesInDay = totalMinutes % (24 * 60);
    const hour24 = Math.floor(minutesInDay / 60);
    const min = minutesInDay % 60;
    let hour12: number;
    let period: 'AM' | 'PM';
    if (hour24 === 0) {
      hour12 = 12;
      period = 'AM';
    } else if (hour24 < 12) {
      hour12 = hour24;
      period = 'AM';
    } else if (hour24 === 12) {
      hour12 = 12;
      period = 'PM';
    } else {
      hour12 = hour24 - 12;
      period = 'PM';
    }
    return {
      hour: hour12.toString().padStart(2, '0'),
      minute: min.toString().padStart(2, '0'),
      period: period,
    };
  };

  // Fetch event details
  // [STRIPPED] useQuery — data now comes from props

  // Initialize form values when data is loaded
  useEffect(() => {
    if (eventData?.event && open) {
      const event = eventData.event;

      // Set event type from meta_data
      setEventType(event.meta_data?.event_type_id || '');

      // Pre-populate date
      if (event.event_date) {
        const eventDate = new Date(event.event_date);
        setSelectedDate(eventDate);
      } else {
        setSelectedDate(undefined);
      }

      // Pre-populate start time
      if (event.start_timestamp) {
        const parsed = parseTimeToTimeValue(event.start_timestamp);
        setStartTimeValue(parsed ? [parsed] : []);
      } else {
        setStartTimeValue([{ hour: '09', minute: '00', period: 'AM' }]);
      }

      // Pre-populate end time
      if (event.end_timestamp) {
        const parsed = parseTimeToTimeValue(event.end_timestamp);
        setEndTimeValue(parsed ? [parsed] : []);
      } else {
        setEndTimeValue([{ hour: '06', minute: '00', period: 'PM' }]);
      }

      // Pre-populate kids birthday fields from meta_data or content_block
      if (event.meta_data?.event_type_id === 'kids-birthday') {
        const metaData = event.meta_data;
        const contentBlock = event.content_block;

        // Child name
        if (metaData?.child_name) {
          setChildName(metaData.child_name);
        } else if (contentBlock?.child_name) {
          setChildName(contentBlock.child_name);
        } else {
          setChildName('');
        }

        // Birthday year
        if (metaData?.birthday_year) {
          setAge(metaData.birthday_year);
        } else if (contentBlock?.birthday_year) {
          setAge(contentBlock.birthday_year);
        } else {
          setAge('');
        }

        // Gender
        if (metaData?.gender) {
          setSelectedGender(metaData.gender);
        } else if (contentBlock?.gender) {
          setSelectedGender(contentBlock.gender);
        } else {
          setSelectedGender(null);
        }
      } else {
        // Reset kids birthday fields for non-kids-birthday events
        setChildName('');
        setAge('');
        setSelectedGender(null);
      }

      // Pre-populate occasion title for non-kids-birthday events
      if (event.title) {
        setOccasionTitle(event.title);
      } else if (event.meta_data?.occasion_title) {
        setOccasionTitle(event.meta_data.occasion_title);
      } else {
        setOccasionTitle('');
      }

      // Pre-populate host names (for all event types) — always show a value: from event or current user
      if (event.meta_data?.host_names?.trim()) {
        setHostNames(event.meta_data.host_names.trim());
      } else if (userData?.display_name) {
        setHostNames(userData.display_name);
      } else {
        setHostNames('');
      }

      // Pre-populate text fields from content_block
      const contentBlock = event.content_block as { header_text?: string; subtitle?: string } | null;
      if (contentBlock?.header_text) {
        setHeaderText(contentBlock.header_text);
      } else {
        setHeaderText('');
      }

      if (event.title) {
        setTitle(event.title);
      } else {
        setTitle('');
      }

      if (contentBlock?.subtitle) {
        setSubtitle(contentBlock.subtitle);
      } else {
        setSubtitle('');
      }
    }
  }, [eventData, open, userData?.display_name]);

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

    // Validation for kids birthday
    if (eventType === 'kids-birthday' && !childName.trim()) {
      toast({
        title: 'Missing Information',
        description: "Please enter the child's name to continue.",
        variant: 'destructive',
        duration: 3000,
        className: 'z-50 bg-amber-500 text-white',
      });
      return;
    }

    if (eventType === 'kids-birthday' && !age.trim()) {
      toast({
        title: 'Missing Information',
        description: 'Please enter which birthday this is to continue.',
        variant: 'destructive',
        duration: 3000,
        className: 'z-50 bg-amber-500 text-white',
      });
      return;
    }

    // Validation for party and cultural-gatherings - occasion title is mandatory
    if ((eventType === 'party' || eventType === 'cultural-gatherings') && !occasionTitle.trim()) {
      setOccasionTitleError('Occasion title is required');
      toast({
        title: 'Missing Information',
        description: 'Please enter the occasion title to continue.',
        variant: 'destructive',
        duration: 3000,
        className: 'z-50 bg-amber-500 text-white',
      });
      return;
    } else {
      setOccasionTitleError('');
    }

    // Prepare update payload - use unknown type to allow meta_data fields
    const payload: UpdateEventPayload & {
      child_name?: string;
      birthday_year?: string;
      gender?: string;
      occasion_title?: string;
      host_names?: string;
    } = {
      created_by: userData.uid,
    } as UpdateEventPayload & {
      child_name?: string;
      birthday_year?: string;
      gender?: string;
      occasion_title?: string;
      host_names?: string;
    };

    // Add kids birthday specific fields
    if (eventType === 'kids-birthday') {
      payload.child_name = childName;
      payload.birthday_year = age;
      if (selectedGender) {
        payload.gender = selectedGender;
      }
    } else {
      // Add occasion title for non-kids-birthday events
      // For party and cultural-gatherings, it's mandatory (already validated above)
      // Always send it for party and cultural-gatherings to ensure it updates
      if (eventType === 'party' || eventType === 'cultural-gatherings') {
        payload.occasion_title = occasionTitle.trim();
        payload.title = occasionTitle.trim(); // Also update the main title
      } else if (occasionTitle.trim()) {
        payload.occasion_title = occasionTitle.trim();
        payload.title = occasionTitle.trim(); // Also update the main title
      }
    }

    // Add host names (for all event types)
    if (hostNames.trim()) {
      payload.host_names = hostNames.trim();
    }

    // Add date and time if provided (use local date to avoid UTC shift)
    if (selectedDate) {
      payload.event_date = formatLocalYMD(selectedDate);
      payload.start_timestamp = convertTimeToISO(selectedDate, startTimeValue[0] || null);
      payload.end_timestamp = convertTimeToISO(selectedDate, endTimeValue[0] || null);
    }

    // Add text fields (header_text, title, subtitle)
    if (title.trim() && !payload.title) {
      payload.title = title.trim();
    }

    if (headerText.trim()) {
      payload.header_text = headerText.trim();
    }

    if (subtitle.trim()) {
      payload.subtitle = subtitle.trim();
    }

    // Also add to content_block for compatibility, preserving existing fields
    const existingContentBlock = eventData?.event?.content_block as Record<string, unknown> | null | undefined;
    payload.content_block = {
      ...(existingContentBlock || {}),
      header_text: headerText.trim() || undefined,
      subtitle: subtitle.trim() || undefined,
    };

    onUpdateEvent?.(payload as UpdateEventPayload);
  };

  // Convert time to ISO format without timezone conversion
  const convertTimeToISO = (date: Date | undefined, time: TimeValue | null): string | undefined => {
    if (!date || !time) return undefined;

    let hours = parseInt(time.hour);
    if (time.period === 'PM' && hours !== 12) {
      hours += 12;
    } else if (time.period === 'AM' && hours === 12) {
      hours = 0;
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hoursStr = String(hours).padStart(2, '0');
    const minutesStr = String(parseInt(time.minute)).padStart(2, '0');

    return `${year}-${month}-${day}T${hoursStr}:${minutesStr}:00`;
  };

  const formatLocalYMD = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Format time for display
  const formatTimeDisplay = (time: TimeValue | null) => {
    if (!time) return 'Select time';
    const hours = parseInt(time.hour);
    return `${hours}:${time.minute} ${time.period}`;
  };

  // Format date for display
  const formatDateDisplay = (date: Date | undefined) => {
    if (!date) return 'Select date';
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
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

  const isKidsBirthday = eventType === 'kids-birthday';
  const eventTypeLabel = EVENT_TYPE_LABELS[eventType] || 'Event';

  return ReactDOM.createPortal(
    <>
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
        <div className="relative z-10 w-full max-w-[393px] max-h-[90vh] overflow-y-auto rounded-tl-2xl rounded-tr-2xl bg-white shadow-[0px_20px_24px_-4px_rgba(10,13,18,0.08),0px_8px_8px_-4px_rgba(10,13,18,0.03),0px_3px_3px_-1.5px_rgba(10,13,18,0.04)]">
          {/* Header */}
          <div className="sticky top-0 z-10 bg-white flex w-full flex-col items-center">
            <div className="flex w-full flex-col items-start gap-4 px-4 pb-0 pt-5">
              <div className="flex w-full flex-col items-start gap-0.5">
                <p className="font-lexend w-full text-base font-semibold leading-6 text-[#181d27]">
                  {eventTypeLabel}
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
              {/* Kids Birthday Specific Fields */}
              {isKidsBirthday && (
                <>
                  {/* Child's Name Input */}
                  <div className="flex w-full flex-col items-start gap-1.5">
                    <div className="font-lexend flex items-start gap-0.5 whitespace-pre text-sm font-medium leading-5">
                      <p className="text-[#414651]">Child&apos;s Name</p>
                      <p className="text-brand-600">*</p>
                    </div>
                    <div className="flex w-full items-center gap-2 rounded-lg border border-solid border-[#d5d7da] bg-white px-3 py-2">
                      <input
                        type="text"
                        value={childName}
                        onChange={(e) => setChildName(e.target.value)}
                        placeholder="Enter child's name"
                        className="font-lexend min-w-0 grow basis-0 overflow-hidden text-ellipsis whitespace-nowrap text-sm font-normal leading-5 text-[#717680] placeholder:text-[#717680] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Host Names Input - For kids birthday, shown after child name */}
                  <div className="flex w-full flex-col items-start gap-1.5">
                    <div className="font-lexend flex items-start gap-0.5 whitespace-pre text-sm font-medium leading-5">
                      <p className="text-[#414651]">Host Name(s)</p>
                    </div>
                    <p className="font-lexend text-xs leading-4 text-[#717680] -mt-0.5">
                      Who is hosting this event?
                    </p>
                    <div className="flex w-full items-center gap-2 rounded-lg border border-solid border-[#d5d7da] bg-white px-3 py-2">
                      <input
                        type="text"
                        value={hostNames}
                        onChange={(e) => setHostNames(e.target.value)}
                        placeholder="Enter host name(s)"
                        className="font-lexend min-w-0 grow basis-0 text-sm font-normal leading-5 text-[#181d27] placeholder:text-[#717680] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Which Birthday Input */}
                  <div className="flex w-full flex-col items-start gap-1.5">
                    <div className="font-lexend flex items-start gap-0.5 whitespace-pre text-sm font-medium leading-5">
                      <p className="text-[#414651]">Which Birthday?</p>
                      <p className="text-brand-600">*</p>
                    </div>
                    <div className="flex w-full items-center gap-2 rounded-lg border border-solid border-[#d5d7da] bg-white px-3 py-2">
                      <input
                        type="number"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        placeholder="e.g., 1st 5th, 10th"
                        className="font-lexend min-w-0 grow basis-0 overflow-hidden text-ellipsis whitespace-nowrap text-sm font-normal leading-5 text-[#717680] placeholder:text-[#717680] focus:outline-none"
                        min="1"
                        max="100"
                      />
                    </div>
                  </div>

                  {/* Gender Section */}
                  <div className="flex w-full flex-col items-start gap-1.5">
                    <p className="font-lexend text-sm font-medium leading-5 text-[#414651]">
                      Gender (optional)
                    </p>

                    {/* Gender Tabs */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setSelectedGender("male")}
                        className={`font-lexend flex h-9 items-center justify-center px-3 py-2 text-sm font-semibold leading-5 transition-all ${selectedGender === "male"
                          ? "rounded-[6px] bg-brand-50 text-brand-600"
                          : "rounded-lg border border-[#d5d7da] bg-white text-[#414651]"
                          }`}
                      >
                        Male
                      </button>
                      <button
                        onClick={() => setSelectedGender("female")}
                        className={`font-lexend flex h-9 items-center justify-center px-3 py-2 text-sm font-semibold leading-5 transition-all ${selectedGender === "female"
                          ? "rounded-[6px] bg-brand-50 text-brand-600"
                          : "rounded-lg border border-[#d5d7da] bg-white text-[#414651]"
                          }`}
                      >
                        Female
                      </button>
                      <button
                        onClick={() => setSelectedGender("both")}
                        className={`font-lexend flex h-9 items-center justify-center px-3 py-2 text-sm font-semibold leading-5 transition-all ${selectedGender === "both"
                          ? "rounded-[6px] bg-brand-50 text-brand-600"
                          : "rounded-lg border border-[#d5d7da] bg-white text-[#414651]"
                          }`}
                      >
                        Both
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* Non-Kids Birthday Fields */}
              {!isKidsBirthday && (
                <>
                  {/* Occasion Title Input */}
                  <div className="flex w-full flex-col items-start gap-1.5">
                    <div className="font-lexend flex items-start gap-0.5 whitespace-pre text-sm font-medium leading-5">
                      <p className="text-[#414651]">Occasion Title</p>
                      {(eventType === 'party' || eventType === 'cultural-gatherings') && (
                        <p className="text-brand-600">*</p>
                      )}
                    </div>
                    <p className="font-lexend text-xs leading-4 text-[#717680] -mt-0.5">
                      E.g., &quot;Housewarming Party&quot;, &quot;Anniversary Celebration&quot;, &quot;New Year&apos;s Eve Bash&quot;
                    </p>
                    <div className={`flex w-full items-center gap-2 rounded-lg border border-solid bg-white px-3 py-2 ${occasionTitleError ? 'border-red-500' : 'border-[#d5d7da]'
                      }`}>
                      <input
                        type="text"
                        value={occasionTitle}
                        onChange={(e) => {
                          setOccasionTitle(e.target.value);
                          if (occasionTitleError) {
                            setOccasionTitleError('');
                          }
                        }}
                        placeholder="Enter occasion title"
                        className="font-lexend min-w-0 grow basis-0 text-sm font-normal leading-5 text-[#181d27] placeholder:text-[#717680] focus:outline-none"
                      />
                    </div>
                    {occasionTitleError && (
                      <p className="font-lexend text-xs leading-4 text-red-500">
                        {occasionTitleError}
                      </p>
                    )}
                  </div>

                  {/* Host Names Input - For non-kids birthday events */}
                  <div className="flex w-full flex-col items-start gap-1.5">
                    <div className="font-lexend flex items-start gap-0.5 whitespace-pre text-sm font-medium leading-5">
                      <p className="text-[#414651]">Host Name(s)</p>
                    </div>
                    <p className="font-lexend text-xs leading-4 text-[#717680] -mt-0.5">
                      Who is hosting this event?
                    </p>
                    <div className="flex w-full items-center gap-2 rounded-lg border border-solid border-[#d5d7da] bg-white px-3 py-2">
                      <input
                        type="text"
                        value={hostNames}
                        onChange={(e) => setHostNames(e.target.value)}
                        placeholder="Enter host name(s)"
                        className="font-lexend min-w-0 grow basis-0 text-sm font-normal leading-5 text-[#181d27] placeholder:text-[#717680] focus:outline-none"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Date and Time Section */}
              <div className="flex w-full flex-col items-start gap-3">
                {/* Event Date */}
                <div className="flex w-full flex-col items-start gap-1.5">
                  <p className="font-lexend text-sm font-medium leading-5 text-[#414651]">
                    Event Date
                  </p>
                  <DatePicker
                    value={selectedDate ? parseDate(selectedDate.toISOString().split('T')[0]) : null}
                    onChange={(date) => {
                      if (date) {
                        const jsDate = new Date(date.year, date.month - 1, date.day);
                        setSelectedDate(jsDate);
                      } else {
                        setSelectedDate(undefined);
                      }
                    }}
                    autoApply
                    customButtonClassName="!flex !h-10 !w-full !items-center !gap-2 !rounded-lg !border !border-[#d5d7da] !bg-white !px-3 !py-2 !justify-start !font-normal"
                  >
                    <div className="flex w-full items-center gap-2">
                      <span className="font-lexend flex-1 text-left text-base font-normal leading-6 text-[#717680]">
                        {formatDateDisplay(selectedDate)}
                      </span>
                      <CalendarIcon className="size-5 text-[#a4a7ae]" />
                    </div>
                  </DatePicker>
                </div>

                {/* Time Range */}
                <div className="flex w-full gap-2">
                  {/* From Time */}
                  <div className="flex flex-col">
                    <p className="font-lexend text-sm font-medium leading-5 text-[#414651] mb-1">
                      From
                    </p>
                    <TimePicker
                      value={startTimeValue}
                      onChange={(times) => {
                        const latestTime = times && times.length > 0 ? [times[times.length - 1]] : [];
                        setStartTimeValue(latestTime);
                        if (endTimeValue.length === 0 && latestTime.length > 0) {
                          const newEndTime = addHoursToTime(latestTime[0], 2);
                          setEndTimeValue([newEndTime]);
                        }
                      }}
                      timeInterval={30}
                      hour12={true}
                      autoApply={true}
                      placeholder="Select start time"
                      pickerType="from"
                      customButtonClassName="!relative !flex !h-10 !w-[150px] !items-center !rounded-lg !border !border-[#d5d7da] !bg-white !px-3 !py-2 !shadow-xs !font-normal !justify-start !overflow-hidden"
                    >
                      <span className="font-lexend text-left text-base font-normal leading-6 text-[#717680] pr-7 flex-1 min-w-0">
                        {startTimeValue.length > 0 ? formatTimeDisplay(startTimeValue[0]) : 'Select start time'}
                      </span>
                      <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 size-6 text-[#a4a7ae] flex-shrink-0 pointer-events-none" viewBox="0 0 20 20" fill="none">
                        <path d="M10 5.83333V10L12.5 12.5M17.5 10C17.5 14.1421 14.1421 17.5 10 17.5C5.85786 17.5 2.5 14.1421 2.5 10C2.5 5.85786 5.85786 2.5 10 2.5C14.1421 2.5 17.5 5.85786 17.5 10Z" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </TimePicker>
                  </div>

                  {/* To Time */}
                  <div className="flex flex-col flex-1">
                    <p className="font-lexend text-sm font-medium leading-5 text-[#414651] mb-1">
                      To
                    </p>
                    <TimePicker
                      value={endTimeValue}
                      onChange={(times) => {
                        const latestTime = times && times.length > 0 ? [times[times.length - 1]] : [];
                        setEndTimeValue(latestTime);
                      }}
                      timeInterval={30}
                      hour12={true}
                      autoApply={true}
                      placeholder="Select end time"
                      pickerType="to"
                      customButtonClassName="!relative !flex !h-10 !w-[150px] !items-center !rounded-lg !border !border-[#d5d7da] !bg-white !px-3 !py-2 !shadow-xs !font-normal !justify-start !overflow-hidden"
                    >
                      <span className="font-lexend text-left text-base font-normal leading-6 text-[#717680] pr-7 flex-1 min-w-0">
                        {endTimeValue.length > 0 ? formatTimeDisplay(endTimeValue[0]) : 'Select end time'}
                      </span>
                      <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 size-6 text-[#a4a7ae] flex-shrink-0 pointer-events-none" viewBox="0 0 20 20" fill="none">
                        <path d="M10 5.83333V10L12.5 12.5M17.5 10C17.5 14.1421 14.1421 17.5 10 17.5C5.85786 17.5 2.5 14.1421 2.5 10C2.5 5.85786 5.85786 2.5 10 2.5C14.1421 2.5 17.5 5.85786 17.5 10Z" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </TimePicker>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="sticky bottom-0 z-10 bg-white flex w-full flex-col items-start gap-3 px-4 pb-4 pt-3 border-t border-gray-100">
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
      </div>

    </>,
    document.body,
  );
};

export default EditEventModal;

