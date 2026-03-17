// AUTO-SYNCED from zapigowebclient — DO NOT EDIT DIRECTLY
// Source: /Users/dewanshshukla/Desktop/zapigo/zapigowebclient/src/components/gifter/FlipCardGifter.tsx
// Last synced: 2026-03-17T11:05:34.427Z
// API integrations stripped. Use props for data and callbacks.
'use client';

import Image from 'next/image';
// import { CircleArrowRight } from "lucide-react";

import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';

// Define the type for the curation prop
interface Curation {
  displayName: string;
  tagline: string;
  gender: string;
  variants: Array<{
    variantPrice: number;
    product_count: number;
    top_products: Array<{
      images: Record<string, { thumbnail: string }>;
    }>;
  }>;
  Palette: {
    primaryColor: string;
    secondaryColor: string;
    fontColor: string;
    accentColor: string;
  };
  Curator: {
    displayName: string;
    logoImage: {
      original: string;
    };
    bannerImage: string;
  };
  profileImage?: {
    image: string;
  };
  Age_Tags: Array<{ display_name: string }>;
  Occasion_Tags: Array<{ display_name: string }>;
  Theme_Tags: Array<{ display_name: string }>;
}

const FlipCardGifter = ({
  curation,
  onViewGiftChoices,
  showProducts = true,
  showFooterText = false,
  hidePrice = false,
  footerText = 'Gift this box. They pick one gift. We refund the difference to you',
}: {
  curation: Curation;
  onViewGiftChoices: () => void;
  showProducts?: boolean;
  showFooterText?: boolean;
  hidePrice?: boolean;
  footerText?: string;
}) => {
  // Extract needed data from curation
  const displayName = curation?.displayName || 'Just for You';
  const tagline =
    curation?.tagline ||
    'Gift this box. They pick one gift. We refund the difference to you';

  const variant = curation?.variants?.[0];
  const price = variant ? `₹${variant?.variantPrice}` : '₹1500';
  // const productCount = variant.product_count;

  // Get primary color for the card
  const primaryColor = curation?.Palette?.primaryColor || '#ffffff';
  const secondaryColor = curation?.Palette?.secondaryColor || '#ffffff';

  // Generate tags from curation data

  // const age_tags = curation?.Age_Tags?.map((tag) => tag.display_name);
  // const occasion_tags = curation?.Occasion_Tags?.map((tag) => tag.display_name);
  // const theme_tags = curation?.Theme_Tags?.map((tag) => tag.display_name);

  // Get curator name
  const curatorName = curation?.Curator?.displayName || 'ZAPIGO';

  // const gender = curation?.gender

  // Get profile image for the card
  // const profileImage = curation.profileImage?.image || "/placeholder.svg";

  // Get top products from the variants
  const topProducts = curation?.variants?.[0]?.top_products || [];

  const handleButtonClick = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    action();
  };

  return (
    <Card
      id={`card-${curation?.id}`}
      className="h-full w-full max-w-[400px] cursor-pointer rounded-xl border-[1px] bg-white shadow-xl"
      onClick={e => handleButtonClick(e, onViewGiftChoices)}
      style={{ borderColor: primaryColor }}
    >
      <div className="flex flex-col px-3 py-4">
        {/* Curator section */}
        <div
          className="text-title-serif-lg font-prata mb-4 flex justify-between px-2"
          style={{ fontWeight: 200 }}
        >
          <p>
            {displayName} <br />
            <span className="text-sm text-gray-500">by</span>
            <span className="text-sm text-black"> {curatorName}</span>
          </p>

          <div className="flex h-full items-center">
            {(() => {
              const logoImage =
                curation?.Curator?.bannerImage || '/placeholder.svg';
              return (
                <Image
                  src={
                    logoImage.startsWith('http')
                      ? logoImage
                      : `https://${logoImage}`
                  }
                  alt={curation?.Curator?.displayName || 'Curator'}
                  width={100}
                  height={25}
                  className="max-h-[50px] w-full object-cover"
                />
              );
            })()}
          </div>
        </div>

        {/* Price and description section */}
        <div
          className="mb-4 flex w-full flex-col overflow-hidden rounded-lg pb-4 shadow-md"
          style={{ backgroundColor: secondaryColor }}
        >
          {/* Left content section */}
          <div className="flex w-full">
            <div className="flex w-4/5 flex-grow flex-col p-6 pt-2 pl-3">
              <h2 className="text-body-lg font-lato mb-2 font-light text-black">
                {tagline}
              </h2>
            </div>
            {/* Right price/info section */}
            {!hidePrice && (
              <div className="relative flex w-[25%] flex-col justify-between p-6">
                {/* Price tag with rounded corners in top right */}
                <div
                  className="absolute top-0 right-0 flex h-[3rem] w-full items-center justify-center rounded-bl-lg p-4 text-white"
                  style={{ backgroundColor: primaryColor }}
                >
                  <span className="text-headline-sm font-dm-sans">{price}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Product section */}
        {showProducts && (
          <div className="flex w-full flex-row gap-3">
            {topProducts.slice(0, 3).map((product, index) => (
              <div
                key={index}
                className="h-[70px] w-1/4 overflow-hidden rounded-lg bg-gray-100"
              >
                <Image
                  src={
                    product.images[
                      Object.keys(product.images)[0]
                    ]?.thumbnail?.startsWith('http')
                      ? product.images[Object.keys(product.images)[0]].thumbnail
                      : `https://${product.images[Object.keys(product.images)[0]].thumbnail}`
                  }
                  alt={`Gift option ${index + 1}`}
                  width={70}
                  height={70}
                  className="min-h-[70px] w-full"
                />
              </div>
            ))}
            {
              <motion.div
                className="flex h-[70px] w-1/5 items-center justify-center rounded-lg bg-gray-100 px-1"
                onClick={e => handleButtonClick(e, onViewGiftChoices)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-center text-xs text-wrap">
                  Tap to View More
                </span>
              </motion.div>
            }
          </div>
        )}

        {showFooterText && (
          <div className="flex w-full flex-row gap-3">
            <span className="text-title-sans-sm font-dm-sans">
              {footerText}
            </span>
          </div>
        )}
      </div>
    </Card>
  );
};

export default FlipCardGifter;
