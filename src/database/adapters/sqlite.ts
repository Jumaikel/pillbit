import * as SQLite from 'expo-sqlite';

const DATABASE_NAME = 'pillbit.db';

let dbInstance: SQLite.SQLiteDatabase | null = null;

/**
 * Initializes and returns the database connection.
 * Uses the synchronous openDatabaseSync method from modern expo-sqlite.
 */
export const getDatabase = (): SQLite.SQLiteDatabase => {
    if (!dbInstance) {
        dbInstance = SQLite.openDatabaseSync(DATABASE_NAME);
    }
    return dbInstance;
};

/**
 * Closes the database connection.
 */
export const closeDatabase = (): void => {
    if (dbInstance) {
        dbInstance.closeSync();
        dbInstance = null;
    }
};
