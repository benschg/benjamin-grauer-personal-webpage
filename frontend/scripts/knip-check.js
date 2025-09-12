#!/usr/bin/env node

// Wrapper script for knip to work with lint-staged
// lint-staged passes file arguments, but knip doesn't accept them
// This script ignores the file arguments and runs knip

import { exec } from 'child_process';

// Run knip with the desired options, ignoring any file arguments
exec('npx knip --no-exit-code --reporter compact', (error, stdout, stderr) => {
  // Always print output
  if (stdout) console.log(stdout);
  if (stderr) console.error(stderr);

  // Always exit with 0 to not block commits
  process.exit(0);
});
