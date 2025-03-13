/**
 * Basic usage example for SafeFlow AI Validator
 */
import { validateAICode, createValidator, sqlInjectionRules } from '../src';

// Example 1: Using the default validator
console.log('Example 1: Using the default validator');
const code1 = `
function processUserInput(input) {
  // This is vulnerable to SQL injection
  const query = "SELECT * FROM users WHERE name = '" + input + "'";
  return query;
}
`;

const result1 = validateAICode(code1);

console.log('Validation result:');
console.log(`  Valid: ${result1.isValid}`);
console.log(`  Errors: ${result1.errors.length}`);
console.log(`  Warnings: ${result1.warnings.length}`);

if (result1.errors.length > 0) {
  console.log('\nErrors:');
  result1.errors.forEach((error, index) => {
    console.log(`  ${index + 1}. [${error.severity.toUpperCase()}] ${error.message}`);
    if (error.location) {
      console.log(`     at line ${error.location.line}, column ${error.location.column}`);
    }
    if (error.suggestedFix) {
      console.log(`     Suggested fix: ${error.suggestedFix}`);
    }
  });
}

if (result1.warnings.length > 0) {
  console.log('\nWarnings:');
  result1.warnings.forEach((warning, index) => {
    console.log(`  ${index + 1}. ${warning.message}`);
    if (warning.suggestedImprovement) {
      console.log(`     Suggested improvement: ${warning.suggestedImprovement}`);
    }
  });
}

// Example 2: Creating a custom validator with specific rules
console.log('\nExample 2: Creating a custom validator with specific rules');
const customValidator = createValidator(sqlInjectionRules, []);

const code2 = `
function processUserInput(input) {
  // This uses eval, which is dangerous
  return eval(input);
}
`;

const result2 = customValidator.validateCode(code2);

console.log('Validation result:');
console.log(`  Valid: ${result2.isValid}`);
console.log(`  Errors: ${result2.errors.length}`);
console.log(`  Warnings: ${result2.warnings.length}`);

if (result2.errors.length > 0) {
  console.log('\nErrors:');
  result2.errors.forEach((error, index) => {
    console.log(`  ${index + 1}. [${error.severity.toUpperCase()}] ${error.message}`);
  });
}

// Example 3: Validating code with no issues
console.log('\nExample 3: Validating code with no issues');
const code3 = `
function processUserInput(input) {
  // This is safe
  const sanitizedInput = sanitizeInput(input);
  const query = {
    text: "SELECT * FROM users WHERE name = $1",
    values: [sanitizedInput]
  };
  return query;
}

function sanitizeInput(input) {
  // Implement proper sanitization
  return input.replace(/[^\w\s]/gi, '');
}
`;

const result3 = validateAICode(code3);

console.log('Validation result:');
console.log(`  Valid: ${result3.isValid}`);
console.log(`  Errors: ${result3.errors.length}`);
console.log(`  Warnings: ${result3.warnings.length}`); 