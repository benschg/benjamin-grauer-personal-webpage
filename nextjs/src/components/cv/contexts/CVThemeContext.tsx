'use client';

import { useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { CVThemeContext } from './types';
import type { CVTheme, PrivacyLevel } from './types';
import { useAuth } from '@/contexts';

interface CVThemeProviderProps {
  children: ReactNode;
}

// Default zoom is 0 which means "auto" (use CSS media queries)
// Positive values are manual zoom levels (0.5 = 50%, 1 = 100%, etc.)
const ZOOM_STEP = 0.25;
const MIN_ZOOM = 0.25;
const MAX_ZOOM = 2.0;

export const CVThemeProvider = ({ children }: CVThemeProviderProps) => {
  const { user } = useAuth();
  const [theme, setTheme] = useState<CVTheme>('dark');
  const [showPhoto, setShowPhoto] = useState(true);
  const [privacyLevel, setPrivacyLevel] = useState<PrivacyLevel>('none');
  const [showExperience, setShowExperience] = useState(true);
  const [showAttachments, setShowAttachments] = useState(false);
  const [zoom, setZoom] = useState(0); // 0 = auto, otherwise manual zoom level

  // Only logged-in users can see private info
  const canShowPrivateInfo = !!user;

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const togglePhoto = useCallback(() => {
    setShowPhoto((prev) => !prev);
  }, []);

  // Cycle through privacy levels: none -> personal -> full -> none
  // Only works if user is logged in
  const cyclePrivacyLevel = useCallback(() => {
    if (!user) return; // Block if not logged in
    setPrivacyLevel((prev) => {
      if (prev === 'none') return 'personal';
      if (prev === 'personal') return 'full';
      return 'none';
    });
  }, [user]);

  const toggleExperience = useCallback(() => {
    setShowExperience((prev) => !prev);
  }, []);

  const toggleAttachments = useCallback(() => {
    setShowAttachments((prev) => !prev);
  }, []);

  const zoomIn = useCallback(() => {
    setZoom((prev) => {
      const current = prev === 0 ? 0.75 : prev; // Start from 75% if auto
      return Math.min(current + ZOOM_STEP, MAX_ZOOM);
    });
  }, []);

  const zoomOut = useCallback(() => {
    setZoom((prev) => {
      const current = prev === 0 ? 0.75 : prev; // Start from 75% if auto
      return Math.max(current - ZOOM_STEP, MIN_ZOOM);
    });
  }, []);

  const resetZoom = useCallback(() => {
    setZoom(0); // Back to auto
  }, []);

  return (
    <CVThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        showPhoto,
        togglePhoto,
        privacyLevel,
        cyclePrivacyLevel,
        canShowPrivateInfo,
        showExperience,
        toggleExperience,
        showAttachments,
        toggleAttachments,
        zoom,
        zoomIn,
        zoomOut,
        resetZoom,
      }}
    >
      {children}
    </CVThemeContext.Provider>
  );
};
