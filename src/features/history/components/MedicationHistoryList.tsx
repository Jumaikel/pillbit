/**
 * MedicationHistoryList
 *
 * Displays a paginated list of consumption records for a specific medication.
 * Includes a filter bar (All / Taken / Skipped / Postponed).
 *
 * Usage:
 * ```tsx
 * <MedicationHistoryList medicationId={42} />
 * ```
 */

// ─── Imports ──────────────────────────────────────────────────────────────────
import React, { useCallback, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Spacing, Radius } from '@/constants';
import { useTheme } from '@/hooks/useTheme';
import { useDoseLogStore } from '../store/useDoseLogStore';
import { ConsumptionStatus } from '@/database/models';
import { ConsumptionHistoryItem } from '@/database/queries/ConsumptionQueries';

// ─── Types ────────────────────────────────────────────────────────────────────
interface MedicationHistoryListProps {
    medicationId: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatDatetime(iso: string, lang: string): { date: string; time: string } {
    const d = new Date(iso);
    return {
        date: d.toLocaleDateString(lang, { weekday: 'short', month: 'short', day: 'numeric' }),
        time: d.toLocaleTimeString(lang, { hour: '2-digit', minute: '2-digit' }),
    };
}

// ─── HistoryItem sub-component ─────────────────────────────────────────────────
interface HistoryRowProps {
    item: ConsumptionHistoryItem;
}

function HistoryRow({ item }: HistoryRowProps) {
    const { colors, typography } = useTheme();
    const styles = getRowStyles(colors, typography);
    const { t, i18n } = useTranslation();

    const { date, time } = formatDatetime(item.actionDatetime, i18n.language);

    const statusConfig: Record<ConsumptionStatus, { icon: string; label: string; badgeBg: string; badgeColor: string }> = {
        taken: {
            icon: 'checkmark-circle',
            label: t('doseLog.statusTaken'),
            badgeBg: '#E8F8ED',
            badgeColor: colors.success,
        },
        skipped: {
            icon: 'close-circle',
            label: t('doseLog.statusSkipped'),
            badgeBg: '#FEE9E7',
            badgeColor: colors.error,
        },
        postponed: {
            icon: 'alarm-outline',
            label: t('doseLog.statusPostponed'),
            badgeBg: '#FFF5E0',
            badgeColor: colors.warning,
        },
    };

    const config = statusConfig[item.status];

    return (
        <View style={styles.row}>
            {/* Left color stripe */}
            <View style={[styles.stripe, { backgroundColor: config.badgeColor }]} />

            {/* Content */}
            <View style={styles.content}>
                <View style={styles.topRow}>
                    {/* Date / time */}
                    <View style={styles.datetimeBlock}>
                        <Text style={styles.dateText}>{date}</Text>
                        <Text style={styles.timeText}>{time}</Text>
                    </View>

                    {/* Status badge */}
                    <View style={[styles.badge, { backgroundColor: config.badgeBg }]}>
                        <Ionicons name={config.icon as any} size={13} color={config.badgeColor} />
                        <Text style={[styles.badgeText, { color: config.badgeColor }]}>
                            {config.label}
                        </Text>
                    </View>
                </View>

                {/* Postponed detail */}
                {item.status === 'postponed' && item.postponedReminderDatetime && (
                    <Text style={styles.postponeDetail}>
                        {t('doseLog.postponedAt', {
                            time: new Date(item.postponedReminderDatetime).toLocaleTimeString(i18n.language, {
                                hour: '2-digit',
                                minute: '2-digit',
                            }),
                        })}
                    </Text>
                )}
            </View>
        </View>
    );
}

// ─── FilterChip ────────────────────────────────────────────────────────────────
interface FilterChipProps {
    label: string;
    active: boolean;
    onPress: () => void;
}

function FilterChip({ label, active, onPress }: FilterChipProps) {
    const { colors, typography } = useTheme();
    const styles = getChipStyles(colors, typography);
    return (
        <TouchableOpacity
            style={[styles.chip, active && styles.chipActive]}
            onPress={onPress}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            accessibilityLabel={label}
            activeOpacity={0.75}
        >
            <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
        </TouchableOpacity>
    );
}

// ─── Component ────────────────────────────────────────────────────────────────
export function MedicationHistoryList({ medicationId }: MedicationHistoryListProps) {
    const { colors, typography } = useTheme();
    const styles = getStyles(colors, typography);
    const { t } = useTranslation();

    const history = useDoseLogStore((s) => s.history);
    const historyFilter = useDoseLogStore((s) => s.historyFilter);
    const isHistoryLoading = useDoseLogStore((s) => s.isHistoryLoading);
    const hasMoreHistory = useDoseLogStore((s) => s.hasMoreHistory);
    const loadHistory = useDoseLogStore((s) => s.loadHistory);
    const setHistoryFilter = useDoseLogStore((s) => s.setHistoryFilter);
    const loadMoreHistory = useDoseLogStore((s) => s.loadMoreHistory);

    useEffect(() => {
        loadHistory(medicationId, true);
    }, [medicationId, loadHistory]);

    const filters: Array<{ label: string; value: ConsumptionStatus | undefined }> = [
        { label: t('doseLog.filterAll'), value: undefined },
        { label: t('doseLog.filterTaken'), value: 'taken' },
        { label: t('doseLog.filterSkipped'), value: 'skipped' },
        { label: t('doseLog.filterPostponed'), value: 'postponed' },
    ];

    const handleFilterChange = useCallback(
        (filter: ConsumptionStatus | undefined) => {
            setHistoryFilter(medicationId, filter);
        },
        [medicationId, setHistoryFilter]
    );

    const handleEndReached = useCallback(() => {
        if (hasMoreHistory && !isHistoryLoading) {
            loadMoreHistory(medicationId);
        }
    }, [hasMoreHistory, isHistoryLoading, loadMoreHistory, medicationId]);

    const renderEmpty = useCallback(() => {
        if (isHistoryLoading) return null;
        return (
            <View style={styles.emptyContainer}>
                <Ionicons name="document-text-outline" size={48} color={colors.textDisabled} />
                <Text style={styles.emptyTitle}>{t('doseLog.emptyTitle')}</Text>
                <Text style={styles.emptyDesc}>{t('doseLog.emptyDesc')}</Text>
            </View>
        );
    }, [isHistoryLoading, colors, t, styles]);

    const renderFooter = useCallback(() => {
        if (!isHistoryLoading || history.length === 0) return null;
        return (
            <View style={styles.footerLoader}>
                <ActivityIndicator size="small" color={colors.primary} />
            </View>
        );
    }, [isHistoryLoading, history.length, colors]);

    return (
        <View style={styles.container}>
            {/* Filter bar */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filterBar}
                style={styles.filterBarContainer}
            >
                {filters.map((f) => (
                    <FilterChip
                        key={f.label}
                        label={f.label}
                        active={historyFilter === f.value}
                        onPress={() => handleFilterChange(f.value)}
                    />
                ))}
            </ScrollView>

            {/* List */}
            {isHistoryLoading && history.length === 0 ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            ) : (
                <FlatList
                    data={history}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => <HistoryRow item={item} />}
                    ListEmptyComponent={renderEmpty}
                    ListFooterComponent={renderFooter}
                    onEndReached={handleEndReached}
                    onEndReachedThreshold={0.3}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    style={styles.list}
                />
            )}
        </View>
    );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const getStyles = (colors: any, typography: any) =>
    StyleSheet.create({
        container: {
            flex: 1,
        },
        filterBarContainer: {
            flexGrow: 0,
        },
        filterBar: {
            paddingHorizontal: Spacing.md,
            paddingVertical: Spacing.xs,
            gap: Spacing.xs,
            flexDirection: 'row',
        },
        loadingContainer: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: Spacing.xxl,
        },
        list: {
            flex: 1,
        },
        listContent: {
            paddingHorizontal: Spacing.md,
            paddingBottom: Spacing.xl,
            paddingTop: Spacing.xs,
        },
        emptyContainer: {
            alignItems: 'center',
            paddingVertical: Spacing.xxl,
            gap: Spacing.sm,
            paddingHorizontal: Spacing.xl,
        },
        emptyTitle: {
            ...typography.headingMD,
            color: colors.textPrimary,
            textAlign: 'center',
        },
        emptyDesc: {
            ...typography.bodyMD,
            color: colors.textSecondary,
            textAlign: 'center',
        },
        footerLoader: {
            paddingVertical: Spacing.md,
            alignItems: 'center',
        },
    });

