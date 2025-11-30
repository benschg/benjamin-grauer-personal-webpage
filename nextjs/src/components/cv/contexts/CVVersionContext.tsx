'use client';

import { createContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { CVVersion, CVVersionContent } from '@/types/database.types';
import {
  subscribeToCVVersions,
  createCVVersion,
  updateCVVersion,
  deleteCVVersion,
  setAsDefault,
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
  const [versions, setVersions] = useState<CVVersion[]>([]);
  const [selectedVersionId, setSelectedVersionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Inline editing state
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState<CVVersionContent | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Subscribe to Supabase versions
  useEffect(() => {
    try {
      const unsubscribe = subscribeToCVVersions((fetchedVersions) => {
        setVersions(fetchedVersions);
        setLoading(false);

        // Auto-select default version if none selected
        if (!selectedVersionId) {
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
  }, [selectedVersionId]);

  // Get active version
  const activeVersion = selectedVersionId
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
      }}
    >
      {children}
    </CVVersionContext.Provider>
  );
};

export { CVVersionContext };
