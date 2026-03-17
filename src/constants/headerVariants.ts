// Stub for screen-builder — mirrors zapigowebclient/src/constants/headerVariants.ts
export const HEADER_VARIANTS = {
  CENTERED_LOGO: 'CENTERED_LOGO',
  LEFT_LOGO: 'LEFT_LOGO',
  BACK_BUTTON: 'BACK_BUTTON',
} as const;

export type HeaderVariantType =
  (typeof HEADER_VARIANTS)[keyof typeof HEADER_VARIANTS];
