/**
 * Main validator class for the SafeFlow AI Validator
 */
import { ValidationResult, SecurityRule, IntegrityRule, ValidationOptions } from './types';
/**
 * AI Code Validator class
 */
export declare class AICodeValidator {
    private securityRules;
    private integrityRules;
    /**
     * Creates a new AI Code Validator
     * @param securityRules Security rules to use
     * @param integrityRules Integrity rules to use
     */
    constructor(securityRules?: SecurityRule[], integrityRules?: IntegrityRule[]);
    /**
     * Adds a security rule
     * @param rule The security rule to add
     */
    addSecurityRule(rule: SecurityRule): void;
    /**
     * Adds an integrity rule
     * @param rule The integrity rule to add
     */
    addIntegrityRule(rule: IntegrityRule): void;
    /**
     * Ensures a RegExp pattern is global
     * @param pattern The RegExp pattern
     * @returns A global RegExp pattern
     */
    private ensureGlobalRegExp;
    /**
     * Validates code
     * @param code The code to validate
     * @param options Validation options
     * @returns The validation result
     */
    validateCode(code: string, options?: ValidationOptions): ValidationResult;
    /**
     * Validates code against security rules
     * @param code The code to validate
     * @param errors Array to add errors to
     * @param options Validation options
     */
    private validateSecurityRules;
    /**
     * Validates code against integrity rules
     * @param code The code to validate
     * @param errors Array to add errors to
     * @param warnings Array to add warnings to
     * @param options Validation options
     */
    private validateIntegrityRules;
    /**
     * Gets the line and column number from an index in the code
     * @param code The code
     * @param index The index in the code
     * @returns The line and column number
     */
    private getLocationFromIndex;
}
