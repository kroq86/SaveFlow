/**
 * Core types for the SafeFlow AI Validator
 */

/**
 * Represents a validation result
 */
export interface ValidationResult {
  /**
   * Whether the validation passed
   */
  isValid: boolean;
  
  /**
   * Validation errors, if any
   */
  errors: ValidationError[];
  
  /**
   * Warnings that don't cause validation to fail
   */
  warnings: ValidationWarning[];
}

/**
 * Represents a validation error
 */
export interface ValidationError {
  /**
   * Error code
   */
  code: string;
  
  /**
   * Error message
   */
  message: string;
  
  /**
   * Severity of the error
   */
  severity: 'low' | 'medium' | 'high' | 'critical';
  
  /**
   * Location of the error in the code
   */
  location?: CodeLocation;
  
  /**
   * Suggested fix for the error
   */
  suggestedFix?: string;
}

/**
 * Represents a validation warning
 */
export interface ValidationWarning {
  /**
   * Warning code
   */
  code: string;
  
  /**
   * Warning message
   */
  message: string;
  
  /**
   * Location of the warning in the code
   */
  location?: CodeLocation;
  
  /**
   * Suggested improvement
   */
  suggestedImprovement?: string;
}

/**
 * Represents a location in code
 */
export interface CodeLocation {
  /**
   * Line number (1-based)
   */
  line: number;
  
  /**
   * Column number (1-based)
   */
  column: number;
  
  /**
   * Length of the problematic code
   */
  length?: number;
}

/**
 * Security rule for AI-generated code
 */
export interface SecurityRule {
  /**
   * The ID of the rule
   */
  id: string;
  
  /**
   * The name of the rule
   */
  name: string;
  
  /**
   * The description of the rule
   */
  description: string;
  
  /**
   * The pattern to check for
   */
  pattern: RegExp;
  
  /**
   * The severity of the rule
   */
  severity: 'low' | 'medium' | 'high' | 'critical';
  
  /**
   * The message to display when the rule is violated
   */
  message: string;
  
  /**
   * The suggested fix for the rule violation
   */
  suggestedFix?: string;
}

/**
 * Integrity rule for AI-generated code
 */
export interface IntegrityRule {
  /**
   * The ID of the rule
   */
  id: string;
  
  /**
   * The name of the rule
   */
  name: string;
  
  /**
   * The description of the rule
   */
  description: string;
  
  /**
   * The function to check the integrity
   */
  check: (code: string) => boolean;
  
  /**
   * The message to display when the rule is violated
   */
  message: string;
  
  /**
   * The suggested improvement for the rule violation
   */
  suggestedImprovement?: string;
}

/**
 * Options for validating code
 */
export interface ValidationOptions {
  /**
   * Whether to include line numbers in the validation results
   */
  includeLineNumbers?: boolean;
  
  /**
   * Whether to include suggested fixes in the validation results
   */
  includeSuggestedFixes?: boolean;
  
  /**
   * Minimum severity level to include in the validation results
   */
  minSeverity?: 'low' | 'medium' | 'high' | 'critical';
  
  /**
   * Maximum number of errors to include in the validation results
   */
  maxErrors?: number;
} 