/**
 * SafeFlow Reactive System
 * A reactive system with transactional guarantees for the SafeFlow framework
 */

// Export types
export * from './types';

// Export transaction components
export { TransactionManager } from './transaction/transaction-manager';
export { 
  Transactional, 
  TransactionalClass, 
  getTransactionManager, 
  setTransactionManager 
} from './transaction/transactional';

// Export reactive components
export { SafeFlowSubject } from './reactive/subject';

// Export store components
export { SafeFlowStore } from './store/transactional-store';

// Initialize the framework
console.log('SafeFlow Reactive System initialized'); 