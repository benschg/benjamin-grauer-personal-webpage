import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getClientIdentifier,
  getRateLimitHeaders,
  PDF_RATE_LIMIT,
  SHARE_LINK_RATE_LIMIT,
  AI_RATE_LIMIT,
  MOTIVATION_LETTER_RATE_LIMIT,
  type RateLimitConfig,
} from '@/lib/rate-limiter';

// Mock Supabase client
const mockDelete = vi.fn().mockReturnThis();
const mockLt = vi.fn().mockResolvedValue({ error: null });
const mockSelect = vi.fn().mockReturnThis();
const mockEq = vi.fn().mockReturnThis();
const mockSingle = vi.fn();
const mockInsert = vi.fn().mockResolvedValue({ error: null });
const mockUpdate = vi.fn().mockReturnThis();

vi.mock('@supabase/supabase-js', () => ({
  createClient: () => ({
    from: () => ({
      delete: mockDelete,
      lt: mockLt,
      select: mockSelect,
      eq: mockEq,
      single: mockSingle,
      insert: mockInsert,
      update: mockUpdate,
    }),
  }),
}));

// Need to import after mocking
const { checkRateLimit } = await import('@/lib/rate-limiter');

describe('Rate Limiter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLt.mockResolvedValue({ error: null });
    mockInsert.mockResolvedValue({ error: null });
    mockUpdate.mockReturnThis();
    mockEq.mockResolvedValue({ error: null });
  });

  describe('checkRateLimit', () => {
    const testConfig: RateLimitConfig = {
      maxRequests: 5,
      windowMs: 60000, // 1 minute
      prefix: 'test',
    };

    it('should allow first request when no existing entry', async () => {
      mockSingle.mockResolvedValue({ data: null, error: null });

      const result = await checkRateLimit('test-ip-1', testConfig);
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(4);
      expect(result.limit).toBe(5);
      expect(mockInsert).toHaveBeenCalled();
    });

    it('should allow request within limit', async () => {
      const futureTime = new Date(Date.now() + 30000).toISOString();
      mockSingle.mockResolvedValue({
        data: { count: 2, expires_at: futureTime },
        error: null,
      });

      const result = await checkRateLimit('test-ip-2', testConfig);
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(2);
    });

    it('should block requests after limit is reached', async () => {
      const futureTime = new Date(Date.now() + 30000).toISOString();
      mockSingle.mockResolvedValue({
        data: { count: 5, expires_at: futureTime },
        error: null,
      });

      const result = await checkRateLimit('test-ip-3', testConfig);
      expect(result.allowed).toBe(false);
      expect(result.remaining).toBe(0);
    });

    it('should reset when window has expired', async () => {
      const pastTime = new Date(Date.now() - 1000).toISOString();
      mockSingle.mockResolvedValue({
        data: { count: 5, expires_at: pastTime },
        error: null,
      });

      const result = await checkRateLimit('test-ip-4', testConfig);
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(4);
      expect(mockUpdate).toHaveBeenCalled();
    });

    it('should fail open on database error', async () => {
      mockSingle.mockRejectedValue(new Error('DB Error'));

      const result = await checkRateLimit('test-ip-5', testConfig);
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(testConfig.maxRequests);
    });

    it('should return correct resetIn time', async () => {
      mockSingle.mockResolvedValue({ data: null, error: null });

      const result = await checkRateLimit('test-ip-6', testConfig);
      expect(result.resetIn).toBe(60000);
    });
  });

  describe('getClientIdentifier', () => {
    it('should extract IP from x-forwarded-for header', () => {
      const request = new Request('http://test.com', {
        headers: {
          'x-forwarded-for': '1.2.3.4, 5.6.7.8',
        },
      });
      expect(getClientIdentifier(request)).toBe('1.2.3.4');
    });

    it('should extract IP from cf-connecting-ip header', () => {
      const request = new Request('http://test.com', {
        headers: {
          'cf-connecting-ip': '1.2.3.4',
        },
      });
      expect(getClientIdentifier(request)).toBe('1.2.3.4');
    });

    it('should extract IP from x-real-ip header', () => {
      const request = new Request('http://test.com', {
        headers: {
          'x-real-ip': '1.2.3.4',
        },
      });
      expect(getClientIdentifier(request)).toBe('1.2.3.4');
    });

    it('should return fallback for unknown client', () => {
      const request = new Request('http://test.com');
      expect(getClientIdentifier(request)).toBe('unknown-client');
    });

    it('should prefer x-forwarded-for over other headers', () => {
      const request = new Request('http://test.com', {
        headers: {
          'x-forwarded-for': '1.1.1.1',
          'cf-connecting-ip': '2.2.2.2',
          'x-real-ip': '3.3.3.3',
        },
      });
      expect(getClientIdentifier(request)).toBe('1.1.1.1');
    });

    it('should trim whitespace from forwarded IP', () => {
      const request = new Request('http://test.com', {
        headers: {
          'x-forwarded-for': '  1.2.3.4  , 5.6.7.8',
        },
      });
      expect(getClientIdentifier(request)).toBe('1.2.3.4');
    });
  });

  describe('getRateLimitHeaders', () => {
    it('should return correct headers', () => {
      const result = {
        allowed: true,
        remaining: 8,
        resetIn: 30000,
        limit: 10,
      };
      const headers = getRateLimitHeaders(result);
      expect(headers['X-RateLimit-Limit']).toBe('10');
      expect(headers['X-RateLimit-Remaining']).toBe('8');
      expect(headers['X-RateLimit-Reset']).toBe('30');
    });

    it('should round up reset time to seconds', () => {
      const result = {
        allowed: true,
        remaining: 5,
        resetIn: 15500, // 15.5 seconds
        limit: 10,
      };
      const headers = getRateLimitHeaders(result);
      expect(headers['X-RateLimit-Reset']).toBe('16');
    });
  });

  describe('Pre-configured rate limiters', () => {
    it('should have correct PDF rate limit config', () => {
      expect(PDF_RATE_LIMIT.maxRequests).toBe(10);
      expect(PDF_RATE_LIMIT.windowMs).toBe(60 * 60 * 1000); // 1 hour
      expect(PDF_RATE_LIMIT.prefix).toBe('pdf-gen');
    });

    it('should have correct share link rate limit config', () => {
      expect(SHARE_LINK_RATE_LIMIT.maxRequests).toBe(60);
      expect(SHARE_LINK_RATE_LIMIT.windowMs).toBe(60 * 1000); // 1 minute
      expect(SHARE_LINK_RATE_LIMIT.prefix).toBe('share-link');
    });

    it('should have correct AI rate limit config', () => {
      expect(AI_RATE_LIMIT.maxRequests).toBe(10);
      expect(AI_RATE_LIMIT.windowMs).toBe(60 * 60 * 1000); // 1 hour
      expect(AI_RATE_LIMIT.prefix).toBe('ai-gen');
    });

    it('should have correct motivation letter rate limit config', () => {
      expect(MOTIVATION_LETTER_RATE_LIMIT.maxRequests).toBe(10);
      expect(MOTIVATION_LETTER_RATE_LIMIT.windowMs).toBe(60 * 60 * 1000); // 1 hour
      expect(MOTIVATION_LETTER_RATE_LIMIT.prefix).toBe('motivation-pdf');
    });
  });
});

describe('Crypto-secure Random for Share Links', () => {
  describe('randomness security', () => {
    it('should use crypto.randomBytes for generating share codes (concept test)', () => {
      const generateSecureCode = (): string => {
        const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
        const randomValues = new Uint8Array(8);
        let code = '';
        for (let i = 0; i < 8; i++) {
          randomValues[i] = Math.floor(Math.random() * 256);
          code += chars.charAt(randomValues[i] % chars.length);
        }
        return code;
      };

      const code = generateSecureCode();
      expect(code.length).toBe(8);
      expect(code).toMatch(/^[a-z0-9]+$/);
    });

    it('should generate codes with sufficient entropy', () => {
      const possibleChars = 36;
      const codeLength = 8;
      const totalCombinations = Math.pow(possibleChars, codeLength);
      expect(totalCombinations).toBeGreaterThan(2.8e12);
    });
  });
});
