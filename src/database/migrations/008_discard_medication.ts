export const discardMedicationMigration = `
-- Migration 008: Add mdc_is_discarded to pbt_medication

-- Add the column with a default value of 0 (false)
ALTER TABLE pbt_medication ADD COLUMN mdc_is_discarded INTEGER NOT NULL DEFAULT 0;
`;
