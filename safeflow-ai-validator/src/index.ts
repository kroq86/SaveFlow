/**
 * SafeFlow AI Validator
 * A tool to validate AI-generated code for security and integrity issues
 */

// Export types
export * from './types';

// Export validator
export { AICodeValidator } from './validator';

// Export rules
export { 
  allSecurityRules,
  sqlInjectionRules,
  xssRules,
  codeInjectionRules,
  hardcodedCredentialsRules,
  pathTraversalRules
} from './rules/security-rules';

export {
  allIntegrityRules,
  codeStructureRules,
  codeQualityRules,
  performanceRules
} from './rules/integrity-rules';

// Export convenience functions
import { AICodeValidator } from './validator';
import { allSecurityRules } from './rules/security-rules';
import { allIntegrityRules } from './rules/integrity-rules';
import { ValidationOptions, ValidationResult } from './types';

/**
 * Default validator instance with all rules
 */
const defaultValidator = new AICodeValidator(allSecurityRules, allIntegrityRules);

/**
 * Validates AI-generated code using the default validator
 * @param code The code to validate
 * @param options Validation options
 * @returns The validation result
 */
export function validateAICode(code: string, options?: ValidationOptions): ValidationResult {
  return defaultValidator.validateCode(code, options);
}

/**
 * Creates a new validator with the specified rules
 * @param securityRules Security rules to use
 * @param integrityRules Integrity rules to use
 * @returns A new validator instance
 */
export function createValidator(securityRules = allSecurityRules, integrityRules = allIntegrityRules): AICodeValidator {
  return new AICodeValidator(securityRules, integrityRules);
} 