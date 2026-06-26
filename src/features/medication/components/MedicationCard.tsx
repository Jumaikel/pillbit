/**
 * MedicationCard
 *
 * Reusable card component for displaying a single medication in list views.
 * Displays: name, dosage, presentation, expiration status badge, and quantity.
 *
 * Purely presentational — receives data and callbacks as props.
 * Uses the shared Card component from @/components.
 */

import { StyleSheet, Text, View } from 'react-native';
import { Card } from '@/components';
import { LightColors, Typography, Spacing } from '@/constants';
import { Medication } from '@/database';
import { MedicationStatusBadge } from './MedicationStatusBadge';

// ─── Types ────────────────────────────────────────────────────────────────────

interface MedicationCardProps {
  /** The medication data to display */
  medication: Medication;
  /** Called when the card is pressed */
  onPress: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * MedicationCard
 *
 * Displays a summary of a medication inside a pressable Card.
 * Reusable across list screens and any future dashboard widgets.
 *
 * Usage:
 * ```tsx
 * <MedicationCard
 *   medication={item}
 *   onPress={() => router.push(`/medications/${item.id}`)}
 * />
 * ```
 */
export function MedicationCard({ medication, onPress }: MedicationCardProps) {
  return (
    <Card
      onPress={onPress}
      accessibilityLabel={`${medication.name}, ${medication.dosage}. Tap to view details.`}
      padded
    >
      <View style={styles.row}>
        {/* Left — name + dosage + presentation */}
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1}>
            {medication.name}
          </Text>
          <Text style={styles.dosage} numberOfLines={1}>
            {medication.dosage}
            {medication.presentation ? ` · ${medication.presentation}` : ''}
          </Text>
        </View>

        {/* Right — quantity */}
        {medication.quantityAvailable !== null && (
          <View style={styles.quantity}>
            <Text style={styles.quantityNumber}>{medication.quantityAvailable}</Text>
            <Text style={styles.quantityLabel}>units</Text>
          </View>
        )}
      </View>

      {/* Expiration badge */}
      <View style={styles.badgeRow}>
        <MedicationStatusBadge expirationDate={medication.expirationDate} />
      </View>
    </Card>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  info: {
    flex: 1,
    gap: Spacing.xxs,
    paddingRight: Spacing.xs,
  },
  name: {
    ...Typography.headingMD,
    color: LightColors.textPrimary,
  },
  dosage: {
    ...Typography.bodySM,
    color: LightColors.textSecondary,
  },
  quantity: {
    alignItems: 'center',
    minWidth: 40,
  },
  quantityNumber: {
    ...Typography.headingMD,
    color: LightColors.primary,
  },
  quantityLabel: {
    ...Typography.caption,
    color: LightColors.textSecondary,
  },
  badgeRow: {
    marginTop: Spacing.xs,
  },
});
