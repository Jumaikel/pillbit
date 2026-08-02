export const removePostponeReminderMigration = `
-- Migration 007: Remove postpone reminder functionality

-- 1. Update any existing postponed records to skipped
UPDATE pbt_consumption_record
SET csr_status = 'skipped'
WHERE csr_status = 'postponed';

-- 2. Drop the postpone datetime column from consumption records
ALTER TABLE pbt_consumption_record DROP COLUMN csr_postponed_reminder_datetime;

-- 3. Drop the snooze minutes setting column from application settings
ALTER TABLE pbt_application_setting DROP COLUMN ast_reminder_snooze_minutes;
`;
