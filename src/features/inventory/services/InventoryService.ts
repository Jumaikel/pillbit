/**
 * InventoryService
 *
 * Centralized business logic for inventory management.
 *
 * Responsibilities:
 *  - Calculate inventory status from quantity + threshold
 *  - Resolve effective threshold (per-medication > global default)
 *  - Determine whether a low-stock notification should be sent (dedup)
 *  - Enrich medication list with inventory state
 *
 * Architecture rules:
 *  - NEVER accesses SQLite directly — uses repositories and queries only
 *  - NEVER imports UI components or Zustand stores
 *  - All business rules for inventory live here
 */

import { Medication } from '@/database/models';
import { MedicationQueries } from '@/database/queries/MedicationQueries';
import { ApplicationSettingRepository } from '@/database/repositories/ApplicationSettingRepository';
import { NotificationLogRepository } from '@/database/repositories/NotificationLogRepository';
import { InventoryStatus, MedicationInventoryState } from '../types';

export class InventoryService {
    // ─── Status Calculation ────────────────────────────────────────────────────

    /**
     * Derives the inventory status from a quantity and threshold.
     *
     * Rules:
     *  - If quantity is null → `untracked`
     *  - If quantity === 0 → `empty`
     *  - If quantity <= threshold (and threshold is not null) → `low_stock`
     *  - Otherwise → `normal`
     */
    static calculateInventoryStatus(
        quantityAvailable: number | null,
        effectiveThreshold: number | null,
    ): InventoryStatus {
        if (quantityAvailable === null) return 'untracked';
        if (quantityAvailable === 0) return 'empty';
        if (effectiveThreshold !== null && quantityAvailable <= effectiveThreshold) {
            return 'low_stock';
        }
        return 'normal';
    }

    /**
     * Resolves the threshold to use for a medication.
     *
     * Priority:
     *  1. Medication's own `lowStockThreshold` (if set)
     *  2. Global `defaultLowStockThreshold` from settings (if provided)
     *  3. `null` (no threshold configured)
     */
    static getEffectiveThreshold(
        medication: Medication,
        globalDefault: number | null,
    ): number | null {
        if (medication.lowStockThreshold !== null) {
            return medication.lowStockThreshold;
        }
        return globalDefault;
    }

    // ─── Enrichment ────────────────────────────────────────────────────────────

    /**
     * Takes a list of medications and the global threshold, and returns
     * each medication enriched with its computed inventory state.
     */
    static enrichWithInventoryState(
        medications: Medication[],
        globalDefault: number | null,
    ): MedicationInventoryState[] {
        return medications.map((med) => {
            const effectiveThreshold = this.getEffectiveThreshold(med, globalDefault);
            const inventoryStatus = this.calculateInventoryStatus(
                med.quantityAvailable,
                effectiveThreshold,
            );
            return { ...med, inventoryStatus, effectiveThreshold };
        });
    }

    // ─── Low Stock Query ───────────────────────────────────────────────────────

    /**
     * Returns all medications that are at or below their effective threshold,
     * enriched with inventory state. Ordered by urgency:
     *   1. Empty (quantity === 0)
     *   2. Low stock (quantity > 0 but <= threshold)
     */
    static async getLowStockMedications(): Promise<MedicationInventoryState[]> {
        const [rawMedications, settings] = await Promise.all([
            MedicationQueries.getLowStockMedications(),
            ApplicationSettingRepository.get(),
        ]);

        const globalDefault = settings?.defaultLowStockThreshold ?? null;
        const enriched = this.enrichWithInventoryState(rawMedications, globalDefault);

        // Sort: empty first, then by quantity ascending
        return enriched.sort((a, b) => {
            if (a.inventoryStatus === 'empty' && b.inventoryStatus !== 'empty') return -1;
            if (b.inventoryStatus === 'empty' && a.inventoryStatus !== 'empty') return 1;
            const qa = a.quantityAvailable ?? 0;
            const qb = b.quantityAvailable ?? 0;
            return qa - qb;
        });
    }

    /**
     * Returns ALL medications enriched with inventory state.
     * Used by the inventory store to maintain a full snapshot.
     */
    static async getAllWithInventoryState(): Promise<MedicationInventoryState[]> {
        const [rawMedications, settings] = await Promise.all([
            MedicationQueries.getAllMedications(),
            ApplicationSettingRepository.get(),
        ]);

        const globalDefault = settings?.defaultLowStockThreshold ?? null;
        return this.enrichWithInventoryState(rawMedications, globalDefault);
    }

    // ─── Notification Deduplication ────────────────────────────────────────────

    /**
     * Determines whether a low-stock notification should be sent for a
     * medication. Returns `false` if a notification of type 'low_stock' was
     * already sent for this medication today to prevent spam.
     *
     * @param medicationId The medication to check
     * @param recentNotificationLog Array of recent notification logs (fetched by store/service)
     */
    static wasLowStockNotifiedToday(
        medicationId: number,
        recentLogs: Array<{ medicationId: number | null; type: string; sentDatetime: string }>,
    ): boolean {
        const todayStr = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        return recentLogs.some(
            (log) =>
                log.medicationId === medicationId &&
                log.type === 'low_stock' &&
                log.sentDatetime.startsWith(todayStr),
        );
    }
}
