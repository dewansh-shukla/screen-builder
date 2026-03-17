// AUTO-SYNCED from zapigowebclient — DO NOT EDIT DIRECTLY
// Source: /Users/dewanshshukla/Desktop/zapigo/zapigowebclient/src/components/Header.tsx
// Last synced: 2026-03-17T11:17:26.998Z
// API integrations stripped. Use props for data and callbacks.
// components/Header.tsx
'use client';
/*
 * ============================================================
 * EXTRACTED PROPS (added by api-stripper)
 * Add these to the component's props interface:
 * ============================================================
 * // Auth boolean state — pass as prop
 * isAuthenticated?: boolean;
 * // User data from auth — pass as prop
 * userData?: { id: string; name: string; email: string; phone?: string } | null;
 * ============================================================
 */


import { useRouter, usePathname } from 'next/navigation';
import { useSessionStore } from '@/store/useSessionStore';
import { useState, useEffect } from 'react';
import { MenuDialog } from './MenuDialog';
// [STRIPPED] import { useAuth } from '@/hooks/useAuth';
import { ChevronLeft, Menu01, X, ChevronDown, User01 } from '@untitledui/icons';
import { cn } from '@/lib/utils';
import ZapigoSVG from './ui/ZapigoSVG';
import { HeaderVariantType } from '@/constants/headerVariants';
import { useLoginModal } from '@/contexts/LoginModalContext';
import Link from 'next/link';

// Navigation Item Component
// interface NavItemProps {
//   label: string;
//   hasDropdown?: boolean;
//   href?: string;
//   onClick?: () => void;
// }

// function NavItem({ label, hasDropdown = false, href, onClick }: NavItemProps) {
//   const handleClick = (e: React.MouseEvent) => {
//     if (onClick) {
//       e.preventDefault();
//       onClick();
//     }
//   };

//   const content = (
//     <div className="font-lexend flex items-center justify-center gap-0.5 rounded-lg px-1.5 py-1 text-base font-semibold text-secondary transition-colors hover:bg-secondary">
//       <div className="flex items-center justify-center px-0.5">
//         <span className="whitespace-nowrap">{label}</span>
//       </div>
//       {hasDropdown && (
//         <ChevronDown className="h-4 w-4 text-quaternary" strokeWidth={2} />
//       )}
//     </div>
//   );

//   if (href) {
//     return (
//       <a href={href} onClick={handleClick} className="shrink-0">
//         {content}
//       </a>
//     );
//   }

//   return (
//     <button onClick={handleClick} className="shrink-0">
//       {content}
//     </button>
//   );
// }

// Define header variants
export enum HeaderVariant {
  CENTERED_LOGO = 'CENTERED_LOGO',
  LEFT_LOGO = 'LEFT_LOGO',
  BACK_BUTTON = 'BACK_BUTTON',
}

