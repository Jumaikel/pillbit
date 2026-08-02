import { getDatabase } from '../adapters/sqlite';
import { Medication, MedicationReminder, ConsumptionRecord } from '../models';

export class MedicationQueries {
    private static mapMedicationRow(row: any): Medication {
        return {
            id: row.mdc_id,
            name: row.mdc_name,
            dosage: row.mdc_dosage,
            presentation: row.mdc_presentation,
            quantityAvailable: row.mdc_quantity_available,
            expirationDate: row.mdc_expiration_date,
            notes: row.mdc_notes,
            photoPath: row.mdc_photo_path,
            createdDatetime: row.mdc_created_datetime,
            updatedDatetime: row.mdc_updated_datetime,
            deletedDatetime: row.mdc_deleted_datetime,
            isDiscarded: row.mdc_is_discarded === 1
        };
    }

    static async getAllMedications(): Promise<Medication[]> {
        const db = getDatabase();
        const rows = await db.getAllAsync<any>(
            `SELECT * FROM pbt_medication WHERE mdc_deleted_datetime IS NULL ORDER BY mdc_name ASC`
        );
        return rows.map(this.mapMedicationRow);
    }

    static async getMedicationsExpiringSoon(daysThreshold: number = 30): Promise<Medication[]> {
        const db = getDatabase();
        const rows = await db.getAllAsync<any>(
            `SELECT * FROM pbt_medication 
             WHERE mdc_deleted_datetime IS NULL 
             AND mdc_is_discarded = 0
             AND mdc_expiration_date >= date('now') 
             AND mdc_expiration_date <= date('now', '+' || ? || ' days')
             ORDER BY mdc_expiration_date ASC`,
            [daysThreshold]
        );
        return rows.map(this.mapMedicationRow);
    }

    static async getExpiredMedications(): Promise<Medication[]> {
        const db = getDatabase();
        const rows = await db.getAllAsync<any>(
            `SELECT * FROM pbt_medication 
             WHERE mdc_deleted_datetime IS NULL 
             AND mdc_is_discarded = 0
             AND mdc_expiration_date < date('now')
             ORDER BY mdc_expiration_date ASC`
        );
        return rows.map(this.mapMedicationRow);
    }

    static async getDiscardedMedications(): Promise<Medication[]> {
        const db = getDatabase();
        const rows = await db.getAllAsync<any>(
            `SELECT * FROM pbt_medication 
             WHERE mdc_deleted_datetime IS NULL 
             AND mdc_is_discarded = 1
             ORDER BY mdc_name ASC`
        );
        return rows.map(this.mapMedicationRow);
    }


    static async getActiveReminders(): Promise<(MedicationReminder & { medicationName: string })[]> {
        const db = getDatabase();
        const rows = await db.getAllAsync<any>(
            `SELECT r.*, m.mdc_name 
             FROM pbt_medication_reminder r
             JOIN pbt_medication m ON r.mdc_id = m.mdc_id
             WHERE r.mdr_is_active = 1 
             AND m.mdc_deleted_datetime IS NULL
             AND m.mdc_is_discarded = 0
             ORDER BY r.mdr_reminder_time ASC`
        );
        return rows.map(row => ({
            id: row.mdr_id,
            medicationId: row.mdc_id,
            reminderTime: row.mdr_reminder_time,
            isActive: row.mdr_is_active === 1,
            createdDatetime: row.mdr_created_datetime,
            updatedDatetime: row.mdr_updated_datetime,
            medicationName: row.mdc_name
        }));
    }

    static async getRemindersByMedicationId(medicationId: number): Promise<MedicationReminder[]> {
        const db = getDatabase();
        const rows = await db.getAllAsync<any>(
            `SELECT * FROM pbt_medication_reminder 
             WHERE mdc_id = ?
             ORDER BY mdr_reminder_time ASC`,
            [medicationId]
        );
        return rows.map(row => ({
            id: row.mdr_id,
            medicationId: row.mdc_id,
            reminderTime: row.mdr_reminder_time,
            isActive: row.mdr_is_active === 1,
            createdDatetime: row.mdr_created_datetime,
            updatedDatetime: row.mdr_updated_datetime
        }));
    }

    static async getMedicationHistory(medicationId: number, limit: number = 50): Promise<ConsumptionRecord[]> {
        const db = getDatabase();
        const rows = await db.getAllAsync<any>(
            `SELECT * FROM pbt_consumption_record 
             WHERE mdc_id = ?
             ORDER BY csr_action_datetime DESC
             LIMIT ?`,
            [medicationId, limit]
        );
        return rows.map(row => ({
            id: row.csr_id,
            medicationId: row.mdc_id,
            reminderId: row.mdr_id,
            scheduledDatetime: row.csr_scheduled_datetime,
            actionDatetime: row.csr_action_datetime,
            status: row.csr_status,
            quantityConsumed: row.csr_quantity_consumed,
            notes: row.csr_notes
        }));
    }

    static async getTodaySchedule(): Promise<any[]> {
        const db = getDatabase();
        const rows = await db.getAllAsync<any>(
            `SELECT 
                r.mdr_id as reminderId,
                r.mdr_reminder_time as reminderTime,
                m.mdc_id as medicationId,
                m.mdc_name as medicationName,
                m.mdc_dosage as dosage,
                c.csr_status as status,
                c.csr_id as consumptionId
             FROM pbt_medication_reminder r
             JOIN pbt_medication m ON r.mdc_id = m.mdc_id
             LEFT JOIN pbt_consumption_record c 
                ON r.mdr_id = c.mdr_id AND date(c.csr_scheduled_datetime) = date('now', 'localtime')
             WHERE r.mdr_is_active = 1 
             AND m.mdc_deleted_datetime IS NULL
             AND m.mdc_is_discarded = 0
             ORDER BY r.mdr_reminder_time ASC`
        );
        return rows;
    }

    /**
     * Returns today's scheduled doses for a specific medication.
     * Includes regular reminders + any postponed-reminder slots logged today.
     */
    static async getMedicationTodaySchedule(medicationId: number): Promise<any[]> {
        const db = getDatabase();
        const rows = await db.getAllAsync<any>(
            `SELECT 
                r.mdr_id          AS reminderId,
                r.mdr_reminder_time AS reminderTime,
                m.mdc_id           AS medicationId,
                m.mdc_name         AS medicationName,
                m.mdc_dosage       AS dosage,
                c.csr_id           AS consumptionId,
                c.csr_status       AS status,
                c.csr_action_datetime AS actionDatetime,
                c.csr_scheduled_datetime AS scheduledDatetime
             FROM pbt_medication_reminder r
             JOIN pbt_medication m ON r.mdc_id = m.mdc_id
             LEFT JOIN pbt_consumption_record c 
                ON r.mdr_id = c.mdr_id 
                AND date(c.csr_scheduled_datetime) = date('now', 'localtime')
             WHERE r.mdr_is_active = 1 
             AND m.mdc_deleted_datetime IS NULL
             AND m.mdc_is_discarded = 0
             AND m.mdc_id = ?
             ORDER BY r.mdr_reminder_time ASC`,
            [medicationId]
        );
        return rows;
    }
}
