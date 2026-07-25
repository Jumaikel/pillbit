import { View, Text, StyleSheet, Switch, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import { Spacing } from '@/constants';
import { useConfigStore } from '@/store/useConfigStore';
import { Input, Button, Card } from '@/components';
import { useInventoryStore } from '@/features/inventory';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from 'react-i18next';
import i18n from '@/i18n';

export default function SettingsScreen() {
  const { colors, typography } = useTheme();
  const styles = getStyles(colors, typography);
  const { t } = useTranslation();
  
  const { settings, isLoading, updateSettings } = useConfigStore();
  const [thresholdInput, setThresholdInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (settings) {
      setThresholdInput(settings.defaultLowStockThreshold?.toString() || '');
    }
  }, [settings]);

  const handleSaveInventory = async () => {
    if (!settings) return;
    setIsSaving(true);
    try {
      const parsedThreshold = thresholdInput.trim() === '' ? null : parseInt(thresholdInput, 10);
      if (parsedThreshold !== null && (isNaN(parsedThreshold) || parsedThreshold < 0)) {
         Alert.alert(t('settings.invalidThresholdTitle'), t('settings.invalidThresholdDesc'));
         setIsSaving(false);
         return;
      }
      await updateSettings({ defaultLowStockThreshold: parsedThreshold === null ? undefined : parsedThreshold });
      // Refresh inventory because global threshold changed
      const { refreshAfterSettingsChange } = useInventoryStore.getState();
      await refreshAfterSettingsChange();
      Alert.alert(t('settings.successTitle'), t('settings.successSave'));
    } catch (e) {
      Alert.alert(t('settings.errorTitle'), t('settings.errorSave'));
    } finally {
      setIsSaving(false);
    }
  };



  const handleToggle = async (key: keyof import('@/database/models').ApplicationSetting, value: boolean | string) => {
    if (!settings) return;
    try {
      await updateSettings({ [key]: value } as any);
      if (key === 'language') {
         i18n.changeLanguage(value === 'system' ? undefined : (value as string));
      }
    } catch (e) {
      Alert.alert(t('settings.errorTitle'), t('settings.errorUpdate'));
    }
  };

  if (isLoading || !settings) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
         <View style={styles.centered}><Text style={styles.loadingText}>{t('settings.loading')}</Text></View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Text style={styles.title} accessibilityRole="header">{t('settings.title')}</Text>
          </View>

          {/* Language Settings */}
          <Card padded style={styles.section}>
            <Text style={styles.sectionTitle}>{t('settings.language')}</Text>
            <View style={styles.buttonRow}>
               <Button 
                  label={t('settings.language_system')} 
                  variant={settings.language === 'system' || !settings.language ? 'primary' : 'outline'}
                  onPress={() => handleToggle('language', 'system')} 
                  style={styles.flex1} 
               />
               <View style={{ width: 8 }} />
               <Button 
                  label={t('settings.language_es')} 
                  variant={settings.language === 'es' ? 'primary' : 'outline'}
                  onPress={() => handleToggle('language', 'es')} 
                  style={styles.flex1} 
               />
               <View style={{ width: 8 }} />
               <Button 
                  label={t('settings.language_en')} 
                  variant={settings.language === 'en' ? 'primary' : 'outline'}
                  onPress={() => handleToggle('language', 'en')} 
                  style={styles.flex1} 
               />
            </View>
          </Card>

          {/* Accessibility Settings */}
          <Card padded style={styles.section}>
            <Text style={styles.sectionTitle}>{t('settings.accessibility.title')}</Text>
            
            <View style={styles.settingRow}>
               <View style={styles.settingText}>
                 <Text style={styles.settingLabel}>{t('settings.accessibility.highContrast')}</Text>
                 <Text style={styles.settingDescription}>{t('settings.accessibility.highContrastDesc')}</Text>
               </View>
               <Switch
                 value={settings.isHighContrastEnabled}
                 onValueChange={(v) => handleToggle('isHighContrastEnabled', v)}
                 trackColor={{ false: colors.textDisabled, true: colors.primary }}
                 thumbColor="#fff"
               />
            </View>
            <View style={styles.divider} />
            <View style={styles.settingRow}>
               <View style={styles.settingText}>
                 <Text style={styles.settingLabel}>{t('settings.accessibility.textSize')}</Text>
                 <Text style={styles.settingDescription}>{t('settings.accessibility.textSizeDesc')}</Text>
               </View>
            </View>
            <View style={styles.buttonRow}>
               <Button 
                  label={t('settings.accessibility.sizeNormal')} 
                  variant={settings.textSize === 'normal' ? 'primary' : 'outline'}
                  onPress={() => handleToggle('textSize', 'normal')} 
                  style={styles.flex1} 
               />
               <View style={{ width: 8 }} />
               <Button 
                  label={t('settings.accessibility.sizeLarge')} 
                  variant={settings.textSize === 'large' ? 'primary' : 'outline'}
                  onPress={() => handleToggle('textSize', 'large')} 
                  style={styles.flex1} 
               />
               <View style={{ width: 8 }} />
               <Button 
                  label={t('settings.accessibility.sizeXLarge')} 
                  variant={settings.textSize === 'extra_large' ? 'primary' : 'outline'}
                  onPress={() => handleToggle('textSize', 'extra_large')} 
                  style={styles.flex1} 
               />
            </View>
            <View style={styles.divider} />
            <View style={styles.settingRow}>
               <View style={styles.settingText}>
                 <Text style={styles.settingLabel}>{t('settings.accessibility.voiceInput')}</Text>
                 <Text style={styles.settingDescription}>{t('settings.accessibility.voiceInputDesc')}</Text>
               </View>
               <Switch
                 value={settings.isVoiceInputEnabled}
                 onValueChange={(v) => handleToggle('isVoiceInputEnabled', v)}
                 trackColor={{ false: colors.textDisabled, true: colors.primary }}
                 thumbColor="#fff"
               />
            </View>
            <View style={styles.divider} />
            <View style={styles.settingRow}>
               <View style={styles.settingText}>
                 <Text style={styles.settingLabel}>{t('settings.accessibility.tts')}</Text>
                 <Text style={styles.settingDescription}>{t('settings.accessibility.ttsDesc')}</Text>
               </View>
               <Switch
                 value={settings.isTextToSpeechEnabled}
                 onValueChange={(v) => handleToggle('isTextToSpeechEnabled', v)}
                 trackColor={{ false: colors.textDisabled, true: colors.primary }}
                 thumbColor="#fff"
               />
            </View>
          </Card>

          {/* AI Settings */}
          <Card padded style={styles.section}>
            <Text style={styles.sectionTitle}>{t('settings.ai.title')}</Text>
            
            <View style={styles.settingRow}>
               <View style={styles.settingText}>
                 <Text style={styles.settingLabel}>{t('settings.ai.enable')}</Text>
                 <Text style={styles.settingDescription}>{t('settings.ai.enableDesc')}</Text>
               </View>
               <Switch
                 value={settings.isAiEnabled}
                 onValueChange={(v) => handleToggle('isAiEnabled', v)}
                 trackColor={{ false: colors.textDisabled, true: colors.primary }}
                 thumbColor="#fff"
               />
            </View>

            {settings.isAiEnabled && (
              <>
              </>
            )}
          </Card>

          {/* General Settings */}
          <Card padded style={styles.section}>
            <Text style={styles.sectionTitle}>{t('settings.inventory.title')}</Text>
            <View style={styles.settingRow}>
               <View style={styles.settingText}>
                 <Text style={styles.settingLabel}>{t('settings.inventory.autoReduce')}</Text>
               </View>
               <Switch
                 value={settings.autoReduceStock}
                 onValueChange={(v) => handleToggle('autoReduceStock', v)}
                 trackColor={{ false: colors.textDisabled, true: colors.primary }}
                 thumbColor="#fff"
               />
            </View>
            <View style={styles.divider} />
            <View style={styles.settingRow}>
               <View style={styles.settingText}>
                 <Text style={styles.settingLabel}>{t('settings.inventory.globalThreshold')}</Text>
               </View>
            </View>
            <View style={styles.inputContainer}>
               <Input
                 placeholder={t('settings.inventory.placeholderThreshold')}
                 value={thresholdInput}
                 onChangeText={setThresholdInput}
                 keyboardType="numeric"
                 returnKeyType="done"
               />
               <Button 
                 label={t('settings.inventory.btnSave')} 
                 onPress={handleSaveInventory} 
                 loading={isSaving}
                 disabled={isSaving}
                 style={styles.saveButton}
               />
            </View>
          </Card>

          <Card padded style={styles.section}>
            <Text style={styles.sectionTitle}>{t('settings.notifications.title')}</Text>
            <View style={styles.settingRow}>
               <View style={styles.settingText}>
                 <Text style={styles.settingLabel}>{t('settings.notifications.lowStock')}</Text>
               </View>
               <Switch
                 value={settings.notifyLowStock}
                 onValueChange={(v) => handleToggle('notifyLowStock', v)}
                 trackColor={{ false: colors.textDisabled, true: colors.primary }}
                 thumbColor="#fff"
               />
            </View>
          </Card>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const getStyles = (colors: any, typography: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  flex1: {
    flex: 1,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    ...typography.bodyMD,
    color: colors.textSecondary,
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
    ...typography.headingXL,
    color: colors.textPrimary,
  },
  section: {
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    ...typography.headingMD,
    color: colors.primary,
    marginBottom: Spacing.md,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  settingText: {
    flex: 1,
    paddingRight: Spacing.md,
  },
  settingLabel: {
    ...typography.bodyMD,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  settingDescription: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: Spacing.md,
  },
  inputContainer: {
    marginTop: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },
  saveButton: {
    marginLeft: Spacing.sm,
    marginBottom: 4,
  }
});
