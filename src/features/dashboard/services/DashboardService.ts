import { MedicationQueries } from '@/database';
import { TodayDose } from '../types';

export class DashboardService {
    static async getTodaySchedule(): Promise<TodayDose[]> {
        const rows = await MedicationQueries.getTodaySchedule();
        return rows.map((row: any) => ({
            reminderId: row.reminderId,
            reminderTime: row.reminderTime,
            medicationId: row.medicationId,
            medicationName: row.medicationName,
            dosage: row.dosage,
            status: row.status || null,
            consumptionId: row.consumptionId || null,
        }));
    }
}
