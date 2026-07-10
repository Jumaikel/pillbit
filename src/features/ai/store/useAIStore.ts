import { create } from 'zustand';
import { MedicationAiInformation } from '@/database/models';
import { MedicationAiInformationRepository } from '@/database/repositories/MedicationAiInformationRepository';
import { OpenRouterService } from '../services/OpenRouterService';
import { useConfigStore } from '@/store/useConfigStore';

interface AIStoreState {
    isLoading: boolean;
    error: string | null;
    cache: Record<number, MedicationAiInformation>;
    
    loadMedicationInfo: (medicationId: number) => Promise<void>;
    generateMedicationInfo: (medicationId: number, medicationName: string, forceRegenerate?: boolean) => Promise<void>;
}

export const useAIStore = create<AIStoreState>((set, get) => ({
    isLoading: false,
    error: null,
    cache: {},

    loadMedicationInfo: async (medicationId: number) => {
        set({ isLoading: true, error: null });
        try {
            const info = await MedicationAiInformationRepository.findByMedicationId(medicationId);
            if (info) {
                set(state => ({
                    cache: { ...state.cache, [medicationId]: info },
                    isLoading: false
                }));
            } else {
                set({ isLoading: false });
            }
        } catch (error: any) {
            set({ error: error.message || 'Failed to load AI information from cache', isLoading: false });
        }
    },

    generateMedicationInfo: async (medicationId: number, medicationName: string, forceRegenerate = false) => {
        const { settings } = useConfigStore.getState();
        
        if (!settings?.isAiEnabled) {
            set({ error: 'AI Features are currently disabled.' });
            return;
        }

        // Check cache unless forced
        if (!forceRegenerate) {
            const existing = get().cache[medicationId];
            if (existing) return;
        }

        set({ isLoading: true, error: null });
        
        try {
            const generatedData = await OpenRouterService.generateMedicationInfo(
                medicationName
            );

            // Check if it exists in db
            const existingInDb = await MedicationAiInformationRepository.findByMedicationId(medicationId);
            
            if (existingInDb) {
                await MedicationAiInformationRepository.updateByMedicationId(medicationId, generatedData);
            } else {
                await MedicationAiInformationRepository.create({
                    medicationId,
                    ...generatedData
                });
            }

            // Reload from DB to get the new object with ID and generatedDatetime
            const updatedInfo = await MedicationAiInformationRepository.findByMedicationId(medicationId);
            if (updatedInfo) {
                set(state => ({
                    cache: { ...state.cache, [medicationId]: updatedInfo },
                    isLoading: false
                }));
            }
        } catch (error: any) {
            set({ error: error.message || 'Failed to generate AI information', isLoading: false });
        }
    }
}));
