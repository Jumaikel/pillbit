import { ExpirationStatus } from '../types';
import { MedicationRepository } from '@/database/repositories/MedicationRepository';
import { ExpirationAlertRepository } from '@/database/repositories/ExpirationAlertRepository';
import { getDatabase } from '@/database/adapters/sqlite';
import { ExpirationAlertType } from '@/database/models';

export class ExpirationService {
    /**
     * Calculates the expiration status and days remaining.
     * Uses start of day for accurate day differences.
     */
    static calculateStatus(expirationDateStr: string): { status: ExpirationStatus; daysRemaining: number } {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const expDate = new Date(expirationDateStr);
        expDate.setHours(0, 0, 0, 0);

        const diffTime = expDate.getTime() - today.getTime();
        const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        let status: ExpirationStatus = 'valid';
        if (daysRemaining < 0) {
            status = 'expired';
        } else if (daysRemaining <= 30) {
            status = 'expiring';
        }

        return { status, daysRemaining };
    }

    /**
     * Re-evaluates and generates alerts in the DB for a medication.
     * Should be called when a medication is created or its expiration date is updated.
     */
    static async generateAlerts(medicationId: number, expirationDateStr: string): Promise<void> {
        try {
            const expDate = new Date(expirationDateStr);
            expDate.setHours(9, 0, 0, 0); // Alerts at 9 AM

            const alertTypes: { type: ExpirationAlertType; daysBefore: number }[] = [
                { type: '30_days_before', daysBefore: 30 },
                { type: '7_days_before', daysBefore: 7 },
                { type: '1_day_before', daysBefore: 1 },
                { type: 'expiration_day', daysBefore: 0 },
                { type: 'expired', daysBefore: -1 }, // 1 day after
            ];

            const db = getDatabase();

            // Remove existing alerts that haven't been sent yet
            await db.runAsync(
                `DELETE FROM pbt_expiration_alert WHERE mdc_id = ? AND eal_is_sent = 0`,
                [medicationId]
            );

            // If the medication is discarded, we don't generate any new alerts
            const medication = await MedicationRepository.findById(medicationId);
            if (medication?.isDiscarded) {
                return;
            }

            const now = new Date();

            for (const config of alertTypes) {
                const alertDatetime = new Date(expDate);
                alertDatetime.setDate(alertDatetime.getDate() - config.daysBefore);

                // Only create if the alert date is in the future
                if (alertDatetime > now) {
                    try {
                        await ExpirationAlertRepository.create({
                            medicationId,
                            type: config.type,
                            alertDatetime: alertDatetime.toISOString()
                        });
                    } catch (error) {
                        console.error('Failed to create expiration alert', error);
                    }
                }
            }
        } catch (e) {
            console.error('[ExpirationService] generateAlerts failed:', e);
        }
    }
}
