import { TransactionOptions, TransactionContext, TransactionOperation, TransactionLog } from '../types';
/**
 * Transaction Manager
 */
export declare class TransactionManager {
    private activeTransactions;
    private transactionLogs;
    /**
     * Begin a new transaction
     * @param options Transaction options
     * @returns Transaction context
     */
    beginTransaction(options?: TransactionOptions): TransactionContext;
    /**
     * Commit a transaction
     * @param context Transaction context
     */
    commitTransaction(context: TransactionContext): void;
    /**
     * Rollback a transaction
     * @param context Transaction context
     */
    rollbackTransaction(context: TransactionContext): void;
    /**
     * Execute a function within a transaction
     * @param fn Function to execute
     * @param options Transaction options
     * @returns Result of the function
     */
    executeTransaction<R>(fn: (context: TransactionContext) => R, options?: TransactionOptions): R;
    /**
     * Retry a transaction
     * @param fn Function to execute
     * @param options Transaction options
     * @param retriesLeft Number of retries left
     * @returns Result of the function
     */
    private retryTransaction;
    /**
     * Log a transaction operation
     * @param transactionId Transaction ID
     * @param operation Transaction operation
     */
    logOperation(transactionId: string, operation: TransactionOperation): void;
    /**
     * Get transaction logs
     * @returns Transaction logs
     */
    getTransactionLogs(): TransactionLog[];
    /**
     * Get active transactions
     * @returns Active transactions
     */
    getActiveTransactions(): TransactionContext[];
    /**
     * Check if a transaction is active
     * @param transactionId Transaction ID
     * @returns Whether the transaction is active
     */
    isTransactionActive(transactionId: string): boolean;
    /**
     * Clear all transaction logs
     */
    clearTransactionLogs(): void;
}
