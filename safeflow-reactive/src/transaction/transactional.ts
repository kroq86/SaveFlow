/**
 * Transactional decorator for the SafeFlow Reactive System
 */
import { TransactionOptions } from '../types';
import { TransactionManager } from './transaction-manager';

/**
 * Global transaction manager instance
 */
const globalTransactionManager = new TransactionManager();

/**
 * Get the global transaction manager
 * @returns Global transaction manager
 */
export function getTransactionManager(): TransactionManager {
  return globalTransactionManager;
}

/**
 * Set a custom transaction manager
 * @param manager Custom transaction manager
 */
export function setTransactionManager(manager: TransactionManager): void {
  (globalTransactionManager as any) = manager;
}

/**
 * Transactional decorator
 * @param options Transaction options
 * @returns Method decorator
 */
export function Transactional(options: TransactionOptions = {}): MethodDecorator {
  return function(
    target: Object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ): PropertyDescriptor {
    const originalMethod = descriptor.value;
    
    descriptor.value = function(...args: any[]) {
      return globalTransactionManager.executeTransaction(() => {
        return originalMethod.apply(this, args);
      }, options);
    };
    
    return descriptor;
  };
}

/**
 * Transactional class decorator
 * @param options Transaction options
 * @returns Class decorator
 */
export function TransactionalClass(options: TransactionOptions = {}) {
  return function(target: Function): void {
    // Get all method names from the prototype
    const methodNames = Object.getOwnPropertyNames(target.prototype)
      .filter(name => 
        name !== 'constructor' && 
        typeof target.prototype[name] === 'function'
      );
    
    // Apply transactional decorator to each method
    methodNames.forEach(methodName => {
      const descriptor = Object.getOwnPropertyDescriptor(target.prototype, methodName);
      
      if (descriptor && typeof descriptor.value === 'function') {
        Object.defineProperty(
          target.prototype,
          methodName,
          Transactional(options)(target.prototype, methodName, descriptor) as PropertyDescriptor
        );
      }
    });
  };
} 