// AUTO-SYNCED from zapigowebclient — DO NOT EDIT DIRECTLY
// Source: /Users/dewanshshukla/Desktop/zapigo/zapigowebclient/src/components/home/FeatureCard.tsx
// Last synced: 2026-03-17T11:05:34.428Z
// API integrations stripped. Use props for data and callbacks.
import React from 'react';

interface FeatureCardProps {
  title: string;
  icon: React.ReactNode;
  features: string[];
}

export function FeatureCard({ title, icon, features }: FeatureCardProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-500">
        {icon}
      </div>
      <h3 className="font-display text-lg font-bold text-gray-900 md:text-xl">
        {title}
      </h3>
      <ul className="space-y-2 text-left list-disc pl-6">
        {features.map((feature, index) => (
          <li key={index} className="font-body text-sm text-gray-700 md:text-base">
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
}
