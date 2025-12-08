/**
 * URL validation utilities to prevent SSRF (Server-Side Request Forgery) attacks.
 * Blocks requests to internal networks, localhost, and cloud metadata endpoints.
 */

// Private IP ranges that should never be fetched
const PRIVATE_IP_RANGES = [
  /^127\.\d{1,3}\.\d{1,3}\.\d{1,3}$/, // Loopback (127.0.0.0/8)
  /^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/, // Private Class A (10.0.0.0/8)
  /^172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}$/, // Private Class B (172.16.0.0/12)
  /^192\.168\.\d{1,3}\.\d{1,3}$/, // Private Class C (192.168.0.0/16)
  /^169\.254\.\d{1,3}\.\d{1,3}$/, // Link-local (169.254.0.0/16)
  /^0\.0\.0\.0$/, // All interfaces
  /^::1$/, // IPv6 loopback
  /^fc00:/, // IPv6 private
  /^fe80:/, // IPv6 link-local
];

// Blocked hostnames
const BLOCKED_HOSTNAMES = [
  'localhost',
  '0.0.0.0',
  '[::1]',
  'metadata.google.internal', // GCP metadata
  '169.254.169.254', // AWS/Azure/GCP metadata endpoint
  'metadata.azure.com', // Azure metadata
];

// Blocked URL patterns (cloud metadata, internal services)
const BLOCKED_URL_PATTERNS = [
  /^https?:\/\/169\.254\.169\.254/, // Cloud metadata endpoint
  /^https?:\/\/metadata\.google\.internal/,
  /^https?:\/\/metadata\.azure\.com/,
  /^https?:\/\/localhost/i,
  /^https?:\/\/127\./,
  /^https?:\/\/0\.0\.0\.0/,
  /^https?:\/\/\[::1\]/,
  /^file:\/\//i, // Block file:// protocol
  /^ftp:\/\//i, // Block FTP
  /^gopher:\/\//i, // Block Gopher
];

export interface UrlValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validates a URL to ensure it's safe to fetch (prevents SSRF attacks)
 */
export function validateUrl(url: string): UrlValidationResult {
  // Check if URL is provided
  if (!url || typeof url !== 'string') {
    return { isValid: false, error: 'URL is required' };
  }

  // Trim whitespace
  const trimmedUrl = url.trim();

  // Check URL format
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(trimmedUrl);
  } catch {
    return { isValid: false, error: 'Invalid URL format' };
  }

  // Only allow HTTP and HTTPS protocols
  if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
    return { isValid: false, error: 'Only HTTP and HTTPS URLs are allowed' };
  }

  // Check against blocked URL patterns
  for (const pattern of BLOCKED_URL_PATTERNS) {
    if (pattern.test(trimmedUrl)) {
      return { isValid: false, error: 'This URL is not allowed for security reasons' };
    }
  }

  // Check hostname against blocklist
  const hostname = parsedUrl.hostname.toLowerCase();
  if (BLOCKED_HOSTNAMES.includes(hostname)) {
    return { isValid: false, error: 'This URL is not allowed for security reasons' };
  }

  // Check if hostname is an IP address and validate against private ranges
  for (const pattern of PRIVATE_IP_RANGES) {
    if (pattern.test(hostname)) {
      return { isValid: false, error: 'URLs pointing to private IP addresses are not allowed' };
    }
  }

  // Prevent hostname that resolve to private IPs via DNS rebinding
  // Note: This is a basic check. For production, consider using a DNS resolver
  // to check the actual resolved IP before fetching.

  return { isValid: true };
}

/**
 * Validates a URL and throws an error if invalid
 */
export function assertValidUrl(url: string): void {
  const result = validateUrl(url);
  if (!result.isValid) {
    throw new Error(result.error);
  }
}
