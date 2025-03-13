#!/bin/bash

# Build and test the SafeFlow Reactive System

echo "Building SafeFlow Reactive System..."
npm run build

if [ $? -eq 0 ]; then
  echo "Build successful!"
  
  echo -e "\nRunning Todo App example..."
  npx ts-node examples/todo-app.ts
  
  if [ $? -eq 0 ]; then
    echo -e "\nExample ran successfully!"
    echo -e "\n✅ SafeFlow Reactive System is ready for use!"
    echo "Next steps:"
    echo "1. Publish to npm with: npm publish"
    echo "2. Integrate with other SafeFlow components"
    echo "3. Create more examples and documentation"
  else
    echo -e "\n❌ Example failed to run. Please check the errors above."
  fi
else
  echo -e "\n❌ Build failed. Please check the errors above."
fi 