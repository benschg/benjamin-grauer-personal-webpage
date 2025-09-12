#!/bin/bash
# Development setup script for Benjamin Grauer's personal webpage

echo "🚀 Setting up development environment..."

# Check if we're in the right directory
if [ ! -f "package.json" ] && [ ! -d "frontend" ]; then
    echo "❌ Error: Run this script from the project root directory"
    exit 1
fi

echo "📦 Installing dependencies..."
cd frontend
if ! yarn install; then
    echo "❌ Error: Failed to install dependencies"
    exit 1
fi

echo "🎣 Setting up pre-commit hooks..."
cd ..
if ! git config core.hooksPath .husky; then
    echo "❌ Error: Failed to configure git hooks"
    exit 1
fi

echo "✅ Verifying setup..."
cd frontend

# Check if commands work
if yarn lint --help > /dev/null 2>&1; then
    echo "✅ ESLint is working"
else
    echo "❌ ESLint setup failed"
    exit 1
fi

if yarn type-check --help > /dev/null 2>&1; then
    echo "✅ TypeScript is working"
else
    echo "❌ TypeScript setup failed"
    exit 1
fi

if yarn format --help > /dev/null 2>&1; then
    echo "✅ Prettier is working"
else
    echo "❌ Prettier setup failed"
    exit 1
fi

echo ""
echo "🎉 Setup complete! You can now:"
echo "   yarn dev          # Start development server"
echo "   yarn build        # Build for production"
echo "   yarn test         # Run tests"
echo "   yarn lint:fix     # Fix linting issues"
echo "   yarn type-check   # Check TypeScript types"
echo "   yarn format       # Format code"
echo ""
echo "Pre-commit hooks are now active and will run automatically on git commit!"