/**
 * PillBit Border Radius Tokens
 *
 * Reusable border radius values for the PillBit design system.
 * Based on docs/PillBit_Design_System.md.
 *
 * Usage: import { Radius } from '@/constants';
 *        const cardRadius = Radius.lg;   // 16
 */

export const Radius = {
  /** 4px — Minimal rounding for very small elements */
  xs: 4,

  /** 8px — Small — inputs, tags */
  sm: 8,

  /** 12px — Medium — buttons */
  md: 12,

  /** 16px — Large — cards, modals */
  lg: 16,

  /** 24px — Extra Large — bottom sheets, large cards */
  xl: 24,

  /** 9999px — Full round — pills, avatars, FABs */
  full: 9999,
} as const;

export type RadiusKey = keyof typeof Radius;
