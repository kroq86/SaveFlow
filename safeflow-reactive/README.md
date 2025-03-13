# SafeFlow Reactive System

A reactive system with transactional guarantees for the SafeFlow framework.

## Features

- **Transactional Guarantees**: Ensure ACID properties for your state changes
- **Reactive Programming**: Subscribe to state changes and react accordingly
- **Type Safety**: Built with TypeScript for type safety and better developer experience
- **Decorators**: Use `@Transactional` and `@TransactionalClass` decorators for clean code
- **Isolation Levels**: Support for different transaction isolation levels
- **Transaction Logs**: Track all operations performed within transactions

## Installation

```bash
npm install safeflow-reactive
```

## Quick Start

```typescript
import { 
  SafeFlowStore, 
  Transactional, 
  TransactionalClass 
} from 'safeflow-reactive';

// Define your state interface
interface CounterState {
  count: number;
  lastUpdated: Date;
}

// Create a store with initial state
const counterStore = new SafeFlowStore<CounterState>({
  count: 0,
  lastUpdated: new Date()
});

// Create a service with transactional methods
@TransactionalClass()
class CounterService {
  increment(): void {
    const state = counterStore.getState();
    counterStore.setState({
      count: state.count + 1,
      lastUpdated: new Date()
    });
  }
  
  decrement(): void {
    const state = counterStore.getState();
    counterStore.setState({
      count: state.count - 1,
      lastUpdated: new Date()
    });
  }
  
  reset(): void {
    counterStore.resetState();
  }
}

// Create a service instance
const counterService = new CounterService();

// Subscribe to state changes
counterStore.subscribe(
  state => console.log('Current count:', state.count),
  error => console.error('Error:', error),
  () => console.log('Subscription completed')
);

// Use the service
counterService.increment(); // Current count: 1
counterService.increment(); // Current count: 2
counterService.decrement(); // Current count: 1
counterService.reset();     // Current count: 0
```

## Advanced Usage

### Manual Transaction Management

```typescript
// Start a transaction
const context = counterStore.beginTransaction();

try {
  // Perform multiple operations
  const state = counterStore.getState();
  counterStore.setState({ count: state.count + 5 });
  counterStore.setState({ lastUpdated: new Date() });
  
  // Commit the transaction
  counterStore.commitTransaction(context);
} catch (error) {
  // Rollback the transaction on error
  counterStore.rollbackTransaction(context);
  console.error('Transaction failed:', error);
}
```

### Transaction Options

```typescript
import { IsolationLevel } from 'safeflow-reactive';

// Configure transaction options
const options = {
  timeout: 5000, // 5 seconds
  autoRetry: true,
  maxRetries: 3,
  retryDelay: 1000, // 1 second
  optimisticLocking: true,
  isolationLevel: IsolationLevel.SERIALIZABLE
};

// Use options with a decorator
class UserService {
  @Transactional(options)
  updateUser(userId: string, data: any): void {
    // ...
  }
}

// Or with manual transaction management
const context = userStore.beginTransaction(options);
```

### Transaction Logs

```typescript
// Get transaction logs
const logs = counterStore.getTransactionLogs();

// Display logs
logs.forEach(log => {
  console.log(`Transaction: ${log.transactionId}`);
  log.operations.forEach(op => {
    console.log(`  ${op.type} operation on ${op.target} at ${new Date(op.timestamp)}`);
  });
});
```

## Integration with SafeFlow Framework

The SafeFlow Reactive System is part of the larger SafeFlow framework, which includes:

- **SafeFlow AI Validator**: Validate AI-generated code for security and integrity issues
- **SafeFlow Reactive System**: Reactive system with transactional guarantees (this package)
- **SafeFlow Entity System**: Type-safe entity and store system
- **SafeFlow Code Generator**: Generate code from templates

## License

MIT 