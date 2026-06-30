import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { Medication, MedicationReminder, MedicationQueries } from '@/database';
import { getDatabase } from '@/database/adapters/sqlite';

// Fallback/Mock for Notifications in Expo Go
let Notifications: any = {
  setNotificationHandler: () => {},
  getPermissionsAsync: async () => ({ status: 'granted' }),
  requestPermissionsAsync: async () => ({ status: 'granted' }),
  scheduleNotificationAsync: async () => 'mock-id',
  cancelScheduledNotificationAsync: async () => {},
  getAllScheduledNotificationsAsync: async () => [],
  setNotificationChannelAsync: async () => {},
  AndroidImportance: { MAX: 5 },
  SchedulableTriggerInputTypes: { DAILY: 'daily' },
};

const isExpoGo = Constants.appOwnership === 'expo';

if (!isExpoGo) {
  try {
    Notifications = require('expo-notifications');
  } catch (e) {
    console.warn('expo-notifications could not be loaded. Mocking instead.', e);
  }
} else {
  console.warn('Running in Expo Go. Notifications are mocked because SDK 53 removed them from Expo Go.');
}

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

  /**
   * Sync expiration alerts with the OS.
   * Cancels old expiration notifications and schedules new ones for pending alerts in the DB.
   */
  static async syncExpirationAlerts(): Promise<void> {
    const hasPermission = await this.requestPermissionsAsync();
    if (!hasPermission) return;

    const db = getDatabase();
    
    // Fetch pending expiration alerts joined with medication
    const pendingAlerts = await db.getAllAsync<any>(`
      SELECT e.*, m.mdc_name 
      FROM pbt_expiration_alert e
      JOIN pbt_medication m ON e.mdc_id = m.mdc_id
      WHERE e.eal_is_sent = 0 AND m.mdc_deleted_datetime IS NULL
    `);

    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    
    // Cancel all current expiration notifications
    for (const req of scheduled) {
      if (req.content.data?.expirationAlertId !== undefined) {
        await Notifications.cancelScheduledNotificationAsync(req.identifier);
      }
    }

    // Schedule new ones
    const now = new Date();
    for (const alert of pendingAlerts) {
      const alertDate = new Date(alert.eal_alert_datetime);
      if (alertDate > now) {
        let body = '';
        switch(alert.eal_type) {
          case '30_days_before': body = 'Expires in 30 days.'; break;
          case '7_days_before': body = 'Expires in 7 days.'; break;
          case '1_day_before': body = 'Expires tomorrow.'; break;
          case 'expiration_day': body = 'Expires today.'; break;
          case 'expired': body = 'Has expired.'; break;
        }

        await Notifications.scheduleNotificationAsync({
          content: {
            title: `Medication Expiration: ${alert.mdc_name}`,
            body,
            data: { expirationAlertId: alert.eal_id, medicationId: alert.mdc_id },
          },
          trigger: alertDate,
        });
      }
    }
  }
}
