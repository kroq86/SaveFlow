/**
 * Predefined security rules for the SafeFlow AI Validator
 */
import { SecurityRule } from '../types';
/**
 * SQL injection rules
 */
export declare const sqlInjectionRules: SecurityRule[];
/**
 * Cross-site scripting (XSS) rules
 */
export declare const xssRules: SecurityRule[];
/**
 * Code injection rules
 */
export declare const codeInjectionRules: SecurityRule[];
/**
 * Hardcoded credentials rules
 */
export declare const hardcodedCredentialsRules: SecurityRule[];
/**
 * Path traversal rules
 */
export declare const pathTraversalRules: SecurityRule[];
/**
 * All security rules
 */
export declare const allSecurityRules: SecurityRule[];
