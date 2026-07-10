export const addAiSettingsMigration = `
-- ==========================================
-- PillBit — Migration 002
-- Add AI settings columns to application_setting
-- ==========================================

ALTER TABLE pbt_application_setting
ADD COLUMN ast_is_ai_enabled INTEGER NOT NULL DEFAULT 0;

ALTER TABLE pbt_application_setting
ADD COLUMN ast_ai_model TEXT NOT NULL DEFAULT 'deepseek/deepseek-chat-v3-0324:free';
`;
