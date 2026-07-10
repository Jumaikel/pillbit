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
    /** Only medications with status 'low_stock' or 'empty' */
    lowStockItems: MedicationInventoryState[];
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
    /**
     * Called after the low-stock threshold setting changes.
     * Re-calculates all status values against the new threshold.
     */
    refreshAfterSettingsChange: () => Promise<void>;
    /** Clear the current error */
    clearError: () => void;
}

// ─── Computed Selectors ───────────────────────────────────────────────────────

/** Returns medications with 'low_stock' or 'empty' status, ordered by urgency */
export const selectLowStockMedications = (
    state: InventoryState,
): MedicationInventoryState[] => state.lowStockItems;

/** Returns the count of low-stock + empty medications */
export const selectLowStockCount = (state: InventoryState): number =>
    state.lowStockItems.length;

// ─── Helper for sorting low stock items ───────────────────────────────────────
const sortLowStock = (items: MedicationInventoryState[]) => {
    return [...items].sort((a, b) => {
        // Empty first
        if (a.inventoryStatus === 'empty' && b.inventoryStatus !== 'empty') return -1;
        if (b.inventoryStatus === 'empty' && a.inventoryStatus !== 'empty') return 1;
        const qa = a.quantityAvailable ?? 0;
        const qb = b.quantityAvailable ?? 0;
        return qa - qb;
    });
};

// ─── Store ────────────────────────────────────────────────────────────────────

export const useInventoryStore = create<InventoryState & InventoryActions>((set, get) => ({
    // ─── Initial State ─────────────────────────────────────────────────────
    inventoryItems: [],
    lowStockItems: [],
    isLoading: false,
    error: null,

    // ─── Actions ───────────────────────────────────────────────────────────

    loadInventory: async () => {
        set({ isLoading: true, error: null });
        try {
            const inventoryItems = await InventoryService.getAllWithInventoryState();
            const lowStockItems = sortLowStock(inventoryItems.filter(
                (item) =>
                    item.inventoryStatus === 'low_stock' || item.inventoryStatus === 'empty',
            ));
            set({ inventoryItems, lowStockItems, isLoading: false });
        } catch (e) {
            const message = e instanceof Error ? e.message : 'Failed to load inventory';
            set({ error: message, isLoading: false });
        }
    },

    refreshAfterConsumption: async () => {
        // Lightweight refresh — no loading spinner needed for background sync
        try {
            const inventoryItems = await InventoryService.getAllWithInventoryState();
            const lowStockItems = sortLowStock(inventoryItems.filter(
                (item) =>
                    item.inventoryStatus === 'low_stock' || item.inventoryStatus === 'empty',
            ));
            set({ inventoryItems, lowStockItems });
        } catch (e) {
            const message = e instanceof Error ? e.message : 'Failed to refresh inventory';
            set({ error: message });
        }
    },

    refreshAfterSettingsChange: async () => {
        // Same as full load — threshold change requires re-enrichment
        await get().loadInventory();
    },

    clearError: () => {
        set({ error: null });
    },
}));
