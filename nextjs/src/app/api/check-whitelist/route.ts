import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createClient as createServerClient } from '@/lib/supabase/server';

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

// Admin client for database queries
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET /api/check-whitelist - Check if the current authenticated user is whitelisted
export async function GET() {
  try {
    // Check authentication
    const authClient = await createServerClient();
    const { data: { user } } = await authClient.auth.getUser();

    if (!user || !user.email) {
      return NextResponse.json({ isWhitelisted: false });
    }

    const userEmail = user.email.toLowerCase();

    // Admin is always whitelisted
    if (userEmail === ADMIN_EMAIL?.toLowerCase()) {
      return NextResponse.json({ isWhitelisted: true });
    }

    // Check if user's email is in the whitelist
    const { data, error } = await supabaseAdmin
      .from('whitelisted_emails')
      .select('id')
      .eq('email', userEmail)
      .maybeSingle();

    if (error) {
      console.error('Failed to check whitelist:', error);
      return NextResponse.json({ isWhitelisted: false });
    }

    return NextResponse.json({ isWhitelisted: !!data });
  } catch (err) {
    console.error('Error checking whitelist:', err);
    return NextResponse.json({ isWhitelisted: false });
  }
}
