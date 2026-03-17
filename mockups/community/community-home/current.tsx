'use client'

import { useState } from 'react'
import {
  CalendarDate,
  getLocalTimeZone,
  today,
} from '@internationalized/date'
import type { DateValue } from 'react-aria-components'
import { Calendar as CalendarIcon, Star01, Users01 } from '@untitledui/icons'
import { PageWrapper } from '@/components/synced/PageWrapper'
import { Calendar, CalendarContextProvider } from '@/components/application/date-picker/calendar'
import { Badge } from '@/components/base/badges/badges'
import { FeaturedIcon } from '@/components/foundations/featured-icon/featured-icon'

// Past events with realistic data
const pastEvents = [
  {
    id: 1,
    title: 'Holi Color Festival',
    date: new CalendarDate(2026, 3, 2),
    attendees: 84,
    category: 'Festival',
  },
  {
    id: 2,
    title: 'Community Potluck Dinner',
    date: new CalendarDate(2026, 3, 5),
    attendees: 32,
    category: 'Social',
  },
  {
    id: 3,
    title: 'Weekend Meditation Retreat',
    date: new CalendarDate(2026, 3, 8),
    attendees: 18,
    category: 'Wellness',
  },
  {
    id: 4,
    title: 'Kids Art Workshop',
    date: new CalendarDate(2026, 3, 10),
    attendees: 24,
    category: 'Workshop',
  },
  {
    id: 5,
    title: 'Spring Cleanup Drive',
    date: new CalendarDate(2026, 3, 14),
    attendees: 45,
    category: 'Volunteer',
  },
]

const highlightedDates: DateValue[] = pastEvents.map((e) => e.date)

function getCategoryColor(category: string) {
  switch (category) {
    case 'Festival':
      return 'brand'
    case 'Social':
      return 'success'
    case 'Wellness':
      return 'blue'
    case 'Workshop':
      return 'warning'
    case 'Volunteer':
      return 'purple'
    default:
      return 'gray'
  }
}

export default function CommunityHome() {
  const [selectedDate, setSelectedDate] = useState<DateValue | null>(null)

  const selectedEvent = selectedDate
    ? pastEvents.find((e) => e.date.compare(selectedDate as CalendarDate) === 0)
    : null

  return (
    <PageWrapper showHeader={true} showFooter={false} maxDesktopWidth="1440px">
      <div className="flex flex-col gap-6 pb-8">
        {/* Banner Section */}
        <div
          className="relative overflow-hidden px-5 pb-8 pt-6 md:px-8 md:pb-10 md:pt-8"
          style={{ backgroundColor: 'var(--background-color-warm)' }}
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -right-8 -top-8 size-40 rounded-full bg-brand-solid" />
            <div className="absolute -bottom-6 -left-6 size-32 rounded-full bg-brand-solid" />
            <div className="absolute right-12 bottom-4 size-20 rounded-full bg-brand-solid" />
          </div>

          <div className="relative mx-auto flex max-w-5xl flex-col gap-3">
            <FeaturedIcon
              icon={Users01}
              color="brand"
              theme="modern"
              size="md"
            />
            <div className="flex flex-col gap-1">
              <h1 className="font-literata text-display-xs font-semibold text-gray-900 md:text-display-sm">
                Your Community
              </h1>
              <p className="font-lexend text-sm text-gray-700">
                Stay connected with your events and celebrations
              </p>
            </div>

            <div className="mt-1 flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <CalendarIcon className="size-4 text-gray-600" />
                <span className="font-lexend text-xs font-medium text-gray-700">
                  {pastEvents.length} events this month
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Star01 className="size-4 text-gray-600" />
                <span className="font-lexend text-xs font-medium text-gray-700">
                  {pastEvents.reduce((sum, e) => sum + e.attendees, 0)} attendees
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content area: responsive grid on desktop, stacked on mobile */}
        <div className="mx-auto w-full max-w-5xl px-5 md:px-8">
          <div className="flex flex-col gap-6 xl:flex-row xl:gap-8">
            {/* Calendar Section */}
            <div className="flex flex-col gap-4 xl:w-[380px] xl:shrink-0">
              <div className="flex items-center justify-between">
                <h2 className="font-lexend text-lg font-semibold text-gray-900">Event Calendar</h2>
                <Badge color="brand" size="sm">
                  {pastEvents.length} past events
                </Badge>
              </div>

              <div className="rounded-lg border border-gray-200 p-4 shadow-xs">
                <CalendarContextProvider>
                  <Calendar
                    highlightedDates={highlightedDates}
                    onChange={(value) => setSelectedDate(value)}
                    defaultValue={today(getLocalTimeZone())}
                  />
                </CalendarContextProvider>
              </div>

              {/* Selected event detail */}
              {selectedEvent && (
                <div className="rounded-lg border border-gray-200 bg-secondary p-4 shadow-xs transition duration-100 ease-linear">
                  <div className="flex items-start justify-between">
                    <div className="flex flex-col gap-1">
                      <h3 className="font-lexend text-md font-semibold text-gray-900">
                        {selectedEvent.title}
                      </h3>
                      <p className="font-lexend text-sm text-gray-600">
                        {selectedEvent.date.toString()} &middot; {selectedEvent.attendees} attendees
                      </p>
                    </div>
                    <Badge
                      color={getCategoryColor(selectedEvent.category) as 'brand' | 'success' | 'warning' | 'error' | 'gray'}
                      size="sm"
                    >
                      {selectedEvent.category}
                    </Badge>
                  </div>
                </div>
              )}
            </div>

            {/* Past Events List */}
            <div className="flex flex-1 flex-col gap-3">
              <h2 className="font-lexend text-lg font-semibold text-gray-900">Past Events</h2>

              <div className="flex flex-col gap-3">
                {pastEvents.map((event) => (
                  <button
                    key={event.id}
                    className="flex items-center gap-3 rounded-lg border border-gray-200 bg-primary p-4 text-left shadow-xs transition duration-100 ease-linear hover:bg-primary_hover"
                    onClick={() => setSelectedDate(event.date)}
                  >
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand-secondary">
                      <CalendarIcon className="size-5 text-fg-brand-primary" />
                    </div>
                    <div className="flex flex-1 flex-col gap-0.5">
                      <span className="font-lexend text-sm font-medium text-gray-900">
                        {event.title}
                      </span>
                      <span className="font-lexend text-xs text-gray-600">
                        {event.date.toString()} &middot; {event.attendees} attendees
                      </span>
                    </div>
                    <Badge
                      color={getCategoryColor(event.category) as 'brand' | 'success' | 'warning' | 'error' | 'gray'}
                      size="sm"
                    >
                      {event.category}
                    </Badge>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
