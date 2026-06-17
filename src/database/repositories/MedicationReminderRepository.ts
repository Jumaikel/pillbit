import { getDatabase } from '../adapters/sqlite';
import { MedicationReminder } from '../models';
import { CreateMedicationReminderDTO, UpdateMedicationReminderDTO } from '../dto';
import { RecordNotFoundError } from '../helpers/errors';

export class MedicationReminderRepository {
    static mapRow(row: Record<string, any>): MedicationReminder {
        return {
            id: row.mdr_id,
            medicationId: row.mdc_id,
            reminderTime: row.mdr_reminder_time,
            isActive: row.mdr_is_active === 1,
            createdDatetime: row.mdr_created_datetime,
            updatedDatetime: row.mdr_updated_datetime
        };
    }

    static async create(data: CreateMedicationReminderDTO): Promise<number> {
        const db = getDatabase();
        const now = new Date().toISOString();

        const result = await db.runAsync(
            `INSERT INTO pbt_medication_reminder (
                mdc_id, mdr_reminder_time, mdr_is_active, 
                mdr_created_datetime, mdr_updated_datetime
            ) VALUES (?, ?, ?, ?, ?)`,
            [
                data.medicationId, 
                data.reminderTime, 
                data.isActive !== false ? 1 : 0, 
                now, 
                now
            ]
        );

        return result.lastInsertRowId;
    }

    static async findById(id: number): Promise<MedicationReminder | null> {
        const db = getDatabase();
        const row = await db.getFirstAsync<any>(
            `SELECT * FROM pbt_medication_reminder WHERE mdr_id = ?`,
            [id]
        );
        return row ? this.mapRow(row) : null;
    }

    static async update(id: number, data: UpdateMedicationReminderDTO): Promise<void> {
        const db = getDatabase();
        const current = await this.findById(id);
        if (!current) throw new RecordNotFoundError('MedicationReminder', id);

        const now = new Date().toISOString();
        
        await db.runAsync(
            `UPDATE pbt_medication_reminder SET
                mdr_reminder_time = ?,
                mdr_is_active = ?,
                mdr_updated_datetime = ?
             WHERE mdr_id = ?`,
            [
                data.reminderTime !== undefined ? data.reminderTime : current.reminderTime,
                data.isActive !== undefined ? (data.isActive ? 1 : 0) : (current.isActive ? 1 : 0),
                now,
                id
            ]
        );
    }

    static async delete(id: number): Promise<void> {
        const db = getDatabase();
        const result = await db.runAsync(
            `DELETE FROM pbt_medication_reminder WHERE mdr_id = ?`,
            [id]
        );

        if (result.changes === 0) {
            throw new RecordNotFoundError('MedicationReminder', id);
        }
    }
}
