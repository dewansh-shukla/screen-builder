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
    <PageWrapper showHeader={true} showFooter={false} maxDesktopWidth="448px">
      <div className="flex flex-col gap-6 pb-8">
        {/* Banner Section */}
        <div className="relative overflow-hidden bg-brand-solid px-5 pb-8 pt-6">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -right-8 -top-8 size-40 rounded-full bg-white" />
            <div className="absolute -bottom-6 -left-6 size-32 rounded-full bg-white" />
            <div className="absolute right-12 bottom-4 size-20 rounded-full bg-white" />
          </div>

          <div className="relative flex flex-col gap-3">
            <FeaturedIcon
              icon={Users01}
              color="brand"
              theme="modern"
              size="md"
            />
            <div className="flex flex-col gap-1">
              <h1 className="text-display-xs font-semibold text-primary_on-brand">
                Your Community
              </h1>
              <p className="text-sm text-secondary_on-brand">
                Stay connected with your events and celebrations
              </p>
            </div>

            <div className="mt-1 flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <CalendarIcon className="size-4 text-tertiary_on-brand" />
                <span className="text-xs font-medium text-secondary_on-brand">
                  {pastEvents.length} events this month
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Star01 className="size-4 text-tertiary_on-brand" />
                <span className="text-xs font-medium text-secondary_on-brand">
                  {pastEvents.reduce((sum, e) => sum + e.attendees, 0)} attendees
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Calendar Section */}
        <div className="flex flex-col gap-4 px-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-primary">Event Calendar</h2>
            <Badge color="brand" size="sm">
              {pastEvents.length} past events
            </Badge>
          </div>

          <div className="rounded-xl border border-secondary p-4">
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
            <div className="rounded-xl border border-secondary bg-secondary p-4 transition duration-100 ease-linear">
              <div className="flex items-start justify-between">
                <div className="flex flex-col gap-1">
                  <h3 className="text-md font-semibold text-primary">
                    {selectedEvent.title}
                  </h3>
                  <p className="text-sm text-tertiary">
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
        <div className="flex flex-col gap-3 px-5">
          <h2 className="text-lg font-semibold text-primary">Past Events</h2>

          <div className="flex flex-col gap-3">
            {pastEvents.map((event) => (
              <button
                key={event.id}
                className="flex items-center gap-3 rounded-xl border border-secondary bg-primary p-4 text-left transition duration-100 ease-linear hover:bg-primary_hover"
                onClick={() => setSelectedDate(event.date)}
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand-secondary">
                  <CalendarIcon className="size-5 text-fg-brand-primary" />
                </div>
                <div className="flex flex-1 flex-col gap-0.5">
                  <span className="text-sm font-medium text-primary">
                    {event.title}
                  </span>
                  <span className="text-xs text-tertiary">
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
    </PageWrapper>
  )
}
