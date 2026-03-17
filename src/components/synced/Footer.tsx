// AUTO-SYNCED from zapigowebclient — DO NOT EDIT DIRECTLY
// Source: /Users/dewanshshukla/Desktop/zapigo/zapigowebclient/src/components/Footer.tsx
// Last synced: 2026-03-17T11:17:26.993Z
// API integrations stripped. Use props for data and callbacks.
'use client';

import { ChevronLeft } from '@untitledui/icons';
import { useRouter } from 'next/navigation';
import { GiftFilter } from '@/components/GiftFilter';
import { motion } from 'framer-motion';
import { BottomNav } from './BottomNavbar';

interface FooterProps {
  onAction?: () => void;
  buttonText?: string;
  showLeftButton?: boolean;
  showRightButton?: boolean;
  showCenterButton?: boolean;
  showFilter?: boolean;
  showBottomNav?: boolean;
  disabled?: boolean;
  onFilterChange?: (filters: {
    budget: string;
    age: string;
    gender: string;
  }) => void;
}

export const Footer = ({
  onAction,
  buttonText = '',
  showLeftButton = false,
  showRightButton = false,
  showFilter = false,
  onFilterChange,
  showBottomNav = false,
  disabled = false,
}: FooterProps) => {
  const router = useRouter();

  if (showBottomNav) {
    return <BottomNav />;
  }
  return (
    <footer
      className={`sticky bottom-0 z-[100] w-full border-t-[1px] border-gray-200 bg-white p-3`}
    >
      <div className="flex h-full w-full items-center justify-between space-x-2">
        {showLeftButton && (
          <motion.div
            className="flex h-[52px] w-[52px] items-center justify-center rounded-xl bg-white"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.back()}
          >
            <ChevronLeft size={32} className="text-primary" />
          </motion.div>
        )}
        {showFilter && onFilterChange && (
          <div className="flex h-[52px] flex-grow rounded-xl">
            <GiftFilter onFilterChange={onFilterChange} />
          </div>
        )}
        {showRightButton && !showFilter && (
          <motion.button
            className={`font-prata flex h-[52px] flex-grow items-center justify-center rounded-xl bg-black p-0 text-xl text-white ${
              disabled ? 'cursor-not-allowed opacity-70' : ''
            }`}
            onClick={() => {
              onAction?.();
            }}
            whileHover={{ scale: disabled ? 1 : 1.05 }}
            whileTap={{ scale: disabled ? 1 : 0.95 }}
            disabled={disabled}
          >
            {buttonText}
          </motion.button>
        )}
      </div>
    </footer>
  );
};
