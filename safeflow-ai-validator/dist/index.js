"use strict";
/**
 * SafeFlow AI Validator
 * A tool to validate AI-generated code for security and integrity issues
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.performanceRules = exports.codeQualityRules = exports.codeStructureRules = exports.allIntegrityRules = exports.pathTraversalRules = exports.hardcodedCredentialsRules = exports.codeInjectionRules = exports.xssRules = exports.sqlInjectionRules = exports.allSecurityRules = exports.AICodeValidator = void 0;
exports.validateAICode = validateAICode;
exports.createValidator = createValidator;
// Export types
__exportStar(require("./types"), exports);
// Export validator
var validator_1 = require("./validator");
Object.defineProperty(exports, "AICodeValidator", { enumerable: true, get: function () { return validator_1.AICodeValidator; } });
// Export rules
var security_rules_1 = require("./rules/security-rules");
Object.defineProperty(exports, "allSecurityRules", { enumerable: true, get: function () { return security_rules_1.allSecurityRules; } });
Object.defineProperty(exports, "sqlInjectionRules", { enumerable: true, get: function () { return security_rules_1.sqlInjectionRules; } });
Object.defineProperty(exports, "xssRules", { enumerable: true, get: function () { return security_rules_1.xssRules; } });
Object.defineProperty(exports, "codeInjectionRules", { enumerable: true, get: function () { return security_rules_1.codeInjectionRules; } });
Object.defineProperty(exports, "hardcodedCredentialsRules", { enumerable: true, get: function () { return security_rules_1.hardcodedCredentialsRules; } });
Object.defineProperty(exports, "pathTraversalRules", { enumerable: true, get: function () { return security_rules_1.pathTraversalRules; } });
var integrity_rules_1 = require("./rules/integrity-rules");
Object.defineProperty(exports, "allIntegrityRules", { enumerable: true, get: function () { return integrity_rules_1.allIntegrityRules; } });
Object.defineProperty(exports, "codeStructureRules", { enumerable: true, get: function () { return integrity_rules_1.codeStructureRules; } });
Object.defineProperty(exports, "codeQualityRules", { enumerable: true, get: function () { return integrity_rules_1.codeQualityRules; } });
Object.defineProperty(exports, "performanceRules", { enumerable: true, get: function () { return integrity_rules_1.performanceRules; } });
// Export convenience functions
const validator_2 = require("./validator");
const security_rules_2 = require("./rules/security-rules");
const integrity_rules_2 = require("./rules/integrity-rules");
/**
 * Default validator instance with all rules
 */
const defaultValidator = new validator_2.AICodeValidator(security_rules_2.allSecurityRules, integrity_rules_2.allIntegrityRules);
/**
 * Validates AI-generated code using the default validator
 * @param code The code to validate
 * @param options Validation options
 * @returns The validation result
 */
function validateAICode(code, options) {
    return defaultValidator.validateCode(code, options);
}
/**
 * Creates a new validator with the specified rules
 * @param securityRules Security rules to use
 * @param integrityRules Integrity rules to use
 * @returns A new validator instance
 */
function createValidator(securityRules = security_rules_2.allSecurityRules, integrityRules = integrity_rules_2.allIntegrityRules) {
    return new validator_2.AICodeValidator(securityRules, integrityRules);
}
