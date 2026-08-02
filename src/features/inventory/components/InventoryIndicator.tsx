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
 *   status="normal"
 * />
 * ```
 */

import { StyleSheet, Text, View } from 'react-native';
import { Spacing } from '@/constants';
import { InventoryStatus } from '../types';
import { useTheme } from '@/hooks/useTheme';

// ─── Types ────────────────────────────────────────────────────────────────────

interface InventoryIndicatorProps {
    quantity: number | null;
    status: InventoryStatus;
}

// ─── Color map ────────────────────────────────────────────────────────────────



// ─── Component ────────────────────────────────────────────────────────────────

export function InventoryIndicator({
    quantity,
    status,
}: InventoryIndicatorProps) {
  const { colors, typography } = useTheme();
  const styles = getStyles(colors, typography);

    const STATUS_DOT_COLOR: Record<InventoryStatus, string> = {
        normal: colors.success,
        empty: colors.error,
        untracked: colors.textDisabled,
    };

    const dotColor = STATUS_DOT_COLOR[status];

    let quantityText = 'Not tracked';
    if (quantity !== null && quantity !== undefined) {
        quantityText = `${quantity} units`;
    }

    return (
        <View style={styles.container} accessibilityLabel={`Quantity: ${quantityText}`}>
            <View style={[styles.dot, { backgroundColor: dotColor }]} />
            <Text style={styles.text}>{quantityText}</Text>
        </View>
    );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const getStyles = (colors: any, typography: any) => StyleSheet.create({
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
        ...typography.bodySM,
        color: colors.textSecondary,
    },
});
