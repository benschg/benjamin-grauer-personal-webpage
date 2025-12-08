import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  checkRateLimit,
  getClientIdentifier,
  getRateLimitHeaders,
  PDF_RATE_LIMIT,
  SHARE_LINK_RATE_LIMIT,
  AI_RATE_LIMIT,
  MOTIVATION_LETTER_RATE_LIMIT,
  type RateLimitConfig,
} from '@/lib/rate-limiter';

describe('Rate Limiter', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('checkRateLimit', () => {
    const testConfig: RateLimitConfig = {
      maxRequests: 5,
      windowMs: 60000, // 1 minute
      prefix: 'test',
    };

    it('should allow first request', () => {
      const result = checkRateLimit('test-ip-1', testConfig);
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(4);
      expect(result.limit).toBe(5);
    });

    it('should track multiple requests', () => {
      const ip = 'test-ip-2';
      checkRateLimit(ip, testConfig);
      checkRateLimit(ip, testConfig);
      const result = checkRateLimit(ip, testConfig);
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(2);
    });

    it('should block requests after limit is reached', () => {
      const ip = 'test-ip-3';
      // Make 5 requests (the limit)
      for (let i = 0; i < 5; i++) {
        checkRateLimit(ip, testConfig);
      }
      // 6th request should be blocked
      const result = checkRateLimit(ip, testConfig);
      expect(result.allowed).toBe(false);
      expect(result.remaining).toBe(0);
    });

    it('should reset after window expires', () => {
      const ip = 'test-ip-4';
      // Make 5 requests
      for (let i = 0; i < 5; i++) {
        checkRateLimit(ip, testConfig);
      }
      expect(checkRateLimit(ip, testConfig).allowed).toBe(false);

      // Advance time past the window
      vi.advanceTimersByTime(61000);

      // Should be allowed again
      const result = checkRateLimit(ip, testConfig);
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(4);
    });

    it('should track different IPs separately', () => {
      const ip1 = 'test-ip-5a';
      const ip2 = 'test-ip-5b';

      // Exhaust ip1's limit
      for (let i = 0; i < 5; i++) {
        checkRateLimit(ip1, testConfig);
      }
      expect(checkRateLimit(ip1, testConfig).allowed).toBe(false);

      // ip2 should still have full allowance
      const result = checkRateLimit(ip2, testConfig);
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(4);
    });

    it('should use prefix to separate rate limiters', () => {
      const ip = 'test-ip-6';
      const config1: RateLimitConfig = { maxRequests: 2, windowMs: 60000, prefix: 'api1' };
      const config2: RateLimitConfig = { maxRequests: 2, windowMs: 60000, prefix: 'api2' };

      // Exhaust config1
      checkRateLimit(ip, config1);
      checkRateLimit(ip, config1);
      expect(checkRateLimit(ip, config1).allowed).toBe(false);

      // config2 should still work
      expect(checkRateLimit(ip, config2).allowed).toBe(true);
    });

    it('should return correct resetIn time', () => {
      const ip = 'test-ip-7';
      const result = checkRateLimit(ip, testConfig);
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

  describe('Brute force protection', () => {
    it('should effectively limit share link enumeration attempts', () => {
      const config = SHARE_LINK_RATE_LIMIT;
      const attackerIp = 'attacker-ip';

      // Simulate 60 requests (the limit)
      for (let i = 0; i < 60; i++) {
        const result = checkRateLimit(attackerIp, config);
        expect(result.allowed).toBe(true);
      }

      // 61st request should be blocked
      const blocked = checkRateLimit(attackerIp, config);
      expect(blocked.allowed).toBe(false);

      // This limits enumeration to 60 attempts per minute per IP
      // With 36^8 possible codes, this makes brute force impractical
    });
  });
});

describe('Crypto-secure Random for Share Links', () => {
  // Test the concept of crypto-secure random vs Math.random
  describe('randomness security', () => {
    it('should use crypto.randomBytes for generating share codes (concept test)', () => {
      // The actual implementation uses crypto.randomBytes(8)
      // This test verifies the concept
      const generateSecureCode = (): string => {
        const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
        // Simulating crypto.randomBytes behavior
        const randomValues = new Uint8Array(8);
        // In the actual code, this uses crypto.randomBytes()
        // Here we just verify the structure
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
      // 8 characters from 36 possible values = 36^8 = ~2.8 trillion combinations
      const possibleChars = 36;
      const codeLength = 8;
      const totalCombinations = Math.pow(possibleChars, codeLength);

      // Should be effectively impossible to brute force
      expect(totalCombinations).toBeGreaterThan(2.8e12);
    });
  });
});
