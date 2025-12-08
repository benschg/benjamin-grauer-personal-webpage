import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createClient as createServerClient } from '@/lib/supabase/server';

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

// Public client for reading active references
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Admin client for write operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const fetchAll = searchParams.get('all') === 'true';

  // If fetching all (admin view), require authentication
  if (fetchAll) {
    const authClient = await createServerClient();
    const { data: { user } } = await authClient.auth.getUser();

    if (!user || user.email !== ADMIN_EMAIL) {
      return NextResponse.json(
        { error: 'Unauthorized - admin access required' },
        { status: 401 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('cv_references')
      .select('id, name, title, company, email, phone, sort_order, is_active')
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Failed to fetch CV references:', error);
      return NextResponse.json({ references: [] });
    }

    return NextResponse.json({ references: data || [] });
  }

  // Public view: only active references with limited fields
  const { data, error } = await supabase
    .from('cv_references')
    .select('name, title, company, email, phone')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Failed to fetch CV references:', error);
    return NextResponse.json({ references: [] });
  }

  return NextResponse.json({ references: data || [] });
}

export async function POST(request: NextRequest) {
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
    const { name, title, company, email, phone, sort_order } = body;

    if (!name || !title || !company) {
      return NextResponse.json(
        { error: 'Name, title, and company are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('cv_references')
      .insert({
        name,
        title,
        company,
        email: email || null,
        phone: phone || null,
        sort_order: sort_order ?? 0,
        is_active: true,
      })
      .select()
      .single();

    if (error) {
      console.error('Failed to create reference:', error);
      return NextResponse.json({ error: 'Failed to create reference' }, { status: 500 });
    }

    return NextResponse.json({ reference: data });
  } catch (err) {
    console.error('Error creating reference:', err);
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
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
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'Reference ID is required' }, { status: 400 });
    }

    // Filter out empty strings, convert to null
    const cleanUpdates: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(updates)) {
      if (value === '') {
        cleanUpdates[key] = null;
      } else if (value !== undefined) {
        cleanUpdates[key] = value;
      }
    }

    const { data, error } = await supabaseAdmin
      .from('cv_references')
      .update(cleanUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Failed to update reference:', error);
      return NextResponse.json({ error: 'Failed to update reference' }, { status: 500 });
    }

    return NextResponse.json({ reference: data });
  } catch (err) {
    console.error('Error updating reference:', err);
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
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
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: 'Reference ID is required' }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from('cv_references')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Failed to delete reference:', error);
      return NextResponse.json({ error: 'Failed to delete reference' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error deleting reference:', err);
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
