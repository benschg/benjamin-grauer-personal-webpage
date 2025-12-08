import { NextResponse } from 'next/server';
import { createClient as createServerClient } from '@/lib/supabase/server';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

// GET /api/check-admin - Check if the current authenticated user is an admin
export async function GET() {
  try {
    // Check authentication
    const authClient = await createServerClient();
    const { data: { user } } = await authClient.auth.getUser();

    if (!user || !user.email) {
      return NextResponse.json({ isAdmin: false });
    }

    const userEmail = user.email.toLowerCase();
    const isAdmin = userEmail === ADMIN_EMAIL?.toLowerCase();

    return NextResponse.json({ isAdmin });
  } catch (err) {
    console.error('Error checking admin status:', err);
    return NextResponse.json({ isAdmin: false });
  }
}