#!/usr/bin/env node

// Wrapper script for TypeScript to work with lint-staged
// lint-staged passes file arguments, but tsc --project doesn't accept them
// This script ignores the file arguments and runs tsc with the correct project

import { exec } from 'child_process';

// Run TypeScript compiler with the project config, ignoring any file arguments
exec('npx tsc --project tsconfig.app.json --noEmit', (error, stdout, stderr) => {
  // Always print output
  if (stdout) console.log(stdout);
  if (stderr) console.error(stderr);

  // Exit with the same code as tsc (0 for success, non-zero for errors)
  process.exit(error ? error.code || 1 : 0);
});
