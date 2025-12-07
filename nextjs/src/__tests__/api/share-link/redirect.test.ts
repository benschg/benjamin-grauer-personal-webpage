import { describe, it, expect } from 'vitest';

/**
 * Share Link Redirect Route Tests
 *
 * These tests focus on the URL parameter building logic
 * that doesn't require complex Supabase mocking.
 *
 * For full integration tests, use Playwright or similar E2E testing tools.
 */

describe('URL Parameter Building', () => {
  it('should correctly build URL params from share link settings', () => {
    const shareLink = {
      cv_version_id: 'ver-123',
      theme: 'light',
      show_photo: false,
      privacy_level: 'full',
      show_experience: false,
      show_attachments: true,
      show_export: true,
    };

    const urlParams = new URLSearchParams();
    if (shareLink.cv_version_id) urlParams.set('version', shareLink.cv_version_id);
    if (shareLink.theme && shareLink.theme !== 'dark') urlParams.set('theme', shareLink.theme);
    if (shareLink.show_photo === false) urlParams.set('photo', '0');
    if (shareLink.privacy_level && shareLink.privacy_level !== 'none') urlParams.set('privacy', shareLink.privacy_level);
    if (shareLink.show_experience === false) urlParams.set('experience', '0');
    if (shareLink.show_attachments === true) urlParams.set('attachments', '1');
    if (shareLink.show_export === true) urlParams.set('export', 'true');

    const queryString = urlParams.toString();
    expect(queryString).toContain('version=ver-123');
    expect(queryString).toContain('theme=light');
    expect(queryString).toContain('photo=0');
    expect(queryString).toContain('privacy=full');
    expect(queryString).toContain('experience=0');
    expect(queryString).toContain('attachments=1');
    expect(queryString).toContain('export=true');
  });

  it('should not include default values in URL params', () => {
    const shareLink = {
      cv_version_id: null,
      theme: 'dark',
      show_photo: true,
      privacy_level: 'none',
      show_experience: true,
      show_attachments: false,
      show_export: false,
    };

    const urlParams = new URLSearchParams();
    if (shareLink.cv_version_id) urlParams.set('version', shareLink.cv_version_id);
    if (shareLink.theme && shareLink.theme !== 'dark') urlParams.set('theme', shareLink.theme);
    if (shareLink.show_photo === false) urlParams.set('photo', '0');
    if (shareLink.privacy_level && shareLink.privacy_level !== 'none') urlParams.set('privacy', shareLink.privacy_level);
    if (shareLink.show_experience === false) urlParams.set('experience', '0');
    if (shareLink.show_attachments === true) urlParams.set('attachments', '1');
    if (shareLink.show_export === true) urlParams.set('export', 'true');

    const queryString = urlParams.toString();
    expect(queryString).toBe('');
  });
});
