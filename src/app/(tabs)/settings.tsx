import { View, Text, StyleSheet, Switch, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState, useCallback } from 'react';
import { LightColors, Typography, Spacing, Radius } from '@/constants';
import { ApplicationSettingRepository, ApplicationSetting } from '@/database';
import { Input, Button, Card } from '@/components';
import { useInventoryStore } from '@/features/inventory';

/**
 * SettingsScreen
 *
 * Manages global application settings like global thresholds and notification preferences.
 * Route: /settings
 */
export default function SettingsScreen() {
  const [settings, setSettings] = useState<ApplicationSetting | null>(null);
  const [thresholdInput, setThresholdInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const loadSettings = useCallback(async () => {
    try {
      let currentSettings = await ApplicationSettingRepository.get();
      if (!currentSettings) {
        await ApplicationSettingRepository.initialize();
        currentSettings = await ApplicationSettingRepository.get();
      }
      if (currentSettings) {
        setSettings(currentSettings);
        setThresholdInput(currentSettings.defaultLowStockThreshold?.toString() || '');
      }
    } catch (e) {
      Alert.alert('Error', 'Failed to load settings');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const handleSave = async () => {
    if (!settings) return;
    setIsSaving(true);
    try {
      const parsedThreshold = thresholdInput.trim() === '' ? null : parseInt(thresholdInput, 10);
      if (parsedThreshold !== null && (isNaN(parsedThreshold) || parsedThreshold < 0)) {
         Alert.alert('Invalid Threshold', 'Please enter a valid positive number');
         setIsSaving(false);
         return;
      }

      await ApplicationSettingRepository.update({
        ...settings,
        defaultLowStockThreshold: parsedThreshold === null ? undefined : parsedThreshold,
      });

      // Refresh inventory because global threshold changed
      const { refreshAfterSettingsChange } = useInventoryStore.getState();
      await refreshAfterSettingsChange();

      Alert.alert('Success', 'Settings saved successfully');
    } catch (e) {
      Alert.alert('Error', 'Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleAutoReduce = async (value: boolean) => {
    if (!settings) return;
    try {
      await ApplicationSettingRepository.update({
        ...settings,
        autoReduceStock: value,
      });
      setSettings({ ...settings, autoReduceStock: value });
    } catch (e) {
      Alert.alert('Error', 'Failed to update setting');
    }
  };

  const handleToggleNotify = async (value: boolean) => {
    if (!settings) return;
    try {
      await ApplicationSettingRepository.update({
        ...settings,
        notifyLowStock: value,
      });
      setSettings({ ...settings, notifyLowStock: value });
    } catch (e) {
      Alert.alert('Error', 'Failed to update setting');
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
         <View style={styles.centered}><Text style={styles.loadingText}>Loading settings...</Text></View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Text style={styles.title} accessibilityRole="header">Settings</Text>
          </View>

          <Card padded style={styles.section}>
            <Text style={styles.sectionTitle}>Inventory Tracking</Text>
            
            <View style={styles.settingRow}>
               <View style={styles.settingText}>
                 <Text style={styles.settingLabel}>Auto-Reduce Stock</Text>
                 <Text style={styles.settingDescription}>Automatically reduce available quantity when you mark a medication as taken.</Text>
               </View>
               <Switch
                 value={settings?.autoReduceStock ?? false}
                 onValueChange={handleToggleAutoReduce}
                 trackColor={{ false: LightColors.textDisabled, true: LightColors.primary }}
                 thumbColor="#fff"
               />
            </View>

            <View style={styles.divider} />

            <View style={styles.settingRow}>
               <View style={styles.settingText}>
                 <Text style={styles.settingLabel}>Global Low Stock Threshold</Text>
                 <Text style={styles.settingDescription}>Default alert threshold for medications that don't have a specific one set.</Text>
               </View>
            </View>
            <View style={styles.inputContainer}>
               <Input
                 placeholder="e.g. 10"
                 value={thresholdInput}
                 onChangeText={setThresholdInput}
                 keyboardType="numeric"
                 returnKeyType="done"
               />
               <Button 
                 label="Save" 
                 onPress={handleSave} 
                 loading={isSaving}
                 disabled={isSaving}
                 style={styles.saveButton}
               />
            </View>
          </Card>

          <Card padded style={styles.section}>
            <Text style={styles.sectionTitle}>Notifications</Text>
            
            <View style={styles.settingRow}>
               <View style={styles.settingText}>
                 <Text style={styles.settingLabel}>Low Stock Alerts</Text>
                 <Text style={styles.settingDescription}>Receive notifications when a medication drops to or below its threshold.</Text>
               </View>
               <Switch
                 value={settings?.notifyLowStock ?? true}
                 onValueChange={handleToggleNotify}
                 trackColor={{ false: LightColors.textDisabled, true: LightColors.primary }}
                 thumbColor="#fff"
               />
            </View>
          </Card>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: LightColors.background,
  },
  flex: {
    flex: 1,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    ...Typography.bodyMD,
    color: LightColors.textSecondary,
  },
  scrollContent: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xxxl,
  },
  header: {
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
  },
  title: {
    ...Typography.headingXL,
    color: LightColors.textPrimary,
  },
  section: {
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    ...Typography.headingMD,
    color: LightColors.primary,
    marginBottom: Spacing.md,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
  },
  settingText: {
    flex: 1,
    paddingRight: Spacing.md,
  },
  settingLabel: {
    ...Typography.bodyMD,
    fontWeight: '600',
    color: LightColors.textPrimary,
  },
  settingDescription: {
    ...Typography.caption,
    color: LightColors.textSecondary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: LightColors.border,
    marginVertical: Spacing.md,
  },
  inputContainer: {
    marginTop: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },
  saveButton: {
    marginLeft: Spacing.sm,
    marginBottom: 4, // align with input field margin
  }
});
