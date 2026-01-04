/**
 * Supabase-based rate limiter for API routes.
 * Uses sliding window approach with database storage for distributed environments.
 * Works across serverless instances on Vercel.
 */

import { createClient } from '@supabase/supabase-js';

// Create admin client for rate limiting (uses service role)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export interface RateLimitConfig {
  /** Maximum number of requests allowed in the window */
  maxRequests: number;
  /** Time window in milliseconds */
  windowMs: number;
  /** Identifier prefix to separate different rate limiters */
  prefix?: string;
}

export interface RateLimitResult {
  /** Whether the request is allowed */
  allowed: boolean;
  /** Number of requests remaining in the current window */
  remaining: number;
  /** Time in milliseconds until the rate limit resets */
  resetIn: number;
  /** Total requests allowed */
  limit: number;
}

/**
 * Get the client identifier from a request.
 * Uses X-Forwarded-For header (set by Vercel/proxies) or falls back to a default.
 */
export function getClientIdentifier(request: Request): string {
  // Vercel and most proxies set X-Forwarded-For
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    // X-Forwarded-For can contain multiple IPs; use the first one (client IP)
    return forwardedFor.split(',')[0].trim();
  }

  // Cloudflare uses CF-Connecting-IP
  const cfIp = request.headers.get('cf-connecting-ip');
  if (cfIp) {
    return cfIp;
  }

  // X-Real-IP is another common header
  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }

  // Fallback - in development or direct connections
  return 'unknown-client';
}

/**
 * Check rate limit for a given identifier using Supabase.
 * This works across serverless instances.
 *
 * @param identifier - Client identifier (usually IP address)
 * @param config - Rate limit configuration
 * @param failClosed - If true, deny requests when database errors occur (default: false for backwards compatibility)
 */
export async function checkRateLimit(
  identifier: string,
  config: RateLimitConfig,
  failClosed: boolean = false
): Promise<RateLimitResult> {
  const key = config.prefix ? `${config.prefix}:${identifier}` : identifier;
  const now = new Date();
  const expiresAt = new Date(now.getTime() + config.windowMs);

  try {
    // First, cleanup any expired entries for this key
    await supabaseAdmin
      .from('rate_limits')
      .delete()
      .lt('expires_at', now.toISOString());

    // Try to get existing entry
    const { data: existing } = await supabaseAdmin
      .from('rate_limits')
      .select('*')
      .eq('key', key)
      .single();

    if (!existing) {
      // No existing entry, create new one
      await supabaseAdmin.from('rate_limits').insert({
        key,
        count: 1,
        window_start: now.toISOString(),
        expires_at: expiresAt.toISOString(),
      });

      return {
        allowed: true,
        remaining: config.maxRequests - 1,
        resetIn: config.windowMs,
        limit: config.maxRequests,
      };
    }

    // Check if window has expired
    const windowExpiry = new Date(existing.expires_at);
    if (windowExpiry < now) {
      // Window expired, reset
      await supabaseAdmin
        .from('rate_limits')
        .update({
          count: 1,
          window_start: now.toISOString(),
          expires_at: expiresAt.toISOString(),
        })
        .eq('key', key);

      return {
        allowed: true,
        remaining: config.maxRequests - 1,
        resetIn: config.windowMs,
        limit: config.maxRequests,
      };
    }

    // Check if limit exceeded
    if (existing.count >= config.maxRequests) {
      const resetIn = windowExpiry.getTime() - now.getTime();
      return {
        allowed: false,
        remaining: 0,
        resetIn: Math.max(0, resetIn),
        limit: config.maxRequests,
      };
    }

    // Increment count
    const newCount = existing.count + 1;
    await supabaseAdmin
      .from('rate_limits')
      .update({ count: newCount })
      .eq('key', key);

    const resetIn = windowExpiry.getTime() - now.getTime();
    return {
      allowed: true,
      remaining: config.maxRequests - newCount,
      resetIn: Math.max(0, resetIn),
      limit: config.maxRequests,
    };
  } catch (error) {
    // On database error, behavior depends on failClosed parameter
    console.error('Rate limit check failed:', error);

    if (failClosed) {
      // Fail closed: deny request on database error (more secure for admin endpoints)
      console.warn('[RATE_LIMIT] Fail-closed mode: blocking request due to database error');
      return {
        allowed: false,
        remaining: 0,
        resetIn: config.windowMs,
        limit: config.maxRequests,
      };
    }

    // Fail open: allow request but log (backwards-compatible default)
    return {
      allowed: true,
      remaining: config.maxRequests,
      resetIn: config.windowMs,
      limit: config.maxRequests,
    };
  }
}

/**
 * Create rate limit response headers.
 */
export function getRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    'X-RateLimit-Limit': result.limit.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': Math.ceil(result.resetIn / 1000).toString(),
  };
}

// Pre-configured rate limiter for PDF generation
// 10 PDFs per hour per IP address
export const PDF_RATE_LIMIT: RateLimitConfig = {
  maxRequests: 10,
  windowMs: 60 * 60 * 1000, // 1 hour
  prefix: 'pdf-gen',
};

// Pre-configured rate limiter for share link redirects
// 60 requests per minute per IP (prevents brute-force enumeration)
export const SHARE_LINK_RATE_LIMIT: RateLimitConfig = {
  maxRequests: 60,
  windowMs: 60 * 1000, // 1 minute
  prefix: 'share-link',
};

// Pre-configured rate limiter for AI generation endpoints
// 10 requests per hour per IP (prevents API quota exhaustion and high costs)
export const AI_RATE_LIMIT: RateLimitConfig = {
  maxRequests: 10,
  windowMs: 60 * 60 * 1000, // 1 hour
  prefix: 'ai-gen',
};

// Pre-configured rate limiter for motivation letter PDF generation
// Same as PDF rate limit: 10 per hour per IP
export const MOTIVATION_LETTER_RATE_LIMIT: RateLimitConfig = {
  maxRequests: 10,
  windowMs: 60 * 60 * 1000, // 1 hour
  prefix: 'motivation-pdf',
};
