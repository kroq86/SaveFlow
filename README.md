# SafeFlow

A development framework designed to ensure secure, efficient, and maintainable applications by integrating transactional guarantees, a reactive system, and strong type safety.

## Key Features

1. **Transactional Guarantees**  
   - Implements a transaction manager to ensure that all operations occur within atomic transactions
   - Maintains data consistency and prevents corruption
   - Provides a simple API for executing code within transactions

2. **Reactive System**  
   - Uses RxJS and a custom observer pattern implementation
   - Manages data dependencies and updates automatically
   - Reduces the complexity of state management

3. **Type Safety**  
   - Leverages TypeScript to ensure that all code adheres to strict type definitions
   - Reduces runtime errors through compile-time checking

4. **Automated Infrastructure Generation**  
   - Provides tools that automatically generate boilerplate code for common infrastructure tasks
   - Minimizes the amount of code developers need to write
   - Reduces potential errors

5. **AI Output Validation**  
   - Includes a module that validates AI-generated code against predefined security and integrity standards
   - Ensures that AI-generated code aligns with best practices
   - Prevents the introduction of vulnerabilities

## Installation

```bash
npm install safeflow
```

## Usage

### Basic Example

```typescript
import { 
  TransactionManager, 
  BaseSubject, 
  Observer, 
  Transactional 
} from 'safeflow';

// Create a transaction manager
const transactionManager = new TransactionManager();

// Define a data model
class User {
  id: number;
  name: string;
  
  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }
}

// Create a service with transactional methods
class UserService {
  private users: Map<number, User> = new Map();
  
  constructor(private transactionManager: TransactionManager) {}
  
  @Transactional()
  async createUser(user: User): Promise<User> {
    if (this.users.has(user.id)) {
      throw new Error(`User with ID ${user.id} already exists`);
    }
    
    this.users.set(user.id, user);
    return user;
  }
  
  @Transactional()
  async updateUser(id: number, name: string): Promise<User | undefined> {
    const user = this.users.get(id);
    
    if (!user) {
      return undefined;
    }
    
    user.name = name;
    this.users.set(id, user);
    
    return user;
  }
  
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
}

// Create an observer
class UserObserver implements Observer<User> {
  update(propertyName: string, newValue: User, oldValue: User): void {
    console.log(`User ${newValue.id} updated: ${propertyName} changed from ${oldValue[propertyName]} to ${newValue[propertyName]}`);
  }
}

// Use the service
async function main() {
  const userService = new UserService(transactionManager);
  
  try {
    // Create a user
    const user = await userService.createUser(new User(1, 'John Doe'));
    console.log('User created:', user);
    
    // Update the user
    const updatedUser = await userService.updateUser(1, 'Jane Doe');
    console.log('User updated:', updatedUser);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

main();
```

### Using the Code Generator

```typescript
import { CodeGenerator, predefinedTemplates } from 'safeflow';

// Create a code generator with predefined templates
const codeGenerator = new CodeGenerator(predefinedTemplates);

// Generate code from a template
const code = codeGenerator.generateCode(
  codeGenerator.getTemplate('crud-class')!,
  { entityName: 'User' }
);

// Save the code to a file
codeGenerator.saveCode(code, 'src/services/user-operations.ts');
```

### Using the AI Output Validator

```typescript
import { 
  AIOutputValidator, 
  predefinedSecurityRules, 
  predefinedIntegrityRules 
} from 'safeflow';

// Create an AI output validator with predefined rules
const validator = new AIOutputValidator(
  predefinedSecurityRules,
  predefinedIntegrityRules
);

// Validate AI-generated code
const code = `
function processUserInput(input) {
  // This is vulnerable to SQL injection
  const query = "SELECT * FROM users WHERE name = '" + input + "'";
  return query;
}
`;

const result = validator.validateCode(code);

if (!result.isValid) {
  console.error('Validation failed:');
  result.errors.forEach(error => console.error(`- ${error}`));
} else {
  console.log('Validation passed!');
}
```

## Documentation

For more detailed documentation, see the [API Reference](docs/api-reference.md).

## License

MIT 