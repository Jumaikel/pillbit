import { create } from 'zustand';
import { MedicationReminderRepository, MedicationQueries, MedicationRepository } from '@/database';
import { ReminderStoreState, ReminderStoreActions } from '../types';
import { NotificationService } from '@/services/NotificationService';

export const useReminderStore = create<ReminderStoreState & ReminderStoreActions>((set, get) => ({
  reminders: [],
  isLoading: false,
  error: null,

  loadReminders: async (medicationId: number) => {
    set({ isLoading: true, error: null });
    try {
      const reminders = await MedicationQueries.getRemindersByMedicationId(medicationId);
      set({ reminders, isLoading: false });
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to load reminders';
      set({ error: message, isLoading: false });
    }
  },

  createReminder: async (medicationId: number, reminderTime: string, isActive: boolean) => {
    set({ isLoading: true, error: null });
    try {
      const id = await MedicationReminderRepository.create({ medicationId, reminderTime, isActive });
      
      if (isActive) {
        const reminder = await MedicationReminderRepository.findById(id);
        const medication = await MedicationRepository.findById(medicationId);
        if (reminder && medication) {
          await NotificationService.scheduleReminder(reminder, medication);
        }
      }

      const reminders = await MedicationQueries.getRemindersByMedicationId(medicationId);
      set({ reminders, isLoading: false });
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to create reminder';
      set({ error: message, isLoading: false });
      throw e;
    }
  },

  updateReminder: async (id: number, reminderTime: string, isActive: boolean) => {
    set({ isLoading: true, error: null });
    try {
      const existing = await MedicationReminderRepository.findById(id);
      if (!existing) throw new Error('Reminder not found');

      await MedicationReminderRepository.update(id, { reminderTime, isActive });
      
      const updated = await MedicationReminderRepository.findById(id);
      const medication = await MedicationRepository.findById(existing.medicationId);
      
      if (updated && medication) {
        // Always cancel existing
        await NotificationService.cancelReminder(id);
        
        // Re-schedule if active
        if (isActive) {
          await NotificationService.scheduleReminder(updated, medication);
        }
      }

      const reminders = await MedicationQueries.getRemindersByMedicationId(existing.medicationId);
      set({ reminders, isLoading: false });
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to update reminder';
      set({ error: message, isLoading: false });
      throw e;
    }
  },

  deleteReminder: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const existing = await MedicationReminderRepository.findById(id);
      if (!existing) throw new Error('Reminder not found');

      await MedicationReminderRepository.delete(id);
      
      // Cancel any scheduled notification
      await NotificationService.cancelReminder(id);

      const reminders = await MedicationQueries.getRemindersByMedicationId(existing.medicationId);
      set({ reminders, isLoading: false });
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to delete reminder';
      set({ error: message, isLoading: false });
      throw e;
    }
  },

  toggleReminder: async (id: number, isActive: boolean) => {
    set({ isLoading: true, error: null });
    try {
      const existing = await MedicationReminderRepository.findById(id);
      if (!existing) throw new Error('Reminder not found');

      await MedicationReminderRepository.update(id, { isActive });
      
      const updated = await MedicationReminderRepository.findById(id);
      const medication = await MedicationRepository.findById(existing.medicationId);

      if (updated && medication) {
        if (isActive) {
          await NotificationService.scheduleReminder(updated, medication);
        } else {
          await NotificationService.cancelReminder(id);
        }
      }

      const reminders = await MedicationQueries.getRemindersByMedicationId(existing.medicationId);
      set({ reminders, isLoading: false });
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to toggle reminder';
      set({ error: message, isLoading: false });
      throw e;
    }
  },

  clearError: () => set({ error: null }),
}));
