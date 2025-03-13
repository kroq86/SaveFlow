/**
 * Core types for the SafeFlow Reactive System
 */

/**
 * Transaction status
 */
export enum TransactionStatus {
  PENDING = 'PENDING',
  COMMITTED = 'COMMITTED',
  ROLLED_BACK = 'ROLLED_BACK'
}

/**
 * Transaction options
 */
export interface TransactionOptions {
  /**
   * Transaction timeout in milliseconds
   */
  timeout?: number;
  
  /**
   * Whether to automatically retry the transaction on failure
   */
  autoRetry?: boolean;
  
  /**
   * Maximum number of retries
   */
  maxRetries?: number;
  
  /**
   * Delay between retries in milliseconds
   */
  retryDelay?: number;
  
  /**
   * Whether to use optimistic locking
   */
  optimisticLocking?: boolean;
  
  /**
   * Transaction isolation level
   */
  isolationLevel?: IsolationLevel;
}

/**
 * Transaction isolation level
 */
export enum IsolationLevel {
  READ_UNCOMMITTED = 'READ_UNCOMMITTED',
  READ_COMMITTED = 'READ_COMMITTED',
  REPEATABLE_READ = 'REPEATABLE_READ',
  SERIALIZABLE = 'SERIALIZABLE'
}

/**
 * Transaction metadata
 */
export interface TransactionMetadata {
  /**
   * Transaction ID
   */
  id: string;
  
  /**
   * Transaction start time
   */
  startTime: number;
  
  /**
   * Transaction end time
   */
  endTime?: number;
  
  /**
   * Transaction status
   */
  status: TransactionStatus;
  
  /**
   * Transaction options
   */
  options: TransactionOptions;
}

/**
 * Transaction context
 */
export interface TransactionContext<T = any> {
  /**
   * Transaction metadata
   */
  metadata: TransactionMetadata;
  
  /**
   * Transaction data
   */
  data: T;
}

/**
 * Transaction operation
 */
export interface TransactionOperation<T = any> {
  /**
   * Operation type
   */
  type: 'create' | 'read' | 'update' | 'delete';
  
  /**
   * Target object
   */
  target: string;
  
  /**
   * Operation data
   */
  data?: T;
  
  /**
   * Operation timestamp
   */
  timestamp: number;
}

/**
 * Transaction log
 */
export interface TransactionLog {
  /**
   * Transaction ID
   */
  transactionId: string;
  
  /**
   * Operations performed in the transaction
   */
  operations: TransactionOperation[];
}

/**
 * Observer interface
 */
export interface Observer<T> {
  /**
   * Called when a new value is emitted
   */
  next(value: T): void;
  
  /**
   * Called when an error occurs
   */
  error(err: any): void;
  
  /**
   * Called when the observable completes
   */
  complete(): void;
}

/**
 * Observable interface
 */
export interface Observable<T> {
  /**
   * Subscribe to the observable
   */
  subscribe(observer: Observer<T>): Subscription;
  
  /**
   * Subscribe to the observable with callbacks
   */
  subscribe(
    next?: (value: T) => void,
    error?: (error: any) => void,
    complete?: () => void
  ): Subscription;
}

/**
 * Subscription interface
 */
export interface Subscription {
  /**
   * Unsubscribe from the observable
   */
  unsubscribe(): void;
  
  /**
   * Whether the subscription is closed
   */
  readonly closed: boolean;
}

/**
 * Subject interface
 */
export interface Subject<T> extends Observable<T> {
  /**
   * Emit a new value
   */
  next(value: T): void;
  
  /**
   * Emit an error
   */
  error(err: any): void;
  
  /**
   * Complete the observable
   */
  complete(): void;
}

/**
 * Store interface
 */
export interface Store<T> {
  /**
   * Get the current state
   */
  getState(): T;
  
  /**
   * Update the state
   */
  setState(state: Partial<T>): void;
  
  /**
   * Reset the state to its initial value
   */
  resetState(): void;
  
  /**
   * Subscribe to state changes
   */
  subscribe(observer: Observer<T>): Subscription;
  
  /**
   * Subscribe to state changes with callbacks
   */
  subscribe(
    next?: (state: T) => void,
    error?: (error: any) => void,
    complete?: () => void
  ): Subscription;
}

/**
 * Transactional store interface
 */
export interface TransactionalStore<T> extends Store<T> {
  /**
   * Begin a transaction
   */
  beginTransaction(options?: TransactionOptions): TransactionContext;
  
  /**
   * Commit a transaction
   */
  commitTransaction(context: TransactionContext): void;
  
  /**
   * Rollback a transaction
   */
  rollbackTransaction(context: TransactionContext): void;
  
  /**
   * Execute a function within a transaction
   */
  executeTransaction<R>(
    fn: (context: TransactionContext) => R,
    options?: TransactionOptions
  ): R;
  
  /**
   * Get transaction logs
   */
  getTransactionLogs(): TransactionLog[];
} 