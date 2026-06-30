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
import { LightColors, Typography, Spacing, Radius } from '@/constants';

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
    if (count === 0) return null;

    const bgColor = hasEmpty ? '#FEE9E7' : '#FFF5E0';
    const borderColor = hasEmpty ? LightColors.error : LightColors.warning;
    const iconText = hasEmpty ? '🚨' : '⚠️';
    const titleText = hasEmpty
        ? count === 1
            ? '1 medication is out of stock'
            : `${count} medications need attention`
        : count === 1
            ? '1 medication is running low'
            : `${count} medications are running low`;

    return (
        <TouchableOpacity
            style={[styles.banner, { backgroundColor: bgColor, borderColor }]}
            onPress={onPress}
            accessibilityRole="button"
            accessibilityLabel={`${titleText}. Tap to view.`}
        >
            <View style={styles.content}>
                <Text style={styles.icon}>{iconText}</Text>
                <View style={styles.textContainer}>
                    <Text
                        style={[
                            styles.title,
                            { color: hasEmpty ? LightColors.error : LightColors.warning },
                        ]}
                    >
                        {titleText}
                    </Text>
                    <Text style={styles.subtitle}>Tap to manage inventory</Text>
                </View>
                <Text style={[styles.arrow, { color: hasEmpty ? LightColors.error : LightColors.warning }]}>
                    →
                </Text>
            </View>
        </TouchableOpacity>
    );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
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
        ...Typography.bodySM,
        fontWeight: '700',
    },
    subtitle: {
        ...Typography.caption,
        color: LightColors.textSecondary,
        marginTop: 2,
    },
    arrow: {
        ...Typography.bodyMD,
        fontWeight: '700',
    },
});
