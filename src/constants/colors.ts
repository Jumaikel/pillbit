/**
 * PillBit Color Tokens
 *
 * Semantic color palette for the PillBit design system.
 * All colors are sourced from docs/PillBit_Design_System.md.
 *
 * Usage: import { Colors } from '@/constants';
 *        const bg = Colors.light.background;
 *
 * Rules:
 * - NEVER use hardcoded hex values in components.
 * - ALWAYS reference these tokens.
 */

export interface ColorScheme {
  // Brand
  primary: string;
  primaryLight: string;
  primaryContainer: string;
  secondary: string;
  accent: string;

  // Backgrounds
  background: string;
  surface: string;
  surfaceVariant: string;
  cardBackground: string;

  // Text
  textPrimary: string;
  textSecondary: string;
  textDisabled: string;

  // Status
  success: string;
  warning: string;
  error: string;
  info: string;

  // UI
  border: string;
}

export const LightColors: ColorScheme = {
  // Brand
  primary: '#24C9EA',
  primaryLight: '#7FD6EA',
  primaryContainer: '#D6EDFB',
  secondary: '#C6CDF8',
  accent: '#FED7EE',

  // Backgrounds
  background: '#F8FCFE',
  surface: '#FFFFFF',
  surfaceVariant: '#EEF8FC',
  cardBackground: '#FFFFFF',

  // Text
  textPrimary: '#123043',
  textSecondary: '#5D7482',
  textDisabled: '#A6B4BE',

  // Status
  success: '#34C759',
  warning: '#FFB020',
  error: '#F04438',
  info: '#24C9EA',

  // UI
  border: '#D6EDFB',
};

export const DarkColors: ColorScheme = {
  // Brand
  primary: '#24C9EA',
  primaryLight: '#7FD6EA',
  primaryContainer: '#1B6F83',
  secondary: '#C6CDF8',
  accent: '#FED7EE',

  // Backgrounds
  background: '#0B1720',
  surface: '#122330',
  surfaceVariant: '#193241',
  cardBackground: '#17303F',

  // Text
  textPrimary: '#F5FAFC',
  textSecondary: '#C2D3DD',
  textDisabled: '#6E8592',

  // Status
  success: '#34C759',
  warning: '#FFB020',
  error: '#F04438',
  info: '#24C9EA',

  // UI
  border: '#1B6F83',
};

export const Colors = {
  light: LightColors,
  dark: DarkColors,
} as const;
