import { View, Text, StyleSheet, Switch, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Spacing } from '@/constants';
import { useConfigStore } from '@/store/useConfigStore';
import { Button, Card } from '@/components';

import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from 'react-i18next';
import i18n from '@/i18n';

export default function SettingsScreen() {
  const { colors, typography } = useTheme();
  const styles = getStyles(colors, typography);
  const { t } = useTranslation();
  
  const { settings, isLoading, updateSettings } = useConfigStore();





  const handleToggle = async (key: keyof import('@/database/models').ApplicationSetting, value: boolean | string) => {
    if (!settings) return;
    try {
      await updateSettings({ [key]: value } as any);
      if (key === 'language') {
         i18n.changeLanguage(value === 'system' ? undefined : (value as string));
      }
    } catch {
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

          {/* Appearance & Language Settings */}
          <Card padded style={styles.section}>
            <Text style={styles.sectionTitle}>{t('settings.appearance')}</Text>
            
            <Text style={styles.settingLabel}>{t('settings.theme')}</Text>
            <View style={styles.buttonGroup}>
               <Button 
                  label={t('settings.theme_system')} 
                  variant={settings.theme === 'system' || !settings.theme ? 'primary' : 'outline'}
                  onPress={() => handleToggle('theme', 'system')} 
                  style={styles.optionButton} 
               />
               <Button 
                  label={t('settings.theme_light')} 
                  variant={settings.theme === 'light' ? 'primary' : 'outline'}
                  onPress={() => handleToggle('theme', 'light')} 
                  style={styles.optionButton} 
               />
               <Button 
                  label={t('settings.theme_dark')} 
                  variant={settings.theme === 'dark' ? 'primary' : 'outline'}
                  onPress={() => handleToggle('theme', 'dark')} 
                  style={styles.optionButton} 
               />
            </View>

            <View style={styles.divider} />

            <Text style={styles.settingLabel}>{t('settings.language')}</Text>
            <View style={styles.buttonGroup}>
               <Button 
                  label={t('settings.language_system')} 
                  variant={settings.language === 'system' || !settings.language ? 'primary' : 'outline'}
                  onPress={() => handleToggle('language', 'system')} 
                  style={styles.optionButton} 
               />
               <Button 
                  label={t('settings.language_es')} 
                  variant={settings.language === 'es' ? 'primary' : 'outline'}
                  onPress={() => handleToggle('language', 'es')} 
                  style={styles.optionButton} 
               />
               <Button 
                  label={t('settings.language_en')} 
                  variant={settings.language === 'en' ? 'primary' : 'outline'}
                  onPress={() => handleToggle('language', 'en')} 
                  style={styles.optionButton} 
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
            <View style={styles.buttonGroup}>
               <Button 
                  label={t('settings.accessibility.sizeNormal')} 
                  variant={settings.textSize === 'normal' ? 'primary' : 'outline'}
                  onPress={() => handleToggle('textSize', 'normal')} 
                  style={styles.optionButton} 
               />
               <Button 
                  label={t('settings.accessibility.sizeLarge')} 
                  variant={settings.textSize === 'large' ? 'primary' : 'outline'}
                  onPress={() => handleToggle('textSize', 'large')} 
                  style={styles.optionButton} 
               />
               <Button 
                  label={t('settings.accessibility.sizeXLarge')} 
                  variant={settings.textSize === 'extra_large' ? 'primary' : 'outline'}
                  onPress={() => handleToggle('textSize', 'extra_large')} 
                  style={styles.optionButton} 
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

          {/* Add more sections as needed */}
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
  buttonGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  optionButton: {
    flexGrow: 1,
    minWidth: '30%',
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
