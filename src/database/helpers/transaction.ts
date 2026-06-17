import { getDatabase } from '../adapters/sqlite';
import { TransactionError } from './errors';

/**
 * Executes a callback within a database transaction.
 * If the callback throws an error, the transaction is automatically rolled back.
 * Currently, expo-sqlite async methods auto-manage transactions when using withTransactionAsync.
 * 
 * @param callback The function to execute inside the transaction.
 */
export const runInTransaction = async <T>(
    callback: () => Promise<T>
): Promise<T> => {
    const db = getDatabase();

    try {
        let result: T;
        // expo-sqlite SDK 50+ supports withTransactionAsync
        await db.withTransactionAsync(async () => {
            result = await callback();
        });
        return result!;
    } catch (error) {
        throw new TransactionError(
            error instanceof Error ? error.message : 'Unknown error',
            error
        );
    }
};
