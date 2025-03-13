/**
 * Decorators for the SafeFlow framework
 */
import 'reflect-metadata';
import { TransactionStatus } from './types';

// Metadata keys
const TRANSACTIONAL_KEY = 'safeflow:transactional';
const OBSERVABLE_KEY = 'safeflow:observable';
const VALIDATE_KEY = 'safeflow:validate';

/**
 * Decorator that marks a method as transactional
 * Methods marked with @Transactional will be executed within a transaction
 */
export function Transactional(options: { timeout?: number } = {}) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    Reflect.defineMetadata(
      TRANSACTIONAL_KEY,
      { ...options, propertyKey },
      target,
      propertyKey
    );
    
    const originalMethod = descriptor.value;
    
    descriptor.value = function (...args: any[]) {
      // The actual implementation will be provided by the transaction manager
      // This is just a placeholder that will be replaced at runtime
      console.log(`Executing ${propertyKey} in a transaction`);
      return originalMethod.apply(this, args);
    };
    
    return descriptor;
  };
}

/**
 * Decorator that marks a property as observable
 * Properties marked with @Observable will notify observers when their value changes
 */
export function Observable(options: { emitInitial?: boolean } = {}) {
  return function (target: any, propertyKey: string) {
    Reflect.defineMetadata(
      OBSERVABLE_KEY,
      { ...options, propertyKey },
      target,
      propertyKey
    );
    
    // Create a private property to store the actual value
    const privateKey = `_${propertyKey}`;
    
    // Define getter and setter for the property
    Object.defineProperty(target, propertyKey, {
      get() {
        return this[privateKey];
      },
      set(value) {
        const oldValue = this[privateKey];
        this[privateKey] = value;
        
        // Notify observers if the value has changed
        if (oldValue !== value && typeof this.notifyObservers === 'function') {
          this.notifyObservers(propertyKey, value, oldValue);
        }
      },
      enumerable: true,
      configurable: true
    });
  };
}

/**
 * Decorator that marks a method parameter as requiring validation
 * Parameters marked with @Validate will be validated before the method is executed
 */
export function Validate(validatorName: string) {
  return function (
    target: any,
    propertyKey: string,
    parameterIndex: number
  ) {
    const existingValidators = Reflect.getMetadata(VALIDATE_KEY, target, propertyKey) || [];
    existingValidators.push({ index: parameterIndex, validatorName });
    Reflect.defineMetadata(VALIDATE_KEY, existingValidators, target, propertyKey);
  };
} 