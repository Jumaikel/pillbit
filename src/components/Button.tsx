import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import { Spacing, Radius } from '@/constants';
import { useTheme } from '@/hooks/useTheme';

// ─── Types ────────────────────────────────────────────────────────────────────

type ButtonVariant = 'primary' | 'secondary' | 'outline';

interface ButtonProps extends Omit<TouchableOpacityProps, 'onPress'> {
  /** Button label text */
  label: string;
  /** Press handler */
  onPress: () => void;
  /** Visual variant */
  variant?: ButtonVariant;
  /** Shows an ActivityIndicator and disables interaction */
  loading?: boolean;
  /** Disables the button */
  disabled?: boolean;
  /** Accessibility hint describing the action */
  accessibilityHint?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Button
 *
 * Reusable, accessible button component following the PillBit design system.
 *
 * Variants:
 *  - primary  → Filled background (Primary color), white label
 *  - secondary → Filled background (Secondary color), dark label
 *  - outline  → Transparent background, Primary border and label
 *
 * Usage:
 * ```tsx
 * <Button label="Save" onPress={handleSave} variant="primary" />
 * <Button label="Cancel" onPress={handleCancel} variant="outline" />
 * <Button label="Loading..." onPress={noop} loading />
 * ```
 *
 * Accessibility:
 *  - Minimum touch target: 48dp (enforced via minHeight)
 *  - accessibilityRole="button" set automatically
 *  - accessibilityState.disabled reflects disabled state
 *  - Supports custom accessibilityHint
 */
export function Button({
  label,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  accessibilityHint,
  style,
  ...rest
}: ButtonProps) {
  const { colors, typography } = useTheme();
  const styles = getStyles(colors, typography);
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.75}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      style={[
        styles.base,
        styles[variant],
        isDisabled && styles.disabled,
        style,
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' ? colors.primary : '#FFFFFF'}
          accessibilityLabel="Loading"
        />
      ) : (
        <Text style={[styles.label, styles[`${variant}Label`]]}>{label}</Text>
      )}
    </TouchableOpacity>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const getStyles = (colors: any, typography: any) => StyleSheet.create({
  base: {
    minHeight: 48,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },

  // Variants
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.secondary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.primary,
  },

  // Disabled state
  disabled: {
    opacity: 0.45,
  },

  // Labels
  label: {
    ...typography.bodyMD,
    fontWeight: '600',
    textAlign: 'center',
  },
  primaryLabel: {
    color: '#FFFFFF',
  },
  secondaryLabel: {
    color: colors.textPrimary,
  },
  outlineLabel: {
    color: colors.primary,
  },
});
