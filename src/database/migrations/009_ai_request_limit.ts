export const aiRequestLimitMigration = `
-- Migration 009: Add ast_last_ai_request_date to pbt_application_setting

ALTER TABLE pbt_application_setting ADD COLUMN ast_last_ai_request_date TEXT;
`;
