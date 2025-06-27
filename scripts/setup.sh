#!/bin/bash
# Simple setup script to install NPM dependencies
# Usage: npm run setup

if [ ! -d node_modules ]; then
  echo "Installing dependencies..."
  npm install
else
  echo "Dependencies already installed"
fi
