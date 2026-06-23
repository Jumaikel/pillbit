/**
 * PillBit Theme
 *
 * Unified theme object that composes all design system tokens.
 * Use this object as the single source of truth for component styling.
 *
 * Usage:
 *   import { theme } from '@/constants';
 *   const color = theme.colors.light.primary;
 *   const size = theme.spacing.md;
 *
 * Or import individual token groups:
 *   import { Colors, Typography, Spacing, Radius, Shadows } from '@/constants';
 */

import { Colors } from './colors';
import { Typography } from './typography';
import { Spacing } from './spacing';
import { Radius } from './radius';
import { Shadows } from './shadows';

export const theme = {
  colors: Colors,
  typography: Typography,
  spacing: Spacing,
  radius: Radius,
  shadows: Shadows,
} as const;

export type Theme = typeof theme;
