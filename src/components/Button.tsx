import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import { LightColors, Typography, Spacing, Radius } from '@/constants';

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
          color={variant === 'outline' ? LightColors.primary : '#FFFFFF'}
          accessibilityLabel="Loading"
        />
      ) : (
        <Text style={[styles.label, styles[`${variant}Label`]]}>{label}</Text>
      )}
    </TouchableOpacity>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
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
    backgroundColor: LightColors.primary,
  },
  secondary: {
    backgroundColor: LightColors.secondary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: LightColors.primary,
  },

  // Disabled state
  disabled: {
    opacity: 0.45,
  },

  // Labels
  label: {
    ...Typography.bodyMD,
    fontWeight: '600',
  },
  primaryLabel: {
    color: '#FFFFFF',
  },
  secondaryLabel: {
    color: LightColors.textPrimary,
  },
  outlineLabel: {
    color: LightColors.primary,
  },
});
