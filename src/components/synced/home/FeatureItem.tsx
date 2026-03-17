// AUTO-SYNCED from zapigowebclient — DO NOT EDIT DIRECTLY
// Source: /Users/dewanshshukla/Desktop/zapigo/zapigowebclient/src/components/home/FeatureItem.tsx
// Last synced: 2026-03-17T11:17:27.017Z
// API integrations stripped. Use props for data and callbacks.
import React from 'react';

interface FeatureItemProps {
  icon: React.ReactNode;
  title: string;
  shortDescription: string;
  longDescription: string;
}

export function FeatureItem({ icon, title, shortDescription, longDescription }: FeatureItemProps) {
  return (
    <div className="flex gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white shadow-sm">
        {icon}
      </div>
      <div className="flex flex-col">
        <h3 className="font-display text-lg font-bold text-gray-900 md:text-xl">
          {title}
        </h3>
        <p className="font-body text-sm text-gray-700 md:text-base mt-1">
          {shortDescription}
        </p>
        <p className="font-body text-sm text-gray-700 md:text-base mt-4">
          {longDescription}
        </p>
      </div>
    </div>
  );
}
