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
  zoom: number;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
}

export const CVThemeContext = createContext<CVThemeContextType | undefined>(undefined);
