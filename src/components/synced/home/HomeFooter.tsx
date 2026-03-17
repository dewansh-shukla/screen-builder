// AUTO-SYNCED from zapigowebclient — DO NOT EDIT DIRECTLY
// Source: /Users/dewanshshukla/Desktop/zapigo/zapigowebclient/src/components/home/HomeFooter.tsx
// Last synced: 2026-03-17T11:17:27.019Z
// API integrations stripped. Use props for data and callbacks.
import React from 'react';
import { GlobalFooter } from '@/components/GlobalFooter';

export function HomeFooter() {
  const seoText = `Plan your celebration with free digital birthday invitations from Zapigo. Choose from dozens of free birthday invite templates that are easy to personalize and perfect for sharing on WhatsApp. Whether it's a 1st birthday, 5th birthday, or a 30th birthday party, we've got you covered with beautifully designed, mobile-friendly e-invites for all ages. Pick from fun themes like superhero, princess, jungle, unicorn, sports, or construction—all available as free editable birthday invitations.

Every invite comes with a free RSVP tracker, free event website, and a free QR code invite to share with guests. No apps to install, no printing required—just click, customize, and send. Whether you're hosting in Bangalore, Mumbai, Delhi, or Hyderabad, Zapigo makes it easy to plan and manage your celebrations.`;

  return (
    <GlobalFooter
      backgroundColor="var(--color-bg-app)"
      textColor="dark"
      logoColor="#D5004B"
      maxWidth="6xl"
      className="px-8 pt-8 md:px-12"
      seoText={seoText}
      occasionsLinks={[
        { href: '/gather/kids-birthday', label: "Kid's Birthday" },
        { href: '/gather/adults-birthday', label: 'Adult Birthday' },
        { href: '/gather/party', label: 'Party' },
        { href: '/gather/housewarming', label: 'Housewarming' },
      ]}
      copyrightText="© Commerce56 Tech India Pvt. Ltd. All rights reserved."
    />
  );
}
