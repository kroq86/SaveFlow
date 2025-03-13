const { execSync } = require('child_process');

try {
  console.log('Building the project...');
  execSync('npx tsc', { stdio: 'inherit' });
  console.log('Project built successfully!');
} catch (error) {
  console.error('Error building the project:', error.message);
  process.exit(1);
} 