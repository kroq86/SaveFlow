"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allIntegrityRules = exports.performanceRules = exports.codeQualityRules = exports.codeStructureRules = void 0;
/**
 * Code structure rules
 */
exports.codeStructureRules = [
    {
        id: 'code-structure-001',
        name: 'Balanced Braces',
        description: 'Checks if braces, parentheses, and brackets are balanced',
        check: (code) => {
            const stack = [];
            const pairs = {
                '}': '{',
                ')': '(',
                ']': '['
            };
            // Skip strings and comments
            let inSingleQuote = false;
            let inDoubleQuote = false;
            let inTemplateString = false;
            let inLineComment = false;
            let inBlockComment = false;
            for (let i = 0; i < code.length; i++) {
                const char = code[i];
                const nextChar = i < code.length - 1 ? code[i + 1] : '';
                // Handle string literals and comments
                if (char === "'" && !inDoubleQuote && !inTemplateString && !inLineComment && !inBlockComment) {
                    // Check if it's escaped
                    if (i > 0 && code[i - 1] === '\\') {
                        // Escaped quote, ignore
                    }
                    else {
                        inSingleQuote = !inSingleQuote;
                    }
                    continue;
                }
                if (char === '"' && !inSingleQuote && !inTemplateString && !inLineComment && !inBlockComment) {
                    // Check if it's escaped
                    if (i > 0 && code[i - 1] === '\\') {
                        // Escaped quote, ignore
                    }
                    else {
                        inDoubleQuote = !inDoubleQuote;
                    }
                    continue;
                }
                if (char === '`' && !inSingleQuote && !inDoubleQuote && !inLineComment && !inBlockComment) {
                    // Check if it's escaped
                    if (i > 0 && code[i - 1] === '\\') {
                        // Escaped backtick, ignore
                    }
                    else {
                        inTemplateString = !inTemplateString;
                    }
                    continue;
                }
                if (char === '/' && nextChar === '/' && !inSingleQuote && !inDoubleQuote && !inTemplateString && !inBlockComment) {
                    inLineComment = true;
                    i++; // Skip the next character
                    continue;
                }
                if (char === '/' && nextChar === '*' && !inSingleQuote && !inDoubleQuote && !inTemplateString && !inLineComment) {
                    inBlockComment = true;
                    i++; // Skip the next character
                    continue;
                }
                if (char === '\n' && inLineComment) {
                    inLineComment = false;
                    continue;
                }
                if (char === '*' && nextChar === '/' && inBlockComment) {
                    inBlockComment = false;
                    i++; // Skip the next character
                    continue;
                }
                // Skip if we're in a string or comment
                if (inSingleQuote || inDoubleQuote || inTemplateString || inLineComment || inBlockComment) {
                    continue;
                }
                // Check braces, parentheses, and brackets
                if ('{(['.includes(char)) {
                    stack.push(char);
                }
                else if ('})]'.includes(char)) {
                    if (stack.pop() !== pairs[char]) {
                        return false;
                    }
                }
            }
            return stack.length === 0;
        },
        message: 'Unbalanced braces, parentheses, or brackets detected',
        suggestedImprovement: 'Ensure all opening braces, parentheses, and brackets have matching closing ones'
    },
    {
        id: 'code-structure-002',
        name: 'No Infinite Loops',
        description: 'Checks for potential infinite loops',
        check: (code) => {
            // This is a simplified check and may have false positives/negatives
            const infiniteLoopPatterns = [
                /while\s*\(\s*true\s*\)/,
                /while\s*\(\s*1\s*\)/,
                /for\s*\(\s*;\s*;\s*\)/,
                /for\s*\(\s*;[^;]*true[^;]*;\s*\)/
            ];
            return !infiniteLoopPatterns.some(pattern => pattern.test(code));
        },
        message: 'Potential infinite loop detected',
        suggestedImprovement: 'Ensure all loops have a proper exit condition'
    }
];
/**
 * Code quality rules
 */
exports.codeQualityRules = [
    {
        id: 'code-quality-001',
        name: 'No Empty Catch Blocks',
        description: 'Checks for empty catch blocks',
        check: (code) => {
            const emptyCatchPattern = /catch\s*\([^)]*\)\s*\{\s*\}/g;
            return !emptyCatchPattern.test(code);
        },
        message: 'Empty catch block detected',
        suggestedImprovement: 'Handle errors properly in catch blocks or at least log them'
    },
    {
        id: 'code-quality-002',
        name: 'No Console Logs in Production Code',
        description: 'Checks for console.log statements in production code',
        check: (code) => {
            const consoleLogPattern = /console\.log\s*\(/g;
            return !consoleLogPattern.test(code);
        },
        message: 'console.log statement detected in production code',
        suggestedImprovement: 'Remove console.log statements from production code or use a proper logging library'
    },
    {
        id: 'code-quality-003',
        name: 'No TODO Comments',
        description: 'Checks for TODO comments',
        check: (code) => {
            const todoPattern = /\/\/\s*TODO|\/\*\s*TODO|<!--\s*TODO/gi;
            return !todoPattern.test(code);
        },
        message: 'TODO comment detected',
        suggestedImprovement: 'Address TODO comments before considering the code complete'
    }
];
/**
 * Performance rules
 */
exports.performanceRules = [
    {
        id: 'performance-001',
        name: 'No Array Inside Loops',
        description: 'Checks for array creation inside loops',
        check: (code) => {
            const loopPatterns = [
                /for\s*\([^{]*\)\s*\{[^}]*\[\s*\]/g,
                /while\s*\([^{]*\)\s*\{[^}]*\[\s*\]/g,
                /do\s*\{[^}]*\[\s*\][^}]*\}\s*while/g
            ];
            return !loopPatterns.some(pattern => pattern.test(code));
        },
        message: 'Array creation inside a loop detected',
        suggestedImprovement: 'Move array creation outside of loops to improve performance'
    },
    {
        id: 'performance-002',
        name: 'No Function Declaration Inside Loops',
        description: 'Checks for function declarations inside loops',
        check: (code) => {
            const loopPatterns = [
                /for\s*\([^{]*\)\s*\{[^}]*function\s+[a-zA-Z0-9_$]+\s*\(/g,
                /while\s*\([^{]*\)\s*\{[^}]*function\s+[a-zA-Z0-9_$]+\s*\(/g,
                /do\s*\{[^}]*function\s+[a-zA-Z0-9_$]+\s*\([^}]*\}\s*while/g
            ];
            return !loopPatterns.some(pattern => pattern.test(code));
        },
        message: 'Function declaration inside a loop detected',
        suggestedImprovement: 'Move function declarations outside of loops to improve performance'
    }
];
/**
 * All integrity rules
 */
exports.allIntegrityRules = [
    ...exports.codeStructureRules,
    ...exports.codeQualityRules,
    ...exports.performanceRules
];
