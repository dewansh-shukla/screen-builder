// AUTO-SYNCED from zapigowebclient — DO NOT EDIT DIRECTLY
// Source: /Users/dewanshshukla/Desktop/zapigo/zapigowebclient/src/components/home/PartySuppliesSection.tsx
// Last synced: 2026-03-17T11:05:34.431Z
// API integrations stripped. Use props for data and callbacks.
'use client';

import React from 'react';
import { Button } from '@/components/base/buttons/button';
import { ArrowRight } from '@untitledui/icons';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface PartySuppliesSectionProps {
  onOpenQuickInviteModal?: () => void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function PartySuppliesSection({ onOpenQuickInviteModal }: PartySuppliesSectionProps) {
  const router = useRouter();
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="relative left-1/2 mb-12 flex w-screen -translate-x-1/2 bg-white py-6 px-8 md:py-8 md:px-12"
    >
      <div className="mx-auto w-full max-w-6xl p-8 md:p-12 flex flex-col items-start gap-5 text-left">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
          className="font-display text-3xl font-bold text-gray-900 md:text-5xl"
        >
          Need Party Supplies?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
          className="font-body font-normal text-xl text-gray-700 md:text-3xl"
        >
          If you&apos;re picking up balloons or decorations, you can browse our suggested catalog.
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
          className="font-body font-semibold text-xl text-gray-700 md:text-3xl"
        >
          You get 15% off when you order through your event page on Zapigo.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}
          className="mt-4 flex flex-col items-start gap-4"
        >
          <Button
            onClick={() => router.push('/e/event/new')}
            size="lg"
            color="primary"
            className="shadow-md bg-[#FF8C00] hover:bg-[#E67E00]"
            iconTrailing={ArrowRight}
          >
            Host With Zapigo Now
          </Button>
          {/* <Link
            href="/supplies-home"
            className="font-body text-lg text-link-gray hover:text-brand-600 flex items-center gap-2 transition-colors"
          >
            Or, buy directly on Amazon India
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M4.16699 10.0013H15.8337M15.8337 10.0013L10.0003 4.16797M15.8337 10.0013L10.0003 15.8346" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link> */}
        </motion.div>
      </div>
    </motion.section>
  );
}
