import { useLocalSearchParams, useRouter } from 'expo-router';
import { ReminderManagementScreen } from '@/features/reminder/screens/ReminderManagementScreen';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components';
import { LightColors, Spacing } from '@/constants';

export default function RemindersRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.navHeader}>
        <Button label="← Back" onPress={() => router.back()} variant="outline" />
      </View>
      <ReminderManagementScreen medicationId={Number(id)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: LightColors.background,
  },
  navHeader: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
    alignItems: 'flex-start',
  },
});
