/**
 * LowStockMedicationsScreen
 *
 * Displays all medications that are low on stock or empty.
 * Ordered by urgency: empty first, then ascending by quantity.
 *
 * Route: /medications/low-stock
 *
 * Features:
 *  - Loading state
 *  - Empty state (no medications need attention)
 *  - Pull-to-refresh
 *  - Ordered by urgency
 *  - Tapping a card navigates to medication detail
 */

import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useCallback, useEffect } from 'react';
import { LightColors, Typography, Spacing } from '@/constants';
import { Button, EmptyState } from '@/components';
import { useInventoryStore, selectLowStockMedications } from '../store/useInventoryStore';
import { InventoryStatusCard } from '../components/InventoryStatusCard';
import { MedicationInventoryState } from '../types';

// ─── Component ────────────────────────────────────────────────────────────────

export function LowStockMedicationsScreen() {
    const router = useRouter();

    const isLoading = useInventoryStore((s) => s.isLoading);
    const loadInventory = useInventoryStore((s) => s.loadInventory);
    const lowStockItems = useInventoryStore(selectLowStockMedications);

    // ─── Load on mount ────────────────────────────────────────────────────────

    useEffect(() => {
        loadInventory();
    }, [loadInventory]);

    // ─── Handlers ─────────────────────────────────────────────────────────────

    const handleRefresh = useCallback(async () => {
        await loadInventory();
    }, [loadInventory]);

    const handlePressItem = useCallback(
        (medicationId: number) => {
            router.push(`/medications/${medicationId}` as never);
        },
        [router],
    );

    // ─── Render item ──────────────────────────────────────────────────────────

    const renderItem = useCallback(
        ({ item }: { item: MedicationInventoryState }) => (
            <InventoryStatusCard
                medication={item}
                onPress={() => handlePressItem(item.id)}
            />
        ),
        [handlePressItem],
    );

    // ─── Render ───────────────────────────────────────────────────────────────

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* ── Navigation header ── */}
            <View style={styles.navHeader}>
                <Button label="← Back" onPress={() => router.back()} variant="outline" />
            </View>

            <View style={styles.titleBlock}>
                <Text style={styles.title} accessibilityRole="header">
                    Low Stock
                </Text>
                <Text style={styles.subtitle}>
                    {lowStockItems.length > 0
                        ? `${lowStockItems.length} medication${lowStockItems.length === 1 ? '' : 's'} need${lowStockItems.length === 1 ? 's' : ''} attention`
                        : 'All medications are well stocked'}
                </Text>
            </View>

            <FlatList
                data={lowStockItems}
                keyExtractor={(item) => String(item.id)}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={isLoading}
                        onRefresh={handleRefresh}
                        tintColor={LightColors.primary}
                    />
                }
                ListEmptyComponent={
                    !isLoading ? (
                        <EmptyState
                            title="All stocked up"
                            description="You don't have any medications running low right now. Keep it up!"
                        />
                    ) : null
                }
            />
        </SafeAreaView>
    );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: LightColors.background,
    },
    navHeader: {
        paddingHorizontal: Spacing.md,
        paddingTop: Spacing.md,
        paddingBottom: Spacing.sm,
        flexDirection: 'row',
    },
    titleBlock: {
        paddingHorizontal: Spacing.md,
        paddingBottom: Spacing.md,
    },
    title: {
        ...Typography.headingXL,
        color: LightColors.textPrimary,
    },
    subtitle: {
        ...Typography.bodyMD,
        color: LightColors.textSecondary,
        marginTop: Spacing.xxs,
    },
    listContent: {
        paddingHorizontal: Spacing.md,
        paddingBottom: Spacing.xxxl,
    },
});
