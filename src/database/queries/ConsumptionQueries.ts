import { getDatabase } from '../adapters/sqlite';
import { ConsumptionRecord } from '../models';

export interface ConsumptionHistoryItem extends ConsumptionRecord {
    medicationName: string;
    medicationDosage: string;
}

export interface ConsumptionHistoryFilters {
    medicationId?: number;
    status?: string;
    startDate?: string;
    endDate?: string;
}

export class ConsumptionQueries {
    private static mapRow(row: any): ConsumptionHistoryItem {
        return {
            id: row.csr_id,
            medicationId: row.mdc_id,
            reminderId: row.mdr_id,
            scheduledDatetime: row.csr_scheduled_datetime,
            actionDatetime: row.csr_action_datetime,
            status: row.csr_status,
            quantityConsumed: row.csr_quantity_consumed,
            notes: row.csr_notes,
            postponedReminderDatetime: row.csr_postponed_reminder_datetime ?? null,
            medicationName: row.mdc_name,
            medicationDosage: row.mdc_dosage
        };
    }

    static async getConsumptionHistory(
        filters: ConsumptionHistoryFilters = {},
        limit: number = 100,
        offset: number = 0
    ): Promise<ConsumptionHistoryItem[]> {
        const db = getDatabase();
        
        let query = `
            SELECT c.*, m.mdc_name, m.mdc_dosage
            FROM pbt_consumption_record c
            JOIN pbt_medication m ON c.mdc_id = m.mdc_id
            WHERE 1=1
        `;
        
        const params: any[] = [];
        
        if (filters.medicationId !== undefined) {
            query += ` AND c.mdc_id = ?`;
            params.push(filters.medicationId);
        }
        
        if (filters.status) {
            query += ` AND c.csr_status = ?`;
            params.push(filters.status);
        }
        
        if (filters.startDate) {
            query += ` AND c.csr_action_datetime >= ?`;
            params.push(filters.startDate);
        }
        
        if (filters.endDate) {
            query += ` AND c.csr_action_datetime <= ?`;
            params.push(filters.endDate);
        }
        
        query += ` ORDER BY c.csr_action_datetime DESC LIMIT ? OFFSET ?`;
        params.push(limit, offset);

        const rows = await db.getAllAsync<any>(query, params);
        return rows.map(this.mapRow);
    }

    /**
     * Paginated consumption history for a specific medication.
     */
    static async getConsumptionHistoryByMedication(
        medicationId: number,
        status?: string,
        limit: number = 50,
        offset: number = 0
    ): Promise<ConsumptionHistoryItem[]> {
        const db = getDatabase();

        let query = `
            SELECT c.*, m.mdc_name, m.mdc_dosage
            FROM pbt_consumption_record c
            JOIN pbt_medication m ON c.mdc_id = m.mdc_id
            WHERE c.mdc_id = ?
        `;
        const params: any[] = [medicationId];

        if (status) {
            query += ` AND c.csr_status = ?`;
            params.push(status);
        }

        query += ` ORDER BY c.csr_action_datetime DESC LIMIT ? OFFSET ?`;
        params.push(limit, offset);

        const rows = await db.getAllAsync<any>(query, params);
        return rows.map(ConsumptionQueries.mapRow);
    }
}
