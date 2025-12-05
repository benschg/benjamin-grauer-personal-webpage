'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
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

// Helper to parse boolean from URL param
const parseBoolParam = (value: string | null, defaultValue: boolean): boolean => {
  if (value === null) return defaultValue;
  return value === '1' || value === 'true';
};

// Helper to parse privacy level from URL param
const parsePrivacyParam = (value: string | null): PrivacyLevel => {
  if (value === 'personal' || value === 'full') return value;
  return 'none';
};

// Helper to parse theme from URL param
const parseThemeParam = (value: string | null): CVTheme => {
  if (value === 'light') return 'light';
  return 'dark';
};

export const CVThemeProvider = ({ children }: CVThemeProviderProps) => {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Initialize state from URL params
  const [theme, setTheme] = useState<CVTheme>(() => parseThemeParam(searchParams.get('theme')));
  const [showPhoto, setShowPhoto] = useState(() => parseBoolParam(searchParams.get('photo'), true));
  const [privacyLevel, setPrivacyLevel] = useState<PrivacyLevel>(() =>
    parsePrivacyParam(searchParams.get('privacy'))
  );
  const [showExperience, setShowExperience] = useState(() =>
    parseBoolParam(searchParams.get('experience'), true)
  );
  const [showAttachments, setShowAttachments] = useState(() =>
    parseBoolParam(searchParams.get('attachments'), false)
  );
  const [zoom, setZoom] = useState(0); // 0 = auto, otherwise manual zoom level

  // Track if this is the initial mount to avoid URL update on first render
  const isInitialMount = useRef(true);

  // Only logged-in users can see private info
  const canShowPrivateInfo = !!user;

  // Sync state to URL via useEffect (avoids setState during render)
  useEffect(() => {
    // Skip on initial mount - URL already has the correct values
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Read current URL to preserve other params (like version)
    const currentUrl = new URL(window.location.href);
    const params = currentUrl.searchParams;

    // Update each param based on current state (null = use default, omit from URL)
    if (theme === 'dark') params.delete('theme');
    else params.set('theme', theme);

    if (showPhoto) params.delete('photo');
    else params.set('photo', '0');

    if (privacyLevel === 'none') params.delete('privacy');
    else params.set('privacy', privacyLevel);

    if (showExperience) params.delete('experience');
    else params.set('experience', '0');

    if (!showAttachments) params.delete('attachments');
    else params.set('attachments', '1');

    const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    router.replace(newUrl, { scroll: false });
  }, [theme, showPhoto, privacyLevel, showExperience, showAttachments, pathname, router]);

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

  // Direct setters for use in export dialog
  const handleSetTheme = useCallback((newTheme: CVTheme) => {
    setTheme(newTheme);
  }, []);

  const handleSetShowPhoto = useCallback((show: boolean) => {
    setShowPhoto(show);
  }, []);

  const handleSetPrivacyLevel = useCallback(
    (level: PrivacyLevel) => {
      if (!user) return; // Block if not logged in
      setPrivacyLevel(level);
    },
    [user]
  );

  const handleSetShowExperience = useCallback((show: boolean) => {
    setShowExperience(show);
  }, []);

  const handleSetShowAttachments = useCallback((show: boolean) => {
    setShowAttachments(show);
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
        setTheme: handleSetTheme,
        showPhoto,
        togglePhoto,
        setShowPhoto: handleSetShowPhoto,
        privacyLevel,
        cyclePrivacyLevel,
        setPrivacyLevel: handleSetPrivacyLevel,
        canShowPrivateInfo,
        showExperience,
        toggleExperience,
        setShowExperience: handleSetShowExperience,
        showAttachments,
        toggleAttachments,
        setShowAttachments: handleSetShowAttachments,
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
