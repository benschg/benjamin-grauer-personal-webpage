import { createContext } from 'react';

export type CVTheme = 'dark' | 'light';

export interface CVThemeContextType {
  theme: CVTheme;
  toggleTheme: () => void;
  showPhoto: boolean;
  togglePhoto: () => void;
  showPrivateInfo: boolean;
  togglePrivateInfo: () => void;
  showExperience: boolean;
  toggleExperience: () => void;
}

export const CVThemeContext = createContext<CVThemeContextType | undefined>(undefined);
