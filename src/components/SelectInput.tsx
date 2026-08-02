import React, { useState } from 'react';
import { View, Modal, StyleSheet, TouchableOpacity, Text, Pressable, ScrollView } from 'react-native';
import { Input } from './Input';
import { Spacing } from '@/constants';
import { useTheme } from '@/hooks/useTheme';

interface Option {
  label: string;
  value: string;
}

interface SelectInputProps {
  label: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  placeholder?: string;
  errorMessage?: string;
}

export function SelectInput({ label, value, options, onChange, placeholder, errorMessage }: SelectInputProps) {
  const { colors, typography } = useTheme();
  const styles = getStyles(colors, typography);
  const [show, setShow] = useState(false);

  const selectedOption = options.find((opt) => opt.value === value);
  const displayValue = selectedOption ? selectedOption.label : value;

  const handlePress = () => {
    setShow(true);
  };

  const handleSelect = (val: string) => {
    onChange(val);
    setShow(false);
  };

  return (
    <View>
      <Pressable onPress={handlePress} accessibilityRole="button">
        <View pointerEvents="none">
          <Input
            label={label}
            value={displayValue}
            placeholder={placeholder}
            errorMessage={errorMessage}
            editable={false}
          />
        </View>
      </Pressable>

      <Modal visible={show} transparent animationType="fade" onRequestClose={() => setShow(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setShow(false)}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{label}</Text>
              <TouchableOpacity onPress={() => setShow(false)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.optionsList} showsVerticalScrollIndicator={false}>
              {options.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.optionItem,
                    value === option.value && styles.optionItemSelected
                  ]}
                  onPress={() => handleSelect(option.value)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      value === option.value && styles.optionTextSelected
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const getStyles = (colors: any, typography: any) => StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: Spacing.xl,
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    ...typography.headingSM,
    color: colors.textPrimary,
  },
  closeButton: {
    fontSize: 20,
    color: colors.textSecondary,
    fontWeight: 'bold',
  },
  optionsList: {
    paddingVertical: Spacing.xs,
  },
  optionItem: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  optionItemSelected: {
    backgroundColor: colors.primary + '15',
  },
  optionText: {
    ...typography.bodyMD,
    color: colors.textPrimary,
  },
  optionTextSelected: {
    color: colors.primary,
    fontWeight: 'bold',
  },
});
