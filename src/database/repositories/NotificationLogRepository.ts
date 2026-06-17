import { getDatabase } from '../adapters/sqlite';
import { NotificationLog } from '../models';
import { CreateNotificationLogDTO, UpdateNotificationLogDTO } from '../dto';
import { RecordNotFoundError } from '../helpers/errors';

export class NotificationLogRepository {
    static mapRow(row: Record<string, any>): NotificationLog {
        return {
            id: row.ntf_id,
            medicationId: row.mdc_id,
            reminderId: row.mdr_id,
            expirationAlertId: row.eal_id,
            type: row.ntf_type,
            scheduledDatetime: row.ntf_scheduled_datetime,
            sentDatetime: row.ntf_sent_datetime,
            isOpened: row.ntf_is_opened === 1
        };
    }

    static async create(data: CreateNotificationLogDTO): Promise<number> {
        const db = getDatabase();

        const result = await db.runAsync(
            `INSERT INTO pbt_notification_log (
                mdc_id, mdr_id, eal_id, ntf_type,
                ntf_scheduled_datetime, ntf_sent_datetime, ntf_is_opened
            ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                data.medicationId ?? null,
                data.reminderId ?? null,
                data.expirationAlertId ?? null,
                data.type,
                data.scheduledDatetime ?? null,
                data.sentDatetime,
                data.isOpened ? 1 : 0
            ]
        );

        return result.lastInsertRowId;
    }

    static async findById(id: number): Promise<NotificationLog | null> {
        const db = getDatabase();
        const row = await db.getFirstAsync<any>(
            `SELECT * FROM pbt_notification_log WHERE ntf_id = ?`,
            [id]
        );
        return row ? this.mapRow(row) : null;
    }

    static async update(id: number, data: UpdateNotificationLogDTO): Promise<void> {
        const db = getDatabase();
        const current = await this.findById(id);
        if (!current) throw new RecordNotFoundError('NotificationLog', id);

        await db.runAsync(
            `UPDATE pbt_notification_log SET
                ntf_is_opened = ?
             WHERE ntf_id = ?`,
            [
                data.isOpened !== undefined ? (data.isOpened ? 1 : 0) : (current.isOpened ? 1 : 0),
                id
            ]
        );
    }
}
