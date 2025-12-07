import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  const { data, error } = await supabase
    .from('site_settings')
    .select('public_email, public_address')
    .eq('id', 1)
    .single();

  if (error) {
    console.error('Failed to fetch public contact:', error);
    return NextResponse.json({
      public_email: null,
      public_address: null,
    });
  }

  return NextResponse.json({
    public_email: data.public_email,
    public_address: data.public_address,
  });
}
