import { getDatabase } from '../adapters/sqlite';
import { ConsumptionRecord } from '../models';
import { CreateConsumptionRecordDTO, UpdateConsumptionRecordDTO } from '../dto';
import { RecordNotFoundError } from '../helpers/errors';

export class ConsumptionRecordRepository {
    static mapRow(row: Record<string, any>): ConsumptionRecord {
        return {
            id: row.csr_id,
            medicationId: row.mdc_id,
            reminderId: row.mdr_id,
            scheduledDatetime: row.csr_scheduled_datetime,
            actionDatetime: row.csr_action_datetime,
            status: row.csr_status,
            quantityConsumed: row.csr_quantity_consumed,
            notes: row.csr_notes,
            postponedReminderDatetime: row.csr_postponed_reminder_datetime ?? null
        };
    }

    static async create(data: CreateConsumptionRecordDTO): Promise<number> {
        const db = getDatabase();

        const result = await db.runAsync(
            `INSERT INTO pbt_consumption_record (
                mdc_id, mdr_id, csr_scheduled_datetime, csr_action_datetime,
                csr_status, csr_quantity_consumed, csr_notes, csr_postponed_reminder_datetime
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                data.medicationId,
                data.reminderId ?? null,
                data.scheduledDatetime,
                data.actionDatetime,
                data.status,
                data.quantityConsumed ?? 1,
                data.notes ?? null,
                data.postponedReminderDatetime ?? null
            ]
        );

        return result.lastInsertRowId;
    }

    static async findById(id: number): Promise<ConsumptionRecord | null> {
        const db = getDatabase();
        const row = await db.getFirstAsync<any>(
            `SELECT * FROM pbt_consumption_record WHERE csr_id = ?`,
            [id]
        );
        return row ? this.mapRow(row) : null;
    }

    static async update(id: number, data: UpdateConsumptionRecordDTO): Promise<void> {
        const db = getDatabase();
        const current = await this.findById(id);
        if (!current) throw new RecordNotFoundError('ConsumptionRecord', id);

        await db.runAsync(
            `UPDATE pbt_consumption_record SET
                csr_status = ?,
                csr_quantity_consumed = ?,
                csr_notes = ?
             WHERE csr_id = ?`,
            [
                data.status !== undefined ? data.status : current.status,
                data.quantityConsumed !== undefined ? data.quantityConsumed : current.quantityConsumed,
                data.notes !== undefined ? data.notes : current.notes,
                id
            ]
        );
    }

    static async delete(id: number): Promise<void> {
        const db = getDatabase();
        const result = await db.runAsync(
            `DELETE FROM pbt_consumption_record WHERE csr_id = ?`,
            [id]
        );

        if (result.changes === 0) {
            throw new RecordNotFoundError('ConsumptionRecord', id);
        }
    }
}
