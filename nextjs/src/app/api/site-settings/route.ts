import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createClient as createServerClient } from '@/lib/supabase/server';

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

// Public client for reading settings
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Admin client for write operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  // Fetch the single settings row
  const { data, error } = await supabase
    .from('site_settings')
    .select('contact_email, contact_phone, contact_address, public_email, public_address')
    .eq('id', 1)
    .single();

  if (error) {
    console.error('Failed to fetch settings:', error);
    return NextResponse.json({
      settings: {
        contact_email: '',
        contact_phone: '',
        contact_address: '',
        public_email: null,
        public_address: null,
      },
    });
  }

  return NextResponse.json({ settings: data });
}

export async function PUT(request: NextRequest) {
  try {
    // Check authentication
    const authClient = await createServerClient();
    const { data: { user } } = await authClient.auth.getUser();

    if (!user || user.email !== ADMIN_EMAIL) {
      return NextResponse.json(
        { error: 'Unauthorized - admin access required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { contact_email, contact_phone, contact_address, public_email, public_address } = body;

    const { data, error } = await supabaseAdmin
      .from('site_settings')
      .update({
        contact_email: contact_email ?? '',
        contact_phone: contact_phone ?? '',
        contact_address: contact_address ?? '',
        public_email: public_email ?? null,
        public_address: public_address ?? null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', 1)
      .select()
      .single();

    if (error) {
      console.error('Failed to update settings:', error);
      return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
    }

    return NextResponse.json({ settings: data });
  } catch (err) {
    console.error('Error updating settings:', err);
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
