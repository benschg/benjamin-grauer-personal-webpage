import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest, NextResponse } from 'next/server';
import { validateOrigin, csrfProtection } from '@/lib/csrf';

// Helper to create mock NextRequest
function createMockRequest(
  method: string,
  url: string = 'https://benjamingrauer.com/api/test',
  headers: Record<string, string> = {}
): NextRequest {
  const request = new NextRequest(url, {
    method,
    headers: new Headers(headers),
  });
  return request;
}

describe('CSRF Protection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('validateOrigin', () => {
    describe('allowed origins', () => {
      it('should allow production origin', () => {
        const request = createMockRequest('POST', 'https://benjamingrauer.com/api/test', {
          origin: 'https://benjamingrauer.com',
        });
        expect(validateOrigin(request)).toBe(true);
      });

      it('should allow www production origin', () => {
        const request = createMockRequest('POST', 'https://benjamingrauer.com/api/test', {
          origin: 'https://www.benjamingrauer.com',
        });
        expect(validateOrigin(request)).toBe(true);
      });

      it('should allow localhost:3000', () => {
        const request = createMockRequest('POST', 'http://localhost:3000/api/test', {
          origin: 'http://localhost:3000',
        });
        expect(validateOrigin(request)).toBe(true);
      });

      it('should allow localhost:3001', () => {
        const request = createMockRequest('POST', 'http://localhost:3001/api/test', {
          origin: 'http://localhost:3001',
        });
        expect(validateOrigin(request)).toBe(true);
      });

      it('should allow Vercel preview deployments', () => {
        const request = createMockRequest('POST', 'https://preview.vercel.app/api/test', {
          origin: 'https://my-app-preview-xyz.vercel.app',
        });
        expect(validateOrigin(request)).toBe(true);
      });
    });

    describe('blocked origins', () => {
      it('should block unknown origins', () => {
        const request = createMockRequest('POST', 'https://benjamingrauer.com/api/test', {
          origin: 'https://evil-site.com',
        });
        expect(validateOrigin(request)).toBe(false);
      });

      it('should block similar but different domains', () => {
        const request = createMockRequest('POST', 'https://benjamingrauer.com/api/test', {
          origin: 'https://benjamingrauer.evil.com',
        });
        expect(validateOrigin(request)).toBe(false);
      });

      it('should block http when https is expected', () => {
        const request = createMockRequest('POST', 'https://benjamingrauer.com/api/test', {
          origin: 'http://benjamingrauer.com',
        });
        expect(validateOrigin(request)).toBe(false);
      });

      it('should block localhost with wrong port', () => {
        const request = createMockRequest('POST', 'http://localhost:3000/api/test', {
          origin: 'http://localhost:8080',
        });
        expect(validateOrigin(request)).toBe(false);
      });
    });

    describe('referer fallback', () => {
      it('should accept valid referer when origin is missing', () => {
        const request = createMockRequest('POST', 'https://benjamingrauer.com/api/test', {
          referer: 'https://benjamingrauer.com/working-life',
        });
        expect(validateOrigin(request)).toBe(true);
      });

      it('should accept Vercel preview referer', () => {
        const request = createMockRequest('POST', 'https://preview.vercel.app/api/test', {
          referer: 'https://my-app-xyz.vercel.app/page',
        });
        expect(validateOrigin(request)).toBe(true);
      });

      it('should reject invalid referer', () => {
        const request = createMockRequest('POST', 'https://benjamingrauer.com/api/test', {
          referer: 'https://evil-site.com/attack',
        });
        expect(validateOrigin(request)).toBe(false);
      });

      it('should handle malformed referer gracefully', () => {
        const request = createMockRequest('POST', 'https://benjamingrauer.com/api/test', {
          referer: 'not-a-valid-url',
        });
        expect(validateOrigin(request)).toBe(false);
      });
    });

    describe('no origin info', () => {
      it('should allow requests with no origin or referer (same-origin)', () => {
        const request = createMockRequest('POST', 'https://benjamingrauer.com/api/test');
        expect(validateOrigin(request)).toBe(true);
      });
    });

    describe('origin takes precedence', () => {
      it('should use origin even when referer is also present', () => {
        const request = createMockRequest('POST', 'https://benjamingrauer.com/api/test', {
          origin: 'https://benjamingrauer.com',
          referer: 'https://evil-site.com/attack',
        });
        expect(validateOrigin(request)).toBe(true);
      });

      it('should block by origin even with valid referer', () => {
        const request = createMockRequest('POST', 'https://benjamingrauer.com/api/test', {
          origin: 'https://evil-site.com',
          referer: 'https://benjamingrauer.com/page',
        });
        expect(validateOrigin(request)).toBe(false);
      });
    });
  });

  describe('csrfProtection', () => {
    describe('safe methods (no check needed)', () => {
      it('should allow GET requests without validation', () => {
        const request = createMockRequest('GET', 'https://benjamingrauer.com/api/test', {
          origin: 'https://evil-site.com',
        });
        expect(csrfProtection(request)).toBeNull();
      });

      it('should allow HEAD requests without validation', () => {
        const request = createMockRequest('HEAD', 'https://benjamingrauer.com/api/test', {
          origin: 'https://evil-site.com',
        });
        expect(csrfProtection(request)).toBeNull();
      });

      it('should allow OPTIONS requests without validation', () => {
        const request = createMockRequest('OPTIONS', 'https://benjamingrauer.com/api/test', {
          origin: 'https://evil-site.com',
        });
        expect(csrfProtection(request)).toBeNull();
      });
    });

    describe('mutating methods (require validation)', () => {
      it('should allow POST with valid origin', () => {
        const request = createMockRequest('POST', 'https://benjamingrauer.com/api/test', {
          origin: 'https://benjamingrauer.com',
        });
        expect(csrfProtection(request)).toBeNull();
      });

      it('should allow PUT with valid origin', () => {
        const request = createMockRequest('PUT', 'https://benjamingrauer.com/api/test', {
          origin: 'https://benjamingrauer.com',
        });
        expect(csrfProtection(request)).toBeNull();
      });

      it('should allow PATCH with valid origin', () => {
        const request = createMockRequest('PATCH', 'https://benjamingrauer.com/api/test', {
          origin: 'https://benjamingrauer.com',
        });
        expect(csrfProtection(request)).toBeNull();
      });

      it('should allow DELETE with valid origin', () => {
        const request = createMockRequest('DELETE', 'https://benjamingrauer.com/api/test', {
          origin: 'https://benjamingrauer.com',
        });
        expect(csrfProtection(request)).toBeNull();
      });

      it('should block POST with invalid origin', () => {
        const request = createMockRequest('POST', 'https://benjamingrauer.com/api/test', {
          origin: 'https://evil-site.com',
        });
        const response = csrfProtection(request);
        expect(response).toBeInstanceOf(NextResponse);
        expect(response?.status).toBe(403);
      });

      it('should block PUT with invalid origin', () => {
        const request = createMockRequest('PUT', 'https://benjamingrauer.com/api/test', {
          origin: 'https://evil-site.com',
        });
        const response = csrfProtection(request);
        expect(response).toBeInstanceOf(NextResponse);
        expect(response?.status).toBe(403);
      });

      it('should block PATCH with invalid origin', () => {
        const request = createMockRequest('PATCH', 'https://benjamingrauer.com/api/test', {
          origin: 'https://evil-site.com',
        });
        const response = csrfProtection(request);
        expect(response).toBeInstanceOf(NextResponse);
        expect(response?.status).toBe(403);
      });

      it('should block DELETE with invalid origin', () => {
        const request = createMockRequest('DELETE', 'https://benjamingrauer.com/api/test', {
          origin: 'https://evil-site.com',
        });
        const response = csrfProtection(request);
        expect(response).toBeInstanceOf(NextResponse);
        expect(response?.status).toBe(403);
      });
    });

    describe('error response format', () => {
      it('should return proper error message', async () => {
        const request = createMockRequest('POST', 'https://benjamingrauer.com/api/test', {
          origin: 'https://evil-site.com',
        });
        const response = csrfProtection(request);
        expect(response).not.toBeNull();

        const body = await response!.json();
        expect(body.error).toBe('CSRF validation failed. Request origin not allowed.');
      });
    });

    describe('case insensitivity', () => {
      it('should handle lowercase method', () => {
        // NextRequest normalizes methods, but test the logic
        const request = createMockRequest('post', 'https://benjamingrauer.com/api/test', {
          origin: 'https://evil-site.com',
        });
        const response = csrfProtection(request);
        expect(response).toBeInstanceOf(NextResponse);
        expect(response?.status).toBe(403);
      });
    });
  });
});
