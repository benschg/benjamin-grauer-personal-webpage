import { createClient } from '@/lib/supabase/client';
import type { CVVersion, CreateCVVersionInput, UpdateCVVersionInput } from '@/types/database.types';

const TABLE_NAME = 'cv_versions';

export async function getCVVersion(id: string): Promise<CVVersion | null> {
  try {
    const supabase = createClient();
    const { data, error, status, statusText } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      // 406 means no rows found - version doesn't exist (not really an error)
      if (status === 406) {
        console.warn(`CV version not found: ${id}`);
        return null;
      }

      // Log more details for debugging other errors
      console.error('Error fetching CV version:', {
        error,
        status,
        statusText,
        id,
        code: error.code,
        message: error.message,
        details: error.details,
      });
      return null;
    }

    return data;
  } catch (err) {
    // Handle network/CORS errors
    console.error('Network error fetching CV version:', err);
    return null;
  }
}

export async function getAllCVVersions(): Promise<CVVersion[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching CV versions:', error);
      return [];
    }

    return data ?? [];
  } catch (err) {
    // Handle network/CORS errors
    console.error('Network error fetching CV versions:', err);
    return [];
  }
}

export async function getDefaultCVVersion(): Promise<CVVersion | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .eq('is_default', true)
    .single();

  if (error) {
    console.error('Error fetching default CV version:', error);
    return null;
  }

  return data;
}

export async function createCVVersion(input: CreateCVVersionInput): Promise<string | null> {
  const supabase = createClient();

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.error('Error creating CV version: User not authenticated');
    return null;
  }

  // If setting as default, unset other defaults first
  if (input.is_default) {
    await unsetAllDefaults();
  }

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .insert({
      user_id: user.id,
      name: input.name,
      content: input.content,
      is_default: input.is_default ?? false,
      job_context: input.job_context,
      llm_metadata: input.llm_metadata
        ? { ...input.llm_metadata, generatedAt: new Date().toISOString() }
        : undefined,
    })
    .select('id')
    .single();

  if (error) {
    console.error('Error creating CV version:', error);
    return null;
  }

  return data.id;
}

export async function updateCVVersion(id: string, input: UpdateCVVersionInput): Promise<boolean> {
  const supabase = createClient();

  // If setting as default, unset other defaults first
  if (input.is_default) {
    await unsetAllDefaults();
  }

  const { error } = await supabase
    .from(TABLE_NAME)
    .update({
      ...input,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) {
    console.error('Error updating CV version:', error);
    return false;
  }

  return true;
}

export async function deleteCVVersion(id: string): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase.from(TABLE_NAME).delete().eq('id', id);

  if (error) {
    console.error('Error deleting CV version:', error);
    return false;
  }

  return true;
}

export async function setAsDefault(id: string): Promise<boolean> {
  await unsetAllDefaults();

  const supabase = createClient();
  const { error } = await supabase
    .from(TABLE_NAME)
    .update({ is_default: true, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) {
    console.error('Error setting default:', error);
    return false;
  }

  return true;
}

async function unsetAllDefaults(): Promise<void> {
  const supabase = createClient();
  await supabase
    .from(TABLE_NAME)
    .update({ is_default: false, updated_at: new Date().toISOString() })
    .eq('is_default', true);
}

// Real-time subscription
export function subscribeToCVVersions(
  callback: (versions: CVVersion[]) => void
): () => void {
  const supabase = createClient();
  let hasError = false;

  const channel = supabase
    .channel('cv_versions_changes')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: TABLE_NAME },
      async () => {
        // Skip if we've had an error (likely auth issue)
        if (hasError) return;

        // Refetch all versions on any change
        const versions = await getAllCVVersions();
        callback(versions);
      }
    )
    .subscribe();

  // Initial fetch
  getAllCVVersions()
    .then(callback)
    .catch(() => {
      hasError = true;
      callback([]); // Return empty array on error
    });

  return () => {
    supabase.removeChannel(channel);
  };
}
