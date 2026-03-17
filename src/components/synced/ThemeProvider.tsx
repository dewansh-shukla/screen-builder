// AUTO-SYNCED from zapigowebclient — DO NOT EDIT DIRECTLY
// Source: /Users/dewanshshukla/Desktop/zapigo/zapigowebclient/src/components/ThemeProvider.tsx
// Last synced: 2026-03-17T11:17:27.013Z
// API integrations stripped. Use props for data and callbacks.
'use client';

import { ThemeProvider as NextThemeProvider } from 'next-themes';

export function Theme({ children }: { children: React.ReactNode }) {
  return (
    <NextThemeProvider
      attribute="class"
      value={{ light: 'light-mode', dark: 'dark-mode' }}
      defaultTheme="light"
      enableSystem={false}
    >
      {children}
    </NextThemeProvider>
  );
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <Theme>{children}</Theme>;
}
