// AUTO-SYNCED from zapigowebclient — DO NOT EDIT DIRECTLY
// Source: /Users/dewanshshukla/Desktop/zapigo/zapigowebclient/src/components/home/EventCategoryIcons.tsx
// Last synced: 2026-03-17T11:05:34.427Z
// API integrations stripped. Use props for data and callbacks.
'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Marquee from 'react-fast-marquee';

// Exported for QuickInviteModal – same icons and names
export const EVENT_CATEGORIES = [
  { name: 'Birthdays', iconSrc: '/assets/images/home/birthday1.svg' },
  { name: 'Parties', iconSrc: '/assets/images/home/party1.svg' },
  { name: 'Housewarmings', iconSrc: '/assets/images/home/housewarming1.svg' },
  { name: 'Pujas', iconSrc: '/assets/images/home/lotus1.svg' },
  { name: 'Pre-Wedding Events', iconSrc: '/assets/images/home/wedding1.svg' },
  { name: 'Cultural Events', iconSrc: '/assets/images/home/rangoli1.svg' },
  { name: 'Ticketed Events', iconSrc: '/assets/images/home/park-tickets-couple1.svg' },
  { name: 'Community Events', iconSrc: '/assets/images/home/fi_14700275.svg' },
] as const;

export function EventCategoryIcons() {
  const categories = EVENT_CATEGORIES;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: [0.42, 0, 0.58, 1], // easeOut cubic bezier
      },
    },
  };

  // Split categories into two rows
  const firstRowCategories = categories.slice(0, 5);
  const secondRowCategories = categories.slice(5);

  const renderCategoryItem = (category: (typeof categories)[number], index: number) => (
    <motion.div
      key={`${category.name}-${index}`}
      variants={itemVariants}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
      className="flex items-center gap-2 flex-shrink-0 mx-4 md:mx-5"
    >
      <Image
        src={category.iconSrc}
        alt={category.name}
        width={40}
        height={40}
        className="flex-shrink-0"
      />
      <span className="font-body text-sm text-gray-900 whitespace-nowrap md:text-base">{category.name}</span>
    </motion.div>
  );

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      variants={containerVariants}
      className="relative left-1/2 flex w-screen -translate-x-1/2 flex-col gap-6 bg-tertiary p-6 overflow-x-hidden overflow-y-hidden"
    >
      {/* First row scrolling left to right */}
      <div className="overflow-hidden">
        <Marquee
          speed={50}
          gradient={false}
          pauseOnHover={false}
          className="flex items-center"
          autoFill={true}
        >
          {firstRowCategories.map((category, index) =>
            renderCategoryItem(category, index)
          )}
        </Marquee>
      </div>

      {/* Second row scrolling right to left */}
      <div className="overflow-hidden">
        <Marquee
          speed={50}
          direction="right"
          gradient={false}
          pauseOnHover={false}
          className="flex items-center"
          autoFill={true}
        >
          {secondRowCategories.map((category, index) =>
            renderCategoryItem(category, index)
          )}
        </Marquee>
      </div>
    </motion.section>
  );
}
