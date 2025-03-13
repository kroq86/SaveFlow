/**
 * Code generator for the SafeFlow framework
 * Automatically generates boilerplate code for common infrastructure tasks
 */
import { CodeTemplate } from '../core/types';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Interface for code generators
 */
export interface ICodeGenerator {
  /**
   * Generates code from a template
   * @param template The template to use
   * @param variables The variables to replace in the template
   * @returns The generated code
   */
  generateCode(template: CodeTemplate, variables: Record<string, string>): string;
  
  /**
   * Saves generated code to a file
   * @param code The code to save
   * @param filePath The path to save the code to
   * @returns A promise that resolves when the code is saved
   */
  saveCode(code: string, filePath: string): Promise<void>;
  
  /**
   * Registers a new template
   * @param template The template to register
   */
  registerTemplate(template: CodeTemplate): void;
  
  /**
   * Gets a template by name
   * @param name The name of the template to get
   * @returns The template or undefined if not found
   */
  getTemplate(name: string): CodeTemplate | undefined;
}

/**
 * Implementation of the code generator
 */
export class CodeGenerator implements ICodeGenerator {
  private templates: Map<string, CodeTemplate> = new Map();
  
  /**
   * Creates a new code generator
   * @param initialTemplates Initial templates to register
   */
  constructor(initialTemplates: CodeTemplate[] = []) {
    initialTemplates.forEach(template => this.registerTemplate(template));
  }
  
  /**
   * Generates code from a template
   * @param template The template to use
   * @param variables The variables to replace in the template
   * @returns The generated code
   */
  generateCode(template: CodeTemplate, variables: Record<string, string>): string {
    let code = template.template;
    
    // Replace variables in the template
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'g');
      code = code.replace(regex, value);
    });
    
    return code;
  }
  
  /**
   * Saves generated code to a file
   * @param code The code to save
   * @param filePath The path to save the code to
   * @returns A promise that resolves when the code is saved
   */
  async saveCode(code: string, filePath: string): Promise<void> {
    // Create the directory if it doesn't exist
    const directory = path.dirname(filePath);
    await fs.promises.mkdir(directory, { recursive: true });
    
    // Write the code to the file
    await fs.promises.writeFile(filePath, code, 'utf-8');
  }
  
  /**
   * Registers a new template
   * @param template The template to register
   */
  registerTemplate(template: CodeTemplate): void {
    this.templates.set(template.name, template);
  }
  
  /**
   * Gets a template by name
   * @param name The name of the template to get
   * @returns The template or undefined if not found
   */
  getTemplate(name: string): CodeTemplate | undefined {
    return this.templates.get(name);
  }
}

/**
 * Predefined templates for common code patterns
 */
export const predefinedTemplates: CodeTemplate[] = [
  {
    name: 'crud-class',
    description: 'A CRUD operations class',
    template: `/**
 * CRUD operations for {{ entityName }}
 */
import { {{ entityName }} } from '../models/{{ entityName }}';
import { CRUDOperations } from 'safeflow';
import { TransactionManager } from 'safeflow';

/**
 * CRUD operations for {{ entityName }}
 */
export class {{ entityName }}Operations extends CRUDOperations<{{ entityName }}> {
  /**
   * Creates a new {{ entityName }} operations instance
   * @param transactionManager The transaction manager to use
   */
  constructor(transactionManager: TransactionManager) {
    super(transactionManager);
  }
  
  // Add custom methods here
}`,
    variables: {
      entityName: 'Entity name (e.g. User)'
    }
  },
  {
    name: 'reactive-component',
    description: 'A reactive component',
    template: `/**
 * Reactive component for {{ componentName }}
 */
import { BaseSubject, Observer } from 'safeflow';

/**
 * {{ componentName }} component
 */
export class {{ componentName }} extends BaseSubject {
  // Add properties here
  
  /**
   * Creates a new {{ componentName }} instance
   */
  constructor() {
    super();
  }
  
  // Add methods here
}`,
    variables: {
      componentName: 'Component name (e.g. UserProfile)'
    }
  }
]; 