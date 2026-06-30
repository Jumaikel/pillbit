/**
 * InventoryIndicator
 *
 * Compact inline indicator for use in medication list cards and detail screens.
 * Shows a colored dot + quantity text. Purely presentational.
 *
 * Usage:
 * ```tsx
 * <InventoryIndicator
 *   quantity={5}
 *   status="low_stock"
 *   threshold={10}
 * />
 * ```
 */

import { StyleSheet, Text, View } from 'react-native';
import { LightColors, Typography, Spacing } from '@/constants';
import { InventoryStatus } from '../types';

// ─── Types ────────────────────────────────────────────────────────────────────

interface InventoryIndicatorProps {
    quantity: number | null;
    status: InventoryStatus;
    /** Effective threshold used for status calculation */
    threshold?: number | null;
    /** Whether to show the threshold alongside the quantity */
    showThreshold?: boolean;
}

// ─── Color map ────────────────────────────────────────────────────────────────

const STATUS_DOT_COLOR: Record<InventoryStatus, string> = {
    normal: LightColors.success,
    low_stock: LightColors.warning,
    empty: LightColors.error,
    untracked: LightColors.textDisabled,
};

// ─── Component ────────────────────────────────────────────────────────────────

export function InventoryIndicator({
    quantity,
    status,
    threshold,
    showThreshold = false,
}: InventoryIndicatorProps) {
    const dotColor = STATUS_DOT_COLOR[status];

    let quantityText = 'Not tracked';
    if (quantity !== null && quantity !== undefined) {
        quantityText = `${quantity} units`;
        if (showThreshold && threshold !== null && threshold !== undefined) {
            quantityText += ` / ${threshold} threshold`;
        }
    }

    return (
        <View style={styles.container} accessibilityLabel={`Quantity: ${quantityText}`}>
            <View style={[styles.dot, { backgroundColor: dotColor }]} />
            <Text style={styles.text}>{quantityText}</Text>
        </View>
    );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.xxs,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    text: {
        ...Typography.bodySM,
        color: LightColors.textSecondary,
    },
});
