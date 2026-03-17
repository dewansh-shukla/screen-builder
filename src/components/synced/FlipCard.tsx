// AUTO-SYNCED from zapigowebclient — DO NOT EDIT DIRECTLY
// Source: /Users/dewanshshukla/Desktop/zapigo/zapigowebclient/src/components/FlipCard.tsx
// Last synced: 2026-03-17T11:05:34.406Z
// API integrations stripped. Use props for data and callbacks.
'use client';

import { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
// import BgImage from "../../public/assets/images/bgCuration.png";

export interface CurationProps {
  id: string;
  displayName: string;
  giftee_description: string;
  gifter_description: string;
  tagline: string;
  product_count: number;
  defaultBannerImage: {
    mobile: string;
    desktop: string;
    original: string;
    thumbnail: string;
  };
  profileImage: {
    mobile: string;
    desktop: string;
    original: string;
    thumbnail: string;
  };
  variants: {
    variantPrice: number;
    choiceCount: number;
    productCount: number;
    product_count: number;
    id: string;
  }[];
  Curator: {
    id: string;
    displayName: string;
    description: string;
    status: string;
    bannerImage: string;
    logoImage: string;
    userId: string;
  };
  Palette: {
    id: string;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    fontColor: string;
  };
  Occasion_Tags: { display_name: string }[];
  Age_Tags: { display_name: string }[];
}

interface FlipCardProps {
  curation: CurationProps;
  onAddGift: () => void;
  onViewGiftChoices: () => void;
  heightReduced?: boolean;
}

export default function FlipCard({
  curation,
  onAddGift,
  onViewGiftChoices,
  heightReduced = false,
}: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  // const [showFullDescription, setShowFullDescription] = useState(false);

  const toggleFlip = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFlipping) return; // Prevent flip during animation

    setIsFlipping(true);
    setIsFlipped(!isFlipped);

    // Reset flipping state after animation completes
    setTimeout(() => {
      setIsFlipping(false);
    }, 500); // Match this with your flip animation duration
  };

  // const toggleDescription = (e: React.MouseEvent) => {
  //   e.stopPropagation();
  //   setShowFullDescription(!showFullDescription);
  // };

  const handleButtonClick = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    if (!isFlipping) {
      action();
    }
  };

  const renderTags = (tags: { display_name: string }[]) => {
    const firstTwoTags = tags.slice(0, 2);
    const remainingCount = tags.length - 2;

    return (
      <div className="flex flex-wrap gap-2">
        {firstTwoTags.map((tag, index) => (
          <Badge
            key={index}
            variant="outline"
            className="font-lato border-none px-3 text-xs whitespace-nowrap"
            style={{
              backgroundColor: curation?.Palette?.secondaryColor,
              color: curation?.Palette?.primaryColor,
            }}
          >
            {tag.display_name}
          </Badge>
        ))}
        {remainingCount > 0 && (
          <Badge
            variant="outline"
            className="font-lato border-none px-3 text-xs"
            style={{
              backgroundColor: curation?.Palette?.secondaryColor,
              color: curation?.Palette?.primaryColor,
            }}
          >
            +{remainingCount}
          </Badge>
        )}
      </div>
    );
  };

  // Calculate the card height based on the heightReduced prop
  const cardHeight = heightReduced ? 'h-[408px]' : 'h-[300px]'; // 480px * 0.85 = 408px (15% reduction)

  return (
    <div
      className="relative flex w-full pb-8"
      style={{
        color: curation?.Palette?.fontColor,
      }}
    >
      {/* Background Image */}
      <div
        className="absolute right-[1%] bottom-[-7%] h-[100%] w-[85%] rounded-lg shadow-xl"
        style={{
          transform: 'rotate(5deg)',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        }}
      />

      {/* Curator Info */}
      <div className="absolute bottom-2 flex h-[4.7rem] w-full items-start justify-center">
        <div className="relative flex h-full w-[80%]">
          <div className="font-lato z-[10px] w-full pt-[3.5rem] pl-5 text-xs">
            Curated by
            <br />
            <b>{curation.Curator.displayName}</b>
          </div>
          <div className="w-16 pt-[4.5rem]">
            {(() => {
              const logoImage = JSON.parse(curation.Curator.logoImage);
              return (
                <Image
                  src={`https://${logoImage.original}`}
                  alt={curation.Curator.displayName}
                  width={80}
                  height={80}
                  className="h-auto w-full object-contain"
                />
              );
            })()}
          </div>
        </div>
      </div>

      {/* Flip Card Container */}
      <div className="flex h-[85%] w-full items-start justify-center">
        <motion.div
          className={`w-full max-w-[90%] align-top sm:max-w-[90%] ${cardHeight} relative`}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.5, type: 'ease' }}
          style={{ perspective: 1000 }}
        >
          {/* Front Card */}
          <Card
            style={{
              backgroundColor: curation?.Palette?.primaryColor,
              color: curation?.Palette?.secondaryColor,
              zIndex: isFlipped ? 0 : 1,
            }}
            className={cn(
              'absolute h-full w-full overflow-hidden rounded-xl',
              'transform-gpu transition-all duration-500',
              isFlipped && 'opacity-0 backface-hidden',
              isFlipping && 'pointer-events-none', // Disable interactions during flip
            )}
            onClick={toggleFlip}
          >
            <CardContent className="flex h-full flex-col p-3 sm:p-4">
              {/* Banner Image */}
              {/* <div className="relative w-full aspect-[16/9] mb-4 bg-white rounded-xl">
                <Image
                  src={`https://${curation.defaultBannerImage.original}`}
                  alt={curation?.displayName}
                  fill
                  className="object-cover rounded-xl"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div> */}

              <div className="flex-grow space-y-3">
                <div className="space-y-2">
                  <h2 className="font-dm-sans line-clamp-2 text-xl sm:text-2xl">
                    {curation.displayName}
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    <Badge
                      style={{
                        backgroundColor: curation?.Palette?.secondaryColor,
                        color: curation?.Palette?.primaryColor,
                      }}
                      className="rounded-md border-none p-2 text-sm sm:text-base"
                    >
                      ₹{curation?.variants[0]?.variantPrice}
                    </Badge>
                    <Badge
                      style={{
                        backgroundColor: curation?.Palette?.secondaryColor,
                        color: curation?.Palette?.primaryColor,
                      }}
                      className="rounded-md border-none p-2 text-sm sm:text-base"
                    >
                      {curation.variants[0]?.product_count}{' '}
                      {curation.variants[0]?.product_count === 1
                        ? 'choice'
                        : 'choices'}
                    </Badge>
                  </div>
                  <p className="line-clamp-2 text-sm">{curation.tagline}</p>
                </div>

                <div className="space-y-2">
                  <p className="text-xs uppercase">SUITABLE FOR</p>
                  {renderTags(curation.Occasion_Tags)}
                  {renderTags(curation.Age_Tags)}
                </div>

                <p className="absolute right-0 bottom-4 left-0 text-center text-sm">
                  TAP TO VIEW
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Back Card */}
          <Card
            className={cn(
              'absolute h-full w-full overflow-hidden rounded-xl border-1',
              'transform-gpu transition-all duration-500',
              !isFlipped && 'opacity-0 backface-hidden',
              isFlipped && 'rotate-y-180',
              isFlipping && 'pointer-events-none', // Disable interactions during flip
            )}
            style={{
              backgroundColor: curation?.Palette?.secondaryColor,
              borderColor: curation?.Palette?.primaryColor,
              zIndex: isFlipped ? 1 : 0,
            }}
            onClick={toggleFlip}
          >
            <CardContent className="flex h-full flex-col p-4">
              {/* Header Section */}
              <div className="mb-4 flex gap-3">
                {curation.profileImage?.thumbnail && (
                  <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg sm:h-24 sm:w-24">
                    <Image
                      src={
                        curation.profileImage?.thumbnail
                          ? `https://${curation.profileImage.thumbnail}`
                          : '/placeholder-image.jpg'
                      }
                      alt={curation.displayName}
                      width={96}
                      height={96}
                      className="h-full w-full object-cover"
                      onError={e => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/assets/images/logo.svg';
                      }}
                    />
                  </div>
                )}
                <div className="flex-grow">
                  <h2 className="text-headline-sm font-dm-sans line-clamp-2">
                    {curation.displayName}
                  </h2>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Badge
                      style={{
                        backgroundColor: curation?.Palette?.fontColor,
                        color: curation?.Palette?.secondaryColor,
                      }}
                      className="rounded-md border-none p-2 text-sm"
                    >
                      ₹{curation.variants[0].variantPrice}
                    </Badge>
                    <Badge
                      style={{
                        backgroundColor: curation?.Palette?.fontColor,
                        color: curation?.Palette?.secondaryColor,
                      }}
                      className="rounded-md border-none p-2 text-sm"
                    >
                      {curation.variants[0]?.product_count}{' '}
                      {curation.variants[0]?.product_count === 1
                        ? 'choice'
                        : 'choices'}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Content Section */}
              <div className="scrollbar-thin flex-grow space-y-4 overflow-y-auto">
                <div>
                  <h3 className="text-label-md font-dm-sans mb-1">
                    DESCRIPTION
                  </h3>
                  <p className="text-body-md font-lato">
                    {/* {showFullDescription
                      ? curation.giftee_description
                      : `${curation.giftee_description.slice(0, 100)}...`} */}

                    {curation.giftee_description}
                    {/* <Button
                      variant="link"
                      className="p-0 h-auto text-xs font-bold ml-1"
                      style={{ color: curation?.Palette?.fontColor }}
                      onClick={toggleDescription}
                    >
                      {showFullDescription ? "Show less" : "Read more"}
                    </Button> */}
                  </p>
                </div>

                {/* <div>
                  <h3 className="text-label-sm font-dm-sans mb-1">
                    HOW THIS WORKS
                  </h3>
                  <ol className="text-body-sm font-lato space-y-2 list-decimal list-inside">
                    <li>
                      You pay ₹{curation.variants[0].variantPrice} to gift this
                      curated set of gifts
                    </li>
                    <li>
                      Your recipient is offered{" "}
                      {curation.variants[0]?.product_count}{" "}
                      {curation.variants[0]?.product_count === 1
                        ? "choice"
                        : "choices"}{" "}
                      to pick from
                    </li>
                    <li>
                      They do not see the price, but all are priced around ₹
                      {curation.variants[0].variantPrice} including shipping and
                      taxes
                    </li>
                    <li>
                      Once they pick one, they provide their address and we
                      deliver their chosen gift to them directly
                    </li>
                    <li>
                      If their gift cost less than ₹
                      {curation.variants[0].variantPrice}, we refund the
                      difference to you immediately after the delivery
                    </li>
                  </ol>
                </div> */}
              </div>

              {/* Actions */}
              <div className="text-tile-sans-sm font-dm-sans mt-4 flex flex-col">
                <motion.button
                  className="h-auto min-h-[48px] rounded-xl border-none bg-transparent p-2"
                  onClick={e => handleButtonClick(e, onViewGiftChoices)}
                  disabled={isFlipping}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  VIEW THE GIFT CHOICES
                </motion.button>
                <motion.button
                  className="h-auto min-h-[48px] rounded-xl p-2 font-bold whitespace-normal"
                  style={{
                    backgroundColor: curation?.Palette?.primaryColor,
                    color: curation?.Palette?.secondaryColor,
                  }}
                  onClick={e => handleButtonClick(e, onAddGift)}
                  disabled={isFlipping}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  ADD THIS GIFT TO YOUR GREETING
                </motion.button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
