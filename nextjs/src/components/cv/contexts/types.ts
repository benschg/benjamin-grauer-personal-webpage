import { createContext } from 'react';

export type CVTheme = 'dark' | 'light';

// Privacy levels: 'none' = hidden, 'personal' = show my contact info, 'full' = show all including reference contacts
export type PrivacyLevel = 'none' | 'personal' | 'full';

export interface CVThemeContextType {
  theme: CVTheme;
  toggleTheme: () => void;
  showPhoto: boolean;
  togglePhoto: () => void;
  privacyLevel: PrivacyLevel;
  cyclePrivacyLevel: () => void;
  canShowPrivateInfo: boolean; // true if user is logged in and can toggle privacy
  showExperience: boolean;
  toggleExperience: () => void;
  showAttachments: boolean;
  toggleAttachments: () => void;
  zoom: number;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
}

export const CVThemeContext = createContext<CVThemeContextType | undefined>(undefined);
