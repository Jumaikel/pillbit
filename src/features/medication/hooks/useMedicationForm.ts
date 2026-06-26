/**
 * useMedicationForm
 *
 * Shared React Hook Form + Zod configuration for both
 * CreateMedicationScreen and EditMedicationScreen.
 *
 * Centralizes validation logic to avoid duplication.
 */

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MedicationFormValues } from '@/features/medication/types';

// ─── Validation Schema ────────────────────────────────────────────────────────

const YYYY_MM_DD = /^\d{4}-\d{2}-\d{2}$/;

export const medicationSchema = z.object({
  name: z.string().min(1, 'Medication name is required').max(120, 'Name is too long'),
  dosage: z.string().min(1, 'Dosage is required').max(60, 'Dosage is too long'),
  expirationDate: z
    .string()
    .min(1, 'Expiration date is required')
    .regex(YYYY_MM_DD, 'Date must be in YYYY-MM-DD format'),
  presentation: z.string().max(80, 'Presentation is too long'),
  notes: z.string().max(500, 'Notes are too long'),
  quantityAvailable: z
    .string()
    .refine(
      (val) => val === '' || (!isNaN(Number(val)) && Number(val) >= 0),
      'Must be a positive number',
    ),
  photoPath: z.string(),
});

export type MedicationSchema = z.infer<typeof medicationSchema>;

// ─── Default Values ───────────────────────────────────────────────────────────

export const defaultMedicationFormValues: MedicationFormValues = {
  name: '',
  dosage: '',
  expirationDate: '',
  presentation: '',
  notes: '',
  quantityAvailable: '',
  photoPath: '',
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * useMedicationForm
 *
 * Initializes and returns a React Hook Form instance bound to the
 * medication Zod schema. Accepts optional `defaultValues` for pre-population
 * (used by the Edit screen).
 *
 * Usage:
 * ```tsx
 * // Create
 * const form = useMedicationForm();
 *
 * // Edit (pre-populate)
 * const form = useMedicationForm({
 *   defaultValues: {
 *     name: medication.name,
 *     dosage: medication.dosage,
 *     ...
 *   },
 * });
 * ```
 */
export function useMedicationForm(options?: { defaultValues?: Partial<MedicationFormValues> }) {
  return useForm<MedicationFormValues>({
    resolver: zodResolver(medicationSchema),
    defaultValues: {
      ...defaultMedicationFormValues,
      ...options?.defaultValues,
    },
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });
}
