// AUTO-SYNCED from zapigowebclient — DO NOT EDIT DIRECTLY
// Source: /Users/dewanshshukla/Desktop/zapigo/zapigowebclient/src/components/MenuDialog.tsx
// Last synced: 2026-03-17T11:17:27.006Z
// API integrations stripped. Use props for data and callbacks.
'use client';
/*
 * ============================================================
 * EXTRACTED PROPS (added by api-stripper)
 * Add these to the component's props interface:
 * ============================================================
 * // Auth function — pass as prop
 * logout?: (...args: any[]) => void | Promise<void>;
 * // User data from auth — pass as prop
 * userData?: { id: string; name: string; email: string; phone?: string } | null;
 * // Auth boolean state — pass as prop
 * isAuthenticated?: boolean;
 * ============================================================
 */


// [STRIPPED] import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { User01, InfoCircle } from '@untitledui/icons';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/base/accordion/accordion';
import WaveBorder from '@/components/WaveBorder/WaveBorder';
import { useLoginModal } from '@/contexts/LoginModalContext';

interface MenuDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  className?: string;
}

interface MenuItem {
  label: string;
  action?: () => void;
  href?: string;
}

export function MenuDialog({ open, onOpenChange, className }: MenuDialogProps) {
  // [STRIPPED] useAuth/useAuthStore — stubbed for screen-builder
  const isAuthenticated = false;
  const userData: { display_name?: string } | null = null;
  const logout = () => {};
  const router = useRouter();
  const { openLoginModal } = useLoginModal();
  const [isMobile, setIsMobile] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  // Detect if we're on mobile or desktop
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Mark as initialized after first render
    setIsInitialized(true);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleLogout = () => {
    logout();
    onOpenChange(false);
  };

  const handleNavigation = (path: string) => {
    router.push(path);
    onOpenChange(false);
  };

  const handleLoginClick = () => {
    // Close the menu dialog first
    onOpenChange(false);
    // Open login modal after a delay to ensure menu closes
    setTimeout(() => {
      openLoginModal();
    }, 200);
  };

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 24,
      },
    },
  };

  const menuItemVariants: Variants = {
    initial: { x: -10, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    hover: { x: 5, transition: { duration: 0.2 } },
    tap: { scale: 0.95 },
  };

  const waveVariants: Variants = {
    hidden: { opacity: 0, scaleX: 0 },
    visible: {
      opacity: 1,
      scaleX: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  // Don't render anything until initialized
  if (!isInitialized) {
    return null;
  }

  // If we're in the slide-in menu context (from Header), just render the menu items
  if (!open && isMobile) {
    return null;
  }

  const navigationItems = [
    {
      label: 'Invite Website',
      value: 'invite-website',
      hasDropdown: true,
      items: [
        { label: 'Kids Birthday', href: '/gather/kids-birthday' },
        { label: 'Party', href: '/gather/party' },
        // { label: 'Diwali', href: '/gather/diwali' },
      ],
    },
    // {
    //   label: 'Pop-Up Studios',
    //   value: 'pop-up-studios',
    //   hasDropdown: false,
    //   href: '/pop-up-studios',
    // },
    // {
    //   label: 'Activities',
    //   value: 'activities',
    //   hasDropdown: false,
    //   href: '/serve/activities',
    // }, 
    // {
    //   label: 'Rentals',
    //   value: 'rentals',
    //   hasDropdown: false,
    //   href: '/serve/rentals',
    // },
    // {
    //   label: 'Decorations',
    //   value: 'decorations',
    //   hasDropdown: false,
    //   href: '/serve/decorations',
    // },
    // {
    //   label: 'Mascots',
    //   value: 'mascots',
    //   hasDropdown: false,
    //   href: '/serve/mascots',
    // },
    // {
    //   label: 'foods',
    //   value: 'foods',
    //   hasDropdown: false,
    //   href: '/serve/foods',
    // },
    // {
    //   label: 'party Supplies',
    //   value: 'party-supplies',
    //   hasDropdown: false,
    //   href: '/serve/party-supplies',
    // },
    // {
    //   label: 'Party Store',
    //   value: 'party-store',
    //   hasDropdown: true,
    //   items: [
    //     { label: 'Party Supplies', href: '/collections/party-supplies' },
    //     { label: 'Balloons', href: '/collections/balloons' },
    //     { label: 'Tableware', href: '/collections/tableware' },
    //   ],
    // },
  ];

  const occasionItems = [
    {
      label: 'Kids Birthday',
      href: '/gather/kids-birthday',
    },
    {
      label: 'Party',
      href: '/gather/party',
    },
    {
      label: 'Cultural Gatherings',
      href: '/gather/cultural-gatherings',
    },
    // {
    //   label: 'Adult Birthday',
    //   href: '/gather/adults-birthday',
    // },
    // {
    //   label: 'House Warming',
    //   href: '/gather/housewarming',
    // },
    // {
    //   label: 'Party',
    //   href: '/gather/party',
    // },
  ];

  const infoItems = [
    {
      icon: <InfoCircle className="h-5 w-5" />,
      label: 'About Us',
      href: '/about',
    },
    {
      icon: <InfoCircle className="h-5 w-5" />,
      label: 'Contact us',
      href: '/contact',
    },
    {
      icon: <InfoCircle className="h-5 w-5" />,
      label: 'Blogs',
      href: '/blogs',
    },
    {
      icon: <InfoCircle className="h-5 w-5" />,
      label: 'Terms & Conditions',
      href: '/terms-policies',
    },
  ];

  const renderMenuItem = (item: MenuItem) => (
    <motion.div
      variants={menuItemVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      whileTap="tap"
      className="flex cursor-pointer items-center space-x-3 rounded-md px-2 py-2 hover:bg-gray-50"
      onClick={() => {
        if (item.action) {
          item.action();
        } else if (item.href) {
          handleNavigation(item.href);
        }
      }}
    >
      <span className="text-lexend text-base font-medium text-nowrap">
        {item.label}
      </span>
    </motion.div>
  );

  const handleAccordionChange = (value: string) => {
    setActiveSection(value === activeSection ? null : value);
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={cn('flex w-full max-w-[448px] flex-col space-y-2', className)}
    >
      {/* Navigation Items Section */}
      <motion.div variants={itemVariants}>
        <Accordion
          type="single"
          collapsible
          className="w-full"
          value={activeSection || undefined}
          onValueChange={handleAccordionChange}
        >
          {navigationItems.map((navItem) => (
            navItem.hasDropdown ? (
              <AccordionItem key={navItem.value} value={navItem.value} className="border-none">
                <AccordionTrigger
                  className="text-lexend text-rainforest-green mt-2 cursor-pointer rounded-md py-0 text-base font-semibold"
                  value={navItem.value}
                  isOpen={activeSection === navItem.value}
                  onToggle={handleAccordionChange}
                >
                  {navItem.label.toUpperCase()}
                </AccordionTrigger>
                <AccordionContent isOpen={activeSection === navItem.value}>
                  <AnimatePresence>
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex flex-col space-y-1 pl-2"
                    >
                      {navItem.items?.map((subItem, index) => (
                        <motion.div
                          key={subItem.label}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          {renderMenuItem(subItem)}
                        </motion.div>
                      ))}
                    </motion.div>
                  </AnimatePresence>
                </AccordionContent>
              </AccordionItem>
            ) : (
              <motion.div
                key={navItem.value}
                variants={menuItemVariants}
                initial="initial"
                animate="animate"
                whileHover="hover"
                whileTap="tap"
                className="mt-2 flex cursor-pointer items-center space-x-3 rounded-md px-2 py-2 hover:bg-gray-50"
                onClick={() => {
                  if (navItem.href) {
                    handleNavigation(navItem.href);
                  }
                }}
              >
                <span className="text-lexend text-rainforest-green text-base font-semibold text-nowrap">
                  {navItem.label.toUpperCase()}
                </span>
              </motion.div>
            )
          ))}
        </Accordion>
      </motion.div>

      <div className="w-full py-2">
        <motion.div
          variants={waveVariants}
          className="flex h-4 w-full justify-center"
        >
          <WaveBorder
            orientation="horizontal"
            height="100%"
            width={8}
            color="#000000"
            opacity={1}
            frequency={1}
            amplitude={6}
          />
        </motion.div>
      </div>

      <motion.div variants={itemVariants}>
        <Accordion
          type="single"
          collapsible
          className="w-full"
          value={activeSection || undefined}
          onValueChange={handleAccordionChange}
        >
          <AccordionItem value="occasions" className="border-none">
            <AccordionTrigger
              className="text-lexend text-rainforest-green mt-2 cursor-pointer rounded-md py-0 text-base font-semibold"
              value="occasions"
              isOpen={activeSection === 'occasions'}
              onToggle={handleAccordionChange}
            >
              OCCASIONS
            </AccordionTrigger>
            <AccordionContent isOpen={activeSection === 'occasions'}>
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex flex-col space-y-1 pl-2"
                >
                  {occasionItems.map((item, index) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {renderMenuItem(item)}
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </motion.div>

      <div className="w-full py-2">
        <motion.div
          variants={waveVariants}
          className="flex h-4 w-full justify-center"
        >
          <WaveBorder
            orientation="horizontal"
            height="100%"
            width={8}
            color="#000000"
            opacity={1}
            frequency={1}
            amplitude={6}
          />
        </motion.div>
      </div>

      <motion.div variants={itemVariants}>
        <Accordion
          type="single"
          collapsible
          className="w-full"
          value={activeSection || undefined}
          onValueChange={handleAccordionChange}
        >
          <AccordionItem value="drafts" className="border-none">
            <AccordionTrigger
              className="text-rainforest-green mt-2 rounded-md py-0 text-base font-semibold"
              value="drafts"
              isOpen={activeSection === 'drafts'}
              onToggle={handleAccordionChange}
            >
              DRAFTS
            </AccordionTrigger>
            <AccordionContent isOpen={activeSection === 'drafts'}>
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex flex-col space-y-1 pl-2"
                >
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-sm text-gray-500 italic"
                  >
                    No drafts available
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </motion.div>

      <div className="w-full py-2">
        <motion.div
          variants={waveVariants}
          className="flex h-4 w-full justify-center"
        >
          <WaveBorder
            orientation="horizontal"
            height="100%"
            width={8}
            color="#000000"
            opacity={1}
            frequency={1}
            amplitude={6}
          />
        </motion.div>
      </div>

      <motion.div variants={itemVariants}>
        <motion.div
          className="flex cursor-pointer items-center space-x-3 rounded-md px-2 py-2 hover:bg-gray-50"
          whileHover={{ x: 5 }}
          whileTap={{ scale: 0.95 }}
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();

            if (isAuthenticated) {
              handleNavigation('/me');
            } else {
              handleLoginClick();
            }
          }}
        >
          <User01 className="h-5 w-5" />
          <span className="text-lexend text-rainforest-green text-base font-medium text-nowrap">
            {isAuthenticated ? userData?.display_name || 'My Account' : 'Login'}
          </span>
        </motion.div>
      </motion.div>

      <div className="w-full py-2">
        <motion.div
          variants={waveVariants}
          className="flex h-4 w-full justify-center"
        >
          <WaveBorder
            orientation="horizontal"
            height="100%"
            width={8}
            color="#000000"
            opacity={1}
            frequency={1}
            amplitude={6}
          />
        </motion.div>
      </div>

      {isAuthenticated && (
        <motion.div
          variants={itemVariants}
          className="flex cursor-pointer items-center space-x-3 rounded-md px-2 py-2 hover:bg-gray-50"
          whileHover={{ x: 5 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleLogout()}
        >
          <span className="text-lexend text-sky-blue text-xl font-medium text-nowrap">
            LOG OUT
          </span>
        </motion.div>
      )}

      <motion.div variants={itemVariants} className="mt-2 pt-4">
        <div className="flex flex-col">
          {infoItems.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              {renderMenuItem(item)}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
