import { describe, it, expect } from 'vitest';
import { validateUrl, assertValidUrl } from '@/lib/url-validator';

describe('URL Validator (SSRF Prevention)', () => {
  describe('validateUrl', () => {
    describe('valid URLs', () => {
      it('should accept valid HTTPS URLs', () => {
        const result = validateUrl('https://example.com/job-posting');
        expect(result.isValid).toBe(true);
        expect(result.error).toBeUndefined();
      });

      it('should accept valid HTTP URLs', () => {
        const result = validateUrl('http://example.com/careers');
        expect(result.isValid).toBe(true);
      });

      it('should accept URLs with paths and query strings', () => {
        const result = validateUrl('https://company.com/jobs/123?ref=linkedin');
        expect(result.isValid).toBe(true);
      });

      it('should accept URLs with ports', () => {
        const result = validateUrl('https://example.com:8080/api');
        expect(result.isValid).toBe(true);
      });

      it('should accept subdomains', () => {
        const result = validateUrl('https://careers.example.com/jobs');
        expect(result.isValid).toBe(true);
      });
    });

    describe('invalid input', () => {
      it('should reject empty string', () => {
        const result = validateUrl('');
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('URL is required');
      });

      it('should reject null/undefined', () => {
        const result = validateUrl(null as unknown as string);
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('URL is required');
      });

      it('should reject malformed URLs', () => {
        const result = validateUrl('not-a-valid-url');
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('Invalid URL format');
      });

      it('should reject URLs without protocol', () => {
        const result = validateUrl('example.com/path');
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('Invalid URL format');
      });
    });

    describe('blocked protocols', () => {
      it('should reject file:// protocol', () => {
        const result = validateUrl('file:///etc/passwd');
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('Only HTTP and HTTPS URLs are allowed');
      });

      it('should reject ftp:// protocol', () => {
        const result = validateUrl('ftp://files.example.com/data');
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('Only HTTP and HTTPS URLs are allowed');
      });

      it('should reject javascript: protocol', () => {
        const result = validateUrl('javascript:alert(1)');
        expect(result.isValid).toBe(false);
      });

      it('should reject data: protocol', () => {
        const result = validateUrl('data:text/html,<script>alert(1)</script>');
        expect(result.isValid).toBe(false);
      });
    });

    describe('localhost blocking', () => {
      it('should reject localhost', () => {
        const result = validateUrl('http://localhost/admin');
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('This URL is not allowed for security reasons');
      });

      it('should reject localhost with port', () => {
        const result = validateUrl('http://localhost:3000/api');
        expect(result.isValid).toBe(false);
      });

      it('should reject 127.0.0.1', () => {
        const result = validateUrl('http://127.0.0.1/secret');
        expect(result.isValid).toBe(false);
      });

      it('should reject 127.x.x.x variations', () => {
        const result = validateUrl('http://127.1.2.3/internal');
        expect(result.isValid).toBe(false);
      });

      it('should reject 0.0.0.0', () => {
        const result = validateUrl('http://0.0.0.0/');
        expect(result.isValid).toBe(false);
      });

      it('should reject IPv6 loopback', () => {
        const result = validateUrl('http://[::1]/');
        expect(result.isValid).toBe(false);
      });
    });

    describe('private IP blocking', () => {
      it('should reject 10.x.x.x (Class A private)', () => {
        const result = validateUrl('http://10.0.0.1/internal');
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('URLs pointing to private IP addresses are not allowed');
      });

      it('should reject 172.16-31.x.x (Class B private)', () => {
        expect(validateUrl('http://172.16.0.1/').isValid).toBe(false);
        expect(validateUrl('http://172.20.5.10/').isValid).toBe(false);
        expect(validateUrl('http://172.31.255.255/').isValid).toBe(false);
      });

      it('should allow 172.15.x.x (not private)', () => {
        // 172.15 is not in the private range (only 172.16-31 is)
        const result = validateUrl('http://172.15.0.1/');
        expect(result.isValid).toBe(true);
      });

      it('should reject 192.168.x.x (Class C private)', () => {
        const result = validateUrl('http://192.168.1.1/router');
        expect(result.isValid).toBe(false);
      });

      it('should reject 169.254.x.x (link-local)', () => {
        const result = validateUrl('http://169.254.1.1/');
        expect(result.isValid).toBe(false);
      });
    });

    describe('cloud metadata endpoint blocking', () => {
      it('should reject AWS/Azure/GCP metadata endpoint (169.254.169.254)', () => {
        const result = validateUrl('http://169.254.169.254/latest/meta-data/');
        expect(result.isValid).toBe(false);
      });

      it('should reject GCP metadata endpoint', () => {
        const result = validateUrl('http://metadata.google.internal/computeMetadata/v1/');
        expect(result.isValid).toBe(false);
      });

      it('should reject Azure metadata endpoint', () => {
        const result = validateUrl('http://metadata.azure.com/metadata/instance');
        expect(result.isValid).toBe(false);
      });
    });

    describe('URL trimming', () => {
      it('should trim whitespace from URLs', () => {
        const result = validateUrl('  https://example.com/  ');
        expect(result.isValid).toBe(true);
      });
    });
  });

  describe('assertValidUrl', () => {
    it('should not throw for valid URLs', () => {
      expect(() => assertValidUrl('https://example.com')).not.toThrow();
    });

    it('should throw for invalid URLs', () => {
      expect(() => assertValidUrl('http://localhost')).toThrow('This URL is not allowed for security reasons');
    });

    it('should throw for private IPs', () => {
      expect(() => assertValidUrl('http://192.168.1.1')).toThrow('URLs pointing to private IP addresses are not allowed');
    });
  });
});
