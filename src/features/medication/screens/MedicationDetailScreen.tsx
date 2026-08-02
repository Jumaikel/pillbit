/**
 * MedicationDetailScreen
 *
 * Displays all available information for a single medication.
 * Route: /medications/[id]
 */

import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Medication, MedicationRepository } from '@/database';
import { Spacing } from '@/constants';
import { Button, Card } from '@/components';
import { useMedicationStore } from '../store/useMedicationStore';
import { MedicationStatusBadge } from '../components/MedicationStatusBadge';
import { formatExpirationDate } from '../utils/medicationUtils';
import { DoseTodayPanel } from '@/features/history/components/DoseTodayPanel';
import { useInventoryStore, InventoryIndicator, InventoryService } from '@/features/inventory';
import { useTheme } from '@/hooks/useTheme';
import { useAIStore } from '@/features/ai/store/useAIStore';
import { SpeechService } from '@/services/SpeechService';
import { useConfigStore } from '@/store/useConfigStore';
import { useTranslation } from 'react-i18next';

export function MedicationDetailScreen() {
  const { colors, typography } = useTheme();
  const styles = getStyles(colors, typography);
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const medicationId = Number(id);
  const { settings } = useConfigStore();
  const { t } = useTranslation();

  // Stores
  const medications = useMedicationStore((s) => s.medications);
  const deleteMedication = useMedicationStore((s) => s.deleteMedication);
  const isLoading = useMedicationStore((s) => s.isLoading);
  
  const { 
    cache: aiCache, 
    isLoading: aiLoading, 
    error: aiError, 
    loadMedicationInfo, 
    generateMedicationInfo 
  } = useAIStore();

  // Local state
  const [fetchedMedication, setFetchedMedication] = useState<Medication | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isReading, setIsReading] = useState(false);

  const storeMedication = medications.find((m) => m.id === medicationId) || null;
  const medication = storeMedication || fetchedMedication;
  
  const aiInfo = aiCache[medicationId];
  
  const inventoryItems = useInventoryStore((s) => s.inventoryItems);
  const enrichedInventoryState = inventoryItems.find((item) => item.id === medicationId);
  const inventoryStatus = enrichedInventoryState?.inventoryStatus ?? 
    (medication ? InventoryService.calculateInventoryStatus(medication.quantityAvailable) : 'untracked');

  // Resolve medication and AI info
  useEffect(() => {
    if (!storeMedication && !fetchedMedication) {
      (async () => {
        try {
          const fetched = await MedicationRepository.findById(medicationId);
          if (fetched) setFetchedMedication(fetched);
          else setFetchError(t('medications.details.notFound'));
        } catch {
          setFetchError(t('medications.details.loadError'));
        }
      })();
    }
  }, [medicationId, storeMedication, fetchedMedication]);

  useEffect(() => {
    if (settings?.isAiEnabled) {
      loadMedicationInfo(medicationId);
    }
  }, [medicationId, settings?.isAiEnabled, loadMedicationInfo]);

  // Handlers
  const handleEdit = useCallback(() => router.push(`/medications/${medicationId}/edit` as never), [router, medicationId]);

  const handleDelete = useCallback(() => {
    Alert.alert(
      t('medications.details.alertDeleteTitle'),
      t('medications.details.alertDeleteDesc', { name: medication?.name ?? '' }),
      [
        { text: t('medications.details.alertDeleteBtnCancel'), style: 'cancel' },
        {
          text: t('medications.details.alertDeleteBtnConfirm'),
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteMedication(medicationId);
              router.back();
            } catch {
              Alert.alert(t('medications.list.errorTitle'), t('medications.details.alertDeleteError'));
            }
          },
        },
      ],
    );
  }, [deleteMedication, medicationId, medication?.name, router]);


  const handleGenerateAI = () => {
      if (medication) {
          generateMedicationInfo(medicationId, medication.name, true);
      }
  };
  
  const handleReadAI = async () => {
      if (isReading) {
          await SpeechService.stop();
          setIsReading(false);
          return;
      }
      
      if (aiInfo) {
          setIsReading(true);
          const textToRead = `
            Description: ${aiInfo.description || 'none'}. 
            Dosage and Administration: ${aiInfo.dosageAdministration || 'none'}.
            Common Uses: ${aiInfo.commonUses || 'none'}. 
            Contraindications: ${aiInfo.contraindications || 'none'}. 
            Side Effects: ${aiInfo.sideEffects || 'none'}. 
            Warnings: ${aiInfo.warnings || 'none'}. 
            Interactions: ${aiInfo.interactions || 'none'}.
          `;
          await SpeechService.read(textToRead);
          // Assuming we have to manually turn it off if we don't have event listeners setup
          setTimeout(() => setIsReading(false), 5000); 
      }
  };

  if (fetchError) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.centered}>
          <Text style={styles.errorText}>{fetchError}</Text>
          <Button label={t('medications.details.btnGoBack')} onPress={() => router.back()} variant="outline" />
        </View>
      </SafeAreaView>
    );
  }

  if (!medication) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.centered}><Text style={styles.loadingText}>{t('medications.list.loading')}</Text></View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.navHeader}>
        <Button label={t('medications.details.btnBack')} onPress={() => router.back()} variant="outline" />
        <Button label={t('medications.details.btnEdit')} onPress={handleEdit} variant="secondary" />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {medication.photoPath && (
          <View style={styles.photoContainer}>
            <Image source={{ uri: medication.photoPath }} style={styles.photo} contentFit="cover" />
          </View>
        )}

        <View style={styles.titleBlock}>
          <Text style={styles.title} accessibilityRole="header">{medication.name}</Text>
          <Text style={styles.dosage}>{medication.dosage}</Text>
          <View style={styles.badgeRow}>
            <MedicationStatusBadge expirationDate={medication.expirationDate} />
            <View style={styles.badgeSpacer} />
            <InventoryIndicator quantity={medication.quantityAvailable} status={inventoryStatus} />
          </View>
        </View>

        <View style={styles.quickActions}>
          <DoseTodayPanel medicationId={medicationId} medicationName={medication.name} />
        </View>

        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>{t('medications.details.management')}</Text>
          <Button label={t('medications.details.btnManageReminders')} onPress={() => router.push(`/medications/${medicationId}/reminders` as never)} variant="secondary" />
          <Button
            label={t('doseLog.btnHistory')}
            onPress={() => router.push(`/medications/${medicationId}/dose-history` as never)}
            variant="outline"
            style={{ marginTop: Spacing.xs }}
          />
        </View>

        <Card padded>
          <DetailRow label={t('medications.details.lblDosage')} value={medication.dosage} styles={styles} />
          <Divider styles={styles} />
          <DetailRow label={t('medications.details.lblPresentation')} value={medication.presentation} styles={styles} />
          <Divider styles={styles} />
          <DetailRow label={t('medications.details.lblExpiration')} value={formatExpirationDate(medication.expirationDate)} styles={styles} />
          <Divider styles={styles} />
          <DetailRow label={t('medications.details.lblQuantity')} value={medication.quantityAvailable !== null ? `${medication.quantityAvailable} ${t('medications.common.units')}` : null} styles={styles} />

        </Card>

        {settings?.isAiEnabled && (
          <View style={styles.aiSection}>
            <View style={styles.aiHeader}>
                <Text style={styles.sectionTitle}>{t('medications.details.aiTitle')}</Text>
                {aiInfo && settings.isTextToSpeechEnabled && (
                   <Button label={isReading ? t('medications.details.btnStopReading') : t('medications.details.btnReadInfo')} onPress={handleReadAI} variant="outline" />
                )}
            </View>
            <Card padded>
                {aiLoading ? (
                    <Text style={styles.loadingText}>{t('medications.details.lblGenerating')}</Text>
                ) : aiError ? (
                    <View>
                       <Text style={styles.errorText}>{aiError}</Text>
                       <Button label={t('medications.details.btnTryAgain')} onPress={handleGenerateAI} style={{marginTop: 8}} />
                    </View>
                ) : aiInfo ? (
                    <View style={styles.aiContent}>
                        <DetailRow label={t('medications.details.lblDescription')} value={aiInfo.description} styles={styles} vertical />
                        <Divider styles={styles} />
                        <DetailRow label={t('medications.details.lblDosageAdministration')} value={aiInfo.dosageAdministration} styles={styles} vertical />
                        <Divider styles={styles} />
                        <DetailRow label={t('medications.details.lblCommonUses')} value={aiInfo.commonUses} styles={styles} vertical />
                        <Divider styles={styles} />
                        <DetailRow label={t('medications.details.lblSideEffects')} value={aiInfo.sideEffects} styles={styles} vertical />
                        <Divider styles={styles} />
                        <DetailRow label={t('medications.details.lblContraindications')} value={aiInfo.contraindications} styles={styles} vertical />
                        <Divider styles={styles} />
                        <DetailRow label={t('medications.details.lblWarnings')} value={aiInfo.warnings} styles={styles} vertical />
                        <Divider styles={styles} />
                        <DetailRow label={t('medications.details.lblInteractions')} value={aiInfo.interactions} styles={styles} vertical />
                        
                        <Text style={styles.disclaimerText}>{t('medications.details.disclaimerMedical')}</Text>
                        
                        <Button label={t('medications.details.btnRegenerate')} onPress={handleGenerateAI} variant="outline" style={{marginTop: 16}} />
                    </View>
                ) : (
                    <Button label={t('medications.details.btnGenerateAI')} onPress={handleGenerateAI} variant="secondary" />
                )}
            </Card>
          </View>
        )}

        {medication.notes && (
          <Card padded style={styles.notesCard}>
            <Text style={styles.notesLabel}>{t('medications.details.lblNotes')}</Text>
            <Text style={styles.notesText}>{medication.notes}</Text>
          </Card>
        )}

        <Card padded>
          <DetailRow label={t('medications.details.lblAdded')} value={formatExpirationDate(medication.createdDatetime.split('T')[0])} styles={styles} />
          <Divider styles={styles} />
          <DetailRow label={t('medications.details.lblLastUpdated')} value={formatExpirationDate(medication.updatedDatetime.split('T')[0])} styles={styles} />
        </Card>

        <View style={styles.deleteSection}>
          <Button label={t('medications.details.btnDelete')} onPress={handleDelete} variant="outline" loading={isLoading} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Sub-components
