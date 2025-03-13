/**
 * Transactional decorator implementation for the SafeFlow framework
 */
import { TransactionManager } from './transaction-manager';

// Singleton instance of the transaction manager
const transactionManager = new TransactionManager();

/**
 * Gets the transaction manager instance
 * @returns The transaction manager instance
 */
export function getTransactionManager(): TransactionManager {
  return transactionManager;
}

/**
 * Applies the transactional behavior to a class
 * This function is used to enhance classes with transactional capabilities
 * @param target The class to enhance
 */
export function applyTransactional(target: any): void {
  // Get all method names of the class
  const methodNames = Object.getOwnPropertyNames(target.prototype)
    .filter(name => name !== 'constructor');
  
  // Check each method for the @Transactional decorator
  methodNames.forEach(methodName => {
    const descriptor = Object.getOwnPropertyDescriptor(target.prototype, methodName);
    
    if (!descriptor || typeof descriptor.value !== 'function') {
      return;
    }
    
    // Check if the method has the @Transactional decorator
    const metadata = Reflect.getMetadata('safeflow:transactional', target.prototype, methodName);
    
    if (!metadata) {
      return;
    }
    
    // Replace the method with a transactional version
    const originalMethod = descriptor.value;
    
    descriptor.value = async function(...args: any[]) {
      return transactionManager.executeWithinTransaction(async () => {
        return originalMethod.apply(this, args);
      });
    };
    
    Object.defineProperty(target.prototype, methodName, descriptor);
  });
} 