import { getDatabase } from '../adapters/sqlite';
import { ApplicationSetting } from '../models';
import { UpdateApplicationSettingDTO } from '../dto';

export class ApplicationSettingRepository {
    static mapRow(row: Record<string, any>): ApplicationSetting {
        return {
            id: row.ast_id,
            textSize: row.ast_text_size,
            isHighContrastEnabled: row.ast_is_high_contrast_enabled === 1,
            isTextToSpeechEnabled: row.ast_is_text_to_speech_enabled === 1,
            isVoiceNotificationEnabled: row.ast_is_voice_notification_enabled === 1,
            notifyDoseReminder: row.ast_notify_dose_reminder === 1,
            notifyExpirationWarning: row.ast_notify_expiration_warning === 1,
            isNotificationSoundEnabled: row.ast_is_notification_sound_enabled === 1,
            isNotificationVibrationEnabled: row.ast_is_notification_vibration_enabled === 1,
            theme: row.ast_theme,
            aiInfoAutoGenerate: row.ast_ai_info_auto_generate === 1,
            showMedicalDisclaimer: row.ast_show_medical_disclaimer === 1,
            isAiEnabled: row.ast_is_ai_enabled === 1,
            aiModel: row.ast_ai_model,
            language: row.ast_language,
            createdDatetime: row.ast_created_datetime,
            updatedDatetime: row.ast_updated_datetime
        };
    }

    /**
     * Initializes the singleton setting if it doesn't exist.
     */
    static async initialize(): Promise<void> {
        const db = getDatabase();
        const existing = await this.get();
        if (!existing) {
            const now = new Date().toISOString();
            // Using default values from the schema
            await db.runAsync(
                `INSERT INTO pbt_application_setting (ast_id, ast_created_datetime, ast_updated_datetime)
                 VALUES (1, ?, ?)`,
                [now, now]
            );
        }
    }

    static async get(): Promise<ApplicationSetting | null> {
        const db = getDatabase();
        const row = await db.getFirstAsync<any>(
            `SELECT * FROM pbt_application_setting WHERE ast_id = 1`
        );
        return row ? this.mapRow(row) : null;
    }

    static async update(data: UpdateApplicationSettingDTO): Promise<void> {
        const db = getDatabase();
        const current = await this.get();
        if (!current) throw new Error('Settings not initialized');
        const now = new Date().toISOString();

        await db.runAsync(
            `UPDATE pbt_application_setting SET
                ast_text_size = ?,
                ast_is_high_contrast_enabled = ?,
                ast_is_text_to_speech_enabled = ?,
                ast_is_voice_notification_enabled = ?,
                ast_notify_dose_reminder = ?,
                ast_notify_expiration_warning = ?,
                ast_is_notification_sound_enabled = ?,
                ast_is_notification_vibration_enabled = ?,
                ast_theme = ?,
                ast_ai_info_auto_generate = ?,
                ast_show_medical_disclaimer = ?,
                ast_is_ai_enabled = ?,
                ast_ai_model = ?,
                ast_language = ?,
                ast_updated_datetime = ?
             WHERE ast_id = 1`,
            [
                data.textSize !== undefined ? data.textSize : current.textSize,
                data.isHighContrastEnabled !== undefined ? (data.isHighContrastEnabled ? 1 : 0) : (current.isHighContrastEnabled ? 1 : 0),
                data.isTextToSpeechEnabled !== undefined ? (data.isTextToSpeechEnabled ? 1 : 0) : (current.isTextToSpeechEnabled ? 1 : 0),
                data.isVoiceNotificationEnabled !== undefined ? (data.isVoiceNotificationEnabled ? 1 : 0) : (current.isVoiceNotificationEnabled ? 1 : 0),
                data.notifyDoseReminder !== undefined ? (data.notifyDoseReminder ? 1 : 0) : (current.notifyDoseReminder ? 1 : 0),
                data.notifyExpirationWarning !== undefined ? (data.notifyExpirationWarning ? 1 : 0) : (current.notifyExpirationWarning ? 1 : 0),
                data.isNotificationSoundEnabled !== undefined ? (data.isNotificationSoundEnabled ? 1 : 0) : (current.isNotificationSoundEnabled ? 1 : 0),
                data.isNotificationVibrationEnabled !== undefined ? (data.isNotificationVibrationEnabled ? 1 : 0) : (current.isNotificationVibrationEnabled ? 1 : 0),
                data.theme !== undefined ? data.theme : current.theme,
                data.aiInfoAutoGenerate !== undefined ? (data.aiInfoAutoGenerate ? 1 : 0) : (current.aiInfoAutoGenerate ? 1 : 0),
                data.showMedicalDisclaimer !== undefined ? (data.showMedicalDisclaimer ? 1 : 0) : (current.showMedicalDisclaimer ? 1 : 0),
                data.isAiEnabled !== undefined ? (data.isAiEnabled ? 1 : 0) : (current.isAiEnabled ? 1 : 0),
                data.aiModel !== undefined ? data.aiModel : current.aiModel,
                data.language !== undefined ? data.language : current.language,
                now
            ]
        );
    }
}
