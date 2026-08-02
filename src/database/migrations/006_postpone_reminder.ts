export const addPostponeReminderMigration = `
-- Migration 006: Add postponed_reminder_datetime to track temporary reminders on postpone
ALTER TABLE pbt_consumption_record ADD COLUMN csr_postponed_reminder_datetime DATETIME;
`;
