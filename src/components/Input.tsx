import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { Spacing, Radius } from '@/constants';
import { useTheme } from '@/hooks/useTheme';

// ─── Types ────────────────────────────────────────────────────────────────────

interface InputProps extends Omit<TextInputProps, 'style'> {
  /** Label displayed above the input field */
  label?: string;
  /** Placeholder text shown when input is empty */
  placeholder?: string;
  /** Error message displayed below the input; also triggers error styling */
  errorMessage?: string;
  /** Disables the input and applies disabled styling */
  disabled?: boolean;
  /** Accessibility label override (defaults to `label` value) */
  accessibilityLabel?: string;
  /** Accessibility hint describing the expected input */
  accessibilityHint?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Input
 *
 * Reusable text input field following the PillBit design system.
 * Supports label, placeholder, error state, and disabled state.
 *
 * Does NOT contain any form logic — purely presentational.
 *
 * Usage:
 * ```tsx
 * <Input
 *   label="Medication Name"
 *   placeholder="e.g. Aspirin 500mg"
 *   value={value}
 *   onChangeText={setValue}
 * />
 *
 * <Input
 *   label="Dose"
 *   errorMessage="Dose is required"
 *   value={dose}
 *   onChangeText={setDose}
 * />
 *
 * <Input label="Notes" disabled value="Cannot edit" />
 * ```
 *
 * Accessibility:
 *  - accessibilityLabel defaults to the `label` prop
 *  - accessibilityState.disabled reflects the disabled prop
 *  - Error message is announced via accessibilityLiveRegion on Android
 */
export function Input({
  label,
  placeholder,
  errorMessage,
  disabled = false,
  accessibilityLabel,
  accessibilityHint,
  ...textInputProps
}: InputProps) {
  const { colors, typography } = useTheme();
  const styles = getStyles(colors, typography);
  const hasError = Boolean(errorMessage);

  return (
    <View style={styles.wrapper}>
      {label != null && (
        <Text style={[styles.label, disabled && styles.labelDisabled]}>{label}</Text>
      )}

      <TextInput
        placeholder={placeholder}
        placeholderTextColor={colors.textDisabled}
        editable={!disabled}
        accessibilityLabel={accessibilityLabel ?? label}
        accessibilityHint={accessibilityHint}
        accessibilityState={{ disabled }}
        style={[
          styles.input,
          hasError && styles.inputError,
          disabled && styles.inputDisabled,
        ]}
        {...textInputProps}
      />

      {hasError && (
        <Text
          style={styles.errorText}
          accessibilityLiveRegion="polite"
          accessibilityRole="alert"
        >
          {errorMessage}
        </Text>
      )}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const getStyles = (colors: any, typography: any) => StyleSheet.create({
  wrapper: {
    gap: Spacing.xs,
  },

  label: {
    ...typography.bodySM,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  labelDisabled: {
    color: colors.textDisabled,
  },

  input: {
    minHeight: 48,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: colors.surface,
    color: colors.textPrimary,
    ...typography.bodyMD,
  },
  inputError: {
    borderColor: colors.error,
  },
  inputDisabled: {
    backgroundColor: colors.surfaceVariant,
    color: colors.textDisabled,
  },

  errorText: {
    ...typography.caption,
    color: colors.error,
  },
});
