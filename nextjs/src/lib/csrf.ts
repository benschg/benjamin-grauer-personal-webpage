/**
 * CSRF protection utilities for API routes.
 * Uses Origin header validation for same-origin verification.
 */

import { NextRequest, NextResponse } from 'next/server';

// List of allowed origins (production and local development)
const ALLOWED_ORIGINS = [
  'https://benjamingrauer.com',
  'https://www.benjamingrauer.com',
  'http://localhost:3000',
  'http://localhost:3001',
];

/**
 * Validates the Origin header for CSRF protection.
 * Returns true if the request is from an allowed origin.
 */
export function validateOrigin(request: NextRequest): boolean {
  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');

  // For same-origin requests, Origin might not be set
  // In that case, check the Referer
  if (!origin && !referer) {
    // No origin info - could be a same-origin request or non-browser client
    // For API routes, we'll be lenient here but log for monitoring
    return true;
  }

  // Check Origin header first
  if (origin) {
    if (ALLOWED_ORIGINS.includes(origin)) {
      return true;
    }
    // Check if it's a Vercel preview deployment
    if (origin.endsWith('.vercel.app')) {
      return true;
    }
    return false;
  }

  // Fall back to Referer check
  if (referer) {
    try {
      const refererUrl = new URL(referer);
      const refererOrigin = refererUrl.origin;
      if (ALLOWED_ORIGINS.includes(refererOrigin)) {
        return true;
      }
      if (refererOrigin.endsWith('.vercel.app')) {
        return true;
      }
    } catch {
      return false;
    }
  }

  return false;
}

/**
 * CSRF protection middleware for API routes.
 * Call this at the start of POST/PUT/PATCH/DELETE handlers.
 */
export function csrfProtection(request: NextRequest): NextResponse | null {
  // Only check mutating methods
  const method = request.method.toUpperCase();
  if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    return null;
  }

  if (!validateOrigin(request)) {
    console.warn('CSRF validation failed:', {
      origin: request.headers.get('origin'),
      referer: request.headers.get('referer'),
      url: request.url,
    });
    return NextResponse.json(
      { error: 'CSRF validation failed. Request origin not allowed.' },
      { status: 403 }
    );
  }

  return null;
}
