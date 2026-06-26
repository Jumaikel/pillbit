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
import { LightColors, Typography, Spacing, Radius } from '@/constants';
import { EmptyState } from '@/components';
import { useMedicationStore, selectFilteredMedications } from '../store/useMedicationStore';
import { MedicationCard } from '../components/MedicationCard';

// ─── Component ────────────────────────────────────────────────────────────────

export function MedicationListScreen() {
  const router = useRouter();

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
      Alert.alert('Error', error, [{ text: 'OK', onPress: clearError }]);
    }
  }, [error, clearError]);

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
          title="No results found"
          description={`No medications match "${searchQuery}".`}
        />
      );
    }
    return (
      <EmptyState
        title="No medications yet"
        description="Add your first medication to start tracking your prescriptions."
        action={{ label: 'Add Medication', onPress: handleCreate }}
      />
    );
  };

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <Text style={styles.headerTitle} accessibilityRole="header">
          Medications
        </Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleCreate}
          accessibilityRole="button"
          accessibilityLabel="Add medication"
          accessibilityHint="Navigate to the create medication screen"
        >
          <Text style={styles.addButtonText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {/* ── Search Bar ── */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search medications…"
          placeholderTextColor={LightColors.textDisabled}
          value={searchQuery}
          onChangeText={setSearchQuery}
          returnKeyType="search"
          clearButtonMode="while-editing"
          accessibilityLabel="Search medications"
          accessibilityHint="Filter the list by medication name, dosage, or presentation"
        />
      </View>

      {/* ── Loading Spinner (initial load only) ── */}
      {isLoading && filteredMedications.length === 0 && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={LightColors.primary} />
          <Text style={styles.loadingText}>Loading medications…</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: LightColors.background,
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
    ...Typography.headingXL,
    color: LightColors.textPrimary,
  },
  addButton: {
    backgroundColor: LightColors.primary,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    ...Typography.bodySM,
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
    borderColor: LightColors.border,
    backgroundColor: LightColors.surface,
    paddingHorizontal: Spacing.md,
    color: LightColors.textPrimary,
    ...Typography.bodyMD,
  },

  // Loading
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  loadingText: {
    ...Typography.bodyMD,
    color: LightColors.textSecondary,
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
