// AUTO-SYNCED from zapigowebclient — DO NOT EDIT DIRECTLY
// Source: /Users/dewanshshukla/Desktop/zapigo/zapigowebclient/src/components/LoaderOverlay.tsx
// Last synced: 2026-03-17T11:05:34.415Z
// API integrations stripped. Use props for data and callbacks.
'use client';

import dynamic from 'next/dynamic';
import loadingAnimation from '../../public/assets/animations/cherry blossom.json';
import ZapigoSVG from './ui/ZapigoSVG';
import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';

// Dynamically import Lottie with no SSR
const Lottie = dynamic(() => import('lottie-react'), {
  ssr: false,
});

interface LoaderOverlayProps {
  showLogo?: boolean;
  loaderText?: string;
  rotatingWords?: string[];
  rotatingPrefix?: string;
  rotatingSuffix?: string;
}

// RotateWords component (animated middle word)
const RotateWords: React.FC<{
  words: string[];
  prefix: string;
  suffix: string;
}> = ({ words, prefix, suffix }) => {
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    if (!words || words.length === 0) return;
    const interval = setInterval(() => {
      setIndex(prevIndex => (prevIndex + 1) % words.length);
    }, 500);
    return () => clearInterval(interval);
  }, [words]);

  return (
    <p className="font-literata mt-3 text-center text-xl text-black md:text-3xl">
      <span className="block">{prefix}</span>
      <span className="inline-flex items-center justify-center gap-1.5">
        <AnimatePresence mode="wait">
          <motion.span
            key={index}
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.5 }}
            className="inline-block font-semibold text-[#CC056B]"
          >
            {words[index]}
          </motion.span>
        </AnimatePresence>
        <span>{suffix}</span>
      </span>
    </p>
  );
};

export const LoaderOverlay = ({
  showLogo = false,
  loaderText = '',
  rotatingWords,
  rotatingPrefix = 'Celebrations are the',
  rotatingSuffix = 'of India',
}: LoaderOverlayProps) => {
  return (
    <div className="fixed inset-0 z-[100] flex min-h-screen flex-col items-center justify-center bg-white">
      {showLogo && (
        <ZapigoSVG
          color="#CC056B"
          width={180}
          height={180}
          className="mb-[-2rem]"
        />
      )}
      {Array.isArray(rotatingWords) && rotatingWords.length > 0 ? (
        <RotateWords
          words={rotatingWords}
          prefix={rotatingPrefix}
          suffix={rotatingSuffix}
        />
      ) : (
        loaderText && (
          <p className="text-body-md font-literata mt-8 text-xs text-black md:text-3xl">
            {loaderText}
          </p>
        )
      )}
      <Lottie
        animationData={loadingAnimation}
        loop
        autoplay
        className="mx-auto mt-[2rem] h-[14rem] w-[14rem]"
      />
    </div>
  );
};
