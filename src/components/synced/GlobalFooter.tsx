// AUTO-SYNCED from zapigowebclient — DO NOT EDIT DIRECTLY
// Source: /Users/dewanshshukla/Desktop/zapigo/zapigowebclient/src/components/GlobalFooter.tsx
// Last synced: 2026-03-17T11:17:26.995Z
// API integrations stripped. Use props for data and callbacks.
'use client';

import React from 'react';
import Link from 'next/link';
import ZapigoSVG from './ui/ZapigoSVG';
import VersionStrip from './VersionStrip';

interface GlobalFooterProps {
  className?: string;
  backgroundColor?: string;
  seoText?: string;
  textColor?: 'light' | 'dark';
  logoColor?: string;
  maxWidth?: string;
  showOccasions?: boolean;
  occasionsLinks?: Array<{ href: string; label: string }>;
  copyrightText?: string;
}

export const GlobalFooter: React.FC<GlobalFooterProps> = ({
  className = '',
  backgroundColor = 'transparent',
  seoText = '',
  textColor = 'light',
  logoColor,
  maxWidth = 'full',
  showOccasions = true,
  occasionsLinks,
  copyrightText,
}) => {
  const isDark = textColor === 'dark';
  const textColorClass = isDark ? 'text-gray-900' : 'text-white';
  const hoverColorClass = isDark ? 'hover:text-gray-700' : 'hover:text-gray-300';
  const logoColorValue = logoColor || (isDark ? '#D5004B' : 'white');
  const defaultCopyright = copyrightText || '© Commerce56 Tech India Pvt. Ltd. All rights reserved.';

  const defaultOccasionsLinks = occasionsLinks || [
    { href: '/gather/kids-birthday', label: "Kids' Birthday" },
    { href: '/gather/party', label: 'Parties' },
    { href: '/gather/cultural-gatherings', label: 'Cultural Gatherings' },
  ];

  // Mapping for common Tailwind max-width values
  const maxWidthClasses: Record<string, string> = {
    'full': '',
    'sm': 'max-w-sm',
    'md': 'max-w-md',
    'lg': 'max-w-lg',
    'xl': 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    '6xl': 'max-w-6xl',
    '7xl': 'max-w-7xl',
  };

  const maxWidthClass = maxWidthClasses[maxWidth] || '';
  const maxWidthStyle = maxWidth && maxWidth !== 'full' && !maxWidthClasses[maxWidth] 
    ? { maxWidth: maxWidth } 
    : undefined;

  return (
    <footer
      className={`w-full px-4 py-8 ${className} ${isDark ? 'border-t border-gray-200' : ''}`}
      style={{ backgroundColor: backgroundColor }}
    >
      <div className={`mx-auto w-full ${maxWidthClass} flex flex-col space-y-6`} style={maxWidthStyle}>
        {/* Top Section: Logo and SEO Text */}
        <div className="flex flex-col space-y-4">
          <ZapigoSVG color={logoColorValue} width={150} height={100} />
          {seoText && (
            <div className="flex flex-col gap-4">
              {seoText.split('\n\n').map((paragraph, index) => (
                <p key={index} className={`font-body text-md ${textColorClass} md:text-sm`}>
                  {paragraph}
                </p>
              ))}
            </div>
          )}
        </div>

        {/* Middle Section: Product and Occasions Links */}
        <div className="font-lexend grid grid-cols-1 md:grid-cols-2 gap-8 items-start content-start self-stretch">
          {/* Product Section */}
          <div className="flex flex-col space-y-2 items-start">
            <h3 className={`mb-2 text-sm font-semibold`} style={{ color: logoColorValue }}>
              Product
            </h3>
            <Link
              href="/about"
              className={`text-sm font-semibold ${textColorClass} transition-colors duration-200 ${hoverColorClass}`}
            >
              About Us
            </Link>
            <Link
              href="/contact"
              className={`text-sm font-semibold ${textColorClass} transition-colors duration-200 ${hoverColorClass}`}
            >
              Contact Us
            </Link>
            <Link
              href="/terms-policies"
              className={`text-sm font-semibold ${textColorClass} transition-colors duration-200 ${hoverColorClass}`}
            >
              Terms & Conditions
            </Link>
            <Link
              href="/blogs"
              className={`text-sm font-semibold ${textColorClass} transition-colors duration-200 ${hoverColorClass}`}
            >
              Blogs
            </Link>
          </div>

          {/* Occasions Section */}
          {showOccasions && (
            <div className="flex flex-col space-y-2 items-start">
              <h3 className={`mb-2 text-sm font-semibold`} style={{ color: logoColorValue }}>
                OCCASIONS
              </h3>
              {defaultOccasionsLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-semibold ${textColorClass} transition-colors duration-200 ${hoverColorClass}`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Section: Separator, Copyright and Version */}
        <div className="flex flex-col space-y-3 pt-4 border-t border-gray-300">
          <div className={`text-sm ${textColorClass}`}>
            {defaultCopyright}
          </div>
          <div className={`text-sm ${textColorClass}`}>
            <VersionStrip className={textColorClass} />
          </div>
        </div>
      </div>
    </footer>
  );
};
