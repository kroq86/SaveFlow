const { execSync } = require('child_process');
const fs = require('fs');

try {
  console.log('Running advanced example...');
  const output = execSync('npx ts-node examples/advanced-usage.ts', { encoding: 'utf8' });
  
  console.log('Writing output to file...');
  fs.writeFileSync('advanced-example-output.txt', output);
  
  console.log('Advanced example ran successfully!');
  console.log('Results saved to advanced-example-output.txt');
} catch (error) {
  console.error('Error running advanced example:', error.message);
  process.exit(1);
} 