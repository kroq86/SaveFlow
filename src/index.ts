// SafeFlow - A framework integrating transactional guarantees, reactive systems, and type safety
import 'reflect-metadata';

// Export core components
export * from './core/types';
export * from './core/decorators';

// Export transaction components
export * from './transaction/transaction-manager';
export * from './transaction/transactional';

// Export reactive components
export * from './reactive/subject';
export * from './reactive/observer';

// Export infrastructure components
export * from './infrastructure/crud-operations';
export * from './infrastructure/code-generator';

// Export validation components
export * from './validation/validator';
export * from './validation/ai-output-validator';

// Initialize the framework
console.log('SafeFlow framework initialized'); 