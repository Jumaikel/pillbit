import { getDatabase } from '../adapters/sqlite';
import { ExpirationAlert } from '../models';
import { CreateExpirationAlertDTO, UpdateExpirationAlertDTO } from '../dto';
import { RecordNotFoundError } from '../helpers/errors';

export class ExpirationAlertRepository {
    static mapRow(row: Record<string, any>): ExpirationAlert {
        return {
            id: row.eal_id,
            medicationId: row.mdc_id,
            type: row.eal_type,
            alertDatetime: row.eal_alert_datetime,
            isSent: row.eal_is_sent === 1,
            sentDatetime: row.eal_sent_datetime
        };
    }

    static async create(data: CreateExpirationAlertDTO): Promise<number> {
        const db = getDatabase();

        const result = await db.runAsync(
            `INSERT INTO pbt_expiration_alert (
                mdc_id, eal_type, eal_alert_datetime, eal_is_sent
            ) VALUES (?, ?, ?, ?)`,
            [
                data.medicationId,
                data.type,
                data.alertDatetime,
                data.isSent ? 1 : 0
            ]
        );

        return result.lastInsertRowId;
    }

    static async findById(id: number): Promise<ExpirationAlert | null> {
        const db = getDatabase();
        const row = await db.getFirstAsync<any>(
            `SELECT * FROM pbt_expiration_alert WHERE eal_id = ?`,
            [id]
        );
        return row ? this.mapRow(row) : null;
    }

    static async update(id: number, data: UpdateExpirationAlertDTO): Promise<void> {
        const db = getDatabase();
        const current = await this.findById(id);
        if (!current) throw new RecordNotFoundError('ExpirationAlert', id);

        await db.runAsync(
            `UPDATE pbt_expiration_alert SET
                eal_is_sent = ?,
                eal_sent_datetime = ?
             WHERE eal_id = ?`,
            [
                data.isSent !== undefined ? (data.isSent ? 1 : 0) : (current.isSent ? 1 : 0),
                data.sentDatetime !== undefined ? data.sentDatetime : current.sentDatetime,
                id
            ]
        );
    }

    static async delete(id: number): Promise<void> {
        const db = getDatabase();
        const result = await db.runAsync(
            `DELETE FROM pbt_expiration_alert WHERE eal_id = ?`,
            [id]
        );

        if (result.changes === 0) {
            throw new RecordNotFoundError('ExpirationAlert', id);
        }
    }
}
