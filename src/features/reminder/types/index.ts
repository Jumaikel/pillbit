import { MedicationReminder } from '@/database';

export interface CreateReminderFormData {
  reminderTime: Date;
  isActive: boolean;
}

export type ReminderStoreState = {
  reminders: MedicationReminder[];
  isLoading: boolean;
  error: string | null;
};

export type ReminderStoreActions = {
  loadReminders: (medicationId: number) => Promise<void>;
  createReminder: (medicationId: number, reminderTime: string, isActive: boolean) => Promise<void>;
  updateReminder: (id: number, reminderTime: string, isActive: boolean) => Promise<void>;
  deleteReminder: (id: number) => Promise<void>;
  toggleReminder: (id: number, isActive: boolean) => Promise<void>;
  clearError: () => void;
};
