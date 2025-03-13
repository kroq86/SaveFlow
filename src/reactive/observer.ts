/**
 * Observer interface for the SafeFlow reactive system
 */

/**
 * Interface for observers in the Observer pattern
 */
export interface Observer<T = any> {
  /**
   * Called when an observed subject changes
   * @param propertyName The name of the property that changed
   * @param newValue The new value of the property
   * @param oldValue The old value of the property
   */
  update(propertyName: string, newValue: T, oldValue: T): void;
}

/**
 * Base class for objects that can observe changes
 */
export abstract class BaseObserver<T = any> implements Observer<T> {
  /**
   * Called when an observed subject changes
   * @param propertyName The name of the property that changed
   * @param newValue The new value of the property
   * @param oldValue The old value of the property
   */
  update(propertyName: string, newValue: T, oldValue: T): void {
    console.log(`Property ${propertyName} changed from ${oldValue} to ${newValue}`);
    this.onUpdate(propertyName, newValue, oldValue);
  }
  
  /**
   * Abstract method that must be implemented by subclasses
   * @param propertyName The name of the property that changed
   * @param newValue The new value of the property
   * @param oldValue The old value of the property
   */
  protected abstract onUpdate(propertyName: string, newValue: T, oldValue: T): void;
} 