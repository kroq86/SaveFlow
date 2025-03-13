#!/bin/bash

# Run the SafeFlow Project Management System

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

# Check if local packages are linked
if [ ! -L "node_modules/safeflow-reactive" ] || [ ! -L "node_modules/safeflow-ai-validator" ]; then
  echo "Linking local packages..."
  ./setup-local-packages.sh
fi

# Start the application
echo "Starting the application..."
npm start 