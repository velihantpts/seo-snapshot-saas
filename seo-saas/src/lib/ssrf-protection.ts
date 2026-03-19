// SSRF Protection — blocks requests to internal/private networks

const PRIVATE_IP_PATTERNS = [
  /^127\./,                    // loopback
  /^10\./,                     // class A private
  /^172\.(1[6-9]|2\d|3[01])\./, // class B private
  /^192\.168\./,               // class C private
  /^169\.254\./,               // link-local
  /^0\./,                      // current network
  /^100\.(6[4-9]|[7-9]\d|1[0-2]\d)\./, // shared address space
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
