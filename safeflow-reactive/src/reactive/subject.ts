/**
 * Reactive Subject implementation for the SafeFlow Reactive System
 */
import { Subject, Observer, Subscription } from '../types';

/**
 * Subscription implementation
 */
class SafeFlowSubscription implements Subscription {
  private _closed: boolean = false;
  private onUnsubscribe: () => void;
  
  constructor(onUnsubscribe: () => void) {
    this.onUnsubscribe = onUnsubscribe;
  }
  
  /**
   * Unsubscribe from the observable
   */
  unsubscribe(): void {
    if (!this._closed) {
      this.onUnsubscribe();
      this._closed = true;
    }
  }
  
  /**
   * Whether the subscription is closed
   */
  get closed(): boolean {
    return this._closed;
  }
}

/**
 * SafeFlow Subject implementation
 */
export class SafeFlowSubject<T> implements Subject<T> {
  private observers: Observer<T>[] = [];
  private _isClosed: boolean = false;
  private lastValue: T | undefined;
  private _hasValue: boolean = false;
  
  /**
   * Subscribe to the subject
   * @param observerOrNext Observer or next function
   * @param error Error function
   * @param complete Complete function
   * @returns Subscription
   */
  subscribe(
    observerOrNext?: Observer<T> | ((value: T) => void),
    error?: (error: any) => void,
    complete?: () => void
  ): Subscription {
    let observer: Observer<T>;
    
    if (typeof observerOrNext === 'function') {
      // Create observer from functions
      observer = {
        next: observerOrNext,
        error: error || (() => {}),
        complete: complete || (() => {})
      };
    } else if (observerOrNext) {
      // Use provided observer
      observer = observerOrNext;
    } else {
      // Create empty observer
      observer = {
        next: () => {},
        error: () => {},
        complete: () => {}
      };
    }
    
    // Add observer to the list
    this.observers.push(observer);
    
    // If we have a value, emit it immediately
    if (this._hasValue && this.lastValue !== undefined) {
      observer.next(this.lastValue);
    }
    
    // If already closed, call complete
    if (this._isClosed) {
      observer.complete();
    }
    
    // Create subscription
    return new SafeFlowSubscription(() => {
      const index = this.observers.indexOf(observer);
      if (index !== -1) {
        this.observers.splice(index, 1);
      }
    });
  }
  
  /**
   * Emit a new value
   * @param value Value to emit
   */
  next(value: T): void {
    if (this._isClosed) {
      return;
    }
    
    this.lastValue = value;
    this._hasValue = true;
    
    // Notify all observers
    for (const observer of this.observers) {
      try {
        observer.next(value);
      } catch (err) {
        console.error('Error in observer.next:', err);
      }
    }
  }
  
  /**
   * Emit an error
   * @param err Error to emit
   */
  error(err: any): void {
    if (this._isClosed) {
      return;
    }
    
    this._isClosed = true;
    
    // Notify all observers
    for (const observer of this.observers) {
      try {
        observer.error(err);
      } catch (err) {
        console.error('Error in observer.error:', err);
      }
    }
    
    // Clear observers
    this.observers = [];
  }
  
  /**
   * Complete the observable
   */
  complete(): void {
    if (this._isClosed) {
      return;
    }
    
    this._isClosed = true;
    
    // Notify all observers
    for (const observer of this.observers) {
      try {
        observer.complete();
      } catch (err) {
        console.error('Error in observer.complete:', err);
      }
    }
    
    // Clear observers
    this.observers = [];
  }
  
  /**
   * Get the current value
   * @returns Current value
   */
  getValue(): T | undefined {
    return this.lastValue;
  }
  
  /**
   * Check if the subject has a value
   * @returns Whether the subject has a value
   */
  hasValue(): boolean {
    return this._hasValue;
  }
  
  /**
   * Check if the subject is closed
   * @returns Whether the subject is closed
   */
  isClosed(): boolean {
    return this._isClosed;
  }
  
  /**
   * Get the number of observers
   * @returns Number of observers
   */
  getObserverCount(): number {
    return this.observers.length;
  }
} 