/**
 * EditMedicationScreen
 *
 * Form screen for editing an existing medication.
 * Route: /medications/[id]/edit
 *
 * Responsibilities:
 *  - Read `id` from route params
 *  - Resolve the medication from the store or repository
 *  - Pre-populate the shared form with existing values
 *  - Validate via Zod (useMedicationForm)
 *  - On submit: call store.updateMedication → navigate back
 *  - Handle loading and error states
 */

import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Controller } from 'react-hook-form';
import { useCallback, useEffect, useState } from 'react';
import { Medication, MedicationRepository } from '@/database';
import { Spacing } from '@/constants';
import { Button, Input, DateInput, ImagePickerInput } from '@/components';
import { useMedicationStore } from '../store/useMedicationStore';
import { useMedicationForm } from '../hooks/useMedicationForm';
import { MedicationFormValues } from '../types';
import { useTheme } from '@/hooks/useTheme';

// ─── Component ────────────────────────────────────────────────────────────────

export function EditMedicationScreen() {
  const { colors, typography } = useTheme();
  const styles = getStyles(colors, typography);
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const medicationId = Number(id);

  // ─── Store ───────────────────────────────────────────────────────────────
  const medications = useMedicationStore((s) => s.medications);
  const updateMedication = useMedicationStore((s) => s.updateMedication);
  const isLoading = useMedicationStore((s) => s.isLoading);

  // ─── Local resolved medication ────────────────────────────────────────────
  const [fetchedMedication, setFetchedMedication] = useState<Medication | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [formReady, setFormReady] = useState(false);

  // Derive medication synchronously if available
  const storeMedication = medications.find((m) => m.id === medicationId) || null;
  const medication = storeMedication || fetchedMedication;

  // ─── Form (initialized with empty defaults; reset when medication resolves) ─
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useMedicationForm();

  // ─── Resolve medication & pre-populate form ───────────────────────────────

  useEffect(() => {
    // Only fetch if not found in store and not already fetched
    if (!storeMedication && !fetchedMedication) {
      (async () => {
        try {
          const fetched = await MedicationRepository.findById(medicationId);
          if (fetched) {
            setFetchedMedication(fetched);
          } else {
            setFetchError('Medication not found.');
          }
        } catch {
          setFetchError('Failed to load medication.');
        }
      })();
    }
  }, [medicationId, storeMedication, fetchedMedication]);

  // Pre-populate form once medication is resolved
  useEffect(() => {
    if (medication && !formReady) {
      // setTimeout avoids synchronous state update warnings when calling reset/setFormReady
      const timer = setTimeout(() => {
        reset({
          name: medication.name,
          dosage: medication.dosage,
          expirationDate: medication.expirationDate,
          presentation: medication.presentation ?? '',
          notes: medication.notes ?? '',
          quantityAvailable:
            medication.quantityAvailable !== null ? String(medication.quantityAvailable) : '',
          lowStockThreshold:
            medication.lowStockThreshold !== null ? String(medication.lowStockThreshold) : '',
          photoPath: medication.photoPath ?? '',
        });
        setFormReady(true);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [medication, formReady, reset]);

  // ─── Submit ───────────────────────────────────────────────────────────────

  const onSubmit = useCallback(
    async (values: MedicationFormValues) => {
      try {
        await updateMedication(medicationId, {
          name: values.name.trim(),
          dosage: values.dosage.trim(),
          expirationDate: values.expirationDate.trim(),
          presentation: values.presentation.trim() || null,
          notes: values.notes.trim() || null,
          quantityAvailable: values.quantityAvailable.trim()
            ? Number(values.quantityAvailable)
            : null,
          lowStockThreshold: values.lowStockThreshold.trim()
            ? Number(values.lowStockThreshold)
            : null,
          photoPath: values.photoPath.trim() || null,
        });
        router.back();
      } catch {
        Alert.alert('Error', 'Failed to update medication. Please try again.');
      }
    },
    [updateMedication, medicationId, router],
  );

  const isBusy = isLoading || isSubmitting;

  // ─── Render: error ────────────────────────────────────────────────────────

  if (fetchError) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.centered}>
          <Text style={styles.errorText}>{fetchError}</Text>
          <Button label="Go Back" onPress={() => router.back()} variant="outline" />
        </View>
      </SafeAreaView>
    );
  }

  // ─── Render: loading (before medication resolves) ─────────────────────────

  if (!medication || !formReady) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.centered}>
          <Text style={styles.loadingText}>Loading…</Text>
        </View>
      </SafeAreaView>
    );
  }

  // ─── Render: form ─────────────────────────────────────────────────────────

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* ── Navigation header ── */}
      <View style={styles.navHeader}>
        <Button label="← Cancel" onPress={() => router.back()} variant="outline" />
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.screenTitle} accessibilityRole="header">
            Edit Medication
          </Text>
          <Text style={styles.screenSubtitle}>
            Update the details for {medication.name}.
          </Text>

          <View style={styles.photoSection}>
            <Controller
              control={control}
              name="photoPath"
              render={({ field: { onChange, value } }) => (
                <ImagePickerInput
                  value={value}
                  onChange={onChange}
                  errorMessage={errors.photoPath?.message}
                />
              )}
            />
          </View>

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
                />
              )}
            />

            <Controller
              control={control}
              name="lowStockThreshold"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Low Stock Threshold"
                  placeholder="e.g. 10"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  errorMessage={errors.lowStockThreshold?.message}
                  keyboardType="numeric"
                  returnKeyType="next"
                  accessibilityHint="Alert when quantity drops to or below this number"
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
                />
              )}
            />
          </View>

          {/* ── Submit ── */}
          <View style={styles.submitSection}>
            <Button
              label={isBusy ? 'Saving…' : 'Save Changes'}
              onPress={handleSubmit(onSubmit)}
              variant="primary"
              loading={isBusy}
              disabled={isBusy}
              accessibilityHint="Save the updated medication information"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const getStyles = (colors: any, typography: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.xl,
  },
  loadingText: {
    ...typography.bodyMD,
    color: colors.textSecondary,
  },
  errorText: {
    ...typography.bodyMD,
    color: colors.error,
    textAlign: 'center',
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
    ...typography.headingXL,
    color: colors.textPrimary,
    marginBottom: Spacing.xxs,
  },
  screenSubtitle: {
    ...typography.bodyMD,
    color: colors.textSecondary,
    marginBottom: Spacing.xs,
  },

  // Section
  photoSection: {
    alignItems: 'center',
    marginVertical: Spacing.sm,
  },
  section: {
    gap: Spacing.md,
  },
  sectionLabel: {
    ...typography.bodySM,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },

  // Submit
  submitSection: {
    marginTop: Spacing.md,
  },
});
