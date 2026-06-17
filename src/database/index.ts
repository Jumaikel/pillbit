// Database Layer Root Export

// Setup
export { getDatabase, closeDatabase } from './adapters/sqlite';
export { initDatabase } from './migrations/runner';

// Domain Models
export * from './models';

// DTOs
export * from './dto';

// Repositories
export { MedicationRepository } from './repositories/MedicationRepository';
export { MedicationReminderRepository } from './repositories/MedicationReminderRepository';
export { MedicationAiInformationRepository } from './repositories/MedicationAiInformationRepository';
export { ExpirationAlertRepository } from './repositories/ExpirationAlertRepository';
export { ConsumptionRecordRepository } from './repositories/ConsumptionRecordRepository';
export { NotificationLogRepository } from './repositories/NotificationLogRepository';
export { ApplicationSettingRepository } from './repositories/ApplicationSettingRepository';

// Queries
export { MedicationQueries } from './queries/MedicationQueries';

// Helpers
export { runInTransaction } from './helpers/transaction';
export * from './helpers/errors';
