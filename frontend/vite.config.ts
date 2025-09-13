/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunks
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }
            if (id.includes('@mui') || id.includes('@emotion')) {
              return 'mui-vendor';
            }
            if (id.includes('react-router-dom')) {
              return 'router-vendor';
            }
            if (id.includes('framer-motion')) {
              return 'framer-vendor';
            }
            return 'vendor';
          }

          // Component-based chunks
          if (id.includes('components/common/Timeline')) {
            return 'timeline-components';
          }
          if (id.includes('pages/WorkingLife') && !id.includes('index.tsx')) {
            return 'working-life-components';
          }
          if (id.includes('pages/PersonalLife') && !id.includes('index.tsx')) {
            return 'personal-life-components';
          }
          if (id.includes('pages/Portfolio') && !id.includes('index.tsx')) {
            return 'portfolio-components';
          }
          if (id.includes('skills/data') || id.includes('skills/')) {
            return 'skills-data';
          }
        },
      },
      // Enable tree-shaking
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false,
        unknownGlobalSideEffects: false,
      },
    },
    chunkSizeWarningLimit: 300,
    // Additional build optimizations
    minify: true,
  },
  // Optimize dependency pre-bundling
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      '@mui/material',
      '@emotion/react',
      '@emotion/styled',
      'react-router-dom',
    ],
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    exclude: ['**/tests/e2e/**', '**/node_modules/**'],
  },
});
