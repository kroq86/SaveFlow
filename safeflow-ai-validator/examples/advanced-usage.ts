/**
 * Advanced usage example for SafeFlow AI Validator
 * 
 * This example demonstrates how to:
 * 1. Create custom rules
 * 2. Validate code from a file
 * 3. Generate a detailed report
 * 4. Integrate with a simple AI code generation workflow
 */
import * as fs from 'fs';
import * as path from 'path';
import { 
  createValidator, 
  SecurityRule, 
  IntegrityRule,
  ValidationResult,
  ValidationError,
  ValidationWarning
} from '../src';

// Example 1: Creating custom rules
console.log('Example 1: Creating custom rules');

// Custom security rule to detect potential memory leaks in Node.js
const memoryLeakRule: SecurityRule = {
  id: 'custom-memory-leak-001',
  name: 'Potential Memory Leak',
  description: 'Detects patterns that might cause memory leaks in Node.js',
  pattern: /\b(on|addListener)\s*\(\s*(['"`][^'"`]+['"`])\s*,\s*function/g,
  severity: 'medium',
  message: 'Potential memory leak detected: event listener without corresponding removal',
  suggestedFix: 'Store the listener function in a variable and remove it with removeListener when no longer needed'
};

// Custom integrity rule to enforce maximum function length
const maxFunctionLengthRule: IntegrityRule = {
  id: 'custom-function-length-001',
  name: 'Maximum Function Length',
  description: 'Ensures functions are not too long',
  check: (code: string) => {
    const functionRegex = /function\s+[a-zA-Z0-9_$]*\s*\([^)]*\)\s*\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}/g;
    let match;
    while ((match = functionRegex.exec(code)) !== null) {
      const functionBody = match[1];
      const lines = functionBody.split('\n').length;
      if (lines > 20) {
        return false;
      }
    }
    return true;
  },
  message: 'Function exceeds maximum recommended length of 20 lines',
  suggestedImprovement: 'Break down large functions into smaller, more focused functions'
};

// Create a validator with our custom rules
const customValidator = createValidator([memoryLeakRule], [maxFunctionLengthRule]);

// Example code to validate
const nodeJsCode = `
const EventEmitter = require('events');
const emitter = new EventEmitter();

// This might cause a memory leak
emitter.on('data', function(data) {
  console.log(data);
});

// This is a very long function
function processLargeDataSet(data) {
  let result = [];
  
  // Step 1: Initialize
  console.log('Initializing...');
  for (let i = 0; i < data.length; i++) {
    result.push({ id: i, value: data[i] });
  }
  
  // Step 2: Process
  console.log('Processing...');
  for (let i = 0; i < result.length; i++) {
    result[i].processed = true;
    result[i].timestamp = Date.now();
    result[i].hash = generateHash(result[i].value);
  }
  
  // Step 3: Filter
  console.log('Filtering...');
  result = result.filter(item => item.value > 0);
  
  // Step 4: Sort
  console.log('Sorting...');
  result.sort((a, b) => a.value - b.value);
  
  // Step 5: Format
  console.log('Formatting...');
  result = result.map(item => ({
    ...item,
    formattedValue: \`\${item.value.toFixed(2)}\`
  }));
  
  return result;
}

function generateHash(value) {
  return value.toString().split('').reduce((hash, char) => {
    return ((hash << 5) - hash) + char.charCodeAt(0);
  }, 0);
}
`;

// Validate the code
const result1 = customValidator.validateCode(nodeJsCode);

// Print the results
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

// Example 2: Simulating an AI code generation workflow
console.log('\nExample 2: Simulating an AI code generation workflow');

// Function to simulate AI code generation
function simulateAICodeGeneration(prompt: string): string {
  console.log(`Generating code for prompt: "${prompt}"...`);
  
  // In a real application, this would call an AI service
  // For this example, we'll return a hardcoded response with some issues
  if (prompt.includes('database')) {
    return `
function getUserData(userId) {
  // Connect to the database
  const connection = createDatabaseConnection();
  
  // This is vulnerable to SQL injection
  const query = "SELECT * FROM users WHERE id = '" + userId + "'";
  
  // Execute the query
  const results = connection.execute(query);
  
  // Close the connection
  connection.close();
  
  return results;
}

function createDatabaseConnection() {
  // In a real application, this would connect to a database
  // For this example, we'll just return a mock connection
  return {
    execute: (query) => {
      console.log("Executing query:", query);
      return { id: 1, name: "John Doe", email: "john@example.com" };
    },
    close: () => {
      console.log("Closing connection");
    }
  };
}
`;
  } else {
    return `
function processUserInput(input) {
  // This is safe
  const sanitizedInput = sanitizeInput(input);
  return sanitizedInput;
}

function sanitizeInput(input) {
  // Implement proper sanitization
  return input.replace(/[^\w\s]/gi, '');
}
`;
  }
}

// Function to validate AI-generated code
function validateAIGeneratedCode(prompt: string): { code: string, isValid: boolean, report: string } {
  // Generate code
  const generatedCode = simulateAICodeGeneration(prompt);
  
  // Validate the code
  const validationResult = customValidator.validateCode(generatedCode);
  
  // Generate a report
  const report = generateValidationReport(validationResult);
  
  return {
    code: generatedCode,
    isValid: validationResult.isValid,
    report
  };
}

// Function to generate a validation report
function generateValidationReport(result: ValidationResult): string {
  let report = '=== Validation Report ===\n\n';
  
  report += `Status: ${result.isValid ? 'PASSED' : 'FAILED'}\n`;
  report += `Errors: ${result.errors.length}\n`;
  report += `Warnings: ${result.warnings.length}\n\n`;
  
  if (result.errors.length > 0) {
    report += 'ERRORS:\n';
    result.errors.forEach((error, index) => {
      report += `${index + 1}. [${error.severity.toUpperCase()}] ${error.message}\n`;
      if (error.location) {
        report += `   at line ${error.location.line}, column ${error.location.column}\n`;
      }
      if (error.suggestedFix) {
        report += `   Suggested fix: ${error.suggestedFix}\n`;
      }
      report += '\n';
    });
  }
  
  if (result.warnings.length > 0) {
    report += 'WARNINGS:\n';
    result.warnings.forEach((warning, index) => {
      report += `${index + 1}. ${warning.message}\n`;
      if (warning.suggestedImprovement) {
        report += `   Suggested improvement: ${warning.suggestedImprovement}\n`;
      }
      report += '\n';
    });
  }
  
  return report;
}

// Test with a prompt that will generate vulnerable code
const prompt1 = "Create a function to get user data from a database";
const result2 = validateAIGeneratedCode(prompt1);

console.log(`Generated code ${result2.isValid ? 'passed' : 'failed'} validation.`);
console.log('\nValidation Report:');
console.log(result2.report);

// Test with a prompt that will generate safe code
const prompt2 = "Create a function to process user input safely";
const result3 = validateAIGeneratedCode(prompt2);

console.log(`Generated code ${result3.isValid ? 'passed' : 'failed'} validation.`);
console.log('\nValidation Report:');
console.log(result3.report); 