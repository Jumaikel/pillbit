/**
 * DoseLogService
 *
 * Encapsulates the business logic for logging medication doses (taken/skipped/postponed).
 * When a dose is postponed, it schedules a temporary one-time local notification and
 * records the postponed time in the consumption record.
 */

import { ConsumptionRecordRepository } from '@/database/repositories/ConsumptionRecordRepository';

import { MedicationQueries } from '@/database/queries/MedicationQueries';
import { ConsumptionQueries, ConsumptionHistoryItem } from '@/database/queries/ConsumptionQueries';
import { ConsumptionStatus } from '@/database/models';


export interface MedicationTodayDose {
    reminderId: number;
    reminderTime: string;           // HH:MM
    medicationId: number;
    medicationName: string;
    dosage: string;
    consumptionId: number | null;
    status: ConsumptionStatus | null;
    actionDatetime: string | null;
    scheduledDatetime: string | null;
}

export class DoseLogService {
    /**
     * Returns today's dose schedule for a specific medication.
     */
    static async getTodayDosesForMedication(medicationId: number): Promise<MedicationTodayDose[]> {
        const rows = await MedicationQueries.getMedicationTodaySchedule(medicationId);
        return rows.map((row: any) => ({
            reminderId: row.reminderId,
            reminderTime: row.reminderTime,
            medicationId: row.medicationId,
            medicationName: row.medicationName,
            dosage: row.dosage,
            consumptionId: row.consumptionId ?? null,
            status: row.status ?? null,
            actionDatetime: row.actionDatetime ?? null,
            scheduledDatetime: row.scheduledDatetime ?? null,
        }));
    }

    /**
     * Logs a dose action.
     * - 'taken'    → records consumption and optionally reduces stock
     * - 'skipped'  → records as skipped
     * - 'postponed'→ records as postponed + schedules a temporary notification
     *
     * @returns The id of the new ConsumptionRecord
     */
    static async logDose(
        medicationId: number,
        reminderId: number,
        status: ConsumptionStatus,
        scheduledDatetime: string,
        notes?: string
    ): Promise<number> {
        const now = new Date().toISOString();

        const recordId = await ConsumptionRecordRepository.create({
            medicationId,
            reminderId,
            scheduledDatetime,
            actionDatetime: now,
            status,
            quantityConsumed: status === 'taken' ? 1 : 0,
            notes: notes ?? null
        });

        return recordId;
    }

    /**
     * Fetches paginated history for a specific medication.
     */
    static async getMedicationHistory(
        medicationId: number,
        status?: string,
        limit: number = 50,
        offset: number = 0
    ): Promise<ConsumptionHistoryItem[]> {
        return ConsumptionQueries.getConsumptionHistoryByMedication(medicationId, status, limit, offset);
    }
}
