/**
 * SafeFlow AI Validator
 * A tool to validate AI-generated code for security and integrity issues
 */
export * from './types';
export { AICodeValidator } from './validator';
export { allSecurityRules, sqlInjectionRules, xssRules, codeInjectionRules, hardcodedCredentialsRules, pathTraversalRules } from './rules/security-rules';
export { allIntegrityRules, codeStructureRules, codeQualityRules, performanceRules } from './rules/integrity-rules';
import { AICodeValidator } from './validator';
import { ValidationOptions, ValidationResult } from './types';
/**
 * Validates AI-generated code using the default validator
 * @param code The code to validate
 * @param options Validation options
 * @returns The validation result
 */
export declare function validateAICode(code: string, options?: ValidationOptions): ValidationResult;
/**
 * Creates a new validator with the specified rules
 * @param securityRules Security rules to use
 * @param integrityRules Integrity rules to use
 * @returns A new validator instance
 */
export declare function createValidator(securityRules?: import("./types").SecurityRule[], integrityRules?: import("./types").IntegrityRule[]): AICodeValidator;
