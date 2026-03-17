// AUTO-SYNCED from zapigowebclient — DO NOT EDIT DIRECTLY
// Source: /Users/dewanshshukla/Desktop/zapigo/zapigowebclient/src/components/PageWrapper.tsx
// Last synced: 2026-03-17T11:05:34.420Z
// API integrations stripped. Use props for data and callbacks.
'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Header, HeaderVariant } from './Header';
import { Footer } from './Footer';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { HEADER_VARIANTS, HeaderVariantType } from '@/constants/headerVariants';

interface BackgroundImageConfig {
  url: string;
  size?: string;
  position?: string;
  repeat?: string;
  attachment?: string;
  opacity?: number;
}

interface PageWrapperProps {
  children: React.ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
  headerProps?: {
    showBackButtonOnly?: boolean;
    headerText?: string;
    customBackHandler?: () => void;
    variant?: HeaderVariant | HeaderVariantType;
    backgroundColor?: string;
    enableScrollBackground?: boolean;
    scrollThreshold?: number;
    logoColor?: string;
    rightElements?: React.ReactNode;
  };
  maxDesktopWidth?: string;
  footerProps?: {
    onAction?: () => void;
    buttonText?: string;
    showLeftButton?: boolean;
    showRightButton?: boolean;
    showCenterButton?: boolean;
    bgColor?: string;
    showFilter?: boolean;
    showBottomNav?: boolean;
    disabled?: boolean;
    onFilterChange?: (filters: {
      budget: string;
      age: string;
      gender: string;
    }) => void;
  };
  backgroundColor?: string;
  backgroundImage?: string | BackgroundImageConfig;
  footerBackgroundColor?: string;
}

