# Database Architecture

This document describes the SQLite persistence layer architecture for the PillBit application.

## 1. Database Overview
The application relies on a local-first architecture using `expo-sqlite`. The database uses a structured schema prefixed with `pbt_` for tables and specifically prefixed column names indicating their parent table context (e.g., `mdc_` for medication). 

## 2. Tables & Relationships
- **`pbt_medication`**: The core entity storing medications. Soft-deletes are handled via `mdc_deleted_datetime`.
- **`pbt_medication_reminder`**: Configured reminder schedules for a medication.
- **`pbt_medication_ai_information`**: 1:1 relationship containing AI-generated educational content per medication.
- **`pbt_expiration_alert`**: Pre-configured alerts for medication expirations.
- **`pbt_consumption_record`**: Tracking user interactions (taken, skipped, postponed) against reminders.
- **`pbt_notification_log`**: Historical log of dispatched notifications. Retained even if related entities are soft-deleted.
- **`pbt_application_setting`**: Singleton configuration table (locked to `ast_id = 1`).

**Cascading Deletions**: A database-level `AFTER UPDATE` trigger (`trg_pbt_medication_soft_delete`) monitors the `mdc_deleted_datetime`. Upon soft-deletion, it automatically purges related operational rows (reminders, AI information, consumption records, and expiration alerts). Notification logs remain using `SET NULL`.

## 3. Migration Strategy
Migrations are managed manually via `runner.ts`. A custom internal table `_migrations` tracks the current version applied.
New migrations should be added to the `migrations` array inside `runner.ts` and the associated SQL should be exported as a string from a `.ts` file to avoid Metro bundler import issues with raw `.sql` files.

## 4. Repository Responsibilities
Each domain model has a dedicated repository following the Clean Architecture Repository Pattern.
- Repositories encapsulate raw SQL logic.
- They consume and return strictly typed Domain Models mapping DB prefixes internally.
- Mutation methods accept specific DTOs (`Data Transfer Objects`) to distinguish between required insertion properties vs. optional update properties.
- They implement `RecordNotFoundError` ensuring missing rows result in explicit application failures rather than silent `null` responses when doing updates/deletes.

## 5. Query Guidelines
Basic CRUD is kept inside Repositories.
Complex read queries (e.g., getting specific views across joins or aggregated data like `getLowStockMedications`) are housed in the `queries/` directory (e.g. `MedicationQueries.ts`). This keeps repositories lean and specific to atomic entity access, while the `queries` folder can house cross-aggregate roots.

## 6. Naming Conventions
- **Tables**: `pbt_` + entity name (`snake_case`). Example: `pbt_medication`
- **Primary Keys**: 3-letter entity prefix + `_id`. Example: `mdc_id`
- **Foreign Keys**: Reference prefix + `_id`. Example: `mdc_id` in reminder table.
- **Timestamps**: Always suffix with `_datetime` or `_date`. Example: `created_datetime`, `expiration_date`.
- **Domain Models**: `PascalCase` objects without prefixes. Example: `Medication`.
- **DTOs**: `Create[Entity]DTO` / `Update[Entity]DTO`.

## 7. Future Scalability Considerations
- **Indexing**: Current indexes cover basic foreign keys and standard query paths (e.g., expiration dates). As features grow, additional multi-column indexes may be needed for query optimization.
- **Async Execution**: The adapter uses `openDatabaseSync` and modern SDK 50+ async API (`execAsync`, `runAsync`, `getAllAsync`). This prevents thread blocking but still needs careful handling of large transactions.
- **State Syncer**: Currently local-only. If cloud-sync is implemented later, tables will need a `sync_status` or similar CRDT logic, alongside UUIDs instead of auto-incrementing integers for PKs.
