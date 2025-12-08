import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

// GET: Fetch visits for a specific share link
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || user.email !== ADMIN_EMAIL) {
      return NextResponse.json(
        { error: 'Unauthorized - admin access required' },
        { status: 401 }
      );
    }

    // Verify the share link belongs to this user
    const { data: shareLink, error: linkError } = await supabase
      .from('cv_share_links')
      .select('id')
      .eq('id', id)
      .eq('created_by', user.id)
      .single();

    if (linkError || !shareLink) {
      return NextResponse.json(
        { error: 'Share link not found' },
        { status: 404 }
      );
    }

    // Fetch all visits for this link
    const { data: visits, error: visitsError } = await supabase
      .from('cv_share_link_visits')
      .select('id, visited_at, ip_hash, user_agent, referrer')
      .eq('share_link_id', id)
      .order('visited_at', { ascending: false })
      .limit(100); // Limit to last 100 visits

    if (visitsError) {
      console.error('Error fetching visits:', visitsError);
      return NextResponse.json(
        { error: 'Failed to fetch visits' },
        { status: 500 }
      );
    }

    // Parse user agent to get browser/device info
    const parsedVisits = (visits || []).map(visit => {
      const ua = visit.user_agent || '';
      let browser = 'Unknown';
      let device = 'Unknown';

      // Simple UA parsing
      if (ua.includes('Chrome') && !ua.includes('Edg')) browser = 'Chrome';
      else if (ua.includes('Firefox')) browser = 'Firefox';
      else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Safari';
      else if (ua.includes('Edg')) browser = 'Edge';
      else if (ua.includes('Opera') || ua.includes('OPR')) browser = 'Opera';

      if (ua.includes('Mobile') || ua.includes('Android')) device = 'Mobile';
      else if (ua.includes('Tablet') || ua.includes('iPad')) device = 'Tablet';
      else if (ua.includes('Windows') || ua.includes('Mac') || ua.includes('Linux')) device = 'Desktop';

      return {
        id: visit.id,
        visitedAt: visit.visited_at,
        ipHash: visit.ip_hash?.substring(0, 8) + '...', // Truncate for display
        browser,
        device,
        referrer: visit.referrer,
      };
    });

    return NextResponse.json({ visits: parsedVisits });

  } catch (error) {
    console.error('Error in visits GET:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
