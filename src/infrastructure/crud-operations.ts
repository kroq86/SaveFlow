/**
 * CRUD operations for the SafeFlow framework
 */
import { Data, ID } from '../core/types';
import { TransactionManager } from '../transaction/transaction-manager';
import { BaseSubject } from '../reactive/subject';

/**
 * Interface for CRUD operations
 */
export interface ICRUDOperations<T extends Data> {
  /**
   * Creates a new item
   * @param data The data to create
   * @returns The created item
   */
  create(data: T): Promise<T>;
  
  /**
   * Reads an item by ID
   * @param id The ID of the item to read
   * @returns The item or undefined if not found
   */
  read(id: ID): Promise<T | undefined>;
  
  /**
   * Reads all items
   * @returns All items
   */
  readAll(): Promise<T[]>;
  
  /**
   * Updates an item
   * @param id The ID of the item to update
   * @param data The new data for the item
   * @returns The updated item or undefined if not found
   */
  update(id: ID, data: Partial<T>): Promise<T | undefined>;
  
  /**
   * Deletes an item
   * @param id The ID of the item to delete
   * @returns True if the item was deleted, false otherwise
   */
  delete(id: ID): Promise<boolean>;
}

/**
 * Base class for CRUD operations
 */
export class CRUDOperations<T extends Data> extends BaseSubject<T[]> implements ICRUDOperations<T> {
  protected dataStore: Map<ID, T> = new Map();
  protected transactionManager: TransactionManager;
  
  /**
   * Creates a new CRUD operations instance
   * @param transactionManager The transaction manager to use
   */
  constructor(transactionManager: TransactionManager) {
    super();
    this.transactionManager = transactionManager;
  }
  
  /**
   * Creates a new item
   * @param data The data to create
   * @returns The created item
   */
  async create(data: T): Promise<T> {
    return this.transactionManager.executeWithinTransaction(async () => {
      // Ensure the data has an ID
      if (!data.id) {
        throw new Error('Data must have an ID');
      }
      
      // Check if an item with the same ID already exists
      if (this.dataStore.has(data.id)) {
        throw new Error(`Item with ID ${data.id} already exists`);
      }
      
      // Store the data
      this.dataStore.set(data.id, data);
      
      // Notify observers
      const oldData = Array.from(this.dataStore.values());
      const newData = [...oldData];
      this.notifyObservers('create', newData, oldData);
      
      return data;
    });
  }
  
  /**
   * Reads an item by ID
   * @param id The ID of the item to read
   * @returns The item or undefined if not found
   */
  async read(id: ID): Promise<T | undefined> {
    return this.dataStore.get(id);
  }
  
  /**
   * Reads all items
   * @returns All items
   */
  async readAll(): Promise<T[]> {
    return Array.from(this.dataStore.values());
  }
  
  /**
   * Updates an item
   * @param id The ID of the item to update
   * @param data The new data for the item
   * @returns The updated item or undefined if not found
   */
  async update(id: ID, data: Partial<T>): Promise<T | undefined> {
    return this.transactionManager.executeWithinTransaction(async () => {
      // Check if the item exists
      const existingData = this.dataStore.get(id);
      if (!existingData) {
        return undefined;
      }
      
      // Update the data
      const updatedData = { ...existingData, ...data };
      this.dataStore.set(id, updatedData);
      
      // Notify observers
      const oldData = Array.from(this.dataStore.values());
      const newData = [...oldData];
      this.notifyObservers('update', newData, oldData);
      
      return updatedData;
    });
  }
  
  /**
   * Deletes an item
   * @param id The ID of the item to delete
   * @returns True if the item was deleted, false otherwise
   */
  async delete(id: ID): Promise<boolean> {
    return this.transactionManager.executeWithinTransaction(async () => {
      // Check if the item exists
      if (!this.dataStore.has(id)) {
        return false;
      }
      
      // Delete the item
      const result = this.dataStore.delete(id);
      
      // Notify observers
      const oldData = Array.from(this.dataStore.values());
      const newData = [...oldData];
      this.notifyObservers('delete', newData, oldData);
      
      return result;
    });
  }
} 