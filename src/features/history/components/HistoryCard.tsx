import { StyleSheet, Text, View } from 'react-native';
import { Card } from '@/components/Card';
import { LightColors, Typography, Spacing, Radius } from '@/constants';
import { ConsumptionHistoryItem } from '../types';

// ─── Status Map ───────────────────────────────────────────────────────────────

const statusConfig = {
    taken: {
        label: 'Taken',
        background: '#E8F8ED',
        text: LightColors.success,
    },
    postponed: {
        label: 'Postponed',
        background: '#FFF5E0',
        text: LightColors.warning,
    },
    skipped: {
        label: 'Skipped',
        background: '#FEE9E7',
        text: LightColors.error,
    },
};

// ─── Component ────────────────────────────────────────────────────────────────

interface HistoryCardProps {
    item: ConsumptionHistoryItem;
}

export function HistoryCard({ item }: HistoryCardProps) {
    const config = statusConfig[item.status];
    const dateObj = new Date(item.actionDatetime);
    const dateStr = dateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    const timeStr = dateObj.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

    return (
        <Card style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.medicationName} numberOfLines={1}>
                        {item.medicationName}
                    </Text>
                    <Text style={styles.dosage}>{item.medicationDosage}</Text>
                </View>

                <View style={[styles.badge, { backgroundColor: config.background }]}>
                    <Text style={[styles.badgeText, { color: config.text }]}>{config.label}</Text>
                </View>
            </View>

            <View style={styles.footer}>
                <Text style={styles.datetime}>
                    {dateStr} • {timeStr}
                </Text>
                {item.quantityConsumed > 1 && (
                    <Text style={styles.quantity}>Qty: {item.quantityConsumed}</Text>
                )}
            </View>
        </Card>
    );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    container: {
        marginBottom: Spacing.sm,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: Spacing.sm,
    },
    medicationName: {
        ...Typography.headingMD,
        color: LightColors.textPrimary,
        marginBottom: 2,
    },
    dosage: {
        ...Typography.bodySM,
        color: LightColors.textSecondary,
    },
    badge: {
        borderRadius: Radius.full,
        paddingHorizontal: Spacing.sm,
        paddingVertical: Spacing.xxs,
    },
    badgeText: {
        ...Typography.caption,
        fontWeight: '600',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: Spacing.xs,
        borderTopWidth: 1,
        borderTopColor: LightColors.surfaceVariant,
    },
    datetime: {
        ...Typography.caption,
        color: LightColors.textSecondary,
    },
    quantity: {
        ...Typography.caption,
        color: LightColors.textPrimary,
        fontWeight: '500',
    },
});
