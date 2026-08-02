/**
 * DoseTodayPanel
 *
 * Displays the list of today's scheduled doses for a specific medication.
 * Each reminder slot shows: scheduled time, action buttons (Take/Skip/Postpone),
 * and status badges once an action has been taken.
 *
 * Usage:
 * ```tsx
 * <DoseTodayPanel medicationId={42} medicationName="Aspirina" />
 * ```
 *
 * Accessibility:
 *  - All buttons have accessibilityRole="button" and descriptive labels
 *  - Status badges have accessibilityRole="text"
 */

// ─── Imports ──────────────────────────────────────────────────────────────────
import React, { useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Spacing, Radius, getShadowStyle } from '@/constants';
import { useTheme } from '@/hooks/useTheme';
import { useDoseLogStore } from '../store/useDoseLogStore';
import { MedicationTodayDose } from '../services/DoseLogService';
import { ConsumptionStatus } from '@/database/models';

// ─── Types ────────────────────────────────────────────────────────────────────
interface DoseTodayPanelProps {
    medicationId: number;
    medicationName: string;
}

// ─── Helper ───────────────────────────────────────────────────────────────────
function formatTime(isoOrHHMM: string): string {
    // HH:MM format
    if (/^\d{2}:\d{2}$/.test(isoOrHHMM)) {
        const [h, m] = isoOrHHMM.split(':');
        const d = new Date();
        d.setHours(parseInt(h, 10), parseInt(m, 10));
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    // ISO datetime
    return new Date(isoOrHHMM).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// ─── DoseItem sub-component ────────────────────────────────────────────────────
interface DoseItemProps {
    dose: MedicationTodayDose;
    onTake: () => void;
    onSkip: () => void;
}

function DoseItem({ dose, onTake, onSkip }: DoseItemProps) {
    const { colors, typography } = useTheme();
    const styles = getDoseItemStyles(colors, typography);
    const { t } = useTranslation();

    const isPending = dose.status === null;
    const isTaken = dose.status === 'taken';
    const isSkipped = dose.status === 'skipped';

    const scheduledTime = formatTime(dose.reminderTime);
    const actionTime = dose.actionDatetime ? formatTime(dose.actionDatetime) : null;

    return (
        <View style={styles.container}>
            {/* Time header */}
            <View style={styles.timeRow}>
                <Ionicons name="time-outline" size={15} color={colors.primary} />
                <Text style={styles.timeText} accessibilityRole="text">
                    {t('doseLog.scheduledFor', { time: scheduledTime })}
                </Text>
            </View>

            {/* Status / actions */}
            {isPending ? (
                <View style={styles.actionsRow}>
                    {/* Take button */}
                    <TouchableOpacity
                        style={[styles.actionBtn, styles.btnTake]}
                        onPress={onTake}
                        accessibilityRole="button"
                        accessibilityLabel={t('doseLog.btnTake')}
                        activeOpacity={0.75}
                    >
                        <Ionicons name="checkmark-circle-outline" size={16} color="#fff" />
                        <Text style={[styles.actionBtnText, styles.btnTakeText]}>
                            {t('doseLog.btnTake')}
                        </Text>
                    </TouchableOpacity>

                    {/* Skip button */}
                    <TouchableOpacity
                        style={[styles.actionBtn, styles.btnSkip]}
                        onPress={onSkip}
                        accessibilityRole="button"
                        accessibilityLabel={t('doseLog.btnSkip')}
                        activeOpacity={0.75}
                    >
                        <Ionicons name="close-circle-outline" size={16} color={colors.textSecondary} />
                        <Text style={[styles.actionBtnText, styles.btnSkipText]}>
                            {t('doseLog.btnSkip')}
                        </Text>
                    </TouchableOpacity>
                </View>
            ) : isTaken ? (
                <View style={[styles.statusBadge, styles.badgeTaken]}>
                    <Ionicons name="checkmark-circle" size={16} color={colors.success} />
                    <Text style={[styles.statusText, { color: colors.success }]}>
                        {actionTime ? t('doseLog.takenAt', { time: actionTime }) : t('doseLog.statusTaken')}
                    </Text>
                </View>
            ) : isSkipped ? (
                <View style={[styles.statusBadge, styles.badgeSkipped]}>
                    <Ionicons name="close-circle" size={16} color={colors.error} />
                    <Text style={[styles.statusText, { color: colors.error }]}>
                        {actionTime ? t('doseLog.skippedAt', { time: actionTime }) : t('doseLog.statusSkipped')}
                    </Text>
                </View>
            ) : null}
        </View>
    );
}

// ─── Component ────────────────────────────────────────────────────────────────
export function DoseTodayPanel({ medicationId, medicationName }: DoseTodayPanelProps) {
    const { colors, typography } = useTheme();
    const styles = getStyles(colors, typography);
    const { t } = useTranslation();

    const todayDoses = useDoseLogStore((s) => s.todayDoses);
    const isTodayLoading = useDoseLogStore((s) => s.isTodayLoading);
    const loadTodayDoses = useDoseLogStore((s) => s.loadTodayDoses);
    const logDose = useDoseLogStore((s) => s.logDose);
    const error = useDoseLogStore((s) => s.error);

    useFocusEffect(
        useCallback(() => {
            loadTodayDoses(medicationId);
        }, [medicationId, loadTodayDoses])
    );

    const handleAction = useCallback(
        async (dose: MedicationTodayDose, status: ConsumptionStatus) => {
            const scheduledDatetime = dose.scheduledDatetime ?? new Date().toISOString();
            try {
                await logDose(medicationId, dose.reminderId, status, scheduledDatetime);
            } catch {
                Alert.alert(t('common.error'), t('doseLog.errorLog'));
            }
        },
        [medicationId, logDose, t]
    );

    const confirmSkip = useCallback(
        (dose: MedicationTodayDose) => {
            Alert.alert(
                t('doseLog.confirmSkipTitle'),
                t('doseLog.confirmSkipMessage'),
                [
                    { text: t('doseLog.confirmSkipCancel'), style: 'cancel' },
                    {
                        text: t('doseLog.confirmSkipConfirm'),
                        style: 'destructive',
                        onPress: () => handleAction(dose, 'skipped'),
                    },
                ]
            );
        },
        [handleAction, t]
    );

    return (
        <View style={styles.wrapper}>
            <Text style={styles.panelTitle} accessibilityRole="header">
                {t('doseLog.todayTitle')}
            </Text>

            {isTodayLoading ? (
                <ActivityIndicator color={colors.primary} style={styles.loader} />
            ) : todayDoses.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Ionicons name="calendar-outline" size={32} color={colors.textDisabled} />
                    <Text style={styles.emptyText}>{t('doseLog.noRemindersToday')}</Text>
                </View>
            ) : (
                todayDoses.map((dose) => (
                    <DoseItem
                        key={`${dose.reminderId}-${dose.reminderTime}`}
                        dose={dose}
                        onTake={() => handleAction(dose, 'taken')}
                        onSkip={() => confirmSkip(dose)}
                    />
                ))
            )}

            {!!error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const getStyles = (colors: any, typography: any) =>
    StyleSheet.create({
        wrapper: {
            gap: Spacing.sm,
        },
        panelTitle: {
            ...typography.headingMD,
            color: colors.textPrimary,
        },
        loader: {
            marginVertical: Spacing.md,
        },
        emptyContainer: {
            alignItems: 'center',
            paddingVertical: Spacing.lg,
            gap: Spacing.xs,
        },
        emptyText: {
            ...typography.bodyMD,
            color: colors.textSecondary,
            textAlign: 'center',
        },
        errorText: {
            ...typography.bodySM,
            color: colors.error,
        },
    });

const getDoseItemStyles = (colors: any, typography: any) =>
    StyleSheet.create({
        container: {
            backgroundColor: colors.surface,
            borderRadius: Radius.lg,
            padding: Spacing.md,
            gap: Spacing.sm,
            ...getShadowStyle('sm'),
            borderLeftWidth: 3,
            borderLeftColor: colors.primary,
        },
        timeRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: Spacing.xxs,
        },
        timeText: {
            ...typography.bodySM,
            color: colors.textSecondary,
            fontWeight: '600',
        },
        actionsRow: {
            flexDirection: 'row',
            gap: Spacing.xs,
        },
        actionBtn: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: Spacing.xxs,
            paddingVertical: Spacing.xs,
            paddingHorizontal: Spacing.xs,
            borderRadius: Radius.md,
            minHeight: 48,
        },
        btnTake: {
            backgroundColor: colors.success,
        },
        btnSkip: {
            backgroundColor: 'transparent',
            borderWidth: 1.5,
            borderColor: colors.surfaceVariant,
        },
        actionBtnText: {
            ...typography.bodySM,
            fontWeight: '700',
        },
        btnTakeText: {
            color: '#fff',
        },
        btnSkipText: {
            color: colors.textSecondary,
        },
        statusBadge: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: Spacing.xxs,
            paddingVertical: Spacing.xs,
            paddingHorizontal: Spacing.sm,
            borderRadius: Radius.full,
            alignSelf: 'flex-start',
        },
        badgeTaken: {
            backgroundColor: '#E8F8ED',
        },
        badgeSkipped: {
            backgroundColor: '#FEE9E7',
        },
        statusText: {
            ...typography.bodySM,
            fontWeight: '600',
        },
    });
