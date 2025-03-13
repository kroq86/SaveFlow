/**
 * Test file to check imports
 */

// Import from core
import { Data, ID, TransactionStatus } from '../core/types';
import { Transactional, Observable, Validate } from '../core/decorators';

// Import from transaction
import { TransactionManager, ITransactionManager } from '../transaction/transaction-manager';
import { getTransactionManager, applyTransactional } from '../transaction/transactional';

// Import from reactive
import { Observer, BaseObserver } from '../reactive/observer';
import { Subject, BaseSubject, ReactiveProperty } from '../reactive/subject';

// Import from infrastructure
import { ICRUDOperations, CRUDOperations } from '../infrastructure/crud-operations';
import { ICodeGenerator, CodeGenerator, predefinedTemplates } from '../infrastructure/code-generator';

// Import from validation
import { IValidator, BaseValidator, ValidatorRegistry, StringValidator, NumberValidator } from '../validation/validator';
import { IAIOutputValidator, AIOutputValidator, SecurityRule, IntegrityRule, predefinedSecurityRules, predefinedIntegrityRules } from '../validation/ai-output-validator';

// Test function to verify imports
function testImports() {
  console.log('All imports are working!');
  
  // Create instances of imported classes
  const transactionManager = new TransactionManager();
  const subject = new class extends BaseSubject<string> {};
  const observer = new class extends BaseObserver<string> {
    protected onUpdate(propertyName: string, newValue: string, oldValue: string): void {
      console.log(`${propertyName} changed from ${oldValue} to ${newValue}`);
    }
  };
  
  // Register the observer with the subject
  subject.registerObserver(observer);
  
  // Notify observers of a change
  subject.notifyObservers('test', 'new value', 'old value');
  
  // Create a reactive property
  const property = new ReactiveProperty<string>('initial value');
  
  // Subscribe to changes
  property.observable.subscribe(value => {
    console.log(`Property changed to ${value}`);
  });
  
  // Change the property value
  property.value = 'new value';
  
  // Create a validator
  const validator = new StringValidator({ minLength: 3, maxLength: 10 });
  
  // Validate a value
  const result = validator.validate('test');
  console.log(`Validation result: ${result.isValid}`);
  
  // Create an AI output validator
  const aiValidator = new AIOutputValidator(predefinedSecurityRules, predefinedIntegrityRules);
  
  // Validate some code
  const codeResult = aiValidator.validateCode('console.log("Hello, world!");');
  console.log(`Code validation result: ${codeResult.isValid}`);
  
  // Create a code generator
  const codeGenerator = new CodeGenerator(predefinedTemplates);
  
  // Generate some code
  const code = codeGenerator.generateCode(
    predefinedTemplates[0],
    { entityName: 'User' }
  );
  console.log(`Generated code: ${code.substring(0, 50)}...`);
}

// Run the test
testImports(); 