// AUTO-SYNCED from zapigowebclient — DO NOT EDIT DIRECTLY
// Source: /Users/dewanshshukla/Desktop/zapigo/zapigowebclient/src/components/BottomNavbar.tsx
// Last synced: 2026-03-17T11:17:26.979Z
// API integrations stripped. Use props for data and callbacks.
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import greetImage from '../../../public/assets/images/greetImage.svg';
import giftImage from '../../../public/assets/images/giftImage.svg';
import gatherImage from '../../../public/assets/images/gatherImage.svg';
import homeImage from '../../../public/assets/images/homeImage.svg';
import Image from 'next/image';

interface BottomNavProps {
  showBottomNav?: boolean;
}

export function BottomNav({ showBottomNav = true }: BottomNavProps) {
  const pathname = usePathname();

  if (!showBottomNav) return null;

  const navItems = [
    {
      label: 'HOME',
      icon: homeImage,
      href: `/`,
    },
    {
      label: 'GREET',
      icon: greetImage,
      href: `/greet`,
    },
    {
      label: 'GATHER',
      icon: gatherImage,
      href: `/gather`,
    },
    {
      label: 'GIFT',
      icon: giftImage,
      href: `/gift`,
    },
  ];

  return (
    <footer className="sticky bottom-0 w-full p-2">
      <nav className="bg-accent-light mx-auto flex max-w-md items-center justify-between rounded-xl p-2">
        {navItems.map(item => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <motion.div
              key={item.label}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href={item.href}
                className={`flex h-full min-w-[72px] items-center justify-center rounded-xl p-2 transition-colors ${
                  isActive ? 'bg-primary' : 'hover:bg-[#FFD66B]/50'
                }`}
              >
                <Image
                  src={Icon}
                  alt={item.label}
                  width={24}
                  height={24}
                  className="mr-2"
                />
                <span
                  className={`text-label-sm font-dm-sans ${
                    isActive ? 'text-black' : 'text-gray-600'
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            </motion.div>
          );
        })}
      </nav>
    </footer>
  );
}
