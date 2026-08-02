/**
 * useInventoryStore
 *
 * Zustand store for the Inventory feature module.
 *
 * Responsibilities:
 *  - Load all medications enriched with inventory state
 *  - Track low-stock medications separately for quick access
 *  - Refresh inventory state after consumption or settings changes
 *  - Handle loading and error states
 *
 * Architecture rules:
 *  - Communicates ONLY through InventoryService (never SQLite directly)
 *  - UI components consume this store via selectors
 */

import { create } from 'zustand';
import { InventoryService } from '../services/InventoryService';
import { MedicationInventoryState } from '../types';

// ─── State Interface ──────────────────────────────────────────────────────────

interface InventoryState {
    /** All medications enriched with inventory state */
    inventoryItems: MedicationInventoryState[];
    /** Only medications with status 'empty' */
    emptyItems: MedicationInventoryState[];
    /** Whether an async operation is in progress */
    isLoading: boolean;
    /** Last error message, or null if no error */
    error: string | null;
}

// ─── Actions Interface ────────────────────────────────────────────────────────

interface InventoryActions {
    /** Load full inventory state from database */
    loadInventory: () => Promise<void>;
    /**
     * Called after a consumption record is registered.
     * Re-fetches inventory to reflect the stock reduction.
     */
    refreshAfterConsumption: () => Promise<void>;

    /** Clear the current error */
    clearError: () => void;
}

// ─── Computed Selectors ───────────────────────────────────────────────────────

/** Returns medications with 'empty' status, ordered by urgency */
export const selectEmptyMedications = (
    state: InventoryState,
): MedicationInventoryState[] => state.emptyItems;

/** Returns the count of empty medications */
export const selectEmptyCount = (state: InventoryState): number =>
    state.emptyItems.length;

// ─── Helper for sorting empty items ───────────────────────────────────────
const sortEmpty = (items: MedicationInventoryState[]) => {
    return [...items].sort((a, b) => {
        const qa = a.quantityAvailable ?? 0;
        const qb = b.quantityAvailable ?? 0;
        return qa - qb;
    });
};

// ─── Store ────────────────────────────────────────────────────────────────────

export const useInventoryStore = create<InventoryState & InventoryActions>((set, get) => ({
    // ─── Initial State ─────────────────────────────────────────────────────
    inventoryItems: [],
    emptyItems: [],
    isLoading: false,
    error: null,

    // ─── Actions ───────────────────────────────────────────────────────────

    loadInventory: async () => {
        set({ isLoading: true, error: null });
        try {
            const inventoryItems = await InventoryService.getAllWithInventoryState();
            const emptyItems = sortEmpty(inventoryItems.filter(
                (item) => item.inventoryStatus === 'empty',
            ));
            set({ inventoryItems, emptyItems, isLoading: false });
        } catch (e) {
            const message = e instanceof Error ? e.message : 'Failed to load inventory';
            set({ error: message, isLoading: false });
        }
    },

    refreshAfterConsumption: async () => {
        // Lightweight refresh — no loading spinner needed for background sync
        try {
            const inventoryItems = await InventoryService.getAllWithInventoryState();
            const emptyItems = sortEmpty(inventoryItems.filter(
                (item) => item.inventoryStatus === 'empty',
            ));
            set({ inventoryItems, emptyItems });
        } catch (e) {
            const message = e instanceof Error ? e.message : 'Failed to refresh inventory';
            set({ error: message });
        }
    },


    clearError: () => {
        set({ error: null });
    },
}));
