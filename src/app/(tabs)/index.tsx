import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { LightColors, Typography, Spacing } from '@/constants';
import { useInventoryStore, selectLowStockMedications, LowStockBanner } from '@/features/inventory';

/**
 * HomeScreen
 *
 * Application dashboard.
 * Route: / (maps to (tabs)/index)
 */
export default function HomeScreen() {
  const router = useRouter();
  
  const loadInventory = useInventoryStore((s) => s.loadInventory);
  const lowStockItems = useInventoryStore(selectLowStockMedications);
  
  useFocusEffect(
    useCallback(() => {
      loadInventory();
    }, [loadInventory])
  );

  const hasEmpty = lowStockItems.some(item => item.inventoryStatus === 'empty');

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title} accessibilityRole="header">
          Home
        </Text>
      </View>
      
      <View style={styles.content}>
        <LowStockBanner 
          count={lowStockItems.length} 
          hasEmpty={hasEmpty}
          onPress={() => router.push('/medications/low-stock' as never)}
        />
        
        {/* Placeholder for future dashboard content */}
        {lowStockItems.length === 0 && (
          <View style={styles.placeholder}>
             <Text style={styles.placeholderText}>Your dashboard is ready.</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: LightColors.background,
  },
  header: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.md,
  },
  title: {
    ...Typography.headingXL,
    color: LightColors.textPrimary,
  },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    ...Typography.bodyMD,
    color: LightColors.textSecondary,
  },
});
