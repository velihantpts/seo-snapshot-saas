// Admin session helpers — HMAC-signed, expiring token stored in an httpOnly
// cookie. Uses Web Crypto so it works in both the Node route handler and (if
// ever needed) edge middleware. This replaces the previous client-only gate.

const encoder = new TextEncoder();

async function hmacHex(secret: string, data: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(data));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export const ADMIN_COOKIE = 'admin_session';

export async function createAdminToken(secret: string, ttlMs = 12 * 60 * 60 * 1000): Promise<string> {
  const payload = `admin.${Date.now() + ttlMs}`;
  const sig = await hmacHex(secret, payload);
  return `${payload}.${sig}`;
}

export async function verifyAdminToken(token: string | undefined | null, secret: string): Promise<boolean> {
  if (!token || !secret) return false;
  const lastDot = token.lastIndexOf('.');
  if (lastDot < 0) return false;
  const payload = token.slice(0, lastDot);
  const sig = token.slice(lastDot + 1);
  if (!payload.startsWith('admin.') || !sig) return false;

  const exp = Number(payload.slice('admin.'.length));
  if (!Number.isFinite(exp) || exp < Date.now()) return false;

  const expected = await hmacHex(secret, payload);
  return constantTimeEqual(sig, expected);
}

// Constant-time credential check. Comparing HMACs (equal length, same secret)
// avoids leaking the expected value's length or contents via timing.
export async function verifyCredential(secret: string, provided: string, expected: string): Promise<boolean> {
  const [a, b] = await Promise.all([hmacHex(secret, provided), hmacHex(secret, expected)]);
  return constantTimeEqual(a, b);
}
