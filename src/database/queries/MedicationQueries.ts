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
            lowStockThreshold: row.mdc_low_stock_threshold,
            expirationDate: row.mdc_expiration_date,
            notes: row.mdc_notes,
            photoPath: row.mdc_photo_path,
            createdDatetime: row.mdc_created_datetime,
            updatedDatetime: row.mdc_updated_datetime,
            deletedDatetime: row.mdc_deleted_datetime
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
             AND mdc_expiration_date < date('now')
             ORDER BY mdc_expiration_date ASC`
        );
        return rows.map(this.mapMedicationRow);
    }

    static async getLowStockMedications(): Promise<Medication[]> {
        const db = getDatabase();
        const rows = await db.getAllAsync<any>(
            `SELECT * FROM pbt_medication 
             WHERE mdc_deleted_datetime IS NULL 
             AND mdc_quantity_available IS NOT NULL 
             AND mdc_low_stock_threshold IS NOT NULL
             AND mdc_quantity_available <= mdc_low_stock_threshold
             ORDER BY mdc_quantity_available ASC`
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
}
