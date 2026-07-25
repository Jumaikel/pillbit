/**
 * MedicationListScreen
 *
 * Entry point for the Medications feature module.
 * Route: /medications (tab root)
 *
 * Responsibilities:
 *  - Load medications from Zustand store on mount
 *  - Display medications in a FlatList
 *  - Support pull-to-refresh
 *  - Support search by name/dosage/presentation
 *  - Show EmptyState when there are no results
 *  - Show loading and error states
 *  - Navigate to detail or create screens
 */

import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useCallback, useEffect } from 'react';
import { Medication } from '@/database';
import { Spacing, Radius } from '@/constants';
import { EmptyState } from '@/components';
import { useMedicationStore, selectFilteredMedications } from '../store/useMedicationStore';
import { MedicationCard } from '../components/MedicationCard';
import { useExpirationStore } from '@/features/expiration';
import { useInventoryStore, selectLowStockCount } from '@/features/inventory';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from 'react-i18next';

// ─── Component ────────────────────────────────────────────────────────────────

export function MedicationListScreen() {
  const { colors, typography } = useTheme();
  const styles = getStyles(colors, typography);
  const router = useRouter();
  const { t } = useTranslation();

  // ─── Store selectors (always select only what you need) ──────────────────
  const isLoading = useMedicationStore((s) => s.isLoading);
  const error = useMedicationStore((s) => s.error);
  const searchQuery = useMedicationStore((s) => s.searchQuery);
  const filteredMedications = useMedicationStore(selectFilteredMedications);
  const loadMedications = useMedicationStore((s) => s.loadMedications);
  const setSearchQuery = useMedicationStore((s) => s.setSearchQuery);
  const clearError = useMedicationStore((s) => s.clearError);

  // ─── Effects ─────────────────────────────────────────────────────────────

  useEffect(() => {
    loadMedications();
  }, [loadMedications]);

  useEffect(() => {
    if (error) {
      Alert.alert(t('medications.list.errorTitle'), t('medications.list.errorLoading'), [{ text: t('medications.list.ok'), onPress: clearError }]);
    }
  }, [error, clearError, t]);

  const { expiringSoonList, expiredList, refreshExpirationData } = useExpirationStore();
  useEffect(() => {
    refreshExpirationData();
  }, [refreshExpirationData]);

  const loadInventory = useInventoryStore((s) => s.loadInventory);
  const lowStockCount = useInventoryStore(selectLowStockCount);
  useEffect(() => {
    loadInventory();
  }, [loadInventory]);

  // ─── Handlers ────────────────────────────────────────────────────────────

  const handleRefresh = useCallback(() => {
    loadMedications();
  }, [loadMedications]);

  const handleCardPress = useCallback(
    (id: number) => {
      router.push(`/medications/${id}` as never);
    },
    [router],
  );

  const handleCreate = useCallback(() => {
    router.push('/medications/create' as never);
  }, [router]);

  // ─── Render helpers ───────────────────────────────────────────────────────

  const renderItem = useCallback(
    ({ item }: { item: Medication }) => (
      <MedicationCard medication={item} onPress={() => handleCardPress(item.id)} />
    ),
    [handleCardPress],
  );

  const renderEmpty = () => {
    if (isLoading) return null;
    if (searchQuery.trim()) {
      return (
        <EmptyState
          title={t('medications.list.noResultsTitle')}
          description={t('medications.list.noResultsDesc', { query: searchQuery })}
        />
      );
    }
    return (
      <EmptyState
        title={t('medications.list.emptyTitle')}
        description={t('medications.list.emptyDesc')}
        action={{ label: t('medications.list.addMedication'), onPress: handleCreate }}
      />
    );
  };

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <Text style={styles.headerTitle} accessibilityRole="header">
          {t('medications.list.title')}
        </Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleCreate}
          accessibilityRole="button"
          accessibilityLabel={t('medications.list.addMedication')}
          accessibilityHint="Navigate to the create medication screen"
        >
          <Text style={styles.addButtonText}>{t('medications.list.add')}</Text>
        </TouchableOpacity>
      </View>

      {/* ── Search Bar ── */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder={t('medications.list.searchPlaceholder')}
          placeholderTextColor={colors.textDisabled}
          value={searchQuery}
          onChangeText={setSearchQuery}
          returnKeyType="search"
          clearButtonMode="while-editing"
          accessibilityLabel={t('medications.list.searchPlaceholder')}
          accessibilityHint="Filter the list by medication name, dosage, or presentation"
        />
      </View>

      {/* ── Expiration & Inventory Links ── */}
      <View style={styles.expirationLinks}>
        <TouchableOpacity 
          style={styles.expirationLink}
          onPress={() => router.push('/medications/low-stock' as never)}
        >
          <Text style={[styles.expirationLinkText, lowStockCount > 0 && { color: colors.error }]}>
            {t('medications.list.lowStock', { count: lowStockCount })}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.expirationLink}
          onPress={() => router.push('/medications/expiring' as never)}
        >
          <Text style={styles.expirationLinkText}>
            {t('medications.list.expiring', { count: expiringSoonList.length })}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.expirationLink}
          onPress={() => router.push('/medications/expired' as never)}
        >
          <Text style={styles.expirationLinkTextError}>
            {t('medications.list.expired', { count: expiredList.length })}
          </Text>
        </TouchableOpacity>
      </View>

      {/* ── Loading Spinner (initial load only) ── */}
      {isLoading && filteredMedications.length === 0 && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>{t('medications.list.loading')}</Text>
        </View>
      )}

      {/* ── List ── */}
      {!isLoading || filteredMedications.length > 0 ? (
        <FlatList
          data={filteredMedications}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          ListEmptyComponent={renderEmpty}
          contentContainerStyle={[
            styles.listContent,
            filteredMedications.length === 0 && styles.listContentEmpty,
          ]}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          refreshing={isLoading}
          onRefresh={handleRefresh}
          showsVerticalScrollIndicator={false}
        />
      ) : null}
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const getStyles = (colors: any, typography: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  headerTitle: {
    ...typography.headingXL,
    color: colors.textPrimary,
  },
  addButton: {
    backgroundColor: colors.primary,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    ...typography.bodySM,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // Search
  searchContainer: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  searchInput: {
    height: 44,
    borderRadius: Radius.sm,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: Spacing.md,
    color: colors.textPrimary,
    ...typography.bodyMD,
  },

  // Expiration Links
  expirationLinks: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
    gap: Spacing.sm,
  },
  expirationLink: {
    flex: 1,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    backgroundColor: colors.surface,
    borderRadius: Radius.full,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  expirationLinkText: {
    ...typography.bodySM,
    fontWeight: '600',
    color: colors.warning,
  },
  expirationLinkTextError: {
    ...typography.bodySM,
    fontWeight: '600',
    color: colors.error,
  },

  // Loading
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  loadingText: {
    ...typography.bodyMD,
    color: colors.textSecondary,
  },

  // List
  listContent: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  listContentEmpty: {
    flex: 1,
  },
  separator: {
    height: Spacing.sm,
  },
});
