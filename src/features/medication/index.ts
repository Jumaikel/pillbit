/**
 * Medication Feature — Public API Barrel Export
 *
 * Only expose what other modules need (screens + store + types).
 * Internal components, hooks, and utils are not re-exported here
 * to preserve encapsulation within the feature boundary.
 */

// ─── Screens ──────────────────────────────────────────────────────────────────
export { MedicationListScreen } from './screens/MedicationListScreen';
export { MedicationDetailScreen } from './screens/MedicationDetailScreen';
export { CreateMedicationScreen } from './screens/CreateMedicationScreen';
export { EditMedicationScreen } from './screens/EditMedicationScreen';

// ─── Store ────────────────────────────────────────────────────────────────────
export { useMedicationStore, selectFilteredMedications } from './store/useMedicationStore';

// ─── Types ────────────────────────────────────────────────────────────────────
export type { MedicationFormValues, ExpirationStatus } from './types';
