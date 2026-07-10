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
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { Spacing } from '@/constants';
import { Medication } from '@/database';
import { MedicationStatusBadge } from './MedicationStatusBadge';
import { useTheme } from '@/hooks/useTheme';

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
  const { colors, typography } = useTheme();
  const styles = getStyles(colors, typography);
  return (
    <Card
      onPress={onPress}
      accessibilityLabel={`${medication.name}, ${medication.dosage}. Tap to view details.`}
      padded
    >
      <View style={styles.row}>
        {/* Left — Thumbnail */}
        <View style={styles.thumbnailContainer}>
          {medication.photoPath ? (
            <Image source={{ uri: medication.photoPath }} style={styles.thumbnail} contentFit="cover" />
          ) : (
            <View style={styles.thumbnailPlaceholder}>
              <Ionicons name="medical" size={24} color={colors.primary} />
            </View>
          )}
        </View>

        {/* Center — name + dosage + presentation */}
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

const getStyles = (colors: any, typography: any) => StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  thumbnailContainer: {
    marginRight: Spacing.md,
  },
  thumbnail: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  thumbnailPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E6F4FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    gap: Spacing.xxs,
    paddingRight: Spacing.xs,
  },
  name: {
    ...typography.headingMD,
    color: colors.textPrimary,
  },
  dosage: {
    ...typography.bodySM,
    color: colors.textSecondary,
  },
  quantity: {
    alignItems: 'center',
    minWidth: 40,
  },
  quantityNumber: {
    ...typography.headingMD,
    color: colors.primary,
  },
  quantityLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  badgeRow: {
    marginTop: Spacing.xs,
  },
});
