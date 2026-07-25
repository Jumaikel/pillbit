export const addAiDosageAdministrationMigration = `
ALTER TABLE pbt_medication_ai_information ADD COLUMN mai_dosage_administration TEXT DEFAULT NULL;
`;
