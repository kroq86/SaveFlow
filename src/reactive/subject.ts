/**
 * Subject class for the SafeFlow reactive system
 */
import { Observer } from './observer';
import { BehaviorSubject, Observable as RxObservable } from 'rxjs';

/**
 * Interface for subjects in the Observer pattern
 */
export interface Subject<T = any> {
  /**
   * Registers an observer to be notified of changes
   * @param observer The observer to register
   */
  registerObserver(observer: Observer<T>): void;
  
  /**
   * Unregisters an observer
   * @param observer The observer to unregister
   */
  unregisterObserver(observer: Observer<T>): void;
  
  /**
   * Notifies all registered observers of a change
   * @param propertyName The name of the property that changed
   * @param newValue The new value of the property
   * @param oldValue The old value of the property
   */
  notifyObservers(propertyName: string, newValue: T, oldValue: T): void;
}

/**
 * Base class for objects that can be observed
 */
export abstract class BaseSubject<T = any> implements Subject<T> {
  private observers: Observer<T>[] = [];
  
  /**
   * Registers an observer to be notified of changes
   * @param observer The observer to register
   */
  registerObserver(observer: Observer<T>): void {
    if (!this.observers.includes(observer)) {
      this.observers.push(observer);
    }
  }
  
  /**
   * Unregisters an observer
   * @param observer The observer to unregister
   */
  unregisterObserver(observer: Observer<T>): void {
    const index = this.observers.indexOf(observer);
    if (index !== -1) {
      this.observers.splice(index, 1);
    }
  }
  
  /**
   * Notifies all registered observers of a change
   * @param propertyName The name of the property that changed
   * @param newValue The new value of the property
   * @param oldValue The old value of the property
   */
  notifyObservers(propertyName: string, newValue: T, oldValue: T): void {
    this.observers.forEach(observer => {
      observer.update(propertyName, newValue, oldValue);
    });
  }
}

/**
 * A reactive property that can be observed
 */
export class ReactiveProperty<T> {
  private subject: BehaviorSubject<T>;
  
  /**
   * Creates a new reactive property
   * @param initialValue The initial value of the property
   */
  constructor(initialValue: T) {
    this.subject = new BehaviorSubject<T>(initialValue);
  }
  
  /**
   * Gets the current value of the property
   */
  get value(): T {
    return this.subject.getValue();
  }
  
  /**
   * Sets the value of the property
   */
  set value(newValue: T) {
    this.subject.next(newValue);
  }
  
  /**
   * Gets an observable that emits the property's value when it changes
   */
  get observable(): RxObservable<T> {
    return this.subject.asObservable();
  }
} 