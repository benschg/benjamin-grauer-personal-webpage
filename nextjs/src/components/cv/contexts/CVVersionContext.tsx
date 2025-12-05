'use client';

import { createContext, useState, useEffect, useCallback, useRef } from 'react';
import type { ReactNode } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import type { CVVersion, CVVersionContent } from '@/types/database.types';
import {
  subscribeToCVVersions,
  createCVVersion,
  updateCVVersion,
  deleteCVVersion,
  setAsDefault,
  getCVVersion,
} from '@/services/cv/cvVersion.service';
import { cvData } from '../data/cvConfig';
import { sharedProfile } from '@/data/shared-profile';

export interface CVVersionContextType {
  // Current active content
  activeContent: CVVersionContent;
  activeVersion: CVVersion | null;

  // All versions
  versions: CVVersion[];
  loading: boolean;
  error: string | null;

  // Version management
  selectVersion: (id: string | null) => void;
  createVersion: (
    name: string,
    content: CVVersionContent,
    jobContext?: CVVersion['job_context']
  ) => Promise<string>;
  updateVersion: (id: string, updates: Partial<CVVersion>) => Promise<void>;
  deleteVersion: (id: string) => Promise<void>;
  setDefaultVersion: (id: string) => Promise<void>;

  // Flag to check if using custom version
  isUsingCustomVersion: boolean;

  // Inline editing
  isEditing: boolean;
  editedContent: CVVersionContent | null;
  startEditing: () => void;
  cancelEditing: () => void;
  updateEditedContent: (updates: Partial<CVVersionContent>) => void;
  saveEdits: () => Promise<void>;
  isSaving: boolean;

  // AI regeneration support
  regeneratingItems: Set<string>;
  setRegeneratingItem: (itemId: string, isRegenerating: boolean) => void;
}

const CVVersionContext = createContext<CVVersionContextType | undefined>(undefined);

// Default content from static files
const getDefaultContent = (): CVVersionContent => ({
  tagline: sharedProfile.tagline,
  profile: cvData.main.profile,
  slogan: cvData.main.slogan,
});

interface CVVersionProviderProps {
  children: ReactNode;
}

