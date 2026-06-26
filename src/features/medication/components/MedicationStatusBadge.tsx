/**
 * MedicationStatusBadge
 *
 * Small color-coded badge indicating whether a medication is valid,
 * expiring soon (within 30 days), or expired.
 *
 * Purely presentational — no store access.
 */

import { StyleSheet, Text, View } from 'react-native';
import { LightColors, Typography, Spacing, Radius } from '@/constants';
import { ExpirationStatus } from '@/features/medication/types';
import { getExpirationLabel, getExpirationStatus } from '@/features/medication/utils/medicationUtils';

// ─── Types ────────────────────────────────────────────────────────────────────

interface MedicationStatusBadgeProps {
  /** ISO date string (YYYY-MM-DD) from the medication */
  expirationDate: string;
}

// ─── Status → Style Map ───────────────────────────────────────────────────────

const badgeColorMap: Record<ExpirationStatus, { background: string; text: string }> = {
  valid: { background: '#E8F8ED', text: LightColors.success },
  expiring: { background: '#FFF5E0', text: LightColors.warning },
  expired: { background: '#FEE9E7', text: LightColors.error },
};

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
  const status = getExpirationStatus(expirationDate);
  const label = getExpirationLabel(expirationDate);
  const colors = badgeColorMap[status];

  return (
    <View
      style={[styles.badge, { backgroundColor: colors.background }]}
      accessibilityLabel={`Expiration status: ${label}`}
    >
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  badge: {
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xxs,
    alignSelf: 'flex-start',
  },
  label: {
    ...Typography.caption,
    fontWeight: '600',
  },
});
