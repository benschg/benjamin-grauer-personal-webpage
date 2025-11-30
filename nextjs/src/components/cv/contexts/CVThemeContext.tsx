'use client';

import { useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { CVThemeContext } from './types';
import type { CVTheme } from './types';

interface CVThemeProviderProps {
  children: ReactNode;
}

export const CVThemeProvider = ({ children }: CVThemeProviderProps) => {
  const [theme, setTheme] = useState<CVTheme>('dark');
  const [showPhoto, setShowPhoto] = useState(true);
  const [showPrivateInfo, setShowPrivateInfo] = useState(false);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const togglePhoto = useCallback(() => {
    setShowPhoto((prev) => !prev);
  }, []);

  const togglePrivateInfo = useCallback(() => {
    setShowPrivateInfo((prev) => !prev);
  }, []);

  return (
    <CVThemeContext.Provider
      value={{ theme, toggleTheme, showPhoto, togglePhoto, showPrivateInfo, togglePrivateInfo }}
    >
      {children}
    </CVThemeContext.Provider>
  );
};
