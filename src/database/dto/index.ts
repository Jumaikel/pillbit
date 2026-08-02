// DTOs for Creation and Update

import { 
    ExpirationAlertType, 
    ConsumptionStatus, 
    NotificationType, 
    TextSize, 
    Theme 
} from '../models';

export interface CreateMedicationDTO {
    name: string;
    dosage: string;
    presentation?: string | null;
    quantityAvailable?: number | null;
    expirationDate: string; 
    notes?: string | null;
    photoPath?: string | null;
}

export interface UpdateMedicationDTO extends Partial<CreateMedicationDTO> {
    deletedDatetime?: string | null; // For soft delete via manual update if needed
}

export interface CreateMedicationReminderDTO {
    medicationId: number;
    reminderTime: string; 
    isActive?: boolean | null; // defaults to true
}

export interface UpdateMedicationReminderDTO {
    reminderTime?: string;
    isActive?: boolean | null;
}

export interface CreateMedicationAiInformationDTO {
    medicationId: number;
    description?: string | null;
    commonUses?: string | null;
    dosageAdministration?: string | null;
    contraindications?: string | null;
    sideEffects?: string | null;
    warnings?: string | null;
    interactions?: string | null;
}

export type UpdateMedicationAiInformationDTO = Partial<Omit<CreateMedicationAiInformationDTO, 'medicationId'>>;

export interface CreateExpirationAlertDTO {
    medicationId: number;
    type: ExpirationAlertType;
    alertDatetime: string;
    isSent?: boolean | null; // defaults to false
}

export interface UpdateExpirationAlertDTO {
    isSent?: boolean | null;
    sentDatetime?: string | null;
}

export interface CreateConsumptionRecordDTO {
    medicationId: number;
    reminderId?: number | null; 
    scheduledDatetime: string;
    actionDatetime: string;
    status: ConsumptionStatus;
    quantityConsumed?: number | null; // defaults to 1
    notes?: string | null;
    postponedReminderDatetime?: string | null;
}

export interface UpdateConsumptionRecordDTO {
    status?: ConsumptionStatus;
    quantityConsumed?: number | null;
    notes?: string | null;
}

export interface CreateNotificationLogDTO {
    medicationId?: number | null;
    reminderId?: number | null;
    expirationAlertId?: number | null;
    type: NotificationType;
    scheduledDatetime?: string | null;
    sentDatetime: string;
    isOpened?: boolean | null; // defaults to false
}

export interface UpdateNotificationLogDTO {
    isOpened?: boolean | null;
}

export interface UpdateApplicationSettingDTO {
    textSize?: TextSize;
    isHighContrastEnabled?: boolean;
    isVoiceInputEnabled?: boolean;
    isTextToSpeechEnabled?: boolean;
    isVoiceNotificationEnabled?: boolean;
    notifyDoseReminder?: boolean;
    notifyExpirationWarning?: boolean;
    reminderSnoozeMinutes?: number; 
    isNotificationSoundEnabled?: boolean;
    isNotificationVibrationEnabled?: boolean;
    theme?: Theme;
    aiInfoAutoGenerate?: boolean;
    showMedicalDisclaimer?: boolean;
    isAiEnabled?: boolean;
    aiModel?: string;
    language?: string;
}
