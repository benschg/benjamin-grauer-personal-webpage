'use client';

import { useState, useCallback } from 'react';
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
  const [privacyLevel, setPrivacyLevel] = useState<PrivacyLevel>(() => parsePrivacyParam(searchParams.get('privacy')));
  const [showExperience, setShowExperience] = useState(() => parseBoolParam(searchParams.get('experience'), true));
  const [showAttachments, setShowAttachments] = useState(() => parseBoolParam(searchParams.get('attachments'), false));
  const [zoom, setZoom] = useState(0); // 0 = auto, otherwise manual zoom level

  // Only logged-in users can see private info
  const canShowPrivateInfo = !!user;

  // Update URL when state changes
  const updateUrl = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value === null) {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });

      const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
      router.replace(newUrl, { scroll: false });
    },
    [searchParams, pathname, router]
  );

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const newTheme = prev === 'dark' ? 'light' : 'dark';
      updateUrl({ theme: newTheme === 'dark' ? null : newTheme }); // dark is default, so omit from URL
      return newTheme;
    });
  }, [updateUrl]);

  const togglePhoto = useCallback(() => {
    setShowPhoto((prev) => {
      const newValue = !prev;
      updateUrl({ photo: newValue ? null : '0' }); // true is default, so omit from URL
      return newValue;
    });
  }, [updateUrl]);

  // Cycle through privacy levels: none -> personal -> full -> none
  // Only works if user is logged in
  const cyclePrivacyLevel = useCallback(() => {
    if (!user) return; // Block if not logged in
    setPrivacyLevel((prev) => {
      let newLevel: PrivacyLevel;
      if (prev === 'none') newLevel = 'personal';
      else if (prev === 'personal') newLevel = 'full';
      else newLevel = 'none';
      updateUrl({ privacy: newLevel === 'none' ? null : newLevel }); // none is default, so omit from URL
      return newLevel;
    });
  }, [user, updateUrl]);

  const toggleExperience = useCallback(() => {
    setShowExperience((prev) => {
      const newValue = !prev;
      updateUrl({ experience: newValue ? null : '0' }); // true is default, so omit from URL
      return newValue;
    });
  }, [updateUrl]);

  const toggleAttachments = useCallback(() => {
    setShowAttachments((prev) => {
      const newValue = !prev;
      updateUrl({ attachments: newValue ? '1' : null }); // false is default, so omit from URL
      return newValue;
    });
  }, [updateUrl]);

  // Direct setters for use in export dialog
  const handleSetTheme = useCallback(
    (newTheme: CVTheme) => {
      setTheme(newTheme);
      updateUrl({ theme: newTheme === 'dark' ? null : newTheme });
    },
    [updateUrl]
  );

  const handleSetShowPhoto = useCallback(
    (show: boolean) => {
      setShowPhoto(show);
      updateUrl({ photo: show ? null : '0' });
    },
    [updateUrl]
  );

  const handleSetPrivacyLevel = useCallback(
    (level: PrivacyLevel) => {
      if (!user) return; // Block if not logged in
      setPrivacyLevel(level);
      updateUrl({ privacy: level === 'none' ? null : level });
    },
    [user, updateUrl]
  );

  const handleSetShowExperience = useCallback(
    (show: boolean) => {
      setShowExperience(show);
      updateUrl({ experience: show ? null : '0' });
    },
    [updateUrl]
  );

  const handleSetShowAttachments = useCallback(
    (show: boolean) => {
      setShowAttachments(show);
      updateUrl({ attachments: show ? '1' : null });
    },
    [updateUrl]
  );

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
