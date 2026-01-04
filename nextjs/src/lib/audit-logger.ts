/**
 * Audit logging utility for tracking admin operations.
 * Logs are stored in Supabase for accountability and security monitoring.
 */

import { createClient } from '@supabase/supabase-js';
import { NextRequest } from 'next/server';

// Admin client for audit logging (uses service role)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export type AuditAction = 'CREATE' | 'UPDATE' | 'DELETE';

export type ResourceType =
  | 'whitelisted_emails'
  | 'site_settings'
  | 'cv_references'
  | 'share_links'
  | 'cv_versions';

export interface AuditLogEntry {
  userEmail: string;
  userId?: string;
  action: AuditAction;
  resourceType: ResourceType;
  resourceId?: string;
  details?: Record<string, unknown>;
  request?: NextRequest;
}

/**
 * Get client IP address from request headers.
 */
function getClientIP(request?: NextRequest): string | null {
  if (!request) return null;

  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }

  const cfIP = request.headers.get('cf-connecting-ip');
  if (cfIP) return cfIP;

  const realIP = request.headers.get('x-real-ip');
  if (realIP) return realIP;

  return null;
}

/**
 * Get truncated user agent from request.
 */
function getUserAgent(request?: NextRequest): string | null {
  if (!request) return null;

  const userAgent = request.headers.get('user-agent');
  if (!userAgent) return null;

  // Truncate to prevent storing excessively long strings
  return userAgent.slice(0, 500);
}

/**
 * Log an admin action to the audit log.
 * This function is async but doesn't need to be awaited - fire and forget.
 */
export async function logAuditEvent(entry: AuditLogEntry): Promise<void> {
  try {
    const { error } = await supabaseAdmin.from('audit_logs').insert({
      user_email: entry.userEmail,
      user_id: entry.userId || null,
      action: entry.action,
      resource_type: entry.resourceType,
      resource_id: entry.resourceId || null,
      details: entry.details || null,
      ip_address: getClientIP(entry.request),
      user_agent: getUserAgent(entry.request),
    });

    if (error) {
      // Structured error logging for monitoring systems (Vercel, Datadog, etc.)
      // Use a specific prefix so alerts can be configured
      console.error('[AUDIT_LOG_FAILURE]', JSON.stringify({
        action: entry.action,
        resourceType: entry.resourceType,
        resourceId: entry.resourceId,
        error: error.message || 'Unknown database error',
        timestamp: new Date().toISOString(),
      }));
    }
  } catch (err) {
    // Structured error logging for monitoring
    console.error('[AUDIT_LOG_FAILURE]', JSON.stringify({
      action: entry.action,
      resourceType: entry.resourceType,
      resourceId: entry.resourceId,
      error: err instanceof Error ? err.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }));
  }
}
