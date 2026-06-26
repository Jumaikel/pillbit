/**
 * MedicationDetailScreen
 *
 * Displays all available information for a single medication.
 * Route: /medications/[id]
 *
 * Responsibilities:
 *  - Read `id` from route params
 *  - Find the medication in the Zustand store (or fetch via repository as fallback)
 *  - Display all fields with graceful null handling
 *  - Provide Edit and Delete actions
 *  - Delete requires Alert confirmation before execution
 */

import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Medication, MedicationRepository } from '@/database';
import { LightColors, Typography, Spacing } from '@/constants';
import { Button, Card } from '@/components';
import { useMedicationStore } from '../store/useMedicationStore';
import { MedicationStatusBadge } from '../components/MedicationStatusBadge';
import { formatExpirationDate } from '../utils/medicationUtils';

// ─── Component ────────────────────────────────────────────────────────────────

export function MedicationDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const medicationId = Number(id);

  // ─── Store ───────────────────────────────────────────────────────────────
  const medications = useMedicationStore((s) => s.medications);
  const deleteMedication = useMedicationStore((s) => s.deleteMedication);
  const isLoading = useMedicationStore((s) => s.isLoading);

  // ─── Local state (for fallback fetch if store is empty) ──────────────────
  const [fetchedMedication, setFetchedMedication] = useState<Medication | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Derive medication synchronously if available
  const storeMedication = medications.find((m) => m.id === medicationId) || null;
  const medication = storeMedication || fetchedMedication;

  // ─── Resolve medication ───────────────────────────────────────────────────

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

  // ─── Handlers ────────────────────────────────────────────────────────────

  const handleEdit = useCallback(() => {
    router.push(`/medications/${medicationId}/edit` as never);
  }, [router, medicationId]);

  const handleDelete = useCallback(() => {
    Alert.alert(
      'Delete Medication',
      `Are you sure you want to delete "${medication?.name ?? 'this medication'}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteMedication(medicationId);
              router.back();
            } catch {
              Alert.alert('Error', 'Failed to delete medication. Please try again.');
            }
          },
        },
      ],
    );
  }, [deleteMedication, medicationId, medication?.name, router]);

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

  // ─── Render: loading ──────────────────────────────────────────────────────

  if (!medication) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.centered}>
          <Text style={styles.loadingText}>Loading…</Text>
        </View>
      </SafeAreaView>
    );
  }

  // ─── Render: detail ───────────────────────────────────────────────────────

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* ── Navigation header ── */}
      <View style={styles.navHeader}>
        <Button label="← Back" onPress={() => router.back()} variant="outline" />
        <Button label="Edit" onPress={handleEdit} variant="secondary" />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Photo block ── */}
        {medication.photoPath && (
          <View style={styles.photoContainer}>
            <Image
              source={{ uri: medication.photoPath }}
              style={styles.photo}
              contentFit="cover"
            />
          </View>
        )}

        {/* ── Title block ── */}
        <View style={styles.titleBlock}>
          <Text style={styles.title} accessibilityRole="header">
            {medication.name}
          </Text>
          <Text style={styles.dosage}>{medication.dosage}</Text>
          <View style={styles.badgeRow}>
            <MedicationStatusBadge expirationDate={medication.expirationDate} />
          </View>
        </View>

        {/* ── Info card ── */}
        <Card padded>
          <DetailRow label="Dosage" value={medication.dosage} />
          <Divider />
          <DetailRow label="Presentation" value={medication.presentation} />
          <Divider />
          <DetailRow
            label="Expiration Date"
            value={formatExpirationDate(medication.expirationDate)}
          />
          <Divider />
          <DetailRow
            label="Quantity Available"
            value={
              medication.quantityAvailable !== null
                ? `${medication.quantityAvailable} units`
                : null
            }
          />
          <Divider />
          <DetailRow
            label="Low Stock Threshold"
            value={
              medication.lowStockThreshold !== null
                ? `${medication.lowStockThreshold} units`
                : null
            }
          />
        </Card>

        {/* ── Notes card ── */}
        {medication.notes && (
          <Card padded style={styles.notesCard}>
            <Text style={styles.notesLabel}>Notes</Text>
            <Text style={styles.notesText}>{medication.notes}</Text>
          </Card>
        )}

        {/* ── Metadata card ── */}
        <Card padded style={styles.metaCard}>
          <DetailRow
            label="Added"
            value={formatExpirationDate(medication.createdDatetime.split('T')[0])}
          />
          <Divider />
          <DetailRow
            label="Last Updated"
            value={formatExpirationDate(medication.updatedDatetime.split('T')[0])}
          />
        </Card>

        {/* ── Delete action ── */}
        <View style={styles.deleteSection}>
          <Button
            label="Delete Medication"
            onPress={handleDelete}
            variant="outline"
            loading={isLoading}
            accessibilityHint="Deletes this medication after confirmation"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function DetailRow({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <View style={detailStyles.row}>
      <Text style={detailStyles.label}>{label}</Text>
      <Text style={detailStyles.value}>{value ?? '—'}</Text>
    </View>
  );
}

function Divider() {
  return <View style={detailStyles.divider} />;
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: LightColors.background,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.xl,
  },
  loadingText: {
    ...Typography.bodyMD,
    color: LightColors.textSecondary,
  },
  errorText: {
    ...Typography.bodyMD,
    color: LightColors.error,
    textAlign: 'center',
  },

  // Nav header
  navHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },

  // Scroll
  scrollContent: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xxxl,
    gap: Spacing.md,
  },

  // Photo
  photoContainer: {
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  photo: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 2,
    borderColor: LightColors.border,
  },

  // Title block
  titleBlock: {
    gap: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  title: {
    ...Typography.headingXL,
    color: LightColors.textPrimary,
  },
  dosage: {
    ...Typography.bodyLG,
    color: LightColors.textSecondary,
  },
  badgeRow: {
    marginTop: Spacing.xxs,
  },

  // Notes
  notesCard: {
    gap: Spacing.xs,
  },
  notesLabel: {
    ...Typography.bodySM,
    fontWeight: '600',
    color: LightColors.textSecondary,
  },
  notesText: {
    ...Typography.bodyMD,
    color: LightColors.textPrimary,
  },

  // Meta
  metaCard: {},

  // Delete
  deleteSection: {
    marginTop: Spacing.sm,
  },
});

const detailStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
  },
  label: {
    ...Typography.bodySM,
    color: LightColors.textSecondary,
    flex: 1,
  },
  value: {
    ...Typography.bodyMD,
    color: LightColors.textPrimary,
    flex: 2,
    textAlign: 'right',
  },
  divider: {
    height: 1,
    backgroundColor: LightColors.border,
  },
});

