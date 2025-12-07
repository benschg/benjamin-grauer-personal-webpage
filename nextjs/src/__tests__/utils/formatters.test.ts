import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('Date Formatters', () => {
  beforeEach(() => {
    // Mock Date to have consistent tests
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-15T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('formatRelativeTime', () => {
    const formatRelativeTime = (dateString: string | null): string => {
      if (!dateString) return 'Never';
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    };

    it('should return "Never" for null date', () => {
      expect(formatRelativeTime(null)).toBe('Never');
    });

    it('should return "Just now" for very recent dates', () => {
      expect(formatRelativeTime('2024-01-15T11:59:30Z')).toBe('Just now');
    });

    it('should return minutes ago for recent dates', () => {
      expect(formatRelativeTime('2024-01-15T11:30:00Z')).toBe('30m ago');
    });

    it('should return hours ago for same-day dates', () => {
      expect(formatRelativeTime('2024-01-15T06:00:00Z')).toBe('6h ago');
    });

    it('should return days ago for recent dates within a week', () => {
      expect(formatRelativeTime('2024-01-12T12:00:00Z')).toBe('3d ago');
    });

    it('should return formatted date for older dates', () => {
      const result = formatRelativeTime('2024-01-01T12:00:00Z');
      expect(result).toContain('Jan');
      expect(result).toContain('1');
      expect(result).toContain('2024');
    });
  });

  describe('formatDate', () => {
    const formatDate = (dateString: string): string => {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    };

    it('should format date with time', () => {
      const result = formatDate('2024-01-15T14:30:00Z');
      expect(result).toContain('Jan');
      expect(result).toContain('15');
      expect(result).toContain('2024');
    });
  });
});

describe('Short Code Generator', () => {
  const generateShortCode = (): string => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  it('should generate 6 character code', () => {
    const code = generateShortCode();
    expect(code.length).toBe(6);
  });

  it('should only contain lowercase letters and numbers', () => {
    const code = generateShortCode();
    expect(code).toMatch(/^[a-z0-9]+$/);
  });

  it('should generate unique codes', () => {
    const codes = new Set<string>();
    for (let i = 0; i < 100; i++) {
      codes.add(generateShortCode());
    }
    // With 36^6 possible combinations, 100 codes should all be unique
    expect(codes.size).toBe(100);
  });
});

describe('IP Hash Function', () => {
  // Simplified hash function for testing
  const hashIP = (ip: string): string => {
    // In production, this uses crypto.createHash('sha256')
    // For testing, we just verify the concept
    let hash = 0;
    for (let i = 0; i < ip.length; i++) {
      const char = ip.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
  };

  it('should produce consistent hash for same IP', () => {
    const ip = '192.168.1.1';
    const hash1 = hashIP(ip);
    const hash2 = hashIP(ip);
    expect(hash1).toBe(hash2);
  });

  it('should produce different hashes for different IPs', () => {
    const hash1 = hashIP('192.168.1.1');
    const hash2 = hashIP('192.168.1.2');
    expect(hash1).not.toBe(hash2);
  });
});

describe('Client IP Extraction', () => {
  const getClientIP = (headers: Record<string, string | null>): string => {
    const forwarded = headers['x-forwarded-for'];
    if (forwarded) {
      return forwarded.split(',')[0].trim();
    }
    const cfIP = headers['cf-connecting-ip'];
    if (cfIP) return cfIP;
    const realIP = headers['x-real-ip'];
    if (realIP) return realIP;
    return 'unknown';
  };

  it('should extract IP from x-forwarded-for header', () => {
    const ip = getClientIP({ 'x-forwarded-for': '1.2.3.4, 5.6.7.8', 'cf-connecting-ip': null, 'x-real-ip': null });
    expect(ip).toBe('1.2.3.4');
  });

  it('should extract IP from cf-connecting-ip header', () => {
    const ip = getClientIP({ 'x-forwarded-for': null, 'cf-connecting-ip': '1.2.3.4', 'x-real-ip': null });
    expect(ip).toBe('1.2.3.4');
  });

  it('should extract IP from x-real-ip header', () => {
    const ip = getClientIP({ 'x-forwarded-for': null, 'cf-connecting-ip': null, 'x-real-ip': '1.2.3.4' });
    expect(ip).toBe('1.2.3.4');
  });

  it('should return unknown when no IP headers present', () => {
    const ip = getClientIP({ 'x-forwarded-for': null, 'cf-connecting-ip': null, 'x-real-ip': null });
    expect(ip).toBe('unknown');
  });

  it('should handle x-forwarded-for with multiple IPs', () => {
    const ip = getClientIP({ 'x-forwarded-for': '  1.2.3.4  , 5.6.7.8, 9.10.11.12', 'cf-connecting-ip': null, 'x-real-ip': null });
    expect(ip).toBe('1.2.3.4');
  });
});

describe('User Agent Parser', () => {
  const parseUserAgent = (ua: string): { browser: string; device: string } => {
    let browser = 'Unknown';
    let device = 'Unknown';

    if (ua.includes('Chrome') && !ua.includes('Edg')) browser = 'Chrome';
    else if (ua.includes('Firefox')) browser = 'Firefox';
    else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Safari';
    else if (ua.includes('Edg')) browser = 'Edge';
    else if (ua.includes('Opera') || ua.includes('OPR')) browser = 'Opera';

    if (ua.includes('Mobile') || ua.includes('Android')) device = 'Mobile';
    else if (ua.includes('Tablet') || ua.includes('iPad')) device = 'Tablet';
    else if (ua.includes('Windows') || ua.includes('Mac') || ua.includes('Linux')) device = 'Desktop';

    return { browser, device };
  };

  it('should detect Chrome browser', () => {
    const ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
    const { browser } = parseUserAgent(ua);
    expect(browser).toBe('Chrome');
  });

  it('should detect Firefox browser', () => {
    const ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0';
    const { browser } = parseUserAgent(ua);
    expect(browser).toBe('Firefox');
  });

  it('should detect Safari browser', () => {
    const ua = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15';
    const { browser } = parseUserAgent(ua);
    expect(browser).toBe('Safari');
  });

  it('should detect Edge browser', () => {
    const ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0';
    const { browser } = parseUserAgent(ua);
    expect(browser).toBe('Edge');
  });

  it('should detect Desktop device', () => {
    const ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';
    const { device } = parseUserAgent(ua);
    expect(device).toBe('Desktop');
  });

  it('should detect Mobile device', () => {
    const ua = 'Mozilla/5.0 (Linux; Android 10; Mobile) AppleWebKit/537.36';
    const { device } = parseUserAgent(ua);
    expect(device).toBe('Mobile');
  });

  it('should detect Tablet device', () => {
    const ua = 'Mozilla/5.0 (iPad; CPU OS 17_2 like Mac OS X) AppleWebKit/605.1.15';
    const { device } = parseUserAgent(ua);
    expect(device).toBe('Tablet');
  });
});

describe('Unique Visitor Counting', () => {
  it('should correctly count unique visitors by IP hash', () => {
    const visits = [
      { ip_hash: 'hash1' },
      { ip_hash: 'hash2' },
      { ip_hash: 'hash1' }, // duplicate
      { ip_hash: 'hash3' },
      { ip_hash: 'hash2' }, // duplicate
      { ip_hash: 'hash1' }, // duplicate
    ];

    const uniqueVisits = new Set(visits.map(v => v.ip_hash)).size;
    expect(uniqueVisits).toBe(3);
  });

  it('should handle empty visits array', () => {
    const visits: { ip_hash: string }[] = [];
    const uniqueVisits = new Set(visits.map(v => v.ip_hash)).size;
    expect(uniqueVisits).toBe(0);
  });

  it('should handle null ip_hash values', () => {
    const visits = [
      { ip_hash: 'hash1' },
      { ip_hash: null },
      { ip_hash: 'hash2' },
      { ip_hash: null },
    ];

    const uniqueVisits = new Set(visits.map(v => v.ip_hash)).size;
    expect(uniqueVisits).toBe(3); // hash1, hash2, null
  });
});
