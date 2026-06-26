/**
 * Medication Feature — Local Types
 *
 * These types are scoped to the medication feature.
 * Domain models live in src/database/models/index.ts.
 */

// ─── Form ─────────────────────────────────────────────────────────────────────

/**
 * Shape of values managed by React Hook Form for both Create and Edit screens.
 * All fields are strings so TextInput binding is straightforward;
 * transformation to the correct DB type happens in the store action.
 */
export interface MedicationFormValues {
  name: string;
  dosage: string;
  expirationDate: string; // YYYY-MM-DD
  presentation: string;
  notes: string;
  quantityAvailable: string; // string → parsed to number | null before persistence
}

// ─── Expiration ───────────────────────────────────────────────────────────────

/** Semantic expiration status derived from the medication's expiration date. */
export type ExpirationStatus = 'valid' | 'expiring' | 'expired';
