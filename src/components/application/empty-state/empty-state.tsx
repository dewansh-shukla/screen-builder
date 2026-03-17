'use client';

import React from 'react';
import { Button } from '@/components/base/buttons/button';
import Image from 'next/image';
// Figma-provided illustration asset
const ILLUSTRATION_SRC =
  'http://localhost:3845/assets/2208a30645d3221caa292fc6ed71eba2a09c2e18.svg';

type EmptyStateProps = {
  /** Figma variant: 'default' = one primary button, 'two-buttons' = secondary + primary */
  property1?: 'default' | 'two-buttons';

  /** Title text shown below the illustration */
  title?: string;
  /** Supporting description/subtext */
  description?: string;

  /** Controls visibility of title and description */
  showText?: boolean; // title
  showSubtext?: boolean; // description
  /** Controls visibility of the action buttons group */
  showButtons?: boolean;
  /** Controls visibility of the illustration */
  showIllustration?: boolean;

  /** Illustration props */
  imageSrc?: string;
  imageAlt?: string;

  /** CTA props */
  primaryCtaLabel?: string;
  onPrimaryClick?: () => void;
  secondaryCtaLabel?: string;
  onSecondaryClick?: () => void;

  className?: string;
};

export default function EmptyState({
  property1 = 'default',
  title = 'Access Restricted',
  description = '“Oops! You don’t have access to this page, or it has moved”.',
  showText = true,
  showSubtext = true,
  showButtons = true,
  showIllustration = true,
  imageSrc,
  imageAlt = 'Empty state illustration',
  primaryCtaLabel = 'Login',
  onPrimaryClick,
  secondaryCtaLabel = 'Back to Home',
  onSecondaryClick,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={[
        'flex w-full flex-col items-center justify-start gap-3',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* Illustration */}
      {showIllustration && (
        <div className="relative size-[180px]">
          <Image
            src={imageSrc || ILLUSTRATION_SRC}
            alt={imageAlt}
            width={180}
            height={180}
            className="h-full w-full"
          />
        </div>
      )}

      {/* Content */}
      <div className="flex flex-col items-center gap-2 text-center">
        {showText && (
          <h2 className="font-literata text-md leading-6 font-medium text-gray-900">
            {title}
          </h2>
        )}
        {showSubtext && (
          <p className="font-lexend max-w-[283px] text-sm leading-5 text-gray-500">
            {description}
          </p>
        )}
      </div>

      {/* Actions */}
      {showButtons && (
        <div className="mt-1.5 flex items-start gap-3">
          {property1 === 'two-buttons' && (
            <Button size="sm" color="secondary" onClick={onSecondaryClick}>
              {secondaryCtaLabel}
            </Button>
          )}
          <Button size="sm" color="primary" onClick={onPrimaryClick}>
            {primaryCtaLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
