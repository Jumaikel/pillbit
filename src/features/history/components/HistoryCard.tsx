import { StyleSheet, Text, View } from 'react-native';
import { Card } from '@/components/Card';
import { Spacing, Radius } from '@/constants';
import { ConsumptionHistoryItem } from '../types';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from 'react-i18next';



// ─── Component ────────────────────────────────────────────────────────────────

interface HistoryCardProps {
    item: ConsumptionHistoryItem;
}

export function HistoryCard({ item }: HistoryCardProps) {
  const { colors, typography } = useTheme();
  const styles = getStyles(colors, typography);
  const { t, i18n } = useTranslation();
  
    const statusConfig = {
        taken: {
            label: t('history.status.taken'),
            background: '#E8F8ED',
            text: colors.success,
        },
        postponed: {
            label: t('history.status.postponed'),
            background: '#FFF5E0',
            text: colors.warning,
        },
        skipped: {
            label: t('history.status.skipped'),
            background: '#FEE9E7',
            text: colors.error,
        },
    };
    
    const config = statusConfig[item.status];
    const dateObj = new Date(item.actionDatetime);
    const dateStr = dateObj.toLocaleDateString(i18n.language, { month: 'short', day: 'numeric' });
    const timeStr = dateObj.toLocaleTimeString(i18n.language, { hour: '2-digit', minute: '2-digit' });

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
                    <Text style={styles.quantity}>{t('history.qty', { count: item.quantityConsumed })}</Text>
                )}
            </View>
        </Card>
    );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const getStyles = (colors: any, typography: any) => StyleSheet.create({
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
        ...typography.headingMD,
        color: colors.textPrimary,
        marginBottom: 2,
    },
    dosage: {
        ...typography.bodySM,
        color: colors.textSecondary,
    },
    badge: {
        borderRadius: Radius.full,
        paddingHorizontal: Spacing.sm,
        paddingVertical: Spacing.xxs,
    },
    badgeText: {
        ...typography.caption,
        fontWeight: '600',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: Spacing.xs,
        borderTopWidth: 1,
        borderTopColor: colors.surfaceVariant,
    },
    datetime: {
        ...typography.caption,
        color: colors.textSecondary,
    },
    quantity: {
        ...typography.caption,
        color: colors.textPrimary,
        fontWeight: '500',
    },
});
