import React from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { MedicationReminder } from '@/database';
import { Card } from '@/components';
import { Typography, Spacing, LightColors } from '@/constants';
import { Ionicons } from '@expo/vector-icons';

interface ReminderItemProps {
  reminder: MedicationReminder;
  onToggle: (id: number, isActive: boolean) => void;
  onEdit: (reminder: MedicationReminder) => void;
  onDelete: (id: number) => void;
  disabled?: boolean;
}

export function ReminderItem({
  reminder,
  onToggle,
  onEdit,
  onDelete,
  disabled = false,
}: ReminderItemProps) {
  // Format HH:MM to user-friendly time
  const formattedTime = (() => {
    const [hoursStr, minutesStr] = reminder.reminderTime.split(':');
    const hours = parseInt(hoursStr, 10);
    const minutes = minutesStr || '00';
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes} ${ampm}`;
  })();

  return (
    <Card padded style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.timeContainer}>
          <Ionicons name="time-outline" size={24} color={LightColors.primary} />
          <Text style={[styles.timeText, !reminder.isActive && styles.inactiveText]}>
            {formattedTime}
          </Text>
        </View>
        <Switch
          trackColor={{ false: LightColors.border, true: LightColors.primary }}
          thumbColor="#f4f3f4"
          onValueChange={(val) => onToggle(reminder.id, val)}
          value={reminder.isActive}
          disabled={disabled}
        />
      </View>
      
      <View style={styles.actionRow}>
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={() => onEdit(reminder)}
          disabled={disabled}
        >
          <Ionicons name="pencil-outline" size={20} color={LightColors.textSecondary} />
          <Text style={styles.actionText}>Edit</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={() => onDelete(reminder.id)}
          disabled={disabled}
        >
          <Ionicons name="trash-outline" size={20} color={LightColors.error} />
          <Text style={[styles.actionText, { color: LightColors.error }]}>Delete</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: Spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  timeText: {
    ...Typography.headingLG,
    color: LightColors.textPrimary,
  },
  inactiveText: {
    color: LightColors.textSecondary,
    textDecorationLine: 'line-through',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: LightColors.border,
    paddingTop: Spacing.sm,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xxs,
  },
  actionText: {
    ...Typography.bodyMD,
    color: LightColors.textSecondary,
  },
});
