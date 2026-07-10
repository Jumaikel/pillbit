export const addLanguageSettingMigration = `
-- ==========================================
-- PillBit — Migration 003
-- Add language setting column to application_setting
-- ==========================================

ALTER TABLE pbt_application_setting
ADD COLUMN ast_language TEXT NOT NULL DEFAULT 'system';
`;
