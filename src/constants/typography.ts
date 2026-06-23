/**
 * PillBit Typography Tokens
 *
 * Centralized typography scale for the PillBit design system.
 * Based on docs/PillBit_Design_System.md — base unit Inter/System Sans.
 *
 * Usage: import { Typography } from '@/constants';
 *        const style = Typography.headingXL;
 */

import { TextStyle } from 'react-native';

export interface TypographyToken {
  fontSize: number;
  fontWeight: TextStyle['fontWeight'];
  lineHeight: number;
  letterSpacing?: number;
}

export const Typography = {
  /** Display — 32px, Bold */
  display: {
    fontSize: 32,
    fontWeight: '700' as TextStyle['fontWeight'],
    lineHeight: 40,
    letterSpacing: -0.5,
  },

  /** Heading XL — 28px, Bold (H1) */
  headingXL: {
    fontSize: 28,
    fontWeight: '700' as TextStyle['fontWeight'],
    lineHeight: 36,
    letterSpacing: -0.3,
  },

  /** Heading LG — 24px, SemiBold (H2) */
  headingLG: {
    fontSize: 24,
    fontWeight: '600' as TextStyle['fontWeight'],
    lineHeight: 32,
    letterSpacing: -0.2,
  },

  /** Heading MD — 20px, SemiBold (H3) */
  headingMD: {
    fontSize: 20,
    fontWeight: '600' as TextStyle['fontWeight'],
    lineHeight: 28,
  },

  /** Body LG — 18px, Regular */
  bodyLG: {
    fontSize: 18,
    fontWeight: '400' as TextStyle['fontWeight'],
    lineHeight: 28,
  },

  /** Body MD — 16px, Regular (default body text) */
  bodyMD: {
    fontSize: 16,
    fontWeight: '400' as TextStyle['fontWeight'],
    lineHeight: 24,
  },

  /** Body SM — 14px, Regular */
  bodySM: {
    fontSize: 14,
    fontWeight: '400' as TextStyle['fontWeight'],
    lineHeight: 20,
  },

  /** Caption — 12px, Regular */
  caption: {
    fontSize: 12,
    fontWeight: '400' as TextStyle['fontWeight'],
    lineHeight: 16,
    letterSpacing: 0.2,
  },
} as const satisfies Record<string, TypographyToken>;
