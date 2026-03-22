import { validateTargetURL } from '../src/lib/ssrf-protection';

describe('SSRF Protection - Extended', () => {
  // Basic valid URLs
  test('allows standard public URLs', () => {
    expect(validateTargetURL('https://example.com').valid).toBe(true);
    expect(validateTargetURL('https://google.com/search?q=test').valid).toBe(true);
    expect(validateTargetURL('http://example.org').valid).toBe(true);
    expect(validateTargetURL('https://sub.domain.example.com').valid).toBe(true);
  });

  // Localhost variants
  test('blocks all localhost variants', () => {
    expect(validateTargetURL('http://localhost').valid).toBe(false);
    expect(validateTargetURL('http://localhost:3000').valid).toBe(false);
    expect(validateTargetURL('http://127.0.0.1').valid).toBe(false);
    expect(validateTargetURL('http://127.0.0.1:8080').valid).toBe(false);
    expect(validateTargetURL('http://0.0.0.0').valid).toBe(false);
    expect(validateTargetURL('http://[::1]').valid).toBe(false);
  });

  // Private IP ranges
  test('blocks all private IP ranges', () => {
    expect(validateTargetURL('http://10.0.0.1').valid).toBe(false);
    expect(validateTargetURL('http://10.255.255.255').valid).toBe(false);
    expect(validateTargetURL('http://172.16.0.1').valid).toBe(false);
    expect(validateTargetURL('http://172.31.255.255').valid).toBe(false);
    expect(validateTargetURL('http://192.168.0.1').valid).toBe(false);
    expect(validateTargetURL('http://192.168.255.255').valid).toBe(false);
  });

  // Cloud metadata
  test('blocks cloud metadata endpoints', () => {
    expect(validateTargetURL('http://169.254.169.254/latest/meta-data').valid).toBe(false);
    expect(validateTargetURL('http://metadata.google.internal').valid).toBe(false);
  });

  // Protocol enforcement
  test('blocks non-HTTP protocols', () => {
    expect(validateTargetURL('ftp://example.com').valid).toBe(false);
    expect(validateTargetURL('file:///etc/passwd').valid).toBe(false);
    expect(validateTargetURL('javascript:alert(1)').valid).toBe(false);
    expect(validateTargetURL('data:text/html,<h1>hi</h1>').valid).toBe(false);
  });

  // Internal hostnames
  test('blocks internal/reserved hostnames', () => {
    expect(validateTargetURL('http://app.local').valid).toBe(false);
    expect(validateTargetURL('http://service.internal').valid).toBe(false);
    expect(validateTargetURL('http://api.localhost').valid).toBe(false);
  });

  // Auto-prepend
  test('auto-prepends https:// to bare domains', () => {
    const result = validateTargetURL('example.com');
    expect(result.valid).toBe(true);
    expect(result.url?.protocol).toBe('https:');
  });

  test('auto-prepends https:// to domains with path', () => {
    const result = validateTargetURL('example.com/page');
    expect(result.valid).toBe(true);
    expect(result.url?.pathname).toBe('/page');
  });

  // Edge cases
  test('rejects empty string', () => {
    expect(validateTargetURL('').valid).toBe(false);
  });

  test('rejects whitespace only', () => {
    expect(validateTargetURL('   ').valid).toBe(false);
  });

  test('rejects garbage input', () => {
    expect(validateTargetURL('not a url at all').valid).toBe(false);
  });

  test('allows URLs with query params', () => {
    const result = validateTargetURL('https://example.com/search?q=hello&page=2');
    expect(result.valid).toBe(true);
  });

  test('allows URLs with fragments', () => {
    const result = validateTargetURL('https://example.com/page#section');
    expect(result.valid).toBe(true);
  });

  test('allows URLs with ports on public domains', () => {
    const result = validateTargetURL('https://example.com:8080/api');
    expect(result.valid).toBe(true);
  });

  test('allows international domains', () => {
    const result = validateTargetURL('https://例え.jp');
    expect(result.valid).toBe(true);
  });
});
