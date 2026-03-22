/**
 * SEO Analyzer Unit Tests
 *
 * Tests the core SEO analysis engine with known HTML inputs.
 * Run with: npx jest
 */

import { validateTargetURL } from '../src/lib/ssrf-protection';

// ===== SSRF Protection Tests =====
describe('SSRF Protection', () => {
  test('allows valid public URLs', () => {
    expect(validateTargetURL('https://example.com').valid).toBe(true);
    expect(validateTargetURL('https://google.com/search?q=test').valid).toBe(true);
    expect(validateTargetURL('http://example.org').valid).toBe(true);
  });

  test('blocks localhost', () => {
    expect(validateTargetURL('http://localhost').valid).toBe(false);
    expect(validateTargetURL('http://localhost:3000').valid).toBe(false);
    expect(validateTargetURL('http://127.0.0.1').valid).toBe(false);
    expect(validateTargetURL('http://127.0.0.1:8080').valid).toBe(false);
  });

  test('blocks private IPs', () => {
    expect(validateTargetURL('http://10.0.0.1').valid).toBe(false);
    expect(validateTargetURL('http://192.168.1.1').valid).toBe(false);
    expect(validateTargetURL('http://172.16.0.1').valid).toBe(false);
  });

  test('blocks cloud metadata endpoints', () => {
    expect(validateTargetURL('http://169.254.169.254/latest/meta-data').valid).toBe(false);
    expect(validateTargetURL('http://metadata.google.internal').valid).toBe(false);
  });

  test('blocks non-HTTP protocols', () => {
    expect(validateTargetURL('ftp://example.com').valid).toBe(false);
    expect(validateTargetURL('file:///etc/passwd').valid).toBe(false);
  });

  test('blocks internal hostnames', () => {
    expect(validateTargetURL('http://app.local').valid).toBe(false);
    expect(validateTargetURL('http://service.internal').valid).toBe(false);
    expect(validateTargetURL('http://api.localhost').valid).toBe(false);
  });

  test('auto-prepends https:// to bare domains', () => {
    const result = validateTargetURL('example.com');
    expect(result.valid).toBe(true);
    expect(result.url?.protocol).toBe('https:');
  });
});

// ===== URL Validation Edge Cases =====
describe('URL Validation Edge Cases', () => {
  test('handles empty string', () => {
    expect(validateTargetURL('').valid).toBe(false);
  });

  test('handles malformed URLs', () => {
    expect(validateTargetURL('not a url at all').valid).toBe(false);
  });

  test('handles URLs with auth', () => {
    const result = validateTargetURL('http://user:pass@example.com');
    expect(result.valid).toBe(true);
  });

  test('handles IPv6', () => {
    expect(validateTargetURL('http://[::1]').valid).toBe(false);
  });
});
