/**
 * Todo App Example for SafeFlow Reactive System
 * 
 * This example demonstrates:
 * 1. Creating a transactional store
 * 2. Using the @Transactional decorator
 * 3. Subscribing to state changes
 * 4. Handling transactions (commit/rollback)
 */
import {
  SafeFlowStore,
  Transactional,
  TransactionalClass,
  TransactionContext,
  TransactionOptions
} from '../src';

// Define the Todo type
interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

// Define the Todo App State
interface TodoAppState {
  todos: Todo[];
  filter: 'all' | 'active' | 'completed';
  loading: boolean;
}

// Initial state
const initialState: TodoAppState = {
  todos: [],
  filter: 'all',
  loading: false
};

// Create a transactional store
const todoStore = new SafeFlowStore<TodoAppState>(initialState);

// Todo Service with transactional methods
@TransactionalClass()
class TodoService {
  // Add a new todo
  addTodo(title: string): Todo {
    console.log(`Adding todo: ${title}`);
    
    const state = todoStore.getState();
    
    const newTodo: Todo = {
      id: Date.now().toString(),
      title,
      completed: false
    };
    
    todoStore.setState({
      todos: [...state.todos, newTodo]
    });
    
    return newTodo;
  }
  
  // Toggle todo completion status
  toggleTodo(id: string): Todo | undefined {
    console.log(`Toggling todo: ${id}`);
    
    const state = todoStore.getState();
    const todo = state.todos.find(todo => todo.id === id);
    
    if (!todo) {
      console.error(`Todo with id ${id} not found`);
      return undefined;
    }
    
    const updatedTodo = { ...todo, completed: !todo.completed };
    
    todoStore.setState({
      todos: state.todos.map(t => t.id === id ? updatedTodo : t)
    });
    
    return updatedTodo;
  }
  
  // Remove a todo
  removeTodo(id: string): boolean {
    console.log(`Removing todo: ${id}`);
    
    const state = todoStore.getState();
    const todoExists = state.todos.some(todo => todo.id === id);
    
    if (!todoExists) {
      console.error(`Todo with id ${id} not found`);
      return false;
    }
    
    todoStore.setState({
      todos: state.todos.filter(todo => todo.id !== id)
    });
    
    return true;
  }
  
  // Update todo title
  updateTodoTitle(id: string, title: string): Todo | undefined {
    console.log(`Updating todo ${id} title to: ${title}`);
    
    const state = todoStore.getState();
    const todo = state.todos.find(todo => todo.id === id);
    
    if (!todo) {
      console.error(`Todo with id ${id} not found`);
      return undefined;
    }
    
    const updatedTodo = { ...todo, title };
    
    todoStore.setState({
      todos: state.todos.map(t => t.id === id ? updatedTodo : t)
    });
    
    return updatedTodo;
  }
  
  // Clear completed todos
  clearCompleted(): void {
    console.log('Clearing completed todos');
    
    const state = todoStore.getState();
    
    todoStore.setState({
      todos: state.todos.filter(todo => !todo.completed)
    });
  }
  
  // Set filter
  setFilter(filter: 'all' | 'active' | 'completed'): void {
    console.log(`Setting filter to: ${filter}`);
    
    todoStore.setState({ filter });
  }
  
  // Execute a batch operation within a transaction
  executeBatch(operations: (() => void)[]): void {
    console.log(`Executing batch of ${operations.length} operations`);
    
    // Start a transaction
    const context = todoStore.beginTransaction();
    
    try {
      // Set loading state
      todoStore.setState({ loading: true });
      
      // Execute all operations
      operations.forEach(operation => operation());
      
      // Commit the transaction
      todoStore.commitTransaction(context);
    } catch (error) {
      console.error('Error executing batch operations:', error);
      
      // Rollback the transaction
      todoStore.rollbackTransaction(context);
    } finally {
      // Reset loading state
      todoStore.setState({ loading: false });
    }
  }
}

// Create a todo service instance
const todoService = new TodoService();

// Subscribe to state changes
const subscription = todoStore.subscribe(
  state => {
    console.log('State updated:', state);
    
    // Display todos based on the current filter
    const filteredTodos = state.todos.filter(todo => {
      if (state.filter === 'active') return !todo.completed;
      if (state.filter === 'completed') return todo.completed;
      return true; // 'all' filter
    });
    
    console.log('Filtered todos:', filteredTodos);
  },
  error => console.error('Error in state subscription:', error),
  () => console.log('State subscription completed')
);

// Example usage
console.log('=== Todo App Example ===');

// Add some todos
const todo1 = todoService.addTodo('Learn SafeFlow Reactive System');
const todo2 = todoService.addTodo('Build a Todo App');
const todo3 = todoService.addTodo('Write tests');

// Toggle a todo
todoService.toggleTodo(todo1.id);

// Update a todo
todoService.updateTodoTitle(todo2.id, 'Build an Awesome Todo App');

// Set filter to show only completed todos
todoService.setFilter('completed');

// Set filter to show only active todos
todoService.setFilter('active');

// Execute a batch operation
todoService.executeBatch([
  () => todoService.addTodo('Refactor code'),
  () => todoService.toggleTodo(todo3.id),
  () => todoService.removeTodo(todo2.id)
]);

// Clear completed todos
todoService.clearCompleted();

// Reset filter to show all todos
todoService.setFilter('all');

// Unsubscribe
subscription.unsubscribe();

// Display transaction logs
console.log('\nTransaction Logs:');
console.log(todoStore.getTransactionLogs()); 