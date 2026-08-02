/**
 * MedicationStatusBadge
 *
 * Small color-coded badge indicating whether a medication is valid,
 * expiring soon (within 30 days), or expired.
 *
 * Purely presentational — no store access.
 */

import { StyleSheet, Text, View } from 'react-native';
import { Spacing, Radius } from '@/constants';
import { ExpirationStatus } from '@/features/medication/types';
import { getExpirationLabel, getExpirationStatus } from '@/features/medication/utils/medicationUtils';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from 'react-i18next';

// ─── Types ────────────────────────────────────────────────────────────────────

interface MedicationStatusBadgeProps {
  /** ISO date string (YYYY-MM-DD) from the medication */
  expirationDate: string;
}

// ─── Status → Style Map ───────────────────────────────────────────────────────



// ─── Component ────────────────────────────────────────────────────────────────

/**
 * MedicationStatusBadge
 *
 * Displays a compact, color-coded pill badge based on the expiration date.
 *
 * Usage:
 * ```tsx
 * <MedicationStatusBadge expirationDate="2026-08-01" />
 * ```
 */
export function MedicationStatusBadge({ expirationDate }: MedicationStatusBadgeProps) {
  const { theme, colors, typography } = useTheme();
  const styles = getStyles(colors, typography);
  const { t } = useTranslation();
  
  const status = getExpirationStatus(expirationDate);
  const labelData = getExpirationLabel(expirationDate);
  const label = t(labelData.key, labelData.params) as string;
  
  const isDark = theme === 'dark';
  
  const badgeColorMap: Record<ExpirationStatus, { background: string; text: string }> = {
    valid: { background: isDark ? '#0D2916' : '#E8F8ED', text: colors.success },
    expiring: { background: isDark ? '#332306' : '#FFF5E0', text: colors.warning },
    expired: { background: isDark ? '#300E0B' : '#FEE9E7', text: colors.error },
  };

  const statusColors = badgeColorMap[status];

  return (
    <View
      style={[styles.badge, { backgroundColor: statusColors.background }]}
      accessibilityLabel={`Expiration status: ${label}`}
    >
      <Text style={[styles.label, { color: statusColors.text }]}>{label}</Text>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const getStyles = (colors: any, typography: any) => StyleSheet.create({
  badge: {
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xxs,
    alignSelf: 'flex-start',
  },
  label: {
    ...typography.caption,
    fontWeight: '600',
  },
});
