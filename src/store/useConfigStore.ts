import { create } from 'zustand';
import { ApplicationSetting } from '../database/models';
import { ApplicationSettingRepository } from '../database/repositories/ApplicationSettingRepository';
import { UpdateApplicationSettingDTO } from '../database/dto';

interface ConfigStoreState {
    settings: ApplicationSetting | null;
    isLoading: boolean;
    error: string | null;
    loadSettings: () => Promise<void>;
    updateSettings: (data: UpdateApplicationSettingDTO) => Promise<void>;
}

export const useConfigStore = create<ConfigStoreState>((set, get) => ({
    settings: null,
    isLoading: true,
    error: null,
    
    loadSettings: async () => {
        set({ isLoading: true, error: null });
        try {
            await ApplicationSettingRepository.initialize();
            const settings = await ApplicationSettingRepository.get();
            set({ settings, isLoading: false });
        } catch (error: any) {
            set({ error: error.message || 'Failed to load settings', isLoading: false });
        }
    },
    
    updateSettings: async (data: UpdateApplicationSettingDTO) => {
        set({ isLoading: true, error: null });
        try {
            await ApplicationSettingRepository.update(data);
            const settings = await ApplicationSettingRepository.get();
            set({ settings, isLoading: false });
        } catch (error: any) {
            set({ error: error.message || 'Failed to update settings', isLoading: false });
        }
    }
}));
