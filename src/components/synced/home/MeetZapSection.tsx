// AUTO-SYNCED from zapigowebclient — DO NOT EDIT DIRECTLY
// Source: /Users/dewanshshukla/Desktop/zapigo/zapigowebclient/src/components/home/MeetZapSection.tsx
// Last synced: 2026-03-17T11:17:27.020Z
// API integrations stripped. Use props for data and callbacks.
'use client';

import React, { useState, useCallback } from 'react';
import Image from 'next/image';
import { Button } from '@/components/base/buttons/button';
import { ArrowRight, ChevronLeft, ChevronRight } from '@untitledui/icons';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ImageModal } from '@/components/ImageModal';
import { Carousel } from '@/components/application/carousel/carousel-base';
import Autoplay from 'embla-carousel-autoplay';

interface MeetZapSectionProps {
  onOpenQuickInviteModal?: () => void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function MeetZapSection({ onOpenQuickInviteModal }: MeetZapSectionProps) {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImageAlt, setSelectedImageAlt] = useState<string>('');

  const handleImageClick = (src: string, alt: string) => {
    setSelectedImage(src);
    setSelectedImageAlt(alt);
  };

  const handleCloseModal = useCallback(() => {
    setSelectedImage(null);
    setSelectedImageAlt('');
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
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
      className="relative left-1/2 mb-12 flex w-screen -translate-x-1/2 flex-col gap-6 bg-tertiary py-6 px-8 md:py-8 md:px-12 text-left"
    >
      <div className="mx-auto w-full max-w-6xl flex flex-col gap-6">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="font-display text-3xl font-bold text-gray-900 md:text-5xl"
        >
          Hosting doesn&apos;t have to feel like work.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
          className="font-body text-xl text-gray-700 max-w-4xl md:text-3xl"
        >
          We handle guest communication on WhatsApp & in browsers, so you don&apos;t have to manage it yourself.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}
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
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5, ease: 'easeOut' }}
          className="font-body text-sm text-gray-700 -mt-4"
        >
          Free invites, reminders, and entry passes included
        </motion.p>

        {/* Mobile Carousel View */}
        <div className="mt-6 md:hidden w-full">
          <Carousel.Root
            className="w-full relative"
            opts={{ align: 'start', loop: true }}
            plugins={[
              Autoplay({
                delay: 3000,
                stopOnInteraction: false,
                stopOnMouseEnter: true,
              }),
            ]}
          >
            <Carousel.Content className="gap-4">
              {/* Slide 1: Handles Guest Replies & Questions */}
              <Carousel.Item className="basis-full px-2">
                <div className="flex flex-col gap-4">
                  <div className="flex justify-center">
                    <Image
                      src="/assets/images/home/Screenshot1.png"
                      alt="Handles Guest Replies & Questions - WhatsApp chat screenshot"
                      width={300}
                      height={225}
                      className="h-85 w-auto object-contain rounded-xl border border-gray-200 cursor-pointer"
                      onClick={() => handleImageClick('/assets/images/home/Screenshot1.png', 'Handles Guest Replies & Questions - WhatsApp chat screenshot')}
                    />
                  </div>
                  <h3 className="font-display text-sm font-bold text-gray-900 text-center">
                    Handles Guest Replies & Questions
                  </h3>
                </div>
              </Carousel.Item>

              {/* Slide 2: Sends Timely Reminders & Directions */}
              <Carousel.Item className="basis-full px-2">
                <div className="flex flex-col gap-4">
                  <div className="flex justify-center">
                    <Image
                      src="/assets/images/home/Screenshot2.png"
                      alt="Sends Timely Reminders & Directions - WhatsApp chat screenshot"
                      width={300}
                      height={225}
                      className="h-85 w-auto object-contain rounded-xl border border-gray-200 cursor-pointer"
                      onClick={() => handleImageClick('/assets/images/home/Screenshot2.png', 'Sends Timely Reminders & Directions - WhatsApp chat screenshot')}
                    />
                  </div>
                  <h3 className="font-display text-sm font-bold text-gray-900 text-center">
                    Sends Timely Reminders & Directions
                  </h3>
                </div>
              </Carousel.Item>

              {/* Slide 3: Auto-generates entry passes */}
              <Carousel.Item className="basis-full px-2">
                <div className="flex flex-col gap-4">
                  <div className="flex justify-center">
                    <Image
                      src="/assets/images/home/Screenshot3.png"
                      alt="Auto-generates entry passes - WhatsApp chat and entry pass screenshot"
                      width={300}
                      height={225}
                      className="h-85 w-auto object-contain rounded-xl border border-gray-200 cursor-pointer"
                      onClick={() => handleImageClick('/assets/images/home/Screenshot3.png', 'Auto-generates entry passes - WhatsApp chat and entry pass screenshot')}
                    />
                  </div>
                  <h3 className="font-display text-sm font-bold text-gray-900 text-center">
                    Auto-generates entry passes
                  </h3>
                </div>
              </Carousel.Item>
            </Carousel.Content>

            <Carousel.PrevTrigger
              asChild
              className={({ isDisabled }) => [
                'absolute top-1/2 left-2 -translate-y-1/2 rounded-full bg-white/90 shadow-md',
                'p-2 transition-opacity z-10',
                isDisabled ? 'opacity-40 cursor-not-allowed' : 'opacity-100 hover:bg-white',
              ].join(' ')}
            >
              <button>
                <ChevronLeft className="h-5 w-5 text-gray-700" />
              </button>
            </Carousel.PrevTrigger>
            <Carousel.NextTrigger
              asChild
              className={({ isDisabled }) => [
                'absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-white/90 shadow-md',
                'p-2 transition-opacity z-10',
                isDisabled ? 'opacity-40 cursor-not-allowed' : 'opacity-100 hover:bg-white',
              ].join(' ')}
            >
              <button>
                <ChevronRight className="h-5 w-5 text-gray-700" />
              </button>
            </Carousel.NextTrigger>

            <Carousel.IndicatorGroup className="mt-4 flex w-full items-center justify-center gap-2">
              <Carousel.Indicator
                index={0}
                className={({ isSelected }) => [
                  'h-2 rounded-full transition-all',
                  isSelected ? 'w-8 bg-[#FF8C00]' : 'w-2 bg-gray-300',
                ].join(' ')}
              />
              <Carousel.Indicator
                index={1}
                className={({ isSelected }) => [
                  'h-2 rounded-full transition-all',
                  isSelected ? 'w-8 bg-[#FF8C00]' : 'w-2 bg-gray-300',
                ].join(' ')}
              />
              <Carousel.Indicator
                index={2}
                className={({ isSelected }) => [
                  'h-2 rounded-full transition-all',
                  isSelected ? 'w-8 bg-[#FF8C00]' : 'w-2 bg-gray-300',
                ].join(' ')}
              />
            </Carousel.IndicatorGroup>
          </Carousel.Root>
        </div>

        {/* Desktop Grid View */}
        <motion.div
          className="mt-6 hidden md:grid grid-cols-1 gap-8 md:grid-cols-3 w-full"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={containerVariants}
        >
          {/* Column 1: Handles Guest Replies & Questions */}
          <motion.div
            variants={cardVariants}
            whileHover={{ y: -8 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-4"
          >
            <div
              className="w-full max-w-xs mx-auto aspect-[4/3] rounded-xl overflow-hidden cursor-pointer flex items-center justify-center"
              onClick={() => handleImageClick('/assets/images/home/Screenshot1.png', 'Handles Guest Replies & Questions - WhatsApp chat screenshot')}
            >
              <Image
                src="/assets/images/home/Screenshot1.png"
                alt="Handles Guest Replies & Questions - WhatsApp chat screenshot"
                width={300}
                height={225}
                className="w-full h-full object-contain rounded-lg"
              />
            </div>
            <h3 className="font-display text-sm font-bold text-gray-900 text-center md:text-lg">
              Handles Guest Replies & Questions
            </h3>
          </motion.div>

          {/* Column 2: Sends Timely Reminders & Directions */}
          <motion.div
            variants={cardVariants}
            whileHover={{ y: -8 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-4"
          >
            <div
              className="w-full max-w-xs mx-auto aspect-[4/3] rounded-xl overflow-hidden cursor-pointer flex items-center justify-center"
              onClick={() => handleImageClick('/assets/images/home/Screenshot2.png', 'Sends Timely Reminders & Directions - WhatsApp chat screenshot')}
            >
              <Image
                src="/assets/images/home/Screenshot2.png"
                alt="Sends Timely Reminders & Directions - WhatsApp chat screenshot"
                width={300}
                height={225}
                className="w-full h-full object-contain rounded-lg"
              />
            </div>
            <h3 className="font-display text-sm font-bold text-gray-900 text-center md:text-lg">
              Sends Timely Reminders & Directions
            </h3>
          </motion.div>

          {/* Column 3: Auto-generates entry passes */}
          <motion.div
            variants={cardVariants}
            whileHover={{ y: -8 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-4"
          >
            <div
              className="w-full max-w-xs mx-auto aspect-[4/3] rounded-xl overflow-hidden cursor-pointer flex items-center justify-center"
              onClick={() => handleImageClick('/assets/images/home/Screenshot3.png', 'Auto-generates entry passes - WhatsApp chat and entry pass screenshot')}
            >
              <Image
                src="/assets/images/home/Screenshot3.png"
                alt="Auto-generates entry passes - WhatsApp chat and entry pass screenshot"
                width={300}
                height={225}
                className="w-full h-full object-contain rounded-lg"
              />
            </div>
            <h3 className="font-display text-sm font-bold text-gray-900 text-center md:text-lg">
              Auto-generates entry passes
            </h3>
          </motion.div>
        </motion.div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <ImageModal
          open={!!selectedImage}
          onClose={handleCloseModal}
          imageSrc={selectedImage}
          imageAlt={selectedImageAlt}
          zIndex={60}
        />
      )}
    </motion.section>
  );
}
