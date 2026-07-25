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
  secondary: '#2B3766',
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

export const HighContrastLightColors: ColorScheme = {
  primary: '#005D74',
  primaryLight: '#0085A1',
  primaryContainer: '#003A4A',
  secondary: '#3D4699',
  accent: '#A50059',
  background: '#FFFFFF',
  surface: '#FFFFFF',
  surfaceVariant: '#E0E0E0',
  cardBackground: '#FFFFFF',
  textPrimary: '#000000',
  textSecondary: '#1C1C1C',
  textDisabled: '#4A4A4A',
  success: '#006611',
  warning: '#995B00',
  error: '#990000',
  info: '#005D74',
  border: '#000000',
};

export const HighContrastDarkColors: ColorScheme = {
  primary: '#7DE5FF',
  primaryLight: '#B3F0FF',
  primaryContainer: '#0095BA',
  secondary: '#161F4D',
  accent: '#FFB3E6',
  background: '#000000',
  surface: '#000000',
  surfaceVariant: '#1A1A1A',
  cardBackground: '#000000',
  textPrimary: '#FFFFFF',
  textSecondary: '#E0E0E0',
  textDisabled: '#A3A3A3',
  success: '#66FF7A',
  warning: '#FFD166',
  error: '#FF6666',
  info: '#7DE5FF',
  border: '#FFFFFF',
};

export const Colors = {
  light: LightColors,
  dark: DarkColors,
} as const;
