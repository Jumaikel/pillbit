import { create } from 'zustand';
import { MedicationQueries } from '@/database/queries/MedicationQueries';
import { MedicationExpirationState } from '../types';
import { ExpirationService } from '../services/ExpirationService';

interface ExpirationState {
    expiringSoonList: MedicationExpirationState[];
    expiredList: MedicationExpirationState[];
    isLoading: boolean;
    error: string | null;

    refreshExpirationData: () => Promise<void>;
}

export const useExpirationStore = create<ExpirationState>((set) => ({
    expiringSoonList: [],
    expiredList: [],
    isLoading: false,
    error: null,

    refreshExpirationData: async () => {
        set({ isLoading: true, error: null });
        try {
            const [expiring, expired] = await Promise.all([
                MedicationQueries.getMedicationsExpiringSoon(30),
                MedicationQueries.getExpiredMedications(),
            ]);

            const mapWithStatus = (meds: any[]) => meds.map((m) => {
                const { status, daysRemaining } = ExpirationService.calculateStatus(m.expirationDate);
                return { ...m, expirationStatus: status, daysRemaining };
            });

            set({
                expiringSoonList: mapWithStatus(expiring),
                expiredList: mapWithStatus(expired),
                isLoading: false,
            });
        } catch (error: any) {
            set({ error: error.message || 'Failed to load expiration data', isLoading: false });
        }
    }
}));
