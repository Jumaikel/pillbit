/**
 * PillBit Spacing Tokens
 *
 * 8px-base spacing scale for the PillBit design system.
 * Based on docs/PillBit_Design_System.md.
 *
 * Usage: import { Spacing } from '@/constants';
 *        const paddingH = Spacing.md;   // 16
 *
 * Rules:
 * - NEVER use arbitrary numeric values for spacing in components.
 * - ALWAYS reference these tokens.
 */

export const Spacing = {
  /** 4px — Extra extra small */
  xxs: 4,

  /** 8px — Extra small */
  xs: 8,

  /** 12px — Small */
  sm: 12,

  /** 16px — Medium (default component padding) */
  md: 16,

  /** 24px — Large */
  lg: 24,

  /** 32px — Extra Large */
  xl: 32,

  /** 48px — 2XL */
  xxl: 48,

  /** 64px — 3XL */
  xxxl: 64,
} as const;

export type SpacingKey = keyof typeof Spacing;
