import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import crypto from 'crypto';
import { csrfProtection } from '@/lib/csrf';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

// Generate a cryptographically secure random 8-character alphanumeric code
function generateShortCode(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const randomBytes = crypto.randomBytes(8);
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(randomBytes[i] % chars.length);
  }
  return code;
}

// POST: Create a new share link
export async function POST(request: NextRequest) {
  // CSRF protection
  const csrfError = csrfProtection(request);
  if (csrfError) return csrfError;

  try {
    const supabase = await createClient();

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || user.email !== ADMIN_EMAIL) {
      return NextResponse.json(
        { error: 'Unauthorized - admin access required' },
        { status: 401 }
      );
    }

    const { fullUrl, cvVersionId, settings } = await request.json();

    if (!fullUrl) {
      return NextResponse.json(
        { error: 'fullUrl is required' },
        { status: 400 }
      );
    }

    // Extract display settings with defaults
    const displaySettings = {
      theme: settings?.theme || 'dark',
      show_photo: settings?.showPhoto ?? true,
      privacy_level: settings?.privacyLevel || 'none',
      show_experience: settings?.showExperience ?? true,
      show_attachments: settings?.showAttachments ?? false,
      show_export: settings?.showExport ?? false,
    };

    // Check if a link already exists for this exact URL + settings combination
    const { data: existingLink } = await supabase
      .from('cv_share_links')
      .select('id, short_code')
      .eq('full_url', fullUrl)
      .eq('created_by', user.id)
      .eq('theme', displaySettings.theme)
      .eq('show_photo', displaySettings.show_photo)
      .eq('privacy_level', displaySettings.privacy_level)
      .eq('show_experience', displaySettings.show_experience)
      .eq('show_attachments', displaySettings.show_attachments)
      .eq('show_export', displaySettings.show_export)
      .single();

    if (existingLink) {
      // Return existing link
      const baseUrl = new URL(request.url).origin;
      return NextResponse.json({
        shortCode: existingLink.short_code,
        shortUrl: `${baseUrl}/s/${existingLink.short_code}`,
        isExisting: true,
      });
    }

    // Generate unique short code
    let shortCode: string;
    let isUnique = false;
    let attempts = 0;
    const maxAttempts = 10;

    do {
      shortCode = generateShortCode();
      const { data: existing } = await supabase
        .from('cv_share_links')
        .select('id')
        .eq('short_code', shortCode)
        .single();

      isUnique = !existing;
      attempts++;
    } while (!isUnique && attempts < maxAttempts);

    if (!isUnique) {
      return NextResponse.json(
        { error: 'Failed to generate unique short code' },
        { status: 500 }
      );
    }

    // Create the share link with display settings
    const { data: newLink, error } = await supabase
      .from('cv_share_links')
      .insert({
        short_code: shortCode,
        full_url: fullUrl,
        cv_version_id: cvVersionId || null,
        created_by: user.id,
        ...displaySettings,
      })
      .select('id, short_code')
      .single();

    if (error) {
      console.error('Error creating share link:', error);
      return NextResponse.json(
        { error: 'Failed to create share link' },
        { status: 500 }
      );
    }

    const baseUrl = new URL(request.url).origin;
    return NextResponse.json({
      shortCode: newLink.short_code,
      shortUrl: `${baseUrl}/s/${newLink.short_code}`,
      isExisting: false,
    });

  } catch (error) {
    console.error('Error in share-link POST:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET: Fetch all share links with visit stats (admin only)
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || user.email !== ADMIN_EMAIL) {
      return NextResponse.json(
        { error: 'Unauthorized - admin access required' },
        { status: 401 }
      );
    }

    // Fetch all share links with visit counts
    const { data: shareLinks, error } = await supabase
      .from('cv_share_links')
      .select(`
        id,
        short_code,
        full_url,
        cv_version_id,
        created_at,
        theme,
        show_photo,
        privacy_level,
        show_experience,
        show_attachments,
        show_export,
        cv_versions (
          name
        )
      `)
      .eq('created_by', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching share links:', error);
      return NextResponse.json(
        { error: 'Failed to fetch share links' },
        { status: 500 }
      );
    }

    // Fetch visit counts for each link
    const linksWithStats = await Promise.all(
      (shareLinks || []).map(async (link) => {
        const { count: totalVisits } = await supabase
          .from('cv_share_link_visits')
          .select('*', { count: 'exact', head: true })
          .eq('share_link_id', link.id);

        // Count distinct IP hashes for unique visitors
        const { data: uniqueIPs } = await supabase
          .from('cv_share_link_visits')
          .select('ip_hash')
          .eq('share_link_id', link.id);
        const uniqueVisits = new Set(uniqueIPs?.map(v => v.ip_hash) || []).size;

        const { data: lastVisit } = await supabase
          .from('cv_share_link_visits')
          .select('visited_at')
          .eq('share_link_id', link.id)
          .order('visited_at', { ascending: false })
          .limit(1)
          .single();

        // cv_versions can be an object or array depending on relationship
        const cvVersionData = link.cv_versions;
        let versionName = 'Default CV';
        if (cvVersionData) {
          if (Array.isArray(cvVersionData) && cvVersionData.length > 0) {
            versionName = (cvVersionData[0] as { name: string }).name;
          } else if (typeof cvVersionData === 'object' && 'name' in cvVersionData) {
            versionName = (cvVersionData as { name: string }).name;
          }
        }
        return {
          ...link,
          versionName,
          totalVisits: totalVisits || 0,
          uniqueVisits: uniqueVisits || 0,
          lastVisitedAt: lastVisit?.visited_at || null,
        };
      })
    );

    const baseUrl = new URL(request.url).origin;
    return NextResponse.json({
      links: linksWithStats.map((link) => ({
        id: link.id,
        shortCode: link.short_code,
        shortUrl: `${baseUrl}/s/${link.short_code}`,
        fullUrl: link.full_url,
        versionName: link.versionName,
        createdAt: link.created_at,
        totalVisits: link.totalVisits,
        uniqueVisits: link.uniqueVisits,
        lastVisitedAt: link.lastVisitedAt,
        settings: {
          theme: link.theme || 'dark',
          showPhoto: link.show_photo ?? true,
          privacyLevel: link.privacy_level || 'none',
          showExperience: link.show_experience ?? true,
          showAttachments: link.show_attachments ?? false,
          showExport: link.show_export ?? false,
        },
      })),
    });

  } catch (error) {
    console.error('Error in share-link GET:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH: Update a share link's settings
export async function PATCH(request: NextRequest) {
  // CSRF protection
  const csrfError = csrfProtection(request);
  if (csrfError) return csrfError;

  try {
    const supabase = await createClient();

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || user.email !== ADMIN_EMAIL) {
      return NextResponse.json(
        { error: 'Unauthorized - admin access required' },
        { status: 401 }
      );
    }

    const { id, settings } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Link ID is required' },
        { status: 400 }
      );
    }

    // Build update object from settings
    const updates: Record<string, unknown> = {};
    if (settings?.theme !== undefined) updates.theme = settings.theme;
    if (settings?.showPhoto !== undefined) updates.show_photo = settings.showPhoto;
    if (settings?.privacyLevel !== undefined) updates.privacy_level = settings.privacyLevel;
    if (settings?.showExperience !== undefined) updates.show_experience = settings.showExperience;
    if (settings?.showAttachments !== undefined) updates.show_attachments = settings.showAttachments;
    if (settings?.showExport !== undefined) updates.show_export = settings.showExport;

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: 'No settings to update' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('cv_share_links')
      .update(updates)
      .eq('id', id)
      .eq('created_by', user.id);

    if (error) {
      console.error('Error updating share link:', error);
      return NextResponse.json(
        { error: 'Failed to update share link' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error in share-link PATCH:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE: Delete a share link
export async function DELETE(request: NextRequest) {
  // CSRF protection
  const csrfError = csrfProtection(request);
  if (csrfError) return csrfError;

  try {
    const supabase = await createClient();

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || user.email !== ADMIN_EMAIL) {
      return NextResponse.json(
        { error: 'Unauthorized - admin access required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const linkId = searchParams.get('id');

    if (!linkId) {
      return NextResponse.json(
        { error: 'Link ID is required' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('cv_share_links')
      .delete()
      .eq('id', linkId)
      .eq('created_by', user.id);

    if (error) {
      console.error('Error deleting share link:', error);
      return NextResponse.json(
        { error: 'Failed to delete share link' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error in share-link DELETE:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
