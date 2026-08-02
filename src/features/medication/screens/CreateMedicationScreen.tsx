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
import { Spacing } from '@/constants';
import { Button, Input, DateInput, ImagePickerInput, SelectInput } from '@/components';
import { useMedicationStore } from '../store/useMedicationStore';
import { useMedicationForm } from '../hooks/useMedicationForm';
import { MedicationFormValues } from '../types';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from 'react-i18next';

// ─── Component ────────────────────────────────────────────────────────────────

export function CreateMedicationScreen() {
  const { colors, typography } = useTheme();
  const styles = getStyles(colors, typography);
  const router = useRouter();
  const { t } = useTranslation();
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
        const id = await createMedication({
          name: values.name.trim(),
          dosage: values.dosage.trim(),
          expirationDate: values.expirationDate.trim(),
          presentation: values.presentation.trim() || null,
          notes: values.notes.trim() || null,
          quantityAvailable:
            values.quantityAvailable.trim() ? Number(values.quantityAvailable) : null,
          photoPath: values.photoPath.trim() || null,
        });
        
        // Navigate to the newly created medication details screen
        // Use replace instead of push so the back button from details doesn't go to the form again
        router.replace(`/medications/${id}` as any);
      } catch {
        Alert.alert(t('medications.list.errorTitle'), t('medications.form.errorSave'));
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
        <Button label={t('medications.form.btnCancel')} onPress={() => router.navigate('/(tabs)/medications' as never)} variant="outline" />
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
            {t('medications.form.titleAdd')}
          </Text>
          <Text style={styles.screenSubtitle}>
            {t('medications.form.subtitleAdd')}
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
            <Text style={styles.sectionLabel}>{t('medications.form.sectionRequired')}</Text>

            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label={t('medications.form.labelName')}
                  placeholder={t('medications.form.placeholderName')}
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
                  label={t('medications.form.labelDosage')}
                  placeholder={t('medications.form.placeholderDosage')}
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
                  label={t('medications.form.labelExpiration')}
                  value={value}
                  onChange={onChange}
                  errorMessage={errors.expirationDate?.message}
                />
              )}
            />
          </View>

          {/* ── Optional fields ── */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>{t('medications.form.sectionOptional')}</Text>

            <Controller
              control={control}
              name="presentation"
              render={({ field: { onChange, value } }) => (
                <SelectInput
                  label={t('medications.form.labelPresentation')}
                  placeholder={t('medications.form.placeholderPresentation')}
                  value={value}
                  onChange={onChange}
                  errorMessage={errors.presentation?.message}
                  options={[
                    { label: t('medications.form.presentations.tablet'), value: t('medications.form.presentations.tablet') },
                    { label: t('medications.form.presentations.capsule'), value: t('medications.form.presentations.capsule') },
                    { label: t('medications.form.presentations.cream'), value: t('medications.form.presentations.cream') },
                    { label: t('medications.form.presentations.syrup'), value: t('medications.form.presentations.syrup') },
                    { label: t('medications.form.presentations.drops'), value: t('medications.form.presentations.drops') },
                    { label: t('medications.form.presentations.injection'), value: t('medications.form.presentations.injection') },
                    { label: t('medications.form.presentations.inhaler'), value: t('medications.form.presentations.inhaler') },
                    { label: t('medications.form.presentations.ointment'), value: t('medications.form.presentations.ointment') },
                    { label: t('medications.form.presentations.other'), value: t('medications.form.presentations.other') },
                  ]}
                />
              )}
            />

            <Controller
              control={control}
              name="quantityAvailable"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label={t('medications.form.labelQuantity')}
                  placeholder={t('medications.form.placeholderQuantity')}
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
              name="notes"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label={t('medications.form.labelNotes')}
                  placeholder={t('medications.form.placeholderNotes')}
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
              label={isBusy ? t('medications.form.btnSaving') : t('medications.form.btnSave')}
              onPress={handleSubmit(onSubmit)}
              variant="primary"
              loading={isBusy}
              disabled={isBusy}
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
