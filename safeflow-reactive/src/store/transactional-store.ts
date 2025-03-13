/**
 * Transactional Store implementation for the SafeFlow Reactive System
 */
import { v4 as uuidv4 } from 'uuid';
import {
  TransactionOptions,
  TransactionContext,
  TransactionStatus,
  TransactionLog,
  TransactionOperation,
  TransactionalStore,
  Observer,
  Subscription,
  Store
} from '../types';
import { SafeFlowSubject } from '../reactive/subject';
import { TransactionManager } from '../transaction/transaction-manager';

/**
 * Transactional Store implementation
 */
export class SafeFlowStore<T extends object> implements TransactionalStore<T> {
  private state: T;
  private initialState: T;
  private subject: SafeFlowSubject<T>;
  private transactionManager: TransactionManager;
  
  /**
   * Create a new store
   * @param initialState Initial state
   * @param transactionManager Transaction manager (optional)
   */
  constructor(initialState: T, transactionManager?: TransactionManager) {
    this.initialState = { ...initialState };
    this.state = { ...initialState };
    this.subject = new SafeFlowSubject<T>();
    this.transactionManager = transactionManager || new TransactionManager();
  }
  
  /**
   * Get the current state
   * @returns Current state
   */
  getState(): T {
    return { ...this.state };
  }
  
  /**
   * Update the state
   * @param state Partial state to update
   */
  setState(state: Partial<T>): void {
    this.state = { ...this.state, ...state };
    this.subject.next(this.getState());
  }
  
  /**
   * Reset the state to its initial value
   */
  resetState(): void {
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
  subscribe(
    observerOrNext?: Observer<T> | ((state: T) => void),
    error?: (error: any) => void,
    complete?: () => void
  ): Subscription {
    return this.subject.subscribe(observerOrNext, error, complete);
  }
  
  /**
   * Begin a transaction
   * @param options Transaction options
   * @returns Transaction context
   */
  beginTransaction(options: TransactionOptions = {}): TransactionContext {
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
  commitTransaction(context: TransactionContext): void {
    this.transactionManager.commitTransaction(context);
    
    // Notify observers of the state change
    this.subject.next(this.getState());
  }
  
  /**
   * Rollback a transaction
   * @param context Transaction context
   */
  rollbackTransaction(context: TransactionContext): void {
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
  executeTransaction<R>(
    fn: (context: TransactionContext) => R,
    options: TransactionOptions = {}
  ): R {
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
      } catch (error) {
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
  getTransactionLogs(): TransactionLog[] {
    return this.transactionManager.getTransactionLogs();
  }
  
  /**
   * Log a transaction operation
   * @param transactionId Transaction ID
   * @param operation Transaction operation
   */
  private logOperation(transactionId: string, operation: TransactionOperation): void {
    this.transactionManager.logOperation(transactionId, operation);
  }
  
  /**
   * Get the transaction manager
   * @returns Transaction manager
   */
  getTransactionManager(): TransactionManager {
    return this.transactionManager;
  }
  
  /**
   * Set a custom transaction manager
   * @param manager Custom transaction manager
   */
  setTransactionManager(manager: TransactionManager): void {
    this.transactionManager = manager;
  }
} 