/**
 * Predefined security rules for the SafeFlow AI Validator
 */
import { SecurityRule } from '../types';

/**
 * SQL injection rules
 */
export const sqlInjectionRules: SecurityRule[] = [
  {
    id: 'sql-injection-001',
    name: 'SQL Injection - String Concatenation',
    description: 'Detects potential SQL injection vulnerabilities through string concatenation',
    pattern: /(\b(select|insert|update|delete|drop|alter)\b.*\b(from|into|table)\b.*['"]\s*\+)/gi,
    severity: 'critical',
    message: 'Potential SQL injection vulnerability detected through string concatenation',
    suggestedFix: 'Use parameterized queries or prepared statements instead of string concatenation'
  },
  {
    id: 'sql-injection-002',
    name: 'SQL Injection - Exec',
    description: 'Detects potential SQL injection vulnerabilities through exec statements',
    pattern: /exec\s*\(\s*['"][^'"]*(\$|@|#|%|\{)/gi,
    severity: 'critical',
    message: 'Potential SQL injection vulnerability detected through exec statements',
    suggestedFix: 'Use parameterized queries or prepared statements instead of exec statements'
  },
  {
    id: 'sql-injection-003',
    name: 'SQL Injection - Template Literals',
    description: 'Detects potential SQL injection vulnerabilities through template literals',
    pattern: /(\b(select|insert|update|delete|drop|alter)\b.*\b(from|into|table)\b.*`[^`]*\$\{)/gi,
    severity: 'critical',
    message: 'Potential SQL injection vulnerability detected through template literals',
    suggestedFix: 'Use parameterized queries or prepared statements instead of template literals'
  }
];

/**
 * Cross-site scripting (XSS) rules
 */
export const xssRules: SecurityRule[] = [
  {
    id: 'xss-001',
    name: 'XSS - innerHTML',
    description: 'Detects potential XSS vulnerabilities through innerHTML',
    pattern: /\.innerHTML\s*=\s*([^;]*\+|`[^`]*\$\{)/gi,
    severity: 'high',
    message: 'Potential XSS vulnerability detected through innerHTML',
    suggestedFix: 'Use textContent instead of innerHTML, or sanitize the input'
  },
  {
    id: 'xss-002',
    name: 'XSS - document.write',
    description: 'Detects potential XSS vulnerabilities through document.write',
    pattern: /document\.write\s*\(\s*([^)]*\+|`[^`]*\$\{)/gi,
    severity: 'high',
    message: 'Potential XSS vulnerability detected through document.write',
    suggestedFix: 'Avoid using document.write, especially with user input'
  },
  {
    id: 'xss-003',
    name: 'XSS - Dangerous DOM properties',
    description: 'Detects potential XSS vulnerabilities through dangerous DOM properties',
    pattern: /\.(outerHTML|insertAdjacentHTML)\s*=?\s*([^;]*\+|`[^`]*\$\{)/gi,
    severity: 'high',
    message: 'Potential XSS vulnerability detected through dangerous DOM properties',
    suggestedFix: 'Use safer alternatives or sanitize the input'
  }
];

/**
 * Code injection rules
 */
export const codeInjectionRules: SecurityRule[] = [
  {
    id: 'code-injection-001',
    name: 'Code Injection - eval',
    description: 'Detects potential code injection vulnerabilities through eval',
    pattern: /\beval\s*\(\s*([^)]*\+|`[^`]*\$\{|[^)]*input|[^)]*param|[^)]*arg)/gi,
    severity: 'critical',
    message: 'Potential code injection vulnerability detected through eval',
    suggestedFix: 'Avoid using eval, especially with user input'
  },
  {
    id: 'code-injection-002',
    name: 'Code Injection - Function constructor',
    description: 'Detects potential code injection vulnerabilities through Function constructor',
    pattern: /new\s+Function\s*\(\s*([^)]*\+|`[^`]*\$\{|[^)]*input|[^)]*param|[^)]*arg)/gi,
    severity: 'critical',
    message: 'Potential code injection vulnerability detected through Function constructor',
    suggestedFix: 'Avoid using the Function constructor, especially with user input'
  },
  {
    id: 'code-injection-003',
    name: 'Code Injection - setTimeout/setInterval with strings',
    description: 'Detects potential code injection vulnerabilities through setTimeout/setInterval with strings',
    pattern: /\b(setTimeout|setInterval)\s*\(\s*(['"`])/gi,
    severity: 'high',
    message: 'Potential code injection vulnerability detected through setTimeout/setInterval with strings',
    suggestedFix: 'Use function references instead of strings with setTimeout/setInterval'
  }
];

/**
 * Hardcoded credentials rules
 */
export const hardcodedCredentialsRules: SecurityRule[] = [
  {
    id: 'hardcoded-credentials-001',
    name: 'Hardcoded Credentials - Password',
    description: 'Detects hardcoded passwords',
    pattern: /\b(password|passwd|pwd)\s*=\s*['"`][^'"`]{3,}['"`]/gi,
    severity: 'high',
    message: 'Hardcoded password detected',
    suggestedFix: 'Use environment variables or a secure credential store instead of hardcoding passwords'
  },
  {
    id: 'hardcoded-credentials-002',
    name: 'Hardcoded Credentials - API Key',
    description: 'Detects hardcoded API keys',
    pattern: /\b(api[_-]?key|apikey|token)\s*=\s*['"`][^'"`]{10,}['"`]/gi,
    severity: 'high',
    message: 'Hardcoded API key detected',
    suggestedFix: 'Use environment variables or a secure credential store instead of hardcoding API keys'
  },
  {
    id: 'hardcoded-credentials-003',
    name: 'Hardcoded Credentials - Secret',
    description: 'Detects hardcoded secrets',
    pattern: /\b(secret|private[_-]?key)\s*=\s*['"`][^'"`]{10,}['"`]/gi,
    severity: 'high',
    message: 'Hardcoded secret detected',
    suggestedFix: 'Use environment variables or a secure credential store instead of hardcoding secrets'
  }
];

/**
 * Path traversal rules
 */
export const pathTraversalRules: SecurityRule[] = [
  {
    id: 'path-traversal-001',
    name: 'Path Traversal - File System Operations',
    description: 'Detects potential path traversal vulnerabilities in file system operations',
    pattern: /\b(fs|require)\.([a-zA-Z]+File|[a-zA-Z]+Sync|[a-zA-Z]+Directory)\s*\(\s*([^)]*\+|`[^`]*\$\{|[^)]*input|[^)]*param|[^)]*arg)/gi,
    severity: 'high',
    message: 'Potential path traversal vulnerability detected in file system operations',
    suggestedFix: 'Validate and sanitize file paths, use path.normalize() and restrict to specific directories'
  },
  {
    id: 'path-traversal-002',
    name: 'Path Traversal - Path Concatenation',
    description: 'Detects potential path traversal vulnerabilities through path concatenation',
    pattern: /\b(path\.join|path\.resolve)\s*\(\s*([^)]*\+|`[^`]*\$\{|[^)]*input|[^)]*param|[^)]*arg)/gi,
    severity: 'medium',
    message: 'Potential path traversal vulnerability detected through path concatenation',
    suggestedFix: 'Validate and sanitize file paths, use path.normalize() and restrict to specific directories'
  }
];

/**
 * All security rules
 */
export const allSecurityRules: SecurityRule[] = [
  ...sqlInjectionRules,
  ...xssRules,
  ...codeInjectionRules,
  ...hardcodedCredentialsRules,
  ...pathTraversalRules
]; 