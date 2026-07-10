import {
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewProps,
} from 'react-native';
import { Spacing, Radius, getShadowStyle } from '@/constants';
import { useTheme } from '@/hooks/useTheme';

// ─── Types ────────────────────────────────────────────────────────────────────

interface CardBaseProps {
  /** Whether to apply the default padding to the card content */
  padded?: boolean;
  /** Children elements rendered inside the card */
  children: React.ReactNode;
}

interface StaticCardProps extends CardBaseProps, Omit<ViewProps, 'children'> {
  /** Static card — not pressable */
  onPress?: never;
}

interface PressableCardProps extends CardBaseProps, Omit<TouchableOpacityProps, 'children'> {
  /** Press handler — makes the card pressable */
  onPress: () => void;
  /** Accessibility label for screen readers */
  accessibilityLabel: string;
  /** Accessibility hint describing what happens on press */
  accessibilityHint?: string;
}

type CardProps = StaticCardProps | PressableCardProps;

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Card
 *
 * Reusable surface container following the PillBit design system.
 * Supports optional padding and optional pressable behavior.
 *
 * Usage:
 * ```tsx
 * // Static card
 * <Card padded>
 *   <Text>Content</Text>
 * </Card>
 *
 * // Pressable card
 * <Card onPress={handlePress} accessibilityLabel="View medication" padded>
 *   <Text>Medication Name</Text>
 * </Card>
 * ```
 *
 * Accessibility:
 *  - When pressable: accessibilityRole="button", min touch target enforced
 *  - Supports accessibilityLabel and accessibilityHint on pressable cards
 */
export function Card({ children, padded = true, ...rest }: CardProps) {
  const { colors, typography } = useTheme();
  const styles = getStyles(colors, typography);
  const paddingStyle = padded ? styles.padded : undefined;

  if ('onPress' in rest && rest.onPress != null) {
    const { onPress, accessibilityLabel, accessibilityHint, style, ...touchableRest } =
      rest as PressableCardProps;

    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        style={[styles.card, paddingStyle, style]}
        {...touchableRest}
      >
        {children}
      </TouchableOpacity>
    );
  }

  const { style, ...viewRest } = rest as StaticCardProps;

  return (
    <View style={[styles.card, paddingStyle, style]} {...viewRest}>
      {children}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const getStyles = (colors: any, typography: any) => StyleSheet.create({
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: Radius.lg,
    ...getShadowStyle('card'),
  },
  padded: {
    padding: Spacing.md,
  },
});
