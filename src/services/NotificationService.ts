import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { Medication, MedicationReminder, MedicationQueries } from '@/database';

// Configure how notifications should behave when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export class NotificationService {
  /**
   * Request user permissions for notifications.
   * Gracefully handles already granted or permanently denied states.
   */
  static async requestPermissionsAsync(): Promise<boolean> {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#24C9EA',
      });
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    return finalStatus === 'granted';
  }

  /**
   * Schedule a new local notification for a reminder.
   * @param reminder The MedicationReminder entity
   * @param medication The Medication entity (for name and dosage)
   */
  static async scheduleReminder(reminder: MedicationReminder, medication: Medication): Promise<void> {
    const hasPermission = await this.requestPermissionsAsync();
    if (!hasPermission) {
      console.warn('Notification permissions denied. Cannot schedule reminder.');
      return;
    }

    // Parse the reminderTime (HH:MM)
    const [hours, minutes] = reminder.reminderTime.split(':').map(Number);

    await Notifications.scheduleNotificationAsync({
      content: {
        title: `Time for ${medication.name}`,
        body: `Dosage: ${medication.dosage}`,
        data: { reminderId: reminder.id, medicationId: medication.id },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: hours,
        minute: minutes,
      },
    });
  }

  /**
   * Cancel a specific reminder notification by finding its reminderId in the data payload.
   */
  static async cancelReminder(reminderId: number): Promise<void> {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    for (const req of scheduled) {
      if (req.content.data?.reminderId === reminderId) {
        await Notifications.cancelScheduledNotificationAsync(req.identifier);
      }
    }
  }

  /**
   * Cancel all notifications for a specific medication.
   */
  static async cancelAllForMedication(medicationId: number): Promise<void> {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    for (const req of scheduled) {
      if (req.content.data?.medicationId === medicationId) {
        await Notifications.cancelScheduledNotificationAsync(req.identifier);
      }
    }
  }

  /**
   * Re-sync notifications.
   * This clears stale notifications and recreates active ones based on SQLite.
   * Should be called on application startup.
   */
  static async syncReminders(): Promise<void> {
    const hasPermission = await this.requestPermissionsAsync();
    if (!hasPermission) return;

    // Fetch active reminders from database
    const activeReminders = await MedicationQueries.getActiveReminders();
    
    // Get all scheduled notifications
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    
    // Create sets for easy comparison
    const dbActiveReminderIds = new Set(activeReminders.map(r => r.id));
    const scheduledReminderIds = new Set(
      scheduled
        .map(req => req.content.data?.reminderId as number | undefined)
        .filter((id): id is number => id !== undefined)
    );

    // Cancel notifications that are no longer active in DB
    for (const req of scheduled) {
      const reminderId = req.content.data?.reminderId as number | undefined;
      if (reminderId !== undefined && !dbActiveReminderIds.has(reminderId)) {
        await Notifications.cancelScheduledNotificationAsync(req.identifier);
      }
    }

    // Schedule notifications that are active in DB but not scheduled
    for (const reminder of activeReminders) {
      if (!scheduledReminderIds.has(reminder.id)) {
        // Find medication object to pass
        const medications = await MedicationQueries.getAllMedications();
        const medication = medications.find(m => m.id === reminder.medicationId);
        
        if (medication) {
          // Parse time for trigger
          const [hours, minutes] = reminder.reminderTime.split(':').map(Number);
          
          await Notifications.scheduleNotificationAsync({
            content: {
              title: `Time for ${reminder.medicationName}`,
              body: `Dosage: ${medication.dosage}`,
              data: { reminderId: reminder.id, medicationId: reminder.medicationId },
            },
            trigger: {
              type: Notifications.SchedulableTriggerInputTypes.DAILY,
              hour: hours,
              minute: minutes,
            },
          });
        }
      }
    }
  }
}