const getRowStyles = (colors: any, typography: any) =>
    StyleSheet.create({
        row: {
            flexDirection: 'row',
            backgroundColor: colors.surface,
            borderRadius: Radius.lg,
            marginBottom: Spacing.sm,
            overflow: 'hidden',
        },
        stripe: {
            width: 4,
        },
        content: {
            flex: 1,
            padding: Spacing.md,
            gap: Spacing.xxs,
        },
        topRow: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        datetimeBlock: {
            gap: 2,
        },
        dateText: {
            ...typography.bodySM,
            color: colors.textPrimary,
            fontWeight: '600',
        },
        timeText: {
            ...typography.caption,
            color: colors.textSecondary,
        },
        badge: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: Spacing.xxs,
            paddingHorizontal: Spacing.sm,
            paddingVertical: Spacing.xxs,
            borderRadius: Radius.full,
        },
        badgeText: {
            ...typography.caption,
            fontWeight: '700',
        },
        postponeDetail: {
            ...typography.caption,
            color: colors.warning,
            marginTop: 2,
        },
    });

const getChipStyles = (colors: any, typography: any) =>
    StyleSheet.create({
        chip: {
            paddingHorizontal: Spacing.md,
            paddingVertical: Spacing.xs,
            borderRadius: Radius.full,
            backgroundColor: colors.surfaceVariant,
            minHeight: 36,
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'flex-start',
            flexShrink: 0,
        },
        chipActive: {
            backgroundColor: colors.primaryContainer,
        },
        chipText: {
            ...typography.bodySM,
            color: colors.textSecondary,
            fontWeight: '600',
        },
        chipTextActive: {
            color: colors.primary,
        },
    });
