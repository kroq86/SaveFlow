/**
 * Validator for the SafeFlow framework
 */
import { ValidationResult } from '../core/types';

/**
 * Interface for validators
 */
export interface IValidator<T = any> {
  /**
   * Validates a value
   * @param value The value to validate
   * @returns The validation result
   */
  validate(value: T): ValidationResult;
}

/**
 * Base class for validators
 */
export abstract class BaseValidator<T = any> implements IValidator<T> {
  /**
   * Validates a value
   * @param value The value to validate
   * @returns The validation result
   */
  abstract validate(value: T): ValidationResult;
  
  /**
   * Creates a successful validation result
   * @returns A successful validation result
   */
  protected createSuccessResult(): ValidationResult {
    return {
      isValid: true,
      errors: []
    };
  }
  
  /**
   * Creates a failed validation result
   * @param errors The validation errors
   * @returns A failed validation result
   */
  protected createFailureResult(errors: string[]): ValidationResult {
    return {
      isValid: false,
      errors
    };
  }
}

/**
 * Registry for validators
 */
export class ValidatorRegistry {
  private static instance: ValidatorRegistry;
  private validators: Map<string, IValidator> = new Map();
  
  /**
   * Gets the validator registry instance
   * @returns The validator registry instance
   */
  static getInstance(): ValidatorRegistry {
    if (!ValidatorRegistry.instance) {
      ValidatorRegistry.instance = new ValidatorRegistry();
    }
    
    return ValidatorRegistry.instance;
  }
  
  /**
   * Registers a validator
   * @param name The name of the validator
   * @param validator The validator to register
   */
  registerValidator(name: string, validator: IValidator): void {
    this.validators.set(name, validator);
  }
  
  /**
   * Gets a validator by name
   * @param name The name of the validator to get
   * @returns The validator or undefined if not found
   */
  getValidator(name: string): IValidator | undefined {
    return this.validators.get(name);
  }
  
  /**
   * Validates a value using a named validator
   * @param name The name of the validator to use
   * @param value The value to validate
   * @returns The validation result
   */
  validate(name: string, value: any): ValidationResult {
    const validator = this.getValidator(name);
    
    if (!validator) {
      return {
        isValid: false,
        errors: [`Validator '${name}' not found`]
      };
    }
    
    return validator.validate(value);
  }
}

/**
 * String validator
 */
export class StringValidator extends BaseValidator<string> {
  private minLength?: number;
  private maxLength?: number;
  private pattern?: RegExp;
  
  /**
   * Creates a new string validator
   * @param options The validator options
   */
  constructor(options: {
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
  } = {}) {
    super();
    this.minLength = options.minLength;
    this.maxLength = options.maxLength;
    this.pattern = options.pattern;
  }
  
  /**
   * Validates a string
   * @param value The string to validate
   * @returns The validation result
   */
  validate(value: string): ValidationResult {
    const errors: string[] = [];
    
    // Check if the value is a string
    if (typeof value !== 'string') {
      errors.push('Value must be a string');
      return this.createFailureResult(errors);
    }
    
    // Check minimum length
    if (this.minLength !== undefined && value.length < this.minLength) {
      errors.push(`Value must be at least ${this.minLength} characters long`);
    }
    
    // Check maximum length
    if (this.maxLength !== undefined && value.length > this.maxLength) {
      errors.push(`Value must be at most ${this.maxLength} characters long`);
    }
    
    // Check pattern
    if (this.pattern !== undefined && !this.pattern.test(value)) {
      errors.push(`Value must match pattern ${this.pattern}`);
    }
    
    return errors.length === 0
      ? this.createSuccessResult()
      : this.createFailureResult(errors);
  }
}

/**
 * Number validator
 */
export class NumberValidator extends BaseValidator<number> {
  private min?: number;
  private max?: number;
  private integer?: boolean;
  
  /**
   * Creates a new number validator
   * @param options The validator options
   */
  constructor(options: {
    min?: number;
    max?: number;
    integer?: boolean;
  } = {}) {
    super();
    this.min = options.min;
    this.max = options.max;
    this.integer = options.integer;
  }
  
  /**
   * Validates a number
   * @param value The number to validate
   * @returns The validation result
   */
  validate(value: number): ValidationResult {
    const errors: string[] = [];
    
    // Check if the value is a number
    if (typeof value !== 'number' || isNaN(value)) {
      errors.push('Value must be a number');
      return this.createFailureResult(errors);
    }
    
    // Check minimum value
    if (this.min !== undefined && value < this.min) {
      errors.push(`Value must be at least ${this.min}`);
    }
    
    // Check maximum value
    if (this.max !== undefined && value > this.max) {
      errors.push(`Value must be at most ${this.max}`);
    }
    
    // Check if the value is an integer
    if (this.integer === true && !Number.isInteger(value)) {
      errors.push('Value must be an integer');
    }
    
    return errors.length === 0
      ? this.createSuccessResult()
      : this.createFailureResult(errors);
  }
} 