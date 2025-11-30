'use client';

import { useContext } from 'react';
import { CVThemeContext } from './types';
import type { CVThemeContextType } from './types';

export const useCVTheme = (): CVThemeContextType => {
  const context = useContext(CVThemeContext);
  if (!context) {
    throw new Error('useCVTheme must be used within a CVThemeProvider');
  }
  return context;
};
