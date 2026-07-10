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

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingReminder, setEditingReminder] = useState<MedicationReminder | null>(null);

  useEffect(() => {
    loadReminders(medicationId);
  }, [medicationId, loadReminders]);

  const handleToggle = async (id: number, isActive: boolean) => {
    try {
      await toggleReminder(id, isActive);
    } catch (e) {
      Alert.alert('Error', 'Failed to toggle reminder.');
    }
  };

  const handleDelete = (id: number) => {
    Alert.alert(
      'Delete Reminder',
      'Are you sure you want to delete this reminder?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteReminder(id);
            } catch (e) {
              Alert.alert('Error', 'Failed to delete reminder.');
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
      Alert.alert('Error', 'Failed to save reminder.');
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
              {editingReminder ? 'Edit Reminder' : 'New Reminder'}
            </Text>
            <ReminderForm 
              initialValues={getInitialFormValues()}
              onSubmit={handleSubmitForm}
              isLoading={isLoading}
              submitLabel={editingReminder ? "Update" : "Create"}
            />
            <Button 
              label="Cancel" 
              variant="outline" 
              onPress={handleCancelForm} 
              style={styles.cancelButton}
              disabled={isLoading}
            />
          </View>
        ) : (
          <>
            <View style={styles.header}>
              <Text style={styles.title}>Reminders</Text>
              <Button label="+ Add" onPress={handleAddNew} />
            </View>

            {reminders.length === 0 ? (
              <EmptyState 
                title="No reminders yet" 
                description="Add a reminder to get notified when it's time for your medication."
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
