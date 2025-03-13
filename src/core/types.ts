/**
 * Core types for the SafeFlow framework
 */

/**
 * Represents any data that can be stored and manipulated
 */
export type Data = Record<string, any>;

/**
 * Represents a unique identifier
 */
export type ID = string | number;

/**
 * Represents a function that can be executed within a transaction
 */
export type TransactionalAction<T = any> = () => T | Promise<T>;

/**
 * Represents the status of a transaction
 */
export enum TransactionStatus {
  PENDING = 'PENDING',
  COMMITTED = 'COMMITTED',
  ROLLED_BACK = 'ROLLED_BACK'
}

/**
 * Represents a transaction context
 */
export interface TransactionContext {
  id: string;
  status: TransactionStatus;
  startTime: Date;
  endTime?: Date;
}

/**
 * Represents a validation result
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Represents a code generation template
 */
export interface CodeTemplate {
  name: string;
  description: string;
  template: string;
  variables: Record<string, string>;
} 