import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// Create a service role client for inserting visits without auth
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function hashIP(ip: string): string {
  return crypto.createHash('sha256').update(ip).digest('hex');
}

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const cfIP = request.headers.get('cf-connecting-ip');
  if (cfIP) return cfIP;
  const realIP = request.headers.get('x-real-ip');
  if (realIP) return realIP;
  return 'unknown';
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;

  // Look up the short code with all settings
  const { data: shareLink, error } = await supabaseAdmin
    .from('cv_share_links')
    .select('id, full_url, cv_version_id, theme, show_photo, privacy_level, show_experience, show_attachments, show_export')
    .eq('short_code', code)
    .single();

  if (error || !shareLink) {
    // Redirect to home page if link not found
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Build the redirect URL from stored settings (more reliable than full_url)
  const urlParams = new URLSearchParams();
  if (shareLink.cv_version_id) urlParams.set('version', shareLink.cv_version_id);
  if (shareLink.theme && shareLink.theme !== 'dark') urlParams.set('theme', shareLink.theme);
  if (shareLink.show_photo === false) urlParams.set('photo', '0');
  if (shareLink.privacy_level && shareLink.privacy_level !== 'none') urlParams.set('privacy', shareLink.privacy_level);
  if (shareLink.show_experience === false) urlParams.set('experience', '0');
  if (shareLink.show_attachments === true) urlParams.set('attachments', '1');
  // show_export controls whether export panel is open AND export button is visible
  if (shareLink.show_export === true) {
    urlParams.set('export', 'true');
  } else {
    urlParams.set('showExport', '0');
  }

  const queryString = urlParams.toString();
  const redirectPath = queryString ? `/working-life/cv?${queryString}` : '/working-life/cv';

  // Record the visit (don't await - fire and forget for speed)
  const clientIP = getClientIP(request);
  const ipHash = hashIP(clientIP);
  const userAgent = request.headers.get('user-agent') || null;
  const referrer = request.headers.get('referer') || null;

  // Fire and forget - don't block the redirect
  supabaseAdmin
    .from('cv_share_link_visits')
    .insert({
      share_link_id: shareLink.id,
      ip_hash: ipHash,
      user_agent: userAgent,
      referrer: referrer,
    })
    .then(({ error }) => {
      if (error) console.error('Failed to record visit:', error);
    });

  // Redirect to the CV page with stored settings
  return NextResponse.redirect(new URL(redirectPath, request.url), 307);
}
