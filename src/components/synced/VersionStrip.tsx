// AUTO-SYNCED from zapigowebclient — DO NOT EDIT DIRECTLY
// Source: /Users/dewanshshukla/Desktop/zapigo/zapigowebclient/src/components/VersionStrip.tsx
// Last synced: 2026-03-17T11:17:27.013Z
// API integrations stripped. Use props for data and callbacks.
import React from 'react';

interface VersionStripProps {
  className?: string;
}

const VersionStrip = ({ className = '' }: VersionStripProps) => {
  return (
    <span className={`text-body-md ${className}`}>
      Version {process.env.APP_VERSION || '2.0.15'}
    </span>
  );
};

export default VersionStrip;
