import { create } from 'zustand';
import { HistoryService } from '../services/HistoryService';
import { ConsumptionHistoryItem, HistoryFilters } from '../types';
import { ConsumptionStatus } from '@/database/models';

interface HistoryState {
    records: ConsumptionHistoryItem[];
    filters: HistoryFilters;
    isLoading: boolean;
    error: string | null;

    loadHistory: () => Promise<void>;
    setFilters: (filters: Partial<HistoryFilters>) => void;
    clearFilters: () => void;
    registerConsumption: (
        medicationId: number,
        status: ConsumptionStatus,
        quantityConsumed?: number,
        reminderId?: number,
        notes?: string
    ) => Promise<void>;
}

export const useHistoryStore = create<HistoryState>((set, get) => ({
    records: [],
    filters: {},
    isLoading: false,
    error: null,

    loadHistory: async () => {
        set({ isLoading: true, error: null });
        try {
            const { filters } = get();
            const records = await HistoryService.getHistory(filters);
            set({ records, isLoading: false });
        } catch (error: any) {
            set({ error: error.message || 'Failed to load history', isLoading: false });
        }
    },

    setFilters: (newFilters) => {
        set((state) => ({ filters: { ...state.filters, ...newFilters } }));
        get().loadHistory();
    },

    clearFilters: () => {
        set({ filters: {} });
        get().loadHistory();
    },

    registerConsumption: async (medicationId, status, quantityConsumed = 1, reminderId, notes) => {
        set({ isLoading: true, error: null });
        try {
            await HistoryService.registerConsumption(medicationId, status, quantityConsumed, reminderId, notes);
            await get().loadHistory();
            
            // Sync inventory and notifications
            const { useInventoryStore } = await import('@/features/inventory/store/useInventoryStore');
            await useInventoryStore.getState().refreshAfterConsumption();
        } catch (error: any) {
            set({ error: error.message || 'Failed to register consumption', isLoading: false });
            throw error;
        }
    }
}));
