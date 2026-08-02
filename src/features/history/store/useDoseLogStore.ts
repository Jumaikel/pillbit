/**
 * useDoseLogStore
 *
 * Zustand store for managing per-medication dose logging.
 * Handles today's dose schedule and paginated history for a single medication.
 */

import { create } from 'zustand';
import { DoseLogService, MedicationTodayDose } from '../services/DoseLogService';
import { ConsumptionHistoryItem } from '@/database/queries/ConsumptionQueries';
import { ConsumptionStatus } from '@/database/models';

interface DoseLogState {
    // Today's doses for the active medication
    todayDoses: MedicationTodayDose[];
    isTodayLoading: boolean;

    // Paginated history for the active medication
    history: ConsumptionHistoryItem[];
    historyFilter: ConsumptionStatus | undefined;
    isHistoryLoading: boolean;
    historyOffset: number;
    hasMoreHistory: boolean;

    error: string | null;
}

interface DoseLogActions {
    loadTodayDoses: (medicationId: number) => Promise<void>;
    logDose: (
        medicationId: number,
        reminderId: number,
        status: ConsumptionStatus,
        scheduledDatetime: string
    ) => Promise<void>;
    loadHistory: (medicationId: number, reset?: boolean) => Promise<void>;
    setHistoryFilter: (medicationId: number, filter: ConsumptionStatus | undefined) => Promise<void>;
    loadMoreHistory: (medicationId: number) => Promise<void>;
    clearError: () => void;
}

const HISTORY_PAGE_SIZE = 30;

export const useDoseLogStore = create<DoseLogState & DoseLogActions>((set, get) => ({
    todayDoses: [],
    isTodayLoading: false,
    history: [],
    historyFilter: undefined,
    isHistoryLoading: false,
    historyOffset: 0,
    hasMoreHistory: true,
    error: null,

    loadTodayDoses: async (medicationId: number) => {
        set({ isTodayLoading: true, error: null });
        try {
            const doses = await DoseLogService.getTodayDosesForMedication(medicationId);
            set({ todayDoses: doses, isTodayLoading: false });
        } catch (e: any) {
            set({ error: e.message ?? 'Error cargando dosis de hoy', isTodayLoading: false });
        }
    },

    logDose: async (medicationId, reminderId, status, scheduledDatetime) => {
        set({ error: null });
        try {
            await DoseLogService.logDose(medicationId, reminderId, status, scheduledDatetime);
            // Refresh today's doses after logging
            const doses = await DoseLogService.getTodayDosesForMedication(medicationId);
            set({ todayDoses: doses });
        } catch (e: any) {
            set({ error: e.message ?? 'Error registrando dosis' });
            throw e;
        }
    },

    loadHistory: async (medicationId: number, reset = false) => {
        if (get().isHistoryLoading) return;
        const offset = reset ? 0 : get().historyOffset;
        set({ isHistoryLoading: true, error: null });
        try {
            const records = await DoseLogService.getMedicationHistory(
                medicationId,
                get().historyFilter,
                HISTORY_PAGE_SIZE,
                offset
            );
            const history = reset ? records : [...get().history, ...records];
            set({
                history,
                isHistoryLoading: false,
                historyOffset: offset + records.length,
                hasMoreHistory: records.length === HISTORY_PAGE_SIZE,
            });
        } catch (e: any) {
            set({ error: e.message ?? 'Error cargando historial', isHistoryLoading: false });
        }
    },

    setHistoryFilter: async (medicationId, filter) => {
        set({ historyFilter: filter, history: [], historyOffset: 0, hasMoreHistory: true });
        await get().loadHistory(medicationId, true);
    },

    loadMoreHistory: async (medicationId: number) => {
        if (!get().hasMoreHistory || get().isHistoryLoading) return;
        await get().loadHistory(medicationId);
    },

    clearError: () => set({ error: null }),
}));
