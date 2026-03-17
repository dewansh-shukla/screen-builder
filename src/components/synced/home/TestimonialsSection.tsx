// AUTO-SYNCED from zapigowebclient — DO NOT EDIT DIRECTLY
// Source: /Users/dewanshshukla/Desktop/zapigo/zapigowebclient/src/components/home/TestimonialsSection.tsx
// Last synced: 2026-03-17T11:05:34.431Z
// API integrations stripped. Use props for data and callbacks.
'use client';

import React from 'react';
import Image from 'next/image';
import { StarIcon } from '@/components/foundations/rating-stars';
import { motion } from 'framer-motion';

interface Testimonial {
  name: string;
  role: string;
  company: string;
  rating: number;
  quote?: string;
  imageUrl: string;
  imageAlt: string;
}

const testimonials: Testimonial[] = [
  {
    name: 'Alisa Hester',
    role: 'PM, Hourglass',
    company: 'Web Design Agency',
    rating: 5,
    imageUrl: '/assets/images/home/testimonial1.png',
    imageAlt: 'Alisa Hester',
  },
  {
    name: 'Rich Wilson',
    role: 'COO, Command+R',
    company: 'Web Development Agency',
    rating: 5,
    quote: "Zapigo made organizing our company events so much easier. The automated reminders and entry passes saved us hours of work.",
    imageUrl: '/assets/images/home/testimonial2.png',
    imageAlt: 'Rich Wilson',
  },
  {
    name: 'Annie Stanley',
    role: 'Designer, Catalog',
    company: 'UX Agency',
    rating: 5,
    imageUrl: '/assets/images/home/testimonial3.png',
    imageAlt: 'Annie Stanley',
  },
];


export function TestimonialsSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1] as const,
      },
    },
  };

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={containerVariants}
      className="mb-12 flex flex-col items-center gap-8"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="flex flex-col gap-4 text-left w-full"
      >
        <h2 className="font-display text-3xl font-bold text-gray-900 md:text-4xl">
          Testimonials
        </h2>
        <p className="font-body text-base text-gray-700 md:text-lg">
          Hear what Zapigo&apos;s hosts & guests have to say about us
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 w-full">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="relative w-full aspect-[3/4] rounded-xl overflow-hidden group"
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <Image
                src={testimonial.imageUrl}
                alt={testimonial.imageAlt}
                fill
                className="object-cover"
                sizes="(min-width: 768px) 33vw, 100vw"
              />
            </div>

            {/* Gradient Overlay */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/40 to-black/0 p-3 pt-16 md:p-4 lg:pt-24">
              {/* Glassmorphism Overlay */}
              <div className="flex flex-col gap-6 rounded-xl bg-white/30 px-4 py-6 backdrop-blur-lg md:gap-6 md:rounded-2xl md:p-5 md:px-5">
                {/* Quote (only for middle card) */}
                {testimonial.quote && (
                  <q className="font-body text-xl font-semibold text-white leading-[30px] text-balance">
                    {testimonial.quote}
                  </q>
                )}

                <div className="flex flex-col gap-1.5 md:gap-2">
                  <div className="flex flex-col gap-4">
                    {/* Star Rating */}
                    <div aria-hidden="true" className="flex gap-1">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <StarIcon
                          key={i}
                          className="text-yellow-400"
                        />
                      ))}
                    </div>

                    {/* Name */}
                    <p className="font-display text-xl font-semibold text-white md:text-2xl leading-8">
                      {testimonial.name}
                    </p>
                  </div>

                  {/* Role and Company */}
                  <div className="flex flex-col gap-0.5">
                    <p className="font-body text-base font-semibold text-white leading-6">
                      {testimonial.role}
                    </p>
                    <p className="font-body text-sm font-medium text-white leading-5">
                      {testimonial.company}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* TODO: Uncomment when testimonials page is ready
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}
      >
        <Button
          href="/testimonials"
          size="md"
          color="secondary"
          className="mt-4"
          iconTrailing={LinkExternal01}
        >
          View All
        </Button>
      </motion.div>
      */}
    </motion.section>
  );
}
