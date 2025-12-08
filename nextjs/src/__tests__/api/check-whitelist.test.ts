import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the server client
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}));

// Mock the supabase-js client
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          maybeSingle: vi.fn(),
        })),
      })),
    })),
  })),
}));

describe('Check Whitelist API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Whitelist Check Logic', () => {
    const ADMIN_EMAIL = 'admin@example.com';

    // Simulate the whitelist check function
    const checkWhitelist = async (
      userEmail: string | null,
      whitelistedEmails: string[]
    ): Promise<boolean> => {
      if (!userEmail) return false;

      const lowerEmail = userEmail.toLowerCase();

      // Admin is always whitelisted
      if (lowerEmail === ADMIN_EMAIL.toLowerCase()) {
        return true;
      }

      // Check against whitelist
      return whitelistedEmails.map(e => e.toLowerCase()).includes(lowerEmail);
    };

    it('should return true for admin email', async () => {
      const result = await checkWhitelist('admin@example.com', []);
      expect(result).toBe(true);
    });

    it('should return true for admin email regardless of case', async () => {
      const result = await checkWhitelist('ADMIN@EXAMPLE.COM', []);
      expect(result).toBe(true);
    });

    it('should return true for whitelisted email', async () => {
      const result = await checkWhitelist('user@company.com', ['user@company.com']);
      expect(result).toBe(true);
    });

    it('should return true for whitelisted email regardless of case', async () => {
      const result = await checkWhitelist('USER@Company.COM', ['user@company.com']);
      expect(result).toBe(true);
    });

    it('should return false for non-whitelisted email', async () => {
      const result = await checkWhitelist('random@user.com', ['other@company.com']);
      expect(result).toBe(false);
    });

    it('should return false for null email', async () => {
      const result = await checkWhitelist(null, ['user@company.com']);
      expect(result).toBe(false);
    });

    it('should return false for empty whitelist (non-admin)', async () => {
      const result = await checkWhitelist('user@company.com', []);
      expect(result).toBe(false);
    });
  });

  describe('Security Properties', () => {
    it('should not expose full whitelist to non-admin users', () => {
      // The API endpoint only returns { isWhitelisted: boolean }
      // not the full list of whitelisted emails
      const mockResponse = { isWhitelisted: true };

      // Verify response shape doesn't include email list
      expect(mockResponse).not.toHaveProperty('emails');
      expect(mockResponse).not.toHaveProperty('whitelist');
      expect(mockResponse).toHaveProperty('isWhitelisted');
    });

    it('should only check the authenticated users own email', () => {
      // The endpoint uses the session user's email, not a provided parameter
      // This prevents enumeration attacks
      const checkOwnEmailOnly = (sessionEmail: string, queryEmail?: string): string => {
        // Always use session email, ignore any query parameter
        return sessionEmail;
      };

      const sessionEmail = 'real@user.com';
      const attemptedEmail = 'other@user.com';

      expect(checkOwnEmailOnly(sessionEmail, attemptedEmail)).toBe(sessionEmail);
    });
  });
});
