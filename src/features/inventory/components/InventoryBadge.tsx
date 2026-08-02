/**
 * InventoryBadge
 *
 * Color-coded compact badge indicating the inventory status of a medication.
 * Purely presentational — accepts status as a prop.
 *
 * Usage:
 * ```tsx
 * <InventoryBadge status="low_stock" />
 * <InventoryBadge status="empty" quantity={0} />
 * ```
 */

import { StyleSheet, Text, View } from 'react-native';
import { Spacing, Radius } from '@/constants';
import { InventoryStatus } from '../types';
import { useTheme } from '@/hooks/useTheme';

// ─── Types ────────────────────────────────────────────────────────────────────

interface InventoryBadgeProps {
    status: InventoryStatus;
    /** Optional quantity to display alongside the status label */
    quantity?: number | null;
    /** Whether to show the numeric quantity in the badge */
    showQuantity?: boolean;
}

// ─── Status → Style Map ───────────────────────────────────────────────────────



// ─── Component ────────────────────────────────────────────────────────────────

export function InventoryBadge({
    status,
    quantity,
    showQuantity = false,
}: InventoryBadgeProps) {
  const { colors, typography } = useTheme();
  const styles = getStyles(colors, typography);

    const STATUS_CONFIG: Record<
        InventoryStatus,
        { label: string; background: string; text: string }
    > = {
        normal: {
            label: 'In Stock',
            background: '#E8F8ED',
            text: colors.success,
        },
        empty: {
            label: 'Empty',
            background: '#FEE9E7',
            text: colors.error,
        },
        untracked: {
            label: 'Not Tracked',
            background: colors.surfaceVariant,
            text: colors.textSecondary,
        },
    };

    const config = STATUS_CONFIG[status];

    const label =
        showQuantity && quantity !== null && quantity !== undefined
            ? `${config.label} · ${quantity}`
            : config.label;

    return (
        <View
            style={[styles.badge, { backgroundColor: config.background }]}
            accessibilityLabel={`Inventory status: ${config.label}`}
        >
            <Text style={[styles.label, { color: config.text }]}>{label}</Text>
        </View>
    );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const getStyles = (colors: any, typography: any) => StyleSheet.create({
    badge: {
        borderRadius: Radius.full,
        paddingHorizontal: Spacing.sm,
        paddingVertical: Spacing.xxs,
        alignSelf: 'flex-start',
    },
    label: {
        ...typography.caption,
        fontWeight: '600',
    },
});
