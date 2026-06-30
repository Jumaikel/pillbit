import { Medication } from '@/database/models';
import { ExpirationStatus } from '@/features/medication/types';

export interface MedicationExpirationState extends Medication {
    expirationStatus: ExpirationStatus;
    daysRemaining: number;
}

export type { ExpirationStatus };
