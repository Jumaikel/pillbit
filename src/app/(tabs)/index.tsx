import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { Spacing } from '@/constants';
import { Button } from '@/components/Button';
import { useInventoryStore, selectLowStockMedications, LowStockBanner } from '@/features/inventory';
import { useExpirationStore, ExpirationBanner } from '@/features/expiration';
import { useDashboardStore, TodayDoseCard } from '@/features/dashboard';
import { useTheme } from '@/hooks/useTheme';

/**
 * HomeScreen
 *
 * Application dashboard.
 * Route: / (maps to (tabs)/index)
 */
export default function HomeScreen() {
  const { colors, typography } = useTheme();
  const styles = getStyles(colors, typography);
  const router = useRouter();
  
  const loadInventory = useInventoryStore((s) => s.loadInventory);
  const lowStockItems = useInventoryStore(selectLowStockMedications);
  
  const loadExpiration = useExpirationStore((s) => s.refreshExpirationData);
  const expiringSoonList = useExpirationStore((s) => s.expiringSoonList);
  const expiredList = useExpirationStore((s) => s.expiredList);
  
  const loadDashboard = useDashboardStore((s) => s.loadDashboard);
  const todayDoses = useDashboardStore((s) => s.todayDoses);
  
  useFocusEffect(
    useCallback(() => {
      loadInventory();
      loadExpiration();
      loadDashboard();
    }, [loadInventory, loadExpiration, loadDashboard])
  );

  const hasEmpty = lowStockItems.some(item => item.inventoryStatus === 'empty');
  const expirationCount = expiringSoonList.length + expiredList.length;
  const hasExpired = expiredList.length > 0;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title} accessibilityRole="header">
          Hola, tu resumen de hoy
        </Text>
      </View>
      
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <LowStockBanner 
          count={lowStockItems.length} 
          hasEmpty={hasEmpty}
          onPress={() => router.push('/medications/low-stock' as never)}
        />

        <ExpirationBanner
          count={expirationCount}
          hasExpired={hasExpired}
          onPress={() => router.push(hasExpired ? '/medications/expired' as never : '/medications/expiring' as never)}
        />
        
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Dosis de Hoy</Text>
        </View>

        {todayDoses.length > 0 ? (
          todayDoses.map((dose) => (
            <TodayDoseCard key={dose.reminderId} dose={dose} />
          ))
        ) : (
          <View style={styles.placeholder}>
             <Text style={styles.placeholderText}>No tienes dosis programadas para hoy.</Text>
             <Button 
                label="Añadir Medicamento" 
                onPress={() => router.push('/medications/create' as never)} 
                style={{ marginTop: Spacing.md }}
             />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const getStyles = (colors: any, typography: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  title: {
    ...typography.headingXL,
    color: colors.textPrimary,
  },
  sectionHeader: {
    marginTop: Spacing.sm,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    ...typography.headingLG,
    color: colors.textPrimary,
  },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xl,
  },
  placeholderText: {
    ...typography.bodyMD,
    color: colors.textSecondary,
  },
});
