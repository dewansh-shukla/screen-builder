// AUTO-SYNCED from zapigowebclient — DO NOT EDIT DIRECTLY
// Source: /Users/dewanshshukla/Desktop/zapigo/zapigowebclient/src/components/home/FeaturedEventsSection.tsx
// Last synced: 2026-03-17T11:17:27.017Z
// API integrations stripped. Use props for data and callbacks.
'use client';

import React, { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Carousel } from '@/components/application/carousel/carousel-base';
import { ChevronLeft, ChevronRight } from '@untitledui/icons';
import Autoplay from 'embla-carousel-autoplay';

export interface FeaturedEventSlide {
  image: string;
  eventId: string;
  /** Intrinsic width of the image – used so the container matches the image aspect ratio */
  width: number;
  /** Intrinsic height of the image – used so the container matches the image aspect ratio */
  height: number;
  /** Optional exact path to open on click (e.g. /event/id?day=1). If set, overrides /event/{eventId}. */
  link?: string;
}

const FEATURED_EVENTS: FeaturedEventSlide[] = [
  {
    image: 'https://ik.imagekit.io/zapigo/Featured%20Events/Upcoming%20event.jpg',
    eventId: '',
    width: 800,
    height: 1000,
    link: 'https://zapigo.co/Dc0Tc',
  },
];

export function FeaturedEventsSection() {
  const featuredEventId = useMemo(() => {
    const raw = process.env.NEXT_PUBLIC_EVENT_ID || '';
    return raw.replace(/[\s'";]/g, '').trim();
  }, []);

  const slides = useMemo(
    () =>
      FEATURED_EVENTS.map((slide) => ({
        ...slide,
        eventId: slide.eventId || featuredEventId,
      })),
    [featuredEventId],
  );

  const getSlideHref = (slide: (typeof slides)[0]) =>
    slide.link ?? (slide.eventId ? `/event/${slide.eventId}` : '');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] as const },
    },
  };

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={containerVariants}
      className="relative left-1/2 flex w-screen -translate-x-1/2 flex-col bg-white p-8 md:p-12"
    >
      <div className="mx-auto w-full max-w-6xl">
        <motion.div variants={itemVariants} className="mb-8 text-left">
          <h2 className="font-display text-3xl font-bold text-gray-900 md:text-5xl">
            Featured Events
          </h2>
          <p className="mt-2 font-body text-lg text-gray-600 md:text-xl">
            Sign-up and fill your calendar with joy!
          </p>
        </motion.div>

        <motion.div variants={itemVariants}>
          {slides.length === 1 ? (
            <Link
              href={getSlideHref(slides[0])}
              target="_blank"
              rel="noopener noreferrer"
              className="group block w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-xl overflow-hidden"
            >
              <div className="relative w-full md:max-w-xl overflow-hidden rounded-xl bg-gray-100 shadow-xl shadow-black/35 md:mx-auto">
                <Image
                  src={slides[0].image}
                  alt=""
                  width={slides[0].width}
                  height={slides[0].height}
                  className="block w-full h-auto transition-transform duration-300 group-hover:scale-[1.02]"
                  sizes="(max-width: 768px) 100vw, 576px"
                />
              </div>
            </Link>
          ) : (
            <Carousel.Root
              className="w-full relative"
              opts={{ align: 'center', loop: true }}
              plugins={[
                Autoplay({
                  delay: 5000,
                  stopOnInteraction: false,
                  stopOnMouseEnter: true,
                }),
              ]}
            >
              <Carousel.Content className="gap-4 md:gap-6">
                {slides.map((slide, index) => (
                  <Carousel.Item key={slide.eventId || `slide-${index}`} className="basis-full min-w-0 px-1 md:px-2">
                    <Link
                      href={getSlideHref(slide)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-xl overflow-hidden"
                    >
                      <div className="relative w-full md:max-w-xl overflow-hidden rounded-xl bg-gray-100 shadow-xl shadow-black/25 md:mx-auto">
                        <Image
                          src={slide.image}
                          alt=""
                          width={slide.width}
                          height={slide.height}
                          className="block w-full h-auto transition-transform duration-300 group-hover:scale-[1.02]"
                          sizes="(max-width: 768px) 100vw, 576px"
                        />
                      </div>
                    </Link>
                  </Carousel.Item>
                ))}
              </Carousel.Content>

              <Carousel.PrevTrigger
                asChild
                className={({ isDisabled }) =>
                  [
                    'absolute top-1/2 left-2 -translate-y-1/2 rounded-full bg-white/90 shadow-md p-2 transition-opacity z-10',
                    isDisabled ? 'opacity-40 cursor-not-allowed' : 'opacity-100 hover:bg-white',
                  ].join(' ')
                }
              >
                <button aria-label="Previous slide">
                  <ChevronLeft className="h-5 w-5 text-gray-700" />
                </button>
              </Carousel.PrevTrigger>
              <Carousel.NextTrigger
                asChild
                className={({ isDisabled }) =>
                  [
                    'absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-white/90 shadow-md p-2 transition-opacity z-10',
                    isDisabled ? 'opacity-40 cursor-not-allowed' : 'opacity-100 hover:bg-white',
                  ].join(' ')
                }
              >
                <button aria-label="Next slide">
                  <ChevronRight className="h-5 w-5 text-gray-700" />
                </button>
              </Carousel.NextTrigger>
              <Carousel.IndicatorGroup className="mt-4 flex w-full items-center justify-center gap-2">
                {slides.map((_, index) => (
                  <Carousel.Indicator
                    key={index}
                    index={index}
                    className={({ isSelected }) =>
                      [
                        'h-2 rounded-full transition-all',
                        isSelected ? 'w-8 bg-[#FF8C00]' : 'w-2 bg-gray-300',
                      ].join(' ')
                    }
                  />
                ))}
              </Carousel.IndicatorGroup>
            </Carousel.Root>
          )}
        </motion.div>
      </div>
    </motion.section>
  );
}
