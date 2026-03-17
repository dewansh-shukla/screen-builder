// AUTO-SYNCED from zapigowebclient — DO NOT EDIT DIRECTLY
// Source: /Users/dewanshshukla/Desktop/zapigo/zapigowebclient/src/components/home/HostingJoyfulSection.tsx
// Last synced: 2026-03-17T11:17:27.019Z
// API integrations stripped. Use props for data and callbacks.
import React from 'react';
import { Button } from '@/components/base/buttons/button';
import { FeatureItem } from './FeatureItem';

export function HostingJoyfulSection() {
  return (
    <section className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-2">
      <div className="flex flex-col gap-6">
        <h2 className="font-display text-4xl font-bold text-gray-900 md:text-5xl">
          Hosting should feel joyful, not stressful
        </h2>
        <div className="flex flex-col gap-4">
          <p className="font-body text-base text-gray-700 md:text-lg">
            It usually starts with getting the invite design right. Then come WhatsApp replies, keeping track of the guest list in a spreadsheet, and everything else.
          </p>
          <p className="font-body text-base text-gray-700 md:text-lg">
            Zapigo brings it all into seamless experience to make hosting simple.
          </p>
        </div>
        <div className="mt-4">
          <Button
            href="/gather/kids-birthday"
            size="lg"
            color="primary"
            className="shadow-md"
          >
            Set up your gathering
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-6">
        <FeatureItem
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M9 18.5H15M7 15H17M5 2H19C20.1046 2 21 2.99492 21 4.22222V19.7778C21 21.0051 20.1046 22 19 22H5C3.89543 22 3 21.0051 3 19.7778V4.22222C3 2.99492 3.89543 2 5 2ZM11.9976 6.21194C11.2978 5.4328 10.1309 5.22321 9.25414 5.93667C8.37738 6.65013 8.25394 7.84299 8.94247 8.6868C9.631 9.53061 11.9976 11.5 11.9976 11.5C11.9976 11.5 14.3642 9.53061 15.0527 8.6868C15.7413 7.84299 15.6329 6.64262 14.7411 5.93667C13.8492 5.23072 12.6974 5.4328 11.9976 6.21194Z" stroke="#414651" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          }
          title="Free Invite"
          shortDescription="Create beautiful invites in minutes"
          longDescription="Choose from 100s of ready designs or upload your own. Add notes, directions, dress codes, and more - all in one place."
        />
        <FeatureItem
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M22 21V19C22 17.1362 20.7252 15.5701 19 15.126M15.5 3.29076C16.9659 3.88415 18 5.32131 18 7C18 8.67869 16.9659 10.1159 15.5 10.7092M17 21C17 19.1362 17 18.2044 16.6955 17.4693C16.2895 16.4892 15.5108 15.7105 14.5307 15.3045C13.7956 15 12.8638 15 11 15H8C6.13623 15 5.20435 15 4.46927 15.3045C3.48915 15.7105 2.71046 16.4892 2.30448 17.4693C2 18.2044 2 19.1362 2 21M13.5 7C13.5 9.20914 11.7091 11 9.5 11C7.29086 11 5.5 9.20914 5.5 7C5.5 4.79086 7.29086 3 9.5 3C11.7091 3 13.5 4.79086 13.5 7Z" stroke="#414651" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          }
          title="Guest Management"
          shortDescription="Know who's coming - without chasing anyone"
          longDescription="Get quick guest counts and preferences, add guests manually - no spreadsheet needed. Then there's Zapi, of course"
        />
        <FeatureItem
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M20 12.5V6.8C20 5.11984 20 4.27976 19.673 3.63803C19.3854 3.07354 18.9265 2.6146 18.362 2.32698C17.7202 2 16.8802 2 15.2 2H8.8C7.11984 2 6.27976 2 5.63803 2.32698C5.07354 2.6146 4.6146 3.07354 4.32698 3.63803C4 4.27976 4 5.11984 4 6.8V17.2C4 18.8802 4 19.7202 4.32698 20.362C4.6146 20.9265 5.07354 21.3854 5.63803 21.673C6.27976 22 7.11984 22 8.8 22H12M14 11H8M10 15H8M16 7H8M14.5 19L16.5 21L21 16.5" stroke="#414651" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          }
          title="Smart Checklist"
          shortDescription="A clear checklist for every kind of gathering"
          longDescription="Get a ready-to-use checklist based on your event - so you don't forget the little things that matter."
        />
        <FeatureItem
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M6 20.088H8.61029C8.95063 20.088 9.28888 20.1285 9.61881 20.2095L12.3769 20.8798C12.9753 21.0255 13.5988 21.0397 14.2035 20.9223L17.253 20.329C18.0585 20.1721 18.7996 19.7863 19.3803 19.2214L21.5379 17.1226C22.154 16.5242 22.154 15.5533 21.5379 14.9539C20.9832 14.4143 20.1047 14.3536 19.4771 14.8112L16.9626 16.6457C16.6025 16.909 16.1643 17.0507 15.7137 17.0507H13.2855L14.8311 17.0506C15.7022 17.0506 16.4079 16.3642 16.4079 15.5168V15.21C16.4079 14.5064 15.9156 13.8928 15.2141 13.7227L12.8286 13.1426C12.4404 13.0485 12.0428 13.0009 11.6431 13.0009C10.6783 13.0009 8.93189 13.7997 8.93189 13.7997L6 15.0258M2 14.6009L2 20.4009C2 20.9609 2 21.2409 2.10899 21.4549C2.20487 21.643 2.35785 21.796 2.54601 21.8919C2.75992 22.0009 3.03995 22.0009 3.6 22.0009H4.4C4.96005 22.0009 5.24008 22.0009 5.45399 21.8919C5.64215 21.796 5.79513 21.643 5.89101 21.4549C6 21.2409 6 20.9609 6 20.4009V14.6009C6 14.0408 6 13.7608 5.89101 13.5469C5.79513 13.3587 5.64215 13.2057 5.45399 13.1099C5.24008 13.0009 4.96005 13.0009 4.4 13.0009H3.6C3.03995 13.0009 2.75992 13.0009 2.54601 13.1099C2.35785 13.2057 2.20487 13.3587 2.10899 13.5469C2 13.7608 2 14.0408 2 14.6009ZM17.1914 3.59313C16.5946 2.34427 15.2186 1.68266 13.8804 2.32124C12.5423 2.95983 11.9722 4.47425 12.5325 5.8037C12.8787 6.62533 13.8707 8.22087 14.5781 9.3199C14.8394 9.72598 14.9701 9.92902 15.161 10.0478C15.3247 10.1497 15.5297 10.2046 15.7224 10.1982C15.9471 10.1908 16.1618 10.0803 16.5911 9.8593C17.7532 9.26118 19.4101 8.37542 20.1208 7.837C21.2707 6.96579 21.5556 5.36445 20.6947 4.14711C19.8337 2.92978 18.3327 2.80999 17.1914 3.59313Z" stroke="#414651" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          }
          title="Shared Memories"
          shortDescription="A private gallery for photos & videos"
          longDescription="Collect and relive memories in one shared space, with access only for confirmed guests."
        />
      </div>
    </section>
  );
}
