import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LightColors, Typography, Spacing } from '@/constants';

/**
 * HistoryScreen
 *
 * Consumption history module entry point placeholder.
 * Route: /history
 *
 * This screen contains no business logic and no mock data.
 * It serves as the entry point for the History feature module.
 */
export default function HistoryScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.content}>
        <Text style={styles.title} accessibilityRole="header">
          History
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: LightColors.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.md,
  },
  title: {
    ...Typography.headingXL,
    color: LightColors.textPrimary,
  },
});