export function PageWrapper({
  children,
  showHeader = true,
  showFooter = true,
  headerProps = {},
  footerProps,
  maxDesktopWidth = '448px',
  backgroundColor,
  backgroundImage,
}: PageWrapperProps) {
  const isMobile = useIsMobile();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  // const [showGradient, setShowGradient] = useState(false);

  // Create a key for the current page

  // Set initial load to false after component mounts
  useEffect(() => {
    if (isInitialLoad) {
      const timer = setTimeout(() => {
        setIsInitialLoad(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isInitialLoad]);

  // Handle scroll to show/hide gradient
  // useEffect(() => {
  //   const scrollContainer = scrollContainerRef.current;
  //   if (!scrollContainer) return;

  //   const handleScroll = () => {
  //     const scrollTop = scrollContainer.scrollTop;
  //     setShowGradient(scrollTop > 10); // Show gradient after 10px of scroll
  //   };

  //   scrollContainer.addEventListener('scroll', handleScroll);
  //   return () => scrollContainer.removeEventListener('scroll', handleScroll);
  // }, []);

  // Set default header props
  const defaultHeaderProps = {
    showBackButtonOnly: false,
    headerText: undefined,
    customBackHandler: undefined,
    variant: HEADER_VARIANTS.CENTERED_LOGO || HeaderVariant.CENTERED_LOGO,
    backgroundColor: 'bg-white',
    enableScrollBackground: false,
    scrollThreshold: 300,
    maxDesktopWidth: maxDesktopWidth,
  };

  // Merge default header props with provided header props
  const mergedHeaderProps = { ...defaultHeaderProps, ...headerProps };

  // If showBackButtonOnly is true, override the variant
  if (mergedHeaderProps.showBackButtonOnly) {
    mergedHeaderProps.variant = HeaderVariant.BACK_BUTTON;
  }

  // Prepare background styles
  const backgroundStyles: React.CSSProperties = {
    ...(backgroundColor && { backgroundColor: 'var(--color-bg-app)' }),
  };

  // Handle background image configuration
  if (backgroundImage) {
    if (typeof backgroundImage === 'string') {
      // Simple string URL
      backgroundStyles.backgroundImage = `url(${backgroundImage})`;
      backgroundStyles.backgroundSize = 'cover';
      backgroundStyles.backgroundPosition = 'top';
      backgroundStyles.backgroundRepeat = 'no-repeat';
      backgroundStyles.backgroundAttachment = 'fixed';
    } else {
      // Advanced configuration object
      backgroundStyles.backgroundImage = `url(${backgroundImage.url})`;
      backgroundStyles.backgroundSize = backgroundImage.size || 'cover';
      backgroundStyles.backgroundPosition =
        backgroundImage.position || 'center';

      if (backgroundImage.repeat) {
        backgroundStyles.backgroundRepeat = backgroundImage.repeat;
      }

      if (backgroundImage.attachment) {
        backgroundStyles.backgroundAttachment = backgroundImage.attachment;
      }

      if (backgroundImage.opacity !== undefined) {
        // For opacity, we need to create a pseudo-element or use a different approach
        // Here we'll adjust the backgroundColor opacity if both are provided
        if (backgroundColor && backgroundImage.opacity < 1) {
          // Convert hex to rgba if needed
          if (backgroundColor.startsWith('#')) {
            const r = parseInt(backgroundColor.slice(1, 3), 16);
            const g = parseInt(backgroundColor.slice(3, 5), 16);
            const b = parseInt(backgroundColor.slice(5, 7), 16);
            backgroundStyles.backgroundColor = `rgba(${r}, ${g}, ${b}, ${backgroundImage.opacity})`;
          } else if (backgroundColor.startsWith('rgb(')) {
            // Convert rgb to rgba
            backgroundStyles.backgroundColor = backgroundColor
              .replace('rgb(', 'rgba(')
              .replace(')', `, ${backgroundImage.opacity})`);
          }
        }
      }
    }
  }

  // Inline style to force rounded corners
  const roundedCornersStyle = {
    borderTopLeftRadius: '2rem',
    borderTopRightRadius: '2rem',
    overflow: 'hidden',
    backgroundColor: 'white', // Ensure white background for rounded corners
  };

  // Calculate header height with safe area
  const headerHeight = isMobile
    ? 'calc(4rem + env(safe-area-inset-top, 0px))'
    : '4rem'; // 4rem = 64px which is equivalent to h-16

  // Determine padding classes based on desktop width
  const getContentPaddingClass = () => {
    if (maxDesktopWidth === '1440px' && !isMobile) {
      return '';
    }
    return maxDesktopWidth === '448px' || isMobile
      ? 'p-0 px-0 pb-0 pt-0'
      : 'p-8 px-16 pb-0 pt-2';
  };

  return (
    <div
      className="bg-opacity-100 bg-bg-app fixed inset-0 flex w-full overflow-hidden"
      style={backgroundStyles}
    >
      {/* Pattern overlay with opacity */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          height: '80vh',
          width: '100%',
          backgroundImage: `url(/assets/images/backgrounds/background-pattern.svg)`, // Fixed pattern overlay
          backgroundSize: 'contain',
          backgroundPosition: 'top',
          backgroundRepeat: 'repeat',
          opacity: 1,
          zIndex: 0,
        }}
      />

      <div
        className="relative z-10 flex h-full w-full flex-col"
        style={{
          maxWidth: isMobile ? '100%' : maxDesktopWidth,
          minWidth: isMobile ? '100%' : '320px', // Minimum width to prevent overflow
          width: '100%',
          margin: '0 auto',
        }}
      >
        {showHeader && (
          <Header
            showBackButtonOnly={mergedHeaderProps.showBackButtonOnly}
            headerText={mergedHeaderProps.headerText}
            customBackHandler={mergedHeaderProps.customBackHandler}
            variant={mergedHeaderProps.variant}
            backgroundColor={mergedHeaderProps.backgroundColor}
            enableScrollBackground={mergedHeaderProps.enableScrollBackground}
            scrollThreshold={mergedHeaderProps.scrollThreshold}
            maxDesktopWidth={maxDesktopWidth}
            logoColor={mergedHeaderProps.logoColor}
            rightElements={mergedHeaderProps.rightElements}
          />
        )}
        <div
          id="page-scroll-container"
          ref={scrollContainerRef}
          className={`scrollbar-hide flex-1 ${getContentPaddingClass()}`}
          style={{
            ...roundedCornersStyle,
            marginTop: showHeader ? headerHeight : 0,
            overflowY: 'auto',
            overflowX: 'hidden',
            position: 'relative',
            zIndex: 1,
            width: '100%',
          }}
          data-scroll-container
        >
          <motion.main
            className="relative w-full"
            style={{
              width: '100%',
              minHeight: 'min-content',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {children}
          </motion.main>

          {showFooter && (
            <div className="w-full">
              <Footer {...footerProps} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
