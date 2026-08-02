/**
 * InventoryService
 *
 * Centralized business logic for inventory management.
 *
 * Responsibilities:
 *  - Calculate inventory status from quantity + threshold
 *  - Enrich medication list with inventory state
 *
 * Architecture rules:
 *  - NEVER accesses SQLite directly — uses repositories and queries only
 *  - NEVER imports UI components or Zustand stores
 *  - All business rules for inventory live here
 */

import { Medication } from '@/database/models';
import { MedicationQueries } from '@/database/queries/MedicationQueries';
import { InventoryStatus, MedicationInventoryState } from '../types';

export class InventoryService {
    // ─── Status Calculation ────────────────────────────────────────────────────

    /**
     * Calculate the inventory status for a given quantity available.
     * @param quantityAvailable 
     * @returns 
     */
    static calculateInventoryStatus(
        quantityAvailable: number | null
    ): InventoryStatus {
        if (quantityAvailable === null) return 'untracked';
        if (quantityAvailable === 0) return 'empty';
        return 'normal';
    }

    // ─── Enrichment ────────────────────────────────────────────────────────────

    /**
     * Enrich a list of medications with their calculated inventory state.
     */
    static enrichWithInventoryState(
        medications: Medication[]
    ): MedicationInventoryState[] {
        return medications.map((med) => {
            const inventoryStatus = this.calculateInventoryStatus(med.quantityAvailable);
            return { ...med, inventoryStatus };
        });
    }

    static async getAllWithInventoryState(): Promise<MedicationInventoryState[]> {
        const rawMedications = await MedicationQueries.getAllMedications();
        return this.enrichWithInventoryState(rawMedications);
    }
}
