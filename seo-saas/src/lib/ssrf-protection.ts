// SSRF Protection — blocks requests to internal/private networks
import { lookup } from 'node:dns/promises';

const PRIVATE_IP_PATTERNS = [
  /^127\./,                    // loopback
  /^10\./,                     // class A private
  /^172\.(1[6-9]|2\d|3[01])\./, // class B private
  /^192\.168\./,               // class C private
  /^169\.254\./,               // link-local
  /^0\./,                      // current network
  /^100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\./, // shared address space (CGNAT 100.64.0.0/10 -> 2nd octet 64-127)
  /^198\.1[89]\./,             // benchmark testing
  /^::1$/,                     // IPv6 loopback
  /^fc00:/i,                   // IPv6 private
  /^fe80:/i,                   // IPv6 link-local
];

const BLOCKED_HOSTNAMES = new Set([
  'localhost',
  'metadata.google.internal',
  'metadata',
  '169.254.169.254',
  '[::1]',
  'kubernetes.default',
  'kubernetes.default.svc',
]);

export function validateTargetURL(urlString: string): { valid: boolean; error?: string; url?: URL } {
  // Block non-HTTP protocols early (before URL parsing adds https://)
  const trimmed = urlString.trim().toLowerCase();
  if (trimmed.match(/^[a-z]+:/) && !trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
    return { valid: false, error: 'Only HTTP and HTTPS URLs are allowed' };
  }

  let url: URL;
  try {
    const input = trimmed.startsWith('http://') || trimmed.startsWith('https://') ? urlString.trim() : `https://${urlString.trim()}`;
    url = new URL(input);
  } catch {
    return { valid: false, error: 'Invalid URL format' };
  }

  // Double-check protocol after parsing
  if (!['http:', 'https:'].includes(url.protocol)) {
    return { valid: false, error: 'Only HTTP and HTTPS URLs are allowed' };
  }

  const hostname = url.hostname.toLowerCase();

  // Block known internal hostnames
  if (BLOCKED_HOSTNAMES.has(hostname)) {
    return { valid: false, error: 'Internal URLs are not allowed' };
  }

  // Block IPs in private ranges
  for (const pattern of PRIVATE_IP_PATTERNS) {
    if (pattern.test(hostname)) {
      return { valid: false, error: 'Private/internal IP addresses are not allowed' };
    }
  }

  // Block hostnames that look like internal services
  if (hostname.endsWith('.internal') || hostname.endsWith('.local') || hostname.endsWith('.localhost')) {
    return { valid: false, error: 'Internal hostnames are not allowed' };
  }

  // Block AWS/GCP/Azure metadata endpoints
  if (hostname.includes('metadata') && (hostname.includes('google') || hostname.includes('aws') || hostname.includes('azure'))) {
    return { valid: false, error: 'Cloud metadata endpoints are not allowed' };
  }

  return { valid: true, url };
}

// True if the given IP literal falls in a private/internal range.
export function isPrivateIP(ip: string): boolean {
  return PRIVATE_IP_PATTERNS.some((p) => p.test(ip));
}

// DNS-aware validation. Runs the synchronous hostname checks, then resolves the
// host and rejects if ANY resolved address is private/internal. This closes the
// DNS-rebinding gap (e.g. attacker.com → 169.254.169.254) that the string-only
// check in validateTargetURL cannot catch.
//
// NOTE: a residual TOCTOU window remains between this lookup and the socket
// connect performed by fetch(). For hardening beyond this, pin the resolved IP.
export async function validatePublicURL(
  urlString: string
): Promise<{ valid: boolean; error?: string; url?: URL }> {
  const base = validateTargetURL(urlString);
  if (!base.valid || !base.url) return base;

  // If the hostname is already an IP literal, validateTargetURL covered it.
  const hostname = base.url.hostname;
  try {
    const records = await lookup(hostname, { all: true });
    if (records.length === 0) {
      return { valid: false, error: 'Could not resolve host' };
    }
    for (const { address } of records) {
      if (isPrivateIP(address)) {
        return { valid: false, error: 'URL resolves to a private/internal IP address' };
      }
    }
  } catch {
    return { valid: false, error: 'Could not resolve host' };
  }

  return { valid: true, url: base.url };
}

// Fetch that re-validates the target on every redirect hop, following up to
// maxRedirects manually. Prevents an allowed public URL from bouncing (302) to
// an internal address. Returns the final response plus the visited chain.
export async function safeFetch(
  urlString: string,
  init: RequestInit = {},
  maxRedirects = 10
): Promise<{ response: Response; redirectChain: { url: string; status: number }[]; finalUrl: string }> {
  const redirectChain: { url: string; status: number }[] = [];
  let currentUrl = urlString;

  for (let i = 0; i <= maxRedirects; i++) {
    const check = await validatePublicURL(currentUrl);
    if (!check.valid || !check.url) {
      throw new Error(check.error || 'Blocked URL');
    }

    const res = await fetch(check.url.toString(), { ...init, redirect: 'manual' });
    redirectChain.push({ url: currentUrl, status: res.status });

    if (res.status >= 300 && res.status < 400) {
      const location = res.headers.get('location');
      if (!location) return { response: res, redirectChain, finalUrl: currentUrl };
      currentUrl = new URL(location, currentUrl).toString();
      continue;
    }
    return { response: res, redirectChain, finalUrl: currentUrl };
  }

  throw new Error('Too many redirects');
}
