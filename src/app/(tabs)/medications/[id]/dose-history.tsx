/**
 * DoseHistoryScreen
 *
 * Shows the full paginated dose history for a specific medication.
 * Route: /medications/[id]/dose-history
 */

import { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Spacing } from '@/constants';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/components';
import { MedicationHistoryList } from '@/features/history/components/MedicationHistoryList';
import { MedicationRepository } from '@/database/repositories/MedicationRepository';
import { useState } from 'react';
import { Medication } from '@/database/models';
import { useDoseLogStore } from '@/features/history/store/useDoseLogStore';

export default function DoseHistoryScreen() {
    const { colors, typography } = useTheme();
    const styles = getStyles(colors, typography);
    const router = useRouter();
    const { t } = useTranslation();
    const { id } = useLocalSearchParams<{ id: string }>();
    const medicationId = Number(id);

    const [medication, setMedication] = useState<Medication | null>(null);

    // Reset store history when leaving
    const loadHistory = useDoseLogStore((s) => s.loadHistory);

    useEffect(() => {
        (async () => {
            const med = await MedicationRepository.findById(medicationId);
            setMedication(med);
        })();
        loadHistory(medicationId, true);
    }, [medicationId, loadHistory]);

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <Button
                    label={t('medications.details.btnBack')}
                    onPress={() => router.back()}
                    variant="outline"
                />
                <View style={styles.titleBlock}>
                    <Text style={styles.title} accessibilityRole="header" numberOfLines={1}>
                        {t('doseLog.historyTitle')}
                    </Text>
                    {medication && (
                        <Text style={styles.subtitle} numberOfLines={1}>
                            {medication.name}
                        </Text>
                    )}
                </View>
            </View>

            <MedicationHistoryList medicationId={medicationId} />
        </SafeAreaView>
    );
}

const getStyles = (colors: any, typography: any) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: Spacing.md,
            paddingTop: Spacing.md,
            paddingBottom: Spacing.sm,
            gap: Spacing.sm,
        },
        titleBlock: {
            flex: 1,
        },
        title: {
            ...typography.headingMD,
            color: colors.textPrimary,
        },
        subtitle: {
            ...typography.bodySM,
            color: colors.textSecondary,
        },
    });
