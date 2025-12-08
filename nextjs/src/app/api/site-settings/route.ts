import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createClient as createServerClient } from '@/lib/supabase/server';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

// Validation constants
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const MAX_EMAIL_LENGTH = 254; // RFC 5321
const MAX_PHONE_LENGTH = 50;
const MAX_ADDRESS_LENGTH = 500;

// Validate email format
function isValidEmail(email: string): boolean {
  return email.length <= MAX_EMAIL_LENGTH && EMAIL_REGEX.test(email);
}

// Sanitize text to prevent XSS - strip HTML tags
function sanitizeText(text: string): string {
  return text.replace(/<[^>]*>/g, '').trim();
}

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

    // Validate email formats
    if (contact_email && !isValidEmail(contact_email)) {
      return NextResponse.json(
        { error: 'Invalid contact email format' },
        { status: 400 }
      );
    }
    if (public_email && !isValidEmail(public_email)) {
      return NextResponse.json(
        { error: 'Invalid public email format' },
        { status: 400 }
      );
    }

    // Validate phone length
    if (contact_phone && contact_phone.length > MAX_PHONE_LENGTH) {
      return NextResponse.json(
        { error: `Phone number too long (max ${MAX_PHONE_LENGTH} characters)` },
        { status: 400 }
      );
    }

    // Validate address lengths
    if (contact_address && contact_address.length > MAX_ADDRESS_LENGTH) {
      return NextResponse.json(
        { error: `Contact address too long (max ${MAX_ADDRESS_LENGTH} characters)` },
        { status: 400 }
      );
    }
    if (public_address && public_address.length > MAX_ADDRESS_LENGTH) {
      return NextResponse.json(
        { error: `Public address too long (max ${MAX_ADDRESS_LENGTH} characters)` },
        { status: 400 }
      );
    }

    // Sanitize text inputs to prevent XSS
    const sanitizedPhone = contact_phone ? sanitizeText(contact_phone) : '';
    const sanitizedContactAddress = contact_address ? sanitizeText(contact_address) : '';
    const sanitizedPublicAddress = public_address ? sanitizeText(public_address) : null;

    const { data, error } = await supabaseAdmin
      .from('site_settings')
      .update({
        contact_email: contact_email ?? '',
        contact_phone: sanitizedPhone,
        contact_address: sanitizedContactAddress,
        public_email: public_email ?? null,
        public_address: sanitizedPublicAddress,
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
