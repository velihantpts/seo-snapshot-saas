// DNS-rebinding and redirect-SSRF protection. validateTargetURL (the string-only
// layer) is covered in validate-env.test.ts; this suite covers the parts that
// actually talk to DNS and follow redirects: isPrivateIP, validatePublicURL, and
// safeFetch.

jest.mock('node:dns/promises', () => ({ lookup: jest.fn() }));

import { lookup } from 'node:dns/promises';
import { isPrivateIP, validatePublicURL, safeFetch } from '../src/lib/ssrf-protection';

const mockLookup = lookup as unknown as jest.Mock;
// lookup(host, {all:true}) resolves an array of { address, family }.
const resolveTo = (...ips: string[]) =>
  mockLookup.mockResolvedValueOnce(ips.map((address) => ({ address, family: address.includes(':') ? 6 : 4 })));

beforeEach(() => {
  mockLookup.mockReset();
});

describe('isPrivateIP', () => {
  test('flags private / reserved ranges', () => {
    // Includes the CGNAT (100.64.0.0/10) boundaries: 100.64.x and 100.127.x are in-range.
    for (const ip of ['127.0.0.1', '10.0.0.1', '172.16.5.4', '172.31.255.255', '192.168.1.1', '169.254.169.254', '0.0.0.0', '100.64.0.1', '100.127.255.255', '::1', 'fc00::1', 'fe80::1']) {
      expect(isPrivateIP(ip)).toBe(true);
    }
  });

  test('allows genuine public IPs', () => {
    // 172.32.x is just outside the class-B private block; 100.128.x and 100.63.x fall
    // just outside the 100.64.0.0/10 CGNAT range (regression guard for the boundary fix).
    for (const ip of ['8.8.8.8', '1.1.1.1', '93.184.216.34', '172.32.0.1', '100.63.0.1', '100.128.0.1']) {
      expect(isPrivateIP(ip)).toBe(false);
    }
  });
});

describe('validatePublicURL (DNS-aware)', () => {
  test('allows a host that resolves to a public IP', async () => {
    resolveTo('93.184.216.34');
    const res = await validatePublicURL('https://example.com');
    expect(res.valid).toBe(true);
    expect(res.url?.hostname).toBe('example.com');
  });

  test('blocks DNS rebinding — public hostname resolving to a private IP', async () => {
    resolveTo('169.254.169.254');
    const res = await validatePublicURL('https://totally-legit.com');
    expect(res.valid).toBe(false);
    expect(res.error).toMatch(/private\/internal/i);
  });

  test('blocks when ANY resolved address is private (mixed A records)', async () => {
    resolveTo('93.184.216.34', '10.0.0.5');
    const res = await validatePublicURL('https://example.com');
    expect(res.valid).toBe(false);
  });

  test('rejects unresolvable hosts', async () => {
    mockLookup.mockRejectedValueOnce(new Error('ENOTFOUND'));
    const res = await validatePublicURL('https://does-not-exist.example');
    expect(res.valid).toBe(false);
    expect(res.error).toMatch(/could not resolve/i);
  });

  test('rejects hosts that resolve to nothing', async () => {
    mockLookup.mockResolvedValueOnce([]);
    const res = await validatePublicURL('https://empty.example');
    expect(res.valid).toBe(false);
  });

  test('still blocks literal private IPs without consulting DNS', async () => {
    const res = await validatePublicURL('http://192.168.1.1');
    expect(res.valid).toBe(false);
    expect(mockLookup).not.toHaveBeenCalled();
  });
});

describe('safeFetch (re-validates every redirect hop)', () => {
  const originalFetch = global.fetch;
  let mockFetch: jest.Mock;

  beforeEach(() => {
    mockFetch = jest.fn();
    global.fetch = mockFetch as unknown as typeof fetch;
  });
  afterAll(() => {
    global.fetch = originalFetch;
  });

  test('returns the response for a direct 200', async () => {
    resolveTo('93.184.216.34');
    mockFetch.mockResolvedValueOnce(new Response('ok', { status: 200 }));
    const { response, redirectChain } = await safeFetch('https://example.com');
    expect(response.status).toBe(200);
    expect(redirectChain).toHaveLength(1);
  });

  test('blocks a redirect that points at an internal IP', async () => {
    resolveTo('93.184.216.34'); // first hop resolves public
    mockFetch.mockResolvedValueOnce(
      new Response(null, { status: 302, headers: { location: 'http://169.254.169.254/latest/meta-data' } })
    );
    // The redirect target is a literal private IP, blocked before DNS is consulted.
    await expect(safeFetch('https://example.com')).rejects.toThrow(/private|internal|blocked/i);
  });

  test('follows an allowed redirect to another public host', async () => {
    resolveTo('93.184.216.34');
    resolveTo('93.184.216.35');
    mockFetch
      .mockResolvedValueOnce(new Response(null, { status: 301, headers: { location: 'https://example.org/final' } }))
      .mockResolvedValueOnce(new Response('done', { status: 200 }));
    const { response, redirectChain } = await safeFetch('https://example.com');
    expect(response.status).toBe(200);
    expect(redirectChain).toHaveLength(2);
  });

  test('gives up after too many redirects', async () => {
    // Every hop resolves public and 302s onward → exceeds the limit.
    mockLookup.mockResolvedValue([{ address: '93.184.216.34', family: 4 }]);
    mockFetch.mockResolvedValue(
      new Response(null, { status: 302, headers: { location: 'https://example.com/loop' } })
    );
    await expect(safeFetch('https://example.com', {}, 2)).rejects.toThrow(/too many redirects/i);
  });
});
