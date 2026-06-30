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
import { LightColors, Typography, Spacing, Radius } from '@/constants';
import { InventoryStatus } from '../types';

// ─── Types ────────────────────────────────────────────────────────────────────

interface InventoryBadgeProps {
    status: InventoryStatus;
    /** Optional quantity to display alongside the status label */
    quantity?: number | null;
    /** Whether to show the numeric quantity in the badge */
    showQuantity?: boolean;
}

// ─── Status → Style Map ───────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
    InventoryStatus,
    { label: string; background: string; text: string }
> = {
    normal: {
        label: 'In Stock',
        background: '#E8F8ED',
        text: LightColors.success,
    },
    low_stock: {
        label: 'Low Stock',
        background: '#FFF5E0',
        text: LightColors.warning,
    },
    empty: {
        label: 'Empty',
        background: '#FEE9E7',
        text: LightColors.error,
    },
    untracked: {
        label: 'Not Tracked',
        background: LightColors.surfaceVariant,
        text: LightColors.textSecondary,
    },
};

// ─── Component ────────────────────────────────────────────────────────────────

export function InventoryBadge({
    status,
    quantity,
    showQuantity = false,
}: InventoryBadgeProps) {
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

const styles = StyleSheet.create({
    badge: {
        borderRadius: Radius.full,
        paddingHorizontal: Spacing.sm,
        paddingVertical: Spacing.xxs,
        alignSelf: 'flex-start',
    },
    label: {
        ...Typography.caption,
        fontWeight: '600',
    },
});
