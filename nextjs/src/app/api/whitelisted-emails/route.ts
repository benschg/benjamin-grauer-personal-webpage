import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Public client for reading
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
  const { data, error } = await supabase
    .from('whitelisted_emails')
    .select('id, email, name, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to fetch whitelisted emails:', error);
    return NextResponse.json({ emails: [] });
  }

  return NextResponse.json({ emails: data || [] });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Normalize email to lowercase
    const normalizedEmail = email.toLowerCase().trim();

    const { data, error } = await supabaseAdmin
      .from('whitelisted_emails')
      .insert({
        email: normalizedEmail,
        name: name || null,
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ error: 'Email already whitelisted' }, { status: 409 });
      }
      console.error('Failed to add whitelisted email:', error);
      return NextResponse.json({ error: 'Failed to add email' }, { status: 500 });
    }

    return NextResponse.json({ email: data });
  } catch (err) {
    console.error('Error adding whitelisted email:', err);
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from('whitelisted_emails')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Failed to delete whitelisted email:', error);
      return NextResponse.json({ error: 'Failed to delete email' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error deleting whitelisted email:', err);
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
