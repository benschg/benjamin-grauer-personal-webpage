import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

// Mock Supabase client
const mockInsert = vi.fn();

vi.mock('@supabase/supabase-js', () => ({
  createClient: () => ({
    from: () => ({
      insert: mockInsert,
    }),
  }),
}));

// Import after mocking
const { logAuditEvent } = await import('@/lib/audit-logger');
import type { AuditLogEntry, AuditAction, ResourceType } from '@/lib/audit-logger';

// Helper to create mock NextRequest
function createMockRequest(headers: Record<string, string> = {}): NextRequest {
  return new NextRequest('https://benjamingrauer.com/api/test', {
    method: 'POST',
    headers: new Headers(headers),
  });
}

describe('Audit Logger', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockInsert.mockResolvedValue({ error: null });
  });

  describe('logAuditEvent', () => {
    describe('basic logging', () => {
      it('should log an audit event with required fields', async () => {
        const entry: AuditLogEntry = {
          userEmail: 'admin@example.com',
          action: 'CREATE',
          resourceType: 'whitelisted_emails',
        };

        await logAuditEvent(entry);

        expect(mockInsert).toHaveBeenCalledWith({
          user_email: 'admin@example.com',
          user_id: null,
          action: 'CREATE',
          resource_type: 'whitelisted_emails',
          resource_id: null,
          details: null,
          ip_address: null,
          user_agent: null,
        });
      });

      it('should log event with all optional fields', async () => {
        const request = createMockRequest({
          'x-forwarded-for': '1.2.3.4',
          'user-agent': 'Mozilla/5.0 Test Browser',
        });

        const entry: AuditLogEntry = {
          userEmail: 'admin@example.com',
          userId: 'user-123',
          action: 'UPDATE',
          resourceType: 'site_settings',
          resourceId: 'settings-1',
          details: { field: 'email', oldValue: 'old@test.com', newValue: 'new@test.com' },
          request,
        };

        await logAuditEvent(entry);

        expect(mockInsert).toHaveBeenCalledWith({
          user_email: 'admin@example.com',
          user_id: 'user-123',
          action: 'UPDATE',
          resource_type: 'site_settings',
          resource_id: 'settings-1',
          details: { field: 'email', oldValue: 'old@test.com', newValue: 'new@test.com' },
          ip_address: '1.2.3.4',
          user_agent: 'Mozilla/5.0 Test Browser',
        });
      });
    });

    describe('action types', () => {
      const actions: AuditAction[] = ['CREATE', 'UPDATE', 'DELETE'];

      actions.forEach((action) => {
        it(`should support ${action} action`, async () => {
          await logAuditEvent({
            userEmail: 'test@example.com',
            action,
            resourceType: 'cv_references',
          });

          expect(mockInsert).toHaveBeenCalledWith(
            expect.objectContaining({ action })
          );
        });
      });
    });

    describe('resource types', () => {
      const resourceTypes: ResourceType[] = [
        'whitelisted_emails',
        'site_settings',
        'cv_references',
        'share_links',
        'cv_versions',
      ];

      resourceTypes.forEach((resourceType) => {
        it(`should support ${resourceType} resource type`, async () => {
          await logAuditEvent({
            userEmail: 'test@example.com',
            action: 'CREATE',
            resourceType,
          });

          expect(mockInsert).toHaveBeenCalledWith(
            expect.objectContaining({ resource_type: resourceType })
          );
        });
      });
    });

    describe('IP address extraction', () => {
      it('should extract IP from x-forwarded-for header', async () => {
        const request = createMockRequest({
          'x-forwarded-for': '192.168.1.1, 10.0.0.1',
        });

        await logAuditEvent({
          userEmail: 'test@example.com',
          action: 'CREATE',
          resourceType: 'whitelisted_emails',
          request,
        });

        expect(mockInsert).toHaveBeenCalledWith(
          expect.objectContaining({ ip_address: '192.168.1.1' })
        );
      });

      it('should extract IP from cf-connecting-ip header', async () => {
        const request = createMockRequest({
          'cf-connecting-ip': '203.0.113.1',
        });

        await logAuditEvent({
          userEmail: 'test@example.com',
          action: 'CREATE',
          resourceType: 'whitelisted_emails',
          request,
        });

        expect(mockInsert).toHaveBeenCalledWith(
          expect.objectContaining({ ip_address: '203.0.113.1' })
        );
      });

      it('should extract IP from x-real-ip header', async () => {
        const request = createMockRequest({
          'x-real-ip': '198.51.100.1',
        });

        await logAuditEvent({
          userEmail: 'test@example.com',
          action: 'CREATE',
          resourceType: 'whitelisted_emails',
          request,
        });

        expect(mockInsert).toHaveBeenCalledWith(
          expect.objectContaining({ ip_address: '198.51.100.1' })
        );
      });

      it('should prefer x-forwarded-for over other headers', async () => {
        const request = createMockRequest({
          'x-forwarded-for': '1.1.1.1',
          'cf-connecting-ip': '2.2.2.2',
          'x-real-ip': '3.3.3.3',
        });

        await logAuditEvent({
          userEmail: 'test@example.com',
          action: 'CREATE',
          resourceType: 'whitelisted_emails',
          request,
        });

        expect(mockInsert).toHaveBeenCalledWith(
          expect.objectContaining({ ip_address: '1.1.1.1' })
        );
      });

      it('should return null when no IP headers present', async () => {
        const request = createMockRequest({});

        await logAuditEvent({
          userEmail: 'test@example.com',
          action: 'CREATE',
          resourceType: 'whitelisted_emails',
          request,
        });

        expect(mockInsert).toHaveBeenCalledWith(
          expect.objectContaining({ ip_address: null })
        );
      });
    });

    describe('user agent handling', () => {
      it('should extract user agent from request', async () => {
        const request = createMockRequest({
          'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        });

        await logAuditEvent({
          userEmail: 'test@example.com',
          action: 'CREATE',
          resourceType: 'whitelisted_emails',
          request,
        });

        expect(mockInsert).toHaveBeenCalledWith(
          expect.objectContaining({
            user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          })
        );
      });

      it('should truncate long user agents to 500 chars', async () => {
        const longUserAgent = 'A'.repeat(600);
        const request = createMockRequest({
          'user-agent': longUserAgent,
        });

        await logAuditEvent({
          userEmail: 'test@example.com',
          action: 'CREATE',
          resourceType: 'whitelisted_emails',
          request,
        });

        expect(mockInsert).toHaveBeenCalledWith(
          expect.objectContaining({
            user_agent: 'A'.repeat(500),
          })
        );
      });

      it('should return null when no user agent present', async () => {
        const request = createMockRequest({});

        await logAuditEvent({
          userEmail: 'test@example.com',
          action: 'CREATE',
          resourceType: 'whitelisted_emails',
          request,
        });

        expect(mockInsert).toHaveBeenCalledWith(
          expect.objectContaining({ user_agent: null })
        );
      });
    });

    describe('error handling', () => {
      it('should not throw on database error', async () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        mockInsert.mockResolvedValue({ error: new Error('DB error') });

        await expect(
          logAuditEvent({
            userEmail: 'test@example.com',
            action: 'CREATE',
            resourceType: 'whitelisted_emails',
          })
        ).resolves.toBeUndefined();

        expect(consoleSpy).toHaveBeenCalled();
        consoleSpy.mockRestore();
      });

      it('should not throw on unexpected error', async () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        mockInsert.mockRejectedValue(new Error('Unexpected error'));

        await expect(
          logAuditEvent({
            userEmail: 'test@example.com',
            action: 'CREATE',
            resourceType: 'whitelisted_emails',
          })
        ).resolves.toBeUndefined();

        expect(consoleSpy).toHaveBeenCalled();
        consoleSpy.mockRestore();
      });
    });

    describe('no request provided', () => {
      it('should handle missing request gracefully', async () => {
        await logAuditEvent({
          userEmail: 'test@example.com',
          action: 'DELETE',
          resourceType: 'cv_versions',
          resourceId: 'version-123',
        });

        expect(mockInsert).toHaveBeenCalledWith({
          user_email: 'test@example.com',
          user_id: null,
          action: 'DELETE',
          resource_type: 'cv_versions',
          resource_id: 'version-123',
          details: null,
          ip_address: null,
          user_agent: null,
        });
      });
    });
  });
});
