/**
 * useMedicationStore
 *
 * Zustand store for the Medication feature module.
 *
 * Responsibilities:
 *  - Load all medications from the repository
 *  - Create, update, and delete medications via the repository
 *  - Expose filtered medications (search support)
 *  - Manage loading and error states
 *
 * Architecture rules:
 *  - Communicates ONLY with MedicationRepository and MedicationQueries
 *  - NEVER accesses SQLite directly
 *  - UI components consume this store via selectors (never spread the whole state)
 */

import { create } from 'zustand';
import {
  Medication,
  MedicationRepository,
  MedicationQueries,
  CreateMedicationDTO,
  UpdateMedicationDTO,
} from '@/database';
import { ExpirationService } from '@/features/expiration';
import { NotificationService } from '@/services/NotificationService';

// ─── State Interface ──────────────────────────────────────────────────────────

interface MedicationState {
  /** Full unfiltered list loaded from the database */
  medications: Medication[];
  /** Whether an async operation is in progress */
  isLoading: boolean;
  /** Last error message, or null if no error */
  error: string | null;
  /** Current search query — filters the computed selector */
  searchQuery: string;
}

// ─── Actions Interface ────────────────────────────────────────────────────────

interface MedicationActions {
  /** Load all non-deleted medications from the database into state */
  loadMedications: () => Promise<void>;
  /** Create a new medication, persist it, and refresh state. Returns the new ID. */
  createMedication: (data: CreateMedicationDTO) => Promise<number>;
  /** Update an existing medication, persist changes, and refresh state */
  updateMedication: (id: number, data: UpdateMedicationDTO) => Promise<void>;
  /** Soft-delete a medication and refresh state */
  deleteMedication: (id: number) => Promise<void>;
  /** Set the search query for filtering medications */
  setSearchQuery: (query: string) => void;
  /** Clear the current error */
  clearError: () => void;
}

// ─── Computed Selectors ───────────────────────────────────────────────────────

/**
 * Returns the medications list filtered by the current search query.
 * Always use this selector in list screens — never consume `medications` directly
 * unless you specifically need the full unfiltered list.
 */
export const selectFilteredMedications = (state: MedicationState): Medication[] => {
  if (!state.searchQuery.trim()) {
    // Hide expired medications if there is no search query
    return state.medications.filter((med) => {
      if (!med.expirationDate) return true;
      const { status } = ExpirationService.calculateStatus(med.expirationDate);
      return status !== 'expired';
    });
  }
  
  const q = state.searchQuery.toLowerCase().trim();
  return state.medications.filter(
    (med) =>
      med.name.toLowerCase().includes(q) ||
      med.dosage.toLowerCase().includes(q) ||
      (med.presentation?.toLowerCase().includes(q) ?? false),
  );
};

// ─── Store ────────────────────────────────────────────────────────────────────

export const useMedicationStore = create<MedicationState & MedicationActions>((set, get) => ({
  // ─── Initial State ───────────────────────────────────────────────────────
  medications: [],
  isLoading: false,
  error: null,
  searchQuery: '',

  // ─── Actions ─────────────────────────────────────────────────────────────

  loadMedications: async () => {
    set({ isLoading: true, error: null });
    try {
      const medications = await MedicationQueries.getAllMedications();
      set({ medications, isLoading: false });
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to load medications';
      set({ error: message, isLoading: false });
    }
  },

  createMedication: async (data: CreateMedicationDTO) => {
    set({ isLoading: true, error: null });
    try {
      const id = await MedicationRepository.create(data);
      await ExpirationService.generateAlerts(id, data.expirationDate);
      await NotificationService.syncExpirationAlerts();
      // Refresh the full list after creation
      const medications = await MedicationQueries.getAllMedications();
      set({ medications, isLoading: false });
      return id;
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to create medication';
      set({ error: message, isLoading: false });
      // Re-throw so the screen can react (e.g. show a specific error)
      throw e;
    }
  },

  updateMedication: async (id: number, data: UpdateMedicationDTO) => {
    set({ isLoading: true, error: null });
    try {
      await MedicationRepository.update(id, data);
      
      if (data.expirationDate) {
        await ExpirationService.generateAlerts(id, data.expirationDate);
        await NotificationService.syncExpirationAlerts();
      }
      
      const medications = await MedicationQueries.getAllMedications();
      set({ medications, isLoading: false });
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to update medication';
      set({ error: message, isLoading: false });
      throw e;
    }
  },

  deleteMedication: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      await MedicationRepository.delete(id);
      const medications = await MedicationQueries.getAllMedications();
      set({ medications, isLoading: false });
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to delete medication';
      set({ error: message, isLoading: false });
      throw e;
    }
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
  },

  clearError: () => {
    set({ error: null });
  },
}));
