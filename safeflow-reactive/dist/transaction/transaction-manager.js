"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionManager = void 0;
/**
 * Transaction Manager for the SafeFlow Reactive System
 */
const uuid_1 = require("uuid");
const types_1 = require("../types");
/**
 * Default transaction options
 */
const DEFAULT_TRANSACTION_OPTIONS = {
    timeout: 30000, // 30 seconds
    autoRetry: false,
    maxRetries: 3,
    retryDelay: 1000, // 1 second
    optimisticLocking: false,
    isolationLevel: types_1.IsolationLevel.READ_COMMITTED
};
/**
 * Transaction Manager
 */
class TransactionManager {
    constructor() {
        this.activeTransactions = new Map();
        this.transactionLogs = [];
    }
    /**
     * Begin a new transaction
     * @param options Transaction options
     * @returns Transaction context
     */
    beginTransaction(options = {}) {
        const mergedOptions = { ...DEFAULT_TRANSACTION_OPTIONS, ...options };
        const metadata = {
            id: (0, uuid_1.v4)(),
            startTime: Date.now(),
            status: types_1.TransactionStatus.PENDING,
            options: mergedOptions
        };
        const context = {
            metadata,
            data: {}
        };
        this.activeTransactions.set(metadata.id, context);
        // Set up transaction timeout
        if (mergedOptions.timeout) {
            setTimeout(() => {
                if (this.activeTransactions.has(metadata.id) &&
                    this.activeTransactions.get(metadata.id)?.metadata.status === types_1.TransactionStatus.PENDING) {
                    this.rollbackTransaction(context);
                    throw new Error(`Transaction ${metadata.id} timed out after ${mergedOptions.timeout}ms`);
                }
            }, mergedOptions.timeout);
        }
        return context;
    }
    /**
     * Commit a transaction
     * @param context Transaction context
     */
    commitTransaction(context) {
        const { id } = context.metadata;
        if (!this.activeTransactions.has(id)) {
            throw new Error(`Transaction ${id} not found`);
        }
        const transaction = this.activeTransactions.get(id);
        if (transaction.metadata.status !== types_1.TransactionStatus.PENDING) {
            throw new Error(`Transaction ${id} is not in PENDING state`);
        }
        // Update transaction metadata
        transaction.metadata.status = types_1.TransactionStatus.COMMITTED;
        transaction.metadata.endTime = Date.now();
        // Remove from active transactions
        this.activeTransactions.delete(id);
    }
    /**
     * Rollback a transaction
     * @param context Transaction context
     */
    rollbackTransaction(context) {
        const { id } = context.metadata;
        if (!this.activeTransactions.has(id)) {
            throw new Error(`Transaction ${id} not found`);
        }
        const transaction = this.activeTransactions.get(id);
        if (transaction.metadata.status !== types_1.TransactionStatus.PENDING) {
            throw new Error(`Transaction ${id} is not in PENDING state`);
        }
        // Update transaction metadata
        transaction.metadata.status = types_1.TransactionStatus.ROLLED_BACK;
        transaction.metadata.endTime = Date.now();
        // Remove from active transactions
        this.activeTransactions.delete(id);
    }
    /**
     * Execute a function within a transaction
     * @param fn Function to execute
     * @param options Transaction options
     * @returns Result of the function
     */
    executeTransaction(fn, options = {}) {
        const context = this.beginTransaction(options);
        try {
            const result = fn(context);
            this.commitTransaction(context);
            return result;
        }
        catch (error) {
            this.rollbackTransaction(context);
            // Handle auto-retry
            if (options.autoRetry && options.maxRetries && options.maxRetries > 0) {
                return this.retryTransaction(fn, options, options.maxRetries);
            }
            throw error;
        }
    }
    /**
     * Retry a transaction
     * @param fn Function to execute
     * @param options Transaction options
     * @param retriesLeft Number of retries left
     * @returns Result of the function
     */
    retryTransaction(fn, options, retriesLeft) {
        try {
            const context = this.beginTransaction(options);
            const result = fn(context);
            this.commitTransaction(context);
            return result;
        }
        catch (error) {
            if (retriesLeft > 1 && options.retryDelay) {
                // Wait for retry delay
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        try {
                            const result = this.retryTransaction(fn, options, retriesLeft - 1);
                            resolve(result);
                        }
                        catch (retryError) {
                            reject(retryError);
                        }
                    }, options.retryDelay);
                });
            }
            throw error;
        }
    }
    /**
     * Log a transaction operation
     * @param transactionId Transaction ID
     * @param operation Transaction operation
     */
    logOperation(transactionId, operation) {
        let log = this.transactionLogs.find(log => log.transactionId === transactionId);
        if (!log) {
            log = {
                transactionId,
                operations: []
            };
            this.transactionLogs.push(log);
        }
        log.operations.push(operation);
    }
    /**
     * Get transaction logs
     * @returns Transaction logs
     */
    getTransactionLogs() {
        return [...this.transactionLogs];
    }
    /**
     * Get active transactions
     * @returns Active transactions
     */
    getActiveTransactions() {
        return Array.from(this.activeTransactions.values());
    }
    /**
     * Check if a transaction is active
     * @param transactionId Transaction ID
     * @returns Whether the transaction is active
     */
    isTransactionActive(transactionId) {
        return this.activeTransactions.has(transactionId);
    }
    /**
     * Clear all transaction logs
     */
    clearTransactionLogs() {
        this.transactionLogs = [];
    }
}
exports.TransactionManager = TransactionManager;
