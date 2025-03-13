import { TransactionOptions, TransactionContext, TransactionLog, TransactionalStore, Observer, Subscription } from '../types';
import { TransactionManager } from '../transaction/transaction-manager';
/**
 * Transactional Store implementation
 */
export declare class SafeFlowStore<T extends object> implements TransactionalStore<T> {
    private state;
    private initialState;
    private subject;
    private transactionManager;
    /**
     * Create a new store
     * @param initialState Initial state
     * @param transactionManager Transaction manager (optional)
     */
    constructor(initialState: T, transactionManager?: TransactionManager);
    /**
     * Get the current state
     * @returns Current state
     */
    getState(): T;
    /**
     * Update the state
     * @param state Partial state to update
     */
    setState(state: Partial<T>): void;
    /**
     * Reset the state to its initial value
     */
    resetState(): void;
    /**
     * Subscribe to state changes
     * @param observerOrNext Observer or next function
     * @param error Error function
     * @param complete Complete function
     * @returns Subscription
     */
    subscribe(observerOrNext?: Observer<T> | ((state: T) => void), error?: (error: any) => void, complete?: () => void): Subscription;
    /**
     * Begin a transaction
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
     * Get transaction logs
     * @returns Transaction logs
     */
    getTransactionLogs(): TransactionLog[];
    /**
     * Log a transaction operation
     * @param transactionId Transaction ID
     * @param operation Transaction operation
     */
    private logOperation;
    /**
     * Get the transaction manager
     * @returns Transaction manager
     */
    getTransactionManager(): TransactionManager;
    /**
     * Set a custom transaction manager
     * @param manager Custom transaction manager
     */
    setTransactionManager(manager: TransactionManager): void;
}
