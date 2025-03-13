/**
 * Main validator class for the SafeFlow AI Validator
 */
import { 
  ValidationResult, 
  ValidationError, 
  ValidationWarning, 
  SecurityRule, 
  IntegrityRule,
  ValidationOptions,
  CodeLocation
} from './types';

/**
 * Default validation options
 */
const DEFAULT_OPTIONS: ValidationOptions = {
  includeLineNumbers: true,
  includeSuggestedFixes: true,
  minSeverity: 'low',
  maxErrors: 100
};

/**
 * Severity levels in order of increasing severity
 */
const SEVERITY_LEVELS = ['low', 'medium', 'high', 'critical'];

/**
 * AI Code Validator class
 */
export class AICodeValidator {
  private securityRules: SecurityRule[] = [];
  private integrityRules: IntegrityRule[] = [];
  
  /**
   * Creates a new AI Code Validator
   * @param securityRules Security rules to use
   * @param integrityRules Integrity rules to use
   */
  constructor(securityRules: SecurityRule[] = [], integrityRules: IntegrityRule[] = []) {
    // Ensure all security rule patterns are global
    this.securityRules = securityRules.map(rule => ({
      ...rule,
      pattern: this.ensureGlobalRegExp(rule.pattern)
    }));
    this.integrityRules = [...integrityRules];
  }
  
  /**
   * Adds a security rule
   * @param rule The security rule to add
   */
  addSecurityRule(rule: SecurityRule): void {
    this.securityRules.push({
      ...rule,
      pattern: this.ensureGlobalRegExp(rule.pattern)
    });
  }
  
  /**
   * Adds an integrity rule
   * @param rule The integrity rule to add
   */
  addIntegrityRule(rule: IntegrityRule): void {
    this.integrityRules.push(rule);
  }
  
  /**
   * Ensures a RegExp pattern is global
   * @param pattern The RegExp pattern
   * @returns A global RegExp pattern
   */
  private ensureGlobalRegExp(pattern: RegExp): RegExp {
    if (!pattern.global) {
      return new RegExp(pattern.source, pattern.flags + 'g');
    }
    return pattern;
  }
  
  /**
   * Validates code
   * @param code The code to validate
   * @param options Validation options
   * @returns The validation result
   */
  validateCode(code: string, options: ValidationOptions = {}): ValidationResult {
    // Merge options with defaults
    const mergedOptions: ValidationOptions = { ...DEFAULT_OPTIONS, ...options };
    
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];
    
    // Check security rules
    this.validateSecurityRules(code, errors, mergedOptions);
    
    // Check integrity rules
    this.validateIntegrityRules(code, errors, warnings, mergedOptions);
    
    // Sort errors by severity (most severe first)
    errors.sort((a, b) => {
      const aSeverityIndex = SEVERITY_LEVELS.indexOf(a.severity);
      const bSeverityIndex = SEVERITY_LEVELS.indexOf(b.severity);
      return bSeverityIndex - aSeverityIndex;
    });
    
    // Limit the number of errors
    if (mergedOptions.maxErrors && errors.length > mergedOptions.maxErrors) {
      errors.length = mergedOptions.maxErrors;
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }
  
  /**
   * Validates code against security rules
   * @param code The code to validate
   * @param errors Array to add errors to
   * @param options Validation options
   */
  private validateSecurityRules(code: string, errors: ValidationError[], options: ValidationOptions): void {
    const minSeverityIndex = options.minSeverity ? SEVERITY_LEVELS.indexOf(options.minSeverity) : 0;
    
    for (const rule of this.securityRules) {
      const ruleSeverityIndex = SEVERITY_LEVELS.indexOf(rule.severity);
      
      // Skip rules with severity below the minimum
      if (ruleSeverityIndex < minSeverityIndex) {
        continue;
      }
      
      // Check if the rule pattern matches the code
      const matches = Array.from(code.matchAll(rule.pattern));
      
      for (const match of matches) {
        const error: ValidationError = {
          code: rule.id,
          message: rule.message,
          severity: rule.severity
        };
        
        // Add location if requested
        if (options.includeLineNumbers && match.index !== undefined) {
          error.location = this.getLocationFromIndex(code, match.index);
        }
        
        // Add suggested fix if requested and available
        if (options.includeSuggestedFixes && rule.suggestedFix) {
          error.suggestedFix = rule.suggestedFix;
        }
        
        errors.push(error);
      }
    }
  }
  
  /**
   * Validates code against integrity rules
   * @param code The code to validate
   * @param errors Array to add errors to
   * @param warnings Array to add warnings to
   * @param options Validation options
   */
  private validateIntegrityRules(
    code: string, 
    errors: ValidationError[], 
    warnings: ValidationWarning[], 
    options: ValidationOptions
  ): void {
    for (const rule of this.integrityRules) {
      // Check if the rule is violated
      if (!rule.check(code)) {
        const warning: ValidationWarning = {
          code: rule.id,
          message: rule.message
        };
        
        // Add suggested improvement if available
        if (rule.suggestedImprovement) {
          warning.suggestedImprovement = rule.suggestedImprovement;
        }
        
        warnings.push(warning);
      }
    }
  }
  
  /**
   * Gets the line and column number from an index in the code
   * @param code The code
   * @param index The index in the code
   * @returns The line and column number
   */
  private getLocationFromIndex(code: string, index: number): CodeLocation {
    const lines = code.substring(0, index).split('\n');
    const line = lines.length;
    const column = lines[lines.length - 1].length + 1;
    
    return { line, column };
  }
} 