/**
 * Example Todo application using the SafeFlow framework
 */
import { TransactionManager } from '../transaction/transaction-manager';
import { BaseSubject } from '../reactive/subject';
import { Observer } from '../reactive/observer';
import { CRUDOperations } from '../infrastructure/crud-operations';
import { Transactional } from '../core/decorators';
import { applyTransactional } from '../transaction/transactional';

/**
 * Todo item model
 */
interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

/**
 * Todo service for managing todos
 */
class TodoService extends CRUDOperations<Todo> {
  /**
   * Creates a new todo service
   * @param transactionManager The transaction manager to use
   */
  constructor(transactionManager: TransactionManager) {
    super(transactionManager);
  }
  
  /**
   * Marks a todo as completed
   * @param id The ID of the todo to mark as completed
   * @returns The updated todo or undefined if not found
   */
  @Transactional()
  async markAsCompleted(id: number): Promise<Todo | undefined> {
    return this.update(id, { completed: true });
  }
  
  /**
   * Marks a todo as not completed
   * @param id The ID of the todo to mark as not completed
   * @returns The updated todo or undefined if not found
   */
  @Transactional()
  async markAsNotCompleted(id: number): Promise<Todo | undefined> {
    return this.update(id, { completed: false });
  }
  
  /**
   * Gets all completed todos
   * @returns All completed todos
   */
  async getCompletedTodos(): Promise<Todo[]> {
    const todos = await this.readAll();
    return todos.filter(todo => todo.completed);
  }
  
  /**
   * Gets all incomplete todos
   * @returns All incomplete todos
   */
  async getIncompleteTodos(): Promise<Todo[]> {
    const todos = await this.readAll();
    return todos.filter(todo => !todo.completed);
  }
}

/**
 * Todo observer for monitoring changes to todos
 */
class TodoObserver implements Observer<Todo[]> {
  /**
   * Called when todos change
   * @param propertyName The name of the property that changed
   * @param newValue The new value of the property
   * @param oldValue The old value of the property
   */
  update(propertyName: string, newValue: Todo[], oldValue: Todo[]): void {
    console.log(`Todos updated (${propertyName}):`);
    console.log('New todos:', newValue);
  }
}

/**
 * Main function to demonstrate the todo application
 */
async function main() {
  // Create a transaction manager
  const transactionManager = new TransactionManager();
  
  // Create a todo service
  const todoService = new TodoService(transactionManager);
  
  // Apply transactional behavior to the todo service
  applyTransactional(TodoService);
  
  // Create a todo observer
  const todoObserver = new TodoObserver();
  
  // Register the observer with the todo service
  todoService.registerObserver(todoObserver);
  
  try {
    // Create some todos
    await todoService.create({ id: 1, title: 'Learn SafeFlow', completed: false });
    await todoService.create({ id: 2, title: 'Build a todo app', completed: false });
    await todoService.create({ id: 3, title: 'Write documentation', completed: false });
    
    // Mark a todo as completed
    await todoService.markAsCompleted(1);
    
    // Get all todos
    const allTodos = await todoService.readAll();
    console.log('All todos:', allTodos);
    
    // Get completed todos
    const completedTodos = await todoService.getCompletedTodos();
    console.log('Completed todos:', completedTodos);
    
    // Get incomplete todos
    const incompleteTodos = await todoService.getIncompleteTodos();
    console.log('Incomplete todos:', incompleteTodos);
    
    // Update a todo
    await todoService.update(2, { title: 'Build an awesome todo app' });
    
    // Delete a todo
    await todoService.delete(3);
    
    // Get all todos again
    const updatedTodos = await todoService.readAll();
    console.log('Updated todos:', updatedTodos);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error:', error.message);
    } else {
      console.error('Unknown error:', error);
    }
  }
}

// Run the example
main().catch((error: unknown) => {
  if (error instanceof Error) {
    console.error('Unhandled error:', error.message);
  } else {
    console.error('Unknown unhandled error:', error);
  }
}); 