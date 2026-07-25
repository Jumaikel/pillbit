import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Text, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, EmptyState } from '@/components';
import { Spacing } from '@/constants';
import { useReminderStore } from '../store/useReminderStore';
import { ReminderItem } from '../components/ReminderItem';
import { ReminderForm, ReminderFormValues } from '../components/ReminderForm';
import { MedicationReminder } from '@/database';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from 'react-i18next';

interface ReminderManagementScreenProps {
  medicationId: number;
}

export function ReminderManagementScreen({ medicationId }: ReminderManagementScreenProps) {
  const { colors, typography } = useTheme();
  const styles = getStyles(colors, typography);
  const { 
    reminders, 
    isLoading, 
    loadReminders, 
    createReminder, 
    updateReminder, 
    deleteReminder, 
    toggleReminder 
  } = useReminderStore();
  const { t } = useTranslation();

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingReminder, setEditingReminder] = useState<MedicationReminder | null>(null);

  useEffect(() => {
    loadReminders(medicationId);
  }, [medicationId, loadReminders]);

  const handleToggle = async (id: number, isActive: boolean) => {
    try {
      await toggleReminder(id, isActive);
    } catch (e) {
      Alert.alert(t('reminders.errorTitle'), t('reminders.errorToggle'));
    }
  };

  const handleDelete = (id: number) => {
    Alert.alert(
      t('reminders.alertDeleteTitle'),
      t('reminders.alertDeleteDesc'),
      [
        { text: t('reminders.alertDeleteBtnCancel'), style: 'cancel' },
        { 
          text: t('reminders.alertDeleteBtnConfirm'), 
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteReminder(id);
            } catch (e) {
              Alert.alert(t('reminders.errorTitle'), t('reminders.errorDelete'));
            }
          }
        }
      ]
    );
  };

  const handleEdit = (reminder: MedicationReminder) => {
    setEditingReminder(reminder);
    setIsFormVisible(true);
  };

  const handleAddNew = () => {
    setEditingReminder(null);
    setIsFormVisible(true);
  };

  const handleCancelForm = () => {
    setIsFormVisible(false);
    setEditingReminder(null);
  };

  const handleSubmitForm = async (data: ReminderFormValues) => {
    const timeString = `${data.reminderTime.getHours().toString().padStart(2, '0')}:${data.reminderTime.getMinutes().toString().padStart(2, '0')}`;
    
    try {
      if (editingReminder) {
        await updateReminder(editingReminder.id, timeString, data.isActive);
      } else {
        await createReminder(medicationId, timeString, data.isActive);
      }
      setIsFormVisible(false);
      setEditingReminder(null);
    } catch (e) {
      Alert.alert(t('reminders.errorTitle'), t('reminders.errorSave'));
    }
  };

  // Convert time string "HH:MM" back to Date for form initial value
  const getInitialFormValues = () => {
    if (!editingReminder) return undefined;
    
    const [hours, minutes] = editingReminder.reminderTime.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    
    return {
      reminderTime: date,
      isActive: editingReminder.isActive,
    };
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {isFormVisible ? (
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>
              {editingReminder ? t('reminders.editTitle') : t('reminders.newTitle')}
            </Text>
            <ReminderForm 
              initialValues={getInitialFormValues()}
              onSubmit={handleSubmitForm}
              isLoading={isLoading}
              submitLabel={editingReminder ? t('reminders.form.btnUpdate') : t('reminders.form.btnCreate')}
            />
            <Button 
              label={t('reminders.btnCancel')} 
              variant="outline" 
              onPress={handleCancelForm} 
              style={styles.cancelButton}
              disabled={isLoading}
            />
          </View>
        ) : (
          <>
            <View style={styles.header}>
              <Text style={styles.title}>{t('reminders.title')}</Text>
              <Button label={t('reminders.btnAdd')} onPress={handleAddNew} />
            </View>

            {reminders.length === 0 ? (
              <EmptyState 
                title={t('reminders.emptyTitle')} 
                description={t('reminders.emptyDesc')}
              />
            ) : (
              <View style={styles.list}>
                {reminders.map(reminder => (
                  <ReminderItem
                    key={reminder.id}
                    reminder={reminder}
                    onToggle={handleToggle}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                    disabled={isLoading}
                  />
                ))}
              </View>
            )}
          </>
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
  scrollContent: {
    padding: Spacing.md,
    gap: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  title: {
    ...typography.headingLG,
    color: colors.textPrimary,
  },
  list: {
    gap: Spacing.sm,
  },
  formContainer: {
    gap: Spacing.md,
  },
  formTitle: {
    ...typography.headingLG,
    color: colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  cancelButton: {
    marginTop: Spacing.xs,
  },
});
