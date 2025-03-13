/**
 * Transaction Manager for the SafeFlow framework
 * Provides transactional guarantees for operations
 */
import { v4 as uuidv4 } from 'uuid';
import { TransactionContext, TransactionStatus, TransactionalAction } from '../core/types';

/**
 * Interface for the Transaction Manager
 */
export interface ITransactionManager {
  /**
   * Executes an action within a transaction
   * @param action The action to execute
   * @returns The result of the action
   */
  executeWithinTransaction<T>(action: TransactionalAction<T>): Promise<T>;
  
  /**
   * Gets the current transaction context
   * @returns The current transaction context or undefined if no transaction is active
   */
  getCurrentTransaction(): TransactionContext | undefined;
  
  /**
   * Commits the current transaction
   * @returns A promise that resolves when the transaction is committed
   */
  commit(): Promise<void>;
  
  /**
   * Rolls back the current transaction
   * @returns A promise that resolves when the transaction is rolled back
   */
  rollback(): Promise<void>;
}

/**
 * Implementation of the Transaction Manager
 */
export class TransactionManager implements ITransactionManager {
  private currentTransaction?: TransactionContext;
  private transactionStack: TransactionContext[] = [];
  
  /**
   * Executes an action within a transaction
   * @param action The action to execute
   * @returns The result of the action
   */
  async executeWithinTransaction<T>(action: TransactionalAction<T>): Promise<T> {
    // Start a new transaction
    const transaction = this.beginTransaction();
    
    try {
      // Execute the action
      const result = await action();
      
      // Commit the transaction
      await this.commit();
      
      return result;
    } catch (error) {
      // Roll back the transaction if an error occurs
      await this.rollback();
      
      // Re-throw the error
      throw error;
    }
  }
  
  /**
   * Gets the current transaction context
   * @returns The current transaction context or undefined if no transaction is active
   */
  getCurrentTransaction(): TransactionContext | undefined {
    return this.currentTransaction;
  }
  
  /**
   * Begins a new transaction
   * @returns The new transaction context
   */
  private beginTransaction(): TransactionContext {
    // If there's an active transaction, push it onto the stack
    if (this.currentTransaction) {
      this.transactionStack.push(this.currentTransaction);
    }
    
    // Create a new transaction
    this.currentTransaction = {
      id: uuidv4(),
      status: TransactionStatus.PENDING,
      startTime: new Date()
    };
    
    console.log(`Transaction ${this.currentTransaction.id} started`);
    
    return this.currentTransaction;
  }
  
  /**
   * Commits the current transaction
   * @returns A promise that resolves when the transaction is committed
   */
  async commit(): Promise<void> {
    if (!this.currentTransaction) {
      throw new Error('No active transaction to commit');
    }
    
    // Update the transaction status
    this.currentTransaction.status = TransactionStatus.COMMITTED;
    this.currentTransaction.endTime = new Date();
    
    console.log(`Transaction ${this.currentTransaction.id} committed`);
    
    // Restore the previous transaction if there is one
    this.currentTransaction = this.transactionStack.pop();
  }
  
  /**
   * Rolls back the current transaction
   * @returns A promise that resolves when the transaction is rolled back
   */
  async rollback(): Promise<void> {
    if (!this.currentTransaction) {
      throw new Error('No active transaction to roll back');
    }
    
    // Update the transaction status
    this.currentTransaction.status = TransactionStatus.ROLLED_BACK;
    this.currentTransaction.endTime = new Date();
    
    console.log(`Transaction ${this.currentTransaction.id} rolled back`);
    
    // Restore the previous transaction if there is one
    this.currentTransaction = this.transactionStack.pop();
  }
} 