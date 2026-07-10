import { StyleSheet, Text, View } from 'react-native';
import { Spacing } from '@/constants';
import { Button } from './Button';
import { useTheme } from '@/hooks/useTheme';

// ─── Types ────────────────────────────────────────────────────────────────────

interface EmptyStateAction {
  /** Label for the action button */
  label: string;
  /** Press handler for the action button */
  onPress: () => void;
}

interface EmptyStateProps {
  /** Primary empty state title */
  title: string;
  /** Supporting description text */
  description?: string;
  /** Optional action button configuration */
  action?: EmptyStateAction;
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * EmptyState
 *
 * Displays a friendly empty state for list screens or sections with no data.
 * Follows PillBit UX guidelines: always show friendly empty states.
 *
 * Usage:
 * ```tsx
 * // Basic empty state
 * <EmptyState
 *   title="No medications yet"
 *   description="Add your first medication to get started."
 * />
 *
 * // With action button
 * <EmptyState
 *   title="No history found"
 *   description="Your consumption history will appear here."
 *   action={{ label: 'Add Medication', onPress: handleAdd }}
 * />
 * ```
 *
 * Accessibility:
 *  - Title has accessibilityRole="header"
 *  - Container has accessibilityRole="none" to avoid redundant announcements
 */
export function EmptyState({ title, description, action }: EmptyStateProps) {
  const { colors, typography } = useTheme();
  const styles = getStyles(colors, typography);
  return (
    <View style={styles.container} accessibilityRole="none">
      <Text style={styles.title} accessibilityRole="header">
        {title}
      </Text>

      {description != null && (
        <Text style={styles.description}>{description}</Text>
      )}

      {action != null && (
        <View style={styles.actionWrapper}>
          <Button
            label={action.label}
            onPress={action.onPress}
            variant="primary"
            accessibilityHint={`Tap to ${action.label.toLowerCase()}`}
          />
        </View>
      )}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const getStyles = (colors: any, typography: any) => StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    gap: Spacing.sm,
  },

  title: {
    ...typography.headingMD,
    color: colors.textPrimary,
    textAlign: 'center',
  },

  description: {
    ...typography.bodyMD,
    color: colors.textSecondary,
    textAlign: 'center',
  },

  actionWrapper: {
    marginTop: Spacing.md,
    alignSelf: 'stretch',
  },
});
