/**
 * Transactional decorator for the SafeFlow Reactive System
 */
import { TransactionOptions } from '../types';
import { TransactionManager } from './transaction-manager';
/**
 * Get the global transaction manager
 * @returns Global transaction manager
 */
export declare function getTransactionManager(): TransactionManager;
/**
 * Set a custom transaction manager
 * @param manager Custom transaction manager
 */
export declare function setTransactionManager(manager: TransactionManager): void;
/**
 * Transactional decorator
 * @param options Transaction options
 * @returns Method decorator
 */
export declare function Transactional(options?: TransactionOptions): MethodDecorator;
/**
 * Transactional class decorator
 * @param options Transaction options
 * @returns Class decorator
 */
export declare function TransactionalClass(options?: TransactionOptions): (target: Function) => void;
