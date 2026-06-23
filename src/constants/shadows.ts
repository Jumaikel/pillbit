/**
 * PillBit Shadow Tokens
 *
 * Minimal elevation system for the PillBit design system.
 * Per docs/PillBit_Design_System.md: prefer color/contrast over aggressive shadows.
 *
 * These tokens are used with React Native's shadow props.
 * For cross-platform elevation, use the `elevation` prop on Android.
 *
 * Usage: import { Shadows } from '@/constants';
 *        const style = Shadows.card;
 */

import { Platform, ViewStyle } from 'react-native';

interface ShadowToken {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number; // Android
}

const createShadow = (
  color: string,
  offsetY: number,
  opacity: number,
  radius: number,
  elevation: number,
): ShadowToken => ({
  shadowColor: color,
  shadowOffset: { width: 0, height: offsetY },
  shadowOpacity: opacity,
  shadowRadius: radius,
  elevation,
});

export const Shadows = {
  /** No shadow — flat elements */
  none: createShadow('#000000', 0, 0, 0, 0),

  /** Subtle — for cards, inputs on light background */
  sm: createShadow('#123043', 1, 0.06, 4, 2),

  /** Default card shadow */
  card: createShadow('#123043', 2, 0.08, 8, 4),

  /** Modal / Bottom Sheet shadow */
  lg: createShadow('#123043', 4, 0.12, 16, 8),
} as const;

export type ShadowKey = keyof typeof Shadows;

/**
 * Helper to get platform-safe shadow styles.
 * On Android, only `elevation` works. On iOS, all shadow props work.
 */
export function getShadowStyle(key: ShadowKey): Partial<ViewStyle> {
  const token = Shadows[key];
  if (Platform.OS === 'android') {
    return { elevation: token.elevation };
  }
  return token;
}
