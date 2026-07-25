import { create } from 'zustand';
import { MedicationAiInformation } from '@/database/models';
import { MedicationAiInformationRepository } from '@/database/repositories/MedicationAiInformationRepository';
import { OpenRouterService } from '../services/OpenRouterService';
import { NotificationService } from '@/services/NotificationService';
import { useConfigStore } from '@/store/useConfigStore';
import i18n from '@/i18n';

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
                medicationName,
                i18n.language
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

            // Notify success
            const title = i18n.t('ai.notification.successTitle', { defaultValue: 'AI Analysis Complete' });
            const body = i18n.t('ai.notification.successBody', { defaultValue: `Information for ${medicationName} is ready.`, medicationName });
            NotificationService.sendImmediateNotification(title, body, { medicationId, type: 'ai_generation' });

        } catch (error: any) {
            set({ error: error.message || 'Failed to generate AI information', isLoading: false });
            
            // Notify failure
            const title = i18n.t('ai.notification.errorTitle', { defaultValue: 'AI Analysis Failed' });
            const body = i18n.t('ai.notification.errorBody', { defaultValue: `Could not generate information for ${medicationName}.`, medicationName });
            NotificationService.sendImmediateNotification(title, body, { medicationId, type: 'ai_generation' });
        }
    }
}));
