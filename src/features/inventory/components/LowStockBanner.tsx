/**
 * LowStockBanner
 *
 * Banner displayed on the home/dashboard screen when one or more medications
 * are low on stock or empty. Provides a quick-access link to the
 * LowStockMedicationsScreen.
 *
 * Purely presentational — accepts count and onPress as props.
 * Do not include store access here; consume via the parent screen.
 */

import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Spacing, Radius } from '@/constants';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from 'react-i18next';

// ─── Types ────────────────────────────────────────────────────────────────────

interface LowStockBannerProps {
    /** Total count of low-stock + empty medications */
    count: number;
    /** Whether any of the count are 'empty' */
    hasEmpty?: boolean;
    /** Called when the user taps the banner */
    onPress: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function LowStockBanner({ count, hasEmpty = false, onPress }: LowStockBannerProps) {
  const { colors, typography } = useTheme();
  const styles = getStyles(colors, typography);
  const { t } = useTranslation();

    if (count === 0) return null;

    const bgColor = hasEmpty ? '#FEE9E7' : '#FFF5E0';
    const borderColor = hasEmpty ? colors.error : colors.warning;
    const iconText = hasEmpty ? '🚨' : '⚠️';
    const titleText = hasEmpty
        ? t('dashboard.lowStock.outOfStock', { count })
        : t('dashboard.lowStock.runningLow', { count });

    return (
        <TouchableOpacity
            style={[styles.banner, { backgroundColor: bgColor, borderColor }]}
            onPress={onPress}
            accessibilityRole="button"
            accessibilityLabel={t('dashboard.lowStock.tapToView', { title: titleText })}
        >
            <View style={styles.content}>
                <Text style={styles.icon}>{iconText}</Text>
                <View style={styles.textContainer}>
                    <Text
                        style={[
                            styles.title,
                            { color: hasEmpty ? colors.error : colors.warning },
                        ]}
                    >
                        {titleText}
                    </Text>
                    <Text style={styles.subtitle}>{t('dashboard.lowStock.tapToManage')}</Text>
                </View>
                <Text style={[styles.arrow, { color: hasEmpty ? colors.error : colors.warning }]}>
                    →
                </Text>
            </View>
        </TouchableOpacity>
    );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const getStyles = (colors: any, typography: any) => StyleSheet.create({
    banner: {
        borderRadius: Radius.md,
        borderWidth: 1,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        marginBottom: Spacing.md,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    icon: {
        fontSize: 20,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        ...typography.bodySM,
        fontWeight: '700',
    },
    subtitle: {
        ...typography.caption,
        color: colors.textSecondary,
        marginTop: 2,
    },
    arrow: {
        ...typography.bodyMD,
        fontWeight: '700',
    },
});
