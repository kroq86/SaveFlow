#!/bin/bash

# Setup local SafeFlow packages for development

echo "Setting up local SafeFlow packages..."

# Build and link AI Validator
echo "Building and linking SafeFlow AI Validator..."
cd ../safeflow-ai-validator
npm run build
npm link

# Build and link Reactive System
echo "Building and linking SafeFlow Reactive System..."
cd ../safeflow-reactive
npm run build
npm link

# Link packages to the example app
echo "Linking packages to the example app..."
cd ../safeflow-example-app
npm link safeflow-ai-validator
npm link safeflow-reactive

# Install dependencies
echo "Installing dependencies..."
npm install

echo "Setup complete! You can now run the example app." 