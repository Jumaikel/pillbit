// Domain Models for PillBit

export interface Medication {
    id: number;
    name: string;
    dosage: string;
    presentation: string | null;
    quantityAvailable: number | null;
    expirationDate: string; // ISO format (YYYY-MM-DD)
    notes: string | null;
    photoPath: string | null;
    createdDatetime: string;
    updatedDatetime: string;
    deletedDatetime: string | null;
    isDiscarded: boolean;
}

export interface MedicationReminder {
    id: number;
    medicationId: number;
    reminderTime: string; // Time (HH:MM)
    isActive: boolean;
    createdDatetime: string;
    updatedDatetime: string;
}

export interface MedicationAiInformation {
    id: number;
    medicationId: number;
    description: string | null;
    commonUses: string | null;
    dosageAdministration: string | null;
    contraindications: string | null;
    sideEffects: string | null;
    warnings: string | null;
    interactions: string | null;
    generatedDatetime: string;
}

export type ExpirationAlertType = '30_days_before' | '7_days_before' | '1_day_before' | 'expiration_day' | 'expired';

export interface ExpirationAlert {
    id: number;
    medicationId: number;
    type: ExpirationAlertType;
    alertDatetime: string;
    isSent: boolean;
    sentDatetime: string | null;
}

export type ConsumptionStatus = 'taken' | 'skipped';

export interface ConsumptionRecord {
    id: number;
    medicationId: number;
    reminderId: number | null;
    scheduledDatetime: string;
    actionDatetime: string;
    status: ConsumptionStatus;
    quantityConsumed: number;
    notes: string | null;
}

export type NotificationType = 'dose_reminder' | 'expiration_warning';

export interface NotificationLog {
    id: number;
    medicationId: number | null;
    reminderId: number | null;
    expirationAlertId: number | null;
    type: NotificationType;
    scheduledDatetime: string | null;
    sentDatetime: string;
    isOpened: boolean;
}

export type TextSize = 'normal' | 'large' | 'extra_large';
export type Theme = 'light' | 'dark' | 'system';

export interface ApplicationSetting {
    id: number; // Always 1
    textSize: TextSize;
    isHighContrastEnabled: boolean;
    isTextToSpeechEnabled: boolean;
    isVoiceNotificationEnabled: boolean;
    notifyDoseReminder: boolean;
    notifyExpirationWarning: boolean;
    isNotificationSoundEnabled: boolean;
    isNotificationVibrationEnabled: boolean;
    theme: Theme;
    aiInfoAutoGenerate: boolean;
    showMedicalDisclaimer: boolean;
    isAiEnabled: boolean;
    aiModel: string;
    language: string;
    lastAiRequestDate: string | null;
    createdDatetime: string;
    updatedDatetime: string;
}
