import { ConsumptionRecordRepository } from '@/database/repositories/ConsumptionRecordRepository';

import { ConsumptionQueries, ConsumptionHistoryItem, ConsumptionHistoryFilters } from '@/database/queries/ConsumptionQueries';
import { ConsumptionStatus } from '@/database/models';

export class HistoryService {
    /**
     * Registers a consumption action for a medication and optionally reduces available stock.
     */
    static async registerConsumption(
        medicationId: number,
        status: ConsumptionStatus,
        quantityConsumed: number = 1,
        reminderId?: number,
        notes?: string
    ): Promise<number> {
        const now = new Date().toISOString();

        // Create the consumption record
        const recordId = await ConsumptionRecordRepository.create({
            medicationId,
            reminderId: reminderId ?? null,
            scheduledDatetime: now, // If reminderId exists, ideally use its time, but for manual actions 'now' is fine
            actionDatetime: now,
            status,
            quantityConsumed,
            notes
        });

        return recordId;
    }

    /**
     * Fetches consumption history based on filters
     */
    static async getHistory(filters: ConsumptionHistoryFilters): Promise<ConsumptionHistoryItem[]> {
        return await ConsumptionQueries.getConsumptionHistory(filters);
    }
}
