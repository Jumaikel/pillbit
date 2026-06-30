/**
 * InventoryStatusCard
 *
 * Card component displaying full inventory status for a single medication.
 * Shows medication name, current quantity, threshold, and status badge.
 * Used in the LowStockMedicationsScreen.
 *
 * Purely presentational — accepts data as props.
 */

import { StyleSheet, Text, View } from 'react-native';
import { Card } from '@/components/Card';
import { LightColors, Typography, Spacing } from '@/constants';
import { MedicationInventoryState } from '../types';
import { InventoryBadge } from './InventoryBadge';

// ─── Types ────────────────────────────────────────────────────────────────────

interface InventoryStatusCardProps {
    medication: MedicationInventoryState;
    onPress?: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function InventoryStatusCard({ medication, onPress }: InventoryStatusCardProps) {
    const { name, quantityAvailable, effectiveThreshold, inventoryStatus } = medication;

    const cardProps = onPress
        ? { onPress, accessibilityLabel: `View inventory for ${name}` }
        : {};

    const quantityLabel =
        quantityAvailable !== null ? `${quantityAvailable} units` : '—';
    const thresholdLabel =
        effectiveThreshold !== null ? `${effectiveThreshold} units` : '—';

    return (
        <Card style={styles.container} {...cardProps}>
            <View style={styles.header}>
                <Text style={styles.name} numberOfLines={1}>
                    {name}
                </Text>
                <InventoryBadge status={inventoryStatus} />
            </View>

            <View style={styles.details}>
                <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Available</Text>
                    <Text
                        style={[
                            styles.detailValue,
                            inventoryStatus === 'empty' && { color: LightColors.error },
                            inventoryStatus === 'low_stock' && { color: LightColors.warning },
                        ]}
                    >
                        {quantityLabel}
                    </Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Threshold</Text>
                    <Text style={styles.detailValue}>{thresholdLabel}</Text>
                </View>
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
        alignItems: 'center',
        marginBottom: Spacing.sm,
    },
    name: {
        ...Typography.headingMD,
        color: LightColors.textPrimary,
        flex: 1,
        marginRight: Spacing.sm,
    },
    details: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    detailItem: {
        flex: 1,
    },
    detailLabel: {
        ...Typography.caption,
        color: LightColors.textSecondary,
        marginBottom: 2,
    },
    detailValue: {
        ...Typography.bodyMD,
        fontWeight: '600',
        color: LightColors.textPrimary,
    },
    divider: {
        width: 1,
        height: 32,
        backgroundColor: LightColors.border,
        marginHorizontal: Spacing.md,
    },
});
