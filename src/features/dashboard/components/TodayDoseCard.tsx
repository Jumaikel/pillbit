import { StyleSheet, Text, View } from 'react-native';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Spacing, Radius } from '@/constants';
import { TodayDose } from '../types';
import { Ionicons } from '@expo/vector-icons';
import { useHistoryStore } from '@/features/history/store/useHistoryStore';
import { useDashboardStore } from '../store/useDashboardStore';
import { useTheme } from '@/hooks/useTheme';

interface TodayDoseCardProps {
    dose: TodayDose;
}

export function TodayDoseCard({ dose }: TodayDoseCardProps) {
  const { colors, typography } = useTheme();
  const styles = getStyles(colors, typography);
    const { reminderId, reminderTime, medicationId, medicationName, dosage, status } = dose;
    const registerConsumption = useHistoryStore((s) => s.registerConsumption);
    const loadDashboard = useDashboardStore((s) => s.loadDashboard);

    const handleTake = async () => {
        try {
            await registerConsumption(medicationId, 'taken', 1, reminderId);
            await loadDashboard();
        } catch (e) {
            console.error(e);
        }
    };

    const handleSkip = async () => {
        try {
            await registerConsumption(medicationId, 'skipped', 0, reminderId);
            await loadDashboard();
        } catch (e) {
            console.error(e);
        }
    };

    const isPending = status === null;
    const isTaken = status === 'taken';

    // Format time from HH:MM to readable format
    const [hours, minutes] = reminderTime.split(':');
    const timeDate = new Date();
    timeDate.setHours(parseInt(hours, 10), parseInt(minutes, 10));
    const formattedTime = timeDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <Card style={styles.container}>
            <View style={styles.header}>
                <View style={styles.timeContainer}>
                    <Ionicons name="time-outline" size={16} color={colors.textSecondary} />
                    <Text style={styles.timeText}>{formattedTime}</Text>
                </View>
                {!isPending && (
                    <View style={[styles.statusBadge, isTaken ? styles.statusTaken : styles.statusSkipped]}>
                        <Text style={[styles.statusText, isTaken ? styles.statusTextTaken : styles.statusTextSkipped]}>
                            {isTaken ? 'Tomado' : 'Omitido'}
                        </Text>
                    </View>
                )}
            </View>

            <View style={styles.detailsContainer}>
                <Text style={styles.nameText} numberOfLines={1}>{medicationName}</Text>
                <Text style={styles.dosageText}>{dosage}</Text>
            </View>

            {isPending && (
                <View style={styles.actionsContainer}>
                    <Button
                        label="Tomar"
                        onPress={handleTake}
                        style={styles.actionButton}
                    />
                    <Button
                        label="Omitir"
                        onPress={handleSkip}
                        variant="outline"
                        style={styles.actionButton}
                    />
                </View>
            )}
        </Card>
    );
}

const getStyles = (colors: any, typography: any) => StyleSheet.create({
    container: {
        marginBottom: Spacing.sm,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.xs,
    },
    timeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.xxs,
    },
    timeText: {
        ...typography.bodySM,
        color: colors.textSecondary,
        fontWeight: '600',
    },
    detailsContainer: {
        marginBottom: Spacing.sm,
    },
    nameText: {
        ...typography.headingMD,
        color: colors.textPrimary,
        marginBottom: 2,
    },
    dosageText: {
        ...typography.bodyMD,
        color: colors.textSecondary,
    },
    actionsContainer: {
        flexDirection: 'row',
        gap: Spacing.sm,
    },
    actionButton: {
        flex: 1,
    },
    statusBadge: {
        paddingHorizontal: Spacing.sm,
        paddingVertical: 2,
        borderRadius: Radius.full,
    },
    statusTaken: {
        backgroundColor: '#E8F5E9',
    },
    statusSkipped: {
        backgroundColor: '#FFEBEE',
    },
    statusText: {
        ...typography.caption,
        fontWeight: '600',
    },
    statusTextTaken: {
        color: colors.success,
    },
    statusTextSkipped: {
        color: colors.error,
    },
});
