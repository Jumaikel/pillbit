import { ConsumptionStatus } from '@/database/models';

export interface HistoryFilters {
    medicationId?: number;
    status?: ConsumptionStatus;
    startDate?: string;
    endDate?: string;
}

// We re-export the query item for easier use within the feature
export type { ConsumptionHistoryItem } from '@/database/queries/ConsumptionQueries';
export type { MedicationTodayDose } from '../services/DoseLogService';
