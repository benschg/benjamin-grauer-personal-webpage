import { createContext } from 'react';

export type CVTheme = 'dark' | 'light';

// Privacy levels: 'none' = hidden, 'personal' = show my contact info, 'full' = show all including reference contacts
export type PrivacyLevel = 'none' | 'personal' | 'full';

// Display settings that are shareable via URL/share links
export interface DisplaySettings {
  theme: CVTheme;
  showPhoto: boolean;
  privacyLevel: PrivacyLevel;
  showExperience: boolean;
  showAttachments: boolean;
  showExport: boolean;
}

// Database column names mapping for DisplaySettings
// When you add a new field to DisplaySettings, add the corresponding DB column name here
export const DISPLAY_SETTINGS_DB_COLUMNS: Record<keyof DisplaySettings, string> = {
  theme: 'theme',
  showPhoto: 'show_photo',
  privacyLevel: 'privacy_level',
  showExperience: 'show_experience',
  showAttachments: 'show_attachments',
  showExport: 'show_export',
};

// URL parameter names mapping for DisplaySettings
export const DISPLAY_SETTINGS_URL_PARAMS: Record<keyof DisplaySettings, string> = {
  theme: 'theme',
  showPhoto: 'photo',
  privacyLevel: 'privacy',
  showExperience: 'experience',
  showAttachments: 'attachments',
  showExport: 'export',
};

// Default values for DisplaySettings
export const DEFAULT_DISPLAY_SETTINGS: DisplaySettings = {
  theme: 'dark',
  showPhoto: true,
  privacyLevel: 'none',
  showExperience: true,
  showAttachments: false,
  showExport: true,
};

export interface CVThemeContextType {
  theme: CVTheme;
  toggleTheme: () => void;
  setTheme: (theme: CVTheme) => void;
  showPhoto: boolean;
  togglePhoto: () => void;
  setShowPhoto: (show: boolean) => void;
  privacyLevel: PrivacyLevel;
  cyclePrivacyLevel: () => void;
  setPrivacyLevel: (level: PrivacyLevel) => void;
  canShowPrivateInfo: boolean; // true if user is logged in and can toggle privacy
  canShowReferenceInfo: boolean; // true if user is whitelisted and can see reference contacts
  showExperience: boolean;
  toggleExperience: () => void;
  setShowExperience: (show: boolean) => void;
  showAttachments: boolean;
  toggleAttachments: () => void;
  setShowAttachments: (show: boolean) => void;
  zoom: number;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
}

export const CVThemeContext = createContext<CVThemeContextType | undefined>(undefined);
