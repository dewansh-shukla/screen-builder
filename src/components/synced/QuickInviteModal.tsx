// AUTO-SYNCED from zapigowebclient — DO NOT EDIT DIRECTLY
// Source: /Users/dewanshshukla/Desktop/zapigo/zapigowebclient/src/components/QuickInviteModal.tsx
// Last synced: 2026-03-17T11:17:27.009Z
// API integrations stripped. Use props for data and callbacks.
'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { ChevronRight } from '@untitledui/icons';
import { useRouter } from 'next/navigation';
import { CloseButton } from '@/components/base/buttons/close-button';
// [STRIPPED] import { useEventStore } from '@/app/(events-and-wedding)/(events)/store/useEventStore';
// [STRIPPED] import { OCCASION_DATA } from '@/app/(events-and-wedding)/(events)/constants';
import { EVENT_CATEGORIES } from '@/components/home/EventCategoryIcons';
import ReactDOM from 'react-dom';

interface QuickInviteModalProps {
  open: boolean;
  onClose: () => void;
}

interface OccasionOption {
  id: string;
  label: string;
  icon: string;
  route: string;
  eventType: string;
  eventTypeId?: string;
}

const PARTY_MAPPING = { eventType: 'party' as const, eventTypeId: OCCASION_DATA.find(o => o.eventType === 'party')?.eventTypeId };

const CATEGORY_TO_EVENT: Record<string, { eventType: string; eventTypeId?: string }> = {
  'Birthdays': { eventType: 'kids-birthday', eventTypeId: OCCASION_DATA.find(o => o.eventType === 'kids-birthday')?.eventTypeId },
  'Cultural Events': { eventType: 'cultural-gatherings', eventTypeId: OCCASION_DATA.find(o => o.eventType === 'cultural-gatherings')?.eventTypeId },
  'Parties': PARTY_MAPPING,
  'Housewarmings': PARTY_MAPPING,
  'Pujas': PARTY_MAPPING,
  'Pre-Wedding Events': PARTY_MAPPING,
  // 'Ticketed Events': PARTY_MAPPING,
  // 'Community Events': PARTY_MAPPING,
};

const INCLUDED_CATEGORIES = ['Birthdays', 'Parties', 'Cultural Events'];

const LABEL_OVERRIDES: Record<string, string> = {
  'Birthdays': 'Birthday',
  'Parties': 'Party',
  'Cultural Events': 'Community Events',
};

const OCCASION_OPTIONS: OccasionOption[] = EVENT_CATEGORIES.filter(
  (cat) => INCLUDED_CATEGORIES.includes(cat.name)
).map((cat, i) => {
  const mapping = CATEGORY_TO_EVENT[cat.name] ?? { eventType: 'party' };
  return {
    id: `quick-${i}-${cat.name.toLowerCase().replace(/\s+/g, '-')}`,
    label: LABEL_OVERRIDES[cat.name] ?? cat.name,
    icon: cat.iconSrc,
    route: `/e/${mapping.eventType}/new`,
    eventType: mapping.eventType,
    eventTypeId: mapping.eventTypeId,
  };
});

export const QuickInviteModal: React.FC<QuickInviteModalProps> = ({
  open,
  onClose,
}) => {
  const router = useRouter();
  const { setEventTypeId, setEventId } = /* [STRIPPED] useEventStore call */ ((() => undefined) as any)();

  const handleOccasionClick = (occasion: OccasionOption) => {
    // Clear any existing eventId to ensure we create a new event
    setEventId(null);

    // Set event type ID if available
    if (occasion.eventTypeId) {
      setEventTypeId(occasion.eventTypeId);
    }

    // Navigate to the route with the actual eventType as a query parameter
    const url = new URL(occasion.route, window.location.origin);
    url.searchParams.set('occasion', occasion.eventType);
    router.push(url.pathname + url.search);
    onClose();
  };

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div
        className="absolute inset-0"
        onClick={onClose}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClose();
          }
        }}
        role="button"
        tabIndex={0}
        aria-label="Close modal overlay"
      />
      <div className="relative z-10 mx-4 w-full max-w-[500px] overflow-hidden rounded-2xl bg-white shadow-[0px_20px_24px_-4px_rgba(10,13,18,0.08),0px_8px_8px_-4px_rgba(10,13,18,0.03),0px_3px_3px_-1.5px_rgba(10,13,18,0.04)]">
        {/* Modal Header */}
        <div className="relative flex flex-col gap-4 px-4 pt-5">
          <div className="flex flex-col gap-0.5">
            <h2 className="font-lexend text-text-primary text-base font-semibold leading-6">
              Select your occasion
            </h2>
          </div>
          <CloseButton
            onPress={onClose}
            size="lg"
            className="absolute right-3 top-3"
          />
        </div>

        {/* Modal Content - occasion options */}
        <div className="max-h-[60vh] overflow-y-auto px-4 pb-4 pt-2">
          <div className="flex flex-col gap-2">
            {OCCASION_OPTIONS.map(occasion => (
              <button
                key={occasion.id}
                onClick={() => handleOccasionClick(occasion)}
                className="relative flex flex-row items-center gap-3 rounded-lg border border-gray-300 bg-white px-3 py-3 transition-all hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-600 focus:ring-offset-2"
              >
                <div className="relative h-8 w-8 shrink-0 grayscale">
                  <Image
                    src={occasion.icon}
                    alt={occasion.label}
                    fill
                    className="object-contain"
                  />
                </div>
                <p className="font-lexend text-text-secondary text-left text-sm font-semibold leading-5">
                  {occasion.label}
                </p>
                <ChevronRight className="ml-auto h-5 w-5 shrink-0 text-gray-400" />
                <div className="pointer-events-none absolute inset-0 rounded-lg shadow-[inset_0px_0px_0px_1px_rgba(10,13,18,0.18),inset_0px_-2px_0px_0px_rgba(10,13,18,0.05)]" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
};