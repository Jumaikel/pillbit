import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { LightColors, Typography, Spacing, Radius } from '@/constants';

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
  const hasError = Boolean(errorMessage);

  return (
    <View style={styles.wrapper}>
      {label != null && (
        <Text style={[styles.label, disabled && styles.labelDisabled]}>{label}</Text>
      )}

      <TextInput
        placeholder={placeholder}
        placeholderTextColor={LightColors.textDisabled}
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

const styles = StyleSheet.create({
  wrapper: {
    gap: Spacing.xs,
  },

  label: {
    ...Typography.bodySM,
    fontWeight: '500',
    color: LightColors.textPrimary,
  },
  labelDisabled: {
    color: LightColors.textDisabled,
  },

  input: {
    minHeight: 48,
    borderWidth: 1.5,
    borderColor: LightColors.border,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: LightColors.surface,
    color: LightColors.textPrimary,
    ...Typography.bodyMD,
  },
  inputError: {
    borderColor: LightColors.error,
  },
  inputDisabled: {
    backgroundColor: LightColors.surfaceVariant,
    color: LightColors.textDisabled,
  },

  errorText: {
    ...Typography.caption,
    color: LightColors.error,
  },
});
