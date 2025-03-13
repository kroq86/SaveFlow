"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SafeFlowStore = void 0;
const subject_1 = require("../reactive/subject");
const transaction_manager_1 = require("../transaction/transaction-manager");
/**
 * Transactional Store implementation
 */
class SafeFlowStore {
    /**
     * Create a new store
     * @param initialState Initial state
     * @param transactionManager Transaction manager (optional)
     */
    constructor(initialState, transactionManager) {
        this.initialState = { ...initialState };
        this.state = { ...initialState };
        this.subject = new subject_1.SafeFlowSubject();
        this.transactionManager = transactionManager || new transaction_manager_1.TransactionManager();
    }
    /**
     * Get the current state
     * @returns Current state
     */
    getState() {
        return { ...this.state };
    }
    /**
     * Update the state
     * @param state Partial state to update
     */
    setState(state) {
        this.state = { ...this.state, ...state };
        this.subject.next(this.getState());
    }
    /**
     * Reset the state to its initial value
     */
    resetState() {
        this.state = { ...this.initialState };
        this.subject.next(this.getState());
    }
    /**
     * Subscribe to state changes
     * @param observerOrNext Observer or next function
     * @param error Error function
     * @param complete Complete function
     * @returns Subscription
     */
    subscribe(observerOrNext, error, complete) {
        return this.subject.subscribe(observerOrNext, error, complete);
    }
    /**
     * Begin a transaction
     * @param options Transaction options
     * @returns Transaction context
     */
    beginTransaction(options = {}) {
        const context = this.transactionManager.beginTransaction(options);
        // Store a snapshot of the current state in the transaction context
        context.data = {
            snapshot: { ...this.state }
        };
        return context;
    }
    /**
     * Commit a transaction
     * @param context Transaction context
     */
    commitTransaction(context) {
        this.transactionManager.commitTransaction(context);
        // Notify observers of the state change
        this.subject.next(this.getState());
    }
    /**
     * Rollback a transaction
     * @param context Transaction context
     */
    rollbackTransaction(context) {
        // Restore the state from the snapshot
        if (context.data && context.data.snapshot) {
            this.state = { ...context.data.snapshot };
        }
        this.transactionManager.rollbackTransaction(context);
        // Notify observers of the state change
        this.subject.next(this.getState());
    }
    /**
     * Execute a function within a transaction
     * @param fn Function to execute
     * @param options Transaction options
     * @returns Result of the function
     */
    executeTransaction(fn, options = {}) {
        return this.transactionManager.executeTransaction((context) => {
            // Store a snapshot of the current state in the transaction context
            context.data = {
                snapshot: { ...this.state }
            };
            try {
                const result = fn(context);
                // Log the update operation
                this.logOperation(context.metadata.id, {
                    type: 'update',
                    target: 'store',
                    data: this.getState(),
                    timestamp: Date.now()
                });
                return result;
            }
            catch (error) {
                // Restore the state from the snapshot
                if (context.data && context.data.snapshot) {
                    this.state = { ...context.data.snapshot };
                }
                throw error;
            }
        }, options);
    }
    /**
     * Get transaction logs
     * @returns Transaction logs
     */
    getTransactionLogs() {
        return this.transactionManager.getTransactionLogs();
    }
    /**
     * Log a transaction operation
     * @param transactionId Transaction ID
     * @param operation Transaction operation
     */
    logOperation(transactionId, operation) {
        this.transactionManager.logOperation(transactionId, operation);
    }
    /**
     * Get the transaction manager
     * @returns Transaction manager
     */
    getTransactionManager() {
        return this.transactionManager;
    }
    /**
     * Set a custom transaction manager
     * @param manager Custom transaction manager
     */
    setTransactionManager(manager) {
        this.transactionManager = manager;
    }
}
exports.SafeFlowStore = SafeFlowStore;