function DetailRow({ label, value, styles, vertical }: { label: string; value: string | null | undefined, styles: any, vertical?: boolean }) {
  if (vertical) {
      return (
        <View style={styles.detailRowVertical}>
          <Text style={styles.detailLabel}>{label}</Text>
          <Text style={styles.detailValueVertical}>{value ?? '—'}</Text>
        </View>
      );
  }
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value ?? '—'}</Text>
    </View>
  );
}

function Divider({ styles }: { styles: any }) {
  return <View style={styles.divider} />;
}

// Styles
const getStyles = (colors: any, typography: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.md, paddingHorizontal: Spacing.xl },
  loadingText: { ...typography.bodyMD, color: colors.textSecondary },
  errorText: { ...typography.bodyMD, color: colors.error, textAlign: 'center' },
  navHeader: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: Spacing.md, paddingTop: Spacing.md, paddingBottom: Spacing.sm },
  scrollContent: { paddingHorizontal: Spacing.md, paddingBottom: Spacing.xxxl, gap: Spacing.md },
  photoContainer: { alignItems: 'center', marginBottom: Spacing.md },
  photo: { width: 160, height: 160, borderRadius: 80, borderWidth: 2, borderColor: colors.border },
  titleBlock: { gap: Spacing.xs, marginBottom: Spacing.xs },
  title: { ...typography.headingXL, color: colors.textPrimary },
  dosage: { ...typography.bodyLG, color: colors.textSecondary },
  badgeRow: { flexDirection: 'row', alignItems: 'center', marginTop: Spacing.xxs },
  badgeSpacer: { width: Spacing.sm },
  sectionTitle: { ...typography.headingMD, color: colors.textPrimary, marginBottom: Spacing.xs },
  quickActions: { marginBottom: Spacing.sm },
  logButtons: { flexDirection: 'row', gap: Spacing.xs },
  flexButton: { flex: 1 },
  notesCard: { gap: Spacing.xs },
  notesLabel: { ...typography.bodySM, fontWeight: '600', color: colors.textSecondary },
  notesText: { ...typography.bodyMD, color: colors.textPrimary },
  deleteSection: { marginTop: Spacing.sm },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: Spacing.xs },
  detailRowVertical: { flexDirection: 'column', alignItems: 'flex-start', paddingVertical: Spacing.xs, gap: 4 },
  detailLabel: { ...typography.bodySM, color: colors.textSecondary, flex: 1 },
  detailValue: { ...typography.bodyMD, color: colors.textPrimary, flex: 2, textAlign: 'right' },
  detailValueVertical: { ...typography.bodyMD, color: colors.textPrimary },
  divider: { height: 1, backgroundColor: colors.border },
  aiSection: { marginTop: Spacing.sm },
  aiHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.xs },
  aiContent: { gap: 4 },
  disclaimerText: { ...typography.bodySM, fontStyle: 'italic', color: colors.textSecondary, marginTop: Spacing.sm }
});
