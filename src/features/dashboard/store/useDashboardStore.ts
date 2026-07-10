import { create } from 'zustand';
import { DashboardService } from '../services/DashboardService';
import { TodayDose } from '../types';

interface DashboardState {
    todayDoses: TodayDose[];
    isLoading: boolean;
    error: string | null;

    loadDashboard: () => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set) => ({
    todayDoses: [],
    isLoading: false,
    error: null,

    loadDashboard: async () => {
        set({ isLoading: true, error: null });
        try {
            const todayDoses = await DashboardService.getTodaySchedule();
            set({ todayDoses, isLoading: false });
        } catch (error: any) {
            set({ error: error.message || 'Failed to load dashboard', isLoading: false });
        }
    }
}));
