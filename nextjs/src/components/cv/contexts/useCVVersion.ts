'use client';

import { useContext } from 'react';
import { CVVersionContext } from './CVVersionContext';
import type { CVVersionContextType } from './CVVersionContext';

export const useCVVersion = (): CVVersionContextType => {
  const context = useContext(CVVersionContext);
  if (!context) {
    throw new Error('useCVVersion must be used within a CVVersionProvider');
  }
  return context;
};
