import { useLocalSearchParams, useRouter } from 'expo-router';
import { ReminderManagementScreen } from '@/features/reminder/screens/ReminderManagementScreen';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components';
import { Spacing } from '@/constants';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from 'react-i18next';

export default function RemindersRoute() {
  const { colors, typography } = useTheme();
  const styles = getStyles(colors, typography);
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.navHeader}>
        <Button label={t('reminders.btnBack')} onPress={() => router.back()} variant="outline" />
      </View>
      <ReminderManagementScreen medicationId={Number(id)} />
    </SafeAreaView>
  );
}

const getStyles = (colors: any, typography: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  navHeader: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
    alignItems: 'flex-start',
  },
});