export function Header({
  showBackButtonOnly = false,
  customBackHandler,
  variant = HeaderVariant.CENTERED_LOGO,
  maxDesktopWidth = '448px',
  rightElements,
  logoColor,
}: {
  showBackButtonOnly?: boolean;
  headerText?: string;
  customBackHandler?: () => void;
  variant?: HeaderVariant | HeaderVariantType;
  backgroundColor?: string;
  enableScrollBackground?: boolean;
  scrollThreshold?: number;
  maxDesktopWidth?: string;
  hardCodedColorLogo?: string;
  logoColor?: string;
  rightElements?: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const isScanPath = pathname === '/scan';
  const { openLoginModal } = useLoginModal();
  // [STRIPPED] useAuth/useAuthStore — stubbed for screen-builder
  const isAuthenticated = false;
  const userData: { display_name?: string } | null = null;
  const homeUrl = useSessionStore(state => state.homeUrl);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(true);
  // const [isScrolled, setIsScrolled] = useState(false);
  const [isInitialRender, setIsInitialRender] = useState(true);
  const [inviteDropdownOpen, setInviteDropdownOpen] = useState(false);

  const defaultLogoColor = '#EA1D63';
  const effectiveLogoColor = logoColor || defaultLogoColor;

  // Helper function to get initials from display name
  const getInitials = (name: string | null | undefined): string => {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    }
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  // Close menu when pathname changes (page navigation)
  useEffect(() => {
    setMenuOpen(false);
    setInviteDropdownOpen(false);
  }, [pathname]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setInviteDropdownOpen(false);
    };

    if (inviteDropdownOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [inviteDropdownOpen]);

  // Set initial render to false after first render
  useEffect(() => {
    setIsInitialRender(false);
  }, []);

  // Detect if we're on mobile or desktop
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle scroll functionality - COMMENTED OUT
  /*
  useEffect(() => {
    if (!enableScrollBackground) return;

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > scrollThreshold);
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);

    // Check initial scroll position
    handleScroll();

    // Cleanup
    return () => window.removeEventListener('scroll', handleScroll);
  }, [enableScrollBackground, scrollThreshold]);
  */

  // Determine the background class based on scroll state - MODIFIED TO ALWAYS USE TRANSPARENT BACKGROUND
  const getBackgroundClass = () => {
    // Original code:
    /*
    if (!enableScrollBackground) {
      return backgroundColor;
    }

    return isScrolled ? backgroundColor : 'bg-transparent';
    */

    // Always return transparent background, ignoring the backgroundColor prop
    return 'bg-transparent';
  };

  const handleBackClick = () => {
    // Use custom back handler if provided
    if (customBackHandler) {
      customBackHandler();
      return;
    }

    // Default back behavior
    if (isScanPath) {
      // If we're on the scan page, navigate to home
      router.push('/');
    } else if (pathname.includes('create') && homeUrl) {
      router.push(homeUrl || '/');
    } else {
      router.back();
    }
  };

  const handleProfileClick = () => {
    if (isAuthenticated) {
      router.push('/me');
    } else {
      openLoginModal();
    }
  };

  const handleLogoClick = () => {
    router.push('/');
  };

  // Calculate header height style to include safe area on mobile
  const headerStyle = {
    paddingTop: isMobile ? 'env(safe-area-inset-top, 0px)' : '0px',
    position: 'fixed' as const,
    width: '100%',
    maxWidth: isMobile ? '100%' : maxDesktopWidth,
    minWidth: isMobile ? '100%' : '320px', // Minimum width to prevent overflow
    left: '50%',
    transform: 'translateX(-50%)',
    top: 0,
    transition: 'none', // Prevent transition during navigation
    zIndex: 50,
  };

  // Add padding for desktop view, especially for 1440px width
  const getHeaderContentClass = () => {
    if (!isMobile && maxDesktopWidth === '1440px') {
      return 'px-4';
    }
    return 'px-1 md:px-6';
  };

  // Get responsive logo size based on screen width
  const getLogoSize = () => {
    if (isMobile) return { width: 120, height: 30 };

    // For smaller desktop screens, use smaller logo
    if (maxDesktopWidth === '448px') {
      return { width: 100, height: 25 };
    }

    return { width: 150, height: 50 };
  };

  const logoSize = getLogoSize();

  // If showBackButtonOnly is true, render the back button variant (Variant 3)
  if (showBackButtonOnly) {
    return (
      <>
        <header
          className={`z-50 ${getBackgroundClass()} w-full`}
          style={headerStyle}
        >
          <div
            className={`flex h-16 items-center justify-between ${getHeaderContentClass()} relative`}
          >
            {/* Left: Back Button */}
            <div
              className="text-title-sans-lg font-lexend z-10 flex cursor-pointer items-center justify-center"
              onClick={handleBackClick}
            >
              <ChevronLeft className="mr-1 h-6 w-6 text-primary" />
              <span className="text-primary">{isScanPath ? 'HOME' : 'BACK'}</span>
            </div>
            {/* Center: Logo (absolutely centered) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <ZapigoSVG
                color={effectiveLogoColor}
                width={logoSize.width}
                height={logoSize.height}
                className="w-full cursor-pointer"
                onClick={handleLogoClick}
              />
            </div>
            {/* Right: Menu Icon */}
            <div
              className="z-10 cursor-pointer !text-primary"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu01 className="h-6 w-6" />
              )}
            </div>
          </div>
        </header>

        {/* Menu Overlay */}
        {!isInitialRender && (
          <div
            className={cn(
              'fixed inset-0 z-50 bg-black/50 transition-opacity duration-300',
              menuOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
            )}
            onClick={() => setMenuOpen(false)}
          />
        )}

        {/* Slide-in Menu Panel */}
        {!isInitialRender && (
          <div
            className={cn(
              'fixed z-50 h-[calc(100vh-4rem)] overflow-y-auto bg-primary transition-all duration-300 ease-in-out',
              isMobile ? 'left-0 w-[80%] max-w-[300px]' : 'right-0 w-[300px]',
              menuOpen
                ? 'translate-x-0'
                : isMobile
                  ? '-translate-x-full'
                  : 'translate-x-full',
            )}
            style={
              isMobile
                ? {
                  top: `calc(4rem + env(safe-area-inset-top, 0px))`,
                  height: `calc(100vh - 4rem - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px))`,
                }
                : {
                  top: '4rem',
                  height: 'calc(100vh - 4rem)',
                }
            }
          >
            <div className="flex h-full flex-col p-4">
              <MenuDialog
                open={menuOpen}
                onOpenChange={setMenuOpen}
                className="border-none p-0 shadow-none"
              />
            </div>
          </div>
        )}
      </>
    );
  }

  // Render the appropriate variant based on the variant prop
  return (
    <>
      <header
        className={`z-50 ${getBackgroundClass()} w-full`}
        style={headerStyle}
      >
        <div
          className={cn(
            'flex items-center',
            variant === HeaderVariant.LEFT_LOGO && !isMobile ? '' : 'h-16',
            variant === HeaderVariant.LEFT_LOGO && !isMobile ? '' : getHeaderContentClass(),
            variant === HeaderVariant.CENTERED_LOGO ? 'justify-between' : '',
          )}
        >
          {/* Variant 1: CENTERED_LOGO */}
          {variant === HeaderVariant.CENTERED_LOGO && (
            <>
              {/* Mobile: Profile left, logo center, hamburger right */}
              {isMobile ? (
                <>
                  {/* Left: Profile or Login */}
                  <div className="cursor-pointer" onClick={handleProfileClick}>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-tertiary">
                      {isAuthenticated ? (
                        <span className="text-sm font-dm-sans font-semibold text-secondary">
                          {getInitials(userData?.display_name)}
                        </span>
                      ) : (
                        <User01 className="h-5 w-5 text-secondary" />
                      )}
                    </div>
                  </div>

                  {/* Center: Logo */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <ZapigoSVG
                      color={effectiveLogoColor}
                      width={logoSize.width}
                      height={logoSize.height}
                      className="cursor-pointer"
                      onClick={handleLogoClick}
                    />
                  </div>

                  {/* Right: Hamburger menu */}
                  <div
                    className="cursor-pointer !text-primary"
                    onClick={() => setMenuOpen(!menuOpen)}
                  >
                    {menuOpen ? (
                      <X className="h-6 w-6" />
                    ) : (
                      <Menu01 className="h-6 w-6" />
                    )}
                  </div>
                </>
              ) : (
                <>
                  {/* Desktop: Profile left, logo center, hamburger right */}
                  {/* Left: Profile */}
                  <div className="cursor-pointer" onClick={handleProfileClick}>
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-tertiary">
                        {isAuthenticated ? (
                          <span className="text-xs font-dm-sans font-semibold text-secondary">
                            {getInitials(userData?.display_name)}
                          </span>
                        ) : (
                          <User01 className="h-4 w-4 text-secondary" />
                        )}
                      </div>
                      <span className="text-headline-sm font-dm-sans text-primary">
                        {isAuthenticated ? (userData?.display_name || 'User') : 'Login'}
                      </span>
                    </div>
                  </div>

                  {/* Center: Logo */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <ZapigoSVG
                      color={effectiveLogoColor}
                      width={logoSize.width}
                      height={logoSize.height}
                      className="cursor-pointer"
                      onClick={handleLogoClick}
                    />
                  </div>

                  {/* Right: Hamburger */}
                  <div
                    className="cursor-pointer text-primary"
                    onClick={() => setMenuOpen(!menuOpen)}
                  >
                    {menuOpen ? (
                      <X className="h-6 w-6" />
                    ) : (
                      <Menu01 className="h-6 w-6" />
                    )}
                  </div>
                </>
              )}
            </>
          )}

          {/* Variant 2: LEFT_LOGO - Logo left, navigation center, login right */}
          {variant === HeaderVariant.LEFT_LOGO && (
            <>
              {/* Mobile view */}
              {isMobile ? (
                <div className="flex w-full items-center justify-between">
                  {/* Left: Logo */}
                  <div>
                    <ZapigoSVG
                      color={effectiveLogoColor}
                      width={logoSize.width}
                      height={logoSize.height}
                      className="cursor-pointer"
                      onClick={handleLogoClick}
                    />
                  </div>

                  {/* Right: Profile icon or Login + Hamburger menu */}
                  <div className="flex items-center gap-3">
                    <div
                      onClick={isAuthenticated ? () => router.push('/me') : () => openLoginModal()}
                      className="cursor-pointer"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-tertiary">
                        {isAuthenticated ? (
                          <span className="text-sm font-dm-sans font-semibold text-secondary">
                            {getInitials(userData?.display_name)}
                          </span>
                        ) : (
                          <User01 className="h-5 w-5 text-secondary" />
                        )}
                      </div>
                    </div>

                    {/* Hamburger menu */}
                    <div
                      className="cursor-pointer text-primary"
                      onClick={() => setMenuOpen(!menuOpen)}
                    >
                      {menuOpen ? (
                        <X className="h-6 w-6" />
                      ) : (
                        <Menu01 className="h-6 w-6" />
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                /* Desktop view - Full navigation */
                <div className="flex h-20 w-full items-center justify-between gap-4 px-8 py-3">
                  {/* Navigation Actions (Login button or Profile icon on right) */}
                  <div className="order-3 flex shrink-0 items-center gap-3">
                    <div
                      onClick={isAuthenticated ? () => router.push('/me') : () => openLoginModal()}
                      className="flex items-center gap-2 cursor-pointer transition-colors hover:opacity-80"
                      title={isAuthenticated ? "Go to Profile" : "Login"}
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-tertiary transition-colors hover:bg-secondary_hover">
                        {isAuthenticated ? (
                          <span className="text-sm font-dm-sans font-semibold text-secondary">
                            {getInitials(userData?.display_name)}
                          </span>
                        ) : (
                          <User01 className="h-5 w-5 text-secondary" />
                        )}
                      </div>
                      <span className="font-lexend text-base font-semibold text-secondary">
                        {isAuthenticated ? (userData?.display_name || 'User') : 'Login'}
                      </span>
                    </div>
                  </div>

                  {/* Content (Logo + Navigation) */}
                  <div className="order-1 flex min-w-0 flex-1 items-center gap-5">
                    {/* Logo */}
                    <div className="shrink-0">
                      <ZapigoSVG
                        color={effectiveLogoColor}
                        width={126}
                        height={26}
                        className="cursor-pointer"
                        onClick={handleLogoClick}
                      />
                    </div>

                    {/* Navigation */}
                    <nav className="flex items-center gap-0.5">
                      {/* Invite Website Dropdown */}
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setInviteDropdownOpen(!inviteDropdownOpen);
                          }}
                          className="font-lexend flex items-center justify-center gap-0.5 rounded-lg px-1.5 py-1 text-base font-semibold text-secondary transition-colors hover:bg-secondary"
                        >
                          <div className="flex items-center justify-center px-0.5">
                            <span className="whitespace-nowrap">Invite Website</span>
                          </div>
                          <ChevronDown className="h-4 w-4 text-quaternary" strokeWidth={2} />
                        </button>

                        {/* Dropdown Menu */}
                        {inviteDropdownOpen && (
                          <div className="absolute left-0 top-full mt-1 w-48 rounded-lg border border-secondary bg-primary shadow-lg">
                            <div className="py-1">
                              <Link
                                href="/gather/kids-birthday"
                                className="font-lexend block px-4 py-2 text-sm font-medium text-secondary transition-colors hover:bg-secondary"
                              >
                                Kids Birthday
                              </Link>
                              <Link
                                href="/gather/party"
                                className="font-lexend block px-4 py-2 text-sm font-medium text-secondary transition-colors hover:bg-secondary"
                              >
                                Party
                              </Link>
                              {/* <Link
                                href="/gather/diwali"
                                className="font-lexend block px-4 py-2 text-sm font-medium text-secondary transition-colors hover:bg-secondary"
                              >
                                Diwali
                              </Link> */}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Decorations - Direct Link */}
                      {/* <NavItem label="Decorations" href="/serve/decorations" /> */}

                      {/* Rentals - Direct Link */}
                      {/* <NavItem label="Rentals" href="/serve/rentals" /> */}

                      {/* Party Store - Commented Out */}
                      {/* <NavItem label="Party Store" hasDropdown /> */}

                      {/* Activities - Direct Link */}
                      {/* <NavItem label="Activities" href="/serve/activities" /> */}
                    </nav>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Variant 3: BACK_BUTTON - Back button left, title center */}
          {variant === HeaderVariant.BACK_BUTTON && (
            <>
              <div
                className={`flex h-16 w-full items-center justify-between ${getHeaderContentClass()} relative`}
              >
                {/* Left: Back Button */}
                <div
                  className="text-title-sans-lg font-lexend z-10 flex cursor-pointer items-center justify-center text-primary"
                  onClick={handleBackClick}
                >
                  <ChevronLeft className="mr-1 h-6 w-6" />
                  <span className="">{isScanPath ? 'HOME' : 'BACK'}</span>
                </div>
                {/* Center: Logo (absolutely centered) */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <ZapigoSVG
                    color={effectiveLogoColor}
                    width={logoSize.width}
                    height={logoSize.height}
                    className="w-full cursor-pointer"
                    onClick={handleLogoClick}
                  />
                </div>
                {/* Right Area (Extra Elements + Menu Icon) */}
                <div className="z-10 flex items-center gap-2">
                  {rightElements}
                  <div
                    className="cursor-pointer text-primary"
                    onClick={() => setMenuOpen(!menuOpen)}
                  >
                    {menuOpen ? (
                      <X className="h-6 w-6" />
                    ) : (
                      <Menu01 className="h-6 w-6" />
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </header>

      {/* Menu Overlay */}
      {!isInitialRender && (
        <div
          className={cn(
            'fixed inset-0 z-50 bg-black/50 transition-opacity duration-300',
            menuOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
          )}
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Slide-in Menu Panel */}
      {!isInitialRender && (
        <div
          className={cn(
            'fixed z-50 h-[calc(100vh-4rem)] overflow-y-auto bg-primary transition-all duration-300 ease-in-out',
            isMobile ? 'left-0 w-[80%] max-w-[300px]' : 'right-0 w-[300px]',
            menuOpen
              ? 'translate-x-0'
              : isMobile
                ? '-translate-x-full'
                : 'translate-x-full',
          )}
          style={
            isMobile
              ? {
                top: `calc(4rem + env(safe-area-inset-top, 0px))`,
                height: `calc(100vh - 4rem - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px))`,
              }
              : {
                top: '4rem',
                height: 'calc(100vh - 4rem)',
              }
          }
        >
          <div className="flex h-full flex-col p-4">
            <MenuDialog
              open={menuOpen}
              onOpenChange={setMenuOpen}
              className="border-none p-0 shadow-none"
            />
          </div>
        </div>
      )}
    </>
  );
}
