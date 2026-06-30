import React, { useState } from 'react';
import { View, StyleSheet, Switch, Text, Platform } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Button, Card } from '@/components';
import { Typography, Spacing, LightColors } from '@/constants';

const reminderSchema = z.object({
  reminderTime: z.date(),
  isActive: z.boolean(),
});

export type ReminderFormValues = z.infer<typeof reminderSchema>;

interface ReminderFormProps {
  initialValues?: Partial<ReminderFormValues>;
  onSubmit: (data: ReminderFormValues) => void;
  isLoading?: boolean;
  submitLabel?: string;
}

export function ReminderForm({
  initialValues,
  onSubmit,
  isLoading = false,
  submitLabel = 'Save Reminder',
}: ReminderFormProps) {
  const [showPicker, setShowPicker] = useState(false);

  // Default to 08:00 AM if no initial value is provided
  const defaultTime = new Date();
  defaultTime.setHours(8, 0, 0, 0);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
  } = useForm<ReminderFormValues>({
    resolver: zodResolver(reminderSchema),
    defaultValues: {
      reminderTime: initialValues?.reminderTime || defaultTime,
      isActive: initialValues?.isActive ?? true,
    },
  });

  const reminderTime = watch('reminderTime');

  const onTimeChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowPicker(Platform.OS === 'ios');
    if (selectedDate) {
      setValue('reminderTime', selectedDate, { shouldDirty: true });
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Card padded style={styles.container}>
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Reminder Time</Text>
        <Button 
          variant="outline" 
          label={formatTime(reminderTime)} 
          onPress={() => setShowPicker(true)} 
        />
        {showPicker && (
          <DateTimePicker
            testID="dateTimePicker"
            value={reminderTime}
            mode="time"
            is24Hour={true}
            display="default"
            onChange={onTimeChange}
          />
        )}
      </View>

      <View style={styles.switchContainer}>
        <Text style={styles.label}>Active</Text>
        <Controller
          control={control}
          name="isActive"
          render={({ field: { onChange, value } }) => (
            <Switch
              trackColor={{ false: LightColors.border, true: LightColors.primary }}
              thumbColor="#f4f3f4"
              onValueChange={onChange}
              value={value}
            />
          )}
        />
      </View>

      <Button
        label={submitLabel}
        onPress={handleSubmit(onSubmit)}
        loading={isLoading}
        style={styles.submitButton}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.md,
  },
  fieldContainer: {
    gap: Spacing.xs,
  },
  label: {
    ...Typography.bodyMD,
    fontWeight: '600',
    color: LightColors.textPrimary,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
  },
  submitButton: {
    marginTop: Spacing.sm,
  },
});
