import { ConsumptionStatus } from '@/database/models';

export interface TodayDose {
    reminderId: number;
    reminderTime: string; // HH:MM
    medicationId: number;
    medicationName: string;
    dosage: string;
    status: ConsumptionStatus | null; // null if pending
    consumptionId: number | null;
}
