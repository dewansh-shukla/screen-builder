// AUTO-SYNCED from zapigowebclient — DO NOT EDIT DIRECTLY
// Source: /Users/dewanshshukla/Desktop/zapigo/zapigowebclient/src/components/BrandTicker.tsx
// Last synced: 2026-03-17T11:17:26.980Z
// API integrations stripped. Use props for data and callbacks.
'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface Brand {
  brandId?: string;
  displayName: string;
  logo: string;
}

interface BrandTickerProps {
  className?: string;
  speed?: number;
  customBrands?: Brand[];
}

const defaultBrands = [
  {
    name: 'CHUMBAK',
    logo: 'https://ik.imagekit.io/zapigo/chumbak-logo.svg',
  },
  {
    name: 'PENGUIN RANDOM HOUSE',
    logo: 'https://ik.imagekit.io/zapigo/penguin-logo.svg',
  },
  {
    name: 'Kreeda',
    logo: 'https://ik.imagekit.io/zapigo/kreeda.png',
  },
  {
    name: 'Gubbachhi',
    logo: 'https://ik.imagekit.io/zapigo/gubbachhi.png',
  },
  {
    name: 'Oak Lily',
    logo: 'https://ik.imagekit.io/zapigo/oakLily.png',
  },
  {
    name: 'Almond House',
    logo: 'https://ik.imagekit.io/zapigo/almondHouse.png',
  },
  // {
  //   name: "TATA CAPITAL",
  //   logo: "/assets/images/logo.svg",
  // },
  // {
  //   name: "ekincare",
  //   logo: "/assets/images/logo.svg",
  // },
  // {
  //   name: "snapdeal",
  //   logo: "/assets/images/logo.svg",
  // },
  // {
  //   name: "ninjacart",
  //   logo: "/assets/images/logo.svg",
  // },
];

export default function BrandTicker({
  className,
  speed = 40,
  customBrands,
}: BrandTickerProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [, setAnimationDuration] = useState('30s');
  const [animationStyle, setAnimationStyle] = useState({});

  const brandsToShow = customBrands
    ? customBrands.map(brand => ({
        name: brand.displayName,
        logo: brand.logo,
      }))
    : defaultBrands;

  useEffect(() => {
    if (!scrollerRef.current || !innerRef.current) return;

    // Clone the content for seamless looping
    const scrollerContent = Array.from(innerRef.current.children);
    scrollerContent.forEach(item => {
      const duplicatedItem = item.cloneNode(true);
      innerRef.current?.appendChild(duplicatedItem);
    });

    // Set animation duration based on content width and speed
    const updateAnimationDuration = () => {
      if (!innerRef.current) return;
      const scrollerContentWidth = innerRef.current.offsetWidth / 2;
      const duration = scrollerContentWidth / speed;
      setAnimationDuration(`${duration}s`);

      setAnimationStyle({
        animation: `scroll ${duration}s linear infinite`,
      });
    };

    updateAnimationDuration();
    window.addEventListener('resize', updateAnimationDuration);

    return () => {
      window.removeEventListener('resize', updateAnimationDuration);
    };
  }, [speed]);

  // Define the keyframes style
  const keyframesStyle = `
    @keyframes scroll {
      from {
        transform: translateX(0);
      }
      to {
        transform: translateX(-50%);
      }
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: keyframesStyle }} />
      <div
        className={cn(
          'relative flex w-full overflow-hidden bg-transparent bg-white py-3',
          className,
        )}
        ref={scrollerRef}
      >
        <div
          ref={innerRef}
          className="flex items-center whitespace-nowrap"
          style={animationStyle}
        >
          {brandsToShow.map((brand, index) => (
            <div
              key={`${brand.name}-${index}`}
              className="flex min-w-[160px] items-center justify-center"
            >
              <Image
                src={brand.logo || '/placeholder.svg'}
                alt={brand.name}
                width={120}
                height={40}
                className="h-8 w-auto object-contain"
                priority
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
