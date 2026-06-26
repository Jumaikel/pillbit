import React, { useState } from 'react';
import { Platform, Pressable, View, Modal, StyleSheet, TouchableOpacity, Text } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Input } from './Input';
import { LightColors, Typography, Spacing } from '@/constants';

interface DateInputProps {
  label: string;
  value: string; // Format: YYYY-MM-DD
  onChange: (date: string) => void;
  errorMessage?: string;
}

export function DateInput({ label, value, onChange, errorMessage }: DateInputProps) {
  const [show, setShow] = useState(false);

  // Parse YYYY-MM-DD, default to today if empty
  const parsedDate = value ? new Date(`${value}T12:00:00Z`) : new Date();

  const handlePress = () => {
    setShow(true);
  };

  const handleValueChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShow(false);
    }
    if (selectedDate) {
      const yyyy = selectedDate.getFullYear();
      const mm = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const dd = String(selectedDate.getDate()).padStart(2, '0');
      onChange(`${yyyy}-${mm}-${dd}`);
    }
  };

  const handleDismiss = () => {
    setShow(false);
  };

  const closeIOSModal = () => {
    setShow(false);
  };

  return (
    <View>
      <Pressable onPress={handlePress} accessibilityRole="button">
        <View pointerEvents="none">
          <Input
            label={label}
            value={value}
            placeholder="Select Date"
            errorMessage={errorMessage}
            editable={false}
          />
        </View>
      </Pressable>

      {/* Android Picker */}
      {show && Platform.OS === 'android' && (
        <DateTimePicker
          value={parsedDate}
          mode="date"
          display="default"
          onValueChange={handleValueChange}
          onDismiss={handleDismiss}
        />
      )}

      {/* iOS Modal Picker */}
      {show && Platform.OS === 'ios' && (
        <Modal visible={show} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={closeIOSModal}>
                  <Text style={styles.doneButton}>Done</Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={parsedDate}
                mode="date"
                display="inline"
                onValueChange={handleValueChange}
                onDismiss={handleDismiss}
                style={styles.iosPicker}
              />
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContent: {
    backgroundColor: LightColors.surface,
    paddingBottom: Spacing.xl,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: LightColors.border,
  },
  doneButton: {
    ...Typography.bodyLG,
    fontWeight: '600',
    color: LightColors.primary,
  },
  iosPicker: {
    backgroundColor: LightColors.surface,
  },
});
