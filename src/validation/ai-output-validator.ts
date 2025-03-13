/**
 * AI output validator for the SafeFlow framework
 * Validates AI-generated code against predefined security and integrity standards
 */
import { ValidationResult } from '../core/types';
import { BaseValidator } from './validator';

/**
 * Interface for AI output validators
 */
export interface IAIOutputValidator {
  /**
   * Validates AI-generated code
   * @param code The code to validate
   * @returns The validation result
   */
  validateCode(code: string): ValidationResult;
  
  /**
   * Validates AI-generated data
   * @param data The data to validate
   * @returns The validation result
   */
  validateData(data: any): ValidationResult;
  
  /**
   * Adds a security rule
   * @param rule The rule to add
   */
  addSecurityRule(rule: SecurityRule): void;
  
  /**
   * Adds an integrity rule
   * @param rule The rule to add
   */
  addIntegrityRule(rule: IntegrityRule): void;
}

/**
 * Security rule for AI-generated code
 */
export interface SecurityRule {
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
}

/**
 * Integrity rule for AI-generated code
 */
export interface IntegrityRule {
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
}

/**
 * Implementation of the AI output validator
 */
export class AIOutputValidator extends BaseValidator<string> implements IAIOutputValidator {
  private securityRules: SecurityRule[] = [];
  private integrityRules: IntegrityRule[] = [];
  
  /**
   * Creates a new AI output validator
   * @param securityRules Initial security rules
   * @param integrityRules Initial integrity rules
   */
  constructor(
    securityRules: SecurityRule[] = [],
    integrityRules: IntegrityRule[] = []
  ) {
    super();
    this.securityRules = [...securityRules];
    this.integrityRules = [...integrityRules];
  }
  
  /**
   * Validates AI-generated code
   * @param code The code to validate
   * @returns The validation result
   */
  validateCode(code: string): ValidationResult {
    return this.validate(code);
  }
  
  /**
   * Validates AI-generated data
   * @param data The data to validate
   * @returns The validation result
   */
  validateData(data: any): ValidationResult {
    // Convert data to string for validation
    const dataString = typeof data === 'string'
      ? data
      : JSON.stringify(data);
    
    return this.validate(dataString);
  }
  
  /**
   * Validates a value
   * @param value The value to validate
   * @returns The validation result
   */
  validate(value: string): ValidationResult {
    const errors: string[] = [];
    
    // Check security rules
    this.securityRules.forEach(rule => {
      if (rule.pattern.test(value)) {
        errors.push(`[${rule.severity.toUpperCase()}] ${rule.message}`);
      }
    });
    
    // Check integrity rules
    this.integrityRules.forEach(rule => {
      if (!rule.check(value)) {
        errors.push(rule.message);
      }
    });
    
    return errors.length === 0
      ? this.createSuccessResult()
      : this.createFailureResult(errors);
  }
  
  /**
   * Adds a security rule
   * @param rule The rule to add
   */
  addSecurityRule(rule: SecurityRule): void {
    this.securityRules.push(rule);
  }
  
  /**
   * Adds an integrity rule
   * @param rule The rule to add
   */
  addIntegrityRule(rule: IntegrityRule): void {
    this.integrityRules.push(rule);
  }
}

/**
 * Predefined security rules
 */
export const predefinedSecurityRules: SecurityRule[] = [
  {
    name: 'sql-injection',
    description: 'Detects potential SQL injection vulnerabilities',
    pattern: /(\b(select|insert|update|delete|drop|alter)\b.*\b(from|into|table)\b.*['"]\s*\+|exec\s*\(\s*['"])/i,
    severity: 'critical',
    message: 'Potential SQL injection vulnerability detected'
  },
  {
    name: 'xss',
    description: 'Detects potential cross-site scripting vulnerabilities',
    pattern: /(document\.write\s*\(\s*.*\)|innerHTML\s*=\s*.*\+)/i,
    severity: 'high',
    message: 'Potential cross-site scripting vulnerability detected'
  },
  {
    name: 'eval',
    description: 'Detects use of eval()',
    pattern: /\beval\s*\(/i,
    severity: 'high',
    message: 'Use of eval() detected, which can be dangerous'
  },
  {
    name: 'hardcoded-credentials',
    description: 'Detects hardcoded credentials',
    pattern: /(\bpassword\s*=\s*['"][^'"]+['"]|\bapikey\s*=\s*['"][^'"]+['"]|\bsecret\s*=\s*['"][^'"]+['"])/i,
    severity: 'high',
    message: 'Hardcoded credentials detected'
  }
];

/**
 * Predefined integrity rules
 */
export const predefinedIntegrityRules: IntegrityRule[] = [
  {
    name: 'balanced-braces',
    description: 'Checks if braces are balanced',
    check: (code: string) => {
      const stack: string[] = [];
      const pairs: Record<string, string> = {
        '}': '{',
        ')': '(',
        ']': '['
      };
      
      for (const char of code) {
        if ('{(['.includes(char)) {
          stack.push(char);
        } else if ('})]'.includes(char)) {
          if (stack.pop() !== pairs[char]) {
            return false;
          }
        }
      }
      
      return stack.length === 0;
    },
    message: 'Unbalanced braces, parentheses, or brackets detected'
  },
  {
    name: 'no-infinite-loops',
    description: 'Checks for potential infinite loops',
    check: (code: string) => {
      // This is a simplified check and may have false positives/negatives
      return !/(while\s*\(\s*true\s*\)|for\s*\(\s*;\s*;\s*\))/.test(code);
    },
    message: 'Potential infinite loop detected'
  }
]; 