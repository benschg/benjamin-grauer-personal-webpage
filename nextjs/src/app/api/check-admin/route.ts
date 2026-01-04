import { NextResponse } from 'next/server';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { timingSafeEqual } from 'crypto';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

// Minimum response time in ms to normalize timing (prevents timing attacks)
const MIN_RESPONSE_TIME_MS = 100;

/**
 * Timing-safe email comparison to prevent enumeration attacks.
 * Pads both strings to the same length before comparing.
 */
function safeEmailCompare(a: string, b: string): boolean {
  const maxLen = Math.max(a.length, b.length, 254); // RFC 5321 max email length
  const aBuf = Buffer.from(a.toLowerCase().padEnd(maxLen, '\0'));
  const bBuf = Buffer.from(b.toLowerCase().padEnd(maxLen, '\0'));
  return timingSafeEqual(aBuf, bBuf);
}

// GET /api/check-admin - Check if the current authenticated user is an admin
export async function GET() {
  const startTime = Date.now();

  try {
    // Check authentication
    const authClient = await createServerClient();
    const { data: { user } } = await authClient.auth.getUser();

    let isAdmin = false;

    if (user?.email && ADMIN_EMAIL) {
      // Use timing-safe comparison to prevent email enumeration
      isAdmin = safeEmailCompare(user.email, ADMIN_EMAIL);
    }

    // Ensure minimum response time to prevent timing attacks
    const elapsed = Date.now() - startTime;
    if (elapsed < MIN_RESPONSE_TIME_MS) {
      await new Promise(resolve => setTimeout(resolve, MIN_RESPONSE_TIME_MS - elapsed));
    }

    return NextResponse.json({ isAdmin });
  } catch (err) {
    console.error('Error checking admin status:', err);

    // Ensure minimum response time even on error
    const elapsed = Date.now() - startTime;
    if (elapsed < MIN_RESPONSE_TIME_MS) {
      await new Promise(resolve => setTimeout(resolve, MIN_RESPONSE_TIME_MS - elapsed));
    }

    return NextResponse.json({ isAdmin: false });
  }
}