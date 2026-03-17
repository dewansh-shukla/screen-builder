// AUTO-SYNCED from zapigowebclient — DO NOT EDIT DIRECTLY
// Source: /Users/dewanshshukla/Desktop/zapigo/zapigowebclient/src/components/home/HeroSection.tsx
// Last synced: 2026-03-17T11:05:34.429Z
// API integrations stripped. Use props for data and callbacks.
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/base/buttons/button';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface HeroSectionProps {
  onOpenQuickInviteModal?: () => void;
}

interface Slide {
  image: string;
  title: string;
  items: string[];
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function HeroSection({ onOpenQuickInviteModal }: HeroSectionProps) {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides: Slide[] = [
    {
      image: '/assets/images/home/Zapigo-mockup.png',
      title: 'Get everyone on the same page',
      items: [
        'Create and share a digital invite',
        'Manage RSVPs automatically',
        'Keep event details clear and up-to-date',
      ],
    },
    {
      image: '/assets/images/home/Zapigo-mockup2.png',
      title: 'Take care of guest coordination',
      items: [
        'Share directions, timings, and updates',
        'Cut down last-minute calls and messages',
        'Coordinate entry, passes, and access where required',
      ],
    },
    {
      image: '/assets/images/home/Zapigo-mockup3.png',
      title: 'Close the loop',
      items: [
        'Share photos and memories in one place',
        'Keep messages and memories together',
        'Sends thank you messages automatically',
      ],
    },
  ];

  // Auto carousel functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(interval);
  }, [slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <section className="mb-12 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
      {/* Left Column - Text Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="flex flex-col gap-6"
      >
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
          className="font-display text-3xl font-semibold text-gray-900 md:text-5xl"
        >
          Make every occasion joyous.
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
          className="flex flex-col gap-6"
        >
          <p className="font-body text-xl text-gray-700 md:text-3xl">
            We help you plan and host events seamlessly.
          </p>
          <p className="font-body text-xl text-gray-700 md:text-3xl">
            From birthday parties and housewarmings to community events and celebrations that matter.
          </p>
          <p className="font-body text-xl text-gray-700 md:text-3xl">
            Free forever.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
          className="flex flex-col gap-3"
        >

          <Button
            onClick={() => router.push('/e/event/new')}
            size="lg"
            className="w-fit bg-[#FF8C00] text-white shadow-md hover:bg-[#FF7A00] transition-colors"
          >
            <span className="flex items-center gap-2">
              Host With Zapigo Now
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </Button>
        </motion.div>
      </motion.div>

      {/* Right Column - Phone Mockup and Feature Description with Carousel */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
        className="flex flex-col gap-6 items-center"
      >
        {/* Container to constrain width to match image */}
        <div className="w-full max-w-[437px] flex flex-col gap-6">
          {/* Phone Mockup Container with Carousel */}
          <div className="relative flex items-center justify-center rounded-2xl overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
                className="relative z-10 w-full aspect-square"
              >
                <Image
                  src={slides[currentSlide].image}
                  alt="Zapigo mobile app mockup showing event invitation"
                  fill
                  className="object-cover rounded-xl drop-shadow-2xl"
                  priority={currentSlide === 0}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Feature Description with Carousel */}
          <div className="min-h-[110px] md:min-h-[130px] flex items-start">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
                className="flex flex-col gap-3 w-full"
              >
                <h3 className="font-display text-base font-semibold text-gray-900 md:text-2xl">
                  {slides[currentSlide].title}
                </h3>
                <ul className="flex flex-col gap-0.5 list-none">
                  {slides[currentSlide].items.map((item, index) => (
                    <li key={index} className="font-body text-xs text-gray-700 md:text-lg flex items-start gap-2 leading-snug">
                      <span className="text-[#FF8C00] flex-shrink-0">•</span>
                      <span className="flex-1 leading-none mb-1">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Pagination Dots */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6, ease: 'easeOut' }}
            className="flex items-center gap-2 justify-center"
          >
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${currentSlide === index
                  ? 'bg-[#FF8C00] w-8'
                  : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