export const CVVersionProvider = ({ children }: CVVersionProviderProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [versions, setVersions] = useState<CVVersion[]>([]);
  const [selectedVersionId, setSelectedVersionId] = useState<string | null>(null);
  const [urlVersion, setUrlVersion] = useState<CVVersion | null>(null); // Version loaded from URL param
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Track if we've already processed the URL version param
  const urlVersionProcessed = useRef(false);
  // Track if this is the initial mount to avoid URL update on first render
  const isInitialMount = useRef(true);

  // Inline editing state
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState<CVVersionContent | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [regeneratingItems, setRegeneratingItems] = useState<Set<string>>(new Set());

  // Load version from URL param (public access, no auth required)
  // Only runs once on mount to check for version in URL
  useEffect(() => {
    const versionId = searchParams.get('version');
    if (versionId && !urlVersionProcessed.current) {
      urlVersionProcessed.current = true;
      setLoading(true);
      getCVVersion(versionId)
        .then((version) => {
          if (version) {
            setUrlVersion(version);
            setSelectedVersionId(version.id);
          } else {
            // Version not found - clear the URL param and use default
            console.warn(`CV version ${versionId} not found, using default`);
            setError(`Version not found. Showing default CV.`);
            // Clear invalid version from URL using window.location to avoid re-render loop
            const currentUrl = new URL(window.location.href);
            const params = currentUrl.searchParams;
            params.delete('version');
            const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
            router.replace(newUrl, { scroll: false });
          }
          setLoading(false);
        })
        .catch(() => {
          console.warn('Failed to load version from URL');
          setLoading(false);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount - searchParams is read but shouldn't trigger re-runs

  // Subscribe to Supabase versions (for authenticated users)
  // Track if we've set a default version to avoid re-running
  const hasAutoSelectedDefault = useRef(false);

  useEffect(() => {
    // Skip subscription if we're using a URL-specified version
    // Read from window.location to avoid dependency on searchParams
    const currentUrl = new URL(window.location.href);
    const versionId = currentUrl.searchParams.get('version');
    if (versionId) {
      return;
    }

    try {
      const unsubscribe = subscribeToCVVersions((fetchedVersions) => {
        setVersions(fetchedVersions);
        setLoading(false);

        // Auto-select default version only once on initial load
        if (!hasAutoSelectedDefault.current && fetchedVersions.length > 0) {
          hasAutoSelectedDefault.current = true;
          const defaultVersion = fetchedVersions.find((v) => v.is_default);
          if (defaultVersion) {
            setSelectedVersionId(defaultVersion.id);
          }
        }
      });

      return () => unsubscribe();
    } catch {
      // Supabase not configured - use static fallback
      console.warn('Supabase not configured, using static CV content');
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount - subscribes once and manages its own updates

  // Sync selected version to URL (for sharing)
  // Only sync when user explicitly selects a version (not when loading from URL)
  const lastSyncedVersionId = useRef<string | null | undefined>(undefined);
  const urlVersionId = urlVersion?.id ?? null;

  useEffect(() => {
    // Skip on initial mount - URL already has the correct values
    if (isInitialMount.current) {
      isInitialMount.current = false;
      lastSyncedVersionId.current = selectedVersionId;
      return;
    }

    // Skip if we loaded this version from URL (urlVersion is set)
    // This prevents the loop when loading a shared URL
    if (urlVersionId && selectedVersionId === urlVersionId) {
      return;
    }

    // Skip if we already synced this version to avoid duplicate updates
    if (lastSyncedVersionId.current === selectedVersionId) {
      return;
    }
    lastSyncedVersionId.current = selectedVersionId;

    // Read current URL to preserve other params (like privacy)
    const currentUrl = new URL(window.location.href);
    const params = currentUrl.searchParams;

    // Update version param based on current selection
    if (selectedVersionId) {
      params.set('version', selectedVersionId);
    } else {
      params.delete('version');
    }

    const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    router.replace(newUrl, { scroll: false });
  }, [selectedVersionId, pathname, router, urlVersionId]);

  // Get active version (URL version takes precedence, then selected from list)
  const activeVersion = urlVersion
    ? urlVersion
    : selectedVersionId
      ? versions.find((v) => v.id === selectedVersionId) || null
      : null;

  // Get active content (from version or default)
  const activeContent: CVVersionContent = activeVersion?.content || getDefaultContent();

  const isUsingCustomVersion = !!activeVersion;

  const selectVersion = useCallback((id: string | null) => {
    setSelectedVersionId(id);
  }, []);

  const createVersion = useCallback(
    async (
      name: string,
      content: CVVersionContent,
      jobContext?: CVVersion['job_context']
    ): Promise<string> => {
      try {
        setError(null);
        const id = await createCVVersion({ name, content, job_context: jobContext });
        if (!id) throw new Error('Failed to create version');
        setSelectedVersionId(id);
        return id;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to create version';
        setError(message);
        throw err;
      }
    },
    []
  );

  const updateVersionFn = useCallback(
    async (id: string, updates: Partial<CVVersion>): Promise<void> => {
      try {
        setError(null);
        await updateCVVersion(id, updates);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to update version';
        setError(message);
        throw err;
      }
    },
    []
  );

  const deleteVersionFn = useCallback(
    async (id: string): Promise<void> => {
      try {
        setError(null);
        await deleteCVVersion(id);
        if (selectedVersionId === id) {
          setSelectedVersionId(null);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to delete version';
        setError(message);
        throw err;
      }
    },
    [selectedVersionId]
  );

  const setDefaultVersionFn = useCallback(async (id: string): Promise<void> => {
    try {
      setError(null);
      await setAsDefault(id);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to set default version';
      setError(message);
      throw err;
    }
  }, []);

  // Inline editing functions
  const startEditing = useCallback(() => {
    if (activeVersion) {
      setEditedContent({ ...activeContent });
      setIsEditing(true);
    }
  }, [activeVersion, activeContent]);

  const cancelEditing = useCallback(() => {
    setIsEditing(false);
    setEditedContent(null);
  }, []);

  const updateEditedContent = useCallback((updates: Partial<CVVersionContent>) => {
    setEditedContent((prev) => (prev ? { ...prev, ...updates } : null));
  }, []);

  const saveEdits = useCallback(async (): Promise<void> => {
    if (!activeVersion || !editedContent) return;

    try {
      setIsSaving(true);
      setError(null);
      await updateCVVersion(activeVersion.id, { content: editedContent });
      setIsEditing(false);
      setEditedContent(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save edits';
      setError(message);
      throw err;
    } finally {
      setIsSaving(false);
    }
  }, [activeVersion, editedContent]);

  const setRegeneratingItem = useCallback((itemId: string, isRegenerating: boolean) => {
    setRegeneratingItems((prev) => {
      const next = new Set(prev);
      if (isRegenerating) {
        next.add(itemId);
      } else {
        next.delete(itemId);
      }
      return next;
    });
  }, []);

  // Use edited content when editing, otherwise active content
  const displayContent = isEditing && editedContent ? editedContent : activeContent;

  return (
    <CVVersionContext.Provider
      value={{
        activeContent: displayContent,
        activeVersion,
        versions,
        loading,
        error,
        selectVersion,
        createVersion,
        updateVersion: updateVersionFn,
        deleteVersion: deleteVersionFn,
        setDefaultVersion: setDefaultVersionFn,
        isUsingCustomVersion,
        isEditing,
        editedContent,
        startEditing,
        cancelEditing,
        updateEditedContent,
        saveEdits,
        isSaving,
        regeneratingItems,
        setRegeneratingItem,
      }}
    >
      {children}
    </CVVersionContext.Provider>
  );
};

export { CVVersionContext };
