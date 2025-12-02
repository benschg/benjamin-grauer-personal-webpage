import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');

  // Get 'next' from query params - Supabase preserves this in the redirect
  const next = searchParams.get('next') ?? '/working-life/cv';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Decode the next path in case it was encoded
      const decodedNext = decodeURIComponent(next);
      return NextResponse.redirect(`${origin}${decodedNext}`);
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
