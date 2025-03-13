# SafeFlow AI Validator

A powerful tool to validate AI-generated code for security and integrity issues.

## Features

- **Security Validation**: Detect common security vulnerabilities like SQL injection, XSS, code injection, and more
- **Integrity Validation**: Ensure code quality and structure with checks for balanced braces, infinite loops, and more
- **Detailed Reports**: Get comprehensive validation results with error locations and suggested fixes
- **Customizable Rules**: Use predefined rules or create your own to match your specific requirements
- **Simple API**: Easy-to-use API with both object-oriented and functional approaches

## Installation

```bash
npm install safeflow-ai-validator
```

## Quick Start

```typescript
import { validateAICode } from 'safeflow-ai-validator';

// Code to validate
const code = `
function processUserInput(input) {
  // This is vulnerable to SQL injection
  const query = "SELECT * FROM users WHERE name = '" + input + "'";
  return query;
}
`;

// Validate the code
const result = validateAICode(code);

// Check if the code is valid
if (result.isValid) {
  console.log('Code is valid!');
} else {
  console.log('Code has issues:');
  
  // Display errors
  result.errors.forEach(error => {
    console.log(`- [${error.severity.toUpperCase()}] ${error.message}`);
    if (error.location) {
      console.log(`  at line ${error.location.line}, column ${error.location.column}`);
    }
    if (error.suggestedFix) {
      console.log(`  Suggested fix: ${error.suggestedFix}`);
    }
  });
  
  // Display warnings
  result.warnings.forEach(warning => {
    console.log(`- Warning: ${warning.message}`);
    if (warning.suggestedImprovement) {
      console.log(`  Suggested improvement: ${warning.suggestedImprovement}`);
    }
  });
}
```

## Advanced Usage

### Creating a Custom Validator

```typescript
import { 
  createValidator, 
  sqlInjectionRules, 
  xssRules, 
  codeStructureRules 
} from 'safeflow-ai-validator';

// Create a validator with specific rules
const validator = createValidator(
  [...sqlInjectionRules, ...xssRules], // Security rules
  codeStructureRules                   // Integrity rules
);

// Validate code with the custom validator
const result = validator.validateCode(code);
```

### Creating Custom Rules

```typescript
import { SecurityRule, IntegrityRule, createValidator } from 'safeflow-ai-validator';

// Create a custom security rule
const mySecurityRule: SecurityRule = {
  id: 'custom-rule-001',
  name: 'No Alert Statements',
  description: 'Detects alert statements which should not be used in production',
  pattern: /alert\s*\(/g,
  severity: 'medium',
  message: 'Alert statement detected',
  suggestedFix: 'Use a proper logging mechanism instead of alert'
};

// Create a custom integrity rule
const myIntegrityRule: IntegrityRule = {
  id: 'custom-rule-002',
  name: 'Max Line Length',
  description: 'Ensures lines are not too long',
  check: (code: string) => {
    const lines = code.split('\n');
    return !lines.some(line => line.length > 100);
  },
  message: 'Some lines are too long (> 100 characters)',
  suggestedImprovement: 'Break long lines into multiple lines for better readability'
};

// Create a validator with custom rules
const validator = createValidator([mySecurityRule], [myIntegrityRule]);
```

### Validation Options

```typescript
import { validateAICode } from 'safeflow-ai-validator';

const result = validateAICode(code, {
  includeLineNumbers: true,      // Include line numbers in the results
  includeSuggestedFixes: true,   // Include suggested fixes in the results
  minSeverity: 'medium',         // Only include issues with medium severity or higher
  maxErrors: 10                  // Limit the number of errors to 10
});
```

## Available Rules

### Security Rules

- **SQL Injection**: Detect SQL injection vulnerabilities
- **Cross-Site Scripting (XSS)**: Detect XSS vulnerabilities
- **Code Injection**: Detect code injection vulnerabilities (eval, Function constructor, etc.)
- **Hardcoded Credentials**: Detect hardcoded passwords, API keys, and secrets
- **Path Traversal**: Detect path traversal vulnerabilities

### Integrity Rules

- **Code Structure**: Ensure code has balanced braces, no infinite loops, etc.
- **Code Quality**: Detect empty catch blocks, console.log statements, TODO comments, etc.
- **Performance**: Detect array creation inside loops, function declarations inside loops, etc.

## License

MIT 