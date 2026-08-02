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
 * - `normal`    : Quantity is > 0.
 * - `empty`     : Quantity is exactly 0.
 * - `untracked` : No quantity has been entered for this medication.
 */
export type InventoryStatus = 'normal' | 'empty' | 'untracked';

// ─── Medication Inventory State ───────────────────────────────────────────────

/**
 * A `Medication` enriched with computed inventory fields.
 * This is the shape consumed by inventory store and UI components.
 */
export interface MedicationInventoryState extends Medication {
    /** Computed status based on quantity and threshold */
    inventoryStatus: InventoryStatus;
}
