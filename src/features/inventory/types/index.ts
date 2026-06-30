/**
 * Inventory Feature — Types
 *
 * Domain types scoped to the inventory feature.
 * Core domain models live in src/database/models/index.ts.
 */

import { Medication } from '@/database/models';

// ─── Inventory Status ─────────────────────────────────────────────────────────

/**
 * Semantic status for a medication's available quantity.
 *
 * - `normal`    : Quantity is above the low-stock threshold.
 * - `low_stock` : Quantity is at or below the low-stock threshold (but > 0).
 * - `empty`     : Quantity is exactly 0.
 * - `untracked` : No quantity has been entered for this medication.
 */
export type InventoryStatus = 'normal' | 'low_stock' | 'empty' | 'untracked';

// ─── Medication Inventory State ───────────────────────────────────────────────

/**
 * A `Medication` enriched with computed inventory fields.
 * This is the shape consumed by inventory store and UI components.
 */
export interface MedicationInventoryState extends Medication {
    /** Computed status based on quantity and threshold */
    inventoryStatus: InventoryStatus;
    /**
     * The effective threshold used for this medication.
     * If the medication has its own `lowStockThreshold`, that is used.
     * Otherwise, falls back to the global `defaultLowStockThreshold` setting.
     * `null` if no threshold can be resolved.
     */
    effectiveThreshold: number | null;
}
