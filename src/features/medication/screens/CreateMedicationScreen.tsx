/**
 * CreateMedicationScreen
 *
 * Form screen for creating a new medication.
 * Route: /medications/create
 *
 * Responsibilities:
 *  - Collect required fields (name, dosage, expirationDate)
 *  - Collect optional fields (presentation, notes, quantityAvailable)
 *  - Validate via Zod (useMedicationForm)
 *  - On submit: call store.createMedication → navigate back to list
 *  - Show validation errors per field
 *  - Disable submit while saving
 */

import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Controller } from 'react-hook-form';
import { useCallback } from 'react';
import { LightColors, Typography, Spacing } from '@/constants';
import { Button, Input, DateInput } from '@/components';
import { useMedicationStore } from '../store/useMedicationStore';
import { useMedicationForm } from '../hooks/useMedicationForm';
import { MedicationFormValues } from '../types';

// ─── Component ────────────────────────────────────────────────────────────────

export function CreateMedicationScreen() {
  const router = useRouter();
  const isLoading = useMedicationStore((s) => s.isLoading);
  const createMedication = useMedicationStore((s) => s.createMedication);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useMedicationForm();

  // ─── Submit ───────────────────────────────────────────────────────────────

  const onSubmit = useCallback(
    async (values: MedicationFormValues) => {
      try {
        await createMedication({
          name: values.name.trim(),
          dosage: values.dosage.trim(),
          expirationDate: values.expirationDate.trim(),
          presentation: values.presentation.trim() || null,
          notes: values.notes.trim() || null,
          quantityAvailable:
            values.quantityAvailable.trim() ? Number(values.quantityAvailable) : null,
        });
        router.back();
      } catch {
        Alert.alert('Error', 'Failed to save medication. Please try again.');
      }
    },
    [createMedication, router],
  );

  const isBusy = isLoading || isSubmitting;

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* ── Navigation header ── */}
      <View style={styles.navHeader}>
        <Button label="← Cancel" onPress={() => router.back()} variant="outline" />
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.screenTitle} accessibilityRole="header">
            Add Medication
          </Text>
          <Text style={styles.screenSubtitle}>
            Fill in the details below to add a new medication.
          </Text>

          {/* ── Required fields ── */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Required</Text>

            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Medication Name"
                  placeholder="e.g. Aspirin"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  errorMessage={errors.name?.message}
                  autoCapitalize="words"
                  returnKeyType="next"
                  accessibilityHint="Enter the medication name"
                />
              )}
            />

            <Controller
              control={control}
              name="dosage"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Dosage"
                  placeholder="e.g. 500mg"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  errorMessage={errors.dosage?.message}
                  returnKeyType="next"
                  accessibilityHint="Enter the dosage amount and unit"
                />
              )}
            />

            <Controller
              control={control}
              name="expirationDate"
              render={({ field: { onChange, value } }) => (
                <DateInput
                  label="Expiration Date"
                  value={value}
                  onChange={onChange}
                  errorMessage={errors.expirationDate?.message}
                />
              )}
            />
          </View>

          {/* ── Optional fields ── */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Optional</Text>

            <Controller
              control={control}
              name="presentation"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Presentation"
                  placeholder="e.g. Tablet, Capsule, Syrup"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  errorMessage={errors.presentation?.message}
                  autoCapitalize="words"
                  returnKeyType="next"
                  accessibilityHint="Enter the medication form or presentation"
                />
              )}
            />

            <Controller
              control={control}
              name="quantityAvailable"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Quantity Available"
                  placeholder="e.g. 30"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  errorMessage={errors.quantityAvailable?.message}
                  keyboardType="numeric"
                  returnKeyType="next"
                  accessibilityHint="Enter the number of units you currently have"
                />
              )}
            />

            <Controller
              control={control}
              name="notes"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Notes"
                  placeholder="e.g. Take with food"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  errorMessage={errors.notes?.message}
                  multiline
                  numberOfLines={3}
                  returnKeyType="done"
                  accessibilityHint="Enter any additional notes or instructions"
                />
              )}
            />
          </View>

          {/* ── Submit ── */}
          <View style={styles.submitSection}>
            <Button
              label={isBusy ? 'Saving…' : 'Save Medication'}
              onPress={handleSubmit(onSubmit)}
              variant="primary"
              loading={isBusy}
              disabled={isBusy}
              accessibilityHint="Save the medication to your list"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: LightColors.background,
  },
  flex: {
    flex: 1,
  },

  // Nav header
  navHeader: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
    flexDirection: 'row',
  },

  // Scroll
  scrollContent: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xxxl,
    gap: Spacing.sm,
  },

  // Screen title
  screenTitle: {
    ...Typography.headingXL,
    color: LightColors.textPrimary,
    marginBottom: Spacing.xxs,
  },
  screenSubtitle: {
    ...Typography.bodyMD,
    color: LightColors.textSecondary,
    marginBottom: Spacing.xs,
  },

  // Section
  section: {
    gap: Spacing.md,
  },
  sectionLabel: {
    ...Typography.bodySM,
    fontWeight: '600',
    color: LightColors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },

  // Submit
  submitSection: {
    marginTop: Spacing.md,
  },
});
