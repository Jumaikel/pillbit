import * as SQLite from 'expo-sqlite';
import { getDatabase } from '../adapters/sqlite';
import { initialSchema } from './001_initial_schema';
import { addAiSettingsMigration } from './002_ai_settings';
import { addLanguageSettingMigration } from './003_language_setting';
import { addAiDosageAdministrationMigration } from './004_ai_dosage_administration';
import { removeLowStockMigration } from './005_remove_low_stock';
import { addPostponeReminderMigration } from './006_postpone_reminder';
import { removePostponeReminderMigration } from './007_remove_postpone';
import { discardMedicationMigration } from './008_discard_medication';
import { aiRequestLimitMigration } from './009_ai_request_limit';

const migrations = [
  {
    version: 1,
    name: '001_initial_schema',
    up: async (db: SQLite.SQLiteDatabase) => {
        try {
            await db.execAsync(initialSchema);
        } catch (e) {
             console.error("Migration 1 Failed", e);
             throw e;
        }
    }
  },
  {
    version: 2,
    name: '002_ai_settings',
    up: async (db: SQLite.SQLiteDatabase) => {
        try {
            await db.execAsync(addAiSettingsMigration);
        } catch (e) {
             console.error("Migration 2 Failed", e);
             throw e;
        }
    }
  },
  {
    version: 3,
    name: '003_language_setting',
    up: async (db: SQLite.SQLiteDatabase) => {
        try {
            await db.execAsync(addLanguageSettingMigration);
        } catch (e) {
             console.error("Migration 3 Failed", e);
             throw e;
        }
    }
  },
  {
    version: 4,
    name: '004_ai_dosage_administration',
    up: async (db: SQLite.SQLiteDatabase) => {
        try {
            await db.execAsync(addAiDosageAdministrationMigration);
        } catch (e) {
             console.error("Migration 4 Failed", e);
             throw e;
        }
    }
  },
  {
    version: 5,
    name: '005_remove_low_stock',
    up: async (db: SQLite.SQLiteDatabase) => {
        try {
            await db.execAsync(removeLowStockMigration);
        } catch (e) {
             console.error("Migration 5 Failed", e);
             throw e;
        }
    }
  },
  {
    version: 6,
    name: '006_postpone_reminder',
    up: async (db: SQLite.SQLiteDatabase) => {
        try {
            await db.execAsync(addPostponeReminderMigration);
        } catch (e) {
             console.error("Migration 6 Failed", e);
             throw e;
        }
    }
  },
  {
    version: 7,
    name: '007_remove_postpone',
    up: async (db: SQLite.SQLiteDatabase) => {
        try {
            await db.execAsync(removePostponeReminderMigration);
        } catch (e) {
             console.error("Migration 7 Failed", e);
             throw e;
        }
    }
  },
  {
    version: 8,
    name: '008_discard_medication',
    up: async (db: SQLite.SQLiteDatabase) => {
        try {
            await db.execAsync(discardMedicationMigration);
        } catch (e) {
             console.error("Migration 8 Failed", e);
             throw e;
        }
    }
  },
  {
    version: 9,
    name: '009_ai_request_limit',
    up: async (db: SQLite.SQLiteDatabase) => {
        try {
            await db.execAsync(aiRequestLimitMigration);
        } catch (e) {
             console.error("Migration 9 Failed", e);
             throw e;
        }
    }
  }
];

export const initDatabase = async (): Promise<void> => {
    const db = getDatabase();

    // Create migrations table
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS _migrations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            version INTEGER NOT NULL UNIQUE,
            name TEXT NOT NULL,
            executed_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    `);

    // Get current version
    const result = await db.getFirstAsync<{ version: number }>(
        `SELECT version FROM _migrations ORDER BY version DESC LIMIT 1;`
    );
    
    const currentVersion = result?.version || 0;

    // Run pending migrations
    for (const migration of migrations) {
        if (migration.version > currentVersion) {
            console.log(`Running migration: ${migration.name}`);
            
            // Execute the migration
            await migration.up(db);

            // Record execution
            await db.runAsync(
                `INSERT INTO _migrations (version, name) VALUES (?, ?);`,
                [migration.version, migration.name]
            );

            console.log(`Migration ${migration.name} completed.`);
        }
    }
};
