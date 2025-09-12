# Development Setup Guide

This guide explains how to set up the development environment for this project.

## Prerequisites

- **Node.js** (v18 or higher)
- **Yarn** package manager
- **Git**

## Initial Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd benjamin-grauer-personal-webpage
   ```

2. **Install dependencies:**
   ```bash
   cd frontend
   yarn install
   ```

3. **Enable pre-commit hooks:**
   ```bash
   # This configures git to use our custom hooks directory
   git config core.hooksPath .husky
   ```

4. **Verify setup:**
   ```bash
   # Test that linting works
   yarn lint
   
   # Test that type checking works
   yarn type-check
   
   # Test that formatting works
   yarn format
   ```

## Pre-commit Hooks

This project uses pre-commit hooks to maintain code quality. The hooks will automatically run when you commit and will:

- **ESLint**: Check and auto-fix code quality issues
- **TypeScript**: Verify type correctness
- **Prettier**: Format code consistently

### What happens during commit:

✅ **If your code passes all checks**: Commit proceeds normally
❌ **If your code has issues**: Commit is blocked until issues are fixed

### Manual commands:

```bash
# Fix linting issues
yarn lint:fix

# Check types
yarn type-check

# Format all files
yarn format

# Run all checks manually
yarn lint && yarn type-check
```

## Development Commands

```bash
# Start development server
yarn dev

# Build for production
yarn build

# Run unit tests
yarn test

# Run end-to-end tests
yarn test:e2e

# Preview production build
yarn preview
```

## Troubleshooting

### Pre-commit hooks not working?

1. Ensure you ran: `git config core.hooksPath .husky`
2. Check if `.husky/pre-commit` is executable: `ls -la .husky/`
3. Try making it executable: `chmod +x .husky/pre-commit`

### ESLint errors?

Run `yarn lint:fix` to auto-fix most issues, then manually fix any remaining problems.

### TypeScript errors?

Run `yarn type-check` to see all type errors and fix them before committing.

### Prettier formatting issues?

Run `yarn format` to format all files according to project standards.

## IDE Setup (Recommended)

For the best development experience, configure your IDE to:

1. **Auto-format on save** using Prettier
2. **Show ESLint errors** inline
3. **Enable TypeScript** strict mode checking

### VS Code Extensions:
- ESLint
- Prettier - Code formatter
- TypeScript and JavaScript Language Features (built-in)