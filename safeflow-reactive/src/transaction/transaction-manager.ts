/**
 * Transaction Manager for the SafeFlow Reactive System
 */
import { v4 as uuidv4 } from 'uuid';
import {
  TransactionStatus,
  TransactionOptions,
  TransactionMetadata,
  TransactionContext,
  TransactionOperation,
  TransactionLog,
  IsolationLevel
} from '../types';

/**
 * Default transaction options
 */
const DEFAULT_TRANSACTION_OPTIONS: TransactionOptions = {
  timeout: 30000, // 30 seconds
  autoRetry: false,
  maxRetries: 3,
  retryDelay: 1000, // 1 second
  optimisticLocking: false,
  isolationLevel: IsolationLevel.READ_COMMITTED
};

/**
 * Transaction Manager
 */
export class TransactionManager {
  private activeTransactions: Map<string, TransactionContext> = new Map();
  private transactionLogs: TransactionLog[] = [];
  
  /**
   * Begin a new transaction
   * @param options Transaction options
   * @returns Transaction context
   */
  beginTransaction(options: TransactionOptions = {}): TransactionContext {
    const mergedOptions = { ...DEFAULT_TRANSACTION_OPTIONS, ...options };
    
    const metadata: TransactionMetadata = {
      id: uuidv4(),
      startTime: Date.now(),
      status: TransactionStatus.PENDING,
      options: mergedOptions
    };
    
    const context: TransactionContext = {
      metadata,
      data: {}
    };
    
    this.activeTransactions.set(metadata.id, context);
    
    // Set up transaction timeout
    if (mergedOptions.timeout) {
      setTimeout(() => {
        if (this.activeTransactions.has(metadata.id) && 
            this.activeTransactions.get(metadata.id)?.metadata.status === TransactionStatus.PENDING) {
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
  commitTransaction(context: TransactionContext): void {
    const { id } = context.metadata;
    
    if (!this.activeTransactions.has(id)) {
      throw new Error(`Transaction ${id} not found`);
    }
    
    const transaction = this.activeTransactions.get(id)!;
    
    if (transaction.metadata.status !== TransactionStatus.PENDING) {
      throw new Error(`Transaction ${id} is not in PENDING state`);
    }
    
    // Update transaction metadata
    transaction.metadata.status = TransactionStatus.COMMITTED;
    transaction.metadata.endTime = Date.now();
    
    // Remove from active transactions
    this.activeTransactions.delete(id);
  }
  
  /**
   * Rollback a transaction
   * @param context Transaction context
   */
  rollbackTransaction(context: TransactionContext): void {
    const { id } = context.metadata;
    
    if (!this.activeTransactions.has(id)) {
      throw new Error(`Transaction ${id} not found`);
    }
    
    const transaction = this.activeTransactions.get(id)!;
    
    if (transaction.metadata.status !== TransactionStatus.PENDING) {
      throw new Error(`Transaction ${id} is not in PENDING state`);
    }
    
    // Update transaction metadata
    transaction.metadata.status = TransactionStatus.ROLLED_BACK;
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
  executeTransaction<R>(
    fn: (context: TransactionContext) => R,
    options: TransactionOptions = {}
  ): R {
    const context = this.beginTransaction(options);
    
    try {
      const result = fn(context);
      this.commitTransaction(context);
      return result;
    } catch (error) {
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
  private retryTransaction<R>(
    fn: (context: TransactionContext) => R,
    options: TransactionOptions,
    retriesLeft: number
  ): R {
    try {
      const context = this.beginTransaction(options);
      const result = fn(context);
      this.commitTransaction(context);
      return result;
    } catch (error) {
      if (retriesLeft > 1 && options.retryDelay) {
        // Wait for retry delay
        return new Promise<R>((resolve, reject) => {
          setTimeout(() => {
            try {
              const result = this.retryTransaction(fn, options, retriesLeft - 1);
              resolve(result);
            } catch (retryError) {
              reject(retryError);
            }
          }, options.retryDelay);
        }) as any;
      }
      
      throw error;
    }
  }
  
  /**
   * Log a transaction operation
   * @param transactionId Transaction ID
   * @param operation Transaction operation
   */
  logOperation(transactionId: string, operation: TransactionOperation): void {
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
  getTransactionLogs(): TransactionLog[] {
    return [...this.transactionLogs];
  }
  
  /**
   * Get active transactions
   * @returns Active transactions
   */
  getActiveTransactions(): TransactionContext[] {
    return Array.from(this.activeTransactions.values());
  }
  
  /**
   * Check if a transaction is active
   * @param transactionId Transaction ID
   * @returns Whether the transaction is active
   */
  isTransactionActive(transactionId: string): boolean {
    return this.activeTransactions.has(transactionId);
  }
  
  /**
   * Clear all transaction logs
   */
  clearTransactionLogs(): void {
    this.transactionLogs = [];
  }
} 